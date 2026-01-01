"use client";

export default function LoadingIndicator() {
  return (
    <div className="flex justify-start mb-5 sm:mb-6 message-enter">
      <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[80%] lg:max-w-[75%]">
        <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#0099cc]/20 border border-[#00d4ff]/40 flex items-center justify-center text-[#00d4ff] font-bold text-sm sm:text-base shadow-lg ring-2 ring-[#00d4ff]/10">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
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
          <div className="bg-gradient-to-br from-[#111111] to-[#0d0d0d] border border-[#00d4ff]/25 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div 
                  className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div 
                  className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div 
                  className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <span className="text-sm text-[#999] font-medium">Thinking...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
