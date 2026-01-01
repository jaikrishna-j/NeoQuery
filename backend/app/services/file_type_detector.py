"""
File type detection and routing
"""
from enum import Enum
import mimetypes
from pathlib import Path


class FileType(str, Enum):
    """Supported file types"""
    TEXT = "text"
    STRUCTURED = "structured"
    IMAGE = "image"
    AUDIO = "audio"
    VIDEO = "video"
    UNKNOWN = "unknown"


class FileTypeDetector:
    """Detects and routes files to appropriate ingestion pipelines"""
    
    # Text documents
    TEXT_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt', '.md'}
    TEXT_MIMETYPES = {
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown'
    }
    
    # Structured files
    STRUCTURED_EXTENSIONS = {'.sql', '.csv', '.json', '.xml', '.xlsx', '.xls'}
    STRUCTURED_MIMETYPES = {
        'application/sql',
        'text/csv',
        'application/json',
        'application/xml',
        'text/xml',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    }
    
    # Images
    IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.svg'}
    IMAGE_MIMETYPES = {
        'image/png',
        'image/jpeg',
        'image/svg+xml'
    }
    
    # Audio
    AUDIO_EXTENSIONS = {'.mp3', '.wav'}
    AUDIO_MIMETYPES = {
        'audio/mpeg',
        'audio/wav',
        'audio/x-wav'
    }
    
    # Video
    VIDEO_EXTENSIONS = {'.mp4'}
    VIDEO_MIMETYPES = {
        'video/mp4'
    }
    
    @classmethod
    def detect_file_type(cls, filename: str, content_type: str = None) -> FileType:
        """
        Detect file type based on extension and MIME type
        
        Args:
            filename: Name of the file
            content_type: MIME type of the file (optional)
            
        Returns:
            FileType enum value
        """
        file_path = Path(filename)
        extension = file_path.suffix.lower()
        
        # Check by extension first
        if extension in cls.TEXT_EXTENSIONS:
            return FileType.TEXT
        elif extension in cls.STRUCTURED_EXTENSIONS:
            return FileType.STRUCTURED
        elif extension in cls.IMAGE_EXTENSIONS:
            return FileType.IMAGE
        elif extension in cls.AUDIO_EXTENSIONS:
            return FileType.AUDIO
        elif extension in cls.VIDEO_EXTENSIONS:
            return FileType.VIDEO
        
        # Check by MIME type if extension not recognized
        if content_type:
            content_type_lower = content_type.lower()
            if content_type_lower in cls.TEXT_MIMETYPES:
                return FileType.TEXT
            elif content_type_lower in cls.STRUCTURED_MIMETYPES:
                return FileType.STRUCTURED
            elif content_type_lower in cls.IMAGE_MIMETYPES:
                return FileType.IMAGE
            elif content_type_lower in cls.AUDIO_MIMETYPES:
                return FileType.AUDIO
            elif content_type_lower in cls.VIDEO_MIMETYPES:
                return FileType.VIDEO
        
        # Fallback: try mimetypes.guess_type
        guessed_type, _ = mimetypes.guess_type(filename)
        if guessed_type:
            guessed_type_lower = guessed_type.lower()
            if guessed_type_lower in cls.TEXT_MIMETYPES:
                return FileType.TEXT
            elif guessed_type_lower in cls.STRUCTURED_MIMETYPES:
                return FileType.STRUCTURED
            elif guessed_type_lower in cls.IMAGE_MIMETYPES:
                return FileType.IMAGE
            elif guessed_type_lower in cls.AUDIO_MIMETYPES:
                return FileType.AUDIO
            elif guessed_type_lower in cls.VIDEO_MIMETYPES:
                return FileType.VIDEO
        
        return FileType.UNKNOWN

