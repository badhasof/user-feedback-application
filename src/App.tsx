import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { Toaster } from "sonner";
import { FeedbackApp } from "./components/FeedbackApp";

export default function App() {
  return (
    <>
      <Content />
      <Toaster position="top-right" />
    </>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>

      <Authenticated>
        <FeedbackApp user={loggedInUser} />
      </Authenticated>
    </>
  );
}
