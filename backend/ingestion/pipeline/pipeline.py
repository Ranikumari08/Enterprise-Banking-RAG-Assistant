"""
Step 6 — LangGraph Orchestration Pipeline
Defines a stateful graph that runs the full ingestion pipeline:
  extract → clean → merge → chunk → embed → store
"""

import hashlib
import json
import logging
from pathlib import Path
from typing import Any, TypedDict

from langgraph.graph import StateGraph, END

from ingestion.config import PDF_DIR, PROCESSED_DIR
from ingestion.pipeline.extract import extract_all_pdfs
from ingestion.pipeline.clean import clean_pages, merge_text_and_tables
from ingestion.pipeline.chunk import chunk_all_documents
from ingestion.pipeline.embed import generate_embeddings
from ingestion.pipeline.store import store_in_chroma

logger = logging.getLogger(__name__)

# ── File-level dedup tracking ───────────────────────────────────────────
HASH_FILE = PROCESSED_DIR / ".file_hashes.json"


def _compute_file_hash(path: Path) -> str:
    """Compute MD5 hash of a file for change detection."""
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def _load_hashes() -> dict[str, str]:
    """Load previously stored file hashes."""
    if HASH_FILE.exists():
        with open(HASH_FILE, "r") as f:
            return json.load(f)
    return {}


def _save_hashes(hashes: dict[str, str]) -> None:
    """Save current file hashes."""
    HASH_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(HASH_FILE, "w") as f:
        json.dump(hashes, f, indent=2)


def _get_new_or_changed_files(pdf_dir: Path) -> list[Path]:
    """Return PDFs that are new or have changed since last run."""
    old_hashes = _load_hashes()
    current_files = sorted(pdf_dir.glob("*.pdf"))
    new_hashes: dict[str, str] = {}
    changed: list[Path] = []

    for pdf in current_files:
        file_hash = _compute_file_hash(pdf)
        new_hashes[pdf.name] = file_hash
        if old_hashes.get(pdf.name) != file_hash:
            changed.append(pdf)

    _save_hashes(new_hashes)
    return changed


# ── Pipeline State ──────────────────────────────────────────────────────

class PipelineState(TypedDict):
    """State that flows through the LangGraph pipeline."""
    pdf_dir: str
    pages: list[dict[str, Any]]
    cleaned_pages: list[dict[str, Any]]
    merged_pages: list[dict[str, Any]]
    chunks: list[dict[str, Any]]
    embedded: list[dict[str, Any]]
    chroma_count: int
    errors: list[str]
    stats: dict[str, Any]


# ── Pipeline Nodes ──────────────────────────────────────────────────────

def extract_documents(state: PipelineState) -> dict[str, Any]:
    """Node 1: Extract text and tables from all PDFs."""
    logger.info("═══ Step 1: Extracting documents ═══")
    try:
        pdf_dir = Path(state["pdf_dir"])
        pages = extract_all_pdfs(pdf_dir)
        return {
            "pages": pages,
            "stats": {
                **state.get("stats", {}),
                "total_pages_extracted": len(pages),
                "total_documents": len(set(p["file_name"] for p in pages)),
            },
        }
    except Exception as e:
        logger.error(f"Extraction failed: {e}")
        return {"errors": state.get("errors", []) + [f"extract: {str(e)}"]}


def clean_pages_node(state: PipelineState) -> dict[str, Any]:
    """Node 2: Clean and normalize extracted pages."""
    logger.info("═══ Step 2: Cleaning pages ═══")
    try:
        cleaned = clean_pages(state["pages"])
        return {
            "cleaned_pages": cleaned,
            "stats": {
                **state.get("stats", {}),
                "pages_after_cleaning": len(cleaned),
            },
        }
    except Exception as e:
        logger.error(f"Cleaning failed: {e}")
        return {"errors": state.get("errors", []) + [f"clean: {str(e)}"]}


def merge_tables_node(state: PipelineState) -> dict[str, Any]:
    """Node 3: Merge text and table content."""
    logger.info("═══ Step 3: Merging tables with text ═══")
    try:
        merged = merge_text_and_tables(state["cleaned_pages"])
        return {"merged_pages": merged}
    except Exception as e:
        logger.error(f"Merge failed: {e}")
        return {"errors": state.get("errors", []) + [f"merge: {str(e)}"]}


def chunk_documents_node(state: PipelineState) -> dict[str, Any]:
    """Node 4: Chunk documents with table awareness."""
    logger.info("═══ Step 4: Chunking documents ═══")
    try:
        chunks = chunk_all_documents(state["merged_pages"])
        return {
            "chunks": chunks,
            "stats": {
                **state.get("stats", {}),
                "total_chunks": len(chunks),
                "chunks_with_tables": sum(
                    1 for c in chunks if c["metadata"].get("contains_table")
                ),
            },
        }
    except Exception as e:
        logger.error(f"Chunking failed: {e}")
        return {"errors": state.get("errors", []) + [f"chunk: {str(e)}"]}


def generate_embeddings_node(state: PipelineState) -> dict[str, Any]:
    """Node 5: Generate embeddings for all chunks."""
    logger.info("═══ Step 5: Generating embeddings ═══")
    try:
        embedded = generate_embeddings(state["chunks"])
        return {
            "embedded": embedded,
            "stats": {
                **state.get("stats", {}),
                "embeddings_generated": len(embedded),
                "embedding_dim": len(embedded[0]["vector"]) if embedded else 0,
            },
        }
    except Exception as e:
        logger.error(f"Embedding failed: {e}")
        return {"errors": state.get("errors", []) + [f"embed: {str(e)}"]}


def store_in_chroma_node(state: PipelineState) -> dict[str, Any]:
    """Node 6: Store embeddings in Chroma."""
    logger.info("═══ Step 6: Storing in Chroma ═══")
    try:
        count = store_in_chroma(state["embedded"])
        return {
            "chroma_count": count,
            "stats": {
                **state.get("stats", {}),
                "chroma_records_stored": count,
            },
        }
    except Exception as e:
        logger.error(f"Chroma storage failed: {e}")
        return {"errors": state.get("errors", []) + [f"store: {str(e)}"]}


# ── Build Graph ─────────────────────────────────────────────────────────

def build_pipeline() -> StateGraph:
    """Build the LangGraph pipeline."""
    graph = StateGraph(PipelineState)

    # Add nodes
    graph.add_node("extract_documents", extract_documents)
    graph.add_node("clean_pages", clean_pages_node)
    graph.add_node("merge_tables_with_text", merge_tables_node)
    graph.add_node("chunk_documents", chunk_documents_node)
    graph.add_node("generate_embeddings", generate_embeddings_node)
    graph.add_node("store_in_chroma", store_in_chroma_node)

    # Define edges (linear pipeline)
    graph.set_entry_point("extract_documents")
    graph.add_edge("extract_documents", "clean_pages")
    graph.add_edge("clean_pages", "merge_tables_with_text")
    graph.add_edge("merge_tables_with_text", "chunk_documents")
    graph.add_edge("chunk_documents", "generate_embeddings")
    graph.add_edge("generate_embeddings", "store_in_chroma")
    graph.add_edge("store_in_chroma", END)

    return graph


def run_pipeline(pdf_dir: Path | None = None) -> PipelineState:
    """Build and execute the full ingestion pipeline."""
    pdf_dir = pdf_dir or PDF_DIR

    logger.info("╔══════════════════════════════════════════╗")
    logger.info("║  Banking RAG Ingestion Pipeline          ║")
    logger.info("╚══════════════════════════════════════════╝")

    # Check for new/changed files
    changed = _get_new_or_changed_files(pdf_dir)
    if not changed:
        logger.info("No new or changed PDFs detected. Skipping ingestion.")
        return PipelineState(
            pdf_dir=str(pdf_dir),
            pages=[],
            cleaned_pages=[],
            merged_pages=[],
            chunks=[],
            embedded=[],
            chroma_count=0,
            errors=[],
            stats={"skipped": True, "reason": "no_changes"},
        )

    logger.info(f"Processing {len(changed)} new/changed PDF(s):")
    for f in changed:
        logger.info(f"  • {f.name}")

    # Initial state
    initial_state: PipelineState = PipelineState(
        pdf_dir=str(pdf_dir),
        pages=[],
        cleaned_pages=[],
        merged_pages=[],
        chunks=[],
        embedded=[],
        chroma_count=0,
        errors=[],
        stats={},
    )

    # Build and run
    graph = build_pipeline()
    app = graph.compile()
    final_state = app.invoke(initial_state)

    # Log results
    stats = final_state.get("stats", {})
    errors = final_state.get("errors", [])

    logger.info("╔══════════════════════════════════════════╗")
    logger.info("║  Pipeline Complete                       ║")
    logger.info("╚══════════════════════════════════════════╝")
    for key, val in stats.items():
        logger.info(f"  {key}: {val}")

    if errors:
        logger.warning(f"  ⚠ Errors: {errors}")

    return final_state