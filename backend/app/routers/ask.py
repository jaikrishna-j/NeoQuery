"""
Ask router for question answering
"""
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import AskRequest, AskResponse
from app.services.ask_service import AskService
from app.dependencies import get_ask_service

router = APIRouter(prefix="/ask", tags=["ask"])


@router.post("", response_model=AskResponse)
async def ask_question(
    request: AskRequest,
    ask_service: AskService = Depends(get_ask_service)
):
    """
    Ask a question based on ingested content
    
    The system will search across all ingested files (or specified file types)
    and generate an answer using OpenAI's chat models with retrieved context.
    """
    try:
        result = ask_service.answer_question(
            question=request.question,
            file_types=request.file_types,
            top_k=5
        )
        
        return AskResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")

