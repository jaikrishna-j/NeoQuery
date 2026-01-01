"""
FAISS repository for vector storage and retrieval
"""
import faiss
import numpy as np
from typing import List, Dict, Tuple
from app.services.file_type_detector import FileType


class FAISSRepository:
    """Manages separate FAISS indexes for each file type"""
    
    def __init__(self, embedding_dim: int = 1536):
        """
        Initialize FAISS repository with separate indexes per file type
        
        Args:
            embedding_dim: Dimension of embeddings (1536 for text-embedding-ada-002)
        """
        self.embedding_dim = embedding_dim
        self.indexes: Dict[str, faiss.IndexFlatL2] = {}
        self.metadata: Dict[str, List[Dict]] = {}  # Store metadata for each vector
        
        # Initialize indexes for each file type
        for file_type in FileType:
            if file_type != FileType.UNKNOWN:
                index = faiss.IndexFlatL2(embedding_dim)
                self.indexes[file_type.value] = index
                self.metadata[file_type.value] = []
    
    def add_vectors(
        self,
        file_type: str,
        embeddings: List[List[float]],
        texts: List[str],
        file_id: str,
        filename: str
    ) -> int:
        """
        Add vectors to the appropriate index
        
        Args:
            file_type: Type of file (FileType enum value)
            embeddings: List of embedding vectors
            texts: List of original text chunks
            file_id: Unique identifier for the file
            filename: Original filename
            
        Returns:
            Number of vectors added
        """
        if file_type not in self.indexes:
            raise ValueError(f"Unknown file type: {file_type}")
        
        if not embeddings:
            return 0
        
        # Convert to numpy array
        vectors = np.array(embeddings, dtype='float32')
        
        # Add to index
        self.indexes[file_type].add(vectors)
        
        # Store metadata
        start_idx = len(self.metadata[file_type])
        for i, text in enumerate(texts):
            self.metadata[file_type].append({
                'file_id': file_id,
                'filename': filename,
                'chunk_index': i,
                'text': text
            })
        
        return len(embeddings)
    
    def search(
        self,
        query_embedding: List[float],
        file_types: List[str] = None,
        k: int = 5
    ) -> List[Dict]:
        """
        Search across relevant indexes and merge results
        
        Args:
            query_embedding: Query embedding vector
            file_types: List of file types to search (None = search all)
            k: Number of results to return per index
            
        Returns:
            List of results with metadata, sorted by distance
        """
        if file_types is None:
            file_types = [ft.value for ft in FileType if ft != FileType.UNKNOWN]
        
        all_results = []
        query_vector = np.array([query_embedding], dtype='float32')
        
        # Search each relevant index
        for file_type in file_types:
            if file_type not in self.indexes:
                continue
            
            index = self.indexes[file_type]
            metadata = self.metadata[file_type]
            
            if index.ntotal == 0:
                continue
            
            # Search in this index
            distances, indices = index.search(query_vector, min(k, index.ntotal))
            
            # Add results with metadata
            for i, (distance, idx) in enumerate(zip(distances[0], indices[0])):
                if idx < len(metadata):
                    result = {
                        'file_type': file_type,
                        'distance': float(distance),
                        'score': 1.0 / (1.0 + float(distance)),  # Convert distance to similarity score
                        **metadata[idx]
                    }
                    all_results.append(result)
        
        # Sort by distance (lower is better)
        all_results.sort(key=lambda x: x['distance'])
        
        # Return top k results
        return all_results[:k]
    
    def get_index_stats(self) -> Dict[str, int]:
        """Get statistics about each index"""
        stats = {}
        for file_type, index in self.indexes.items():
            stats[file_type] = index.ntotal
        return stats

