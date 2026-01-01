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
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500">
      <div className="text-6xl mb-4 opacity-60">📭</div>
      <h2 className="text-2xl font-semibold mb-2 text-[#e5e5e5]">{title}</h2>
      <p className="text-[#888] mb-6 max-w-md leading-relaxed">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-[#00d4ff] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#00b8e6] transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

