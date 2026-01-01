"use client";

import { useCallback, useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

const SUPPORTED_TYPES = {
  text: [".pdf", ".doc", ".docx", ".txt", ".md"],
  structured: [".sql", ".csv", ".json", ".xml"],
  image: [".png", ".jpg", ".jpeg", ".svg"],
  audio: [".mp3", ".wav"],
  video: [".mp4"],
};

const FILE_WARNINGS: Record<string, string> = {
  ".png": "Images will be processed using OCR",
  ".jpg": "Images will be processed using OCR",
  ".jpeg": "Images will be processed using OCR",
  ".svg": "SVG files will be processed using OCR",
  ".mp3": "Audio files will be transcribed using speech-to-text",
  ".wav": "Audio files will be transcribed using speech-to-text",
  ".mp4": "Video files will be processed by extracting audio and transcribing",
};

export default function FileUpload({ onFileSelect, isUploading = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFileExtension = useCallback((filename: string): string => {
    return filename.substring(filename.lastIndexOf(".")).toLowerCase();
  }, []);

  const isSupportedFile = useCallback((file: File): boolean => {
    const ext = getFileExtension(file.name);
    return Object.values(SUPPORTED_TYPES).flat().includes(ext);
  }, [getFileExtension]);

  const getFileWarning = useCallback((filename: string): string | null => {
    const ext = getFileExtension(filename);
    return FILE_WARNINGS[ext] || null;
  }, [getFileExtension]);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!isSupportedFile(file)) {
        setError(`Unsupported file type. Supported types: ${Object.values(SUPPORTED_TYPES).flat().join(", ")}`);
        return;
      }
      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect, isSupportedFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
      setIsDragging(true);
    }
  }, [isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (isUploading) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile, isUploading]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && !isUploading) {
        handleFile(file);
      }
      e.target.value = "";
    },
    [handleFile, isUploading]
  );

  const supportedExtensions = Object.values(SUPPORTED_TYPES).flat().join(", ");

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-300 ${
          isDragging
            ? "border-[#00d4ff] bg-[#00d4ff]/10 scale-[1.01] shadow-lg shadow-[#00d4ff]/20"
            : "border-[#2a2a2a] bg-[#111] hover:border-[#00d4ff]/50 hover:bg-[#1a1a1a]"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileInput}
          accept={supportedExtensions}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer block ${isUploading ? "pointer-events-none" : ""}`}
        >
          {isUploading ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-semibold mb-2 text-[#00d4ff]">
                  Processing...
                </p>
                <p className="text-sm sm:text-base text-[#888] px-4">
                  Uploading and indexing your file. This may take a moment.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#00d4ff]/20 to-[#0099cc]/20 border border-[#00d4ff]/30 flex items-center justify-center text-4xl sm:text-5xl">
                  📎
                </div>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-semibold mb-2 text-[#e5e5e5]">
                  {selectedFile ? selectedFile.name : "Drop your file here"}
                </p>
                <p className="text-sm sm:text-base text-[#888] mb-4">
                  or <span className="text-[#00d4ff] underline">click to browse</span>
                </p>
                <p className="text-xs sm:text-sm text-[#666] px-4 break-words">
                  Supported: {supportedExtensions}
                </p>
              </div>
            </div>
          )}
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-red-400 break-words">{error}</p>
        </div>
      )}

      {/* File warning */}
      {selectedFile && getFileWarning(selectedFile.name) && !isUploading && (
        <div className="mt-4 p-4 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-xl animate-in fade-in duration-300">
          <p className="text-sm text-[#00d4ff] break-words flex items-start gap-2">
            <span>⚠️</span>
            <span>{getFileWarning(selectedFile.name)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
