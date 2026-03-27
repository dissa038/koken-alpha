"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const TEAM_MEMBERS = [
  "Noah",
  "Hanna",
  "Joëlle",
  "Luuk",
  "Xanne",
  "Esmée",
  "Esther",
  "Jelcher",
  "Mattias",
  "Melissa",
  "Petrick",
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const days = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const months = [
    "jan", "feb", "mrt", "apr", "mei", "jun",
    "jul", "aug", "sep", "okt", "nov", "dec",
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function CorveeEvening({
  eveningId,
  date,
  topic,
  corveeNames,
}: {
  eveningId: Id<"evenings">;
  date: string;
  topic: string;
  corveeNames: string[];
}) {
  const updateCorvee = useMutation(api.evenings.updateCorvee);

  const toggleName = (name: string) => {
    const isAssigned = corveeNames.includes(name);
    const updated = isAssigned
      ? corveeNames.filter((n) => n !== name)
      : [...corveeNames, name];
    updateCorvee({ eveningId, corveeNames: updated });
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-surface">
          <span className="text-sm font-bold leading-none">
            {new Date(date + "T00:00:00").getDate()}
          </span>
          <span className="text-[9px] uppercase leading-none mt-0.5">
            {["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"][
              new Date(date + "T00:00:00").getMonth()
            ]}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{topic}</p>
          <p className="text-xs text-muted">{formatDate(date)}</p>
        </div>
        {corveeNames.length > 0 && (
          <span className="ml-auto text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
            {corveeNames.length}
          </span>
        )}
      </div>

      {/* Toggle chips */}
      <div className="flex flex-wrap gap-2">
        {TEAM_MEMBERS.map((name) => {
          const isOn = corveeNames.includes(name);
          return (
            <button
              key={name}
              onClick={() => toggleName(name)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                isOn
                  ? "bg-primary text-surface shadow-sm"
                  : "bg-accent-light text-muted hover:text-foreground"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CorveePage({ onLogout }: { onLogout: () => void }) {
  const evenings = useQuery(api.evenings.list);

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingEvenings = evenings?.filter(
    (e) => new Date(e.date + "T00:00:00") >= now && e.status === "upcoming"
  );

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-primary">Corvee Rooster</h1>
            <p className="text-xs text-muted">Koken voor Alpha — Zwolle</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-accent-light"
          >
            Uitloggen
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-6 pb-8">
        <div className="mb-6 rounded-xl bg-surface border border-border p-4">
          <p className="text-sm text-foreground">
            Tap op een naam om corvee aan/uit te zetten voor die avond.
          </p>
        </div>

        {!upcomingEvenings ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-surface border border-border" />
            ))}
          </div>
        ) : upcomingEvenings.length === 0 ? (
          <p className="text-center text-sm text-muted py-12">Geen aankomende avonden.</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvenings.map((evening) => (
              <CorveeEvening
                key={evening._id}
                eveningId={evening._id}
                date={evening.date}
                topic={evening.topic}
                corveeNames={evening.corveeNames ?? []}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
