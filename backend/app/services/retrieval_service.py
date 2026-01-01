"""
Retrieval service for querying and ranking results
"""
from typing import List, Dict
from app.repositories.faiss_repository import FAISSRepository
from app.services.openai_client import OpenAIClient


class RetrievalService:
    """Service for retrieving and ranking relevant chunks"""
    
    def __init__(self, faiss_repo: FAISSRepository, openai_client: OpenAIClient):
        """
        Initialize retrieval service
        
        Args:
            faiss_repo: FAISS repository instance
            openai_client: OpenAI client instance
        """
        self.faiss_repo = faiss_repo
        self.openai_client = openai_client
    
    def retrieve(
        self,
        query: str,
        file_types: List[str] = None,
        top_k: int = 5
    ) -> List[Dict]:
        """
        Retrieve relevant chunks for a query
        
        Args:
            query: Query string
            file_types: List of file types to search (None = search all)
            top_k: Number of results to return
            
        Returns:
            List of relevant chunks with metadata
        """
        # Generate query embedding
        query_embeddings = self.openai_client.generate_embeddings([query])
        query_embedding = query_embeddings[0]
        
        # Search FAISS indexes
        results = self.faiss_repo.search(
            query_embedding=query_embedding,
            file_types=file_types,
            k=top_k
        )
        
        return results

