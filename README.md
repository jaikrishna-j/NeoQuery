# NeoQuery

A full-stack RAG (Retrieval-Augmented Generation) chatbot that ingests multiple file types and provides intelligent question-answering capabilities. Built with Next.js, FastAPI, and powered by OpenRouter API.

## Features

- **Multi-Format File Support**: Upload documents, images, audio, and video files
- **Intelligent Processing**: OCR for images, speech-to-text for audio/video
- **Advanced RAG**: Vector embeddings and semantic search using FAISS
- **Modern UI**: Dark-themed interface with responsive design
- **Source Citations**: Answers include references to source documents

## Supported File Types

- **Text Documents**: PDF, DOC, DOCX, TXT, MD
- **Structured Files**: SQL, CSV, JSON, XML
- **Images**: PNG, JPG, SVG (with OCR processing via Tesseract)
- **Audio**: MP3, WAV (with speech-to-text transcription)
- **Video**: MP4 (with audio extraction and transcription)

## Prerequisites

- **Backend**: Python 3.8+, pip
- **Frontend**: Node.js 18+, npm
- **Tesseract OCR**: Required for image processing (see installation below)

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
   - **Windows**: `venv\Scripts\activate`
   - **Linux/Mac**: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Install Tesseract OCR (required for image processing):
   - **Windows**: Download from [UB-Mannheim Tesseract](https://github.com/UB-Mannheim/tesseract/wiki) or use `choco install tesseract`
   - **macOS**: `brew install tesseract`
   - **Linux**: `sudo apt-get install tesseract-ocr` (Ubuntu/Debian) or `sudo yum install tesseract` (RHEL/CentOS)
   - Ensure Tesseract is in your system PATH

6. Set environment variables:
   Create a `.env` file in the backend directory:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
   
   Get your API key from [OpenRouter](https://openrouter.ai/)

7. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   
   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables (optional):
   Create a `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
   (Defaults to `http://localhost:8000` if not set)

4. Run the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:3000`

## Running the Application

1. **Start the backend** (in one terminal):
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   uvicorn main:app --reload
   ```

2. **Start the frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /upload` - Upload files for ingestion
- `POST /ask` - Ask questions based on ingested content

## Architecture

### Backend

The backend follows clean architecture principles with separate layers:

- **API Routes**: FastAPI endpoints (`/upload`, `/ask`, `/health`)
- **Service Layer**: Business logic (upload, retrieval, question-answering)
- **Repository Layer**: FAISS vector indexes organized by file type
- **Models**: Pydantic schemas for request/response validation

### Technology Stack

- **Backend**: FastAPI, Python, FAISS, OpenRouter API
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **LLM**: OpenRouter API (supports multiple models)
- **Embeddings**: OpenAI text-embedding-3-small via OpenRouter
- **Vector Database**: FAISS (in-memory)

### How It Works

1. **File Upload**: Files are processed based on type (OCR for images, transcription for audio/video)
2. **Text Extraction**: All content is converted to text format
3. **Chunking**: Text is split into smaller chunks for efficient processing
4. **Embedding**: Chunks are converted to vector embeddings using OpenRouter API
5. **Storage**: Embeddings are stored in FAISS indexes organized by file type
6. **Retrieval**: When you ask a question, it's converted to an embedding and used to search for relevant chunks
7. **Generation**: Retrieved context is passed to language models via OpenRouter API to generate answers
