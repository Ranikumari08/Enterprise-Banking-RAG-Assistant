import json
import sys
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
from app.services.retrieval_service import RetrievalService
from app.services.reranker_service import RerankerService
from app.services.fusion import reciprocal_rank_fusion
from app.services.llm_service import LLMService

client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

def eval_faithfulness(question, answer, contexts):
    context_str = "\n\n".join(contexts)
    prompt = f"""
    Given the following Question, Answer, and Contexts, your task is to evaluate the Faithfulness of the Answer.
    Faithfulness measures if the Answer is completely derived from the Contexts and has no hallucinations.
    Output a score between 0 and 1, followed by a short reasoning. Format:
    Score: [0.0 - 1.0]
    Reasoning: [Explanation]
    
    Question: {question}
    Contexts: {context_str}
    Answer: {answer}
    """
    try:
        res = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            temperature=0.0
        )
        output = res.choices[0].message.content.strip()
        score_line = next((l for l in output.split("\n") if "Score:" in l), "Score: 0").strip()
        score = float(score_line.split(":")[1].strip())
        return score, output
    except Exception as e:
        return 0.0, str(e)

def eval_answer_relevancy(question, answer):
    prompt = f"""
    Given the following Question and Answer, your task is to evaluate the Answer Relevancy.
    Answer Relevancy measures how well the Answer addresses the Question, without giving redundant or off-topic information.
    Output a score between 0 and 1, followed by a short reasoning. Format:
    Score: [0.0 - 1.0]
    Reasoning: [Explanation]
    
    Question: {question}
    Answer: {answer}
    """
    try:
        res = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.0
        )
        output = res.choices[0].message.content.strip()
        score_line = next((l for l in output.split("\n") if "Score:" in l), "Score: 0").strip()
        score = float(score_line.split(":")[1].strip())
        return score, output
    except Exception as e:
        return 0.0, str(e)

def run_evaluation():
    if not os.path.exists('data/eval_qa.json'):
        print("data/eval_qa.json not found. Generate it first.")
        return
        
    with open('data/eval_qa.json', 'r', encoding='utf-8') as f:
        qa_data = json.load(f)
        
    retriever = RetrievalService()
    reranker = RerankerService()
    llm = LLMService()
    
    metrics = {
        "precision_at_k": [],
        "recall_at_k": [],
        "faithfulness": [],
        "answer_relevancy": []
    }
    
    print(f"Starting evaluation of {len(qa_data)} QA pairs...")
    
    for idx, item in enumerate(qa_data):
        query = item['question']
        gt_doc_id = item['ground_truth_doc_id']
        
        print(f"\n--- evaluating query {idx+1}/{len(qa_data)} ---")
        
        # 1. Retrieval
        vector_results = retriever.search_vector(query)
        bm25_results = retriever.search_bm25(query)
        hybrid_results = reciprocal_rank_fusion(vector_results, bm25_results)
        top_chunks = reranker.score_and_rank(query, hybrid_results)
        
        retrieved_doc_ids = [str(c.get("metadata", {}).get("doc_id", "")) for c in top_chunks]
        
        # calculate precision and recall @ K (assume k=len(top_chunks), usually 5 or 10)
        # relevant documents count = 1 (we only track the single ground truth doc for now)
        is_hit = gt_doc_id in retrieved_doc_ids
        precision = 1.0 / len(retrieved_doc_ids) if is_hit and len(retrieved_doc_ids) > 0 else 0.0
        recall = 1.0 if is_hit else 0.0
        
        metrics["precision_at_k"].append(precision)
        metrics["recall_at_k"].append(recall)
        
        print(f"Retrieval - Precision: {precision:.2f}, Recall: {recall:.2f}")
        
        # 2. Generation
        if len(top_chunks) == 0:
            answer = "I don't know."
        else:
            answer = llm.generate_answer(query, top_chunks)
            
        retrieved_contexts = [c.get("text", "") for c in top_chunks]
            
        # 3. LLM-as-a-judge Evaluations
        f_score, f_reason = eval_faithfulness(query, answer, retrieved_contexts)
        metrics["faithfulness"].append(f_score)
        print(f"Faithfulness Score: {f_score:.2f}")
        
        r_score, r_reason = eval_answer_relevancy(query, answer)
        metrics["answer_relevancy"].append(r_score)
        print(f"Answer Relevancy Score: {r_score:.2f}")

    # Summary
    print("\n\n===== EVALUATION SUMMARY =====")
    for m, values in metrics.items():
        avg = sum(values) / len(values) if values else 0
        print(f"Average {m}: {avg:.4f}")
        
    with open('data/eval_metrics_results.json', 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2)

if __name__ == "__main__":
    run_evaluation()
