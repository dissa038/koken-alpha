import { query } from "./_generated/server";

export const getAllergies = query({
  args: {},
  handler: async (ctx) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "allergies"))
      .first();
    return setting?.allergies ?? [];
  },
});
