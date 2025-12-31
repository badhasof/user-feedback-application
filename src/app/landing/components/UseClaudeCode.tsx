"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Icons
const ChevronUp = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

const MessageIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

type TabId = "collect" | "vote" | "prioritize" | "ship";

interface TabContent {
  id: TabId;
  label: string;
  title: string;
  description: string;
}

const tabsData: TabContent[] = [
  {
    id: "collect",
    label: "Collect",
    title: "Collect feedback",
    description: "Embed a beautiful widget on your site. Users submit ideas, report bugs, and request features—all organized in one place.",
  },
  {
    id: "vote",
    label: "Vote",
    title: "Let users vote",
    description: "Your community upvotes what matters most. Popular requests rise to the top, showing you exactly what to build next.",
  },
  {
    id: "prioritize",
    label: "Prioritize",
    title: "Prioritize with data",
    description: "Sort by votes, filter by tags, and see what your users actually want. Make product decisions backed by real demand.",
  },
  {
    id: "ship",
    label: "Ship",
    title: "Ship and update",
    description: "Move items through your workflow. Mark features as planned, in progress, or live—and keep users in the loop automatically.",
  },
];

// Feedback item type
interface FeedbackItem {
  id: number;
  title: string;
  description: string;
  votes: number;
  comments: number;
  status: "new" | "planned" | "building" | "live";
  author: string;
}

const feedbackItems: FeedbackItem[] = [
  { id: 1, title: "Dark mode support", description: "Add a dark theme option for the dashboard and all pages", votes: 127, comments: 23, status: "planned", author: "Sarah K." },
  { id: 2, title: "Mobile app", description: "Native iOS and Android apps for on-the-go access", votes: 89, comments: 15, status: "building", author: "Mike R." },
  { id: 3, title: "API access", description: "Public REST API for integrations and automation", votes: 56, comments: 8, status: "new", author: "Alex T." },
  { id: 4, title: "Slack notifications", description: "Get notified in Slack when new feedback arrives", votes: 43, comments: 12, status: "live", author: "Jordan P." },
];

const statusConfig = {
  new: { bg: "bg-[#f4f4f5]", text: "text-[#52525b]", label: "New", dot: "bg-[#71717a]" },
  planned: { bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]", label: "Planned", dot: "bg-[#3b82f6]" },
  building: { bg: "bg-[#fef3c7]", text: "text-[#b45309]", label: "In Progress", dot: "bg-[#f59e0b]" },
  live: { bg: "bg-[#dcfce7]", text: "text-[#15803d]", label: "Live", dot: "bg-[#22c55e]" },
};

// Realistic Feedback Card
const FeedbackCard = ({
  item,
  isHighlighted = false,
  isVoting = false,
  animatedVotes,
}: {
  item: FeedbackItem;
  isHighlighted?: boolean;
  isVoting?: boolean;
  animatedVotes?: number;
}) => {
  const status = statusConfig[item.status];
  const displayVotes = animatedVotes ?? item.votes;

  return (
    <motion.div
      layout
      className={`bg-white border rounded-xl p-4 w-full transition-all duration-300 shadow-sm ${
        isHighlighted ? "border-[#10a37f] shadow-[0_0_20px_rgba(16,163,127,0.15)]" : "border-[#e5e4e0]"
      }`}
    >
      <div className="flex gap-3">
        {/* Upvote Button */}
        <motion.div
          className={`flex flex-col items-center justify-center min-w-[52px] h-[52px] rounded-lg border transition-all ${
            isVoting
              ? "bg-[#f0fdf4] border-[#10a37f] shadow-[0_0_12px_rgba(16,163,127,0.2)]"
              : "bg-[#f8f8f6] border-[#e5e4e0]"
          }`}
          animate={isVoting ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ChevronUp className={isVoting ? "text-[#10a37f]" : "text-[#8e8d89]"} />
          <motion.span
            key={displayVotes}
            className={`text-sm font-semibold -mt-0.5 ${isVoting ? "text-[#10a37f]" : "text-[#5e5d59]"}`}
            initial={isVoting ? { y: 8, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {displayVotes}
          </motion.span>
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-[#141413] text-[15px] font-medium leading-tight">
              {item.title}
            </h4>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 ${status.bg} ${status.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <p className="text-[#5e5d59] text-[13px] leading-relaxed mb-2 line-clamp-2">
            {item.description}
          </p>
          <div className="flex items-center gap-3 text-[12px] text-[#8e8d89]">
            <span>{item.author}</span>
            <span className="flex items-center gap-1">
              <MessageIcon className="text-[#8e8d89]" />
              {item.comments}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Collect Animation: Cards appear one by one like users are submitting
const CollectAnimation = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  useEffect(() => {
    setVisibleCount(0);
    setHighlightedId(null);

    const showNextCard = (index: number) => {
      if (index >= 4) {
        // Reset after showing all
        setTimeout(() => {
          setVisibleCount(0);
          setHighlightedId(null);
          setTimeout(() => showNextCard(0), 500);
        }, 3000);
        return;
      }

      setVisibleCount(index + 1);
      setHighlightedId(feedbackItems[index].id);

      // Remove highlight after a moment
      setTimeout(() => setHighlightedId(null), 1000);

      // Show next card
      setTimeout(() => showNextCard(index + 1), 1500);
    };

    const timeout = setTimeout(() => showNextCard(0), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full max-w-[480px] mx-auto">
      <AnimatePresence mode="popLayout">
        {feedbackItems.slice(0, visibleCount).map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <FeedbackCard item={item} isHighlighted={highlightedId === item.id} />
          </motion.div>
        ))}
      </AnimatePresence>
      {visibleCount === 0 && (
        <div className="text-center text-[#8e8d89] text-sm py-20">
          Waiting for feedback...
        </div>
      )}
    </div>
  );
};

// Vote Animation: Show voting happening in real-time
const VoteAnimation = () => {
  const [votes, setVotes] = useState([127, 89, 56]);
  const [votingCard, setVotingCard] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const cardIndex = Math.floor(Math.random() * 3);
      setVotingCard(cardIndex);

      setTimeout(() => {
        setVotes(prev => {
          const newVotes = [...prev];
          newVotes[cardIndex] += 1;
          return newVotes;
        });
      }, 300);

      setTimeout(() => setVotingCard(null), 800);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const items = feedbackItems.slice(0, 3);

  return (
    <div className="flex flex-col gap-3 w-full max-w-[480px] mx-auto">
      {items.map((item, idx) => (
        <FeedbackCard
          key={item.id}
          item={item}
          isVoting={votingCard === idx}
          animatedVotes={votes[idx]}
        />
      ))}
    </div>
  );
};

// Prioritize Animation: Cards reorder by votes
const PrioritizeAnimation = () => {
  const [order, setOrder] = useState([0, 1, 2]);
  const items = feedbackItems.slice(0, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrder(prev => {
        const newOrder = [...prev];
        // Swap two random positions
        const i = Math.floor(Math.random() * newOrder.length);
        const j = Math.floor(Math.random() * newOrder.length);
        if (i !== j) {
          [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
        }
        return newOrder;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full max-w-[480px] mx-auto">
      <AnimatePresence mode="popLayout">
        {order.map((idx, position) => (
          <motion.div
            key={items[idx].id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              layout: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              opacity: { duration: 0.3 }
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-[#8e8d89] text-sm font-medium w-6">#{position + 1}</span>
              <div className="flex-1">
                <FeedbackCard item={items[idx]} />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Ship Animation: Kanban-style columns
const ShipAnimation = () => {
  const [positions, setPositions] = useState<Record<number, string>>({
    1: "planned",
    2: "building",
    3: "live",
  });

  const columns = [
    { id: "planned", label: "Planned", color: "text-[#1d4ed8]", dot: "bg-[#3b82f6]" },
    { id: "building", label: "In Progress", color: "text-[#b45309]", dot: "bg-[#f59e0b]" },
    { id: "live", label: "Live", color: "text-[#15803d]", dot: "bg-[#22c55e]" },
  ];

  const items = feedbackItems.slice(0, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => {
        const newPos = { ...prev };
        const itemId = Math.floor(Math.random() * 3) + 1;
        const cols = ["planned", "building", "live"];
        const currentIdx = cols.indexOf(prev[itemId]);
        const nextIdx = (currentIdx + 1) % cols.length;
        newPos[itemId] = cols[nextIdx];
        return newPos;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 w-full">
      {columns.map(col => (
        <div key={col.id} className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 mb-3 px-1`}>
            <span className={`w-2 h-2 rounded-full ${col.dot}`} />
            <span className={`text-[13px] font-medium ${col.color}`}>{col.label}</span>
            <span className="text-[12px] text-[#8e8d89] ml-auto">
              {items.filter(item => positions[item.id] === col.id).length}
            </span>
          </div>
          <div className="flex flex-col gap-2 min-h-[200px]">
            <AnimatePresence mode="popLayout">
              {items
                .filter(item => positions[item.id] === col.id)
                .map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      layout: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 }
                    }}
                  >
                    <FeedbackCard
                      item={{ ...item, status: col.id as FeedbackItem["status"] }}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function UseClaudeCode() {
  const [activeTab, setActiveTab] = useState<TabId>("collect");
  const activeContent = tabsData.find((tab) => tab.id === activeTab)!;

  const renderAnimation = () => {
    switch (activeTab) {
      case "collect":
        return <CollectAnimation />;
      case "vote":
        return <VoteAnimation />;
      case "prioritize":
        return <PrioritizeAnimation />;
      case "ship":
        return <ShipAnimation />;
    }
  };

  return (
    <section className="w-full bg-[#faf9f5] px-4 md:px-14 pt-8 pb-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header with Tabs - Centered */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
          <h2
            className="text-[20px] font-medium text-[#141413]"
            style={{ fontFamily: '"Satoshi", Arial, sans-serif' }}
          >
            See Votivy in action
          </h2>

          {/* Tabs */}
          <div
            className="inline-flex p-1.5 rounded-xl bg-[#f0eee6]"
            role="tablist"
          >
            {tabsData.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-[15px] font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-[#141413] shadow-sm"
                    : "bg-transparent text-[#5e5d59] hover:text-[#141413]"
                }`}
                style={{ fontFamily: '"Satoshi", Arial, sans-serif' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Board Visual - Full Width with Cropped Bottom */}
        <div
          className="w-full overflow-hidden rounded-2xl mb-12"
          style={{
            background: "linear-gradient(145deg, rgba(16, 163, 127, 0.06) 0%, rgba(16, 163, 127, 0.02) 100%)",
            height: "580px",
          }}
        >
          <div className="pt-12 md:pt-16 px-6 md:px-8 pb-0">
            <div
              className="w-full rounded-xl overflow-hidden border border-[#e5e4e0] shadow-lg"
              style={{ backgroundColor: "#ffffff" }}
            >
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e4e0] bg-[#f8f8f6]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[13px] text-[#5e5d59] font-medium">
                  Votivy Board
                </span>
                <div className="w-16" /> {/* Spacer for centering */}
              </div>

              {/* Board Content with Sidebar */}
              <div className="flex" style={{ height: "480px" }}>
                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-[200px] border-r border-[#e5e4e0] bg-[#faf9f5] p-4">
                  {/* Workspace */}
                  <div className="flex items-center gap-2.5 px-2 py-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10a37f] to-[#0d8a6c] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">V</span>
                    </div>
                    <div>
                      <div className="text-[13px] text-[#141413] font-medium">Acme Inc</div>
                      <div className="text-[11px] text-[#8e8d89]">Product Board</div>
                    </div>
                  </div>

                  {/* Nav Items */}
                  <div className="space-y-1 mb-6">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white border border-[#e5e4e0] text-[#141413] shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#10a37f]">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span className="text-[13px] font-medium">All Feedback</span>
                      <span className="ml-auto text-[11px] text-[#5e5d59] bg-[#f0eee6] px-1.5 py-0.5 rounded">24</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#5e5d59] hover:bg-white hover:border hover:border-[#e5e4e0] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span className="text-[13px]">Popular</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#5e5d59] hover:bg-white hover:border hover:border-[#e5e4e0] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                        <line x1="16" x2="16" y1="2" y2="6"/>
                        <line x1="8" x2="8" y1="2" y2="6"/>
                        <line x1="3" x2="21" y1="10" y2="10"/>
                      </svg>
                      <span className="text-[13px]">Roadmap</span>
                    </div>
                  </div>

                  {/* Status Filters */}
                  <div className="text-[11px] text-[#8e8d89] uppercase tracking-wider px-3 mb-2">Status</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 px-3 py-1.5 text-[#5e5d59] hover:bg-white rounded-lg transition-colors">
                      <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                      <span className="text-[12px]">Planned</span>
                      <span className="ml-auto text-[11px] text-[#8e8d89]">8</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-1.5 text-[#5e5d59] hover:bg-white rounded-lg transition-colors">
                      <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                      <span className="text-[12px]">In Progress</span>
                      <span className="ml-auto text-[11px] text-[#8e8d89]">4</span>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-1.5 text-[#5e5d59] hover:bg-white rounded-lg transition-colors">
                      <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                      <span className="text-[12px]">Live</span>
                      <span className="ml-auto text-[11px] text-[#8e8d89]">12</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-auto pt-4 border-t border-[#e5e4e0]">
                    <div className="text-[11px] text-[#8e8d89] uppercase tracking-wider px-3 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dbeafe] text-[#1d4ed8]">feature</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#dc2626]">bug</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d]">ux</span>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 md:p-8 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      {renderAnimation()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Panel - Below, Centered */}
        <div className="max-w-2xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h3
                className="text-[28px] font-medium text-[#141413] mb-4 leading-tight"
                style={{ fontFamily: '"Satoshi", Georgia, sans-serif' }}
              >
                {activeContent.title}
              </h3>
              <p
                className="text-[16px] leading-relaxed text-[#5e5d59] mb-8"
                style={{ fontFamily: '"Satoshi", Arial, sans-serif' }}
              >
                {activeContent.description}
              </p>
              <a
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-authPrimary hover:bg-authPrimaryHover text-white font-medium rounded-lg py-3.5 px-6 transition-colors duration-200 text-[15px]"
              >
                Get started free
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
