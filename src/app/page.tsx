import React from "react";
import { MoveRight, CheckCircle2, Terminal } from "lucide-react";
import Link from "next/link";
const FEATURES = [
  {
    text: "Generate 1 to 200+ sentences for scripts or stories.",
    color: "text-cyan-400",
  },
  {
    text: "Export prompts as optimized plain text files.",
    color: "text-purple-400",
  },
  {
    text: "Fine-tuned for Google Gemini & high-token LLMs.",
    color: "text-blue-400",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-tr from-blue-700 via-purple-600 via-cyan-600 to-blue-700 text-white selection:bg-cyan-500/30">
      {/* Container */}
      <main className="w-full max-w-7xl px-6 py-8 md:px-12 flex flex-col gap-16 md:gap-24">
        {/* Navigation */}
        <header className="flex items-center justify-between w-full backdrop-blur-sm bg-white/5 py-4 px-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Terminal size={18} className="text-white" />
            </div>
            <Link href="/">
              <span className="text-xl font-bold tracking-tight">
                Gemini Studio
              </span>
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-slate-200 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-blue-900 shadow-xl hover:bg-slate-100 active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-8">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-balance">
              Transform a spark into a
              <span className="block bg-linear-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                masterpiece script.
              </span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-200/90 font-medium">
              Paste a short idea and let Gemini Script Studio engineer the
              perfect prompt. Ready-to-use structures designed for 2026 AI
              workflows.
            </p>

            <ul className="space-y-4">
              {FEATURES.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm font-medium"
                >
                  <CheckCircle2 size={18} className={feature.color} />
                  <span className="text-slate-100">{feature.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <Link href="/dashboard">
                <button className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-cyan-400 px-8 py-4 text-sm font-bold text-slate-950 shadow-2xl shadow-cyan-400/20 hover:bg-cyan-300 hover:-translate-y-0.5 transition-all group">
                  Start Generating{" "}
                  <MoveRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold hover:bg-white/10 transition-colors">
                  View Examples
                </button>
              </Link>
            </div>
          </div>

          {/* Feature Preview Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-400 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-3xl border border-white/10 bg-slate-900/40 p-1 backdrop-blur-xl shadow-2xl">
              <div className="p-6 md:p-8 bg-slate-950/60 rounded-[1.4rem] overflow-hidden">
                <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/50" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                    <div className="h-3 w-3 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Live Preview
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-2 block">
                      Source Idea
                    </label>
                    <p className="text-sm font-medium text-slate-100">
                      "A sci-fi short about a robot learning to cook in 2026."
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-2 block">
                      Optimized Prompt
                    </label>
                    <p className="line-clamp-4 text-xs leading-relaxed text-slate-300 font-mono">
                      Act as an expert screenwriter. Construct a 120-sentence
                      narrative detailing the sensory evolution of Unit-7X as it
                      navigates the complexities of organic flavor...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
