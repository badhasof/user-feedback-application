"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Feedback titles to cycle through
const feedbackTitles = [
  "Dark mode support",
  "Mobile app",
  "API integrations",
  "Team analytics",
  "Slack notifications",
  "Export to CSV",
  "Custom branding"
];

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

// Animated Feedback Badge Component
const AnimatedFeedbackBadge: React.FC = () => {
  const [voteCount, setVoteCount] = useState(247);
  const [titleIndex, setTitleIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start pulse animation
      setIsAnimating(true);

      // After pulse, increment vote and change title
      setTimeout(() => {
        setVoteCount(prev => prev + 1);
        setTimeout(() => {
          setTitleIndex(prev => (prev + 1) % feedbackTitles.length);
          setIsAnimating(false);
        }, 300);
      }, 400);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border mb-8"
      style={{
        backgroundColor: '#1f1f1f',
        borderColor: '#2a2b32',
        fontFamily: '"Satoshi", sans-serif',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Upvote Button */}
      <motion.div
        className="flex items-center gap-1 px-2 py-1 rounded-md border"
        style={{
          backgroundColor: '#1e2738',
          borderColor: '#2b3a55',
        }}
        animate={isAnimating ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 0 0 rgba(16, 163, 127, 0)",
            "0 0 12px 2px rgba(16, 163, 127, 0.35)",
            "0 0 0 0 rgba(16, 163, 127, 0)"
          ]
        } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          animate={isAnimating ? { y: [0, -1, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp className="text-[#60a5fa] w-4 h-4" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.span
            key={voteCount}
            className="text-[13px] font-semibold"
            style={{ color: '#60a5fa' }}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {voteCount}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Feedback Title */}
      <div className="overflow-hidden" style={{ minWidth: '120px' }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={titleIndex}
            className="block text-[14px] font-normal"
            style={{ color: '#ececf1' }}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {feedbackTitles[titleIndex]}
          </motion.span>
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
