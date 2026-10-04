"""
Guardrails and Confidence Scoring
"""
from typing import List, Dict, Any, Tuple
import re

class GuardrailService:
    @staticmethod
    def validate_input(query: str) -> bool:
        """Simple prompt injection/bad word check."""
        bad_words = ["ignore previous instructions", "forget context", "hack", "system prompt"]
        query_lower = query.lower()
        for word in bad_words:
            if word in query_lower:
                return False
        return True
        
    @staticmethod
    def _mask_numbers(text: str) -> str:
        """Mask potential PII numbers like SSN or CCs."""
        return re.sub(r'\b\d{4}-\d{4}-\d{4}-\d{4}\b', 'XXXX-XXXX-XXXX-XXXX', text)
    
    @staticmethod
    def validate_output(answer: str, avg_reranker_score: float, threshold: float = -5.0) -> Tuple[bool, str]:
        """Guard against hallucinations and PII in output."""
        if avg_reranker_score < threshold:
            return False, "I'm sorry, I could not find highly confident information for your request."
        
        masked_answer = GuardrailService._mask_numbers(answer)
        return True, masked_answer

    @staticmethod
    def calculate_confidence(retrieved_chunks: List[Dict[str, Any]]) -> float:
        """Produce a nominal confidence metric normalized roughly to [0,1]."""
        if not retrieved_chunks:
            return 0.0
            
        scores = [c.get("reranker_score", -10.0) for c in retrieved_chunks]
        avg_score = sum(scores) / len(scores)
        
        import math
        confidence = 1 / (1 + math.exp(-avg_score / 2.0))
        return min(max(confidence, 0.0), 1.0)
