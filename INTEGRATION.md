# NeoQuery Frontend-Backend Integration

## Overview

The frontend and backend are fully integrated with a complete user flow, comprehensive error handling, and polished UI.

## User Flow

### 1. File Upload Flow
- User uploads files via drag-and-drop or file picker
- Frontend shows processing state ("Processing...")
- File is sent to `/upload` endpoint
- Backend processes file, generates embeddings, and indexes in FAISS
- Frontend displays success message with chunk count
- Chat input is **disabled** until at least one file is successfully indexed

### 2. Question-Answering Flow
- User types question (only enabled after file upload)
- Question is sent to `/ask` endpoint
- Backend retrieves relevant chunks from FAISS indexes
- Backend calls OpenAI chat API with retrieved context
- Response is displayed with source citations
- Loading indicator shows "Model is responding, please wait..."

## State Management

The chat page uses a state machine with the following states:

- **`idle`**: Initial state, no files uploaded
- **`uploading`**: File is being uploaded and processed
- **`ready`**: At least one file indexed, user can ask questions
- **`thinking`**: Question submitted, waiting for AI response
- **`error`**: Error occurred, user can retry

## Error Handling

### API Errors
- Custom `APIError` class for structured error handling
- Specific error messages for different failure modes:
  - Backend connection errors
  - Upload failures
  - OpenAI API errors
  - Network timeouts

### User-Facing Messages
- Clear error messages with actionable guidance
- Backend availability check on page load
- Graceful degradation when backend is unavailable
- Retry mechanisms for failed operations

### Empty States
- No files uploaded: "Upload a file to get started..."
- No messages: Clear call-to-action
- Processing states: Loading indicators with context

## UI/UX Enhancements

### Transitions & Animations
- Smooth fade-in animations for messages
- Slide-in animations for new content
- Hover effects with scale transformations
- Loading states with pulse animations
- Smooth scrolling to latest message

### Visual Feedback
- Disabled states clearly indicated
- Processing indicators with appropriate messaging
- Status indicators showing file count
- Source citations with hover tooltips
- Error banners with distinct styling

### Responsive Design
- Mobile-friendly layout
- Flexible message widths (max 80%)
- Touch-friendly interactive elements
- Consistent spacing and typography

## API Integration

### API Utility Module (`lib/api.ts`)
- Clean separation of concerns
- No business logic in frontend
- Type-safe API calls
- Centralized error handling
- Health check functionality

### Endpoints Used
- `GET /health`: Backend availability check
- `POST /upload`: File upload and processing
- `POST /ask`: Question answering with RAG

## Separation of Concerns

### Frontend Responsibilities
- ✅ UI/UX rendering
- ✅ User input handling
- ✅ State management
- ✅ API communication (data transport only)
- ✅ Error display
- ❌ No business logic
- ❌ No data processing
- ❌ No AI/ML operations

### Backend Responsibilities
- ✅ File processing
- ✅ Text extraction
- ✅ Embedding generation
- ✅ Vector storage (FAISS)
- ✅ RAG retrieval
- ✅ OpenAI API integration
- ✅ Business logic
- ❌ No UI assumptions
- ❌ No frontend-specific logic

## Testing Checklist

- [x] File upload with processing state
- [x] Chat disabled until files indexed
- [x] Question submission with loading state
- [x] Error handling for network failures
- [x] Error handling for API errors
- [x] Empty states display correctly
- [x] Backend health check on load
- [x] Smooth animations and transitions
- [x] Responsive layout
- [x] Source citations display
- [x] Multiple file uploads
- [x] File type warnings
- [x] Loading indicators
- [x] Error recovery

## Running the Integrated System

1. **Start Backend:**
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   export OPENAI_API_KEY=your_key_here
   uvicorn main:app --reload
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Architecture Highlights

- **Modular**: Clear separation between frontend and backend
- **Type-safe**: TypeScript throughout
- **Error-resilient**: Comprehensive error handling
- **User-friendly**: Clear feedback at every step
- **Professional**: Polished UI ready for portfolio
- **Maintainable**: Clean code structure and organization

