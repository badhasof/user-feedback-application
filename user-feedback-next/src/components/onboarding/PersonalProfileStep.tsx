"use client";

import React, { useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { AvatarUpload } from './AvatarUpload';
import { Button } from '../auth/Button';
import { ChevronDown } from 'lucide-react';

interface PersonalProfileStepProps {
  initialName?: string;
  initialJobTitle?: string;
  initialAvatarUrl?: string;
  onContinue: (data: {
    fullName: string;
    jobTitle: string;
    avatarStorageId?: Id<"_storage">;
  }) => void;
  submitting?: boolean;
}

const JOB_TITLES = [
  'Product Manager',
  'Software Developer',
  'Founder / CEO',
  'Designer',
  'Marketing',
  'Customer Support',
  'Operations',
  'Other',
];

export const PersonalProfileStep: React.FC<PersonalProfileStepProps> = ({
  initialName = '',
  initialJobTitle = '',
  initialAvatarUrl,
  onContinue,
  submitting = false,
}) => {
  const [fullName, setFullName] = useState(initialName);
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [avatarStorageId, setAvatarStorageId] = useState<Id<"_storage"> | undefined>();
  const [showDropdown, setShowDropdown] = useState(false);

  const isValid = fullName.trim().length >= 2 && jobTitle.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onContinue({
      fullName: fullName.trim(),
      jobTitle: jobTitle.trim(),
      avatarStorageId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-light mb-2 tracking-tight text-white">
          Let's get to know you
        </h1>
        <p className="text-sm text-textMuted">
          Tell us a bit about yourself
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="flex justify-center">
        <AvatarUpload
          name={fullName}
          currentAvatarUrl={initialAvatarUrl}
          onAvatarChange={setAvatarStorageId}
        />
      </div>

      {/* Full Name Input */}
      <div className="relative w-full">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={submitting}
          placeholder=" "
          className="
            peer w-full bg-transparent border border-authBorder rounded-lg px-4 py-3.5
            text-textMain placeholder-transparent focus:outline-none focus:border-authPrimary focus:ring-1 focus:ring-authPrimary
            transition-all duration-200 text-[15px]
          "
          id="fullName"
        />
        <label
          htmlFor="fullName"
          className="
            absolute left-4 top-3.5 text-textMuted text-[15px]
            transition-all duration-200 pointer-events-none
            peer-placeholder-shown:text-[15px]
            peer-placeholder-shown:top-3.5
            peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-authBackground peer-focus:px-1 peer-focus:text-authPrimary
            peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-authBackground peer-[:not(:placeholder-shown)]:px-1
          "
        >
          Full name
        </label>
      </div>

      {/* Job Title Dropdown */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={submitting}
          className={`
            w-full bg-transparent border border-authBorder rounded-lg px-4 py-3.5
            text-left text-[15px] transition-all duration-200
            focus:outline-none focus:border-authPrimary focus:ring-1 focus:ring-authPrimary
            flex items-center justify-between
            ${jobTitle ? 'text-textMain' : 'text-textMuted'}
            ${showDropdown ? 'border-authPrimary ring-1 ring-authPrimary' : ''}
          `}
        >
          <span>{jobTitle || 'Select your role'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#1f1f1f] border border-authBorder rounded-lg overflow-hidden z-10 shadow-lg p-1.5">
            {JOB_TITLES.map((title) => (
              <button
                key={title}
                type="button"
                onClick={() => {
                  setJobTitle(title);
                  setShowDropdown(false);
                }}
                className={`
                  w-full px-3 py-2.5 text-left text-[15px] transition-colors rounded-md
                  hover:bg-authPrimary/10
                  ${jobTitle === title ? 'text-authPrimary bg-authPrimary/5' : 'text-textMain'}
                `}
              >
                {title}
              </button>
            ))}
          </div>
        )}

        {/* Floating label for dropdown */}
        {jobTitle && (
          <span className="absolute -top-2.5 left-4 text-xs bg-authBackground px-1 text-textMuted">
            Your role
          </span>
        )}
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
    </form>
  );
};
