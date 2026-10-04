"""
Logging & Langfuse Monitoring Setup
Monitors traces via the v3 Langfuse client.
"""
from langfuse import get_client
import logging
import os
from app.core.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s")
logger = logging.getLogger("rag_backend")

# Ensure environment variables are set before get_client is called, or pass them if needed
# get_client() automatically looks for LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, LANGFUSE_HOST
os.environ["LANGFUSE_PUBLIC_KEY"] = settings.langfuse_public_key or os.environ.get("LANGFUSE_PUBLIC_KEY") or "dummy"
os.environ["LANGFUSE_SECRET_KEY"] = settings.langfuse_secret_key or os.environ.get("LANGFUSE_SECRET_KEY") or "dummy"
os.environ["LANGFUSE_HOST"] = settings.langfuse_host or os.environ.get("LANGFUSE_HOST", "http://localhost:3000")

langfuse = get_client()

class Monitoring:
    @staticmethod
    def get_logger() -> logging.Logger:
        return logger

    @staticmethod
    def get_langfuse():
        return langfuse
