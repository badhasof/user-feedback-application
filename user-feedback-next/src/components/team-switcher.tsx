"use client";

import * as React from "react";
import { useState } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTeam } from "@/contexts/TeamContext";
import { getIconComponent } from "@/lib/icons";
import { CreateTeamDialog } from "./CreateTeamDialog";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { teams, activeTeam, setActiveTeam, isLoading } = useTeam();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-neutral-800" />
            <div className="grid flex-1 text-left text-sm leading-tight gap-1">
              <div className="h-4 bg-neutral-800 rounded w-24" />
              <div className="h-3 bg-neutral-800 rounded w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // No teams state - show prompt to create
  if (!activeTeam || teams.length === 0) {
    return (
      <>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => setCreateDialogOpen(true)}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg border-2 border-dashed border-neutral-600">
                <Plus className="size-4 text-neutral-500" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-neutral-400">
                  Create a team
                </span>
                <span className="truncate text-xs text-neutral-500">
                  Get started
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <CreateTeamDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </>
    );
  }

  const ActiveIcon = getIconComponent(activeTeam.iconName);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ActiveIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-xs">{activeTeam.plan}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {teams.map((team, index) => {
                const TeamIcon = getIconComponent(team.iconName);
                return (
                  <DropdownMenuItem
                    key={team._id}
                    onClick={() => setActiveTeam(team)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <TeamIcon className="size-4 shrink-0" />
                    </div>
                    {team.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => setCreateDialogOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add team
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateTeamDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}
