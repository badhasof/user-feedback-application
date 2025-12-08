import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  feedback: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    status: v.string(),
    votes: v.number(),
    createdBy: v.optional(v.id("users")),
    isAnonymous: v.boolean(),
  }).index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_votes", ["votes"]),
  
  featureRequests: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    status: v.string(),
    votes: v.number(),
    createdBy: v.optional(v.id("users")),
    isAnonymous: v.boolean(),
  }).index("by_status", ["status"])
    .index("by_votes", ["votes"]),
  
  roadmapItems: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.string(),
    quarter: v.string(),
    category: v.string(),
    votes: v.number(),
  }).index("by_status", ["status"])
    .index("by_quarter", ["quarter"]),
  
  comments: defineTable({
    itemId: v.string(),
    itemType: v.string(),
    content: v.string(),
    createdBy: v.optional(v.id("users")),
    isAnonymous: v.boolean(),
  }).index("by_item", ["itemType", "itemId"]),
  
  votes: defineTable({
    itemId: v.string(),
    itemType: v.string(),
    userId: v.optional(v.id("users")),
    sessionId: v.string(),
  }).index("by_item", ["itemType", "itemId"])
    .index("by_user", ["userId", "itemType", "itemId"])
    .index("by_session", ["sessionId", "itemType", "itemId"]),

  kanbanTasks: defineTable({
    title: v.string(),
    description: v.string(),
    columnId: v.string(),
    category: v.string(),
    priority: v.string(),
    order: v.number(),
    sourceType: v.optional(v.string()),
    sourceId: v.optional(v.string()),
  }).index("by_column", ["columnId"])
    .index("by_order", ["columnId", "order"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
