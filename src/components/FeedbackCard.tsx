import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { getSessionId } from "../lib/session";

const statusColors = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  "under-review": "bg-purple-100 text-purple-700 border-purple-200",
  planned: "bg-indigo-100 text-indigo-700 border-indigo-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const categoryColors = {
  Bug: "bg-red-100 text-red-700",
  Feature: "bg-blue-100 text-blue-700",
  Improvement: "bg-green-100 text-green-700",
  Other: "bg-gray-100 text-gray-700",
  "UI/UX": "bg-pink-100 text-pink-700",
  Integration: "bg-cyan-100 text-cyan-700",
  Performance: "bg-orange-100 text-orange-700",
  Mobile: "bg-violet-100 text-violet-700",
};

export function FeedbackCard({
  item,
  hasVoted,
  itemType,
}: {
  item: any;
  hasVoted: boolean;
  itemType: "feedback" | "feature";
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const voteMutation = useMutation(
    itemType === "feedback" ? api.feedback.voteFeedback : api.featureRequests.voteFeatureRequest
  );
  const addComment = useMutation(api.comments.addComment);
  const comments = useQuery(api.comments.listComments, {
    itemId: item._id,
    itemType,
  });

  const handleVote = async () => {
    try {
      if (itemType === "feedback") {
        await voteMutation({
          feedbackId: item._id as Id<"feedback">,
          sessionId: getSessionId(),
        });
      } else {
        await voteMutation({
          requestId: item._id as Id<"featureRequests">,
          sessionId: getSessionId(),
        });
      }
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      await addComment({
        itemId: item._id,
        itemType,
        content: commentText.trim(),
        isAnonymous,
      });
      
      setCommentText("");
      setIsAnonymous(false);
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all">
      <div className="flex gap-4">
        <button
          onClick={handleVote}
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-all ${
            hasVoted
              ? "bg-indigo-50 border-indigo-500 text-indigo-600"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <span className="text-sm font-bold">{item.votes}</span>
        </button>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
            <p className="text-slate-600 mt-1">{item.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                categoryColors[item.category as keyof typeof categoryColors] || categoryColors.Other
              }`}
            >
              {item.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                statusColors[item.status as keyof typeof statusColors] || statusColors.new
              }`}
            >
              {item.status.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </span>
          </div>

          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {comments?.length || 0} Comments
          </button>

          {showComments && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none text-sm"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`anon-${item._id}`}
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor={`anon-${item._id}`} className="text-xs text-slate-600">
                      Comment anonymously
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all"
                  >
                    Post
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {comments?.map((comment) => (
                  <div key={comment._id} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(comment._creationTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
