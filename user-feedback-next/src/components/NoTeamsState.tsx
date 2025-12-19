"use client";

import { useState } from "react";
import { Building2, LogOut, Plus, Users } from "lucide-react";
import { CreateTeamDialog } from "./CreateTeamDialog";
import { useAuthActions } from "@convex-dev/auth/react";

export function NoTeamsState() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative">
      {/* Logout button */}
      <button
        onClick={() => signOut()}
        className="absolute top-4 right-4 flex items-center gap-2 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
      >
        <LogOut size={16} />
        Sign out
      </button>

      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-[#1E1E1E] rounded-2xl flex items-center justify-center mb-6">
          <Building2 className="w-8 h-8 text-neutral-400" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-neutral-100 mb-3">
          Welcome to Feedback App
        </h1>

        {/* Description */}
        <p className="text-neutral-500 mb-8 leading-relaxed">
          Create your first team to start collecting and managing feedback for
          your products and projects.
        </p>

        {/* Create Team Button */}
        <button
          onClick={() => setCreateDialogOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} />
          Create your first team
        </button>

        {/* Features */}
        <div className="mt-12 grid gap-4 text-left">
          <div className="flex gap-4 p-4 bg-[#161616] rounded-lg border border-white/5">
            <div className="w-10 h-10 bg-[#1E1E1E] rounded-lg flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-200 mb-1">
                Multi-team support
              </h3>
              <p className="text-xs text-neutral-500">
                Create separate teams for each of your products or projects
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-[#161616] rounded-lg border border-white/5">
            <div className="w-10 h-10 bg-[#1E1E1E] rounded-lg flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-200 mb-1">
                Invite collaborators
              </h3>
              <p className="text-xs text-neutral-500">
                Share invite links to add team members and collaborate
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
