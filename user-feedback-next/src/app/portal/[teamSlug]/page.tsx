"use client";

import { useState, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutGrid, List, Filter, ArrowUpDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { getSessionId } from "@/lib/session";

import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFeedbackCard } from "@/components/public/PublicFeedbackCard";
import { PublicFeedbackDialog } from "@/components/public/PublicFeedbackDialog";
import { PublicRoadmapView } from "@/components/public/PublicRoadmapView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface PageProps {
  params: Promise<{ teamSlug: string }>;
}

export default function SubdomainPage({ params }: PageProps) {
  const { teamSlug } = use(params);
  const [activeTab, setActiveTab] = useState('features');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get team by slug
  const team = useQuery(api.public.getTeamBySlug, { slug: teamSlug });

  // Get teamId for other queries
  const teamId = team?._id;

  // Get feedback and roadmap
  const feedbackList = useQuery(
    api.public.listPublicFeedback,
    teamId ? { teamId } : "skip"
  );

  const roadmapItems = useQuery(
    api.public.listPublicRoadmapItems,
    teamId ? { teamId } : "skip"
  );

  // Get user votes by session
  const userVotes = useQuery(
    api.public.getPublicUserVotes,
    teamId ? { teamId, sessionId: getSessionId() } : "skip"
  );

  // Mutations
  const voteFeedback = useMutation(api.feedback.voteFeedback);
  const voteRoadmap = useMutation(api.roadmap.voteRoadmapItem);

  // Loading state
  if (team === undefined) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-neutral-700 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-500">Loading feedback portal...</p>
        </div>
      </div>
    );
  }

  // Team not found
  if (team === null) {
    notFound();
  }

  // Handle voting on feedback
  const handleVoteFeedback = async (feedbackId: string) => {
    if (!teamId) return;
    try {
      await voteFeedback({
        teamId,
        feedbackId: feedbackId as Id<"feedback">,
        sessionId: getSessionId(),
      });
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  // Handle voting on roadmap item
  const handleVoteRoadmap = async (itemId: string) => {
    if (!teamId) return;
    try {
      await voteRoadmap({
        teamId,
        itemId: itemId as Id<"roadmapItems">,
        sessionId: getSessionId(),
      });
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  // Get voted items sets
  const votedFeedbackItems = new Set(
    userVotes?.filter((v) => v.itemType === "feedback").map((v) => v.itemId) || []
  );
  const votedRoadmapItems = new Set(
    userVotes?.filter((v) => v.itemType === "roadmap").map((v) => v.itemId) || []
  );

  // Filter logic
  const getFilteredItems = () => {
    let items = feedbackList || [];

    if (activeTab === 'bugs') {
      items = items.filter(i => i.category === 'Bug');
    } else if (activeTab === 'features') {
      items = items.filter(i => i.category === 'Feature' || i.category === 'Improvement');
    }

    if (searchQuery) {
      items = items.filter(i =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return items;
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-neutral-200">
      <Toaster position="top-right" theme="dark" />

      <PublicHeader
        teamName={team.name}
        teamIcon={team.iconName}
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero / Intro */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div className="space-y-2 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-100">
              Help us build a better product.
            </h2>
            <p className="text-neutral-500 text-sm md:text-base">
              Vote on existing requests or suggest a new feature. We read every piece of feedback.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-64 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-neutral-400 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all text-neutral-200 placeholder:text-neutral-600"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-white/5 mb-8 gap-8">
          {['features', 'bugs', 'roadmap'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-4 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                activeTab === tab ? 'text-neutral-100' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab === 'features' ? 'Feature Requests' : tab === 'bugs' ? 'Bug Reports' : 'Roadmap'}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px] overflow-hidden">
          {activeTab === 'roadmap' ? (
            // Roadmap View
            roadmapItems === undefined ? (
              <div className="text-center py-12 w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-neutral-700 border-t-blue-500 mx-auto"></div>
              </div>
            ) : (
              <PublicRoadmapView
                items={roadmapItems}
                votedItems={votedRoadmapItems}
                onVote={handleVoteRoadmap}
              />
            )
          ) : (
            // Features & Bugs View - matching admin dashboard structure
            <Tabs defaultValue="board" className="w-full">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2 mb-6">
                <TabsList>
                  <TabsTrigger value="board">
                    <LayoutGrid size={16} />
                    Board
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List size={16} />
                    List View
                  </TabsTrigger>
                </TabsList>
                {/* Header Actions - same as admin KanbanHeaderActions */}
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex items-center gap-3 text-neutral-400">
                    <button className="hover:text-neutral-200 transition-colors"><Filter size={18} /></button>
                    <button className="hover:text-neutral-200 transition-colors"><ArrowUpDown size={18} /></button>
                    <button className="hover:text-neutral-200 transition-colors"><Search size={18} /></button>
                  </div>
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
                  >
                    New <div className="h-4 w-px bg-blue-400/50 mx-1" />
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <TabsContent value="board">
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {feedbackList === undefined ? (
                      <div className="text-center py-12 col-span-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-neutral-700 border-t-blue-500 mx-auto"></div>
                      </div>
                    ) : filteredItems.length === 0 ? (
                      <div className="py-20 text-center text-neutral-500 col-span-full">
                        <p>No posts found matching your criteria.</p>
                      </div>
                    ) : (
                      filteredItems.map((item) => (
                        <PublicFeedbackCard
                          key={item._id}
                          item={item}
                          hasVoted={votedFeedbackItems.has(item._id)}
                          onVote={() => handleVoteFeedback(item._id)}
                          viewMode="grid"
                          teamId={teamId!}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </motion.div>
              </TabsContent>
              <TabsContent value="list">
                <motion.div layout className="space-y-4">
                  <AnimatePresence>
                    {feedbackList === undefined ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-neutral-700 border-t-blue-500 mx-auto"></div>
                      </div>
                    ) : filteredItems.length === 0 ? (
                      <div className="py-20 text-center text-neutral-500">
                        <p>No posts found matching your criteria.</p>
                      </div>
                    ) : (
                      filteredItems.map((item) => (
                        <PublicFeedbackCard
                          key={item._id}
                          item={item}
                          hasVoted={votedFeedbackItems.has(item._id)}
                          onVote={() => handleVoteFeedback(item._id)}
                          viewMode="list"
                          teamId={teamId!}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </motion.div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      {/* Feedback Dialog */}
      {teamId && (
        <PublicFeedbackDialog
          teamId={teamId}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          defaultCategory={activeTab === 'bugs' ? 'Bug' : 'Feature'}
        />
      )}
    </div>
  );
}
