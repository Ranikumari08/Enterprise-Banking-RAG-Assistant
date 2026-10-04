"""
Config adapter for Ingestion Pipeline to map the modern FastAPI Pydantic settings.
"""
from pathlib import Path
from app.core.config import settings

# Ingestion explicitly mapped paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Input/Output Directories
PDF_DIR = Path(settings.data_dir).resolve()
PROCESSED_DIR = Path(settings.processed_dir).resolve()

# Generated Files
PAGE_LEVEL_DATA_PATH = PROCESSED_DIR / "page_level_data.json"
CHUNKED_DATA_PATH = PROCESSED_DIR / "chunked_data.json"
EMBEDDED_DATA_PATH = PROCESSED_DIR / "embedded_data.json"

# Chroma Config
CHROMA_PERSIST_DIR = settings.chroma_persist_dir
CHROMA_COLLECTION = settings.chroma_collection
EMBEDDING_DIM = 384

# Chunking Config
CHUNK_SIZE_TOKENS = 250  #was 400
CHUNK_OVERLAP_TOKENS = 40  # was 80

# Embedding Config
EMBEDDING_MODEL = settings.embedding_model

# Metadata
VERSION: str = "v1"
SOURCE_TYPE: str = "pdf"
DOCUMENT_TYPE: str = "bank_policy"
