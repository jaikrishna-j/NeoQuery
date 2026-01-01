"use client";

export default function LoadingIndicator() {
  return (
    <div className="flex justify-start mb-6 animate-in fade-in duration-300">
      <div className="bg-[#111] border border-[#00d4ff]/30 rounded-lg p-4 shadow-lg">
        <div className="flex items-center space-x-2">
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
          <span className="ml-2 text-[#888] text-sm">Model is responding, please wait...</span>
        </div>
      </div>
    </div>
  );
}

