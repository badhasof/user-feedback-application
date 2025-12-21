"use client";

import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import Image from 'next/image';
import { OnboardingProgress } from './OnboardingProgress';
import { PersonalProfileStep } from './PersonalProfileStep';
import { WorkInfoStep } from './WorkInfoStep';
import { PreferencesStep } from './PreferencesStep';

interface OnboardingFlowProps {
  user: {
    name?: string;
    email?: string;
    image?: string;
  } | null;
  onComplete?: () => void;
}

type Step = 1 | 2 | 3;

interface OnboardingData {
  // Step 1
  fullName: string;
  jobTitle: string;
  avatarStorageId?: Id<"_storage">;
  // Step 2
  companyName: string;
  companySize: string;
  useCases: string[];
  // Step 3
  referralSource?: string;
  goals?: string;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<Partial<OnboardingData>>({
    fullName: user?.name || '',
  });

  // Get existing profile data if any
  const existingProfile = useQuery(api.userProfiles.getUserProfile);

  // Mutations
  const saveStep1 = useMutation(api.userProfiles.saveOnboardingStep1);
  const saveStep2 = useMutation(api.userProfiles.saveOnboardingStep2);
  const saveStep3 = useMutation(api.userProfiles.saveOnboardingStep3);
  const skipStep3 = useMutation(api.userProfiles.skipOnboardingStep3);

  const handleStep1Continue = async (step1Data: {
    fullName: string;
    jobTitle: string;
    avatarStorageId?: Id<"_storage">;
  }) => {
    setSubmitting(true);
    try {
      await saveStep1({
        fullName: step1Data.fullName,
        avatarStorageId: step1Data.avatarStorageId,
        jobTitle: step1Data.jobTitle,
      });

      setData((prev) => ({ ...prev, ...step1Data }));
      setCurrentStep(2);
    } catch (error) {
      console.error('Error saving step 1:', error);
      toast.error('Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2Continue = async (step2Data: {
    companyName: string;
    companySize: string;
    useCases: string[];
  }) => {
    setSubmitting(true);
    try {
      await saveStep2({
        companyName: step2Data.companyName,
        companySize: step2Data.companySize,
        useCases: step2Data.useCases,
      });

      setData((prev) => ({ ...prev, ...step2Data }));
      setCurrentStep(3);
    } catch (error) {
      console.error('Error saving step 2:', error);
      toast.error('Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep3Continue = async (step3Data: {
    referralSource?: string;
    goals?: string;
  }) => {
    setSubmitting(true);
    try {
      await saveStep3({
        referralSource: step3Data.referralSource,
        goals: step3Data.goals,
      });

      setData((prev) => ({ ...prev, ...step3Data }));
      toast.success('Welcome aboard!');
      onComplete?.();
    } catch (error) {
      console.error('Error saving step 3:', error);
      toast.error('Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipStep3 = async () => {
    setSubmitting(true);
    try {
      await skipStep3();
      toast.success('Welcome aboard!');
      onComplete?.();
    } catch (error) {
      console.error('Error skipping step 3:', error);
      toast.error('Failed to complete. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-authBackground text-textMain selection:bg-authPrimary/30">
      <div className="w-full max-w-[440px] px-5 sm:px-0 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        {/* Logo Section */}
        <div className="mb-6 h-[80px] overflow-hidden flex items-end justify-center">
          <Image src="/logo.png" alt="Logo" width={200} height={200} className="-mb-[50px]" />
        </div>

        {/* Progress Indicator */}
        <OnboardingProgress currentStep={currentStep} totalSteps={3} />

        {/* Step Content */}
        <div className="w-full">
          {currentStep === 1 && (
            <PersonalProfileStep
              initialName={data.fullName || existingProfile?.fullName || user?.name || ''}
              initialJobTitle={data.jobTitle || existingProfile?.jobTitle || ''}
              initialAvatarUrl={existingProfile?.avatarUrl || user?.image}
              onContinue={handleStep1Continue}
              submitting={submitting}
            />
          )}

          {currentStep === 2 && (
            <WorkInfoStep
              initialCompanyName={data.companyName || existingProfile?.companyName || ''}
              initialCompanySize={data.companySize || existingProfile?.companySize || ''}
              initialUseCases={data.useCases || existingProfile?.useCases || []}
              onContinue={handleStep2Continue}
              onBack={handleBack}
              submitting={submitting}
            />
          )}

          {currentStep === 3 && (
            <PreferencesStep
              initialReferralSource={data.referralSource || existingProfile?.referralSource || ''}
              initialGoals={data.goals || existingProfile?.goals || ''}
              onContinue={handleStep3Continue}
              onSkip={handleSkipStep3}
              onBack={handleBack}
              submitting={submitting}
            />
          )}
        </div>

        {/* Step Counter */}
        <div className="mt-8 text-xs text-textMuted">
          Step {currentStep} of 3
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
