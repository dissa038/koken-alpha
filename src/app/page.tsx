"use client";

import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";

const PASSWORDS = {
  admin: "admin123",
  user: "alphazwolle",
};

export default function Home() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("koken-auth");
    if (saved === "true") {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = password.toLowerCase().trim();
    if (input === PASSWORDS.admin || input === PASSWORDS.user) {
      setAuthenticated(true);
      sessionStorage.setItem("koken-auth", "true");
      setError(false);
    } else {
      setError(true);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (authenticated) {
    return <Dashboard />;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl text-surface">
            🍳
          </div>
          <h1 className="text-2xl font-bold text-primary">Koken voor Alpha</h1>
          <p className="mt-1 text-sm text-muted">Youth United — Zwolle</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Voer het wachtwoord in..."
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-error">
                Onjuist wachtwoord. Probeer het opnieuw.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-surface shadow-md transition-all hover:bg-primary-light active:scale-[0.98]"
          >
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
}
