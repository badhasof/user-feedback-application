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

export const submitFeatureRequest = mutation({
  args: {
    teamId: v.id("teams"),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Verify team membership for authenticated users
    if (userId) {
      const isMember = await verifyTeamMembership(ctx, args.teamId, userId);
      if (!isMember) {
        throw new Error("Not a member of this team");
      }
    }

    const requestId = await ctx.db.insert("featureRequests", {
      teamId: args.teamId,
      title: args.title,
      description: args.description,
      category: args.category,
      status: "under-review",
      votes: 0,
      createdBy: args.isAnonymous || !userId ? undefined : userId,
      isAnonymous: args.isAnonymous,
    });

    return requestId;
  },
});

export const listFeatureRequests = query({
  args: {
    teamId: v.id("teams"),
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

    // Query feature requests for this team
    let requests = await ctx.db
      .query("featureRequests")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .order("desc")
      .collect();

    // Filter by status if specified
    if (args.status && args.status !== "all") {
      requests = requests.filter((r) => r.status === args.status);
    }

    return requests.sort((a, b) => b.votes - a.votes);
  },
});

export const voteFeatureRequest = mutation({
  args: {
    teamId: v.id("teams"),
    requestId: v.id("featureRequests"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Verify the feature request belongs to this team
    const request = await ctx.db.get(args.requestId);
    if (!request || request.teamId !== args.teamId) {
      throw new Error("Feature request not found");
    }

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) =>
        q
          .eq("sessionId", args.sessionId)
          .eq("itemType", "feature")
          .eq("itemId", args.requestId)
      )
      .first();

    if (existingVote) {
      await ctx.db.delete(existingVote._id);

      await ctx.db.patch(args.requestId, {
        votes: Math.max(0, request.votes - 1),
      });
      return { voted: false };
    } else {
      await ctx.db.insert("votes", {
        teamId: args.teamId,
        itemId: args.requestId,
        itemType: "feature",
        userId: userId || undefined,
        sessionId: args.sessionId,
      });

      await ctx.db.patch(args.requestId, {
        votes: request.votes + 1,
      });
      return { voted: true };
    }
  },
});

export const updateFeatureRequestStatus = mutation({
  args: {
    teamId: v.id("teams"),
    requestId: v.id("featureRequests"),
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

    const request = await ctx.db.get(args.requestId);
    if (!request || request.teamId !== args.teamId) {
      throw new Error("Feature request not found");
    }

    await ctx.db.patch(args.requestId, {
      status: args.status,
    });

    return args.requestId;
  },
});

export const deleteFeatureRequest = mutation({
  args: {
    teamId: v.id("teams"),
    requestId: v.id("featureRequests"),
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

    const request = await ctx.db.get(args.requestId);
    if (!request || request.teamId !== args.teamId) {
      throw new Error("Feature request not found");
    }

    // Delete associated votes
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_item", (q) =>
        q.eq("itemType", "feature").eq("itemId", args.requestId)
      )
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    // Delete associated comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_item", (q) =>
        q.eq("itemType", "feature").eq("itemId", args.requestId)
      )
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete the feature request
    await ctx.db.delete(args.requestId);

    return { success: true };
  },
});
