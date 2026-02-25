"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

interface ScriptItem {
  id: string;
  idea: string;
  amount: number;
  content: string;
  createdAt: string;
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MyScriptsPage() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/myscripts");
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setError(data.message || "Failed to load scripts.");
        } else {
          setScripts(data.scripts || []);
        }
      } catch (err) {
        setError("Failed to load scripts.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">My scripts</h1>
          <p className="mt-1 text-sm text-slate-400">
            Browse scripts you&apos;ve generated before and download them as text files.
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-600 border-t-slate-300" />
            Loading scripts…
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs text-red-300" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && scripts.length === 0 && (
          <div className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-6 py-10 text-center">
            <p className="text-sm text-slate-500">
              No scripts saved yet. Generate one from the
              <a href="/dashboard" className="ml-1 font-medium text-emerald-400 hover:text-emerald-300">
                dashboard
              </a>
              .
            </p>
          </div>
        )}

        {!loading && scripts.length > 0 && (
          <div className="rounded-xl border border-slate-800/70 bg-slate-900/40">
            <div className="border-b border-slate-800/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-200">
                {scripts.length} script{scripts.length !== 1 && "s"}
              </h2>
            </div>
            <div className="divide-y divide-slate-800/40">
              {scripts.map((script) => (
                <div
                  key={script.id}
                  className="group px-6 py-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-slate-100">
                        {script.idea}
                      </p>
                      <div className="flex items-center gap-2 text-[0.7rem] text-slate-500">
                        <span>{script.amount} scenes</span>
                        <span className="text-slate-700">·</span>
                        <span>{new Date(script.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        downloadTextFile(
                          `script-${script.id}.txt`,
                          script.content
                        )
                      }
                      className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-[0.7rem] font-medium text-slate-200 transition hover:bg-slate-700"
                    >
                      Download .txt
                    </button>
                  </div>
                  <details className="mt-3 text-[0.7rem] text-slate-400">
                    <summary className="cursor-pointer select-none hover:text-slate-200">
                      Preview
                    </summary>
                    <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-800/50 bg-slate-950/50 p-3 text-[0.7rem] leading-relaxed text-slate-300">
                      {script.content}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
