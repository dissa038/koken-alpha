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

  return (
    <div className="space-y-1.5">
      {signups.map((signup) => (
        <div
          key={signup._id}
          className="flex items-center justify-between rounded-lg bg-accent-light/50 px-3 py-2"
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
  );
}
