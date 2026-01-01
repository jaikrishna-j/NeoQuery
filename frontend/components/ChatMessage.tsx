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
  // Deduplicate sources by filename, keeping the one with highest score
  const uniqueSources = sources
    ? Array.from(
        sources.reduce((map, source) => {
          const existing = map.get(source.filename);
          if (!existing || source.score > existing.score) {
            map.set(source.filename, source);
          }
          return map;
        }, new Map<string, typeof sources[0]>()).values()
      )
    : undefined;

  if (role === "user") {
    return (
      <div className="flex justify-end mb-5 sm:mb-6 message-enter">
        <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] flex-row-reverse">
          <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0099cc] flex items-center justify-center text-[#0a0a0a] font-bold text-sm sm:text-base shadow-lg ring-2 ring-[#00d4ff]/20">
            U
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-[#2a2a2a] rounded-2xl rounded-tr-sm p-4 sm:p-5 shadow-xl hover:border-[#00d4ff]/40 hover:shadow-[#00d4ff]/10 transition-all duration-300">
            <p className="chat-message-text text-sm sm:text-base text-[#f0f0f0] whitespace-pre-wrap break-words leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-5 sm:mb-6 message-enter">
      <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[80%] lg:max-w-[75%]">
        <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#0099cc]/20 border border-[#00d4ff]/40 flex items-center justify-center text-[#00d4ff] font-bold text-sm sm:text-base shadow-lg ring-2 ring-[#00d4ff]/10">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="bg-gradient-to-br from-[#111111] to-[#0d0d0d] border border-[#00d4ff]/25 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-xl hover:border-[#00d4ff]/50 hover:shadow-[#00d4ff]/10 transition-all duration-300">
            <p className="chat-message-text text-sm sm:text-base text-[#f0f0f0] whitespace-pre-wrap break-words leading-relaxed mb-3">
              {content}
            </p>
            {uniqueSources && uniqueSources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                <p className="text-xs text-[#999] mb-3 font-semibold uppercase tracking-wide">Sources</p>
                <div className="flex flex-wrap gap-2">
                  {uniqueSources.map((source, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded-lg border border-[#00d4ff]/30 hover:bg-[#00d4ff]/20 hover:border-[#00d4ff]/50 transition-all duration-200 break-all shadow-sm"
                      title={`Relevance: ${(source.score * 100).toFixed(1)}%`}
                    >
                      <svg
                        className="w-3 h-3 flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="truncate max-w-[150px] sm:max-w-none">{source.filename}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
