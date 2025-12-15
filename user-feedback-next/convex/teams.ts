import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Reserved subdomains that cannot be used as team slugs
const RESERVED_SUBDOMAINS = new Set([
  'www', 'app', 'api', 'admin', 'help', 'support', 'docs', 'blog', 'status',
  'mail', 'staging', 'dev', 'test', 'dashboard', 'login', 'signup', 'auth',
  'cdn', 'assets', 'static', 'feedback', 'billing', 'settings', 'account',
]);

function isReservedSlug(slug: string): boolean {
  return RESERVED_SUBDOMAINS.has(slug.toLowerCase());
}

function isValidSlugFormat(slug: string): boolean {
  if (!slug || slug.length < 2 || slug.length > 63) return false;
  const slugRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;
  return slugRegex.test(slug.toLowerCase());
}

// Create a new team
export const createTeam = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    iconName: v.string(),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Validate slug format
    if (!isValidSlugFormat(args.slug)) {
      throw new Error("Invalid URL format. Use 2-63 lowercase letters, numbers, and hyphens.");
    }

    // Check if slug is reserved
    if (isReservedSlug(args.slug)) {
      throw new Error("This URL is reserved and cannot be used");
    }

    // Validate slug uniqueness
    const existing = await ctx.db
      .query("teams")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      throw new Error("This URL is already taken");
    }

    // Create the team
    const teamId = await ctx.db.insert("teams", {
      name: args.name,
      slug: args.slug,
      iconName: args.iconName,
      plan: args.plan || "Free",
      ownerId: userId,
      createdAt: Date.now(),
    });

    // Add the creator as owner member
    await ctx.db.insert("teamMembers", {
      teamId,
      userId,
      role: "owner",
      joinedAt: Date.now(),
    });

    return teamId;
  },
});

// List all teams for the current user
export const listUserTeams = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get all team memberships for the user
    const memberships = await ctx.db
      .query("teamMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Fetch team details for each membership
    const teams = await Promise.all(
      memberships.map(async (membership) => {
        const team = await ctx.db.get(membership.teamId);
        if (!team) return null;
        return {
          ...team,
          role: membership.role,
        };
      })
    );

    return teams.filter((t): t is NonNullable<typeof t> => t !== null);
  },
});

// Get a single team by ID (with membership check)
export const getTeam = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Verify the user is a member of this team
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) =>
        q.eq("teamId", args.teamId).eq("userId", userId)
      )
      .first();

    if (!membership) {
      return null;
    }

    const team = await ctx.db.get(args.teamId);
    if (!team) {
      return null;
    }

    return {
      ...team,
      role: membership.role,
    };
  },
});

// Update team details (admin/owner only)
export const updateTeam = mutation({
  args: {
    teamId: v.id("teams"),
    name: v.optional(v.string()),
    iconName: v.optional(v.string()),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the user has admin/owner role
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) =>
        q.eq("teamId", args.teamId).eq("userId", userId)
      )
      .first();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      throw new Error("Not authorized to update this team");
    }

    // Build update object
    const updates: Partial<{
      name: string;
      iconName: string;
      plan: string;
    }> = {};

    if (args.name !== undefined) updates.name = args.name;
    if (args.iconName !== undefined) updates.iconName = args.iconName;
    if (args.plan !== undefined) updates.plan = args.plan;

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.teamId, updates);
    }

    return args.teamId;
  },
});

// Delete a team (owner only)
export const deleteTeam = mutation({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the user is the owner
    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) =>
        q.eq("teamId", args.teamId).eq("userId", userId)
      )
      .first();

    if (!membership || membership.role !== "owner") {
      throw new Error("Only team owner can delete the team");
    }

    // Delete all team data
    // 1. Delete feedback
    const feedback = await ctx.db
      .query("feedback")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
    for (const item of feedback) {
      await ctx.db.delete(item._id);
    }

    // 2. Delete feature requests
    const featureRequests = await ctx.db
      .query("featureRequests")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
    for (const item of featureRequests) {
      await ctx.db.delete(item._id);
    }

    // 3. Delete roadmap items
    const roadmapItems = await ctx.db
      .query("roadmapItems")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
    for (const item of roadmapItems) {
      await ctx.db.delete(item._id);
    }

    // 4. Delete kanban tasks
    const kanbanTasks = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
    for (const item of kanbanTasks) {
      await ctx.db.delete(item._id);
    }

    // 5. Delete comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
    for (const item of comments) {
      await ctx.db.delete(item._id);
    }

    // 6. Delete votes
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
    for (const item of votes) {
      await ctx.db.delete(item._id);
    }

    // 7. Delete invitations
    const invitations = await ctx.db
      .query("teamInvitations")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
    for (const item of invitations) {
      await ctx.db.delete(item._id);
    }

    // 8. Delete team members
    const members = await ctx.db
      .query("teamMembers")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
    for (const item of members) {
      await ctx.db.delete(item._id);
    }

    // 9. Delete the team itself
    await ctx.db.delete(args.teamId);

    return true;
  },
});

// Check if a slug is available
export const checkSlugAvailable = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    // Check format validity
    if (!isValidSlugFormat(args.slug)) {
      return { available: false, reason: "invalid_format" };
    }

    // Check if reserved
    if (isReservedSlug(args.slug)) {
      return { available: false, reason: "reserved" };
    }

    // Check if already taken
    const existing = await ctx.db
      .query("teams")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      return { available: false, reason: "taken" };
    }

    return { available: true, reason: null };
  },
});
