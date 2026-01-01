"""
Ingestion pipelines for different file types
"""
import io
import json
import xml.etree.ElementTree as ET
from abc import ABC, abstractmethod
from typing import List
from pathlib import Path
import pandas as pd
from PyPDF2 import PdfReader
from docx import Document
import pytesseract
from PIL import Image
import tempfile
import os

# Conditional imports for Python 3.13+ compatibility
try:
    import speech_recognition as sr
    SPEECH_RECOGNITION_AVAILABLE = True
except ImportError:
    SPEECH_RECOGNITION_AVAILABLE = False
    sr = None

try:
    from pydub import AudioSegment
    PYDUB_AVAILABLE = True
except ImportError:
    PYDUB_AVAILABLE = False
    AudioSegment = None

try:
    from moviepy.editor import VideoFileClip
    MOVIEPY_AVAILABLE = True
except ImportError:
    MOVIEPY_AVAILABLE = False
    VideoFileClip = None

# Check if Tesseract OCR is available
TESSERACT_AVAILABLE = False
try:
    pytesseract.get_tesseract_version()
    TESSERACT_AVAILABLE = True
except Exception:
    TESSERACT_AVAILABLE = False


class IngestionPipeline(ABC):
    """Base class for ingestion pipelines"""
    
    @abstractmethod
    def extract_text(self, file_content: bytes, filename: str) -> str:
        """
        Extract text from file content
        
        Args:
            file_content: Raw file bytes
            filename: Original filename
            
        Returns:
            Extracted text as string
        """
        pass


class TextIngestionPipeline(IngestionPipeline):
    """Pipeline for text documents (PDF, DOCX, TXT, MD)"""
    
    def extract_text(self, file_content: bytes, filename: str) -> str:
        """Extract text from text documents"""
        file_path = Path(filename)
        extension = file_path.suffix.lower()
        
        if extension == '.pdf':
            return self._extract_from_pdf(file_content)
        elif extension in ['.doc', '.docx']:
            return self._extract_from_docx(file_content)
        elif extension in ['.txt', '.md']:
            return self._extract_from_txt(file_content)
        else:
            raise ValueError(f"Unsupported text file type: {extension}")
    
    def _extract_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF"""
        pdf_file = io.BytesIO(file_content)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    
    def _extract_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX"""
        doc_file = io.BytesIO(file_content)
        doc = Document(doc_file)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text.strip()
    
    def _extract_from_txt(self, file_content: bytes) -> str:
        """Extract text from TXT/MD"""
        try:
            return file_content.decode('utf-8')
        except UnicodeDecodeError:
            return file_content.decode('latin-1')


class StructuredIngestionPipeline(IngestionPipeline):
    """Pipeline for structured files (SQL, CSV, JSON, XML)"""
    
    def extract_text(self, file_content: bytes, filename: str) -> str:
        """Extract text from structured files"""
        file_path = Path(filename)
        extension = file_path.suffix.lower()
        
        if extension == '.sql':
            return self._extract_from_sql(file_content)
        elif extension == '.csv':
            return self._extract_from_csv(file_content)
        elif extension == '.json':
            return self._extract_from_json(file_content)
        elif extension in ['.xml']:
            return self._extract_from_xml(file_content)
        elif extension in ['.xlsx', '.xls']:
            return self._extract_from_excel(file_content)
        else:
            raise ValueError(f"Unsupported structured file type: {extension}")
    
    def _extract_from_sql(self, file_content: bytes) -> str:
        """Extract text from SQL file"""
        return file_content.decode('utf-8')
    
    def _extract_from_csv(self, file_content: bytes) -> str:
        """Extract text from CSV"""
        csv_file = io.BytesIO(file_content)
        df = pd.read_csv(csv_file)
        # Convert DataFrame to readable text format
        text = df.to_string(index=False)
        return text
    
    def _extract_from_json(self, file_content: bytes) -> str:
        """Extract text from JSON"""
        try:
            data = json.loads(file_content.decode('utf-8'))
            return json.dumps(data, indent=2)
        except json.JSONDecodeError:
            return file_content.decode('utf-8')
    
    def _extract_from_xml(self, file_content: bytes) -> str:
        """Extract text from XML"""
        try:
            root = ET.fromstring(file_content)
            # Simple text extraction from XML
            text_parts = []
            for elem in root.iter():
                if elem.text and elem.text.strip():
                    text_parts.append(elem.text.strip())
            return "\n".join(text_parts)
        except ET.ParseError:
            return file_content.decode('utf-8')
    
    def _extract_from_excel(self, file_content: bytes) -> str:
        """Extract text from Excel files"""
        excel_file = io.BytesIO(file_content)
        df = pd.read_excel(excel_file, engine='openpyxl')
        return df.to_string(index=False)


class ImageIngestionPipeline(IngestionPipeline):
    """Pipeline for images (PNG, JPG, SVG) using OCR"""
    
    def extract_text(self, file_content: bytes, filename: str) -> str:
        """Extract text from images using OCR"""
        file_path = Path(filename)
        extension = file_path.suffix.lower()
        
        if extension == '.svg':
            # SVG might contain text directly
            try:
                svg_text = file_content.decode('utf-8')
                # Try to extract text elements from SVG
                if '<text' in svg_text.lower():
                    return svg_text  # Return SVG content for now
            except:
                pass
        
        # Use OCR for raster images
        return self._extract_with_ocr(file_content)
    
    def _extract_with_ocr(self, file_content: bytes) -> str:
        """Extract text using Tesseract OCR"""
        if not TESSERACT_AVAILABLE:
            raise Exception(
                "Tesseract OCR is not installed or not in your PATH. "
                "To fix this, install Tesseract OCR: "
                "Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki or run 'choco install tesseract'. "
                "macOS: Run 'brew install tesseract'. "
                "Linux: Run 'sudo apt-get install tesseract-ocr' (Ubuntu/Debian) or 'sudo yum install tesseract' (RHEL/CentOS). "
                "After installation, restart the backend server and ensure tesseract is in your system PATH."
            )
        
        try:
            image = Image.open(io.BytesIO(file_content))
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            text = pytesseract.image_to_string(image)
            return text.strip()
        except Exception as e:
            error_msg = str(e)
            if "tesseract" in error_msg.lower() and ("not found" in error_msg.lower() or "not installed" in error_msg.lower()):
                raise Exception(
                    "Tesseract OCR is not installed or not in your PATH. "
                    "To fix this, install Tesseract OCR: "
                    "Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki or run 'choco install tesseract'. "
                    "macOS: Run 'brew install tesseract'. "
                    "Linux: Run 'sudo apt-get install tesseract-ocr' (Ubuntu/Debian) or 'sudo yum install tesseract' (RHEL/CentOS). "
                    "After installation, restart the backend server and ensure tesseract is in your system PATH."
                )
            raise Exception(f"OCR extraction failed: {error_msg}")


class AudioIngestionPipeline(IngestionPipeline):
    """Pipeline for audio files (MP3, WAV) using speech-to-text"""
    
    def extract_text(self, file_content: bytes, filename: str) -> str:
        """Extract text from audio using speech-to-text"""
        if not PYDUB_AVAILABLE or not SPEECH_RECOGNITION_AVAILABLE:
            raise ImportError(
                "Audio processing requires pydub and speech_recognition packages. "
                "These packages have compatibility issues with Python 3.13+. "
                "Please use Python 3.12 or earlier for audio processing support, "
                "or wait for package updates."
            )
        return self._extract_with_speech_to_text(file_content, filename)
    
    def _extract_with_speech_to_text(self, file_content: bytes, filename: str) -> str:
        """Extract text using speech recognition"""
        try:
            # Save to temporary file
            file_path = Path(filename)
            extension = file_path.suffix.lower()
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as tmp_file:
                tmp_file.write(file_content)
                tmp_path = tmp_file.name
            
            try:
                # Convert audio format if needed
                audio = AudioSegment.from_file(tmp_path)
                wav_path = tmp_path + ".wav"
                audio.export(wav_path, format="wav")
                
                # Use speech recognition
                recognizer = sr.Recognizer()
                with sr.AudioFile(wav_path) as source:
                    audio_data = recognizer.record(source)
                
                text = recognizer.recognize_google(audio_data)
                
                # Cleanup
                if os.path.exists(wav_path):
                    os.remove(wav_path)
                
                return text
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
        except Exception as e:
            raise Exception(f"Speech-to-text extraction failed: {str(e)}")


class VideoIngestionPipeline(IngestionPipeline):
    """Pipeline for video files (MP4) via audio extraction and transcription"""
    
    def extract_text(self, file_content: bytes, filename: str) -> str:
        """Extract text from video by extracting audio and transcribing"""
        if not MOVIEPY_AVAILABLE:
            raise ImportError(
                "Video processing requires moviepy package. "
                "Please ensure moviepy is installed: pip install moviepy"
            )
        if not SPEECH_RECOGNITION_AVAILABLE:
            raise ImportError(
                "Video processing requires speech_recognition package. "
                "This package has compatibility issues with Python 3.13+. "
                "Please use Python 3.12 or earlier for video processing support, "
                "or wait for package updates."
            )
        return self._extract_audio_and_transcribe(file_content, filename)
    
    def _extract_audio_and_transcribe(self, file_content: bytes, filename: str) -> str:
        """Extract audio from video and transcribe"""
        try:
            # Save video to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_video:
                tmp_video.write(file_content)
                tmp_video_path = tmp_video.name
            
            try:
                # Extract audio from video
                video = VideoFileClip(tmp_video_path)
                audio_path = tmp_video_path + ".wav"
                video.audio.write_audiofile(audio_path, verbose=False, logger=None)
                video.close()
                
                # Transcribe audio
                recognizer = sr.Recognizer()
                with sr.AudioFile(audio_path) as source:
                    audio_data = recognizer.record(source)
                
                text = recognizer.recognize_google(audio_data)
                
                # Cleanup
                if os.path.exists(audio_path):
                    os.remove(audio_path)
                
                return text
            finally:
                if os.path.exists(tmp_video_path):
                    os.remove(tmp_video_path)
        except Exception as e:
            raise Exception(f"Video transcription failed: {str(e)}")


# Factory function to get appropriate pipeline
def get_pipeline(file_type: str) -> IngestionPipeline:
    """Get the appropriate ingestion pipeline for a file type
    
    Args:
        file_type: File type as string or FileType enum value
        
    Returns:
        Appropriate IngestionPipeline instance
    """
    from app.services.file_type_detector import FileType
    
    # Handle both enum and string values
    file_type_str = file_type.value if hasattr(file_type, 'value') else str(file_type)
    
    if file_type_str == FileType.TEXT.value:
        return TextIngestionPipeline()
    elif file_type_str == FileType.STRUCTURED.value:
        return StructuredIngestionPipeline()
    elif file_type_str == FileType.IMAGE.value:
        return ImageIngestionPipeline()
    elif file_type_str == FileType.AUDIO.value:
        return AudioIngestionPipeline()
    elif file_type_str == FileType.VIDEO.value:
        return VideoIngestionPipeline()
    else:
        raise ValueError(f"No pipeline available for file type: {file_type}")

