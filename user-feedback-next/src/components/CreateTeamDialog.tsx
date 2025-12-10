"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Plus, Check } from "lucide-react";
import { useTeam } from "@/contexts/TeamContext";
import { TEAM_ICONS, getIconComponent, generateSlug } from "@/lib/icons";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface CreateTeamDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function CreateTeamDialog({
  open: controlledOpen,
  onOpenChange,
  trigger,
}: CreateTeamDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("Building");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setActiveTeam } = useTeam();
  const createTeam = useMutation(api.teams.createTeam);
  const slugAvailable = useQuery(
    api.teams.checkSlugAvailable,
    slug ? { slug } : "skip"
  );

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugEdited && name) {
      setSlug(generateSlug(name));
    }
  }, [name, slugEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    if (slugAvailable === false) {
      toast.error("This team URL is already taken");
      return;
    }

    setIsSubmitting(true);
    try {
      const teamId = await createTeam({
        name: name.trim(),
        slug: slug.trim(),
        iconName: selectedIcon,
        plan: "Free",
      });

      toast.success("Team created successfully!");

      // Set the new team as active
      setActiveTeam({
        _id: teamId,
        name: name.trim(),
        slug: slug.trim(),
        iconName: selectedIcon,
        plan: "Free",
        ownerId: "" as any, // Will be filled by the query
        createdAt: Date.now(),
        role: "owner",
      });

      // Reset form
      setName("");
      setSlug("");
      setSlugEdited(false);
      setSelectedIcon("Building");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px] bg-[#161616] border-white/5 p-0 gap-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-8 pt-8 pb-5">
            <DialogTitle className="text-xl font-normal text-neutral-100 tracking-tight">
              Create a new team
            </DialogTitle>
            <p className="text-[15px] text-neutral-500 mt-1.5 font-normal">
              Teams let you organize feedback for different projects or products
            </p>
          </div>

          {/* Form Fields */}
          <div className="px-8 space-y-5">
            {/* Team Name */}
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Team name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Product"
                className="w-full text-[16px] font-normal placeholder:text-neutral-600 outline-none border border-white/10 rounded-lg px-4 py-3 bg-[#1E1E1E] text-neutral-200 focus:border-blue-500/50 transition-colors"
              />
            </div>

            {/* Team URL/Slug */}
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Team URL
              </label>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 text-sm">feedback.app/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(generateSlug(e.target.value));
                    setSlugEdited(true);
                  }}
                  placeholder="my-product"
                  className="flex-1 text-[16px] font-normal placeholder:text-neutral-600 outline-none border border-white/10 rounded-lg px-4 py-3 bg-[#1E1E1E] text-neutral-200 focus:border-blue-500/50 transition-colors"
                />
              </div>
              {slug && slugAvailable === false && (
                <p className="text-sm text-red-400 mt-2">
                  This URL is already taken
                </p>
              )}
              {slug && slugAvailable === true && (
                <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                  <Check size={14} /> Available
                </p>
              )}
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Team icon
              </label>
              <div className="grid grid-cols-10 gap-2">
                {TEAM_ICONS.map(({ name: iconName, icon: Icon }) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-2 rounded-lg transition-all ${
                      selectedIcon === iconName
                        ? "bg-blue-600 text-white"
                        : "bg-[#1E1E1E] text-neutral-400 hover:text-neutral-200 hover:bg-[#252525]"
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 mt-5 border-t border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2.5 text-sm text-neutral-500 hover:text-neutral-300 font-normal transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !name.trim() ||
                !slug.trim() ||
                slugAvailable === false
              }
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-normal hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create team"}
              <Plus size={16} />
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
