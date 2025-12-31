"use client";

import React, { useState } from 'react';
import { Button } from '../auth/Button';
import { ChevronDown } from 'lucide-react';

interface WorkInfoStepProps {
  initialCompanyName?: string;
  initialCompanySize?: string;
  initialUseCases?: string[];
  onContinue: (data: {
    companyName: string;
    companySize: string;
    useCases: string[];
  }) => void;
  onBack: () => void;
  submitting?: boolean;
}

const COMPANY_SIZES = [
  { value: 'solo', label: 'Just me' },
  { value: '2-10', label: '2-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
];

const USE_CASES = [
  { value: 'internal', label: 'Internal feedback', description: 'Collect feedback from your team' },
  { value: 'customer', label: 'Customer feedback', description: 'Gather insights from users' },
  { value: 'roadmap', label: 'Roadmap planning', description: 'Plan and prioritize features' },
  { value: 'bugs', label: 'Bug tracking', description: 'Track and manage issues' },
];

export const WorkInfoStep: React.FC<WorkInfoStepProps> = ({
  initialCompanyName = '',
  initialCompanySize = '',
  initialUseCases = [],
  onContinue,
  onBack,
  submitting = false,
}) => {
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [companySize, setCompanySize] = useState(initialCompanySize);
  const [useCases, setUseCases] = useState<string[]>(initialUseCases);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const isValid = companyName.trim().length >= 2 && companySize && useCases.length > 0;

  const toggleUseCase = (value: string) => {
    setUseCases((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onContinue({
      companyName: companyName.trim(),
      companySize,
      useCases,
    });
  };

  const selectedSizeLabel = COMPANY_SIZES.find((s) => s.value === companySize)?.label;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-light mb-2 tracking-tight text-white">
          About your work
        </h1>
        <p className="text-sm text-textMuted">
          Help us personalize your experience
        </p>
      </div>

      {/* Company Name Input */}
      <div className="relative w-full">
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={submitting}
          placeholder=" "
          className="
            peer w-full bg-transparent border border-authBorder rounded-lg px-4 py-3.5
            text-textMain placeholder-transparent focus:outline-none focus:border-authPrimary focus:ring-1 focus:ring-authPrimary
            transition-all duration-200 text-[15px]
          "
          id="companyName"
        />
        <label
          htmlFor="companyName"
          className="
            absolute left-4 top-3.5 text-textMuted text-[15px]
            transition-all duration-200 pointer-events-none
            peer-placeholder-shown:text-[15px]
            peer-placeholder-shown:top-3.5
            peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-authBackground peer-focus:px-1 peer-focus:text-authPrimary
            peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-authBackground peer-[:not(:placeholder-shown)]:px-1
          "
        >
          Company name
        </label>
      </div>

      {/* Company Size Dropdown */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setShowSizeDropdown(!showSizeDropdown)}
          disabled={submitting}
          className={`
            w-full bg-transparent border border-authBorder rounded-lg px-4 py-3.5
            text-left text-[15px] transition-all duration-200
            focus:outline-none focus:border-authPrimary focus:ring-1 focus:ring-authPrimary
            flex items-center justify-between
            ${companySize ? 'text-textMain' : 'text-textMuted'}
            ${showSizeDropdown ? 'border-authPrimary ring-1 ring-authPrimary' : ''}
          `}
        >
          <span>{selectedSizeLabel || 'Company size'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showSizeDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showSizeDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1f1f1f] border border-authBorder rounded-lg overflow-hidden z-10 shadow-lg p-1.5">
            {COMPANY_SIZES.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => {
                  setCompanySize(size.value);
                  setShowSizeDropdown(false);
                }}
                className={`
                  w-full px-3 py-2.5 text-left text-[15px] transition-colors rounded-md
                  hover:bg-authPrimary/10
                  ${companySize === size.value ? 'text-authPrimary bg-authPrimary/5' : 'text-textMain'}
                `}
              >
                {size.label}
              </button>
            ))}
          </div>
        )}

        {companySize && (
          <span className="absolute -top-2.5 left-4 text-xs bg-authBackground px-1 text-textMuted">
            Company size
          </span>
        )}
      </div>

      {/* Use Cases Multi-select */}
      <div className="space-y-3">
        <label className="text-sm text-textMuted">
          What will you use this for? <span className="text-textMuted/60">(select all that apply)</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {USE_CASES.map((useCase) => {
            const isSelected = useCases.includes(useCase.value);
            return (
              <button
                key={useCase.value}
                type="button"
                onClick={() => toggleUseCase(useCase.value)}
                disabled={submitting}
                className={`
                  p-3 rounded-lg border text-left transition-all duration-200
                  ${isSelected
                    ? 'border-authPrimary bg-authPrimary/10 ring-1 ring-authPrimary'
                    : 'border-authBorder hover:border-authBorder/80 hover:bg-[#1f1f1f]'
                  }
                `}
              >
                <div className={`text-sm font-medium ${isSelected ? 'text-authPrimary' : 'text-textMain'}`}>
                  {useCase.label}
                </div>
                <div className="text-xs text-textMuted mt-0.5">
                  {useCase.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Button type="submit" disabled={submitting || !isValid}>
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
        Continue
      </Button>

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
