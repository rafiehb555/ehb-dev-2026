import Link from "next/link";
import { Sparkles, LayoutDashboard, Braces, Database, ArrowRight } from "lucide-react";
import { LocalDemoHealthBadge } from "@/components/local-demo/LocalDemoHealthBadge";

export const metadata = {
  title: "Local demo guide – EHB",
  description: "What to open in the browser vs API-only URLs (development).",
};

export default function LocalDemoGuidePage() {
  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-10 max-w-3xl space-y-10">
        <header className="relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-[#0a1628] via-[#0d1017] to-[#051a24] p-8 shadow-[0_0_80px_-20px_rgba(51,195,255,0.35)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(51,195,255,0.12),transparent_55%)]" aria-hidden />
          <div className="relative z-10 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 ring-1 ring-cyan-400/30">
              <Sparkles className="h-6 w-6 text-cyan-200" aria-hidden />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90">Development</p>
              <h1 className="mt-2 text-2xl md:text-3xl font-semibold gradient-text">Local demo — clear expectations</h1>
              <p className="mt-3 text-sm text-ehb-textBody leading-relaxed max-w-2xl">
                This build is a <strong className="text-white">working demo</strong> that can later harden into production.
                Two ideas matter: <strong className="text-white">pages</strong> (UI) vs <strong className="text-white">APIs</strong>{" "}
                (JSON). Search &amp; marketplace show <strong className="text-white">sample data</strong> when your DB is
                empty (local dev only).
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex gap-3">
            <LayoutDashboard className="h-8 w-8 shrink-0 text-emerald-300/90" aria-hidden />
            <div>
              <h2 className="text-sm font-semibold text-white">Screens (UI)</h2>
              <p className="mt-1 text-xs text-ehb-textBody leading-relaxed">
                Full layouts with cards, trust chips, and flows — use these for demos and reviews.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex gap-3">
            <Braces className="h-8 w-8 shrink-0 text-violet-300/90" aria-hidden />
            <div>
              <h2 className="text-sm font-semibold text-white">APIs</h2>
              <p className="mt-1 text-xs text-ehb-textBody leading-relaxed">
                <code className="text-cyan-200/90">/api/…</code> returns JSON for apps. Opening them in a browser shows raw
                data — that is correct.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="text-cyan-300">→</span> Start here (pages)
          </h2>
          <ul className="space-y-3">
            {[
              { href: "/auth", label: "/auth", note: "Login/register panel for protected pages" },
              { href: "/search", label: "/search", note: "AI trust search — demo rows if DB empty" },
              { href: "/marketplace", label: "/marketplace", note: "Marketplace grid + order/review (demo)" },
              { href: "/dmo/ehb-stl-level", label: "/dmo/ehb-stl-level", note: "EHB-STL-LEVEL reference (DMO)" },
              { href: "/gosellr", label: "/gosellr", note: "Product list — pick a real id" },
              { href: "/gosellr/product/cleanmaster-ai", label: "/gosellr/product/cleanmaster-ai", note: "Example product (not [productId])" },
            ].map((row) => (
              <li key={row.href}>
                <Link
                  href={row.href}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:border-cyan-400/30 hover:bg-white/[0.07] transition-colors"
                >
                  <div>
                    <code className="text-sm text-cyan-200">{row.label}</code>
                    <p className="text-[11px] text-ehb-textMuted mt-0.5">{row.note}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ehb-textMuted group-hover:text-cyan-200 mt-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-white">API examples (JSON)</h2>
          <ul className="font-mono text-[12px] text-ehb-textBody space-y-1.5">
            <li>/api/health — app + DB ping · <code className="text-cyan-200/90">?liveness=1</code> skips DB (fast probe)</li>
            <li>/api/stl/meta — public meta</li>
            <li>/api/stl/me — session + DB (see auth note below)</li>
            <li>/api/search?type=ALL&amp;take=10</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-500/25 bg-amber-950/25 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-amber-100 flex items-center gap-2">
            <Database className="h-4 w-4 shrink-0" aria-hidden />
            Database &amp; auth
          </h2>
          <LocalDemoHealthBadge />
          <p className="text-sm text-ehb-textBody leading-relaxed">
            If <code className="text-amber-100/90">/api/stl/me</code> or DMO STL shows an auth/seed message, run{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-amber-100">npx prisma db seed</code> from the project
            folder. MongoDB often needs a <strong className="text-amber-50">replica set</strong> for Prisma transactions.
          </p>
          <p className="text-xs text-ehb-textMuted">
            Demo login (when users exist): <code className="text-white/80">demo-seller@ehb.local</code> — password in seed
            file.
          </p>
        </section>

        <p className="text-xs text-ehb-textMuted text-center">
          Roadmap: tighten DMO density, consumer onboarding, and design-system polish — this page sets expectations until
          those land.
        </p>
      </div>
    </main>
  );
}
