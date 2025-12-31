"use client";

'use client';

import React, { useState } from 'react';

// Tab icon SVGs
const OnboardingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5H3C2.79779 17.5 2.61549 17.3782 2.53809 17.1914C2.4607 17.0046 2.50349 16.7895 2.64648 16.6465L4.35547 14.9365C3.20124 13.6175 2.5 11.8906 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5ZM10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 11.7952 4.22659 13.4199 5.40332 14.5967L5.46582 14.6729C5.52017 14.7544 5.5498 14.8508 5.5498 14.9502C5.5498 15.0828 5.49709 15.2099 5.40332 15.3037L4.20703 16.5H10C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5ZM13.29 9.30371C13.3986 9.05001 13.6925 8.93174 13.9463 9.04004C14.2 9.14863 14.3183 9.44253 14.21 9.69629C13.8506 10.536 13.1645 11.25 12.25 11.25C11.6372 11.25 11.128 10.9289 10.75 10.4648C10.372 10.9289 9.86276 11.25 9.25 11.25C8.63724 11.25 8.12801 10.9289 7.75 10.4648C7.37198 10.9289 6.86276 11.25 6.25 11.25C5.97386 11.25 5.75 11.0261 5.75 10.75C5.75 10.4739 5.97386 10.25 6.25 10.25C6.58764 10.25 7.00448 9.97056 7.29004 9.30371L7.32422 9.2373C7.41431 9.09121 7.5749 9 7.75 9C7.9501 9 8.13123 9.11975 8.20996 9.30371L8.32227 9.53516C8.59804 10.0359 8.95442 10.25 9.25 10.25C9.58764 10.25 10.0045 9.97056 10.29 9.30371L10.3242 9.2373C10.4143 9.09121 10.5749 9 10.75 9C10.9501 9 11.1312 9.11975 11.21 9.30371L11.3223 9.53516C11.598 10.0359 11.9544 10.25 12.25 10.25C12.5876 10.25 13.0045 9.97056 13.29 9.30371Z" fill="currentColor"/>
  </svg>
);

const TriageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 24 24" fill="none">
    <path d="M7.19993 16.2C7.86266 16.2 8.39992 16.7372 8.39994 17.4V19.8C8.39994 20.4627 7.86268 21 7.19993 21H4.79993C4.1372 21 3.59993 20.4627 3.59993 19.8V17.4C3.59995 16.7372 4.13721 16.2 4.79993 16.2H7.19993ZM4.79993 19.8H7.19993V17.4H4.79993V19.8ZM19.7999 18C20.1313 18 20.3999 18.2686 20.3999 18.6C20.3999 18.9313 20.1313 19.2 19.7999 19.2H11.3999C11.0686 19.2 10.7999 18.9313 10.7999 18.6C10.8 18.2686 11.0686 18 11.3999 18H19.7999ZM7.19993 9.59995C7.86266 9.59995 8.39992 10.1372 8.39994 10.8V13.2C8.39994 13.8627 7.86268 14.4 7.19993 14.4H4.79993C4.1372 14.3999 3.59993 13.8627 3.59993 13.2V10.8C3.59995 10.1372 4.13721 9.59996 4.79993 9.59995H7.19993ZM4.79993 13.2H7.19993V10.8H4.79993V13.2ZM19.7999 11.4C20.1313 11.4 20.3999 11.6686 20.3999 12C20.3999 12.3313 20.1313 12.6 19.7999 12.6H11.3999C11.0686 12.5999 10.7999 12.3313 10.7999 12C10.8 11.6686 11.0686 11.4 11.3999 11.4H19.7999ZM7.35111 3.50151C7.57101 3.25379 7.95053 3.23131 8.19837 3.45112C8.4461 3.67103 8.46859 4.05054 8.24876 4.29838L5.58743 7.29839C5.47433 7.42572 5.31244 7.49903 5.14212 7.49995C4.97172 7.50086 4.80894 7.42928 4.69446 7.30307L3.45579 5.93667L3.38313 5.83823C3.24114 5.59812 3.28207 5.2829 3.49681 5.08823C3.71146 4.8938 4.02885 4.88384 4.25384 5.04838L4.34407 5.13041L5.13275 5.99995L7.35111 3.50151ZM19.7999 4.79995C20.1313 4.79995 20.3999 5.06859 20.3999 5.39995C20.3999 5.73132 20.1313 5.99995 19.7999 5.99995H11.3999C11.0686 5.99994 10.7999 5.73131 10.7999 5.39995C10.8 5.0686 11.0686 4.79996 11.3999 4.79995H19.7999Z" fill="currentColor"/>
  </svg>
);

const RefactorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 32 32" fill="none">
    <path d="M26.3992 6.40022C27.7247 6.40022 28.7992 7.47474 28.7992 8.80022V23.2002C28.7992 24.5257 27.7247 25.6002 26.3992 25.6002H5.59922C4.27376 25.6002 3.19926 24.5257 3.19922 23.2002V14.4002C3.19922 13.9584 3.55739 13.6002 3.99922 13.6002C4.44105 13.6002 4.79922 13.9584 4.79922 14.4002V23.2002C4.79926 23.642 5.15742 24.0002 5.59922 24.0002H26.3992C26.841 24.0002 27.1992 23.642 27.1992 23.2002V8.80022C27.1992 8.35839 26.841 8.00022 26.3992 8.00022H22.3992C21.9574 8.00022 21.5993 7.64201 21.5992 7.20022C21.5992 6.75839 21.9574 6.40022 22.3992 6.40022H26.3992ZM12.9555 4.81584C13.3885 4.90246 13.6699 5.32344 13.5836 5.75647L11.9836 13.7565C11.897 14.1895 11.476 14.4709 11.043 14.3846C10.6099 14.298 10.3286 13.877 10.4148 13.444L12.0148 5.44397C12.1015 5.01092 12.5224 4.72958 12.9555 4.81584ZM7.63516 5.68772C7.96648 5.51799 8.38262 5.59822 8.62422 5.90022C8.86561 6.20201 8.85268 6.62519 8.61484 6.91116L8.49922 7.02522L5.28047 9.60022L8.49922 12.1752C8.8442 12.4512 8.90022 12.9552 8.62422 13.3002C8.34821 13.6452 7.84421 13.7012 7.49922 13.4252L3.49922 10.2252L3.37266 10.0971C3.26161 9.95705 3.19924 9.7824 3.19922 9.60022C3.19922 9.35721 3.30947 9.12704 3.49922 8.97522L7.49922 5.77522L7.63516 5.68772ZM15.3742 5.90022C15.6158 5.59822 16.032 5.51799 16.3633 5.68772L16.4992 5.77522L20.4992 8.97522C20.689 9.12703 20.7992 9.35722 20.7992 9.60022C20.7992 9.7824 20.7368 9.95705 20.6258 10.0971L20.4992 10.2252L16.4992 13.4252C16.1542 13.7012 15.6502 13.6452 15.3742 13.3002C15.0982 12.9552 15.1542 12.4512 15.4992 12.1752L18.718 9.60022L15.4992 7.02522L15.3836 6.91116C15.1458 6.62519 15.1328 6.20201 15.3742 5.90022Z" fill="currentColor"/>
  </svg>
);

// Chevron down icon for dropdown
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 21" fill="none">
    <path d="M12.5 3.60938C13.3284 3.60938 14 4.28095 14 5.10938V6.60938H15.5C16.3284 6.60938 17 7.28095 17 8.10938V16.1094C17 16.9378 16.3284 17.6094 15.5 17.6094H7.5C6.67157 17.6094 6 16.9378 6 16.1094V14.6094H4.5C3.67157 14.6094 3 13.9378 3 13.1094V5.10938C3 4.28095 3.67157 3.60938 4.5 3.60938H12.5ZM14 13.1094C14 13.9378 13.3284 14.6094 12.5 14.6094H7V16.1094C7 16.3855 7.22386 16.6094 7.5 16.6094H15.5C15.7761 16.6094 16 16.3855 16 16.1094V8.10938C16 7.83323 15.7761 7.60938 15.5 7.60938H14V13.1094ZM4.5 4.60938C4.22386 4.60938 4 4.83323 4 5.10938V13.1094C4 13.3855 4.22386 13.6094 4.5 13.6094H12.5C12.7761 13.6094 13 13.3855 13 13.1094V5.10938C13 4.83323 12.7761 4.60938 12.5 4.60938H4.5Z" fill="currentColor"/>
  </svg>
);

// Copy icon
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 21" fill="none">
    <path d="M12.5 3.60938C13.3284 3.60938 14 4.28095 14 5.10938V6.60938H15.5C16.3284 6.60938 17 7.28095 17 8.10938V16.1094C17 16.9378 16.3284 17.6094 15.5 17.6094H7.5C6.67157 17.6094 6 16.9378 6 16.1094V14.6094H4.5C3.67157 14.6094 3 13.9378 3 13.1094V5.10938C3 4.28095 3.67157 3.60938 4.5 3.60938H12.5ZM14 13.1094C14 13.9378 13.3284 14.6094 12.5 14.6094H7V16.1094C7 16.3855 7.22386 16.6094 7.5 16.6094H15.5C15.7761 16.6094 16 16.3855 16 16.1094V8.10938C16 7.83323 15.7761 7.60938 15.5 7.60938H14V13.1094ZM4.5 4.60938C4.22386 4.60938 4 4.83323 4 5.10938V13.1094C4 13.3855 4.22386 13.6094 4.5 13.6094H12.5C12.7761 13.6094 13 13.3855 13 13.1094V5.10938C13 4.83323 12.7761 4.60938 12.5 4.60938H4.5Z" fill="currentColor"/>
  </svg>
);

// Animated sparkle/star SVG
const SparkleIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="animate-pulse"
  >
    <path
      d="M24 4L26.8 18.4L41.2 21.2L26.8 24L24 38.4L21.2 24L6.8 21.2L21.2 18.4L24 4Z"
      fill="#d97757"
      className="animate-spin-slow origin-center"
    />
    <path
      d="M24 8L26 17.5L35.5 19.5L26 21.5L24 31L22 21.5L12.5 19.5L22 17.5L24 8Z"
      fill="#faf9f5"
    />
  </svg>
);

// Tab content data
const tabContent = {
  onboarding: {
    prompt: "I'm new to this codebase. Can you explain it to me?",
    response: [
      "⏺ I'll analyze the Excalidraw codebase structure and provide a high-level overview.",
      "",
      '⏺ Analyze(what: "Excalidraw codebase structure and provide a high-level overview of what it is, its main components, and how they\'re organized. Focus on understanding the project\'s purpose, architecture, and key features.")',
      "",
      "Excalidraw is an open-source virtual whiteboard application with a hand-drawn style. It's designed for creating diagrams, wireframes, and collaborative drawings.",
      "",
      "## Purpose",
      "- Web-based drawing tool with infinite canvas",
      "- Hand-drawn aesthetic with support for shapes, arrows, text",
      "- End-to-end encrypted collaboration",
      "- Works offline as a PWA (Progressive Web App)",
      "",
      "## Architecture",
      "The project is organized as a monorepo with these main components:",
      "",
      "1. Core Package (packages/excalidraw)",
      "- React component library for embedding Excalidraw in any application",
      "- Handles drawing, rendering, and core functionality",
      "- Uses roughjs for the hand-drawn style",
      "- Includes export capabilities (PNG, SVG)",
      "",
      "2. Web Application (excalidraw-app/)",
      "- Full-featured web app at excalidraw.com",
      "- Built on top of the core package",
      "- Adds collaboration features, local storage, sharing",
    ]
  },
  triage: {
    prompt: "Can you help me triage this GitHub issue?",
    response: [
      "⏺ I'll analyze the issue and help you understand the problem.",
      "",
      "⏺ Reading issue #1234: 'Button click not working on mobile'",
      "",
      "After analyzing the issue and related code, here's what I found:",
      "",
      "## Issue Summary",
      "- Mobile users report button not responding to taps",
      "- Affects iOS Safari and Chrome on Android",
      "- Started after commit abc123",
      "",
      "## Root Cause",
      "The touch event handler is being blocked by a CSS property:",
      "```css",
      ".button { pointer-events: none; }",
      "```",
      "",
      "## Recommended Fix",
      "Remove the `pointer-events: none` or scope it properly.",
      "",
      "Shall I create a PR with this fix?",
    ]
  },
  refactor: {
    prompt: "Refactor this function to use async/await instead of callbacks",
    response: [
      "⏺ I'll refactor the callback-based code to use async/await.",
      "",
      "⏺ Analyzing the current implementation...",
      "",
      "## Current Code (callbacks)",
      "```javascript",
      "function fetchData(callback) {",
      "  getData(function(err, result) {",
      "    if (err) return callback(err);",
      "    processData(result, callback);",
      "  });",
      "}",
      "```",
      "",
      "## Refactored Code (async/await)",
      "```javascript",
      "async function fetchData() {",
      "  const result = await getData();",
      "  return await processData(result);",
      "}",
      "```",
      "",
      "## Changes Made",
      "- Converted to async function",
      "- Replaced callbacks with await",
      "- Added proper error handling with try/catch",
      "- Improved readability and maintainability",
    ]
  }
};

// Description cards data
const descriptionCards = [
  {
    heading: "Code onboarding",
    paragraph: "Claude Code maps and explains entire codebases in a few seconds. It uses agentic search to understand project structure and dependencies without you having to manually select context files."
  },
  {
    heading: "Turn issues into PRs",
    paragraph: "Stop bouncing between tools. Claude Code integrates with GitHub, GitLab, and your command line tools to handle the entire workflow—reading issues, writing code, running tests, and submitting PRs—all from your terminal."
  },
  {
    heading: "Make powerful edits",
    paragraph: "Claude Code's understanding of your codebase and dependencies enables it to make powerful, multi-file edits that work."
  }
];

type TabKey = 'onboarding' | 'triage' | 'refactor';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'onboarding', label: 'Onboarding', icon: <OnboardingIcon /> },
  { key: 'triage', label: 'Triage issues', icon: <TriageIcon /> },
  { key: 'refactor', label: 'Refactor code', icon: <RefactorIcon /> },
];

export default function UseCases() {
  const [activeTab, setActiveTab] = useState<TabKey>('onboarding');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('curl -fsSL https://claude.ai/install.sh | bash');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = tabContent[activeTab];

  return (
    <section
      className="py-20 px-6 md:px-12 lg:px-20"
      style={{
        backgroundColor: '#faf9f5',
        fontFamily: '"Anthropic Sans", Arial, sans-serif'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with sparkle and heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-6">
            <SparkleIcon />
            <h2
              className="text-center"
              style={{
                fontSize: '41px',
                fontWeight: 500,
                fontFamily: '"Anthropic Serif", Georgia, sans-serif',
                color: '#141413',
                lineHeight: '1.2'
              }}
            >
              What could you do with Claude Code?
            </h2>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
            <button
              className="flex items-center gap-2 px-5 py-3 rounded-lg transition-colors hover:bg-[#2a2a29]"
              style={{
                backgroundColor: '#141413',
                color: '#faf9f5',
                fontSize: '15px',
                fontWeight: 500
              }}
            >
              Get Claude Code
              <ChevronDownIcon />
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors hover:bg-[#e8e6de]"
              style={{
                backgroundColor: '#f0eee6',
                borderColor: '#d1cfc5',
                color: '#141413',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '14px'
              }}
            >
              <span className="hidden sm:inline">curl -fsSL https://claude.ai/install.sh | bash</span>
              <span className="sm:hidden">Install command</span>
              <span className="text-[#5e5d59]" title="Copy command to clipboard">
                {copied ? '✓' : <CopyIcon />}
              </span>
            </button>
          </div>
          <p style={{ fontSize: '15px', color: '#5e5d59' }}>
            Or read the{' '}
            <a
              href="https://code.claude.com/docs/en/overview"
              className="underline hover:text-[#141413] transition-colors"
            >
              documentation
            </a>
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mt-12">
          {/* Left side - Tabs and terminal display */}
          <div>
            {/* Tab navigation */}
            <div
              role="tablist"
              className="flex flex-wrap gap-2 mb-6 p-1 rounded-2xl"
              style={{ backgroundColor: '#f0eee6' }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
                  style={{
                    backgroundColor: activeTab === tab.key ? 'white' : 'transparent',
                    color: activeTab === tab.key ? '#141413' : '#5e5d59',
                    fontSize: '16px',
                    fontFamily: '"Anthropic Sans", Arial, sans-serif',
                    fontWeight: 400
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Terminal display */}
            <div
              role="tabpanel"
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: '#1f1e1d',
                height: '520px'
              }}
            >
              {/* User prompt */}
              <div
                className="flex items-start gap-2 p-6 border-b"
                style={{
                  borderColor: '#333',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '15px',
                  color: '#faf9f5'
                }}
              >
                <span style={{ color: '#d97757' }}>&gt;</span>
                <span>{content.prompt}</span>
              </div>

              {/* Response area */}
              <div
                className="p-6 overflow-y-auto"
                style={{
                  height: 'calc(100% - 80px)',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '14px',
                  color: '#e0e0e0',
                  lineHeight: '1.6'
                }}
              >
                {content.response.map((line, index) => (
                  <p
                    key={index}
                    className={line === '' ? 'h-4' : 'mb-1'}
                    style={{
                      color: line.startsWith('⏺') ? '#d97757' :
                             line.startsWith('##') ? '#faf9f5' :
                             line.startsWith('-') || line.startsWith('```') ? '#a0a0a0' :
                             '#e0e0e0'
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Description cards */}
          <div className="flex flex-col gap-6">
            {descriptionCards.map((card, index) => (
              <div key={index} className="mb-2">
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    fontFamily: '"Anthropic Serif", Georgia, sans-serif',
                    color: '#141413',
                    lineHeight: '1.2',
                    marginBottom: '8px'
                  }}
                >
                  {card.heading}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    fontFamily: '"Anthropic Sans", Arial, sans-serif',
                    color: '#5e5d59',
                    lineHeight: '24px'
                  }}
                >
                  {card.paragraph}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
}
