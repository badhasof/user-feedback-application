"use client";

import React from 'react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <div
              className={`
                w-2.5 h-2.5 rounded-full transition-all duration-300
                ${isCurrent ? 'bg-authPrimary scale-125' : ''}
                ${isCompleted ? 'bg-authPrimary' : ''}
                ${!isCurrent && !isCompleted ? 'bg-authBorder' : ''}
              `}
            />
            {stepNumber < totalSteps && (
              <div
                className={`
                  w-8 h-0.5 transition-all duration-300
                  ${isCompleted ? 'bg-authPrimary' : 'bg-authBorder'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
