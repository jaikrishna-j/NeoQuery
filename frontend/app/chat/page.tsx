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
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

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
      setAppState("ready");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canAskQuestions = appState === "ready";
  const isProcessing = appState === "uploading" || appState === "thinking";

  return (
    <main className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* File Upload Section - Collapsible */}
        {uploadedFiles.length === 0 && (
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
            <FileUpload
              onFileSelect={handleFileUpload}
              isUploading={appState === "uploading"}
            />
          </div>
        )}

        {/* Error banner */}
        {error && appState === "error" && (
          <div className="px-4 sm:px-6 lg:px-8 pt-4">
            <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg">
              <p className="text-xs sm:text-sm text-red-400 wrap-break-word font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Chat messages area - Modern design */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 min-h-0">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 && appState !== "uploading" ? (
              <EmptyState
                title="Start a conversation"
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
        </div>

        {/* Chat input form - Modern design */}
        <div className="border-t border-[#1a1a1a] bg-linear-to-b from-[#0a0a0a] via-[#0a0a0a] to-[#0a0a0a] backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <form onSubmit={handleSubmit} className="relative">
              {/* Status indicator - integrated into input area */}
              {uploadedFiles.length > 0 && (
                <div className="mb-3 flex items-center gap-2 text-xs text-[#888] px-1">
                  <div className="relative">
                    <div className="w-2 h-2 bg-[#00d4ff] rounded-full"></div>
                    <div className="absolute inset-0 w-2 h-2 bg-[#00d4ff] rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="font-medium">Ready to chat</span>
                </div>
              )}
              
              {/* Input container with modern design */}
              <div className="relative">
                <div className="chat-input-container relative flex items-end gap-2 bg-[#111111] border border-[#1f1f1f] rounded-2xl p-3 sm:p-4 shadow-2xl">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      canAskQuestions
                        ? "Ask a question about your uploaded files..."
                        : uploadedFiles.length === 0
                        ? "Upload a file first..."
                        : "Processing, please wait..."
                    }
                    rows={1}
                    className="chat-input flex-1 resize-none bg-transparent text-sm sm:text-base text-[#f0f0f0] placeholder:text-[#666] placeholder:font-normal placeholder:text-left focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed max-h-[200px] overflow-y-auto leading-relaxed"
                    disabled={!canAskQuestions || isProcessing}
                  />
                  <button
                    type="submit"
                    disabled={!canAskQuestions || !input.trim() || isProcessing}
                    className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#00d4ff] to-[#0099cc] text-white flex items-center justify-center hover:from-[#00b8e6] hover:to-[#0088bb] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg shadow-[#00d4ff]/20 hover:shadow-[#00d4ff]/40 disabled:hover:scale-100 disabled:hover:shadow-lg"
                    aria-label="Send message"
                  >
                    {appState === "thinking" ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 12l14 0M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Keyboard shortcuts - subtle styling */}
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[#555]">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-[#111111] border border-[#1f1f1f] rounded-md text-[#999] font-mono text-[10px] shadow-sm">Enter</kbd>
                  <span className="text-[#666]">to send</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-[#111111] border border-[#1f1f1f] rounded-md text-[#999] font-mono text-[10px] shadow-sm">Shift</kbd>
                  <span className="text-[#666]">+</span>
                  <kbd className="px-2 py-1 bg-[#111111] border border-[#1f1f1f] rounded-md text-[#999] font-mono text-[10px] shadow-sm">Enter</kbd>
                  <span className="text-[#666]">for new line</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a] py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#666]">
              Built with{" "}
              <span className="text-[#00d4ff] font-medium">Next.js</span>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/jaikrishna-j/NeoQuery"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666] hover:text-[#888] transition-colors duration-200"
                aria-label="View on GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/jaikrishna-j/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666] hover:text-[#888] transition-colors duration-200"
                aria-label="View on LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="mailto:jaikrishnajaisankar2005@gmail.com"
                className="text-[#666] hover:text-[#888] transition-colors duration-200"
                aria-label="Send email"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
