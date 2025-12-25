"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Bug, Lightbulb, Sparkles, HelpCircle, CornerDownRight } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";

// Form validation schema
const feedbackFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  category: z.enum(["Bug", "Feature", "Improvement", "Other"]),
  isAnonymous: z.boolean(),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

const categories = [
  { value: "Bug", label: "Bug", icon: Bug, color: "text-red-400", bg: "bg-red-500/10" },
  { value: "Feature", label: "Feature", icon: Lightbulb, color: "text-blue-400", bg: "bg-blue-500/10" },
  { value: "Improvement", label: "Improve", icon: Sparkles, color: "text-green-400", bg: "bg-green-500/10" },
  { value: "Other", label: "Other", icon: HelpCircle, color: "text-neutral-400", bg: "bg-neutral-500/10" },
] as const;

interface PublicFeedbackDialogProps {
  teamId: Id<"teams">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: "Bug" | "Feature" | "Improvement" | "Other";
}

export function PublicFeedbackDialog({
  teamId,
  open,
  onOpenChange,
  defaultCategory = "Feature",
}: PublicFeedbackDialogProps) {
  const submitFeedback = useMutation(api.feedback.submitFeedback);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: defaultCategory,
      isAnonymous: true,
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      await submitFeedback({
        teamId,
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        isAnonymous: data.isAnonymous,
        isPublicSubmission: true,
      });
      toast.success("Feedback submitted successfully!");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  const selectedCategory = form.watch("category");
  const errors = form.formState.errors;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] bg-[#161616] border-white/5 p-0 gap-0 overflow-hidden">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="px-8 pt-8 pb-5">
            <DialogTitle className="text-xl font-normal text-neutral-100 tracking-tight">
              Submit Feedback
            </DialogTitle>
            <p className="text-[15px] text-neutral-500 mt-1.5 font-normal">
              Share feedback, report bugs, or request features
            </p>
          </div>

          {/* Category Pills */}
          <div className="px-8 pb-5">
            <div className="flex gap-2.5 flex-wrap">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => form.setValue("category", cat.value as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-normal transition-all ${
                      isSelected
                        ? `${cat.bg} ${cat.color} ring-1 ring-current/20`
                        : "bg-[#1E1E1E] text-neutral-500 hover:text-neutral-300 hover:bg-[#252525]"
                    }`}
                  >
                    <Icon size={16} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="px-8 space-y-5">
            {/* Title */}
            <div>
              <input
                {...form.register("title")}
                placeholder="Short, descriptive title"
                className="w-full text-[19px] font-normal placeholder:text-neutral-600 outline-none border-b border-white/5 pb-3 bg-transparent text-neutral-200 focus:border-blue-500/30 transition-colors leading-snug"
              />
              {errors.title && (
                <p className="text-sm text-red-400 mt-2">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <textarea
                {...form.register("description")}
                rows={4}
                placeholder={
                  selectedCategory === "Bug"
                    ? "Describe the bug and steps to reproduce..."
                    : selectedCategory === "Feature"
                    ? "Describe the feature you'd like to see..."
                    : "Share your thoughts..."
                }
                className="w-full text-[16px] text-neutral-300 placeholder:text-neutral-600 outline-none resize-none bg-transparent leading-relaxed font-normal"
              />
              {errors.description && (
                <p className="text-sm text-red-400 mt-2">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 mt-3 border-t border-white/5 flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...form.register("isAnonymous")}
                className="w-4 h-4 rounded border-neutral-700 bg-[#1E1E1E] text-blue-600 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-sm text-neutral-500">Post anonymously</span>
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-5 py-2.5 text-sm text-neutral-500 hover:text-neutral-300 font-normal transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="brand-button px-5 py-2.5 rounded-lg text-sm font-normal flex items-center gap-2"
              >
                Submit <CornerDownRight size={16} />
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
