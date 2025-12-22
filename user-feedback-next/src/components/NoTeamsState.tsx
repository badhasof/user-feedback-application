"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2, LogOut, Plus, Users } from "lucide-react";
import { CreateTeamDialog } from "./CreateTeamDialog";
import { useAuthActions } from "@convex-dev/auth/react";

export function NoTeamsState() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen bg-authBackground flex items-center justify-center p-4 relative selection:bg-authPrimary/30">
      {/* Logout button */}
      <button
        onClick={() => signOut()}
        className="absolute top-4 right-4 flex items-center gap-2 text-textMuted hover:text-textMain text-sm transition-colors"
      >
        <LogOut size={16} />
        Sign out
      </button>

      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-6 h-[88px] overflow-hidden flex items-end justify-center">
          <Image src="/logo.png" alt="Logo" width={200} height={200} className="-mb-[50px]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-light text-textMain mb-3 tracking-tight">
          Welcome to <span className="text-authPrimary font-normal">Votivy</span>
        </h1>

        {/* Description */}
        <p className="text-base text-textMuted mb-8 leading-relaxed">
          Create your first workspace to start collecting and managing feedback for
          your products and projects.
        </p>

        {/* Create Team Button */}
        <button
          onClick={() => setCreateDialogOpen(true)}
          className="inline-flex items-center gap-2 bg-authPrimary hover:bg-authPrimaryHover text-white px-5 py-2.5 rounded-lg text-base font-normal transition-colors shadow-lg shadow-authPrimary/20"
        >
          <Plus size={18} />
          Create your first workspace
        </button>

        {/* Features */}
        <div className="mt-12 grid gap-4 text-left">
          <div className="flex gap-4 p-4 bg-[#1f1f1f] rounded-lg border border-authBorder">
            <div className="w-10 h-10 bg-authBackground rounded-lg flex items-center justify-center shrink-0 border border-authBorder">
              <Users className="w-5 h-5 text-authPrimary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-textMain mb-1">
                Multi-workspace support
              </h3>
              <p className="text-xs text-textMuted">
                Create separate workspaces for each of your products or projects
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-[#1f1f1f] rounded-lg border border-authBorder">
            <div className="w-10 h-10 bg-authBackground rounded-lg flex items-center justify-center shrink-0 border border-authBorder">
              <Building2 className="w-5 h-5 text-authPrimary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-textMain mb-1">
                Invite collaborators
              </h3>
              <p className="text-xs text-textMuted">
                Share invite links to add members and collaborate
              </p>
            </div>
          </div>
        </div>

        <CreateTeamDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </div>
    </div>
  );
}
