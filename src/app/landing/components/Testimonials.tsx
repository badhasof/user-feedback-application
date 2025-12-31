"use client";

import React, { useState, useRef, useEffect } from 'react';

// Testimonial data
const testimonials = [
  {
    company: 'Ramp',
    logoLight: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5ad6788c7a1b711a85623_Ramp_light.svg',
    logoDark: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5ad62e2f100f80635f7a7_Ramp_dark.svg',
    quote: '"Claude Code has dramatically accelerated our team\'s coding efficiency. I can now write EDA code in a notebook—pulling data, training a model, and evaluating it with basic metrics—and then ask Claude to convert that into a Metaflow pipeline. This process saves 1-2 days of routine (and often boring!) work per model."',
    author: 'Anton Biryukov',
    title: 'Staff Software Engineer',
    link: '/customers/ramp',
  },
  {
    company: 'Intercom',
    logoLight: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5ab502bc6f647706fcb9f_Intercom_light.svg',
    logoDark: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5ab481a800b9e0c386290_Intercom_dark.svg',
    quote: '"With Claude, we\'re not just automating customer service—we\'re elevating it to truly human quality. This lets support teams think more strategically about customer experience and what makes interactions genuinely valuable."',
    author: 'Fergal Reid',
    title: 'VP of AI',
    link: '/customers/intercom',
  },
  {
    company: 'Notion',
    logoLight: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68ba17a186e44af7d97dae57_Frame.svg',
    logoDark: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68ba179c1c4432fa78b2f126_Frame-1.svg',
    quote: '"Claude Code is moving our team up a level: we decide what needs to happen, and smooth the process so it can build and verify end-to-end. A big part of my job now is to keep as many instances of Claude Code busy as possible."',
    author: 'Simon Last',
    title: 'Co-founder',
    link: '/customers/notion',
  },
];

// Arrow icon for navigation
const ArrowIcon: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: direction === 'left' ? 'rotate(180deg)' : 'none' }}
  >
    <path
      d="M6 3L11 8L6 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Testimonial Card Component
const TestimonialCard: React.FC<{
  testimonial: typeof testimonials[0];
  isActive: boolean;
}> = ({ testimonial, isActive }) => {
  return (
    <div
      className={`flex-shrink-0 w-full transition-opacity duration-300 ${
        isActive ? 'opacity-100' : 'opacity-0 absolute'
      }`}
      style={{
        fontFamily: '"Anthropic Sans", Arial, sans-serif',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start">
          <img
            src={testimonial.logoLight}
            alt={testimonial.company}
            className="h-8 object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6">
          {/* Quote and Author */}
          <div className="flex flex-col gap-4">
            <p
              className="text-[#141413] leading-relaxed"
              style={{
                fontSize: '19.79px',
                lineHeight: '31.66px',
                fontFamily: '"Anthropic Sans", Arial, sans-serif',
              }}
            >
              {testimonial.quote}
            </p>
            <div
              className="text-[#5e5d59]"
              style={{
                fontSize: '12px',
                fontFamily: '"Anthropic Sans", Arial, sans-serif',
              }}
            >
              {testimonial.author}, {testimonial.title}
            </div>
          </div>

          {/* Read Story Link */}
          <div>
            <a
              href={testimonial.link}
              className="inline-flex items-center gap-2 px-2 py-2 bg-[#faf9f5] rounded-md hover:bg-[#f0eee6] transition-colors"
              style={{
                fontSize: '12px',
                fontFamily: '"Anthropic Sans", Arial, sans-serif',
                fontWeight: 500,
                color: '#5e5d59',
              }}
            >
              Read story
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Dots Component
const NavigationDots: React.FC<{
  total: number;
  current: number;
  onSelect: (index: number) => void;
}> = ({ total, current, onSelect }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-2 h-2 rounded-full transition-colors ${
            index === current ? 'bg-[#141413]' : 'bg-[#d1cfc5]'
          }`}
          aria-label={`Go to testimonial ${index + 1}`}
        />
      ))}
    </div>
  );
};

// Main Testimonials Component
const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance testimonials
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 6000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotSelect = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section
      className="w-full py-16 md:py-24"
      style={{
        backgroundColor: '#faf9f5',
      }}
    >
      <div className="max-w-[960px] mx-auto px-6 md:px-8">
        {/* Section Heading */}
        <h2
          className="text-center mb-12 md:mb-16"
          style={{
            fontSize: '41px',
            fontWeight: 500,
            fontFamily: '"Anthropic Serif", Georgia, sans-serif',
            color: '#141413',
            lineHeight: '49.2px',
          }}
        >
          What developers are saying
        </h2>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Cards Container */}
          <div className="relative overflow-hidden min-h-[200px]">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.company}
                testimonial={testimonial}
                isActive={index === currentIndex}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-[#e8e6de]">
            {/* Dots */}
            <NavigationDots
              total={testimonials.length}
              current={currentIndex}
              onSelect={handleDotSelect}
            />

            {/* Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#d1cfc5] text-[#5e5d59] hover:bg-[#f0eee6] transition-colors"
                aria-label="Previous testimonial"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-[#d1cfc5] text-[#5e5d59] hover:bg-[#f0eee6] transition-colors"
                aria-label="Next testimonial"
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
