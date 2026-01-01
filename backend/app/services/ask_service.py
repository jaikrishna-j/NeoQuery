"""
Ask service for question answering
"""
from typing import List, Dict
from app.services.retrieval_service import RetrievalService
from app.services.openrouter_client import OpenRouterClient


class AskService:
    """Service for generating answers from retrieved context"""
    
    def __init__(self, retrieval_service: RetrievalService, openai_client: OpenRouterClient):
        """
        Initialize ask service
        
        Args:
            retrieval_service: Retrieval service instance
            openai_client: OpenRouter client instance
        """
        self.retrieval_service = retrieval_service
        self.openai_client = openai_client
    
    def answer_question(
        self,
        question: str,
        file_types: List[str] = None,
        top_k: int = 5
    ) -> Dict:
        """
        Answer a question using retrieved context
        
        Args:
            question: User's question
            file_types: List of file types to search (None = search all)
            top_k: Number of chunks to retrieve
            
        Returns:
            Dictionary with answer and sources
        """
        # Retrieve relevant chunks
        retrieved_chunks = self.retrieval_service.retrieve(
            query=question,
            file_types=file_types,
            top_k=top_k
        )
        
        if not retrieved_chunks:
            return {
                "answer": "I couldn't find any relevant information to answer your question. Please upload some files first.",
                "sources": []
            }
        
        # Build context from retrieved chunks
        context_parts = []
        sources = []
        for i, chunk in enumerate(retrieved_chunks):
            context_parts.append(f"[Source {i+1} from {chunk['filename']}]:\n{chunk['text']}")
            sources.append({
                "filename": chunk['filename'],
                "file_type": chunk['file_type'],
                "file_id": chunk['file_id'],
                "chunk_index": chunk['chunk_index'],
                "score": chunk['score']
            })
        
        context = "\n\n".join(context_parts)
        
        # Create system message with context
        system_message = """You are a helpful assistant that answers questions based on the provided context.
Use only the information from the context to answer the question. If the context doesn't contain
enough information to answer the question, say so. Cite the sources when possible."""
        
        # Create user message with question and context
        user_message = f"""Context:
{context}

Question: {question}

Please provide a clear and concise answer based on the context above."""
        
        # Generate answer using OpenRouter
        messages = [
            {"role": "user", "content": user_message}
        ]
        
        answer = self.openai_client.chat_completion(
            messages=messages,
            system_message=system_message
        )
        
        return {
            "answer": answer,
            "sources": sources
        }

