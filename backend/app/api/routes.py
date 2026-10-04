from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.monitoring_service import Monitoring
from app.services.retrieval_service import RetrievalService
from app.services.fusion import reciprocal_rank_fusion
from app.services.reranker_service import RerankerService
from app.services.llm_service import LLMService
from app.services.guardrail_service import GuardrailService
from app.core.config import settings

router = APIRouter()

# Dependency Generators
def get_retrieval_service() -> RetrievalService:
    return RetrievalService()

def get_reranker_service() -> RerankerService:
    return RerankerService()

def get_llm_service() -> LLMService:
    return LLMService()

def get_guardrail_service() -> GuardrailService:
    return GuardrailService()

@router.post("/chat", response_model=ChatResponse)
def handle_chat_query(
    req: ChatRequest,
    retriever: RetrievalService = Depends(get_retrieval_service),
    reranker: RerankerService = Depends(get_reranker_service),
    llm: LLMService = Depends(get_llm_service),
    guardrails: GuardrailService = Depends(get_guardrail_service)
):
    logger = Monitoring.get_logger()
    logger.info(f"Received query from {req.user_id}: {req.query}")

    # 1. Monitoring Root Trace
    langfuse = Monitoring.get_langfuse()
    
    with langfuse.start_as_current_observation(
        as_type="span",
        name="banking-rag-query",
        input={"query": req.query},
    ) as root_span:
        #root_span.update_trace(user_id=req.user_id)

        # 2. Input Validation (Guardrails)
        if not guardrails.validate_input(req.query):
            raise HTTPException(status_code=400, detail="Invalid Query. Blocked by security guardrails.")

        with langfuse.start_as_current_observation(
            as_type="span",
            name="retrieval",
            input={"query": req.query},
        ) as span:
            # 3. Dense & Sparse Retrieval
            vector_results = retriever.search_vector(req.query)
            bm25_results = retriever.search_bm25(req.query)

            # 4. Hybrid Fusion (RRF)
            hybrid_results = reciprocal_rank_fusion(vector_results, bm25_results)
            span.update(output={"num_dense": len(vector_results), "num_sparse": len(bm25_results), "num_fused": len(hybrid_results)})

        with langfuse.start_as_current_observation(
            as_type="span",
            name="reranking",
            input={"num_docs": len(hybrid_results)},
        ) as span:
            # 5. Cross-Encoder Re-Ranking
            top_chunks = reranker.score_and_rank(req.query, hybrid_results)
            span.update(output={"num_top_chunks": len(top_chunks)})

        if not top_chunks:
            answer = "I do not have enough context to answer that."
            root_span.update(output={"final_answer": answer})
            return ChatResponse(
                answer=answer,
                sources=[],
                confidence=0.0
            )

        # 6. Guardrails Output Validations
        avg_score = sum([c.get("reranker_score", 0.0) for c in top_chunks]) / len(top_chunks)
        valid, safe_eval = guardrails.validate_output(answer="", avg_reranker_score=avg_score, threshold=settings.reranker_threshold)
        
        if not valid:
             root_span.update(output={"final_answer": safe_eval, "rejected": True})
             return ChatResponse(
                answer=safe_eval,
                sources=[],
                confidence=0.0
            )

        with langfuse.start_as_current_observation(
            as_type="generation",
            name="llm_call",
            model=settings.llm_model,
            input={"query": req.query, "context_length": len(top_chunks)},
        ) as span:
            # 7. LLM Call
            raw_answer = llm.generate_answer(req.query, top_chunks)
            span.update(output={"answer_length": len(raw_answer)})
        
        # 8. Clean up outputs
        valid, final_answer = guardrails.validate_output(answer=raw_answer, avg_reranker_score=avg_score)
        confidence = guardrails.calculate_confidence(top_chunks)
        
        # Collect sources
        sources = []
        for chunk in top_chunks:
             keys = chunk.get("metadata", {})
             sources.append({
                 "doc_id": str(keys.get("doc_id", "Unknown")),
                 "page": str(keys.get("page_number_range", "Unknown")),
                 "score": float(chunk.get("reranker_score", 0.0)),
                 "chunk_text": str(chunk.get("text", ""))
             })

        root_span.update(output={"final_answer": final_answer, "confidence": confidence})

        return ChatResponse(
            answer=final_answer,
            sources=sources,
            confidence=confidence
        )