"use client";

import React, { useState } from "react";

// Chevron icon for expand/collapse
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const faqData: FaqItem[] = [
  {
    question: "How do I get started with Claude?",
    answer: (
      <>
        You can access Claude Code with a Claude Pro or Max plan, a Team or
        Enterprise plan premium seat, or a Claude Console account.{" "}
        <a
          href="https://code.claude.com/docs/en/overview"
          className="underline underline-offset-[3px] decoration-[#b0aea5] hover:decoration-[#141413] transition-colors"
        >
          Download Claude Code
        </a>{" "}
        and sign in with your respective Claude or Console credentials.
      </>
    ),
  },
  {
    question: "What kinds of tasks can Claude Code handle?",
    answer:
      "Claude Code excels at both routine development tasks like bug fixes and testing, as well as transformative work like refactors and feature implementation that require deep codebase understanding.",
  },
  {
    question: "How does Claude Code work with my existing tools?",
    answer:
      "Claude Code runs in your terminal and works alongside your preferred IDE and development tools without requiring you to change your workflow. Claude Code can also use command line tools (like Git) and MCP servers (like GitHub) to extend its own capabilities using your tools.",
  },
  {
    question: "Is Claude Code secure?",
    answer:
      "Yes. Claude Code runs locally in your terminal and talks directly to model APIs without requiring a backend server or remote code index. It also asks for permission before making changes to your files or running commands.",
  },
  {
    question: "Which models does Claude Code use?",
    answer:
      "Claude Code works with the Opus 4.5, Sonnet 4.5, and Haiku 4.5 models. Enterprise users can run Claude Code using models in existing Amazon Bedrock or Google Cloud Vertex AI instances.",
  },
  {
    question: "What are the system requirements to run Claude Code?",
    answer: (
      <>
        Claude Code works on macOS, Linux, and Windows.{" "}
        <a
          href="https://docs.claude.com/en/docs/claude-code/setup#system-requirements"
          className="underline underline-offset-[3px] decoration-[#b0aea5] hover:decoration-[#141413] transition-colors"
        >
          See full system requirements
        </a>
        .
      </>
    ),
  },
  {
    question: "How much does Claude Code cost?",
    answer: (
      <>
        When used with a Claude Console account, Claude Code consumes API tokens
        at{" "}
        <a
          href="https://anthropic.com/pricing#api"
          className="underline underline-offset-[3px] decoration-[#b0aea5] hover:decoration-[#141413] transition-colors"
        >
          standard API pricing
        </a>
        .
      </>
    ),
  },
  {
    question: "Does Claude Code work with the Claude desktop app?",
    answer: (
      <>
        Yes. Max, Pro, Team, and Enterprise users can access Claude Code on the{" "}
        <a
          href="https://www.claude.com/download"
          className="underline underline-offset-[3px] decoration-[#b0aea5] hover:decoration-[#141413] transition-colors"
        >
          Claude desktop app
        </a>
        .
      </>
    ),
  },
];

interface FaqItemComponentProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

const FaqItemComponent: React.FC<FaqItemComponentProps> = ({
  item,
  isOpen,
  onToggle,
  isLast,
}) => {
  return (
    <li className="list-none">
      <div className={`${!isLast ? "border-b border-[#e8e6de]" : ""}`}>
        <h3 className="m-0">
          <button
            onClick={onToggle}
            aria-expanded={isOpen}
            className="w-full flex justify-between items-center py-[31px] px-0 bg-transparent border-none cursor-pointer text-left"
            style={{
              fontFamily: '"Anthropic Sans", Arial, sans-serif',
              fontSize: "20px",
              fontWeight: 400,
              color: "#141413",
              lineHeight: "32px",
            }}
          >
            <span>{item.question}</span>
            <ChevronIcon isOpen={isOpen} />
          </button>
        </h3>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <p
            className="m-0 pb-[31px]"
            style={{
              fontFamily: '"Anthropic Sans", Arial, sans-serif',
              fontSize: "17px",
              fontWeight: 400,
              color: "rgba(20, 20, 19, 0.7)",
              lineHeight: "27px",
            }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </li>
  );
};

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="w-full flex flex-col items-center px-4 py-16 md:py-24"
      style={{ backgroundColor: "#faf9f5" }}
    >
      <div className="w-full max-w-[937px] flex flex-col items-center">
        {/* Heading */}
        <h2
          className="text-center mb-10 md:mb-16"
          style={{
            fontFamily: '"Anthropic Serif", Georgia, sans-serif',
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 500,
            color: "#141413",
            margin: 0,
            marginBottom: "40px",
          }}
        >
          FAQ
        </h2>

        {/* FAQ List */}
        <ul className="w-full p-0 m-0">
          <div className="flex flex-col">
            {faqData.map((item, index) => (
              <FaqItemComponent
                key={index}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                isLast={index === faqData.length - 1}
              />
            ))}
          </div>
        </ul>
      </div>
    </section>
  );
};

export default Faq;
