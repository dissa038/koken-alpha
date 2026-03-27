"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

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
  const [newName, setNewName] = useState("");

  const addName = () => {
    const name = newName.trim();
    if (!name) return;
    updateCorvee({ eveningId, corveeNames: [...corveeNames, name] });
    setNewName("");
  };

  const removeName = (index: number) => {
    updateCorvee({
      eveningId,
      corveeNames: corveeNames.filter((_, i) => i !== index),
    });
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
        <div>
          <p className="text-sm font-semibold text-foreground">{topic}</p>
          <p className="text-xs text-muted">{formatDate(date)}</p>
        </div>
      </div>

      {/* Current corvee names */}
      {corveeNames.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {corveeNames.map((name, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-accent-light/50 px-3 py-2"
            >
              <span className="text-sm text-foreground">{name}</span>
              <button
                onClick={() => removeName(i)}
                className="ml-2 rounded-md p-1 text-muted hover:bg-error-bg hover:text-error transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add name */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addName()}
          placeholder="Naam toevoegen..."
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={addName}
          disabled={!newName.trim()}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-surface transition-all hover:bg-primary-light active:scale-[0.98] disabled:opacity-40"
        >
          +
        </button>
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
            Wijs per avond de mensen aan die <strong>corvee</strong> hebben (opruimen/afwassen).
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
