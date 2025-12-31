import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate a random token for invite links
function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Create an invite link for a team
export const createInviteLink = mutation({
  args: {
    teamId: v.id("teams"),
    role: v.string(), // "admin" | "member"
    expiresInDays: v.optional(v.number()),
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
      throw new Error("Not authorized to invite members");
    }

    // Can't invite someone as owner
    if (args.role === "owner") {
      throw new Error("Cannot invite someone as owner");
    }

    const token = generateToken();
    const expiresInDays = args.expiresInDays || 7;
    const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;

    const invitationId = await ctx.db.insert("teamInvitations", {
      teamId: args.teamId,
      role: args.role,
      invitedBy: userId,
      token,
      expiresAt,
      status: "pending",
    });

    return { invitationId, token };
  },
});

// Get invitation details by token (public - for invite page)
export const getInvitationByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("teamInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      return null;
    }

    // Check if expired
    if (invitation.expiresAt < Date.now()) {
      return { ...invitation, status: "expired" };
    }

    // Get team details
    const team = await ctx.db.get(invitation.teamId);
    if (!team) {
      return null;
    }

    return {
      ...invitation,
      teamName: team.name,
      teamIconName: team.iconName,
    };
  },
});

// Accept an invitation by token
export const acceptInvitation = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Find the invitation
    const invitation = await ctx.db
      .query("teamInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      throw new Error("Invalid invitation");
    }

    if (invitation.status !== "pending") {
      throw new Error("Invitation is no longer valid");
    }

    if (invitation.expiresAt < Date.now()) {
      await ctx.db.patch(invitation._id, { status: "expired" });
      throw new Error("Invitation has expired");
    }

    // Check if user is already a member
    const existingMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) =>
        q.eq("teamId", invitation.teamId).eq("userId", userId)
      )
      .first();

    if (existingMembership) {
      throw new Error("You are already a member of this team");
    }

    // Add user as team member
    await ctx.db.insert("teamMembers", {
      teamId: invitation.teamId,
      userId,
      role: invitation.role,
      joinedAt: Date.now(),
    });

    // Mark invitation as accepted
    await ctx.db.patch(invitation._id, { status: "accepted" });

    return invitation.teamId;
  },
});

// List all members of a team
export const listTeamMembers = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verify the caller is a member of this team
    const callerMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) =>
        q.eq("teamId", args.teamId).eq("userId", userId)
      )
      .first();

    if (!callerMembership) {
      return [];
    }

    // Get all members
    const memberships = await ctx.db
      .query("teamMembers")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    // Fetch user details for each member
    const members = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        return {
          _id: membership._id,
          userId: membership.userId,
          role: membership.role,
          joinedAt: membership.joinedAt,
          name: user?.name || "Unknown",
          email: user?.email || "",
        };
      })
    );

    return members;
  },
});

// Update a member's role (owner only)
export const updateMemberRole = mutation({
  args: {
    teamId: v.id("teams"),
    memberId: v.id("teamMembers"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify the caller is the owner
    const callerMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) =>
        q.eq("teamId", args.teamId).eq("userId", userId)
      )
      .first();

    if (!callerMembership || callerMembership.role !== "owner") {
      throw new Error("Only team owner can change member roles");
    }

    // Get the target member
    const targetMember = await ctx.db.get(args.memberId);
    if (!targetMember || targetMember.teamId !== args.teamId) {
      throw new Error("Member not found in this team");
    }

    // Can't change owner's role
    if (targetMember.role === "owner") {
      throw new Error("Cannot change owner's role");
    }

    // Can't promote to owner
    if (args.role === "owner") {
      throw new Error("Cannot promote member to owner");
    }

    await ctx.db.patch(args.memberId, { role: args.role });
    return true;
  },
});

// Remove a member from a team
export const removeMember = mutation({
  args: {
    teamId: v.id("teams"),
    memberId: v.id("teamMembers"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the target member
    const targetMember = await ctx.db.get(args.memberId);
    if (!targetMember || targetMember.teamId !== args.teamId) {
      throw new Error("Member not found in this team");
    }

    // Check if user is removing themselves
    const isSelf = targetMember.userId === userId;

    if (!isSelf) {
      // Verify the caller has admin/owner role
      const callerMembership = await ctx.db
        .query("teamMembers")
        .withIndex("by_team_and_user", (q) =>
          q.eq("teamId", args.teamId).eq("userId", userId)
        )
        .first();

      if (!callerMembership || !["owner", "admin"].includes(callerMembership.role)) {
        throw new Error("Not authorized to remove members");
      }

      // Admin can't remove owner
      if (targetMember.role === "owner") {
        throw new Error("Cannot remove team owner");
      }

      // Admin can't remove other admins (only owner can)
      if (targetMember.role === "admin" && callerMembership.role !== "owner") {
        throw new Error("Only owner can remove admins");
      }
    }

    // Owner can't leave their own team (must delete or transfer ownership first)
    if (isSelf && targetMember.role === "owner") {
      throw new Error("Owner cannot leave the team. Delete the team or transfer ownership first.");
    }

    await ctx.db.delete(args.memberId);
    return true;
  },
});

// List pending invitations for a team
export const listPendingInvitations = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verify the caller is an admin/owner
    const callerMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) =>
        q.eq("teamId", args.teamId).eq("userId", userId)
      )
      .first();

    if (!callerMembership || !["owner", "admin"].includes(callerMembership.role)) {
      return [];
    }

    // Get pending invitations
    const invitations = await ctx.db
      .query("teamInvitations")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();

    // Filter for pending ones and add inviter details
    const pendingInvitations = await Promise.all(
      invitations
        .filter((inv) => inv.status === "pending" && inv.expiresAt > Date.now())
        .map(async (inv) => {
          const inviter = await ctx.db.get(inv.invitedBy);
          return {
            ...inv,
            inviterName: inviter?.name || "Unknown",
          };
        })
    );

    return pendingInvitations;
  },
});

// Revoke an invitation
export const revokeInvitation = mutation({
  args: { invitationId: v.id("teamInvitations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    // Verify the caller has admin/owner role
    const callerMembership = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) =>
        q.eq("teamId", invitation.teamId).eq("userId", userId)
      )
      .first();

    if (!callerMembership || !["owner", "admin"].includes(callerMembership.role)) {
      throw new Error("Not authorized to revoke invitations");
    }

    await ctx.db.delete(args.invitationId);
    return true;
  },
});
