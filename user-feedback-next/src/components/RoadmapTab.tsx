import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { RoadmapCard } from "./RoadmapCard";
import { getSessionId } from "../lib/session";
import { useTeam } from "@/contexts/TeamContext";

const quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"];

export function RoadmapTab() {
  const { activeTeam } = useTeam();
  const teamId = activeTeam?._id;

  const roadmapItems = useQuery(
    api.roadmap.listRoadmapItems,
    teamId ? { teamId } : "skip"
  );
  const userVotes = useQuery(
    api.feedback.getUserVotes,
    teamId ? { teamId, sessionId: getSessionId() } : "skip"
  );

  const votedItems = new Set(
    userVotes?.filter((v) => v.itemType === "roadmap").map((v) => v.itemId) || []
  );

  const itemsByQuarter = roadmapItems?.reduce(
    (acc, item) => {
      if (!acc[item.quarter]) {
        acc[item.quarter] = [];
      }
      acc[item.quarter].push(item);
      return acc;
    },
    {} as Record<string, typeof roadmapItems>
  );

  if (!teamId) {
    return <div>Please select a team</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Product Roadmap</h2>
        <p className="text-slate-600 mt-1">
          See what we're working on and what's coming next
        </p>
      </div>

      {roadmapItems === undefined ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
        </div>
      ) : roadmapItems.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <p className="text-lg font-medium">Roadmap coming soon</p>
          <p className="text-sm mt-1">Check back later for updates on our plans</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quarters.map((quarter) => {
            const items = itemsByQuarter?.[quarter] || [];
            return (
              <div key={quarter} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                  <h3 className="text-xl font-bold text-slate-900">{quarter}</h3>
                </div>
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="bg-slate-50 rounded-lg p-6 text-center text-slate-500 text-sm">
                      No items planned for this quarter
                    </div>
                  ) : (
                    items.map((item) => (
                      <RoadmapCard
                        key={item._id}
                        item={item}
                        hasVoted={votedItems.has(item._id)}
                        teamId={teamId}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
