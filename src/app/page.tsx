export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <main className="flex w-full max-w-5xl flex-col gap-16 px-6 py-16 md:px-12 md:py-24">
        <header className="flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">Gemini Script Studio</div>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <a href="/login" className="hover:text-white">
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-full bg-slate-50 px-4 py-2 text-xs font-medium text-slate-900 shadow-sm hover:bg-white"
            >
              Sign up
            </a>
          </nav>
        </header>

        <section className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] md:items-center">
          <div className="space-y-6">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Turn a tiny idea into a
              <span className="bg-gradient-to-r from-sky-400 to-emerald-300 bg-clip-text text-transparent">
                {" "}
                1200 sentence script
              </span>
              for Gemini.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-300">
              Paste a short idea, pick how long you want the script to be, and let Gemini
              Script Studio craft a clean, ready-to-use prompt you can drop straight into
              Gemini or any other AI model.
            </p>
            <ul className="space-y-2 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Generate between 1 and 200 sentences for your script or story.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Download the final prompt as plain text for reuse anywhere.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-400" />
                <span>Designed to work great with Google Gemini and other LLMs.</span>
              </li>
            </ul>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
              >
                Get started free
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900/60"
              >
                Already have an account? Log in
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-black/40">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
              <span>Prompt preview</span>
              <span>Gemini-ready</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs leading-relaxed text-slate-100">
              <p className="mb-2 text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
                Idea
              </p>
              <p className="mb-4 text-sm text-slate-50">
                "Short YouTube video explaining how to stay focused while studying."
              </p>
              <p className="mb-2 text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
                Generated script (40 sentences)
              </p>
              <p className="line-clamp-5 text-sm text-slate-100">
                You are a scriptwriter helping a creator record a clear, friendly YouTube
                video about staying focused while studying. Write a script of 40 concise
                sentences, grouped into short paragraphs with natural transitions. Start by
                briefly introducing why focus is hard in 2026, then share practical tips on
                planning, environment, and energy. Close with a motivating message and a
                simple call to action.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
