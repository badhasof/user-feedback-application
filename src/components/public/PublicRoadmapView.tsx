"use client";

import { ChevronUp, CheckCircle2, Clock, Rocket, Circle } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

interface RoadmapItem {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  votes: number;
  quarter?: string;
}

interface PublicRoadmapViewProps {
  items: RoadmapItem[];
  votedItems: Set<string>;
  onVote: (itemId: string) => void;
}

const statusConfig: Record<string, { label: string; icon: typeof Circle; color: string; bg: string; border: string }> = {
  'planned': {
    label: 'Planned',
    icon: Clock,
    color: 'text-[#60a5fa]',
    bg: 'bg-[#1e2738]',
    border: 'border-[#2b3a55]',
  },
  'in-progress': {
    label: 'In Progress',
    icon: Rocket,
    color: 'text-[#fbbf24]',
    bg: 'bg-[#352a15]',
    border: 'border-[#453616]',
  },
  'completed': {
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-[#4ade80]',
    bg: 'bg-[#192b23]',
    border: 'border-[#223d2e]',
  },
};

const getCategoryStyle = (category?: string) => {
  if (category === "Feature") return "bg-[#1e2738] text-[#60a5fa] border border-[#2b3a55]";
  if (category === "Improvement") return "bg-[#192b23] text-[#4ade80] border border-[#223d2e]";
  if (category === "Bug") return "bg-[#351c1c] text-[#f87171] border border-[#452222]";
  return "bg-neutral-800 text-neutral-400 border border-neutral-700";
};

export function PublicRoadmapView({ items, votedItems, onVote }: PublicRoadmapViewProps) {
  // Group items by status
  const groupedItems = {
    'in-progress': items.filter(item => item.status === 'in-progress'),
    'planned': items.filter(item => item.status === 'planned'),
    'completed': items.filter(item => item.status === 'completed'),
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#161616] flex items-center justify-center">
          <Rocket size={24} className="text-neutral-600" />
        </div>
        <p className="text-lg font-medium text-neutral-400">Roadmap coming soon</p>
        <p className="text-sm text-neutral-600 mt-1">Check back later for updates on our plans</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {Object.entries(groupedItems).map(([status, statusItems]) => {
        if (statusItems.length === 0) return null;
        const config = statusConfig[status] || statusConfig['planned'];
        const Icon = config.icon;

        return (
          <div key={status}>
            {/* Status Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-2 rounded-lg", config.bg, config.border, "border")}>
                <Icon size={18} className={config.color} />
              </div>
              <h3 className={cn("text-lg font-semibold", config.color)}>
                {config.label}
              </h3>
              <span className="text-sm text-neutral-600">({statusItems.length})</span>
            </div>

            {/* Items */}
            <div className="space-y-3 pl-4 border-l-2 border-[#2E2E2E] ml-4">
              {statusItems.map((item) => {
                const hasVoted = votedItems.has(item._id);
                return (
                  <div
                    key={item._id}
                    className="bg-[#1E1E1E] rounded-xl border border-[#2E2E2E] hover:border-white/10 transition-colors p-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Vote Button */}
                      <button
                        onClick={() => onVote(item._id)}
                        className={cn(
                          "flex flex-col items-center justify-center min-w-[48px] h-12 rounded-lg border transition-colors shrink-0",
                          hasVoted
                            ? "bg-[#1e2738] border-[#2b3a55] text-[#60a5fa]"
                            : "bg-[#161616] border-[#2E2E2E] text-neutral-500 hover:border-white/10 hover:text-neutral-300"
                        )}
                      >
                        <ChevronUp size={16} className={hasVoted ? "text-[#60a5fa]" : ""} />
                        <span className="text-[14px] font-semibold -mt-1">{item.votes}</span>
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-[16px] font-normal text-white">{item.title}</h4>
                          {item.category && (
                            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-md", getCategoryStyle(item.category))}>
                              {item.category}
                            </span>
                          )}
                          {item.quarter && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700">
                              {item.quarter}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-[14px] text-neutral-500 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
