"use client";

import { useState } from "react";
import Image from "next/image";
import HolidayToast from "./HolidayToast";

// CSS Variables for this section (dark theme)
const cssVars = {
  '--bg-primary': '#0a0a0b',
  '--bg-card': '#111113',
  '--bg-elevated': '#18181b',
  '--border-subtle': 'rgba(255, 255, 255, 0.08)',
  '--border-muted': 'rgba(255, 255, 255, 0.12)',
  '--text-primary': '#fafafa',
  '--text-secondary': 'rgba(250, 250, 250, 0.6)',
  '--text-muted': 'rgba(250, 250, 250, 0.4)',
  '--accent': '#10a37f',
} as React.CSSProperties;

// SVG Icons for tabs
const UserIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 17.5C3 13.9101 5.91015 11 9.5 11H10.5C14.0899 11 17 13.9101 17 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TeamIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="7" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="13" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M1 16C1 13.2386 3.23858 11 6 11H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 16C19 13.2386 16.7614 11 14 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 12C12.7614 12 15 14.2386 15 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 12C7.23858 12 5 14.2386 5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Votivy Logo component with crop effect
const VotivyLogo = ({ opacity = 1 }: { opacity?: number }) => (
  <div
    className="w-[88px] h-[88px] overflow-hidden relative"
    style={{ opacity }}
  >
    <div className="w-40 h-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image
        src="/logo.png"
        alt="Votivy"
        fill
        priority
        className="object-contain"
      />
    </div>
  </div>
);

// Nav Logo
const VotivyLogoNav = () => (
  <div className="w-10 h-10 overflow-hidden relative">
    <div className="w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image
        src="/logo.png"
        alt="Votivy"
        fill
        priority
        className="object-contain"
      />
    </div>
  </div>
);

// Inline header logo - matches h1 text height (clamp 3.5rem to 5rem = 56px to 80px)
const VotivyLogoInline = () => (
  <span
    className="inline-block overflow-hidden relative align-middle"
    style={{
      width: 'clamp(3rem, 7vw, 4.5rem)',
      height: 'clamp(3rem, 7vw, 4.5rem)',
      marginRight: '0.15em',
      marginBottom: '0.1em',
    }}
  >
    <span
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: 'clamp(5rem, 11vw, 7rem)',
        height: 'clamp(5rem, 11vw, 7rem)',
      }}
    >
      <Image
        src="/logo.png"
        alt=""
        fill
        priority
        className="object-contain"
      />
    </span>
  </span>
);

interface PricingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
  priceDetail: string;
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
}

const PricingCard = ({
  icon,
  title,
  description,
  price,
  priceDetail,
  ctaText,
  ctaHref,
  highlighted = false,
}: PricingCardProps) => (
  <div
    className={`
      grid gap-[14px] p-[28px] rounded-[16px] text-left relative
      border
      ${highlighted
        ? 'border-[rgba(16,163,127,0.3)]'
        : 'border-[rgba(255,255,255,0.08)]'
      }
    `}
    style={{
      gridRow: 'span 5',
      gridTemplateRows: 'subgrid',
      backgroundColor: '#111113',
    }}
  >
    {/* Icon */}
    <div className="w-[88px] h-[88px] -ml-4">
      {icon}
    </div>

    {/* Title */}
    <h3
      style={{
        fontFamily: '"Satoshi", sans-serif',
        fontSize: '56px',
        fontWeight: 300,
        lineHeight: 1.1,
        color: '#fafafa',
        letterSpacing: '-0.03em'
      }}
    >
      {title}
    </h3>

    {/* Description */}
    <p
      style={{
        fontFamily: '"Satoshi", sans-serif',
        fontSize: '15px',
        fontWeight: 300,
        lineHeight: 1.7,
        color: 'rgba(250, 250, 250, 0.6)',
        letterSpacing: '0.02em'
      }}
    >
      {description}
    </p>

    {/* Price */}
    <div className="flex flex-col gap-[8px]">
      <span
        style={{
          fontFamily: '"Satoshi", sans-serif',
          fontSize: '34px',
          fontWeight: 300,
          lineHeight: 1.2,
          color: '#fafafa',
          letterSpacing: '-0.01em'
        }}
      >
        {price}
      </span>
      <p
        style={{
          fontFamily: '"Satoshi", sans-serif',
          fontSize: '13px',
          fontWeight: 300,
          lineHeight: 1.5,
          color: 'rgba(250, 250, 250, 0.4)',
          letterSpacing: '0.03em'
        }}
      >
        {priceDetail}
      </p>
    </div>

    {/* CTA Button */}
    <a
      href={ctaHref}
      className={`
        self-end w-full rounded-[8px] py-[11px] px-4
        flex justify-center items-center gap-2
        no-underline cursor-pointer
        ${highlighted
          ? 'bg-[#0d8968] text-white border border-[rgba(62,207,142,0.7)]'
          : 'bg-transparent text-[#fafafa] border border-[rgba(255,255,255,0.12)]'
        }
      `}
      style={{
        fontFamily: '"Satoshi", sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: 1,
        letterSpacing: '0.02em'
      }}
    >
      <span>{ctaText}</span>
    </a>
  </div>
);

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = ({ icon, label, isActive, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`
      z-10 gap-2 rounded-[8px] text-center
      justify-center items-center max-w-full h-9
      py-2 px-4 pl-3 flex relative cursor-pointer border-0
      ${isActive
        ? 'text-[#fafafa]'
        : 'text-[rgba(250,250,250,0.4)]'
      }
    `}
    style={{
      fontFamily: '"Satoshi", sans-serif',
      fontSize: '14px',
      fontWeight: 300,
      letterSpacing: '0.02em',
      backgroundColor: isActive ? '#18181b' : 'transparent',
    }}
  >
    <span className="w-4 h-4 relative">{icon}</span>
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

export default function PricingTabs() {
  const [activeTab, setActiveTab] = useState<'individual' | 'team'>('individual');

  const individualPlans = [
    {
      icon: <VotivyLogo opacity={0.5} />,
      title: "Starter",
      description: "Perfect for individuals getting started with Votivy. Access core features and basic analytics.",
      price: "Free",
      priceDetail: "No credit card required",
      ctaText: "Get Started",
      ctaHref: "/signup",
    },
    {
      icon: <VotivyLogo />,
      title: "Pro",
      description: "For professionals who need advanced features, priority support, and deeper insights.",
      price: "$29",
      priceDetail: "Per month, billed annually",
      ctaText: "Start Free Trial",
      ctaHref: "/signup/pro",
      highlighted: true,
    },
    {
      icon: <VotivyLogo />,
      title: "Enterprise",
      description: "Custom solutions for large organizations with dedicated support and advanced security.",
      price: "Custom",
      priceDetail: "Contact us for pricing",
      ctaText: "Contact Sales",
      ctaHref: "/contact",
    },
  ];

  const teamPlans = [
    {
      icon: <VotivyLogo />,
      title: "Team",
      description: "Collaborate seamlessly with your team. Shared workspaces, team analytics, and admin controls.",
      price: "$19",
      priceDetail: "Per user / month, billed annually",
      ctaText: "Start Free Trial",
      ctaHref: "/signup/team",
      highlighted: true,
    },
    {
      icon: <VotivyLogo />,
      title: "Enterprise",
      description: "Enterprise-grade security, SSO, dedicated account manager, and custom integrations.",
      price: "Custom",
      priceDetail: "Contact us for pricing",
      ctaText: "Contact Sales",
      ctaHref: "/contact",
    },
  ];

  const currentPlans = activeTab === 'individual' ? individualPlans : teamPlans;

  return (
    <section
      className="min-h-screen py-20 px-4 sm:px-8 relative"
      style={{
        ...cssVars,
        backgroundColor: '#0a0a0b',
        fontFamily: '"Satoshi", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Holiday Toast */}
      <HolidayToast previewMode />

      {/* Top Right Logo */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
        <VotivyLogoNav />
      </div>

      {/* Section Header */}
      <div className="max-w-[74.5rem] mx-auto mb-14 text-center">
        <h1
          style={{
            fontFamily: '"Satoshi", sans-serif',
            fontSize: 'clamp(3.5rem, 8vw, 5rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: '#fafafa',
            letterSpacing: '-0.03em'
          }}
        >
          Get started with <span style={{ color: '#10a37f', fontFamily: '"Clash Display", "Satoshi", sans-serif', fontWeight: 500 }}>Votivy</span>
        </h1>
        <p
          className="mt-5 max-w-lg mx-auto"
          style={{
            fontFamily: '"Satoshi", sans-serif',
            fontSize: '18px',
            fontWeight: 300,
            lineHeight: 1.6,
            color: 'rgba(250, 250, 250, 0.6)',
            letterSpacing: '0.01em'
          }}
        >
          Choose the plan that works best for you. All plans include a 14-day free trial.
        </p>
      </div>

      {/* Pricing Content */}
      <div className="flex flex-col items-center w-full max-w-[74.5rem] mx-auto px-6">
        {/* Tab Menu */}
        <div className="mb-12 flex justify-center">
          <div
            className="rounded-[12px] p-1 flex relative"
            style={{
              backgroundColor: '#111113',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <TabButton
              icon={<UserIcon />}
              label="Individual"
              isActive={activeTab === 'individual'}
              onClick={() => setActiveTab('individual')}
            />
            <TabButton
              icon={<TeamIcon />}
              label="Team & Enterprise"
              isActive={activeTab === 'team'}
              onClick={() => setActiveTab('team')}
            />
          </div>
        </div>

        {/* Pricing Cards */}
        <div
          className={`
            grid gap-[24px] w-full
            ${activeTab === 'individual'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
            }
          `}
          style={{
            gridTemplateRows: 'repeat(5, auto)',
          }}
        >
          {currentPlans.map((plan, index) => (
            <PricingCard
              key={index}
              icon={plan.icon}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              priceDetail={plan.priceDetail}
              ctaText={plan.ctaText}
              ctaHref={plan.ctaHref}
              highlighted={'highlighted' in plan ? plan.highlighted : false}
            />
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-[74.5rem] mx-auto mt-10 text-center">
        <p
          style={{
            fontFamily: '"Satoshi", sans-serif',
            fontSize: '12px',
            fontWeight: 300,
            lineHeight: 1.5,
            color: 'rgba(250, 250, 250, 0.4)',
            letterSpacing: '0.03em'
          }}
        >
          Prices shown don&apos;t include applicable tax. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
