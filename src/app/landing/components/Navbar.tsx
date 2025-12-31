"use client";

import React, { useState } from 'react';
import VotivyLogo from './VotivyLogo';

// Chevron down icon for dropdown menus
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" fill="none" className="w-4 h-4 ml-1">
    <path d="M14.128 7.16482C14.3126 6.95983 14.6298 6.94336 14.835 7.12771C15.0402 7.31242 15.0567 7.62952 14.8721 7.83477L10.372 12.835L10.2939 12.9053C10.2093 12.9667 10.1063 13 9.99995 13C9.85833 12.9999 9.72264 12.9402 9.62788 12.835L5.12778 7.83477L5.0682 7.75273C4.95072 7.55225 4.98544 7.28926 5.16489 7.12771C5.34445 6.96617 5.60969 6.95939 5.79674 7.09744L5.87193 7.16482L9.99995 11.7519L14.128 7.16482Z" fill="currentColor"/>
  </svg>
);

// External link icon
const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 20 20" fill="none" className="w-4 h-4 ml-1 opacity-50">
    <path d="M9.5 3C9.77614 3 10 3.22386 10 3.5C10 3.77614 9.77614 4 9.5 4H4.5C4.22386 4 4 4.22386 4 4.5V15.5C4 15.7761 4.22386 16 4.5 16H15.5C15.7761 16 16 15.7761 16 15.5V10.5C16 10.2239 16.2239 10 16.5 10C16.7761 10 17 10.2239 17 10.5V15.5C17 16.3284 16.3284 17 15.5 17H4.5C3.67157 17 3 16.3284 3 15.5V4.5C3 3.67157 3.67157 3 4.5 3H9.5ZM16.5 3C16.5374 3 16.5747 3.00436 16.6113 3.0127C16.6347 3.01803 16.6574 3.02559 16.6797 3.03418C16.687 3.03701 16.6939 3.04076 16.7012 3.04395C16.7213 3.05283 16.7409 3.06272 16.7598 3.07422C16.7675 3.07892 16.7757 3.08274 16.7832 3.08789C16.8082 3.10508 16.8317 3.12471 16.8535 3.14648L16.918 3.22461C16.9289 3.24116 16.9356 3.25988 16.9443 3.27734C16.95 3.28857 16.9572 3.29894 16.9619 3.31055C16.9789 3.35212 16.9888 3.39547 16.9941 3.43945C16.9966 3.45953 17 3.47957 17 3.5V7.5C17 7.77614 16.7761 8 16.5 8C16.2239 8 16 7.77614 16 7.5V4.70703L11.8535 8.85352C11.6583 9.04878 11.3417 9.04878 11.1465 8.85352C10.9512 8.65825 10.9512 8.34175 11.1465 8.14648L15.293 4H12.5C12.2239 4 12 3.77614 12 3.5C12 3.22386 12.2239 3 12.5 3H16.5Z" fill="currentColor"/>
  </svg>
);

interface NavItem {
  label: string;
  href?: string;
  hasDropdown?: boolean;
  items?: { label: string; href: string; external?: boolean }[];
}

const navItems: NavItem[] = [
  {
    label: 'Product',
    hasDropdown: true,
    items: [
      { label: 'Features', href: '/features' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: 'Changelog', href: '/changelog' },
    ]
  },
  {
    label: 'Solutions',
    hasDropdown: true,
    items: [
      { label: 'For Startups', href: '/solutions/startups' },
      { label: 'For Teams', href: '/solutions/teams' },
      { label: 'For Enterprise', href: '/solutions/enterprise' },
      { label: 'For Agencies', href: '/solutions/agencies' },
    ]
  },
  {
    label: 'Pricing',
    href: '/pricing',
    hasDropdown: false,
  },
  {
    label: 'Resources',
    hasDropdown: true,
    items: [
      { label: 'Blog', href: '/blog' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Community', href: '/community' },
      { label: 'Help Center', href: '/help' },
    ]
  },
];

interface DropdownMenuProps {
  items: { label: string; href: string; external?: boolean }[];
  isOpen: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-1 py-2 bg-[#faf9f5] rounded-lg shadow-lg border border-[#e5e4e0] min-w-[180px] z-50">
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.href}
          className="flex items-center px-4 py-2.5 text-[15px] text-[#141413] hover:bg-[#f0efeb] transition-colors"
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
        >
          {item.label}
          {item.external && <ExternalLinkIcon />}
        </a>
      ))}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="relative z-10 bg-[#faf9f5] text-[#141413]"
      style={{ fontFamily: '"Satoshi", Arial, sans-serif' }}
    >
      <div className="flex justify-between items-center max-w-[1440px] mx-auto px-6 lg:px-14 h-[85px]">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center h-full"
          aria-label="Home page"
        >
          <VotivyLogo />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <div className="flex items-center gap-1">
            {/* Left Nav Menu */}
            <ul className="flex items-center">
              {navItems.map((item) => (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.hasDropdown ? (
                    <button
                      className="flex items-center px-3 py-2 text-[15px] text-[#5e5d59] hover:text-[#141413] transition-colors rounded-lg"
                    >
                      <span>{item.label}</span>
                      <ChevronDown />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center px-3 py-2 text-[15px] text-[#5e5d59] hover:text-[#141413] transition-colors rounded-lg"
                    >
                      <span>{item.label}</span>
                    </a>
                  )}
                  {item.hasDropdown && item.items && (
                    <DropdownMenu
                      items={item.items}
                      isOpen={openDropdown === item.label}
                    />
                  )}
                </li>
              ))}
            </ul>

            {/* Right CTA Buttons */}
            <ul className="flex items-center gap-2 ml-6">
              <li>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 text-[15px] text-[#5e5d59] hover:text-[#141413] transition-colors rounded-lg"
                >
                  Sign in
                </a>
              </li>
              <li>
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-[15px] text-white rounded-lg transition-all hover:brightness-110"
                  style={{ backgroundColor: '#10a37f' }}
                >
                  Get Started
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-[#141413] transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-[#141413] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-[#141413] transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[85px] left-0 right-0 bg-[#faf9f5] border-t border-[#e5e4e0] shadow-lg z-50">
          <nav className="px-6 py-4">
            {navItems.map((item) => (
              <div key={item.label} className="py-2">
                {item.hasDropdown ? (
                  <>
                    <button
                      className="flex items-center justify-between w-full py-2 text-[17px] text-[#141413]"
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown />
                    </button>
                    {openDropdown === item.label && item.items && (
                      <div className="pl-4 py-2">
                        {item.items.map((subItem, idx) => (
                          <a
                            key={idx}
                            href={subItem.href}
                            className="flex items-center py-2 text-[15px] text-[#5e5d59]"
                            target={subItem.external ? '_blank' : undefined}
                            rel={subItem.external ? 'noopener noreferrer' : undefined}
                          >
                            {subItem.label}
                            {subItem.external && <ExternalLinkIcon />}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center py-2 text-[17px] text-[#141413]"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-[#e5e4e0] mt-4">
              <a
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2.5 text-[17px] text-[#5e5d59] bg-[#faf9f5] border border-[#e5e4e0] rounded-lg"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-4 py-2.5 text-[17px] text-white rounded-lg"
                style={{ backgroundColor: '#10a37f' }}
              >
                Get Started
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
