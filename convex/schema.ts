import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  evenings: defineTable({
    date: v.string(), // ISO date string "2026-03-24"
    topic: v.string(),
    status: v.union(
      v.literal("upcoming"),
      v.literal("past"),
      v.literal("cancelled")
    ),
    isWeekend: v.boolean(),
    targetPortions: v.optional(v.number()), // How many people need to be fed (~60)
    corveeNames: v.optional(v.array(v.string())), // Corvee duty names
  }),
  signups: defineTable({
    eveningId: v.id("evenings"),
    name: v.string(),
    role: v.optional(v.union(v.literal("koken"), v.literal("boodschappen"))),
    dish: v.optional(v.string()), // What dish (only for koken)
    portions: v.optional(v.number()), // How many portions (only for koken)
    phone: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_evening", ["eveningId"]),
  settings: defineTable({
    key: v.string(),
    allergies: v.array(v.string()),
  }).index("by_key", ["key"]),
  dishSuggestions: defineTable({
    eveningId: v.id("evenings"),
    dish: v.string(),
    suggestedBy: v.optional(v.string()),
  }).index("by_evening", ["eveningId"]),
});
