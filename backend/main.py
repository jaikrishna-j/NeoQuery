"""
NeoQuery Backend - FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import upload, ask, health

app = FastAPI(
    title="NeoQuery API",
    description="RAG Chatbot API with multi-format file ingestion",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(upload.router, tags=["upload"])
app.include_router(ask.router, tags=["ask"])


@app.get("/")
async def root():
    return {"message": "NeoQuery API", "version": "1.0.0"}

