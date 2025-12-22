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

    if (!slugAvailable?.available) {
      toast.error(
        slugAvailable?.reason === "reserved"
          ? "This URL is reserved"
          : slugAvailable?.reason === "invalid_format"
          ? "Invalid URL format"
          : "This URL is already taken"
      );
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

      toast.success("Workspace created successfully!");

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
      toast.error(error.message || "Failed to create workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px] bg-authBackground border-authBorder p-0 gap-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="px-8 pt-8 pb-5">
            <DialogTitle className="text-2xl font-light text-textMain tracking-tight">
              Create a new workspace
            </DialogTitle>
            <p className="text-sm text-textMuted mt-2">
              Workspaces let you organize feedback for different projects or products
            </p>
          </div>

          {/* Form Fields */}
          <div className="px-8 space-y-5">
            {/* Workspace Name */}
            <div className="relative">
              <input
                type="text"
                id="workspace-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Product"
                className="peer w-full text-[15px] outline-none border border-authBorder rounded-lg px-4 py-3.5 bg-transparent text-textMain placeholder-transparent focus:border-authPrimary focus:ring-1 focus:ring-authPrimary transition-all duration-200"
              />
              <label
                htmlFor="workspace-name"
                className="absolute left-4 top-3.5 text-[15px] text-textMuted transition-all duration-200 pointer-events-none peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-authBackground peer-focus:px-1 peer-focus:text-authPrimary peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-authBackground peer-[:not(:placeholder-shown)]:px-1"
              >
                Workspace name
              </label>
            </div>

            {/* Workspace URL/Slug */}
            <div className="relative">
              <div className="flex items-center gap-0 bg-transparent border border-authBorder rounded-lg overflow-hidden focus-within:border-authPrimary focus-within:ring-1 focus-within:ring-authPrimary transition-all duration-200">
                <input
                  type="text"
                  id="workspace-url"
                  value={slug}
                  onChange={(e) => {
                    setSlug(generateSlug(e.target.value));
                    setSlugEdited(true);
                  }}
                  placeholder="my-product"
                  className="peer flex-1 text-[15px] outline-none px-4 py-3.5 bg-transparent text-textMain placeholder-transparent"
                />
                <span className="text-textMuted text-sm px-4 border-l border-authBorder bg-[#1f1f1f] py-3.5">.votivy.com</span>
              </div>
              <label
                htmlFor="workspace-url"
                className={`absolute left-4 text-[15px] text-textMuted transition-all duration-200 pointer-events-none ${
                  slug ? "-top-2.5 text-xs bg-authBackground px-1" : "top-3.5"
                }`}
              >
                Workspace URL
              </label>
              {slug && (
                <p className="text-xs text-textMuted mt-2">
                  Your feedback page: <span className="text-textMain">{slug}.votivy.com</span>
                </p>
              )}
              {slug && slugAvailable && !slugAvailable.available && (
                <p className="text-sm text-red-400 mt-2">
                  {slugAvailable.reason === "reserved"
                    ? "This URL is reserved and cannot be used"
                    : slugAvailable.reason === "invalid_format"
                    ? "Invalid format. Use 2-63 lowercase letters, numbers, and hyphens."
                    : "This URL is already taken"}
                </p>
              )}
              {slug && slugAvailable?.available && (
                <p className="text-sm text-authPrimary mt-2 flex items-center gap-1">
                  <Check size={14} /> Available
                </p>
              )}
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm text-textMuted mb-2">
                Workspace icon
              </label>
              <div className="grid grid-cols-10 gap-2">
                {TEAM_ICONS.map(({ name: iconName, icon: Icon }) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-2 rounded-lg transition-all ${
                      selectedIcon === iconName
                        ? "bg-authPrimary text-white"
                        : "bg-[#1f1f1f] text-textMuted hover:text-textMain hover:bg-authPrimary/10"
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 mt-5 border-t border-authBorder flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-textMuted hover:text-textMain transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !name.trim() ||
                !slug.trim() ||
                !slugAvailable?.available
              }
              className="px-5 py-3 bg-authPrimary text-white rounded-lg text-sm font-normal hover:bg-authPrimaryHover transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create workspace"}
              <Plus size={16} />
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
