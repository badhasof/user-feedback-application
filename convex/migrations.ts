import { mutation } from "./_generated/server";

// Delete anonymous users (no email)
export const deleteAnonymousUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    let deleted = 0;
    for (const user of users) {
      if (!user.email) {
        await ctx.db.delete(user._id);
        deleted++;
      }
    }
    return { deleted };
  },
});

// One-time migration to clear old data without teamId
export const clearLegacyData = mutation({
  args: {},
  handler: async (ctx) => {
    let deleted = {
      feedback: 0,
      featureRequests: 0,
      roadmapItems: 0,
      comments: 0,
      votes: 0,
      kanbanTasks: 0,
    };

    // Clear feedback without teamId
    const feedback = await ctx.db.query("feedback").collect();
    for (const item of feedback) {
      if (!item.teamId) {
        await ctx.db.delete(item._id);
        deleted.feedback++;
      }
    }

    // Clear feature requests without teamId
    const featureRequests = await ctx.db.query("featureRequests").collect();
    for (const item of featureRequests) {
      if (!item.teamId) {
        await ctx.db.delete(item._id);
        deleted.featureRequests++;
      }
    }

    // Clear roadmap items without teamId
    const roadmapItems = await ctx.db.query("roadmapItems").collect();
    for (const item of roadmapItems) {
      if (!item.teamId) {
        await ctx.db.delete(item._id);
        deleted.roadmapItems++;
      }
    }

    // Clear comments without teamId
    const comments = await ctx.db.query("comments").collect();
    for (const item of comments) {
      if (!item.teamId) {
        await ctx.db.delete(item._id);
        deleted.comments++;
      }
    }

    // Clear votes without teamId
    const votes = await ctx.db.query("votes").collect();
    for (const item of votes) {
      if (!item.teamId) {
        await ctx.db.delete(item._id);
        deleted.votes++;
      }
    }

    // Clear kanban tasks without teamId
    const kanbanTasks = await ctx.db.query("kanbanTasks").collect();
    for (const item of kanbanTasks) {
      if (!item.teamId) {
        await ctx.db.delete(item._id);
        deleted.kanbanTasks++;
      }
    }

    return {
      message: "Legacy data cleared successfully",
      deleted,
    };
  },
});
