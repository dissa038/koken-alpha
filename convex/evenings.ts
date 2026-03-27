import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateCorvee = mutation({
  args: {
    eveningId: v.id("evenings"),
    corveeNames: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.eveningId, { corveeNames: args.corveeNames });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const evenings = await ctx.db.query("evenings").collect();
    // Sort by date
    return evenings.sort((a, b) => a.date.localeCompare(b.date));
  },
});
