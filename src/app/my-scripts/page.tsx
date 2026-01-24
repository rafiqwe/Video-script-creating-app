"use client";

import { useEffect, useState } from "react";

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
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 md:px-10">
        <a href="/" className="text-sm font-semibold tracking-tight">
          Gemini Script Studio
        </a>
        <nav className="flex items-center gap-4 text-xs text-slate-300">
          <a href="/dashboard" className="hover:text-white">
            Dashboard
          </a>
          <a href="/my-scripts" className="font-medium text-emerald-300">
            My scripts
          </a>
          <a href="/settings" className="hover:text-white">
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

      <main className="mx-auto max-w-5xl px-6 py-8 md:px-10 md:py-12">
        <section className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">My scripts</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Browse scripts you&apos;ve generated before and download them as text files.
          </p>
        </section>

        {loading && <p className="text-sm text-slate-300">Loading scripts...</p>}
        {error && !loading && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && scripts.length === 0 && (
          <p className="text-sm text-slate-400">
            No scripts saved yet. Generate one from the dashboard and it will appear here.
          </p>
        )}

        {!loading && scripts.length > 0 && (
          <div className="mt-4 space-y-3">
            {scripts.map((script) => (
              <div
                key={script.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-100 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {new Date(script.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-slate-50">
                    {script.idea}
                  </div>
                  <div className="text-[0.7rem] text-slate-400">
                    {script.amount} sentences
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        `script-${script.id}.txt`,
                        script.content
                      )
                    }
                    className="rounded-full bg-emerald-400 px-3 py-1 text-[0.7rem] font-medium text-slate-950 shadow-sm hover:bg-emerald-300"
                  >
                    Download script (.txt)
                  </button>
                  <details className="w-full text-[0.7rem] text-slate-300">
                    <summary className="cursor-pointer select-none text-slate-400 hover:text-slate-200">
                      Preview
                    </summary>
                    <pre className="mt-1 whitespace-pre-wrap text-[0.7rem] text-slate-100">
                      {script.content}
                    </pre>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
