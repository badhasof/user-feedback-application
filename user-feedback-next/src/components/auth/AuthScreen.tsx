"use client";

import React, { useState } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import Image from 'next/image';
import { SocialButton } from './SocialButton';
import { Divider } from './Divider';
import { Input } from './Input';
import { Button } from './Button';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';

type AuthMode = 'signin' | 'signup';
type AuthStep = 'credentials' | 'otp';

const AuthScreen: React.FC = () => {
  const { signIn } = useAuthActions();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [step, setStep] = useState<AuthStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // For signup, show OTP screen first
    if (mode === 'signup') {
      setStep('otp');
      setSubmitting(false);
      return;
    }

    // For signin, proceed directly
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("flow", "signIn");

    void signIn("password", formData).catch((error) => {
      let toastTitle = "";
      if (error.message.includes("Invalid password")) {
        toastTitle = "Invalid password. Please try again.";
      } else {
        toastTitle = "Could not sign in, did you mean to sign up?";
      }
      toast.error(toastTitle);
      setSubmitting(false);
    });
  };

  const handleOTPVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setSubmitting(true);

    // For now, accept any 6 digits and proceed with signup
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    formData.set("flow", "signUp");

    void signIn("password", formData).catch((error) => {
      let toastTitle = "";
      if (error.message.includes("Invalid password")) {
        toastTitle = "Invalid password. Please try again.";
      } else {
        toastTitle = "Could not sign up, did you mean to sign in?";
      }
      toast.error(toastTitle);
      setSubmitting(false);
      setStep('credentials');
    });
  };

  const handleGoogleAuth = () => {
    setSubmitting(true);
    void signIn("google").catch(() => {
      toast.error("Could not sign in with Google");
      setSubmitting(false);
    });
  };

  const handleAnonymousAuth = () => {
    setSubmitting(true);
    void signIn("anonymous").catch(() => {
      toast.error("Could not continue as guest");
      setSubmitting(false);
    });
  };

  // OTP Verification Screen
  if (step === 'otp') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-authBackground text-textMain selection:bg-authPrimary/30">
        <div className="w-full max-w-[400px] px-5 sm:px-0 flex flex-col items-center animate-in fade-in zoom-in duration-500">
          {/* Logo Section */}
          <div className="mb-4 h-[100px] overflow-hidden flex items-end justify-center">
            <Image src="/logo.png" alt="Logo" width={240} height={240} className="-mb-[60px]" />
          </div>

          {/* Header Text */}
          <h1 className="text-4xl font-light mb-2 tracking-tight text-center text-white">
            Enter verification code
          </h1>
          <p className="text-sm text-textMuted mb-8 text-center">
            We sent a 6-digit code to {email}
          </p>

          {/* OTP Form */}
          <form onSubmit={handleOTPVerify} className="w-full flex flex-col items-center gap-6">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              containerClassName="gap-3"
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="h-14 w-11 rounded-lg border border-authBorder bg-[#1f1f1f] text-lg text-textMain" />
                <InputOTPSlot index={1} className="h-14 w-11 rounded-lg border border-authBorder bg-[#1f1f1f] text-lg text-textMain" />
                <InputOTPSlot index={2} className="h-14 w-11 rounded-lg border border-authBorder bg-[#1f1f1f] text-lg text-textMain" />
              </InputOTPGroup>
              <InputOTPSeparator className="text-textMuted" />
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={3} className="h-14 w-11 rounded-lg border border-authBorder bg-[#1f1f1f] text-lg text-textMain" />
                <InputOTPSlot index={4} className="h-14 w-11 rounded-lg border border-authBorder bg-[#1f1f1f] text-lg text-textMain" />
                <InputOTPSlot index={5} className="h-14 w-11 rounded-lg border border-authBorder bg-[#1f1f1f] text-lg text-textMain" />
              </InputOTPGroup>
            </InputOTP>

            <Button type="submit" disabled={submitting || otp.length !== 6} className="w-full">
              {submitting && (
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              Verify
            </Button>

            <p className="text-sm text-textMuted text-center">
              Didn't receive the code?{' '}
              <button
                type="button"
                className="text-authPrimary hover:text-authPrimaryHover transition-colors font-medium"
                onClick={() => toast.success("Code resent!")}
              >
                Resend
              </button>
            </p>

            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="text-sm text-textMuted hover:text-textMain transition-colors"
            >
              ← Back to sign up
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-12 text-[12px] text-textMuted flex gap-4">
            <a href="#" className="hover:underline hover:text-textMain transition-colors">Terms of Use</a>
            <span className="text-[#424242]">|</span>
            <a href="#" className="hover:underline hover:text-textMain transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    );
  }

  // Credentials Screen (Sign In / Sign Up)
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-authBackground text-textMain selection:bg-authPrimary/30">
      <div className="w-full max-w-[400px] px-5 sm:px-0 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        {/* Logo Section */}
        <div className="mb-4 h-[100px] overflow-hidden flex items-end justify-center">
          <Image src="/logo.png" alt="Logo" width={240} height={240} className="-mb-[60px]" />
        </div>

        {/* Header Text */}
        <h1 className="text-4xl font-light mb-2 tracking-tight text-center text-white">
          {mode === 'signin' ? 'Welcome back' : 'Create an account'}
        </h1>


        {/* Main Form Area */}
        <div className="w-full flex flex-col gap-3 mt-6">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <div className="relative group">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
              />
            </div>

            <div className="relative group">
              <Input
                id="password-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                required
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting && (
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="py-2 text-sm text-center">
            <span className="text-textMuted mr-1">
              {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={toggleMode}
              className="text-authPrimary hover:text-authPrimaryHover transition-colors font-medium"
            >
              {mode === 'signin' ? 'Sign up' : 'Log in'}
            </button>
          </div>

          <Divider />

          <div className="flex flex-col gap-3 mt-1">
            <SocialButton
              provider="google"
              onClick={handleGoogleAuth}
              disabled={submitting}
            />
            <button
              type="button"
              onClick={handleAnonymousAuth}
              disabled={submitting}
              className="w-full bg-transparent border border-authBorder hover:bg-[#2A2B32] text-textMain font-normal rounded-lg py-3.5 px-4 transition-colors duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-[12px] text-textMuted flex gap-4">
          <a href="#" className="hover:underline hover:text-textMain transition-colors">Terms of Use</a>
          <span className="text-[#424242]">|</span>
          <a href="#" className="hover:underline hover:text-textMain transition-colors">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
