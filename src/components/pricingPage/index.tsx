"use client";

import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { InfoCard } from "./InfoCard";
import { BillingToggle } from "./BillingToggle";
import {
  UnlockedIcon,
  FlowIcon,
  VideoIcon,
  SaveIcon,
  HideIcon,
  DownloadIcon,
  ClockIcon,
  CheckmarkIcon,
  MessageIcon,
  SettingsIcon,
  CardIcon,
  TeamIcon,
  PageIcon,
  BuildingsIcon,
  GraduateCapIcon,
  FoodBellIcon,
} from "./icons";
import type { PricingPageProps, PricingTier, InfoCardData, BillingInterval } from "./types";

// Re-export components for standalone use
export { PricingCard } from "./PricingCard";
export { InfoCard } from "./InfoCard";
export { BillingToggle } from "./BillingToggle";
export { Navbar } from "./Navbar";
export * from "./icons";
export * from "./types";

// Default content (Mobbin-style)
const defaultTiers: PricingTier[] = [
  {
    title: "Pro",
    badge: "Popular",
    subtitle: "For individuals",
    price: { yearly: "$10", monthly: "$12" },
    priceSubtext: "per month",
    buttonVariant: "primary",
    features: [
      { icon: <UnlockedIcon />, text: "Browse all apps & sites" },
      { icon: <FlowIcon />, text: "Browse flows" },
      { icon: <VideoIcon />, text: "See animations" },
      { icon: <SaveIcon />, text: "Unlimited collections" },
      { icon: <HideIcon />, text: "Hide screen footers" },
      { icon: <DownloadIcon />, text: "Download multiple screens" },
      { icon: <ClockIcon />, text: "App history" },
    ],
    showMoreLink: true,
  },
  {
    title: "Team",
    subtitle: "For teams & agencies",
    price: { yearly: "$12", monthly: "$14" },
    priceSubtext: "per member/month",
    buttonVariant: "secondary",
    features: [
      { icon: <CheckmarkIcon />, text: "All Pro features" },
      { icon: <SaveIcon />, text: "Team collections" },
      { icon: <MessageIcon />, text: "Comments & mentions" },
      { icon: <SettingsIcon />, text: "Admin tools" },
      { icon: <CardIcon />, text: "Centralized billing" },
      { icon: <TeamIcon />, text: "Seat-based pricing" },
      { icon: <PageIcon />, text: "SOC 2 reports" },
    ],
  },
];

const defaultInfoCards: InfoCardData[] = [
  {
    icon: <BuildingsIcon />,
    title: "Enterprise",
    description: (
      <>
        Get <span className="whitespace-nowrap">advanced security (SOC 2 reports)</span>,{" "}
        <span className="whitespace-nowrap">priority support</span>,{" "}
        <span className="whitespace-nowrap">standard legal agreement</span>{" "}
        <span className="whitespace-nowrap">& more.</span>
      </>
    ),
    linkText: "Contact Sales",
    linkHref: "https://tally.so/r/mRR04j",
    external: true,
  },
  {
    icon: <GraduateCapIcon />,
    title: "Student or educator?",
    description: (
      <>
        Discover Mobbin for Education and get a
        <br /> discount if you&apos;re eligible.
      </>
    ),
    linkText: "Read more",
    linkHref: "/education",
  },
  {
    icon: <FoodBellIcon />,
    title: "Competitor research",
    description: (
      <>
        We&apos;ll map out any app of your choice.
        <br />
        From $3,999 per app.
      </>
    ),
    linkText: "Read more",
    linkHref: "/competitor-research",
  },
];

const defaultHeadline = (
  <>
    Design <span className="whitespace-nowrap">like a Pro.</span>
  </>
);

const defaultSubheadline = (
  <>
    Get full access to all apps &amp; features from only $0.33 per day —{" "}
    <span className="whitespace-nowrap">Cancel anytime.</span>
  </>
);

export function PricingPage({
  headline = defaultHeadline,
  subheadline = defaultSubheadline,
  tiers = defaultTiers,
  infoCards = defaultInfoCards,
  savingsPercent = 33,
  savingsText = "on a yearly subscription",
  defaultInterval = "yearly",
  onSelectPlan,
  onToggleBilling,
  className = "",
}: PricingPageProps) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(defaultInterval);

  const handleToggle = (interval: BillingInterval) => {
    setBillingInterval(interval);
    onToggleBilling?.(interval);
  };

  const handleSelectPlan = (tier: PricingTier) => {
    onSelectPlan?.(tier, billingInterval);
  };

  return (
    <div className={`pricing-container pb-[40px] min-720:pb-[48px] ${className}`}>
      <div className="flex flex-col items-center">
        {/* Header Section */}
        <div className="pb-[24px] min-1280:pb-[32px]">
          <div className="flex flex-col gap-y-[24px] pt-[24px] min-720:pt-[40px] min-1280:pt-[64px]">
            <h1 className="text-center font-semibold text-spotlight min-1280:text-showcase text-text-primary">
              {headline}
            </h1>
            <h2 className="text-center text-feature text-text-secondary">
              {subheadline}
            </h2>
          </div>
        </div>

        {/* Billing Interval Selector */}
        <div className="pb-[40px] min-1280:pb-[48px]">
          <BillingToggle
            interval={billingInterval}
            onToggle={handleToggle}
            savingsPercent={savingsPercent}
            savingsText={savingsText}
          />
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col items-stretch self-stretch pb-[40px] min-1280:pb-[48px]">
          <div className="grid grid-rows-2 gap-[24px] min-840:grid-cols-2 min-840:grid-rows-1 pb-[48px]">
            {tiers.map((tier, idx) => (
              <div key={idx} className={idx === 0 ? "flex" : ""}>
                <PricingCard
                  title={tier.title}
                  badge={tier.badge}
                  subtitle={tier.subtitle}
                  price={billingInterval === "yearly" ? tier.price.yearly : tier.price.monthly}
                  priceSubtext={tier.priceSubtext}
                  billingText={`billed ${billingInterval}`}
                  buttonVariant={tier.buttonVariant}
                  buttonText={tier.buttonText}
                  features={tier.features}
                  showMoreLink={tier.showMoreLink}
                  moreLink={tier.moreLink}
                  onButtonClick={() => handleSelectPlan(tier)}
                />
              </div>
            ))}
          </div>

          {/* Info Cards */}
          {infoCards && infoCards.length > 0 && (
            <div className="flex flex-col gap-y-[40px] min-720:flex-row min-720:gap-x-[24px] pt-[40px]">
              {infoCards.map((card, idx) => (
                <InfoCard
                  key={idx}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  linkText={card.linkText}
                  linkHref={card.linkHref}
                  external={card.external}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
