import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ChevronUp,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  Zap,
  CornerDownRight,
  X,
  LogOut
} from 'lucide-react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { getSessionId } from "../lib/session";
import { useAuthActions } from "@convex-dev/auth/react";

// --- Components ---

const StatusBadge = ({ status }) => {
  const styles = {
    'new': 'bg-zinc-100 text-zinc-500 border-zinc-200',
    'under-review': 'bg-zinc-100 text-zinc-500 border-zinc-200',
    'planned': 'bg-blue-50 text-blue-600 border-blue-100',
    'in-progress': 'bg-amber-50 text-amber-600 border-amber-100',
    'resolved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'live': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  const labels = {
    'new': 'New',
    'under-review': 'Under Review',
    'planned': 'Planned',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'live': 'Live',
  };

  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styles[status] || styles['new']}`}>
      {labels[status] || status}
    </span>
  );
};

const UpvoteButton = ({ votes, active, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex flex-col items-center justify-center w-12 h-14 rounded-xl border transition-all duration-200 ${active ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:shadow-sm'}`}
  >
    <ChevronUp size={18} className={`mb-1 transition-transform group-hover:-translate-y-0.5 ${active ? 'text-white' : 'text-zinc-400'}`} />
    <span className="text-xs font-bold">{votes}</span>
  </button>
);

const FeedbackCard = ({ item, hasVoted, onVote }) => {
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-lg hover:shadow-zinc-100/50 transition-all duration-300 group overflow-hidden"
    >
      <div className="flex gap-4 p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="hidden sm:block">
          <UpvoteButton votes={item.votes} active={hasVoted} onClick={(e) => { e.stopPropagation(); onVote(); }} />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <div className="flex items-center gap-2 sm:hidden">
                <button
                  onClick={(e) => { e.stopPropagation(); onVote(); }}
                  className="text-xs font-bold text-zinc-500 flex items-center gap-1 hover:text-zinc-900"
                >
                  <ChevronUp size={12} className={hasVoted ? 'fill-current' : ''} /> {item.votes}
                </button>
                <span className="text-zinc-300">•</span>
                <StatusBadge status={item.status} />
              </div>
            </div>
            <div className="hidden sm:block">
              <StatusBadge status={item.status} />
            </div>
          </div>

          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{item.description}</p>

          <div className="flex items-center gap-4 pt-2 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 flex items-center justify-center text-[8px] text-zinc-600 font-bold">
                {item.isAnonymous ? '?' : 'U'}
              </div>
              <span>{item.isAnonymous ? 'Anonymous' : 'User'}</span>
            </div>
            <button className="flex items-center gap-1 hover:text-zinc-600 transition-colors">
              <MessageSquare size={12} />
              <span>{commentCount || 0} comments</span>
            </button>
            <span>{formatDate(item._creationTime)}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-zinc-100 px-6 pb-6"
        >
          <div className="pt-4 space-y-4">
            {/* Full Description */}
            <div>
              <p className="text-sm text-zinc-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Comments Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Comments</h4>

              {comments === undefined ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-zinc-200 border-t-zinc-900 mx-auto"></div>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-xs text-zinc-400 py-2">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-zinc-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-zinc-300 to-zinc-400 flex items-center justify-center text-[7px] text-zinc-700 font-bold">
                        {comment.isAnonymous ? '?' : comment.userName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-zinc-700">{comment.userName}</span>
                      <span className="text-[10px] text-zinc-400">{formatDate(comment._creationTime)}</span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}

              {/* Add Comment Form */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-300"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddComment(); }}
                  className="px-4 py-2 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors"
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

const RoadmapColumn = ({ title, status, items, icon: Icon, colorClass }) => (
  <div className="min-w-[280px] flex-1 flex flex-col gap-4">
    <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 mb-2">
      <Icon size={16} className={colorClass} />
      <h3 className="font-semibold text-sm text-zinc-900">{title}</h3>
      <span className="ml-auto text-xs bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full">{items.length}</span>
    </div>
    <div className="space-y-3">
      {items.map(item => (
        <motion.div
          key={item._id}
          layout
          className="p-4 bg-white rounded-xl border border-zinc-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-1 h-full ${colorClass.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-zinc-400">{item.category}</span>
            <div className="flex items-center gap-1 text-xs font-bold text-zinc-600">
              <ChevronUp size={12} /> {item.votes}
            </div>
          </div>
          <h4 className="text-sm font-semibold text-zinc-900 mb-1 leading-snug">{item.title}</h4>
          <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{item.description}</p>
          {item.quarter && (
            <div className="flex items-center gap-2 mt-3 text-[10px] text-zinc-400">
              {item.quarter}
            </div>
          )}
        </motion.div>
      ))}
      {items.length === 0 && (
        <div className="h-32 border-2 border-dashed border-zinc-100 rounded-xl flex items-center justify-center text-xs text-zinc-300">
          No items yet
        </div>
      )}
    </div>
  </div>
);

const CreatePostInput = ({ onSubmit, category }) => {
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
      className={`bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isExpanded ? 'p-6 ring-2 ring-zinc-900/5' : 'p-2 items-center flex gap-3'}`}
    >
      {!isExpanded ? (
        <>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 ml-2">
            <Plus size={18} />
          </div>
          <input
            type="text"
            placeholder="I have a suggestion..."
            className="flex-1 bg-transparent text-sm outline-none h-10 text-zinc-600 placeholder:text-zinc-400"
            onFocus={() => setIsExpanded(true)}
          />
          <button className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
            Submit
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-zinc-900">Create a new post</h3>
            <button onClick={() => setIsExpanded(false)} className="text-zinc-400 hover:text-zinc-600">
              <X size={16} />
            </button>
          </div>
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short, descriptive title"
            className="w-full text-lg font-medium placeholder:text-zinc-300 outline-none border-b border-zinc-100 pb-2"
          />
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your suggestion in detail..."
            className="w-full text-sm text-zinc-600 placeholder:text-zinc-300 outline-none resize-none"
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-50">
            <button onClick={() => setIsExpanded(false)} className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 font-medium">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 flex items-center gap-2">
              Submit Post <CornerDownRight size={14} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const Dashboard = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState('features');
  const [searchQuery, setSearchQuery] = useState('');
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
  const votedItems = new Set(
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

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900">
      {/* Header Area */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white shadow-md shadow-zinc-200">
              <span className="font-bold text-sm tracking-tighter">Ac</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-900 leading-none">Acme Feedback</h1>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Public Roadmap & Request Board</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" className="w-full h-full opacity-80" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {/* Hero / Intro */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div className="space-y-2 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">Help us build a better product.</h2>
            <p className="text-zinc-500 text-sm md:text-base">
              Vote on existing requests or suggest a new feature. We read every piece of feedback.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="w-full md:w-64 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search feedback..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-zinc-100 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-zinc-200 mb-8 gap-8">
          {['features', 'bugs', 'roadmap'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-4 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                activeTab === tab ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {tab === 'features' ? 'Feature Requests' : tab === 'bugs' ? 'Bug Reports' : 'Roadmap'}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'roadmap' ? (
            // Roadmap Kanban View
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4"
            >
              {roadmapItems === undefined ? (
                <div className="text-center py-12 w-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-zinc-200 border-t-zinc-900 mx-auto"></div>
                </div>
              ) : (
                <>
                  <RoadmapColumn
                    title="Planned"
                    status="planned"
                    items={(roadmapItems || []).filter(i => i.status === 'planned')}
                    icon={CheckCircle2}
                    colorClass="text-blue-500"
                  />
                  <RoadmapColumn
                    title="In Progress"
                    status="in-progress"
                    items={(roadmapItems || []).filter(i => i.status === 'in-progress')}
                    icon={Clock}
                    colorClass="text-amber-500"
                  />
                  <RoadmapColumn
                    title="Live"
                    status="live"
                    items={(roadmapItems || []).filter(i => i.status === 'live')}
                    icon={Zap}
                    colorClass="text-emerald-500"
                  />
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

              <div className="flex justify-between items-center text-xs text-zinc-400 font-medium uppercase tracking-wider">
                <span>{filteredItems.length} Posts</span>
                <button className="flex items-center gap-1 hover:text-zinc-600">
                  <Filter size={12} /> Sort by: Top Voted
                </button>
              </div>

              <motion.div layout className="space-y-4">
                <AnimatePresence>
                  {feedbackList === undefined ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-zinc-200 border-t-zinc-900 mx-auto"></div>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="py-20 text-center text-zinc-400">
                      <p>No posts found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <FeedbackCard
                        key={item._id}
                        item={item}
                        hasVoted={votedItems.has(item._id)}
                        onVote={() => handleVote(item._id)}
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