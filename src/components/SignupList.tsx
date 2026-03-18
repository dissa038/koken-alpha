"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type Signup = {
  _id: Id<"signups">;
  eveningId: Id<"evenings">;
  name: string;
  role?: "koken" | "boodschappen";
  dish?: string;
  portions?: number;
  phone?: string;
  notes?: string;
  createdAt: number;
};

export function SignupList({
  signups,
  readonly = false,
}: {
  signups: Signup[];
  readonly?: boolean;
}) {
  const removeSignup = useMutation(api.signups.remove);

  const cookers = signups.filter((s) => s.role === "koken");
  const shoppers = signups.filter((s) => s.role === "boodschappen");

  return (
    <div className="space-y-2">
      {cookers.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            🧑‍🍳 Kokers
          </p>
          <div className="space-y-1.5">
            {cookers.map((signup) => (
              <div
                key={signup._id}
                className="flex items-center justify-between rounded-lg bg-warning-bg/50 px-3 py-2"
              >
                <div className="min-w-0">
                  <span className="text-sm font-medium text-foreground">{signup.name}</span>
                  {signup.dish && (
                    <span className="text-sm text-muted"> — {signup.dish}</span>
                  )}
                  {signup.portions && (
                    <span className="ml-1.5 inline-flex items-center rounded-md bg-surface px-1.5 py-0.5 text-xs text-muted">
                      {signup.portions}p
                    </span>
                  )}
                  {signup.notes && (
                    <p className="text-xs text-muted mt-0.5">{signup.notes}</p>
                  )}
                </div>
                {!readonly && (
                  <button
                    onClick={() => {
                      if (confirm(`${signup.name} verwijderen?`)) {
                        removeSignup({ id: signup._id });
                      }
                    }}
                    className="ml-2 flex-shrink-0 rounded-md p-1 text-muted hover:bg-error-bg hover:text-error transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {shoppers.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            🛒 Boodschappers
          </p>
          <div className="space-y-1.5">
            {shoppers.map((signup) => (
              <div
                key={signup._id}
                className="flex items-center justify-between rounded-lg bg-success-bg/50 px-3 py-2"
              >
                <div className="min-w-0">
                  <span className="text-sm font-medium text-foreground">{signup.name}</span>
                  {signup.notes && (
                    <p className="text-xs text-muted mt-0.5">{signup.notes}</p>
                  )}
                </div>
                {!readonly && (
                  <button
                    onClick={() => {
                      if (confirm(`${signup.name} verwijderen?`)) {
                        removeSignup({ id: signup._id });
                      }
                    }}
                    className="ml-2 flex-shrink-0 rounded-md p-1 text-muted hover:bg-error-bg hover:text-error transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
