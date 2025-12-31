"use client";

import React, { useState, useEffect } from 'react';

// Tool logos data - these are the CLI tools that Claude Code integrates with
const toolLogos = [
  {
    name: 'AWS',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5a7e33062ccf9eb34ffc2_Aws_light.svg',
  },
  {
    name: 'GitHub',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68c2af789b88bae0a3066e7e_68068b75a6e0e851d2777dac_c2015d2dfa5c2c58d52308460cb2e395_github%201.svg',
  },
  {
    name: 'GitLab',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5aaf1b161d57cbe7095b8_GitLab_light.svg',
  },
  {
    name: 'Vercel',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5ae5cc28a7f003e87512b_Vercel_light.svg',
  },
  {
    name: 'Stripe',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5adf8d23ff734739d3a80_Stripe_light.svg',
  },
  {
    name: 'Sentry',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68bf57518a91cc645d08ae1a_sentry-light-mode.svg',
  },
  {
    name: 'Atlassian',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5a84a22074cc407a84848_Atlassian_light.svg',
  },
  {
    name: 'Terraform',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68c2af863ee4a7acccb3f45c_68079342136c3363721f7e0c_terraform%201.svg',
  },
  {
    name: 'Docker',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68c489a80ac296b8c65e6325_Frame.svg',
  },
  {
    name: 'Kubernetes',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68c4898064ee45d6186056ab_Frame.svg',
  },
  {
    name: 'npm',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68c48993030cb1dfe37dabf4_Frame.svg',
  },
  {
    name: 'PostgreSQL',
    src: 'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68c489b8966cebb45401e741_Frame.svg',
  },
];

const CliTools: React.FC = () => {
  const [visibleLogos, setVisibleLogos] = useState<typeof toolLogos>([]);

  useEffect(() => {
    // Shuffle logos for variety on each load
    const shuffled = [...toolLogos].sort(() => Math.random() - 0.5);
    setVisibleLogos(shuffled);

    // Optional: Rotate logos periodically
    const interval = setInterval(() => {
      setVisibleLogos(prev => {
        const newLogos = [...prev];
        // Move first logo to end
        const first = newLogos.shift();
        if (first) newLogos.push(first);
        return newLogos;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="bg-[#faf9f5] py-0"
      style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Logo wall card (spans 2 columns on desktop) */}
          <div className="lg:col-span-2 bg-[#f0eee6] rounded-[22px] p-8 flex flex-col gap-6">
            {/* Logo grid */}
            <div className="flex flex-wrap gap-y-12 justify-center items-center">
              {visibleLogos.slice(0, 12).map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  className="w-1/2 sm:w-1/3 md:w-1/4 h-[58px] flex items-center justify-center transition-opacity duration-500"
                  style={{
                    opacity: 1,
                    animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s`,
                  }}
                >
                  <img
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    className="max-h-8 max-w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Content */}
          <div className="flex flex-col justify-center gap-8">
            <div>
              <h2
                className="text-[24px] font-medium text-[#141413] leading-[29px] mb-8"
                style={{
                  fontFamily: '"Anthropic Serif", Georgia, sans-serif',
                  maxWidth: '386px',
                  textWrap: 'pretty',
                }}
              >
                Connects with your favorite command line tools
              </h2>
              <p
                className="text-[15px] text-[#5e5d59] leading-6"
                style={{
                  fontFamily: '"Anthropic Sans", Arial, sans-serif',
                  textWrap: 'balance',
                }}
              >
                Your terminal is where real work happens. Claude Code connects with the tools that power development—deployment, databases, monitoring, version control. Rather than adding another interface to juggle, it enhances your existing stack.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe animation for fade in */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CliTools;
