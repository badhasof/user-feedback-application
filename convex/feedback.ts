import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submitFeedback = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    const feedbackId = await ctx.db.insert("feedback", {
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
    category: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let feedback;
    
    if (args.category && args.category !== "all") {
      feedback = await ctx.db
        .query("feedback")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .collect();
    } else {
      feedback = await ctx.db.query("feedback").order("desc").collect();
    }
    
    const filteredFeedback = args.status && args.status !== "all"
      ? feedback.filter((f) => f.status === args.status)
      : feedback;
    
    return filteredFeedback.sort((a, b) => b.votes - a.votes);
  },
});

export const voteFeedback = mutation({
  args: {
    feedbackId: v.id("feedback"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) =>
        q.eq("sessionId", args.sessionId)
          .eq("itemType", "feedback")
          .eq("itemId", args.feedbackId)
      )
      .first();
    
    if (existingVote) {
      await ctx.db.delete(existingVote._id);
      
      const feedback = await ctx.db.get(args.feedbackId);
      if (feedback) {
        await ctx.db.patch(args.feedbackId, {
          votes: Math.max(0, feedback.votes - 1),
        });
      }
      return { voted: false };
    } else {
      await ctx.db.insert("votes", {
        itemId: args.feedbackId,
        itemType: "feedback",
        userId: userId || undefined,
        sessionId: args.sessionId,
      });
      
      const feedback = await ctx.db.get(args.feedbackId);
      if (feedback) {
        await ctx.db.patch(args.feedbackId, {
          votes: feedback.votes + 1,
        });
      }
      return { voted: true };
    }
  },
});

export const getUserVotes = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    return votes.map((v) => ({ itemId: v.itemId, itemType: v.itemType }));
  },
});
