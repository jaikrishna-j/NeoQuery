"""
Upload router for file ingestion
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.models.schemas import UploadResponse
from app.services.upload_service import UploadService
from app.dependencies import get_upload_service

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    upload_service: UploadService = Depends(get_upload_service)
):
    """
    Upload and ingest a file
    
    Supports multiple file types:
    - Text: PDF, DOC, DOCX, TXT, MD
    - Structured: SQL, CSV, JSON, XML, XLSX
    - Images: PNG, JPG, SVG (via OCR)
    - Audio: MP3, WAV (via speech-to-text)
    - Video: MP4 (via audio extraction and transcription)
    """
    try:
        # Read file content
        file_content = await file.read()
        
        if not file_content:
            raise HTTPException(status_code=400, detail="Empty file provided")
        
        # Ingest file
        file_id, file_type, chunks_created = upload_service.ingest_file(
            file_content=file_content,
            filename=file.filename or "unknown",
            content_type=file.content_type
        )
        
        return UploadResponse(
            message="File uploaded and processed successfully",
            file_id=file_id,
            file_type=file_type,
            chunks_created=chunks_created
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

