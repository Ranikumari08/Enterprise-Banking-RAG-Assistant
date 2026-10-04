import os
from groq import Groq
from typing import List, Dict, Any
from app.core.config import settings
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

    def generate_answer(self, query: str, context_chunks: List[Dict[str, Any]]) -> str:
        """Generate final answer using groq."""
        
        # Construct context block
        context_text = ""
        for idx, doc in enumerate(context_chunks):
            # We strip out explicit "Chunk" markers from the prompt to avoid AI leakage
            context_text += f"\n--- Relevant Bank Info ---\n{doc['text']}\n"
            
        system_prompt = f"""You are Apex AI, the helpful and professional Banking Assistant for Apex Global Bank.
Use ONLY the provided context to answer the user's question clearly and naturally. 
Do NOT mention phrases like "Chunk 1", "according to the context", or "based on the document" in your response. 
Synthesize the provided information into a seamless, conversational answer formatted with Markdown (bullet points, bold text).
If the information is not present in the context, you must politely refuse and state that you don't have that information.
Never guess or hallucinate banking rates or fees.

Context Data:
{context_text}
"""
        
        response = self.client.chat.completions.create(
            model=settings.llm_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query}
            ],
            temperature=settings.temperature,
        )
        
        return response.choices[0].message.content