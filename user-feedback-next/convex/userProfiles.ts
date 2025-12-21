import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get the current user's profile
export const getUserProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      return null;
    }

    // If there's an avatar storage ID, get the URL
    let avatarUrl = profile.avatarUrl;
    if (profile.avatarStorageId) {
      avatarUrl = await ctx.storage.getUrl(profile.avatarStorageId) || undefined;
    }

    return {
      ...profile,
      avatarUrl,
    };
  },
});

// Quick check if user has completed onboarding
export const hasCompletedOnboarding = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    // If no profile exists, onboarding not completed
    if (!profile) {
      return false;
    }

    // Handle legacy profiles that might not have onboardingCompleted set
    return profile.onboardingCompleted === true;
  },
});

// Save step 1: Personal Profile
export const saveOnboardingStep1 = mutation({
  args: {
    fullName: v.string(),
    avatarStorageId: v.optional(v.id("_storage")),
    jobTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const now = Date.now();

    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        fullName: args.fullName,
        avatarStorageId: args.avatarStorageId,
        jobTitle: args.jobTitle,
        updatedAt: now,
      });
      return existingProfile._id;
    } else {
      // Create new profile
      const profileId = await ctx.db.insert("userProfiles", {
        userId,
        fullName: args.fullName,
        avatarStorageId: args.avatarStorageId,
        jobTitle: args.jobTitle,
        onboardingCompleted: false,
        createdAt: now,
        updatedAt: now,
      });
      return profileId;
    }
  },
});

// Save step 2: Work Info
export const saveOnboardingStep2 = mutation({
  args: {
    companyName: v.string(),
    companySize: v.string(),
    useCases: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found. Please complete step 1 first.");
    }

    await ctx.db.patch(profile._id, {
      companyName: args.companyName,
      companySize: args.companySize,
      useCases: args.useCases,
      updatedAt: Date.now(),
    });

    return profile._id;
  },
});

// Save step 3: Preferences (also marks onboarding as complete)
export const saveOnboardingStep3 = mutation({
  args: {
    referralSource: v.optional(v.string()),
    goals: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found. Please complete previous steps first.");
    }

    await ctx.db.patch(profile._id, {
      referralSource: args.referralSource,
      goals: args.goals,
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });

    return profile._id;
  },
});

// Skip step 3 and mark onboarding as complete
export const skipOnboardingStep3 = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found. Please complete previous steps first.");
    }

    await ctx.db.patch(profile._id, {
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });

    return profile._id;
  },
});

// Generate upload URL for avatar
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// Update profile (for settings page later)
export const updateProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    jobTitle: v.optional(v.string()),
    companyName: v.optional(v.string()),
    companySize: v.optional(v.string()),
    useCases: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };

    if (args.fullName !== undefined) updates.fullName = args.fullName;
    if (args.avatarStorageId !== undefined) updates.avatarStorageId = args.avatarStorageId;
    if (args.jobTitle !== undefined) updates.jobTitle = args.jobTitle;
    if (args.companyName !== undefined) updates.companyName = args.companyName;
    if (args.companySize !== undefined) updates.companySize = args.companySize;
    if (args.useCases !== undefined) updates.useCases = args.useCases;

    await ctx.db.patch(profile._id, updates);

    return profile._id;
  },
});
