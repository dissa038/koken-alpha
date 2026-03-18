"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { EveningCard } from "./EveningCard";
import { Id } from "../../convex/_generated/dataModel";

type Evening = {
  _id: Id<"evenings">;
  _creationTime: number;
  date: string;
  topic: string;
  status: "upcoming" | "past" | "cancelled";
  isWeekend: boolean;
  targetPortions?: number;
};

type Signup = {
  _id: Id<"signups">;
  _creationTime: number;
  eveningId: Id<"evenings">;
  name: string;
  role?: "koken" | "boodschappen";
  dish?: string;
  portions?: number;
  phone?: string;
  notes?: string;
  createdAt: number;
};

export function Dashboard() {
  const evenings = useQuery(api.evenings.list);
  const allSignups = useQuery(api.signups.listAll);

  if (!evenings || !allSignups) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Only show upcoming evenings (not past, not cancelled)
  const upcomingEvenings = evenings.filter((e) => e.status === "upcoming");
  const pastEvenings = evenings.filter((e) => e.status === "past");

  // Group signups by evening
  const signupsByEvening = allSignups.reduce(
    (acc, signup) => {
      if (!acc[signup.eveningId]) acc[signup.eveningId] = [];
      acc[signup.eveningId].push(signup);
      return acc;
    },
    {} as Record<string, Signup[]>
  );

  return (
    <div className="min-h-dvh pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg text-surface">
              🍳
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary leading-tight">Koken voor Alpha</h1>
              <p className="text-xs text-muted">Youth United — Zwolle</p>
            </div>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("koken-auth");
              window.location.reload();
            }}
            className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-accent-light hover:text-foreground"
          >
            Uitloggen
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-6">
        {/* Info banner */}
        <div className="mb-6 rounded-xl bg-surface border border-border p-4">
          <p className="text-sm text-foreground">
            <strong>Hoe werkt het?</strong> Kies een avond, meld je aan als{" "}
            <span className="inline-flex items-center gap-1 rounded-md bg-warning-bg px-1.5 py-0.5 text-xs font-medium text-warning">🧑‍🍳 Koker</span>{" "}
            of{" "}
            <span className="inline-flex items-center gap-1 rounded-md bg-success-bg px-1.5 py-0.5 text-xs font-medium text-success">🛒 Boodschapper</span>.{" "}
            Als koker geef je aan wat je maakt en voor hoeveel personen. We koken voor ongeveer <strong>60 personen</strong> per avond.
          </p>
        </div>

        {/* Upcoming evenings */}
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          Aankomende avonden
        </h2>
        <div className="space-y-3">
          {upcomingEvenings.map((evening) => (
            <EveningCard
              key={evening._id}
              evening={evening}
              signups={signupsByEvening[evening._id] || []}
            />
          ))}
        </div>

        {/* Past evenings */}
        {pastEvenings.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-muted">
              Afgelopen avonden
            </h2>
            <div className="space-y-3 opacity-60">
              {pastEvenings.map((evening) => (
                <EveningCard
                  key={evening._id}
                  evening={evening}
                  signups={signupsByEvening[evening._id] || []}
                  readonly
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
