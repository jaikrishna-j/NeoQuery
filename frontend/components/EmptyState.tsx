"use client";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 text-center animate-in fade-in duration-500 px-4">
      <div className="relative mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#0099cc]/20 border border-[#00d4ff]/30 flex items-center justify-center text-4xl sm:text-5xl mb-4 pulse-glow">
          💬
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#00d4ff] rounded-full animate-ping opacity-75"></div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-[#e5e5e5]">{title}</h2>
      <p className="text-sm sm:text-base text-[#888] mb-6 sm:mb-8 max-w-md leading-relaxed">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-[#0a0a0a] font-semibold rounded-2xl hover:from-[#00b8e6] hover:to-[#0088bb] transition-all duration-200 shadow-lg hover:shadow-[#00d4ff]/30 text-sm sm:text-base"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
