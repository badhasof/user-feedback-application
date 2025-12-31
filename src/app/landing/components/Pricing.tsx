"use client";

import React, { useState } from 'react';

// Tab icons
const IndividualIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" fill="none" className="w-5 h-5">
    <path d="M9.99984 11C11.6241 11 13.2109 11.2094 14.4676 11.8691C15.7561 12.5456 16.6666 13.6818 16.9247 15.4297L16.9393 15.5947C16.9631 16.4101 16.2528 17 15.4998 17H4.49984C3.69703 16.9999 2.9425 16.3293 3.07504 15.4297L3.1307 15.1084C3.44811 13.5411 4.32426 12.5033 5.53207 11.8691C6.78878 11.2094 8.37563 11 9.99984 11ZM9.99984 12C8.43566 12 7.04113 12.2057 5.99691 12.7539C4.98452 13.2855 4.27455 14.1511 4.06429 15.5752C4.03585 15.768 4.19842 15.9999 4.49984 16H15.4998C15.7639 16 15.9214 15.8222 15.9373 15.6484L15.9354 15.5752C15.7251 14.151 15.0152 13.2855 14.0028 12.7539C12.9585 12.2058 11.564 12 9.99984 12ZM9.99984 3C11.9328 3 13.4998 4.567 13.4998 6.5C13.4998 8.433 11.9328 10 9.99984 10C8.06693 9.9999 6.49984 8.43294 6.49984 6.5C6.49984 4.56706 8.06693 3.0001 9.99984 3ZM9.99984 4C8.61922 4.0001 7.49984 5.11935 7.49984 6.5C7.49984 7.88065 8.61922 8.9999 9.99984 9C11.3806 9 12.4998 7.88071 12.4998 6.5C12.4998 5.11929 11.3806 4 9.99984 4Z" fill="currentColor"/>
  </svg>
);

const TeamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" fill="none" className="w-5 h-5">
    <path d="M9.9998 13C11.0037 13 12.0092 13.1245 12.8191 13.5342C13.6596 13.9595 14.2662 14.6825 14.4451 15.7861L14.4588 15.917C14.4852 16.5558 13.9246 16.9998 13.3641 17H6.63554C6.0375 16.9996 5.43973 16.4942 5.55448 15.7861C5.73337 14.6825 6.34004 13.9595 7.18046 13.5342C7.99033 13.1245 8.99592 13 9.9998 13ZM9.9998 14C9.05381 14 8.23502 14.122 7.63261 14.4268C7.06101 14.716 6.66665 15.1759 6.54179 15.9463C6.54099 15.9513 6.54156 15.9534 6.54179 15.9541C6.54214 15.9552 6.54387 15.9607 6.55058 15.9678C6.56551 15.9833 6.59564 15.9998 6.63554 16H13.3641C13.404 15.9999 13.434 15.9833 13.449 15.9678C13.4557 15.9608 13.4574 15.9553 13.4578 15.9541V15.9463C13.3329 15.1759 12.9387 14.716 12.367 14.4268C11.7645 14.1221 10.9458 14 9.9998 14ZM6.49979 8C6.77594 8 6.99979 8.22386 6.99979 8.5C6.99979 8.77614 6.77594 9 6.49979 9C5.55381 9.00002 4.73502 9.12205 4.13261 9.42676C3.59664 9.69794 3.21637 10.1191 3.06815 10.8057L3.04178 10.9463C3.04099 10.9513 3.04156 10.9534 3.04178 10.9541C3.04214 10.9552 3.04386 10.9607 3.05057 10.9678C3.06551 10.9833 3.09563 10.9998 3.13553 11H6.49979C6.77594 11 6.99979 11.2239 6.99979 11.5C6.99979 11.7761 6.77594 12 6.49979 12H3.13553C2.5375 11.9996 1.93973 11.4942 2.05448 10.7861L2.09256 10.584C2.3096 9.59342 2.89246 8.93298 3.68046 8.53418C4.49033 8.12448 5.49592 8.00002 6.49979 8ZM9.9998 7.5C11.2424 7.5 12.2498 8.50736 12.2498 9.75C12.2498 10.9926 11.2424 12 9.9998 12C8.75725 11.9999 7.7498 10.9926 7.7498 9.75C7.7498 8.50743 8.75725 7.50011 9.9998 7.5ZM13.4998 8C14.5037 8 15.5092 8.12452 16.3191 8.53418C17.1596 8.95949 17.7662 9.68245 17.9451 10.7861C18.0599 11.4943 17.4622 11.9998 16.8641 12H13.4998C13.2238 11.9999 12.9998 11.7761 12.9998 11.5C12.9998 11.2239 13.2238 11.0001 13.4998 11H16.8641C16.904 10.9999 16.934 10.9833 16.949 10.9678C16.9557 10.9608 16.9574 10.9553 16.9578 10.9541V10.9463C16.8329 10.1759 16.4387 9.71596 15.867 9.42676C15.2645 9.12209 14.4458 9 13.4998 9C13.2238 8.99989 12.9998 8.77607 12.9998 8.5C12.9998 8.22393 13.2238 8.00011 13.4998 8ZM9.9998 8.5C9.30954 8.50011 8.7498 9.05971 8.7498 9.75C8.7498 10.4403 9.30954 10.9999 9.9998 11C10.6902 11 11.2498 10.4404 11.2498 9.75C11.2498 9.05964 10.6902 8.5 9.9998 8.5ZM6.49979 2.5C7.74244 2.5 8.7498 3.50736 8.7498 4.75C8.7498 5.99264 7.74244 7 6.49979 7C5.25725 6.99989 4.24979 5.99257 4.24979 4.75C4.24979 3.50743 5.25725 2.50011 6.49979 2.5ZM13.4998 2.5C14.7424 2.5 15.7498 3.50736 15.7498 4.75C15.7498 5.99264 14.7424 7 13.4998 7C12.2573 6.99989 11.2498 5.99257 11.2498 4.75C11.2498 3.50743 12.2573 2.50011 13.4998 2.5ZM6.49979 3.5C5.80954 3.50011 5.24979 4.05971 5.24979 4.75C5.24979 5.44029 5.80954 5.99989 6.49979 6C7.19015 6 7.7498 5.44036 7.7498 4.75C7.7498 4.05964 7.19015 3.5 6.49979 3.5ZM13.4998 3.5C12.8095 3.50011 12.2498 4.05971 12.2498 4.75C12.2498 5.44029 12.8095 5.99989 13.4998 6C14.1902 6 14.7498 5.44036 14.7498 4.75C14.7498 4.05964 14.1902 3.5 13.4998 3.5Z" fill="currentColor"/>
  </svg>
);

// Sparkle animation placeholder (simplified since Lottie requires additional setup)
const SparkleIcon = () => (
  <div className="w-16 h-16 flex items-center justify-center">
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 animate-pulse">
      <path d="M32 8L35.5 24.5L48 16L40.5 32L56 35.5L40.5 39L48 48L35.5 40.5L32 56L28.5 40.5L16 48L23.5 39L8 35.5L23.5 32L16 16L28.5 24.5L32 8Z" fill="#D97757"/>
    </svg>
  </div>
);

// Plan card icons - Pro (single person with connections)
const ProIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" viewBox="0 0 64 64" fill="none" className="w-16 h-16">
    <path d="M31.9872 18.3449C34.3179 18.3449 36.2073 16.4555 36.2073 14.1249C36.2073 11.7942 34.3179 9.90479 31.9872 9.90479C29.6565 9.90479 27.7671 11.7942 27.7671 14.1249C27.7671 16.4555 29.6565 18.3449 31.9872 18.3449Z" fill="#D97757"/>
    <path d="M13.5903 52.8968C16.1759 52.8968 18.272 50.8007 18.272 48.2151C18.272 45.6295 16.1759 43.5335 13.5903 43.5335C11.0047 43.5335 8.90869 45.6295 8.90869 48.2151C8.90869 50.8007 11.0047 52.8968 13.5903 52.8968Z" fill="#D97757"/>
    <path d="M49.7247 52.8968C52.3103 52.8968 54.4063 50.8007 54.4063 48.2151C54.4063 45.6295 52.3103 43.5335 49.7247 43.5335C47.1391 43.5335 45.043 45.6295 45.043 48.2151C45.043 50.8007 47.1391 52.8968 49.7247 52.8968Z" fill="#D97757"/>
    <path d="M13.6816 34.3633C16.2672 34.3633 18.3633 32.2672 18.3633 29.6816C18.3633 27.096 16.2672 25 13.6816 25C11.096 25 8.99999 27.096 8.99999 29.6816C8.99999 32.2672 11.096 34.3633 13.6816 34.3633Z" fill="#D97757"/>
    <path d="M49.816 34.3633C52.4016 34.3633 54.4976 32.2672 54.4976 29.6816C54.4976 27.096 52.4016 25 49.816 25C47.2304 25 45.1344 27.096 45.1344 29.6816C45.1344 32.2672 47.2304 34.3633 49.816 34.3633Z" fill="#D97757"/>
    <path d="M32 28C32 28 28 32 28 40C28 48 32 52 32 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 28C32 28 36 32 36 40C36 48 32 52 32 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 30L32 40L50 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 48L32 40L50 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Max 5x icon (multiple people with more connections)
const Max5xIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" viewBox="0 0 65 64" fill="none" className="w-16 h-16">
    <path d="M21.9901 47.63C24.1442 47.63 25.8905 45.8421 25.8905 43.6367C25.8905 41.4313 24.1442 39.6435 21.9901 39.6435C19.8359 39.6435 18.0897 41.4313 18.0897 43.6367C18.0897 45.8421 19.8359 47.63 21.9901 47.63Z" fill="#D97757"/>
    <path d="M44.1824 47.63C46.3366 47.63 48.0828 45.8421 48.0828 43.6367C48.0828 41.4313 46.3366 39.6435 44.1824 39.6435C42.0283 39.6435 40.282 41.4313 40.282 43.6367C40.282 45.8421 42.0283 47.63 44.1824 47.63Z" fill="#D97757"/>
    <path d="M12.8467 50.145C12.8467 52.2746 11.1055 54 8.95798 54C6.81042 54 4.66675 51.8758 4.66675 49.7462C4.66675 47.6167 6.40791 45.8912 8.55547 45.8912C10.703 45.8912 12.8467 48.0155 12.8467 50.145Z" fill="#D97757"/>
    <path d="M61.6668 50.145C61.6668 52.2746 59.9256 54 57.778 54C55.6305 54 53.4868 51.8758 53.4868 49.7462C53.4868 47.6167 55.228 45.8912 57.3755 45.8912C59.5231 45.8912 61.6668 48.0155 61.6668 50.145Z" fill="#D97757"/>
    <path d="M36.997 14.2538C36.997 16.3833 35.2559 18.1088 33.1083 18.1088C30.9608 18.1088 28.8171 15.9845 28.8171 13.855C28.8171 11.7254 30.5583 10 32.7058 10C34.8534 10 36.997 12.1242 36.997 14.2538Z" fill="#D97757"/>
    <path d="M18.5973 28.6475C18.5973 30.6268 17.0302 32.2326 15.0955 32.2326C13.1609 32.2326 11.2315 30.2573 11.2315 28.2766C11.2315 26.296 12.7987 24.6915 14.7333 24.6915C16.6679 24.6915 18.5973 26.6668 18.5973 28.6475Z" fill="#D97757"/>
    <path d="M50.9341 31.9628C52.8617 31.9628 54.4243 30.363 54.4243 28.3896C54.4243 26.4162 52.8617 24.8164 50.9341 24.8164C49.0066 24.8164 47.444 26.4162 47.444 28.3896C47.444 30.363 49.0066 31.9628 50.9341 31.9628Z" fill="#D97757"/>
    <path d="M33 18L33 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 32L33 38L51 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 44L33 38L44 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 50L22 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M57 50L44 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Max 20x icon (even more connections)
const Max20xIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" viewBox="0 0 65 64" fill="none" className="w-16 h-16">
    <circle cx="32" cy="14" r="5" fill="#D97757"/>
    <circle cx="14" cy="28" r="4" fill="#D97757"/>
    <circle cx="50" cy="28" r="4" fill="#D97757"/>
    <circle cx="8" cy="44" r="4" fill="#D97757"/>
    <circle cx="56" cy="44" r="4" fill="#D97757"/>
    <circle cx="20" cy="50" r="4" fill="#D97757"/>
    <circle cx="44" cy="50" r="4" fill="#D97757"/>
    <circle cx="32" cy="54" r="4" fill="#D97757"/>
    <path d="M32 19L32 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 32L32 36L50 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 44L20 46L32 50L44 46L56 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 50L32 54L44 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

type TabType = 'individual' | 'team';

interface PricingCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  price: string;
  priceDescription: string;
  ctaText: string;
  ctaUrl: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  icon,
  name,
  description,
  price,
  priceDescription,
  ctaText,
  ctaUrl,
}) => {
  return (
    <div className="bg-white rounded-[22px] border border-[#f0eee6] p-8 grid gap-6 items-start">
      {/* Icon */}
      <div className="text-[#141413]">{icon}</div>

      {/* Plan name */}
      <h3
        className="text-[30px] font-medium leading-tight text-[#141413]"
        style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
      >
        {name}
      </h3>

      {/* Description */}
      <p
        className="text-[15px] leading-6 text-[#141413]/70"
        style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
      >
        {description}
      </p>

      {/* Price */}
      <div className="space-y-1">
        <div
          className="text-[24px] font-semibold text-[#141413]"
          style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
        >
          {price}
        </div>
        <p
          className="text-xs text-[#141413]/70 leading-5"
          style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
        >
          {priceDescription}
        </p>
      </div>

      {/* CTA Button */}
      <div>
        <a
          href={ctaUrl}
          className="inline-block bg-[#141413] text-[#faf9f5] px-5 py-3 rounded-lg text-[17px] hover:bg-[#2a2a29] transition-colors"
          style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
};

const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('individual');

  const individualPlans: PricingCardProps[] = [
    {
      icon: <ProIcon />,
      name: 'Pro',
      description: 'Claude Code is included in your Pro plan. Perfect for short coding sprints in small codebases with access to both Sonnet 4.5 and Opus 4.5.',
      price: '$17',
      priceDescription: 'Per month with annual subscription discount ($200 billed up front). $20 if billed monthly.',
      ctaText: 'Try Claude',
      ctaUrl: 'https://claude.ai/upgrade/pro?returnTo=/claude-code-install',
    },
    {
      icon: <Max5xIcon />,
      name: 'Max 5x',
      description: 'Claude Code is included in your Max plan. Great value for everyday use in larger codebases.',
      price: '$100',
      priceDescription: 'Per person billed monthly',
      ctaText: 'Try Claude',
      ctaUrl: 'https://claude.ai/upgrade/max?plan=max_5x&returnTo=/claude-code-install',
    },
    {
      icon: <Max20xIcon />,
      name: 'Max 20x',
      description: 'Even more Claude Code included in your Max plan. Great value for power users with the most access to Claude models.',
      price: '$200',
      priceDescription: 'Per person billed monthly',
      ctaText: 'Try Claude',
      ctaUrl: 'https://claude.ai/upgrade/max?plan=max_20x&returnTo=/claude-code-install',
    },
  ];

  return (
    <section className="py-20 px-4 bg-[#faf9f5]">
      <div className="max-w-6xl mx-auto">
        {/* Header with sparkle animation */}
        <div className="flex flex-col items-center mb-12">
          <SparkleIcon />
          <h2
            className="text-5xl font-medium text-center text-[#141413] mt-4"
            style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
          >
            Get started with Claude Code
          </h2>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-10">
          <div
            className="inline-flex p-1 rounded-2xl"
            style={{ backgroundColor: '#f0eee6' }}
            role="tablist"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'individual'}
              onClick={() => setActiveTab('individual')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xl transition-all cursor-pointer ${
                activeTab === 'individual'
                  ? 'bg-white text-[#141413]'
                  : 'bg-transparent text-[#5e5d59] hover:text-[#141413]'
              }`}
              style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
            >
              <IndividualIcon />
              <span>Individual</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'team'}
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xl transition-all cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-white text-[#141413]'
                  : 'bg-transparent text-[#5e5d59] hover:text-[#141413]'
              }`}
              style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
            >
              <TeamIcon />
              <span>Team & Enterprise</span>
            </button>
          </div>
        </div>

        {/* Tab panels */}
        <div role="tabpanel">
          {activeTab === 'individual' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {individualPlans.map((plan) => (
                <PricingCard key={plan.name} {...plan} />
              ))}
            </div>
          )}
          {activeTab === 'team' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-[22px] border border-[#f0eee6] p-8">
                <h3
                  className="text-[30px] font-medium text-[#141413] mb-4"
                  style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
                >
                  Team
                </h3>
                <p
                  className="text-[15px] leading-6 text-[#141413]/70 mb-6"
                  style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
                >
                  Collaborate with your team using Claude Code. Shared workspaces and team management features.
                </p>
                <a
                  href="/contact-sales"
                  className="inline-block bg-[#141413] text-[#faf9f5] px-5 py-3 rounded-lg text-[17px] hover:bg-[#2a2a29] transition-colors"
                  style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
                >
                  Contact sales
                </a>
              </div>
              <div className="bg-white rounded-[22px] border border-[#f0eee6] p-8">
                <h3
                  className="text-[30px] font-medium text-[#141413] mb-4"
                  style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
                >
                  Enterprise
                </h3>
                <p
                  className="text-[15px] leading-6 text-[#141413]/70 mb-6"
                  style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
                >
                  Enterprise-grade security, compliance, and custom deployment options for large organizations.
                </p>
                <a
                  href="/contact-sales"
                  className="inline-block bg-[#141413] text-[#faf9f5] px-5 py-3 rounded-lg text-[17px] hover:bg-[#2a2a29] transition-colors"
                  style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
                >
                  Contact sales
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p
          className="text-center text-sm text-[#141413]/70 mt-8"
          style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
        >
          Additional{' '}
          <a
            href="https://support.anthropic.com/en/articles/9797557-usage-limit-best-practices"
            className="underline hover:text-[#141413]"
          >
            usage limits
          </a>{' '}
          apply. Prices shown don't include applicable tax.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
