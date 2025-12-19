import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generic delete any document by ID
export const deleteDoc = mutation({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id as any);
    return { deleted: id };
  },
});

// Generic get any document by ID
export const getDoc = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id as any);
  },
});

// Bulk delete by table where field matches value
export const bulkDelete = mutation({
  args: {
    table: v.string(),
    field: v.string(),
    value: v.any()
  },
  handler: async (ctx, { table, field, value }) => {
    const docs = await ctx.db.query(table as any).collect();
    let deleted = 0;
    for (const doc of docs) {
      if ((doc as any)[field] === value) {
        await ctx.db.delete(doc._id);
        deleted++;
      }
    }
    return { deleted };
  },
});

// Count documents in a table
export const countTable = query({
  args: { table: v.string() },
  handler: async (ctx, { table }) => {
    const docs = await ctx.db.query(table as any).collect();
    return { count: docs.length };
  },
});
