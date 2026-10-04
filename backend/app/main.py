"""
FastAPI Server Core Application.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router
from app.core.config import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title="Banking RAG API",
        description="Hybrid Online Query Layer for Banking Domain RAG",
        version="1.0.0",
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(api_router, prefix="/api/v1")
    return app

app = create_app()

@app.on_event("shutdown")
def shutdown():
    from langfuse import get_client
    langfuse = get_client()
    langfuse.flush()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)