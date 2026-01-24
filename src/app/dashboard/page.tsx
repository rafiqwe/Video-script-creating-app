"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [idea, setIdea] = useState("");
  const [amount, setAmount] = useState(40);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setScript(null);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, amount }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.message || "Generation failed. Please try again.");
      } else {
        setScript(data.script || "");
      }
    } catch (err) {
      setError("Something went wrong while talking to Gemini.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 md:px-10">
        <a href="/" className="text-sm font-semibold tracking-tight">
          Gemini Script Studio
        </a>
        <nav className="flex items-center gap-4 text-xs text-slate-300">
          <a href="/dashboard" className="font-medium text-emerald-300">
            Dashboard
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

      <main className="mx-auto flex max-w-6xl gap-8 px-6 py-8 md:px-10 md:py-12">
        {/* Sidebar */}
        <aside className="hidden w-60 flex-shrink-0 flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200 md:flex">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </h2>
          <nav className="flex flex-col gap-1 text-sm">
            <a href="/dashboard" className="rounded-lg bg-slate-800 px-3 py-2 text-emerald-300">
              Create script
            </a>
            <button className="rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-slate-800/80">
              My scripts (coming soon)
            </button>
            <button className="rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-slate-800/80">
              Settings (coming soon)
            </button>
          </nav>
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-300">
            Use the <span className="font-medium text-emerald-300">Create script</span> section to
            send your idea and desired sentence amount to the Gemini generator.
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1 space-y-8">
          <section>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              This is your starting point for turning tiny ideas into structured, Gemini-ready
              scripts between 1 and 200 sentences. Use the Create script panel below to send
              prompts to the Gemini API.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold">Quick start</h2>
              <p className="mt-2 text-xs text-slate-300">
                Start from a short description and choose how long your script should be. We
                will send a clear instruction to Gemini and return a ready-to-use script.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold">My scripts (planned)</h2>
              <p className="mt-2 text-xs text-slate-300">
                Later you&apos;ll be able to browse and re-run scripts you&apos;ve generated before.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-sm font-semibold">Export & download</h2>
              <p className="mt-2 text-xs text-slate-300">
                Download prompts as text files ready to drop into Gemini or any other AI system.
              </p>
            </div>
          </section>

          <section className="mt-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-300">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Create script (Gemini prompt builder)
            </h2>
            <p className="mt-2 text-xs">
              Type a short idea, choose how many sentences you want (1200), and send it to the
              Gemini API. This is a simple test UI.
            </p>

            <form onSubmit={handleGenerate} className="mt-4 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-200" htmlFor="idea">
                  Idea
                </label>
                <textarea
                  id="idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500"
                  placeholder="Short YouTube video about focusing while studying"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200" htmlFor="amount">
                  Number of sentences (1200)
                </label>
                <input
                  id="amount"
                  type="number"
                  min={1}
                  max={200}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 w-28 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-emerald-400 px-5 py-2 text-xs font-medium text-slate-950 shadow-md shadow-emerald-500/30 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Generating..." : "Generate script with Gemini"}
              </button>
            </form>

            {script && (
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs leading-relaxed text-slate-100">
                <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Generated script
                </div>
                <pre className="whitespace-pre-wrap text-xs text-slate-100">{script}</pre>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
