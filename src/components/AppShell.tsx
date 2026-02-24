"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Create script", icon: "✦" },
  { href: "/my-scripts", label: "My scripts", icon: "☰" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* ── Sidebar ── */}
      <aside className="hidden w-[260px] shrink-0 border-r border-slate-800/60 bg-slate-950 md:flex md:flex-col">
        {/* Logo */}
        <div className=" h-14  border-b border-slate-800/60 px-5">
          <Link href="/" className="flex items-center gap-2 h-full w-full">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 text-sm text-emerald-400">
              G
            </span>
            <a
              href="/"
              className="text-[0.82rem] font-semibold tracking-tight text-slate-100"
            >
              Script Studio
            </a>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 px-3 pt-4">
          <span className="mb-2 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </span>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.8rem] font-medium transition-colors ${
                  active
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-800/60 px-4 py-4">
          <div className="rounded-lg bg-slate-900/80 px-3 py-2.5 text-[0.7rem] leading-relaxed text-slate-500">
            Powered by{" "}
            <span className="font-medium text-slate-400">Google Gemini</span>
          </div>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-slate-800/60 px-5 md:px-8">
          {/* Mobile logo */}
          <a
            href="/"
            className="text-sm font-semibold tracking-tight md:hidden"
          >
            Script Studio
          </a>
          {/* Breadcrumb-style page title on desktop */}
          <div className="hidden text-xs text-slate-500 md:block">
            {NAV_ITEMS.find((i) => i.href === pathname)?.label ?? ""}
          </div>

          <nav className="flex items-center gap-3 text-xs text-slate-400">
            {/* Mobile nav links */}
            <div className="flex items-center gap-3 md:hidden">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`${pathname === item.href ? "text-emerald-300" : "hover:text-white"}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="hidden h-4 w-px bg-slate-800 md:block" />
            <a href="/login" className="hover:text-white">
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-full bg-slate-100 px-3.5 py-1.5 text-[0.7rem] font-medium text-slate-900 transition hover:bg-white"
            >
              Sign up
            </a>
          </nav>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
