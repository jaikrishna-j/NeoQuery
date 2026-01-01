"use client";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-300">
      <div className="text-6xl mb-4 opacity-60">⚠️</div>
      <h2 className="text-2xl font-semibold mb-2 text-red-400">{title}</h2>
      <p className="text-[#888] mb-6 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-[#00d4ff] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#00b8e6] transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

