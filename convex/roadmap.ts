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

export const listRoadmapItems = query({
  args: {
    teamId: v.id("teams"),
    quarter: v.optional(v.string()),
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

    // Query roadmap items for this team
    let items = await ctx.db
      .query("roadmapItems")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    // Filter by quarter if specified
    if (args.quarter && args.quarter !== "all") {
      items = items.filter((item) => item.quarter === args.quarter);
    }

    return items.sort((a, b) => b.votes - a.votes);
  },
});

export const createRoadmapItem = mutation({
  args: {
    teamId: v.id("teams"),
    title: v.string(),
    description: v.string(),
    status: v.string(),
    quarter: v.string(),
    category: v.string(),
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
        throw new Error("Not authorized to create roadmap items");
      }
    }

    const itemId = await ctx.db.insert("roadmapItems", {
      teamId: args.teamId,
      title: args.title,
      description: args.description,
      status: args.status,
      quarter: args.quarter,
      category: args.category,
      votes: 0,
    });

    return itemId;
  },
});

export const voteRoadmapItem = mutation({
  args: {
    teamId: v.id("teams"),
    itemId: v.id("roadmapItems"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Verify the roadmap item belongs to this team
    const item = await ctx.db.get(args.itemId);
    if (!item || item.teamId !== args.teamId) {
      throw new Error("Roadmap item not found");
    }

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) =>
        q
          .eq("sessionId", args.sessionId)
          .eq("itemType", "roadmap")
          .eq("itemId", args.itemId)
      )
      .first();

    if (existingVote) {
      await ctx.db.delete(existingVote._id);

      await ctx.db.patch(args.itemId, {
        votes: Math.max(0, item.votes - 1),
      });
      return { voted: false };
    } else {
      await ctx.db.insert("votes", {
        teamId: args.teamId,
        itemId: args.itemId,
        itemType: "roadmap",
        userId: userId || undefined,
        sessionId: args.sessionId,
      });

      await ctx.db.patch(args.itemId, {
        votes: item.votes + 1,
      });
      return { voted: true };
    }
  },
});

export const updateRoadmapItem = mutation({
  args: {
    teamId: v.id("teams"),
    itemId: v.id("roadmapItems"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    quarter: v.optional(v.string()),
    category: v.optional(v.string()),
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
        throw new Error("Not authorized to update roadmap items");
      }
    }

    const item = await ctx.db.get(args.itemId);
    if (!item || item.teamId !== args.teamId) {
      throw new Error("Roadmap item not found");
    }

    const updates: Partial<{
      title: string;
      description: string;
      status: string;
      quarter: string;
      category: string;
    }> = {};

    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.status !== undefined) updates.status = args.status;
    if (args.quarter !== undefined) updates.quarter = args.quarter;
    if (args.category !== undefined) updates.category = args.category;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.itemId, updates);
    }

    return args.itemId;
  },
});

export const deleteRoadmapItem = mutation({
  args: {
    teamId: v.id("teams"),
    itemId: v.id("roadmapItems"),
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
        throw new Error("Not authorized to delete roadmap items");
      }
    }

    const item = await ctx.db.get(args.itemId);
    if (!item || item.teamId !== args.teamId) {
      throw new Error("Roadmap item not found");
    }

    // Delete associated votes
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_item", (q) =>
        q.eq("itemType", "roadmap").eq("itemId", args.itemId)
      )
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    // Delete the roadmap item
    await ctx.db.delete(args.itemId);

    return { success: true };
  },
});
