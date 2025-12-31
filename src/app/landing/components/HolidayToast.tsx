"use client";

import React, { useState, useEffect, useCallback } from 'react';

// Cookie helpers
const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
  }
  return null;
};

// Info Icon Component
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 2.8C5.12812 2.8 2.8 5.12812 2.8 8C2.8 10.8719 5.12812 13.2 8 13.2C10.8719 13.2 13.2 10.8719 13.2 8C13.2 5.12812 10.8719 2.8 8 2.8ZM8.08047 7.20781C8.26284 7.24503 8.4 7.40663 8.4 7.6V10H9.2C9.42091 10 9.6 10.1791 9.6 10.4C9.6 10.6209 9.42091 10.8 9.2 10.8H6.8C6.57909 10.8 6.4 10.6209 6.4 10.4C6.4 10.1791 6.57909 10 6.8 10H7.6L7.6 8H6.8C6.57909 8 6.4 7.82091 6.4 7.6C6.4 7.37909 6.57909 7.2 6.8 7.2H8L8.08047 7.20781ZM8 5.2C8.33137 5.2 8.6 5.46863 8.6 5.8C8.6 6.13137 8.33137 6.4 8 6.4C7.66863 6.4 7.4 6.13137 7.4 5.8C7.4 5.46863 7.66863 5.2 8 5.2Z"
      fill="currentColor"
    />
  </svg>
);

// Close Icon Component
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path
      d="M15.1465 4.14642C15.3418 3.95121 15.6583 3.95118 15.8536 4.14642C16.0487 4.34168 16.0488 4.65822 15.8536 4.85346L10.7071 9.99997L15.8536 15.1465C16.0487 15.3417 16.0488 15.6583 15.8536 15.8535C15.6828 16.0244 15.4187 16.0461 15.2247 15.918L15.1465 15.8535L10 10.707L4.85352 15.8535C4.65827 16.0486 4.34168 16.0486 4.14648 15.8535C3.95129 15.6583 3.95142 15.3418 4.14648 15.1465L9.293 9.99997L4.14648 4.85346C3.95142 4.65818 3.95129 4.34162 4.14648 4.14642C4.34168 3.95128 4.65825 3.95138 4.85352 4.14642L10 9.29294L15.1465 4.14642Z"
      fill="currentColor"
    />
  </svg>
);

interface HolidayToastProps {
  toastId?: string;
  expireDays?: number;
  showDelay?: number;
  previewMode?: boolean;
}

export const HolidayToast: React.FC<HolidayToastProps> = ({
  toastId = 'toast-holidays',
  expireDays = 3,
  showDelay = 2000,
  previewMode = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cookieName = `toast-dismissed-${toastId}`;

  const hideToast = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      window.dispatchEvent(new CustomEvent('toast-close', { detail: { toastId } }));
    }, 300);
  }, [toastId]);

  const closeToast = useCallback(() => {
    if (!previewMode) {
      setCookie(cookieName, 'true', expireDays);
    }
    hideToast();
  }, [cookieName, expireDays, hideToast, previewMode]);

  const showToast = useCallback(() => {
    setIsVisible(true);
    setTimeout(() => {
      setIsAnimating(true);
      window.dispatchEvent(new CustomEvent('toast-open', { detail: { toastId } }));
    }, 10);
  }, [toastId]);

  useEffect(() => {
    const isPreview = previewMode || window.location.hash === '#show-toast';

    // Check if already dismissed
    if (!isPreview && getCookie(cookieName)) {
      return;
    }

    const delay = isPreview ? 0 : showDelay;
    let hasShown = false;

    const handlePageTransition = () => {
      if (hasShown) return;
      hasShown = true;
      setTimeout(showToast, delay);
    };

    window.addEventListener('pageTransitionComplete', handlePageTransition, { once: true });

    const fallbackTimer = setTimeout(() => {
      if (!hasShown) {
        handlePageTransition();
      }
    }, delay);

    return () => {
      window.removeEventListener('pageTransitionComplete', handlePageTransition);
      clearTimeout(fallbackTimer);
    };
  }, [cookieName, previewMode, showDelay, showToast]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed bottom-6 left-6 z-50
        flex flex-col gap-3 p-4
        bg-[#f5f0e8] rounded-2xl shadow-xl
        max-w-sm
        transition-all duration-300 ease-out
        ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      role="alert"
      aria-hidden={!isVisible}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[#666] text-xs">
          <InfoIcon />
          <span>Latest news</span>
        </div>
        <button
          type="button"
          onClick={closeToast}
          className="p-1 text-[#999] hover:text-[#666] transition-colors rounded-md hover:bg-[#e8e0d4]"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Content Row - Image + Text */}
      <div className="flex gap-4">
        {/* Toast Visual - Holiday Image */}
        <div className="w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden bg-[#e8e0d4] relative">
          <img
            src="https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/694c777b9d7b022b41ef811f_e9498c651dca7764a0e57466a4d22eb3_happy-holidays.svg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center gap-2 min-w-0">
          {/* Title */}
          <p className="text-[#1a1a1a] text-base font-medium font-serif leading-tight">
            Happy holidays
          </p>

          {/* Description */}
          <p className="text-[#666] text-xs leading-relaxed">
            Paid subscribers get 2x higher usage limits through 12/31. Enjoy the extra room to think!
          </p>

          {/* CTA Button */}
          <a
            href="https://claude.ai/redirect/claudedotcom.v1.c602118f-d7c0-403e-a631-d56db84a44be?utm_source=claude_com&utm_medium=toast&utm_campaign=new-year-2025"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex self-start mt-1 px-3 py-1.5 text-xs font-medium text-white bg-[#c96442] hover:bg-[#b55a3a] rounded-md transition-colors"
          >
            Try Claude
          </a>
        </div>
      </div>
    </div>
  );
};

export default HolidayToast;
