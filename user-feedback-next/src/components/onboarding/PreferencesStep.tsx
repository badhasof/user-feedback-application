"use client";

import React, { useState } from 'react';
import { Button } from '../auth/Button';
import { ChevronDown } from 'lucide-react';

interface PreferencesStepProps {
  initialReferralSource?: string;
  initialGoals?: string;
  onContinue: (data: { referralSource?: string; goals?: string }) => void;
  onSkip: () => void;
  onBack: () => void;
  submitting?: boolean;
}

const REFERRAL_SOURCES = [
  { value: 'google', label: 'Google search' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'friend', label: 'Friend or colleague' },
  { value: 'producthunt', label: 'Product Hunt' },
  { value: 'blog', label: 'Blog or article' },
  { value: 'other', label: 'Other' },
];

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
  initialReferralSource = '',
  initialGoals = '',
  onContinue,
  onSkip,
  onBack,
  submitting = false,
}) => {
  const [referralSource, setReferralSource] = useState(initialReferralSource);
  const [goals, setGoals] = useState(initialGoals);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue({
      referralSource: referralSource || undefined,
      goals: goals.trim() || undefined,
    });
  };

  const selectedSourceLabel = REFERRAL_SOURCES.find((s) => s.value === referralSource)?.label;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-light mb-2 tracking-tight text-white">
          Almost there!
        </h1>
        <p className="text-sm text-textMuted">
          Just a couple more questions <span className="text-textMuted/60">(optional)</span>
        </p>
      </div>

      {/* Referral Source Dropdown */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setShowSourceDropdown(!showSourceDropdown)}
          disabled={submitting}
          className={`
            w-full bg-transparent border border-authBorder rounded-lg px-4 py-3.5
            text-left text-[15px] transition-all duration-200
            focus:outline-none focus:border-authPrimary focus:ring-1 focus:ring-authPrimary
            flex items-center justify-between
            ${referralSource ? 'text-textMain' : 'text-textMuted'}
            ${showSourceDropdown ? 'border-authPrimary ring-1 ring-authPrimary' : ''}
          `}
        >
          <span>{selectedSourceLabel || 'How did you hear about us?'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showSourceDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showSourceDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1f1f1f] border border-authBorder rounded-lg overflow-hidden z-10 shadow-lg max-h-64 overflow-y-auto p-1.5">
            {REFERRAL_SOURCES.map((source) => (
              <button
                key={source.value}
                type="button"
                onClick={() => {
                  setReferralSource(source.value);
                  setShowSourceDropdown(false);
                }}
                className={`
                  w-full px-3 py-2.5 text-left text-[15px] transition-colors rounded-md
                  hover:bg-authPrimary/10
                  ${referralSource === source.value ? 'text-authPrimary bg-authPrimary/5' : 'text-textMain'}
                `}
              >
                {source.label}
              </button>
            ))}
          </div>
        )}

        {referralSource && (
          <span className="absolute -top-2.5 left-4 text-xs bg-authBackground px-1 text-textMuted">
            How did you hear about us?
          </span>
        )}
      </div>

      {/* Goals Textarea */}
      <div className="relative w-full">
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          disabled={submitting}
          placeholder=" "
          rows={4}
          maxLength={500}
          className="
            peer w-full bg-transparent border border-authBorder rounded-lg px-4 py-3.5
            text-textMain placeholder-transparent focus:outline-none focus:border-authPrimary focus:ring-1 focus:ring-authPrimary
            transition-all duration-200 text-[15px] resize-none
          "
          id="goals"
        />
        <label
          htmlFor="goals"
          className="
            absolute left-4 top-3.5 text-textMuted text-[15px]
            transition-all duration-200 pointer-events-none
            peer-placeholder-shown:text-[15px]
            peer-placeholder-shown:top-3.5
            peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-authBackground peer-focus:px-1 peer-focus:text-authPrimary
            peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-authBackground peer-[:not(:placeholder-shown)]:px-1
          "
        >
          What are you hoping to achieve?
        </label>
        <div className="absolute bottom-2 right-3 text-xs text-textMuted">
          {goals.length}/500
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : null}
          Complete Setup
        </Button>

        <button
          type="button"
          onClick={onSkip}
          disabled={submitting}
          className="text-sm text-textMuted hover:text-textMain transition-colors text-center py-2"
        >
          Skip for now
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        disabled={submitting}
        className="text-sm text-textMuted hover:text-textMain transition-colors text-center"
      >
        ← Back
      </button>
    </form>
  );
};
