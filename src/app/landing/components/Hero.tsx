"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Feedback items with titles and status
const feedbackItems = [
  { title: "Dark mode support", status: "Planned", category: "Feature" },
  { title: "Mobile app", status: "Building", category: "Feature" },
  { title: "API integrations", status: "Shipped", category: "Integration" },
  { title: "Team analytics", status: "Planned", category: "Analytics" },
  { title: "Slack notifications", status: "Building", category: "Integration" },
  { title: "Export to CSV", status: "Shipped", category: "Feature" },
  { title: "Custom branding", status: "Planned", category: "Design" }
];

// Status colors
const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  "Planned": { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  "Building": { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  "Shipped": { bg: "#dcfce7", text: "#166534", dot: "#22c55e" }
};

// Words to cycle through for typewriter
const typedWords = [
  "your users",
  "your team",
  "everyone",
  "anywhere",
  "the people that matter"
];

// ChevronUp icon for upvote button
const ChevronUp = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

// Trending/Fire icon
const TrendingIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

// Animated Feedback Badge Component
const AnimatedFeedbackBadge: React.FC = () => {
  const [voteCount, setVoteCount] = useState(247);
  const [itemIndex, setItemIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentItem = feedbackItems[itemIndex];
  const currentStatus = statusColors[currentItem.status];

  useEffect(() => {
    const interval = setInterval(() => {
      // Start pulse animation
      setIsAnimating(true);

      // After pulse, increment vote and change item
      setTimeout(() => {
        setVoteCount(prev => prev + 1);
        setTimeout(() => {
          setItemIndex(prev => (prev + 1) % feedbackItems.length);
          setIsAnimating(false);
        }, 300);
      }, 400);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border mb-6 shadow-sm"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#e5e4e0',
        fontFamily: '"Satoshi", sans-serif',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Upvote Button */}
      <motion.div
        className="flex items-center gap-1 px-1.5 py-1 rounded-md border"
        style={{
          backgroundColor: '#f0fdf4',
          borderColor: '#bbf7d0',
        }}
        animate={isAnimating ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 0 0 rgba(16, 163, 127, 0)",
            "0 0 8px 1px rgba(16, 163, 127, 0.3)",
            "0 0 0 0 rgba(16, 163, 127, 0)"
          ]
        } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={isAnimating ? { y: [0, -1, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp className="text-[#10a37f] w-3 h-3" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.span
            key={voteCount}
            className="text-[11px] font-semibold"
            style={{ color: '#10a37f' }}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {voteCount}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Content Section */}
      <div className="flex items-center gap-2">
        {/* Feedback Title */}
        <div className="overflow-hidden" style={{ minWidth: '100px' }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={itemIndex}
              className="block text-[12px] font-medium"
              style={{ color: '#141413' }}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {currentItem.title}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Status Tag */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.status}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium"
            style={{
              backgroundColor: currentStatus.bg,
              color: currentStatus.text,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: currentStatus.dot }}
            />
            {currentItem.status}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Typewriter animation hook
const useTypewriter = (words: string[], typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState(words[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return currentText;
};

// Arrow icon for CTA button
const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

// Main Hero component
const Hero: React.FC = () => {
  const typedWord = useTypewriter(typedWords);

  return (
    <section className="w-full bg-[#faf9f5] pt-16 pb-4 md:pt-24 md:pb-6 lg:pt-32 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Animated Feedback Badge */}
          <AnimatedFeedbackBadge />

          {/* Main Heading */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-8">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-light text-[#141413] leading-tight"
              style={{ fontFamily: '"Satoshi", Georgia, serif', letterSpacing: '-0.02em' }}
            >
              Collect feedback from
            </h1>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-medium leading-tight min-w-[200px] sm:min-w-[320px]"
              style={{
                fontFamily: '"Satoshi", Georgia, serif',
                letterSpacing: '-0.02em',
                color: '#10a37f'
              }}
            >
              {typedWord || '\u00A0'}
              <span className="animate-pulse">|</span>
            </h1>
          </div>

          {/* Subheading */}
          <p
            className="text-lg sm:text-xl md:text-[22px] text-[#5e5d59] max-w-2xl mb-10 leading-relaxed"
            style={{ fontFamily: '"Satoshi", Arial, sans-serif', fontWeight: 300 }}
          >
            Turn user insights into your product roadmap. Prioritize features, track requests, and build what your customers actually want.
          </p>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Primary CTA */}
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-authPrimary hover:bg-authPrimaryHover text-white font-normal rounded-lg py-3.5 px-6 transition-colors duration-200 text-base shadow-sm"
            >
              <span>Get Started Free</span>
              <ArrowRight />
            </a>

            {/* Secondary CTA */}
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#d1cfc5] hover:border-[#141413] hover:bg-[#f5f4f0] text-[#141413] font-normal rounded-lg py-3.5 px-6 transition-colors duration-200 text-base"
            >
              <span>See how it works</span>
            </a>
          </div>

          {/* Trust indicator */}
          <p
            className="mt-4 text-sm text-[#8e8d89]"
            style={{ fontFamily: '"Satoshi", sans-serif' }}
          >
            No credit card required • Free plan available
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
