import { v } from "convex/values";
import { query } from "./_generated/server";

// Get team by slug (public - no auth required)
export const getTeamBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const team = await ctx.db
      .query("teams")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!team) return null;

    // Get image URLs from storage
    const logoUrl = team.logoStorageId
      ? await ctx.storage.getUrl(team.logoStorageId)
      : null;
    const bannerUrl = team.bannerStorageId
      ? await ctx.storage.getUrl(team.bannerStorageId)
      : null;

    // Return public-safe fields including portal customization
    return {
      _id: team._id,
      name: team.name,
      slug: team.slug,
      iconName: team.iconName,
      brandColor: team.brandColor || null,
      logoUrl,
      bannerUrl,
      tagline: team.tagline || null,
      description: team.description || null,
    };
  },
});

// List feedback for public view (no auth required)
export const listPublicFeedback = query({
  args: {
    teamId: v.id("teams"),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let feedback = await ctx.db
      .query("feedback")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .order("desc")
      .collect();

    // Filter by category if specified
    if (args.category && args.category !== "all") {
      feedback = feedback.filter((f) => f.category === args.category);
    }

    return feedback.sort((a, b) => b.votes - a.votes);
  },
});

// List roadmap items for public view (no auth required)
export const listPublicRoadmapItems = query({
  args: {
    teamId: v.id("teams"),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("roadmapItems")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .order("desc")
      .collect();

    return items.sort((a, b) => b.votes - a.votes);
  },
});

// List comments for public view (no auth required)
export const listPublicComments = query({
  args: {
    teamId: v.id("teams"),
    itemId: v.string(),
    itemType: v.string(),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_item", (q) =>
        q.eq("itemType", args.itemType).eq("itemId", args.itemId)
      )
      .order("desc")
      .collect();

    // Filter to only comments for this team
    const teamComments = comments.filter((c) => c.teamId === args.teamId);

    const commentsWithUsers = await Promise.all(
      teamComments.map(async (comment) => {
        if (comment.createdBy && !comment.isAnonymous) {
          const user = await ctx.db.get(comment.createdBy);
          return {
            ...comment,
            userName: user?.name || user?.email || "User",
          };
        }
        return {
          ...comment,
          userName: "Anonymous",
        };
      })
    );

    return commentsWithUsers;
  },
});

// Get comment count for public view (no auth required)
export const getPublicCommentCount = query({
  args: {
    teamId: v.id("teams"),
    itemId: v.string(),
    itemType: v.string(),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_item", (q) =>
        q.eq("itemType", args.itemType).eq("itemId", args.itemId)
      )
      .collect();

    // Count only comments for this team
    return comments.filter((c) => c.teamId === args.teamId).length;
  },
});

// Get user votes for public view (by sessionId, no auth required)
export const getPublicUserVotes = query({
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
