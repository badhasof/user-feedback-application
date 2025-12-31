import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper to verify team membership
async function verifyTeamMembership(ctx: any, teamId: any, userId: any) {
  if (!userId) return false;
  const membership = await ctx.db
    .query("teamMembers")
    .withIndex("by_team_and_user", (q: any) =>
      q.eq("teamId", teamId).eq("userId", userId)
    )
    .first();
  return !!membership;
}

export const submitFeedback = mutation({
  args: {
    teamId: v.id("teams"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    isAnonymous: v.boolean(),
    isPublicSubmission: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Skip team membership check for public submissions
    if (!args.isPublicSubmission && userId) {
      const isMember = await verifyTeamMembership(ctx, args.teamId, userId);
      if (!isMember) {
        throw new Error("Not a member of this team");
      }
    }

    const feedbackId = await ctx.db.insert("feedback", {
      teamId: args.teamId,
      title: args.title,
      description: args.description,
      category: args.category,
      status: "new",
      votes: 0,
      createdBy: args.isAnonymous || !userId ? undefined : userId,
      isAnonymous: args.isAnonymous,
    });

    return feedbackId;
  },
});

export const listFeedback = query({
  args: {
    teamId: v.id("teams"),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Verify team membership
    if (userId) {
      const isMember = await verifyTeamMembership(ctx, args.teamId, userId);
      if (!isMember) {
        return [];
      }
    }

    // Query feedback for this team
    let feedback = await ctx.db
      .query("feedback")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .order("desc")
      .collect();

    // Filter by category if specified
    if (args.category && args.category !== "all") {
      feedback = feedback.filter((f) => f.category === args.category);
    }

    // Filter by status if specified
    if (args.status && args.status !== "all") {
      feedback = feedback.filter((f) => f.status === args.status);
    }

    return feedback.sort((a, b) => b.votes - a.votes);
  },
});

export const voteFeedback = mutation({
  args: {
    teamId: v.id("teams"),
    feedbackId: v.id("feedback"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Verify the feedback belongs to this team
    const feedback = await ctx.db.get(args.feedbackId);
    if (!feedback || feedback.teamId !== args.teamId) {
      throw new Error("Feedback not found");
    }

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) =>
        q
          .eq("sessionId", args.sessionId)
          .eq("itemType", "feedback")
          .eq("itemId", args.feedbackId)
      )
      .first();

    if (existingVote) {
      await ctx.db.delete(existingVote._id);

      await ctx.db.patch(args.feedbackId, {
        votes: Math.max(0, feedback.votes - 1),
      });
      return { voted: false };
    } else {
      await ctx.db.insert("votes", {
        teamId: args.teamId,
        itemId: args.feedbackId,
        itemType: "feedback",
        userId: userId || undefined,
        sessionId: args.sessionId,
      });

      await ctx.db.patch(args.feedbackId, {
        votes: feedback.votes + 1,
      });
      return { voted: true };
    }
  },
});

export const getUserVotes = query({
  args: {
    teamId: v.id("teams"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get votes for this team and session
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    return votes
      .filter((v) => v.sessionId === args.sessionId)
      .map((v) => ({ itemId: v.itemId, itemType: v.itemType }));
  },
});

export const updateFeedback = mutation({
  args: {
    teamId: v.id("teams"),
    feedbackId: v.id("feedback"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Verify team membership
    if (userId) {
      const isMember = await verifyTeamMembership(ctx, args.teamId, userId);
      if (!isMember) {
        throw new Error("Not a member of this team");
      }
    }

    const feedback = await ctx.db.get(args.feedbackId);
    if (!feedback || feedback.teamId !== args.teamId) {
      throw new Error("Feedback not found");
    }

    await ctx.db.patch(args.feedbackId, {
      title: args.title,
      description: args.description,
      category: args.category,
    });

    return args.feedbackId;
  },
});

export const deleteFeedback = mutation({
  args: {
    teamId: v.id("teams"),
    feedbackId: v.id("feedback"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Verify team membership
    if (userId) {
      const isMember = await verifyTeamMembership(ctx, args.teamId, userId);
      if (!isMember) {
        throw new Error("Not a member of this team");
      }
    }

    const feedback = await ctx.db.get(args.feedbackId);
    if (!feedback || feedback.teamId !== args.teamId) {
      throw new Error("Feedback not found");
    }

    // Delete associated votes
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_item", (q) =>
        q.eq("itemType", "feedback").eq("itemId", args.feedbackId)
      )
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    // Delete associated comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_item", (q) =>
        q.eq("itemType", "feedback").eq("itemId", args.feedbackId)
      )
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete the feedback
    await ctx.db.delete(args.feedbackId);

    return { success: true };
  },
});

export const updateFeedbackStatus = mutation({
  args: {
    teamId: v.id("teams"),
    feedbackId: v.id("feedback"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Verify team membership with admin/owner role
    if (userId) {
      const membership = await ctx.db
        .query("teamMembers")
        .withIndex("by_team_and_user", (q: any) =>
          q.eq("teamId", args.teamId).eq("userId", userId)
        )
        .first();
      if (!membership || !["owner", "admin"].includes(membership.role)) {
        throw new Error("Not authorized to update status");
      }
    }

    const feedback = await ctx.db.get(args.feedbackId);
    if (!feedback || feedback.teamId !== args.teamId) {
      throw new Error("Feedback not found");
    }

    await ctx.db.patch(args.feedbackId, {
      status: args.status,
    });

    return args.feedbackId;
  },
});
