"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
              <span className="font-bold text-lg tracking-tighter">Ac</span>
            </div>
            <span className="text-xl font-bold text-neutral-100">Acme Feedback</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#161616] rounded-2xl border border-white/5 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-100 mb-2">
              {flow === "signIn" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-neutral-500">
              {flow === "signIn"
                ? "Enter your email to sign in to your account"
                : "Enter your email below to create your account"}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitting(true);
              const formData = new FormData(e.target as HTMLFormElement);
              formData.set("flow", flow);
              void signIn("password", formData).catch((error) => {
                let toastTitle = "";
                if (error.message.includes("Invalid password")) {
                  toastTitle = "Invalid password. Please try again.";
                } else {
                  toastTitle =
                    flow === "signIn"
                      ? "Could not sign in, did you mean to sign up?"
                      : "Could not sign up, did you mean to sign in?";
                }
                toast.error(toastTitle);
                setSubmitting(false);
              });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2">
                Email
              </label>
              <input
                id="email"
                placeholder="name@example.com"
                type="email"
                name="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl bg-[#1E1E1E] border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-neutral-200 placeholder:text-neutral-600 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2">
                Password
              </label>
              <input
                id="password"
                placeholder="Password"
                type="password"
                name="password"
                autoCapitalize="none"
                autoComplete={flow === "signIn" ? "current-password" : "new-password"}
                autoCorrect="off"
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl bg-[#1E1E1E] border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-neutral-200 placeholder:text-neutral-600 disabled:opacity-50"
                required
              />
            </div>

            <button
              disabled={submitting}
              className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              type="submit"
            >
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
              {flow === "signIn" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#161616] px-3 text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void signIn("anonymous")}
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl bg-[#1E1E1E] border border-white/10 text-neutral-300 font-medium hover:bg-[#252525] hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as Guest
          </button>

          <p className="mt-6 text-center text-sm text-neutral-500">
            <button
              type="button"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            >
              {flow === "signIn"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </p>
        </div>

        {/* Footer Quote */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-600 italic">
            &quot;This feedback platform helped us ship better products faster.&quot;
          </p>
          <p className="text-xs text-neutral-700 mt-1">- Sofia Davis</p>
        </div>
      </div>
    </div>
  );
}
