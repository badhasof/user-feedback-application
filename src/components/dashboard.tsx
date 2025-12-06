import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ChevronUp,
  Search,
  Filter,
  Plus,
  CornerDownRight,
  X,
  LogOut,
  LayoutGrid,
  List,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { getSessionId } from "../lib/session";
import { useAuthActions } from "@convex-dev/auth/react";
import { KanbanBoard, ListView } from "./Kanban";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

// --- Column Configuration (matching the UI component) ---
const COLUMNS = [
  { id: "no-status", title: "No Status", color: "neutral", statusLabel: null },
  { id: "not-started", title: "Not Started", color: "grey", statusLabel: "Not Started" },
  { id: "in-progress", title: "In Progress", color: "blue", statusLabel: "In Progress" },
  { id: "completed", title: "Completed", color: "green", statusLabel: "Completed" }
];

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  // Matching TaskCard's pill/badge styling
  const styles: Record<string, string> = {
    'new': 'bg-neutral-800 text-neutral-400 border border-neutral-700',
    'under-review': 'bg-neutral-800 text-neutral-400 border border-neutral-700',
    'planned': 'bg-[#1e2738] text-[#60a5fa] border border-[#2b3a55]',
    'in-progress': 'bg-[#352a15] text-[#fbbf24] border border-[#453616]',
    'resolved': 'bg-[#192b23] text-[#4ade80] border border-[#223d2e]',
    'live': 'bg-[#192b23] text-[#4ade80] border border-[#223d2e]',
  };

  const labels: Record<string, string> = {
    'new': 'New',
    'under-review': 'Under Review',
    'planned': 'Planned',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'live': 'Live',
  };

  return (
    <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md", styles[status] || styles['new'])}>
      {labels[status] || status}
    </span>
  );
};

const UpvoteButton = ({ votes, active, onClick }: { votes: number; active: boolean; onClick: (e: React.MouseEvent) => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "group flex flex-col items-center justify-center w-14 h-14 rounded-lg border transition-colors",
      active
        ? "bg-[#1e2738] border-[#2b3a55] text-[#60a5fa]"
        : "bg-[#161616] border-[#2E2E2E] text-neutral-500 hover:border-white/10 hover:text-neutral-300"
    )}
  >
    <ChevronUp size={18} className={cn("transition-transform group-hover:-translate-y-0.5", active ? "text-[#60a5fa]" : "")} />
    <span className="text-[16px] font-semibold -mt-1.5">{votes}</span>
  </button>
);

const FeedbackCard = ({ item, hasVoted, onVote, viewMode = 'list' }: { item: any; hasVoted: boolean; onVote: () => void; viewMode?: 'list' | 'grid' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const addComment = useMutation(api.comments.addComment);
  const comments = useQuery(
    api.comments.listComments,
    isExpanded ? { itemId: item._id, itemType: "feedback" } : "skip"
  );
  const commentCount = useQuery(api.comments.getCommentCount, {
    itemId: item._id,
    itemType: "feedback",
  });

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await addComment({
        itemId: item._id,
        itemType: "feedback",
        content: newComment,
        isAnonymous: false,
      });
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  // Matching TaskCard tag styles
  const getCategoryStyle = (category?: string) => {
    if (category === "Feature") return "bg-[#1e2738] text-[#60a5fa] border border-[#2b3a55]";
    if (category === "Improvement") return "bg-[#192b23] text-[#4ade80] border border-[#223d2e]";
    if (category === "Bug") return "bg-[#351c1c] text-[#f87171] border border-[#452222]";
    return "bg-neutral-800 text-neutral-400 border border-neutral-700";
  };

  // Grid view - compact vertical card
  if (viewMode === 'grid') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1E1E1E] rounded-xl border border-[#2E2E2E] hover:border-white/10 transition-colors group overflow-hidden flex flex-col"
      >
        <div className="p-4 flex flex-col flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          {/* Header with tags and options */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              {item.category && (
                <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md", getCategoryStyle(item.category))}>
                  {item.category}
                </span>
              )}
              <StatusBadge status={item.status} />
            </div>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-neutral-600 hover:text-neutral-300 hover:bg-white/5 rounded transition-colors shrink-0"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Title */}
          <h3 className="text-[17px] leading-snug font-normal text-white group-hover:text-blue-400 transition-colors mb-2">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-[14px] text-neutral-500 leading-relaxed line-clamp-3 flex-1">{item.description}</p>

          {/* Separator */}
          <div className="border-t border-[#2E2E2E] mt-4"></div>

          {/* Footer with vote and meta */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={(e) => { e.stopPropagation(); onVote(); }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors",
                hasVoted
                  ? "bg-[#1e2738] border-[#2b3a55] text-[#60a5fa]"
                  : "bg-[#161616] border-[#2E2E2E] text-neutral-500 hover:border-white/10 hover:text-neutral-300"
              )}
            >
              <ChevronUp size={14} />
              <span className="text-[13px] font-semibold">{item.votes}</span>
            </button>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[7px] text-white font-bold">
                {item.isAnonymous ? '?' : 'U'}
              </div>
              <span className="font-medium">{item.isAnonymous ? 'Anon' : 'User'}</span>
              <span className="text-neutral-600">·</span>
              <span>{formatDate(item._creationTime)}</span>
              <span className="text-neutral-600">·</span>
              <span className="flex items-center gap-1">
                <MessageSquare size={11} />
                {commentCount || 0}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // List view - horizontal layout with side upvote button
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#1E1E1E] rounded-xl border border-[#2E2E2E] hover:border-white/10 transition-colors group overflow-hidden"
    >
      <div className="flex gap-3 sm:gap-4 p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <UpvoteButton votes={item.votes} active={hasVoted} onClick={(e) => { e.stopPropagation(); onVote(); }} />

        <div className="flex-1 flex flex-col gap-1">
          {/* Title row with tags */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[19px] leading-snug font-normal text-white group-hover:text-blue-400 transition-colors mt-0.5">
              {item.title}
            </h3>
            <button
              onClick={(e) => e.stopPropagation()}
              className="sm:hidden p-1 text-neutral-600 hover:text-neutral-300 hover:bg-white/5 rounded transition-colors shrink-0"
            >
              <MoreHorizontal size={16} />
            </button>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {item.category && (
                <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md", getCategoryStyle(item.category))}>
                  {item.category}
                </span>
              )}
              <StatusBadge status={item.status} />
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 text-neutral-600 hover:text-neutral-300 hover:bg-white/5 rounded transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Mobile tags */}
          <div className="flex items-center gap-2 sm:hidden">
            {item.category && (
              <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md", getCategoryStyle(item.category))}>
                {item.category}
              </span>
            )}
            <StatusBadge status={item.status} />
          </div>

          {/* Description */}
          <p className="text-[16px] text-neutral-500 leading-relaxed line-clamp-2">{item.description}</p>

          {/* Separator */}
          <div className="border-t border-[#2E2E2E] mt-5"></div>

          {/* Footer meta */}
          <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[7px] text-white font-bold">
                {item.isAnonymous ? '?' : 'U'}
              </div>
              <span className="font-medium">{item.isAnonymous ? 'Anonymous' : 'User'}</span>
            </div>
            <span className="text-neutral-600">·</span>
            <span>{formatDate(item._creationTime)}</span>
            <span className="text-neutral-600">·</span>
            <button className="flex items-center gap-1 hover:text-neutral-300 transition-colors">
              <MessageSquare size={11} />
              <span>{commentCount || 0}</span>
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-[#2E2E2E] px-4 pb-4"
        >
          <div className="pt-4 space-y-4">
            <div>
              <p className="text-[13px] text-neutral-300 leading-relaxed">{item.description}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Comments</h4>

              {comments === undefined ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-neutral-700 border-t-neutral-400 mx-auto"></div>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-[11px] text-neutral-600 py-2">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-[#161616] rounded-lg p-3 space-y-2 border border-[#2E2E2E]">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[7px] text-white font-bold">
                        {comment.isAnonymous ? '?' : comment.userName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-medium text-neutral-300">{comment.userName}</span>
                      <span className="text-[10px] text-neutral-600">{formatDate(comment._creationTime)}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 text-[13px] bg-[#161616] border border-[#2E2E2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 text-neutral-200 placeholder:text-neutral-600"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddComment(); }}
                  className="px-4 py-2 bg-blue-600 text-white text-[11px] font-medium rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const CreatePostInput = ({ onSubmit, category }: { onSubmit: (title: string, description: string, category: string) => Promise<void>; category: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    await onSubmit(title, description, category);
    setTitle("");
    setDescription("");
    setIsExpanded(false);
  };

  return (
    <motion.div
      layout
      className={`bg-[#161616] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all ${isExpanded ? 'p-6 ring-2 ring-blue-500/10' : 'p-2 items-center flex gap-3'}`}
    >
      {!isExpanded ? (
        <>
          <div className="w-8 h-8 rounded-lg bg-[#1E1E1E] flex items-center justify-center text-neutral-500 ml-2">
            <Plus size={18} />
          </div>
          <input
            type="text"
            placeholder="I have a suggestion..."
            className="flex-1 bg-transparent text-sm outline-none h-10 text-neutral-300 placeholder:text-neutral-600"
            onFocus={() => setIsExpanded(true)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">
            Submit
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-neutral-200">Create a new post</h3>
            <button onClick={() => setIsExpanded(false)} className="text-neutral-500 hover:text-neutral-300">
              <X size={16} />
            </button>
          </div>
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short, descriptive title"
            className="w-full text-lg font-medium placeholder:text-neutral-600 outline-none border-b border-white/5 pb-2 bg-transparent text-neutral-200"
          />
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your suggestion in detail..."
            className="w-full text-sm text-neutral-300 placeholder:text-neutral-600 outline-none resize-none bg-transparent"
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
            <button onClick={() => setIsExpanded(false)} className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-300 font-medium">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 flex items-center gap-2">
              Submit Post <CornerDownRight size={14} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Kanban Header - copied from UI App.jsx
const KanbanHeader = ({ viewMode, setViewMode }: { viewMode: string; setViewMode: (mode: string) => void }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2 mb-6">
    <div className="flex items-center gap-2 bg-[#1E1E1E] p-1 rounded-lg border border-white/5">
      <button
        onClick={() => setViewMode("list")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all",
          viewMode === "list"
            ? "bg-[#2C2C2C] text-neutral-100 shadow-sm border border-white/5"
            : "text-neutral-400 hover:text-neutral-200"
        )}
      >
        <LayoutGrid size={16} />
        Default view
      </button>
      <button
        onClick={() => setViewMode("board")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all",
          viewMode === "board"
            ? "bg-[#2C2C2C] text-neutral-100 shadow-sm border border-white/5"
            : "text-neutral-400 hover:text-neutral-200"
        )}
      >
        <List size={16} className="rotate-90" />
        Board
      </button>
    </div>

    <div className="flex items-center gap-4 ml-auto">
      <div className="flex items-center gap-3 text-neutral-400">
        <button className="hover:text-neutral-200 transition-colors"><Filter size={18} /></button>
        <button className="hover:text-neutral-200 transition-colors"><ArrowUpDown size={18} /></button>
        <button className="hover:text-neutral-200 transition-colors"><Search size={18} /></button>
      </div>
      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
        New <div className="h-4 w-px bg-blue-400/50 mx-1" /><Plus size={16} />
      </button>
    </div>
  </div>
);

const Dashboard = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState('features');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('board');
  const [feedbackViewMode, setFeedbackViewMode] = useState<'list' | 'grid'>('list');
  const { signOut } = useAuthActions();

  // Database hooks
  const submitFeedback = useMutation(api.feedback.submitFeedback);
  const voteFeedback = useMutation(api.feedback.voteFeedback);
  const feedbackList = useQuery(api.feedback.listFeedback, {});
  const userVotes = useQuery(api.feedback.getUserVotes, {
    sessionId: getSessionId(),
  });

  const roadmapItems = useQuery(api.roadmap.listRoadmapItems, {});

  // Handle feedback submission
  const handleSubmitFeedback = async (title: string, description: string, category: string) => {
    try {
      await submitFeedback({
        title,
        description,
        category,
        isAnonymous: false,
      });
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  // Handle voting
  const handleVote = async (feedbackId: string) => {
    try {
      await voteFeedback({
        feedbackId: feedbackId as any,
        sessionId: getSessionId(),
      });
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  // Get voted items set
  const votedFeedbackItems = new Set(
    userVotes?.filter((v) => v.itemType === "feedback").map((v) => v.itemId) || []
  );

  // Filter Logic
  const getFilteredItems = () => {
    if (activeTab === 'roadmap') return roadmapItems || [];

    let items = feedbackList || [];
    if (activeTab === 'bugs') items = items.filter(i => i.category === 'Bug');
    if (activeTab === 'features') items = items.filter(i => i.category === 'Feature' || i.category === 'Improvement');

    if (searchQuery) {
      items = items.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return items;
  };

  const filteredItems = getFilteredItems();

  // Transform roadmap items for Kanban - matching original UI pattern exactly
  // useState with initial data, useEffect to sync when DB changes
  const [tasks, setTasks] = useState<Array<{
    id: string;
    columnId: string;
    title: string;
    desc: string;
    tag: string;
    priority: "High" | "Medium" | "Low";
  }>>([]);

  // Sync local state when roadmap items load/change from DB
  useEffect(() => {
    if (roadmapItems) {
      setTasks(roadmapItems.map(item => ({
        id: item._id,
        columnId: item.status === 'planned' ? 'not-started' :
                  item.status === 'in-progress' ? 'in-progress' :
                  item.status === 'live' ? 'completed' : 'no-status',
        title: item.title,
        desc: item.description || '',
        tag: item.category || '',
        priority: "High" as const,
      })));
    }
  }, [roadmapItems]);

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-neutral-200">
      {/* Header Area */}
      <header className="bg-[#0f0f10] border-b border-white/5 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
              <span className="font-bold text-sm tracking-tighter">Ac</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-neutral-100 leading-none">Acme Feedback</h1>
              <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Public Roadmap & Request Board</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:bg-white/5 hover:text-neutral-300 transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-[#09090b]">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* Hero / Intro */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="space-y-2 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-100">Help us build a better product.</h2>
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
        <div className="min-h-[400px]">
          {activeTab === 'roadmap' ? (
            // Roadmap Kanban View - using exact UI component
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {roadmapItems === undefined ? (
                <div className="text-center py-12 w-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-neutral-700 border-t-blue-500 mx-auto"></div>
                </div>
              ) : roadmapItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#161616] flex items-center justify-center">
                    <LayoutGrid size={24} className="text-neutral-600" />
                  </div>
                  <p className="text-lg font-medium text-neutral-400">Roadmap coming soon</p>
                  <p className="text-sm text-neutral-600 mt-1">Check back later for updates on our plans</p>
                </div>
              ) : (
                <>
                  <KanbanHeader viewMode={viewMode} setViewMode={setViewMode} />
                  {viewMode === "board" ? (
                    <KanbanBoard tasks={tasks} setTasks={setTasks} columns={COLUMNS} />
                  ) : (
                    <ListView tasks={tasks} columns={COLUMNS} />
                  )}
                </>
              )}
            </motion.div>
          ) : (
            // List View (Features & Bugs)
            <div className="space-y-6">
              <CreatePostInput
                onSubmit={handleSubmitFeedback}
                category={activeTab === 'bugs' ? 'Bug' : 'Feature'}
              />

              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{filteredItems.length} Posts</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-[#1E1E1E] p-1 rounded-lg border border-white/5">
                    <button
                      onClick={() => setFeedbackViewMode('list')}
                      className={cn(
                        "p-1.5 rounded transition-all",
                        feedbackViewMode === 'list'
                          ? "bg-[#2C2C2C] text-neutral-100 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-300"
                      )}
                    >
                      <List size={16} />
                    </button>
                    <button
                      onClick={() => setFeedbackViewMode('grid')}
                      className={cn(
                        "p-1.5 rounded transition-all",
                        feedbackViewMode === 'grid'
                          ? "bg-[#2C2C2C] text-neutral-100 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-300"
                      )}
                    >
                      <LayoutGrid size={16} />
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-neutral-500 font-medium uppercase tracking-wider hover:text-neutral-300 transition-colors">
                    <Filter size={12} /> Sort by: Top Voted
                  </button>
                </div>
              </div>

              <motion.div layout className={cn(
                feedbackViewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              )}>
                <AnimatePresence>
                  {feedbackList === undefined ? (
                    <div className={cn("text-center py-12", feedbackViewMode === 'grid' && "col-span-full")}>
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-neutral-700 border-t-blue-500 mx-auto"></div>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className={cn("py-20 text-center text-neutral-500", feedbackViewMode === 'grid' && "col-span-full")}>
                      <p>No posts found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <FeedbackCard
                        key={item._id}
                        item={item}
                        hasVoted={votedFeedbackItems.has(item._id)}
                        onVote={() => handleVote(item._id)}
                        viewMode={feedbackViewMode}
                      />
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
