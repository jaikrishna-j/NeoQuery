"use client";

import { useState, useRef, useEffect } from "react";
import FileUpload from "@/components/FileUpload";
import ChatMessage from "@/components/ChatMessage";
import LoadingIndicator from "@/components/LoadingIndicator";
import EmptyState from "@/components/EmptyState";
import { uploadFile, askQuestion, checkHealth, APIError } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    filename: string;
    file_type: string;
    score: number;
  }>;
}

type AppState = "idle" | "uploading" | "ready" | "thinking" | "error";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [appState, setAppState] = useState<AppState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      const available = await checkHealth();
      setBackendAvailable(available);
      if (!available) {
        setError("Backend server is not available. Please start the backend server.");
        setAppState("error");
      }
    };
    checkBackend();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, appState]);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setAppState("uploading");

    try {
      const result = await uploadFile(file);
      setUploadedFiles((prev) => [...prev, file.name]);
      setAppState("ready");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `✅ File "${file.name}" uploaded and processed successfully! ${result.chunks_created} chunk${result.chunks_created !== 1 ? "s" : ""} created. You can now ask questions about this file.`,
        },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof APIError
          ? err.message
          : "An unexpected error occurred during upload. Please try again.";
      setError(errorMessage);
      setAppState("error");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Upload failed: ${errorMessage}`,
        },
      ]);
      // Reset to ready state so user can try again
      setTimeout(() => {
        if (uploadedFiles.length > 0) {
          setAppState("ready");
        } else {
          setAppState("idle");
        }
      }, 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || appState !== "ready") return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setAppState("thinking");

    try {
      const result = await askQuestion(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources,
        },
      ]);
      setAppState("ready");
    } catch (err) {
      const errorMessage =
        err instanceof APIError
          ? err.message
          : "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${errorMessage}${err instanceof APIError && err.status === 0 ? " Make sure the backend is running and try again." : ""}`,
        },
      ]);
      setAppState("ready"); // Allow retry
    }
  };

  const canAskQuestions = appState === "ready";
  const isProcessing = appState === "uploading" || appState === "thinking";

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Chat</h1>
          <p className="text-[#888]">Ask questions about your uploaded files</p>
        </div>

        {/* Backend availability warning */}
        {backendAvailable === false && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">
              ⚠️ Backend server is not available. Please start the backend server at {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
            </p>
          </div>
        )}

        {/* File upload section */}
        <div className="mb-6">
          <FileUpload
            onFileSelect={handleFileUpload}
            isUploading={appState === "uploading"}
          />
        </div>

        {/* Error banner */}
        {error && appState === "error" && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto mb-6 border border-[#333] rounded-lg p-6 bg-[#0f0f0f] min-h-[400px]">
          {messages.length === 0 && appState !== "uploading" ? (
            <EmptyState
              title="No messages yet"
              message={
                uploadedFiles.length === 0
                  ? "Upload a file to get started. Once indexed, you can ask questions about it."
                  : "Ask a question about your uploaded files to get started."
              }
            />
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  sources={message.sources}
                />
              ))}
              {isProcessing && <LoadingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat input form */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              canAskQuestions
                ? "Ask a question about your uploaded files..."
                : uploadedFiles.length === 0
                ? "Upload a file first..."
                : "Processing, please wait..."
            }
            className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#e5e5e5] focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            disabled={!canAskQuestions || isProcessing}
          />
          <button
            type="submit"
            disabled={!canAskQuestions || !input.trim() || isProcessing}
            className="px-6 py-3 bg-[#00d4ff] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#00b8e6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {appState === "thinking" ? "Thinking..." : "Send"}
          </button>
        </form>

        {/* Status indicator */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 text-xs text-[#666] text-center">
            {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""} indexed • Ready to chat
          </div>
        )}
      </div>
    </main>
  );
}
