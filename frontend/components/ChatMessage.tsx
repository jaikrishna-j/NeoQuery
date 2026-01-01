"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{
    filename: string;
    file_type: string;
    score: number;
  }>;
}

export default function ChatMessage({ role, content, sources }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="max-w-[80%] bg-[#1a1a1a] border border-[#333] rounded-lg p-4 shadow-lg">
          <p className="text-[#e5e5e5] whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="max-w-[80%] bg-[#111] border border-[#00d4ff]/30 rounded-lg p-4 shadow-lg">
        <p className="text-[#e5e5e5] whitespace-pre-wrap break-words mb-3">{content}</p>
        {sources && sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#333]">
            <p className="text-xs text-[#888] mb-2 font-semibold">Sources:</p>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-[#00d4ff]/20 text-[#00d4ff] rounded border border-[#00d4ff]/30"
                  title={`Score: ${(source.score * 100).toFixed(1)}%`}
                >
                  {source.filename}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

