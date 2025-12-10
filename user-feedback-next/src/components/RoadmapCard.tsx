import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { getSessionId } from "../lib/session";

const statusColors = {
  planned: "bg-blue-100 text-blue-700 border-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  "on-hold": "bg-gray-100 text-gray-700 border-gray-200",
};

const categoryIcons = {
  Feature: "✨",
  Improvement: "🚀",
  Integration: "🔗",
  Mobile: "📱",
  Performance: "⚡",
  "UI/UX": "🎨",
};

export function RoadmapCard({
  item,
  hasVoted,
  teamId,
}: {
  item: any;
  hasVoted: boolean;
  teamId: Id<"teams">;
}) {
  const voteRoadmapItem = useMutation(api.roadmap.voteRoadmapItem);

  const handleVote = async () => {
    try {
      await voteRoadmapItem({
        teamId,
        itemId: item._id as Id<"roadmapItems">,
        sessionId: getSessionId(),
      });
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-all">
      <div className="flex gap-3">
        <button
          onClick={handleVote}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg border-2 transition-all flex-shrink-0 ${
            hasVoted
              ? "bg-indigo-50 border-indigo-500 text-indigo-600"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          <span className="text-xs font-bold">{item.votes}</span>
        </button>

        <div className="flex-1 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-xl">
              {categoryIcons[item.category as keyof typeof categoryIcons] ||
                "📌"}
            </span>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900">{item.title}</h4>
              <p className="text-sm text-slate-600 mt-1">{item.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                statusColors[item.status as keyof typeof statusColors] ||
                statusColors.planned
              }`}
            >
              {item.status
                .split("-")
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {item.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
