import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listRoadmapItems = query({
  args: {
    quarter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items;
    
    if (args.quarter && args.quarter !== "all") {
      items = await ctx.db
        .query("roadmapItems")
        .withIndex("by_quarter", (q) => q.eq("quarter", args.quarter!))
        .collect();
    } else {
      items = await ctx.db.query("roadmapItems").collect();
    }
    
    return items.sort((a, b) => b.votes - a.votes);
  },
});

export const voteRoadmapItem = mutation({
  args: {
    itemId: v.id("roadmapItems"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) =>
        q.eq("sessionId", args.sessionId)
          .eq("itemType", "roadmap")
          .eq("itemId", args.itemId)
      )
      .first();
    
    if (existingVote) {
      await ctx.db.delete(existingVote._id);
      
      const item = await ctx.db.get(args.itemId);
      if (item) {
        await ctx.db.patch(args.itemId, {
          votes: Math.max(0, item.votes - 1),
        });
      }
      return { voted: false };
    } else {
      await ctx.db.insert("votes", {
        itemId: args.itemId,
        itemType: "roadmap",
        userId: undefined,
        sessionId: args.sessionId,
      });
      
      const item = await ctx.db.get(args.itemId);
      if (item) {
        await ctx.db.patch(args.itemId, {
          votes: item.votes + 1,
        });
      }
      return { voted: true };
    }
  },
});
