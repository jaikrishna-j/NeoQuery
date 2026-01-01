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
      // Reset input so same file can be selected again
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
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging
            ? "border-[#00d4ff] bg-[#00d4ff]/10 scale-[1.02]"
            : "border-[#333] hover:border-[#555]"
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
            <>
              <div className="text-4xl mb-4 animate-pulse">⏳</div>
              <p className="text-lg font-semibold mb-2 text-[#00d4ff]">
                Processing...
              </p>
              <p className="text-sm text-[#888]">
                Uploading and indexing your file. This may take a moment.
              </p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-4">📎</div>
              <p className="text-lg font-semibold mb-2">
                {selectedFile ? selectedFile.name : "Drag and drop a file here"}
              </p>
              <p className="text-sm text-[#888] mb-4">
                or click to browse
              </p>
              <p className="text-xs text-[#666]">
                Supported: {supportedExtensions}
              </p>
            </>
          )}
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* File warning */}
      {selectedFile && getFileWarning(selectedFile.name) && !isUploading && (
        <div className="mt-4 p-4 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-lg animate-in fade-in duration-300">
          <p className="text-sm text-[#00d4ff]">
            ⚠️ {getFileWarning(selectedFile.name)}
          </p>
        </div>
      )}
    </div>
  );
}
