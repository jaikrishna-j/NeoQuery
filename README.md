# NeoQuery

A full-stack RAG (Retrieval-Augmented Generation) chatbot that ingests multiple file types and provides intelligent question-answering capabilities.

## Project Structure

```
NeoQuery/
├── frontend/          # Frontend application (to be implemented)
├── backend/           # FastAPI backend with RAG capabilities
└── README.md          # This file
```

## Backend Overview

The backend is built with FastAPI and implements a RAG system that:

- Ingests multiple file types (text, structured data, images, audio, video)
- Converts all inputs to text format
- Generates embeddings using OpenAI embedding models
- Stores vectors in separate FAISS indexes per file type
- Provides retrieval and question-answering via OpenAI chat models

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set environment variables:
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```
   Or create a `.env` file in the backend directory with:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

6. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /upload` - Upload files for ingestion
- `POST /ask` - Ask questions based on ingested content

## Architecture

The backend follows clean architecture principles with separate layers for:
- API routes (FastAPI endpoints)
- Service layer (business logic)
- Repository layer (FAISS indexes)
- Models (Pydantic schemas)
