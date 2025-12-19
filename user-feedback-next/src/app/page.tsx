"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AuthScreen from "@/components/auth/AuthScreen";
import { Toaster } from "sonner";
import { FeedbackApp } from "@/components/FeedbackApp";

export default function Home() {
  return (
    <>
      <Content />
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#161616',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f4f4f5',
          },
        }}
      />
    </>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-neutral-700 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Unauthenticated>
        <AuthScreen />
      </Unauthenticated>

      <Authenticated>
        <FeedbackApp user={loggedInUser} />
      </Authenticated>
    </>
  );
}
