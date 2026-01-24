"use client";

import { useEffect, useState } from "react";

function splitIntoSentences(text: string, expectedCount: number): string[] {
  const raw = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (expectedCount && raw.length > expectedCount) {
    return raw.slice(0, expectedCount);
  }

  return raw;
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

export default function DashboardPage() {
  const [idea, setIdea] = useState("");
  const [amount, setAmount] = useState(40);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [scriptParts, setScriptParts] = useState<string[]>([]);

  useEffect(() => {
    const savedDefaultAmount = window.localStorage.getItem("defaultSentenceAmount");
    if (savedDefaultAmount) {
      const parsed = Number(savedDefaultAmount);
      if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 200) {
        setAmount(parsed);
      }
    }
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setScript(null);
    setScriptParts([]);
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
        const scriptText: string = data.script || "";
        setScript(scriptText);
        setScriptParts(splitIntoSentences(scriptText, amount));

        // Best-effort save to "my scripts" history (ignores errors)
        try {
          await fetch("/api/myscripts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea, amount, content: scriptText }),
          });
        } catch {
          // ignore save errors for now
        }
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
          <a href="/my-scripts" className="hover:text-white">
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
            <a
              href="/my-scripts"
              className="rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-slate-800/80"
            >
              My scripts
            </a>
            <a
              href="/settings"
              className="rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-slate-800/80"
            >
              Settings
            </a>
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
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs leading-relaxed text-slate-100">
                  <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Generated script
                  </div>
                  <pre className="whitespace-pre-wrap text-xs text-slate-100">{script}</pre>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-100">
                  <div className="mb-2 flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <span>Download script files</span>
                    <span className="text-slate-500">{scriptParts.length} files</span>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2 text-[0.7rem]">
                    <button
                      type="button"
                      onClick={() => downloadTextFile("full-script.txt", script)}
                      className="rounded-full bg-emerald-400 px-3 py-1 font-medium text-slate-950 shadow-sm hover:bg-emerald-300"
                    >
                      Download full script (.txt)
                    </button>
                  </div>

                  {scriptParts.length > 0 && (
                    <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/70 p-2">
                      {scriptParts.map((part, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 rounded-md px-2 py-1 text-[0.7rem] hover:bg-slate-900"
                        >
                          <span className="line-clamp-1 text-slate-200">
                            {index + 1}. {part}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              downloadTextFile(`script-part-${index + 1}.txt`, part)
                            }
                            className="whitespace-nowrap rounded-full border border-slate-700 px-2 py-0.5 text-[0.65rem] text-slate-200 hover:border-slate-500 hover:bg-slate-900"
                          >
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
