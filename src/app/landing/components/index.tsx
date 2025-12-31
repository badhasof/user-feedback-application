"use client";

import React from 'react';

// Import all section components
import Navbar from './Navbar';
import Hero from './Hero';
import UseClaudeCode from './UseClaudeCode';
import Pricing from './Pricing';
import UseCases from './UseCases';
import SlackIntegration from './SlackIntegration';
import Testimonials from './Testimonials';
import CliTools from './CliTools';
import Faq from './Faq';
import TechnicalRundown from './TechnicalRundown';
import CtaNewsletter from './CtaNewsletter';
import Footer from './Footer';

/**
 * Claude Code Landing Page
 *
 * A pixel-perfect clone of https://claude.com/product/claude-code
 * Built with React and Tailwind CSS
 *
 * Design System:
 * - Primary Background: #faf9f5
 * - Dark Background: #141413
 * - Primary Text: #141413
 * - Muted Text: #5e5d59
 * - Accent Color: #d97757 (coral)
 * - Border Color: #d1cfc5
 *
 * Fonts:
 * - Headings: "Anthropic Serif"
 * - Body: "Anthropic Sans", Arial, sans-serif
 * - Code: "JetBrains Mono", monospace
 */

const ClaudeCodePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#faf9f5]" style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section - Animated heading, install command */}
        <Hero />

        {/* Use Claude Code Section - Tabbed interface (Terminal, IDE, Web, Slack) */}
        <UseClaudeCode />

        {/* Pricing Section - Pro, Max 5x, Max 20x plans */}
        <Pricing />

        {/* Use Cases Section - Onboarding, Triage, Refactor tabs with terminal demo */}
        <UseCases />

        {/* Slack Integration Section - Integration cards */}
        <SlackIntegration />

        {/* Testimonials Section - Horizontal slider with company quotes */}
        <Testimonials />

        {/* CLI Tools Section - Logo wall with tool integrations */}
        <CliTools />

        {/* FAQ Section - Accordion */}
        <Faq />

        {/* Technical Rundown Section - Resource cards grid */}
        <TechnicalRundown />

        {/* CTA & Newsletter Section - Dark background with sign up */}
        <CtaNewsletter />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ClaudeCodePage;

// Also export all components individually for flexible usage
export {
  Navbar,
  Hero,
  UseClaudeCode,
  Pricing,
  UseCases,
  SlackIntegration,
  Testimonials,
  CliTools,
  Faq,
  TechnicalRundown,
  CtaNewsletter,
  Footer,
};
