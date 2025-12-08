import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listTasks = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db
      .query("kanbanTasks")
      .collect();

    return tasks.sort((a, b) => a.order - b.order);
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    columnId: v.string(),
    category: v.string(),
    priority: v.string(),
    sourceType: v.optional(v.string()),
    sourceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the highest order in the target column
    const tasksInColumn = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();

    const maxOrder = tasksInColumn.length > 0
      ? Math.max(...tasksInColumn.map(t => t.order))
      : -1;

    const taskId = await ctx.db.insert("kanbanTasks", {
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
    taskId: v.id("kanbanTasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { taskId, ...updates } = args;

    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");

    const cleanUpdates: Record<string, string> = {};
    if (updates.title !== undefined) cleanUpdates.title = updates.title;
    if (updates.description !== undefined) cleanUpdates.description = updates.description;
    if (updates.category !== undefined) cleanUpdates.category = updates.category;
    if (updates.priority !== undefined) cleanUpdates.priority = updates.priority;

    await ctx.db.patch(taskId, cleanUpdates);
    return taskId;
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("kanbanTasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
    return { success: true };
  },
});

export const moveTask = mutation({
  args: {
    taskId: v.id("kanbanTasks"),
    targetColumnId: v.string(),
    newOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const oldColumnId = task.columnId;
    const oldOrder = task.order;

    // If moving within the same column
    if (oldColumnId === args.targetColumnId) {
      const tasksInColumn = await ctx.db
        .query("kanbanTasks")
        .withIndex("by_column", (q) => q.eq("columnId", oldColumnId))
        .collect();

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

      // Decrease order of tasks after this one in old column
      const oldColumnTasks = await ctx.db
        .query("kanbanTasks")
        .withIndex("by_column", (q) => q.eq("columnId", oldColumnId))
        .collect();

      for (const t of oldColumnTasks) {
        if (t.order > oldOrder) {
          await ctx.db.patch(t._id, { order: t.order - 1 });
        }
      }

      // Increase order of tasks at/after the insertion point in new column
      const newColumnTasks = await ctx.db
        .query("kanbanTasks")
        .withIndex("by_column", (q) => q.eq("columnId", args.targetColumnId))
        .collect();

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
    featureId: v.string(),
    featureTitle: v.string(),
    featureDescription: v.string(),
    featureCategory: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already added
    const existing = await ctx.db
      .query("kanbanTasks")
      .filter((q) =>
        q.and(
          q.eq(q.field("sourceType"), "feature"),
          q.eq(q.field("sourceId"), args.featureId)
        )
      )
      .first();

    if (existing) {
      throw new Error("This feature is already on the Kanban board");
    }

    // Get the highest order in the "no-status" column
    const tasksInColumn = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_column", (q) => q.eq("columnId", "no-status"))
      .collect();

    const maxOrder = tasksInColumn.length > 0
      ? Math.max(...tasksInColumn.map(t => t.order))
      : -1;

    const taskId = await ctx.db.insert("kanbanTasks", {
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

// Seed initial data
export const seedKanbanTasks = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if there's already data
    const existing = await ctx.db.query("kanbanTasks").first();
    if (existing) {
      return { message: "Kanban already has data" };
    }

    const seedTasks = [
      {
        title: "User Authentication Flow",
        description: "Implement OAuth2 authentication with social providers",
        columnId: "completed",
        category: "Feature",
        priority: "High",
        order: 0,
      },
      {
        title: "Dashboard Analytics",
        description: "Create comprehensive analytics dashboard with charts",
        columnId: "in-progress",
        category: "Feature",
        priority: "High",
        order: 0,
      },
      {
        title: "API Rate Limiting",
        description: "Implement rate limiting for API endpoints",
        columnId: "in-progress",
        category: "Improvement",
        priority: "Medium",
        order: 1,
      },
      {
        title: "Mobile Responsive Design",
        description: "Optimize all pages for mobile devices",
        columnId: "not-started",
        category: "Improvement",
        priority: "High",
        order: 0,
      },
      {
        title: "Email Notifications",
        description: "Set up email notification system for user events",
        columnId: "not-started",
        category: "Feature",
        priority: "Medium",
        order: 1,
      },
      {
        title: "Dark Mode Support",
        description: "Add dark mode theme toggle for the application",
        columnId: "no-status",
        category: "Feature",
        priority: "Low",
        order: 0,
      },
    ];

    for (const task of seedTasks) {
      await ctx.db.insert("kanbanTasks", task);
    }

    return { message: "Seeded 6 kanban tasks" };
  },
});
