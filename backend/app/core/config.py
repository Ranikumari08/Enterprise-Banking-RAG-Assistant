from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # Vector DB
    chroma_persist_dir: str = "data/chroma_db"
    chroma_collection: str = "bank_documents"
    
    # BM25 Index
    whoosh_index_dir: str = "data/whoosh_index"
    
    # Raw and Processed Data Paths
    data_dir: str = "data/raw"
    processed_dir: str = "data/processed"
    
    # LLM
    groq_api_key: str = ""
    llm_model: str = "openai/gpt-oss-120b"
    temperature: float = 0.2
    
    # Reranking
    reranker_model: str = "BAAI/bge-reranker-base"
    reranker_threshold: float = -2.0
    
    # Retrieval
    top_k_vector: int = 10
    top_k_bm25: int = 10
    top_k_fusion: int = 15
    top_k_rerank: int = 5
    
    # Embedding Model
    embedding_model: str = "all-MiniLM-L6-v2"
    
    # Langfuse
    langfuse_public_key: str = ""
    langfuse_secret_key: str = ""
    langfuse_host: str = "https://cloud.langfuse.com"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()