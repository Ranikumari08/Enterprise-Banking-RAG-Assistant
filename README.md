# Apex Global Bank - Modern Banking RAG Application

Welcome to the **Apex Global Bank** repository! This project constitutes a full-stack, enterprise-grade banking application leveraging Retrieval-Augmented Generation (RAG) to power an intelligent AI Chatbot.

## 🚀 Project Overview

The architecture is split into two primary domains:

- **Frontend** (`/frontend`): A stunning, modern React application built with Vite, TailwindCSS, and React Router. It perfectly emulates a high-end banking portal (complete with application forms, service overviews, and the AI widget).
- **Backend** (`/backend`): A robust Python orchestration engine built on FastAPI, utilizing LangGraph for multi-layered RAG routing, ChromaDB for hybrid dense/semantic retrieval, and Langfuse for production tracing. 

---

## 📊 RAG Evaluation — RAGAS Metrics

The chatbot was evaluated using the **RAGAS framework** on a curated golden dataset 
of **300 question-answer pairs** derived from 10 official Apex Global Bank policy documents.

### Evaluation Setup

| Component | Details |
|---|---|
| Framework | RAGAS v0.1.21 |
| Golden Dataset | 300 QA pairs across 10 banking PDFs |
| Question Types | Simple factual, reasoning, multi-document, edge cases |
| Judge LLM | Groq Llama 3.3 70B |
| Embedding Model | all-MiniLM-L6-v2 (HuggingFace) |
| Documents Covered | Savings Account, KYC, Credit Card, Debit Card, Charges, Grievance, RBI Compliance, Account Closure, Minimum Balance, Bank FAQs |

### RAGAS Scores

| Metric | Score | What It Measures |
|---|---|---|
| **Faithfulness** | **0.81** | Is the answer grounded in retrieved context? (no hallucination) |
| **Answer Relevancy** | **0.76** | Does the answer actually address the question asked? |
| **Context Precision** | **0.72** | Are the retrieved chunks relevant to the question? |
| **Context Recall** | **0.68** | Did retrieval fetch all information needed to answer? |

### Score Interpretation


### Evaluation by Category

| Category | Faithfulness | Context Recall | Weakness |
|---|---|---|---|
| Savings Account | 0.85 | 0.74 | None significant |
| Credit Card | 0.82 | 0.71 | Complex eligibility tables |
| KYC & CDD | 0.78 | 0.65 | Multi-step process questions |
| Charges & Fees | 0.88 | 0.76 | None significant |
| Grievance Redressal | 0.74 | 0.62 | Escalation hierarchy queries |
| RBI Compliance | 0.71 | 0.58 | Broad policy questions |

### Key Findings & Improvements Made

- **Low Context Recall on complex queries** → identified that multi-document 
  questions spanning 2+ PDFs had lower recall; addressed by tuning hybrid 
  search weights and increasing chunk overlap from 80 to 100 tokens

- **Faithfulness drop on fee-related queries** → caused by chunk size (400 tokens) 
  bundling multiple fee values together; mitigated by reducing to 250 tokens 
  with semantic separators

- **Confidence score range: 50–61%** → traced to irrelevant chunks being passed 
  to LLM alongside relevant ones; addressed by implementing Dynamic Top-K 
  selection based on reranker score threshold of 0.45

### How to Reproduce Evaluation

```bash
# Step 1 — Run pipeline to collect chatbot answers
cd evaluation
python run_pipeline.py

# Step 2 — Run RAGAS evaluation
python evaluate.py

# Results saved to
evaluation/results/ragas_scores.csv
```

## 🛠️ Tech Stack

**Frontend**:
- React 18, Vite
- TailwindCSS, Lucide Icons, Markdown Parsers
- Axios

**Backend**:
- FastAPI, Uvicorn, Pydantic
- LangGraph (Agent Orchestration)
- ChromaDB (Vector Search), BM25 (Keyword Search)
- Langfuse v3 (LLM Tracing & Observability)
- Groq / `llama3-8b-8192` (LLM Generation)

---

## 📂 Project Structure

```text
Bank_Project/
├── backend/                   # Python FastAPI & LangGraph Backend
│   ├── app/                   # Core application logic (API routes, Config)
│   ├── chroma_db/             # Local Vector DB persist directory
│   ├── data/                  # Raw PDF documents & Evaluation QA datasets
│   ├── ingestion/             # LangGraph Offline chunking & embedding pipeline
│   ├── processed/             # Output directory for parsed text chunks
│   ├── requirements.txt       # Python Dependencies
│   └── tests/                 # Backend evaluation and metric scripts
│
└── frontend/                  # React & Vite Frontend
    ├── public/                # Static assets
    ├── src/
    │   ├── components/        # Reusable UI (Chatbot.jsx, Navbar.jsx, ServiceCard.jsx)
    │   ├── pages/             # Route specific pages (Home.jsx, About.jsx, Application.jsx)
    │   ├── App.jsx            # Main React Router definitions
    │   └── index.css          # Tailwind styling and custom blob animations
    ├── index.html             # Application mounting point
    ├── tailwind.config.js     # Custom banking color themes
    └── package.json           # Node Dependencies
```

---

## 🔑 Environment Variables Setup

Before running the backend, you must configure your `.env` variables inside the `backend/` directory. Create a `.env` file (`backend/.env`) specifying the following:

```env
# ====== LLM Provider ======
# Get this from https://console.groq.com/
GROQ_API_KEY=gsk_your_groq_api_key_here

# ====== Langfuse Tracing ======
# Get this from https://cloud.langfuse.com/
LANGFUSE_PUBLIC_KEY=pk-lf-your_public_key
LANGFUSE_SECRET_KEY=sk-lf-your_secret_key
LANGFUSE_HOST=https://us.cloud.langfuse.com # Or https://cloud.langfuse.com for EU

# ====== Vector DB ======
CHROMA_PERSIST_DIRECTORY=./chroma_db

# ====== Model Configuration ======
LLM_MODEL=llama3-8b-8192
EMBEDDING_MODEL=all-MiniLM-L6-v2
```

---

## ⚡ Quick Start Variables

### 1. Running the Backend Server
Navigate to the backend directory and launch the FastAPI Uvicorn server:
```bash
cd backend
# With standard Python venv:
source .venv/bin/activate
uv add -r requirements.txt
python -m uvicorn app.main:app --reload

# Or if you use uv:
uv sync
uv run uvicorn app.main:app --reload
```
*The backend API will mount at `http://localhost:8000/api/v1/chat`.*

### 2. Running the Frontend Portal
In a new terminal, launch the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend Bank Portal will open on `http://localhost:5173`.*

---

## 📊 Features & Architecture

1. **Hybrid Retrieval**: The backend runs multi-path RAG logic using both dense embeddings (ChromaDB) and sparse retrieval (BM25), fused together using Reciprocal Rank Fusion (RRF).
2. **LangGraph State Management**: The banking agent accurately routes inquiries between context-search states and response states.
3. **Markdown-Ready UI**: The frontend Chatbot automatically safely parses and structures LLM text chunks using custom regex and React components, perfectly formatting bulleted lists and bolded text without risking ESM module crashes.
4. **Langfuse Telemetry**: End-to-end trace tracking on every RAG query for observability.
