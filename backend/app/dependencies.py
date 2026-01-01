"""
Dependency injection for FastAPI
"""
from functools import lru_cache
from app.repositories.faiss_repository import FAISSRepository
from app.services.openai_client import OpenAIClient
from app.services.retrieval_service import RetrievalService
from app.services.upload_service import UploadService
from app.services.ask_service import AskService


@lru_cache()
def get_faiss_repository() -> FAISSRepository:
    """Get FAISS repository instance (singleton)"""
    return FAISSRepository()


@lru_cache()
def get_openai_client() -> OpenAIClient:
    """Get OpenAI client instance (singleton)"""
    return OpenAIClient()


def get_retrieval_service() -> RetrievalService:
    """Get retrieval service instance"""
    return RetrievalService(
        faiss_repo=get_faiss_repository(),
        openai_client=get_openai_client()
    )


def get_upload_service() -> UploadService:
    """Get upload service instance"""
    return UploadService(
        faiss_repo=get_faiss_repository(),
        openai_client=get_openai_client()
    )


def get_ask_service() -> AskService:
    """Get ask service instance"""
    return AskService(
        retrieval_service=get_retrieval_service(),
        openai_client=get_openai_client()
    )

