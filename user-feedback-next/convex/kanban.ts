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

export const listTasks = query({
  args: {
    teamId: v.id("teams"),
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

    const tasks = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    return tasks.sort((a, b) => a.order - b.order);
  },
});

export const createTask = mutation({
  args: {
    teamId: v.id("teams"),
    title: v.string(),
    description: v.string(),
    columnId: v.string(),
    category: v.string(),
    priority: v.string(),
    sourceType: v.optional(v.string()),
    sourceId: v.optional(v.string()),
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

    // Get the highest order in the target column for this team
    const tasksInColumn = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    const columnTasks = tasksInColumn.filter((t) => t.columnId === args.columnId);
    const maxOrder =
      columnTasks.length > 0
        ? Math.max(...columnTasks.map((t) => t.order))
        : -1;

    const taskId = await ctx.db.insert("kanbanTasks", {
      teamId: args.teamId,
      title: args.title,
      description: args.description,
      columnId: args.columnId,
      category: args.category,
      priority: args.priority,
      order: maxOrder + 1,
      sourceType: args.sourceType,
      sourceId: args.sourceId,
    });

    return taskId;
  },
});

export const updateTask = mutation({
  args: {
    teamId: v.id("teams"),
    taskId: v.id("kanbanTasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    priority: v.optional(v.string()),
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

    const task = await ctx.db.get(args.taskId);
    if (!task || task.teamId !== args.teamId) {
      throw new Error("Task not found");
    }

    const cleanUpdates: Record<string, string> = {};
    if (args.title !== undefined) cleanUpdates.title = args.title;
    if (args.description !== undefined)
      cleanUpdates.description = args.description;
    if (args.category !== undefined) cleanUpdates.category = args.category;
    if (args.priority !== undefined) cleanUpdates.priority = args.priority;

    await ctx.db.patch(args.taskId, cleanUpdates);
    return args.taskId;
  },
});

export const deleteTask = mutation({
  args: {
    teamId: v.id("teams"),
    taskId: v.id("kanbanTasks"),
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

    const task = await ctx.db.get(args.taskId);
    if (!task || task.teamId !== args.teamId) {
      throw new Error("Task not found");
    }

    await ctx.db.delete(args.taskId);
    return { success: true };
  },
});

export const moveTask = mutation({
  args: {
    teamId: v.id("teams"),
    taskId: v.id("kanbanTasks"),
    targetColumnId: v.string(),
    newOrder: v.number(),
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

    const task = await ctx.db.get(args.taskId);
    if (!task || task.teamId !== args.teamId) {
      throw new Error("Task not found");
    }

    const oldColumnId = task.columnId;
    const oldOrder = task.order;

    // Get all tasks for this team
    const allTasks = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    // If moving within the same column
    if (oldColumnId === args.targetColumnId) {
      const tasksInColumn = allTasks.filter((t) => t.columnId === oldColumnId);

      // Reorder tasks
      for (const t of tasksInColumn) {
        if (t._id === args.taskId) continue;

        if (oldOrder < args.newOrder) {
          // Moving down
          if (t.order > oldOrder && t.order <= args.newOrder) {
            await ctx.db.patch(t._id, { order: t.order - 1 });
          }
        } else {
          // Moving up
          if (t.order >= args.newOrder && t.order < oldOrder) {
            await ctx.db.patch(t._id, { order: t.order + 1 });
          }
        }
      }
    } else {
      // Moving to a different column
      const oldColumnTasks = allTasks.filter((t) => t.columnId === oldColumnId);
      const newColumnTasks = allTasks.filter(
        (t) => t.columnId === args.targetColumnId
      );

      // Decrease order of tasks after this one in old column
      for (const t of oldColumnTasks) {
        if (t.order > oldOrder) {
          await ctx.db.patch(t._id, { order: t.order - 1 });
        }
      }

      // Increase order of tasks at/after the insertion point in new column
      for (const t of newColumnTasks) {
        if (t.order >= args.newOrder) {
          await ctx.db.patch(t._id, { order: t.order + 1 });
        }
      }
    }

    // Update the task itself
    await ctx.db.patch(args.taskId, {
      columnId: args.targetColumnId,
      order: args.newOrder,
    });

    return { success: true };
  },
});

export const addFeatureToKanban = mutation({
  args: {
    teamId: v.id("teams"),
    featureId: v.string(),
    featureTitle: v.string(),
    featureDescription: v.string(),
    featureCategory: v.string(),
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

    // Check if already added for this team
    const allTasks = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    const existing = allTasks.find(
      (t) => t.sourceType === "feature" && t.sourceId === args.featureId
    );

    if (existing) {
      throw new Error("This feature is already on the Kanban board");
    }

    // Get the highest order in the "no-status" column for this team
    const tasksInColumn = allTasks.filter((t) => t.columnId === "no-status");
    const maxOrder =
      tasksInColumn.length > 0
        ? Math.max(...tasksInColumn.map((t) => t.order))
        : -1;

    const taskId = await ctx.db.insert("kanbanTasks", {
      teamId: args.teamId,
      title: args.featureTitle,
      description: args.featureDescription,
      columnId: "no-status",
      category: args.featureCategory,
      priority: "Medium",
      order: maxOrder + 1,
      sourceType: "feature",
      sourceId: args.featureId,
    });

    return taskId;
  },
});
