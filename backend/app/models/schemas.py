"""
Pydantic schemas for API requests and responses
"""
from pydantic import BaseModel
from typing import Optional


class UploadResponse(BaseModel):
    """Response model for file upload"""
    message: str
    file_id: str
    file_type: str
    chunks_created: int


class AskRequest(BaseModel):
    """Request model for question answering"""
    question: str
    file_types: Optional[list[str]] = None  # If None, search all types


class AskResponse(BaseModel):
    """Response model for question answering"""
    answer: str
    sources: list[dict]  # List of source chunks with metadata

