import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Team management tables
  teams: defineTable({
    name: v.string(),
    slug: v.string(),
    plan: v.string(),
    iconName: v.string(),
    ownerId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"]),

  teamMembers: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
    role: v.string(), // "owner" | "admin" | "member"
    joinedAt: v.number(),
  })
    .index("by_team", ["teamId"])
    .index("by_user", ["userId"])
    .index("by_team_and_user", ["teamId", "userId"]),

  teamInvitations: defineTable({
    teamId: v.id("teams"),
    email: v.optional(v.string()),
    role: v.string(),
    invitedBy: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    status: v.string(), // "pending" | "accepted" | "expired"
  })
    .index("by_team", ["teamId"])
    .index("by_email", ["email"])
    .index("by_token", ["token"]),

  // Feedback and feature tracking tables (now team-scoped)
  // Note: teamId is temporarily optional for migration. Run clearLegacyData mutation,
  // then change back to v.id("teams") once old data is cleared.
  feedback: defineTable({
    teamId: v.optional(v.id("teams")),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    status: v.string(),
    votes: v.number(),
    createdBy: v.optional(v.id("users")),
    isAnonymous: v.boolean(),
  })
    .index("by_team", ["teamId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_votes", ["votes"]),

  featureRequests: defineTable({
    teamId: v.optional(v.id("teams")),
    title: v.string(),
    description: v.string(),
    category: v.string(),
    status: v.string(),
    votes: v.number(),
    createdBy: v.optional(v.id("users")),
    isAnonymous: v.boolean(),
  })
    .index("by_team", ["teamId"])
    .index("by_status", ["status"])
    .index("by_votes", ["votes"]),

  roadmapItems: defineTable({
    teamId: v.optional(v.id("teams")),
    title: v.string(),
    description: v.string(),
    status: v.string(),
    quarter: v.string(),
    category: v.string(),
    votes: v.number(),
  })
    .index("by_team", ["teamId"])
    .index("by_status", ["status"])
    .index("by_quarter", ["quarter"]),

  comments: defineTable({
    teamId: v.optional(v.id("teams")),
    itemId: v.string(),
    itemType: v.string(),
    content: v.string(),
    createdBy: v.optional(v.id("users")),
    isAnonymous: v.boolean(),
  })
    .index("by_team", ["teamId"])
    .index("by_item", ["itemType", "itemId"]),

  votes: defineTable({
    teamId: v.optional(v.id("teams")),
    itemId: v.string(),
    itemType: v.string(),
    userId: v.optional(v.id("users")),
    sessionId: v.string(),
  })
    .index("by_team", ["teamId"])
    .index("by_item", ["itemType", "itemId"])
    .index("by_user", ["userId", "itemType", "itemId"])
    .index("by_session", ["sessionId", "itemType", "itemId"]),

  kanbanTasks: defineTable({
    teamId: v.optional(v.id("teams")),
    title: v.string(),
    description: v.string(),
    columnId: v.string(),
    category: v.string(),
    priority: v.string(),
    order: v.number(),
    sourceType: v.optional(v.string()),
    sourceId: v.optional(v.string()),
  })
    .index("by_team", ["teamId"])
    .index("by_column", ["columnId"])
    .index("by_order", ["columnId", "order"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
