"use client";

import { MessageSquarePlus } from "lucide-react";

interface PublicHeaderProps {
  teamName: string;
  teamIcon: string;
  onSubmitClick: () => void;
}

// Map icon names to simple letters/symbols for display
const getIconDisplay = (iconName: string) => {
  // Return first letter of icon name as fallback
  return iconName.charAt(0).toUpperCase();
};

export function PublicHeader({ teamName, teamIcon, onSubmitClick }: PublicHeaderProps) {
  return (
    <header className="border-b border-white/5 bg-[#09090b]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
            {getIconDisplay(teamIcon)}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-100">{teamName}</h1>
            <p className="text-xs text-neutral-500">Feedback Portal</p>
          </div>
        </div>

        <button
          onClick={onSubmitClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <MessageSquarePlus size={18} />
          Submit Feedback
        </button>
      </div>
    </header>
  );
}
