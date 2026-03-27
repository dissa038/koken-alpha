import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const MAX_SIGNUPS_TOTAL = 500;
const MAX_SIGNUPS_PER_EVENING = 30;
const MAX_NAME_LENGTH = 50;
const MAX_NOTES_LENGTH = 200;

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
    // Validate input lengths
    const name = args.name.trim().slice(0, MAX_NAME_LENGTH);
    if (!name) throw new Error("Naam is verplicht");

    const notes = args.notes?.trim().slice(0, MAX_NOTES_LENGTH) || undefined;

    // Check per-evening limit
    const eveningSignups = await ctx.db
      .query("signups")
      .withIndex("by_evening", (q) => q.eq("eveningId", args.eveningId))
      .collect();
    if (eveningSignups.length >= MAX_SIGNUPS_PER_EVENING) {
      throw new Error("Maximum aantal aanmeldingen voor deze avond bereikt");
    }

    // Check duplicate name on same evening
    if (eveningSignups.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      throw new Error("Je bent al aangemeld voor deze avond");
    }

    // Check total limit
    const total = await ctx.db.query("signups").take(MAX_SIGNUPS_TOTAL + 1);
    if (total.length > MAX_SIGNUPS_TOTAL) {
      throw new Error("Maximum aantal aanmeldingen bereikt");
    }

    return await ctx.db.insert("signups", {
      eveningId: args.eveningId,
      name,
      role: args.role,
      dish: args.dish?.trim().slice(0, 100) || undefined,
      portions: args.portions ? Math.min(Math.max(1, args.portions), 100) : undefined,
      phone: args.phone?.trim().slice(0, 20) || undefined,
      notes,
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
