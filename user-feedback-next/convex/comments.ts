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

export const addComment = mutation({
  args: {
    teamId: v.id("teams"),
    itemId: v.string(),
    itemType: v.string(),
    content: v.string(),
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

    const commentId = await ctx.db.insert("comments", {
      teamId: args.teamId,
      itemId: args.itemId,
      itemType: args.itemType,
      content: args.content,
      createdBy: args.isAnonymous || !userId ? undefined : userId,
      isAnonymous: args.isAnonymous,
    });

    return commentId;
  },
});

export const listComments = query({
  args: {
    teamId: v.id("teams"),
    itemId: v.string(),
    itemType: v.string(),
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

export const getCommentCount = query({
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

export const deleteComment = mutation({
  args: {
    teamId: v.id("teams"),
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.teamId !== args.teamId) {
      throw new Error("Comment not found");
    }

    // Check if user is the author or has admin/owner role
    const isAuthor = comment.createdBy === userId;

    if (!isAuthor) {
      const membership = await ctx.db
        .query("teamMembers")
        .withIndex("by_team_and_user", (q: any) =>
          q.eq("teamId", args.teamId).eq("userId", userId)
        )
        .first();
      if (!membership || !["owner", "admin"].includes(membership.role)) {
        throw new Error("Not authorized to delete this comment");
      }
    }

    await ctx.db.delete(args.commentId);
    return { success: true };
  },
});
