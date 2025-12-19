import { ReactNode } from "react";

export type BillingInterval = "yearly" | "monthly";

export interface Feature {
  icon: ReactNode;
  text: string;
}

export interface PricingTier {
  title: string;
  badge?: string;
  subtitle: string;
  price: {
    yearly: string;
    monthly: string;
  };
  priceSubtext: string;
  buttonVariant: "primary" | "secondary";
  buttonText?: string;
  features: Feature[];
  showMoreLink?: boolean;
  moreLink?: string;
}

export interface InfoCardData {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  linkText: string;
  linkHref: string;
  external?: boolean;
}

export interface PricingPageProps {
  headline?: ReactNode;
  subheadline?: ReactNode;
  tiers?: PricingTier[];
  infoCards?: InfoCardData[];
  savingsPercent?: number;
  savingsText?: string;
  defaultInterval?: BillingInterval;
  onSelectPlan?: (tier: PricingTier, interval: BillingInterval) => void;
  onToggleBilling?: (interval: BillingInterval) => void;
  className?: string;
}

export interface PricingCardProps {
  title: string;
  badge?: string;
  subtitle: string;
  price: string;
  priceSubtext: string;
  billingText: string;
  buttonVariant: "primary" | "secondary";
  buttonText?: string;
  features: Feature[];
  showMoreLink?: boolean;
  moreLink?: string;
  onButtonClick?: () => void;
}

export interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  linkText: string;
  linkHref: string;
  external?: boolean;
}

export interface BillingToggleProps {
  interval: BillingInterval;
  onToggle: (interval: BillingInterval) => void;
  savingsPercent?: number;
  savingsText?: string;
}
