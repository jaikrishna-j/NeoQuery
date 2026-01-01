# NeoQuery Frontend

A modern, dark-themed frontend for the NeoQuery RAG chatbot built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dark Neon Aesthetic**: Professional dark theme with neon blue accents
- **Multi-Format File Upload**: Support for documents, images, audio, and video files
- **Interactive Chat Interface**: Real-time question-answering with source citations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (default: http://localhost:8000)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set environment variables (optional):
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # Home page
│   ├── chat/            # Chat interface
│   └── how-it-works/    # How It Works page
├── components/           # Reusable React components
│   ├── Navbar.tsx       # Navigation bar
│   ├── FileUpload.tsx   # File upload component
│   ├── ChatMessage.tsx  # Message display component
│   ├── LoadingIndicator.tsx  # Loading state
│   ├── ErrorState.tsx   # Error display
│   └── EmptyState.tsx   # Empty state display
└── public/              # Static assets
```

## Supported File Types

- **Text Documents**: PDF, DOC, DOCX, TXT, MD
- **Structured Files**: SQL, CSV, JSON, XML
- **Images**: PNG, JPG, SVG (with OCR processing)
- **Audio**: MP3, WAV (with transcription)
- **Video**: MP4 (with audio extraction and transcription)

## Design System

- **Background**: Near-black (#0a0a0a)
- **Text**: Soft white (#e5e5e5)
- **Accent**: Neon blue (#00d4ff)
- **Font**: Inter (Google Fonts)

## API Integration

The frontend communicates with the backend API:

- `POST /upload` - Upload files for processing
- `POST /ask` - Ask questions and get answers

Make sure the backend is running before using the chat interface.
