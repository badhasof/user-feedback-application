"use client";

import Dashboard from "./dashboard";
import { AppSidebar } from "./app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function FeedbackApp({ user }: { user: any }) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/5 bg-[#0f0f10]">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-neutral-400 hover:text-neutral-200 hover:bg-white/5" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
            <span className="text-sm font-medium text-neutral-200">Dashboard</span>
          </div>
        </header>
        <Dashboard user={user} />
      </SidebarInset>
    </SidebarProvider>
  );
}
