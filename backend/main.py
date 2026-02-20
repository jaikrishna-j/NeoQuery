"""
NeoQuery Backend - FastAPI Application
"""
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env file from backend directory
backend_dir = Path(__file__).parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

from app.routers import upload, ask, health

app = FastAPI(
    title="NeoQuery API",
    description="RAG Chatbot API with multi-format file ingestion",
    version="1.0.0"
)

# CORS configuration - allow frontend origin from environment variable
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins == "*":
    # When using wildcard, cannot use allow_credentials=True
    origins = ["*"]
    allow_creds = False
else:
    # Split comma-separated origins and strip whitespace
    origins = [origin.strip().rstrip("/") for origin in allowed_origins.split(",")]
    allow_creds = True

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_creds,
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

