import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByEvening = query({
  args: { eveningId: v.id("evenings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("signups")
      .withIndex("by_evening", (q) => q.eq("eveningId", args.eveningId))
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("signups").collect();
  },
});

export const create = mutation({
  args: {
    eveningId: v.id("evenings"),
    name: v.string(),
    role: v.union(v.literal("koken"), v.literal("boodschappen")),
    dish: v.optional(v.string()),
    portions: v.optional(v.number()),
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("signups", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("signups") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
