import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const evenings = await ctx.db.query("evenings").collect();
    // Sort by date
    return evenings.sort((a, b) => a.date.localeCompare(b.date));
  },
});
