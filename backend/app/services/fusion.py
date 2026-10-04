"""
RRF (Reciprocal Rank Fusion) Logic for combining Hybrid Search
"""
from typing import List, Dict, Any
from app.core.config import settings

def reciprocal_rank_fusion(vector_results: List[Dict], bm25_results: List[Dict], k: int = 60) -> List[Dict]:
    """Merge Vector and BM25 results using Reciprocal Rank Fusion."""
    fused_scores = {}
    docs = {}
    
    # Process vector
    for rank, item in enumerate(vector_results):
        doc_id = item["id"]
        if doc_id not in fused_scores:
            fused_scores[doc_id] = 0.0
            docs[doc_id] = item
        fused_scores[doc_id] += 1.0 / (k + rank + 1)
        
    # Process BM25
    for rank, item in enumerate(bm25_results):
        doc_id = item["id"]
        if doc_id not in fused_scores:
            fused_scores[doc_id] = 0.0
            # If a doc was only found in BM25, we enrich missing chroma metadata
            # For simplicity, we only carry over what we have
            docs[doc_id] = {"id": doc_id, "text": item["text"], "metadata": {}}
        fused_scores[doc_id] += 1.0 / (k + rank + 1)
        
    # Sort descending
    sorted_docs = sorted(docs.values(), key=lambda doc: fused_scores[doc["id"]], reverse=True)
    
    # Return Top K Hybrid Fusion
    return sorted_docs[:settings.top_k_fusion]
