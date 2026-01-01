"""
Upload service for file ingestion
"""
import uuid
from typing import Tuple
from app.services.file_type_detector import FileTypeDetector, FileType
from app.services.ingestion_pipelines import get_pipeline
from app.services.text_chunker import TextChunker
from app.services.openrouter_client import OpenRouterClient
from app.repositories.faiss_repository import FAISSRepository


class UploadService:
    """Service for handling file uploads and ingestion"""
    
    def __init__(
        self,
        faiss_repo: FAISSRepository,
        openai_client: OpenRouterClient,
        chunker: TextChunker = None
    ):
        """
        Initialize upload service
        
        Args:
            faiss_repo: FAISS repository instance
            openai_client: OpenRouter client instance
            chunker: Text chunker instance (optional, uses default if not provided)
        """
        self.faiss_repo = faiss_repo
        self.openai_client = openai_client
        self.chunker = chunker or TextChunker()
        self.file_type_detector = FileTypeDetector()
    
    def ingest_file(
        self,
        file_content: bytes,
        filename: str,
        content_type: str = None
    ) -> Tuple[str, str, int]:
        """
        Ingest a file and add to appropriate FAISS index
        
        Args:
            file_content: Raw file bytes
            filename: Original filename
            content_type: MIME type of file (optional)
            
        Returns:
            Tuple of (file_id, file_type, chunks_created)
        """
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Detect file type
        file_type = self.file_type_detector.detect_file_type(filename, content_type)
        
        if file_type == FileType.UNKNOWN:
            raise ValueError(f"Unknown or unsupported file type: {filename}")
        
        # Get appropriate ingestion pipeline
        pipeline = get_pipeline(file_type)
        
        # Extract text from file
        extracted_text = pipeline.extract_text(file_content, filename)
        
        if not extracted_text or not extracted_text.strip():
            raise ValueError(f"No text could be extracted from file: {filename}")
        
        # Chunk the text
        chunks = self.chunker.chunk_text(extracted_text)
        
        if not chunks:
            raise ValueError(f"No chunks could be created from file: {filename}")
        
        # Generate embeddings for chunks
        embeddings = self.openai_client.generate_embeddings(chunks)
        
        # Add to FAISS index
        chunks_added = self.faiss_repo.add_vectors(
            file_type=file_type.value,
            embeddings=embeddings,
            texts=chunks,
            file_id=file_id,
            filename=filename
        )
        
        return file_id, file_type.value, chunks_added

