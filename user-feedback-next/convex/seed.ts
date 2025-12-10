import { internalMutation } from "./_generated/server";

export const seedRoadmap = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingItems = await ctx.db.query("roadmapItems").collect();
    
    if (existingItems.length > 0) {
      return { message: "Roadmap already seeded" };
    }

    const roadmapData = [
      {
        title: "Dark Mode Support",
        description: "Add a beautiful dark theme option for better viewing in low-light environments",
        status: "in-progress",
        quarter: "Q1 2024",
        category: "UI/UX",
        votes: 42,
      },
      {
        title: "Mobile App Launch",
        description: "Native iOS and Android apps for on-the-go feedback management",
        status: "planned",
        quarter: "Q2 2024",
        category: "Mobile",
        votes: 38,
      },
      {
        title: "Advanced Analytics Dashboard",
        description: "Comprehensive insights into feedback trends and user sentiment",
        status: "in-progress",
        quarter: "Q1 2024",
        category: "Feature",
        votes: 35,
      },
      {
        title: "Slack Integration",
        description: "Get real-time notifications in Slack when new feedback is submitted",
        status: "planned",
        quarter: "Q2 2024",
        category: "Integration",
        votes: 29,
      },
      {
        title: "API Rate Limiting Improvements",
        description: "Enhanced performance and reliability for high-traffic applications",
        status: "live",
        quarter: "Q1 2024",
        category: "Performance",
        votes: 24,
      },
      {
        title: "Custom Branding Options",
        description: "Customize colors, logos, and styling to match your brand",
        status: "planned",
        quarter: "Q3 2024",
        category: "UI/UX",
        votes: 31,
      },
      {
        title: "Email Notifications",
        description: "Automated email updates for feedback status changes",
        status: "planned",
        quarter: "Q2 2024",
        category: "Feature",
        votes: 27,
      },
      {
        title: "Advanced Search & Filters",
        description: "Powerful search capabilities to find feedback quickly",
        status: "planned",
        quarter: "Q3 2024",
        category: "Feature",
        votes: 22,
      },
      {
        title: "Webhook Support",
        description: "Integrate with your existing tools via webhooks",
        status: "planned",
        quarter: "Q3 2024",
        category: "Integration",
        votes: 19,
      },
      {
        title: "Multi-language Support",
        description: "Support for 20+ languages to reach a global audience",
        status: "planned",
        quarter: "Q4 2024",
        category: "Feature",
        votes: 26,
      },
      {
        title: "Team Collaboration Tools",
        description: "Assign feedback to team members and track progress",
        status: "planned",
        quarter: "Q4 2024",
        category: "Feature",
        votes: 33,
      },
      {
        title: "Export & Reporting",
        description: "Export feedback data to CSV, PDF, and other formats",
        status: "planned",
        quarter: "Q4 2024",
        category: "Feature",
        votes: 18,
      },
    ];

    for (const item of roadmapData) {
      await ctx.db.insert("roadmapItems", item);
    }

    return { message: "Roadmap seeded successfully", count: roadmapData.length };
  },
});
