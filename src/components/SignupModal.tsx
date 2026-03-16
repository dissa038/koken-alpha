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

  const [role, setRole] = useState<"koken" | "boodschappen">("koken");
  const [name, setName] = useState("");
  const [dish, setDish] = useState("");
  const [portions, setPortions] = useState("");
  const [phone, setPhone] = useState("");
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

    if (role === "koken" && !dish.trim()) {
      setError("Vul in wat je gaat maken.");
      return;
    }

    if (role === "koken" && (!portions || parseInt(portions) <= 0)) {
      setError("Vul in voor hoeveel personen je kookt.");
      return;
    }

    setSubmitting(true);
    try {
      await createSignup({
        eveningId,
        name: name.trim(),
        role,
        dish: role === "koken" ? dish.trim() : undefined,
        portions: role === "koken" ? parseInt(portions) : undefined,
        phone: phone.trim() || undefined,
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-surface p-5 shadow-xl animate-in sm:mx-4">
        {/* Handle bar (mobile) */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-accent sm:hidden" />

        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground">Aanmelden</h2>
          <p className="text-sm text-muted">
            {eveningDate} — {eveningTopic}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-background p-1">
            <button
              type="button"
              onClick={() => setRole("koken")}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                role === "koken"
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              🧑‍🍳 Koken
            </button>
            <button
              type="button"
              onClick={() => setRole("boodschappen")}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                role === "boodschappen"
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              🛒 Boodschappen
            </button>
          </div>

          {/* Name */}
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

          {/* Dish (only for koken) */}
          {role === "koken" && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Wat maak je? *
                </label>
                <input
                  type="text"
                  value={dish}
                  onChange={(e) => setDish(e.target.value)}
                  placeholder="Bijv. Pasta bolognese"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  Voor hoeveel personen? *
                </label>
                <input
                  type="number"
                  value={portions}
                  onChange={(e) => setPortions(e.target.value)}
                  placeholder="Bijv. 15"
                  min="1"
                  max="100"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </>
          )}

          {/* Phone (optional) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Telefoonnummer <span className="text-muted font-normal">(optioneel)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06-12345678"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Notes (optional) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Opmerking <span className="text-muted font-normal">(optioneel)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                role === "koken"
                  ? "Bijv. Ik heb een grote pan, kan ook rijst doen"
                  : "Bijv. Ik kan om 16:00 de boodschappen doen"
              }
              rows={2}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-error">{error}</p>
          )}

          {/* Actions */}
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
