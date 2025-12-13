"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ChevronUp } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

// Status badge styling
const StatusBadge = ({ status }: { status: string }) => {
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

// Category badge styling
const getCategoryStyle = (category?: string) => {
  if (category === "Feature") return "bg-[#1e2738] text-[#60a5fa] border border-[#2b3a55]";
  if (category === "Improvement") return "bg-[#192b23] text-[#4ade80] border border-[#223d2e]";
  if (category === "Bug") return "bg-[#351c1c] text-[#f87171] border border-[#452222]";
  return "bg-neutral-800 text-neutral-400 border border-neutral-700";
};

// Upvote button
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

interface PublicFeedbackCardProps {
  item: FeedbackItem;
  hasVoted: boolean;
  onVote: () => void;
  viewMode?: 'list' | 'grid';
  teamId: Id<"teams">;
}

export function PublicFeedbackCard({ item, hasVoted, onVote, viewMode = 'list', teamId }: PublicFeedbackCardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const addComment = useMutation(api.comments.addComment);
  const comments = useQuery(
    api.public.listPublicComments,
    isSheetOpen ? { teamId, itemId: item._id, itemType: "feedback" } : "skip"
  );
  const commentCount = useQuery(api.public.getPublicCommentCount, {
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
        isAnonymous: true,
        isPublicSubmission: true,
      });
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
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

  // Grid view - compact vertical card (NO admin dropdown)
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
            {/* Header with tags */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {item.category && (
                <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md", getCategoryStyle(item.category))}>
                  {item.category}
                </span>
              )}
              <StatusBadge status={item.status} />
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

  // List view - horizontal layout with side upvote button (NO admin dropdown)
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
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                {item.category && (
                  <span className={cn("text-[11px] font-medium px-2 py-1 rounded-md", getCategoryStyle(item.category))}>
                    {item.category}
                  </span>
                )}
                <StatusBadge status={item.status} />
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
}
