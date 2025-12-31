"use client";

import Image from 'next/image';

interface VotivyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizes = {
  sm: { container: 'w-8 h-8', image: 'w-12 h-12', text: 'text-xl', gap: '-space-x-0.5' },
  md: { container: 'w-14 h-14', image: 'w-20 h-20', text: 'text-3xl', gap: '-space-x-1' },
  lg: { container: 'w-20 h-20', image: 'w-28 h-28', text: 'text-5xl', gap: '-space-x-2' },
};

export default function VotivyLogo({ size = 'md', showText = true }: VotivyLogoProps) {
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap}`}>
      <div className={`${s.container} overflow-hidden relative`}>
        <div className={`${s.image} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}>
          <Image
            src="/logo.png"
            alt="Votivy"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
      {showText && (
        <span
          className={`${s.text} font-medium`}
          style={{
            fontFamily: '"Clash Display", "Satoshi", sans-serif',
            color: 'currentColor',
            letterSpacing: '-0.02em',
          }}
        >
          Votivy
        </span>
      )}
    </div>
  );
}
