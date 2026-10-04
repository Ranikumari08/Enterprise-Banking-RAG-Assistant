"""
Retriever Module handling Chroma Vector DB & Whoosh BM25 Lexical DB.
"""
from typing import List, Dict, Any
from pathlib import Path
from sentence_transformers import SentenceTransformer
from whoosh.index import open_dir, create_in, exists_in
from whoosh.fields import Schema, TEXT, ID
from whoosh.qparser import QueryParser

from app.core.config import settings
from app.services.monitoring_service import Monitoring
from app.db.chroma_client import chroma_client

logger = Monitoring.get_logger()

class RetrievalService:
    def __init__(self):
        # 1. Init ChromaDB via Wrapper Component
        self.chroma_client = chroma_client.get_client()
        try:
            self.collection = self.chroma_client.get_collection(settings.chroma_collection)
            logger.info("ChromaDB Index Loaded.")
        except Exception as e:
            logger.error(f"Failed to load ChromaDB collection. Has ingestion run? {e}")
            self.collection = None
            
        # 2. Init Embedding model
        self.embedding_model = SentenceTransformer(settings.embedding_model)
        
        # 3. Init BM25 Whoosh
        self.whoosh_dir = Path(settings.whoosh_index_dir)
        self._ensure_whoosh_index()

    def _ensure_whoosh_index(self):
        """Construct a lightweight BM25 Whoosh index from the Chroma DB documents if not exists."""
        schema = Schema(doc_id=ID(stored=True, unique=True), content=TEXT(stored=True))
        
        if not self.whoosh_dir.exists():
            self.whoosh_dir.mkdir(parents=True)
            
        if not exists_in(str(self.whoosh_dir)):
            ix = create_in(str(self.whoosh_dir), schema)
            writer = ix.writer()
            
            # Sync documents from chroma to whoosh
            if self.collection:
                all_docs = self.collection.get()
                ids = all_docs.get("ids", [])
                docs = all_docs.get("documents", [])
                for idx, text in zip(ids, docs):
                    writer.add_document(doc_id=str(idx), content=text)
            writer.commit()
            logger.info("BM25 Whoosh Index Constructed from ChromaDB records.")
        
        self.ix = open_dir(str(self.whoosh_dir))

    def search_vector(self, query: str) -> List[Dict[str, Any]]:
        """Vector similarity search (dense)"""
        if not self.collection:
            return []
            
        vector = self.embedding_model.encode([query])[0].tolist()
        results = self.collection.query(
            query_embeddings=[vector],
            n_results=settings.top_k_vector
        )
        
        formatted_results = []
        for ids, dists, docs, metas in zip(results.get("ids", []), results.get("distances", []), results.get("documents", []), results.get("metadatas", [])):
            for i in range(len(ids)):
                formatted_results.append({
                    "id": ids[i],
                    "text": docs[i],
                    "metadata": metas[i],
                    "distance": dists[i]
                })
        return formatted_results

    def search_bm25(self, query: str) -> List[Dict[str, Any]]:
        """Lexical search using BM25 via Whoosh"""
        formatted_results = []
        with self.ix.searcher() as searcher:
            q = QueryParser("content", self.ix.schema).parse(query)
            results = searcher.search(q, limit=settings.top_k_bm25)
            
            for rank, r in enumerate(results):
                formatted_results.append({
                    "id": r["doc_id"],
                    "text": r["content"],
                    "score": r.score,
                    "bm25_rank": rank
                })
        return formatted_results