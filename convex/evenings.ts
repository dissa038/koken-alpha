import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const MAX_CORVEE_PER_EVENING = 10;
const MAX_NAME_LENGTH = 50;

export const updateCorvee = mutation({
  args: {
    eveningId: v.id("evenings"),
    corveeNames: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Cap array size and sanitize names
    const names = args.corveeNames
      .slice(0, MAX_CORVEE_PER_EVENING)
      .map((n) => n.trim().slice(0, MAX_NAME_LENGTH))
      .filter(Boolean);

    await ctx.db.patch(args.eveningId, { corveeNames: names });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const evenings = await ctx.db.query("evenings").collect();
    return evenings.sort((a, b) => a.date.localeCompare(b.date));
  },
});
