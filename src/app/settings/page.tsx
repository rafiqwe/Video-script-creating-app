"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [defaultAmount, setDefaultAmount] = useState(40);
  const [showSentenceNumbers, setShowSentenceNumbers] = useState(true);
  const [compactLayout, setCompactLayout] = useState(false);

  useEffect(() => {
    const storedAmount = window.localStorage.getItem("defaultSentenceAmount");
    const storedShowNumbers = window.localStorage.getItem("showSentenceNumbers");
    const storedCompact = window.localStorage.getItem("compactDashboardLayout");

    if (storedAmount) {
      const n = Number(storedAmount);
      if (!Number.isNaN(n) && n >= 1 && n <= 200) {
        setDefaultAmount(n);
      }
    }

    if (storedShowNumbers) {
      setShowSentenceNumbers(storedShowNumbers === "true");
    }

    if (storedCompact) {
      setCompactLayout(storedCompact === "true");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("defaultSentenceAmount", String(defaultAmount));
  }, [defaultAmount]);

  useEffect(() => {
    window.localStorage.setItem("showSentenceNumbers", String(showSentenceNumbers));
  }, [showSentenceNumbers]);

  useEffect(() => {
    window.localStorage.setItem("compactDashboardLayout", String(compactLayout));
  }, [compactLayout]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 md:px-10">
        <a href="/" className="text-sm font-semibold tracking-tight">
          Gemini Script Studio
        </a>
        <nav className="flex items-center gap-4 text-xs text-slate-300">
          <a href="/dashboard" className="hover:text-white">
            Dashboard
          </a>
          <a href="/my-scripts" className="hover:text-white">
            My scripts
          </a>
          <a href="/settings" className="font-medium text-emerald-300">
            Settings
          </a>
          <a href="/login" className="hover:text-white">
            Log in
          </a>
          <a
            href="/signup"
            className="rounded-full bg-slate-50 px-4 py-2 text-[0.7rem] font-medium text-slate-900 shadow-sm hover:bg-white"
          >
            Sign up
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8 md:px-10 md:py-12">
        <section className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Settings</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Configure how Gemini Script Studio behaves for you. These settings are stored in your
            browser and affect the dashboard experience.
          </p>
        </section>

        <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-200">
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Script defaults
            </h2>
            <label className="flex items-center gap-3 text-sm" htmlFor="default-amount">
              <div className="flex-1">
                <div className="font-medium text-slate-100">Default number of sentences</div>
                <p className="text-xs text-slate-400">
                  This value will be used as the default on the dashboard (1200).
                </p>
              </div>
              <input
                id="default-amount"
                type="number"
                min={1}
                max={200}
                value={defaultAmount}
                onChange={(e) => setDefaultAmount(Number(e.target.value) || 1)}
                className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500"
              />
            </label>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Display
            </h2>
            <label className="flex items-center justify-between gap-4 text-sm">
              <div>
                <div className="font-medium text-slate-100">Show sentence numbers</div>
                <p className="text-xs text-slate-400">
                  When enabled, the dashboard will show sentence numbers next to each generated line.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showSentenceNumbers}
                onChange={(e) => setShowSentenceNumbers(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-400"
              />
            </label>

            <label className="mt-3 flex items-center justify-between gap-4 text-sm">
              <div>
                <div className="font-medium text-slate-100">Compact dashboard layout</div>
                <p className="text-xs text-slate-400">
                  Use a tighter layout on the dashboard (useful on smaller screens).
                </p>
              </div>
              <input
                type="checkbox"
                checked={compactLayout}
                onChange={(e) => setCompactLayout(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-400"
              />
            </label>
          </div>
        </section>
      </main>
    </div>
  );
}
