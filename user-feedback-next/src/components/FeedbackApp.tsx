"use client";

import Dashboard from "./dashboard";
import { AppSidebar } from "./app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TeamProvider, useTeam } from "@/contexts/TeamContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { NoTeamsState } from "./NoTeamsState";

interface UserWithProfile {
  _id: string;
  name?: string;
  email?: string;
  isAnonymous?: boolean;
  profile?: {
    name?: string;
    company?: string;
    role?: string;
    avatarUrl?: string | null;
  } | null;
}

function FeedbackAppContent({ user }: { user: UserWithProfile }) {
  const { teams, activeTeam, isLoading } = useTeam();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-neutral-800 rounded-xl" />
          <div className="h-4 w-32 bg-neutral-800 rounded" />
        </div>
      </div>
    );
  }

  // No teams state - show team creation
  if (teams.length === 0 || !activeTeam) {
    return <NoTeamsState />;
  }

  // Normal dashboard view
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/5 bg-[#0f0f10]">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-neutral-200 hover:bg-white/5" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 bg-white/10"
            />
            <span className="text-sm font-medium text-neutral-200">
              Dashboard
            </span>
          </div>
        </header>
        <Dashboard user={user} />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function FeedbackApp({ user }: { user: UserWithProfile }) {
  return (
    <TeamProvider>
      <NavigationProvider>
        <FeedbackAppContent user={user} />
      </NavigationProvider>
    </TeamProvider>
  );
}
