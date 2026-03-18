"use client";

import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { SignupModal } from "./SignupModal";
import { SignupList } from "./SignupList";

type Evening = {
  _id: Id<"evenings">;
  date: string;
  topic: string;
  status: "upcoming" | "past" | "cancelled";
  isWeekend: boolean;
  targetPortions?: number;
};

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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const days = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
  const months = [
    "januari", "februari", "maart", "april", "mei", "juni",
    "juli", "augustus", "september", "oktober", "november", "december",
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function EveningCard({
  evening,
  signups,
  readonly = false,
}: {
  evening: Evening;
  signups: Signup[];
  readonly?: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const days = daysUntil(evening.date);

  return (
    <>
      <div className="rounded-xl border border-border bg-surface overflow-hidden transition-all">
        {/* Card header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-start gap-3 p-4 text-left"
        >
          {/* Date badge */}
          <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-surface">
            <span className="text-lg font-bold leading-none">
              {new Date(evening.date + "T00:00:00").getDate()}
            </span>
            <span className="text-[10px] uppercase leading-none mt-0.5">
              {["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"][
                new Date(evening.date + "T00:00:00").getMonth()
              ]}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{evening.topic}</p>
                <p className="text-xs text-muted mt-0.5">{formatDate(evening.date)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {signups.length > 0 && (
                  <span className="text-xs text-muted">{signups.length} aangemeld</span>
                )}
                {!readonly && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      days <= 3
                        ? "bg-error-bg text-error"
                        : days <= 7
                          ? "bg-warning-bg text-warning"
                          : "bg-accent-light text-muted"
                    }`}
                  >
                    {days === 0 ? "Vandaag" : days === 1 ? "Morgen" : `${days}d`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expand chevron */}
          <svg
            className={`h-4 w-4 flex-shrink-0 text-muted transition-transform mt-1 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="border-t border-border px-4 pb-4 pt-3">
            {signups.length === 0 ? (
              <p className="text-sm text-muted italic">Nog geen aanmeldingen voor deze avond.</p>
            ) : (
              <SignupList signups={signups} readonly={readonly} />
            )}

            {!readonly && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-sm transition-all hover:bg-primary-light active:scale-[0.98]"
              >
                + Aanmelden voor deze avond
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <SignupModal
          eveningId={evening._id}
          eveningDate={formatDate(evening.date)}
          eveningTopic={evening.topic}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
