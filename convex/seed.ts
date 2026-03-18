import { mutation } from "./_generated/server";

const ALPHA_EVENINGS = [
  { date: "2026-03-10", topic: "Intro: Is er meer?", status: "past" as const, isWeekend: false },
  { date: "2026-03-17", topic: "Wie is Jezus?", status: "past" as const, isWeekend: false },
  { date: "2026-03-24", topic: "Waarom stierf Jezus aan het kruis?", status: "upcoming" as const, isWeekend: false },
  { date: "2026-03-31", topic: "Genade, wat kostte het?", status: "upcoming" as const, isWeekend: false },
  { date: "2026-04-07", topic: "Hoe kan ik dit ooit geloven?", status: "upcoming" as const, isWeekend: false },
  { date: "2026-04-14", topic: "Hoe kan ik God leren kennen?", status: "upcoming" as const, isWeekend: false },
  // Weekend — eten apart geregeld
  { date: "2026-04-17", topic: "Weekend: Aanbidding", status: "cancelled" as const, isWeekend: true },
  { date: "2026-04-18", topic: "Weekend: Wie is de Heilige Geest? / Hoe wordt je vervuld?", status: "cancelled" as const, isWeekend: true },
  { date: "2026-04-19", topic: "Weekend: Wat doet de Heilige Geest?", status: "cancelled" as const, isWeekend: true },
  { date: "2026-04-21", topic: "Hoe kan ik een relatie met God hebben?", status: "upcoming" as const, isWeekend: false },
  // Meivakantie — geen sessie
  { date: "2026-04-23", topic: "Meivakantie — geen sessie", status: "cancelled" as const, isWeekend: false },
  { date: "2026-04-28", topic: "Is het leven van een Christen makkelijk?", status: "upcoming" as const, isWeekend: false },
  // Bevrijdingsdag — geen sessie
  { date: "2026-05-05", topic: "Bevrijdingsdag — geen sessie", status: "cancelled" as const, isWeekend: false },
  { date: "2026-05-14", topic: "Geneest God vandaag nog?", status: "upcoming" as const, isWeekend: false },
  { date: "2026-05-21", topic: "Hoe heeft God liefde bedoeld?", status: "upcoming" as const, isWeekend: false },
  { date: "2026-05-28", topic: "Q&A / Workshops", status: "upcoming" as const, isWeekend: false },
  { date: "2026-06-04", topic: "Is dit alleen voor mij?", status: "upcoming" as const, isWeekend: false },
  { date: "2026-06-11", topic: "Hoe nu verder?", status: "upcoming" as const, isWeekend: false },
  { date: "2026-06-18", topic: "Afsluitingsavond", status: "upcoming" as const, isWeekend: false },
];

export const seedEvenings = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("evenings").first();
    if (existing) {
      return "Already seeded";
    }

    for (const evening of ALPHA_EVENINGS) {
      await ctx.db.insert("evenings", {
        ...evening,
        targetPortions: 60, // Default target: 60 porties
      });
    }

    return `Seeded ${ALPHA_EVENINGS.length} evenings`;
  },
});
