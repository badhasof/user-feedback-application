"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  ExternalLink,
  TrendingUp,
  Clock,
  User,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavQuickFilters } from "@/components/nav-quick-filters";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Navigation data for feedback management
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Boards",
      url: "#",
      icon: MessageSquare,
      isActive: true,
      items: [
        { title: "Feature Requests", url: "#" },
        { title: "Bug Reports", url: "#" },
        { title: "Improvements", url: "#" },
        { title: "All Feedback", url: "#" },
      ],
    },
    {
      title: "Planning",
      url: "#",
      icon: Kanban,
      items: [
        { title: "Roadmap", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Portal",
      url: "#",
      icon: ExternalLink,
      items: [
        { title: "Public Page", url: "#" },
        { title: "Customize", url: "#" },
      ],
    },
  ],
  quickFilters: [
    { name: "Most Voted", url: "#", icon: TrendingUp },
    { name: "Recently Added", url: "#", icon: Clock },
    { name: "My Submissions", url: "#", icon: User },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const authUser = useQuery(api.auth.loggedInUser);

  const user = {
    name: userProfile?.fullName || authUser?.name || "User",
    email: authUser?.email || "",
    avatar: userProfile?.avatarUrl || "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavQuickFilters filters={data.quickFilters} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
