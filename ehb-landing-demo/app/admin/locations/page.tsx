import Link from "next/link";
import { UniversalStructuredAdminBlocks } from "@/components/admin/UniversalStructuredAdminBlocks";
import { COUNTRIES } from "@/lib/locations";

export default function AdminLocationsPage() {
  const countries = COUNTRIES.slice(0, 3);

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6 sm:py-8 space-y-5 sm:space-y-6 text-[10px] xs:text-[11px]">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Admin · Locations</p>
            <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">
              Country → State → City control
            </h1>
            <p className="text-slate-300 max-w-2xl">
              Configure location hierarchy for provider search, franchise onboarding and marketplace filtering (demo).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-3 py-1.5 font-semibold text-white hover:shadow-neon-blue transition-all duration-200"
            >
              ← Back to Super Admin
            </Link>
            <Link
              href="/locations"
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#22c55e] px-3 py-1.5 font-semibold text-slate-950 btn-glow"
            >
              Open Locations
            </Link>
          </div>
        </header>

        <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Demo countries</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((c) => (
              <div
                key={c.code}
                className="rounded-2xl glass-card border p-4"
                style={{ borderColor: `${c.accent}30`, boxShadow: `0 0 24px ${c.accent}12` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold text-white">{c.code}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 leading-relaxed">{c.name}</div>
              </div>
            ))}
          </div>
        </section>

        <UniversalStructuredAdminBlocks />
      </div>
    </main>
  );
}

