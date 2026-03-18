"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function SignupModal({
  eveningId,
  eveningDate,
  eveningTopic,
  onClose,
}: {
  eveningId: Id<"evenings">;
  eveningDate: string;
  eveningTopic: string;
  onClose: () => void;
}) {
  const createSignup = useMutation(api.signups.create);

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Vul je naam in.");
      return;
    }

    setSubmitting(true);
    try {
      await createSignup({
        eveningId,
        name: name.trim(),
        role: "koken",
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-surface p-5 shadow-xl animate-in sm:mx-4">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-accent sm:hidden" />

        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground">Aanmelden</h2>
          <p className="text-sm text-muted">
            {eveningDate} — {eveningTopic}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Je naam *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bijv. Johanne"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Opmerking <span className="text-muted font-normal">(optioneel)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bijv. Ik heb een grote pan, kan ook rijst doen"
              rows={2}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-error">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent-light"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-sm transition-all hover:bg-primary-light active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? "Bezig..." : "Aanmelden"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
