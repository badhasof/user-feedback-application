import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Code - Built for developers",
  description: "Work with Claude directly in your codebase",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
      `}</style>
      <div
        className="min-h-screen landing-page"
        style={{
          background: '#faf9f5',
          color: '#141413',
          fontFamily: '"Anthropic Sans", Arial, sans-serif',
        }}
      >
        {children}
      </div>
    </>
  );
}
