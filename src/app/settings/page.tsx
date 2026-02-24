"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

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
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Settings</h1>
          <p className="mt-1 text-sm text-slate-400">
            Preferences are stored in your browser and apply to the dashboard.
          </p>
        </div>

        {/* Script defaults */}
        <div className="rounded-xl border border-slate-800/70 bg-slate-900/40">
          <div className="border-b border-slate-800/50 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-200">Script defaults</h2>
          </div>
          <div className="px-6 py-5">
            <label className="flex items-center gap-4 text-sm" htmlFor="default-amount">
              <div className="flex-1">
                <div className="font-medium text-slate-200">Default number of scenes</div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Pre-filled on the dashboard (1–200).
                </p>
              </div>
              <input
                id="default-amount"
                type="number"
                min={1}
                max={200}
                value={defaultAmount}
                onChange={(e) => setDefaultAmount(Number(e.target.value) || 1)}
                className="w-20 rounded-lg border border-slate-700/60 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </label>
          </div>
        </div>

        {/* Display */}
        <div className="rounded-xl border border-slate-800/70 bg-slate-900/40">
          <div className="border-b border-slate-800/50 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-200">Display</h2>
          </div>
          <div className="divide-y divide-slate-800/40">
            <label className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm transition hover:bg-slate-800/20">
              <div>
                <div className="font-medium text-slate-200">Show scene numbers</div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Display scene numbers next to each generated line.
                </p>
              </div>
              <input
                type="checkbox"
                checked={showSentenceNumbers}
                onChange={(e) => setShowSentenceNumbers(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-400 accent-emerald-500"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm transition hover:bg-slate-800/20">
              <div>
                <div className="font-medium text-slate-200">Compact layout</div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Use a tighter layout on the dashboard.
                </p>
              </div>
              <input
                type="checkbox"
                checked={compactLayout}
                onChange={(e) => setCompactLayout(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-400 accent-emerald-500"
              />
            </label>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
