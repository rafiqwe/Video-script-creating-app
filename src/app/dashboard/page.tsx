"use client";

import { useEffect, useState } from "react";
import JSZip from "jszip";
import AppShell from "@/components/AppShell";

function splitIntoScenes(text: string, expectedCount: number): string[] {
  // Try to split on "Scene N:" markers first (matches the prompt format)
  const scenePattern = /Scene\s+\d+\s*:/gi;
  const markers = [...text.matchAll(scenePattern)];

  if (markers.length >= 2) {
    const parts: string[] = [];
    for (let i = 0; i < markers.length; i++) {
      const start = markers[i].index! + markers[i][0].length;
      const end = i + 1 < markers.length ? markers[i + 1].index! : text.length;
      const scene = text.slice(start, end).trim();
      if (scene) parts.push(scene);
    }
    if (expectedCount && parts.length > expectedCount) {
      return parts.slice(0, expectedCount);
    }
    return parts;
  }

  // Fallback: split on double-newlines (paragraphs)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (paragraphs.length >= 2) {
    if (expectedCount && paragraphs.length > expectedCount) {
      return paragraphs.slice(0, expectedCount);
    }
    return paragraphs;
  }

  // Last resort: split on sentence boundaries
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

async function downloadAllPartsAsZip(parts: string[]) {
  if (!parts.length) return;
  const zip = new JSZip();
  const folder = zip.folder("script");
  parts.forEach((part, index) => {
    folder?.file(`script-part-${index + 1}.txt`, part);
  });
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "script-parts.zip";
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
    const savedDefaultAmount = localStorage.getItem("defaultSentenceAmount");
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
        setScriptParts(splitIntoScenes(scriptText, amount));

        try {
          await fetch("/api/myscripts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea, amount, content: scriptText }),
          });
        } catch {
          // ignore save errors
        }
      }
    } catch (err) {
      setError("Something went wrong while talking to Gemini.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-8 font-sans">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Create script
          </h1>
          <p className="mt-1 text-base text-slate-400 ">
            Describe your idea, pick a scene count, and generate a
            production-ready video script.
          </p>
        </div>

        {/* ── Script builder card ── */}
        <div className="rounded-xl border border-slate-800/70 bg-slate-900/40">
          <div className="border-b border-slate-800/50 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-200">
              Script builder
            </h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5 px-6 py-5">
            {/* Idea */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-slate-300"
                htmlFor="idea"
              >
                Your idea
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-700/60 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                placeholder="e.g. Short YouTube video about 5 tips to stay focused while studying"
                required
              />
            </div>

            {/* Scene count row */}
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1.5">
                <label
                  className="text-xs font-medium text-slate-300"
                  htmlFor="amount"
                >
                  Scenes
                </label>
                <input
                  id="amount"
                  type="number"
                  min={1}
                  max={200}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-24 rounded-lg border border-slate-700/60 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/50 px-3 py-1 text-[0.7rem] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />~
                {Math.max(1, Math.round((amount * 6) / 60))} min video
              </span>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs text-red-300"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {loading ? "Generating…" : "Generate script"}
              </button>
              {loading && (
                <span className="text-xs text-slate-500">
                  This may take a few seconds
                </span>
              )}
            </div>
          </form>
        </div>

        {/* ── Generated output ── */}
        {script && (
          <div className="space-y-5">
            {/* Full script */}
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/40">
              <div className="flex items-center justify-between border-b border-slate-800/50 px-6 py-4">
                <h2 className="text-sm font-semibold text-slate-200">
                  Generated script
                </h2>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[0.65rem] font-medium text-emerald-400">
                  {scriptParts.length} scenes
                </span>
              </div>
              <div className="px-6 py-5">
                <pre className="max-h-122 overflow-y-auto whitespace-pre-wrap text-[0.8rem] leading-relaxed text-slate-300">
                  {script}
                </pre>
              </div>
            </div>

            {/* Scene downloads */}
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/40">
              <div className="flex items-center justify-between border-b border-slate-800/50 px-6 py-4">
                <h2 className="text-sm font-semibold text-slate-200">
                  Scene files
                </h2>
                <button
                  type="button"
                  onClick={() => downloadAllPartsAsZip(scriptParts)}
                  disabled={scriptParts.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-[0.7rem] font-medium text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
                >
                  Download all (.zip)
                </button>
              </div>

              {scriptParts.length > 0 && (
                <div className="max-h-72 divide-y divide-slate-800/40 overflow-y-auto">
                  {scriptParts.map((part, index) => (
                    <div
                      key={index}
                      className="group flex items-start justify-between gap-4 px-6 py-3 transition hover:bg-slate-800/20"
                    >
                      <div className="flex min-w-0 gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-800 text-[0.6rem] font-semibold text-slate-400">
                          {index + 1}
                        </span>
                        <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
                          {part}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          downloadTextFile(`scene-${index + 1}.txt`, part)
                        }
                        className="shrink-0 rounded-md border border-slate-700/50 px-2.5 py-1 text-[0.65rem] font-medium text-slate-400 opacity-0 transition group-hover:opacity-100 hover:border-slate-600 hover:text-slate-200"
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
      </div>
    </AppShell>
  );
}
