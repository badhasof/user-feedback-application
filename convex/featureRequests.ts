import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submitFeatureRequest = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    isAnonymous: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    const requestId = await ctx.db.insert("featureRequests", {
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
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let requestsQuery = ctx.db.query("featureRequests");
    
    const requests = await requestsQuery.order("desc").collect();
    
    const filteredRequests = args.status && args.status !== "all"
      ? requests.filter((r) => r.status === args.status)
      : requests;
    
    return filteredRequests.sort((a, b) => b.votes - a.votes);
  },
});

export const voteFeatureRequest = mutation({
  args: {
    requestId: v.id("featureRequests"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) =>
        q.eq("sessionId", args.sessionId)
          .eq("itemType", "feature")
          .eq("itemId", args.requestId)
      )
      .first();
    
    if (existingVote) {
      await ctx.db.delete(existingVote._id);
      
      const request = await ctx.db.get(args.requestId);
      if (request) {
        await ctx.db.patch(args.requestId, {
          votes: Math.max(0, request.votes - 1),
        });
      }
      return { voted: false };
    } else {
      await ctx.db.insert("votes", {
        itemId: args.requestId,
        itemType: "feature",
        userId: userId || undefined,
        sessionId: args.sessionId,
      });
      
      const request = await ctx.db.get(args.requestId);
      if (request) {
        await ctx.db.patch(args.requestId, {
          votes: request.votes + 1,
        });
      }
      return { voted: true };
    }
  },
});
