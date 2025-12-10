"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ChevronUp,
  Search,
  Filter,
  Plus,
  CornerDownRight,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { getSessionId } from "../lib/session";
import { useTeam } from "@/contexts/TeamContext";
import { KanbanBoard, ListView } from "./Kanban";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { FeedbackDialog } from "./FeedbackDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { clsx } from "clsx"
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

const FeedbackCard = ({ item, hasVoted, onVote, onEdit, onDelete, onAddToKanban, viewMode = 'list', teamId }: { item: any; hasVoted: boolean; onVote: () => void; onEdit: () => void; onDelete: () => void; onAddToKanban: () => void; viewMode?: 'list' | 'grid'; teamId: Id<"teams"> }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const addComment = useMutation(api.comments.addComment);
  const comments = useQuery(
    api.comments.listComments,
    isSheetOpen ? { teamId, itemId: item._id, itemType: "feedback" } : "skip"
  );
  const commentCount = useQuery(api.comments.getCommentCount, {
    teamId,
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
        teamId,
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

  // Sheet content (shared between views)
  const sheetContent = (
    <SheetContent className="bg-[#161616] border-l-[#2E2E2E]">
      <SheetHeader>
        <div className="flex items-center gap-2 mb-2">
          {item.category && (
            <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md", getCategoryStyle(item.category))}>
              {item.category}
            </span>
          )}
          <StatusBadge status={item.status} />
        </div>
        <SheetTitle className="text-xl font-normal text-neutral-100">{item.title}</SheetTitle>
        <SheetDescription className="text-neutral-500">
          {item.isAnonymous ? 'Anonymous' : 'User'} · {formatDate(item._creationTime)}
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-6">
        <p className="text-[15px] text-neutral-300 leading-relaxed">{item.description}</p>

        <div className="space-y-4">
          <h4 className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Comments</h4>

          {comments === undefined ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-neutral-700 border-t-neutral-400 mx-auto"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-[13px] text-neutral-600 py-2">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="bg-[#1E1E1E] rounded-lg p-3 space-y-2 border border-[#2E2E2E]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[8px] text-white font-bold">
                    {comment.isAnonymous ? '?' : comment.userName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[12px] font-medium text-neutral-300">{comment.userName}</span>
                  <span className="text-[11px] text-neutral-600">{formatDate(comment._creationTime)}</span>
                </div>
                <p className="text-[13px] text-neutral-400 leading-relaxed">{comment.content}</p>
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
              className="flex-1 px-3 py-2.5 text-[14px] bg-[#1E1E1E] border border-[#2E2E2E] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 text-neutral-200 placeholder:text-neutral-600"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2.5 bg-blue-600 text-white text-[13px] font-normal rounded-lg hover:bg-blue-500 transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </SheetContent>
  );

  // Grid view - compact vertical card
  if (viewMode === 'grid') {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1E1E1E] rounded-xl border border-[#2E2E2E] hover:border-white/10 transition-colors group overflow-hidden flex flex-col"
        >
          <div className="p-4 flex flex-col flex-1 cursor-pointer" onClick={() => setIsSheetOpen(true)}>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-neutral-600 hover:text-neutral-300 hover:bg-white/5 rounded transition-colors shrink-0"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-[#2E2E2E]" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuLabel className="text-neutral-400">Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#2E2E2E]" />
                  <DropdownMenuItem
                    className="text-neutral-300 focus:bg-[#2E2E2E] focus:text-white cursor-pointer"
                    onSelect={onEdit}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-neutral-300 focus:bg-[#2E2E2E] focus:text-white cursor-pointer"
                    onSelect={onAddToKanban}
                  >
                    Add to Kanban
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#2E2E2E]" />
                  <DropdownMenuItem
                    className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                    onSelect={onDelete}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        {sheetContent}
      </Sheet>
    );
  }

  // List view - horizontal layout with side upvote button
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1E1E1E] rounded-xl border border-[#2E2E2E] hover:border-white/10 transition-colors group overflow-hidden"
      >
        <div className="flex gap-3 sm:gap-4 p-4 cursor-pointer" onClick={() => setIsSheetOpen(true)}>
          <UpvoteButton votes={item.votes} active={hasVoted} onClick={(e) => { e.stopPropagation(); onVote(); }} />

          <div className="flex-1 flex flex-col gap-1">
            {/* Title row with tags */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[19px] leading-snug font-normal text-white group-hover:text-blue-400 transition-colors mt-0.5">
                {item.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="sm:hidden p-1 text-neutral-600 hover:text-neutral-300 hover:bg-white/5 rounded transition-colors shrink-0"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-[#2E2E2E]" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuLabel className="text-neutral-400">Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#2E2E2E]" />
                  <DropdownMenuItem
                    className="text-neutral-300 focus:bg-[#2E2E2E] focus:text-white cursor-pointer"
                    onSelect={onEdit}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-neutral-300 focus:bg-[#2E2E2E] focus:text-white cursor-pointer"
                    onSelect={onAddToKanban}
                  >
                    Add to Kanban
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#2E2E2E]" />
                  <DropdownMenuItem
                    className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                    onSelect={onDelete}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                {item.category && (
                  <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md", getCategoryStyle(item.category))}>
                    {item.category}
                  </span>
                )}
                <StatusBadge status={item.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-neutral-600 hover:text-neutral-300 hover:bg-white/5 rounded transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-[#2E2E2E]" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuLabel className="text-neutral-400">Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#2E2E2E]" />
                    <DropdownMenuItem
                      className="text-neutral-300 focus:bg-[#2E2E2E] focus:text-white cursor-pointer"
                      onSelect={onEdit}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-neutral-300 focus:bg-[#2E2E2E] focus:text-white cursor-pointer"
                      onSelect={onAddToKanban}
                    >
                      Add to Kanban
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#2E2E2E]" />
                    <DropdownMenuItem
                      className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                      onSelect={onDelete}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
      </motion.div>
      {sheetContent}
    </Sheet>
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

// Kanban Header Actions - filter, sort, search, new button
const KanbanHeaderActions = ({ defaultCategory }: { defaultCategory?: "Bug" | "Feature" | "Improvement" | "Other" }) => (
  <div className="flex items-center gap-4 ml-auto">
    <div className="flex items-center gap-3 text-neutral-400">
      <button className="hover:text-neutral-200 transition-colors"><Filter size={18} /></button>
      <button className="hover:text-neutral-200 transition-colors"><ArrowUpDown size={18} /></button>
      <button className="hover:text-neutral-200 transition-colors"><Search size={18} /></button>
    </div>
    <FeedbackDialog defaultCategory={defaultCategory} />
  </div>
);

interface FeedbackItem {
  _id: Id<"feedback">;
  title: string;
  description: string;
  category: string;
  status: string;
  votes: number;
  isAnonymous: boolean;
  _creationTime: number;
}

const Dashboard = ({ user }: { user: any }) => {
  const { activeTeam } = useTeam();
  const [activeTab, setActiveTab] = useState('features');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackToEdit, setFeedbackToEdit] = useState<FeedbackItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<FeedbackItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get teamId from context
  const teamId = activeTeam?._id;

  // Database hooks - skip queries if no teamId
  const submitFeedback = useMutation(api.feedback.submitFeedback);
  const voteFeedback = useMutation(api.feedback.voteFeedback);
  const deleteFeedback = useMutation(api.feedback.deleteFeedback);
  const feedbackList = useQuery(
    api.feedback.listFeedback,
    teamId ? { teamId } : "skip"
  );
  const userVotes = useQuery(
    api.feedback.getUserVotes,
    teamId ? { teamId, sessionId: getSessionId() } : "skip"
  );

  // Kanban hooks
  const kanbanTasks = useQuery(
    api.kanban.listTasks,
    teamId ? { teamId } : "skip"
  );
  const moveTask = useMutation(api.kanban.moveTask);
  const addFeatureToKanban = useMutation(api.kanban.addFeatureToKanban);
  const removeFromKanban = useMutation(api.kanban.deleteTask);

  const roadmapItems = useQuery(
    api.roadmap.listRoadmapItems,
    teamId ? { teamId } : "skip"
  );

  // Handle feedback submission
  const handleSubmitFeedback = async (title: string, description: string, category: string) => {
    if (!teamId) return;
    try {
      await submitFeedback({
        teamId,
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
    if (!teamId) return;
    try {
      await voteFeedback({
        teamId,
        feedbackId: feedbackId as any,
        sessionId: getSessionId(),
      });
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  // Handle edit
  const handleEdit = (item: FeedbackItem) => {
    setFeedbackToEdit(item);
    setIsEditDialogOpen(true);
  };

  // Handle delete - show confirmation dialog
  const handleDelete = (item: FeedbackItem) => {
    setFeedbackToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!feedbackToDelete || !teamId) return;
    try {
      await deleteFeedback({ teamId, feedbackId: feedbackToDelete._id });
      toast.success("Feedback deleted successfully!");
      setIsDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    } catch (error) {
      toast.error("Failed to delete feedback");
    }
  };

  // Handle add to kanban
  const handleAddToKanban = async (item: FeedbackItem) => {
    if (!teamId) return;
    try {
      await addFeatureToKanban({
        teamId,
        featureId: item._id,
        featureTitle: item.title,
        featureDescription: item.description,
        featureCategory: item.category,
      });
      toast.success("Added to Kanban board!");
    } catch (error: any) {
      if (error.message?.includes("already on the Kanban")) {
        toast.error("This item is already on the Kanban board");
      } else {
        toast.error("Failed to add to Kanban");
      }
    }
  };

  // Handle remove from kanban
  const handleRemoveFromKanban = async (taskId: string) => {
    if (!teamId) return;
    try {
      await removeFromKanban({
        teamId,
        taskId: taskId as Id<"kanbanTasks">,
      });
      toast.success("Removed from Kanban board");
    } catch (error) {
      toast.error("Failed to remove from Kanban");
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

  // Transform kanban tasks for the board - using local state for smooth DnD
  const [tasks, setTasksLocal] = useState<Array<{
    id: string;
    columnId: string;
    title: string;
    desc: string;
    tag: string;
    priority: "High" | "Medium" | "Low";
  }>>([]);

  // Sync local state when kanban tasks load/change from DB
  useEffect(() => {
    if (kanbanTasks) {
      setTasksLocal(kanbanTasks.map(task => ({
        id: task._id,
        columnId: task.columnId,
        title: task.title,
        desc: task.description || '',
        tag: task.category || '',
        priority: (task.priority as "High" | "Medium" | "Low") || "Medium",
      })));
    }
  }, [kanbanTasks]);

  // Custom setTasks that updates both local state and database
  const setTasks = useCallback((updater: React.SetStateAction<typeof tasks>) => {
    if (!teamId) return;
    setTasksLocal(prevTasks => {
      const newTasks = typeof updater === 'function' ? updater(prevTasks) : updater;

      // Find moved task by comparing with previous state
      newTasks.forEach((newTask, newIndex) => {
        const oldTask = prevTasks.find(t => t.id === newTask.id);
        if (oldTask && (oldTask.columnId !== newTask.columnId || prevTasks.indexOf(oldTask) !== newIndex)) {
          // Task was moved - calculate new order within column
          const tasksInColumn = newTasks.filter(t => t.columnId === newTask.columnId);
          const orderInColumn = tasksInColumn.indexOf(newTask);

          // Update database asynchronously
          moveTask({
            teamId,
            taskId: newTask.id as Id<"kanbanTasks">,
            targetColumnId: newTask.columnId,
            newOrder: orderInColumn,
          }).catch(console.error);
        }
      });

      return newTasks;
    });
  }, [moveTask, teamId]);

  return (
    <div className="flex-1 bg-[#09090b] font-sans text-neutral-200 overflow-auto">
      {/* Main Content */}
      <main className="p-6 md:p-8">
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
        <div className="min-h-[400px] overflow-hidden">
          {activeTab === 'roadmap' ? (
            // Roadmap Kanban View - using exact UI component
            kanbanTasks === undefined ? (
              <div className="text-center py-12 w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-neutral-700 border-t-blue-500 mx-auto"></div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#161616] flex items-center justify-center">
                  <LayoutGrid size={24} className="text-neutral-600" />
                </div>
                <p className="text-lg font-medium text-neutral-400">Roadmap coming soon</p>
                <p className="text-sm text-neutral-600 mt-1">Check back later for updates on our plans</p>
              </div>
            ) : (
              <Tabs defaultValue="board" className="w-full max-w-full">
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
                  <KanbanHeaderActions defaultCategory="Feature" />
                </div>
                <TabsContent value="board" className="w-full max-w-full">
                  <div className="pb-2">
                    <KanbanBoard tasks={tasks} setTasks={setTasks} columns={COLUMNS} onRemoveFromKanban={handleRemoveFromKanban} />
                  </div>
                </TabsContent>
                <TabsContent value="list">
                  <ListView tasks={tasks} columns={COLUMNS} />
                </TabsContent>
              </Tabs>
            )
          ) : (
            // Features & Bugs View
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
                <KanbanHeaderActions defaultCategory={activeTab === 'bugs' ? 'Bug' : 'Feature'} />
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
                        <FeedbackCard
                          key={item._id}
                          item={item}
                          hasVoted={votedFeedbackItems.has(item._id)}
                          onVote={() => handleVote(item._id)}
                          onEdit={() => handleEdit(item as FeedbackItem)}
                          onDelete={() => handleDelete(item as FeedbackItem)}
                          onAddToKanban={() => handleAddToKanban(item as FeedbackItem)}
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
                        <FeedbackCard
                          key={item._id}
                          item={item}
                          hasVoted={votedFeedbackItems.has(item._id)}
                          onVote={() => handleVote(item._id)}
                          onEdit={() => handleEdit(item as FeedbackItem)}
                          onDelete={() => handleDelete(item as FeedbackItem)}
                          onAddToKanban={() => handleAddToKanban(item as FeedbackItem)}
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

        {/* Edit Feedback Dialog */}
        <FeedbackDialog
          feedbackToEdit={feedbackToEdit}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setFeedbackToEdit(null);
          }}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[340px] bg-[#161616] border-white/5 p-0 gap-0">
            <div className="p-6">
              <DialogTitle className="text-lg font-medium text-neutral-100">Delete this post?</DialogTitle>
              <p className="text-sm text-neutral-500 mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/5">
              <button
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setFeedbackToDelete(null);
                }}
                className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;
