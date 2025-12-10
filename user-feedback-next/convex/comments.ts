import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addComment = mutation({
  args: {
    itemId: v.string(),
    itemType: v.string(),
    content: v.string(),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    const commentId = await ctx.db.insert("comments", {
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

    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
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

    return comments.length;
  },
});
