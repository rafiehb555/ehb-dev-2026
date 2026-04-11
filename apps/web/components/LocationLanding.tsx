"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { COUNTRIES } from "@/lib/locations";
import { LocationSelector } from "@/components/LocationSelector";

export function LocationLanding() {
  const [value, setValue] = useState<{
    countryCode: string;
    stateCode: string;
    cityCode: string;
  }>({
    countryCode: COUNTRIES[0]?.code ?? "PK",
    stateCode: COUNTRIES[0]?.states?.[0]?.code ?? "punjab",
    cityCode: COUNTRIES[0]?.states?.[0]?.cities?.[0]?.code ?? "rawalpindi",
  });

  const selected = useMemo(() => {
    const c = COUNTRIES.find((x) => x.code === value.countryCode);
    const s = c?.states.find((x) => x.code === value.stateCode);
    const city = s?.cities.find((x) => x.code === value.cityCode);
    return { c, s, city };
  }, [value.countryCode, value.stateCode, value.cityCode]);

  const accent = selected.c?.accent ?? "#29ABE2";

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <section className="space-y-2">
          <div
            className="inline-flex items-center gap-2 rounded-full border glass-panel px-3 py-1.5 text-[11px] text-ehb-textBody border-white/10"
            style={{ borderColor: `${accent}55`, boxShadow: `0 0 22px ${accent}22` }}
          >
            <span aria-hidden>📍</span>
            <span className="text-ehb-textMuted">Phase 72</span>
            <span className="text-white font-semibold">Location-Based System</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
            Country → State → City
          </h1>
          <p className="text-ehb-textMuted max-w-2xl">
            Location filters help matching, provider discovery, franchise operations and verified service bookings.
            (Demo UI)
          </p>
        </section>

        <section className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]" aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7">
              <LocationSelector value={value} onChange={setValue} />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card rounded-2xl border p-5" style={{ borderColor: `${accent}30`, boxShadow: `0 0 30px ${accent}14` }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">What location powers</p>
                <ul className="space-y-2 text-ehb-textBody text-[12px]">
                  <li className="flex items-start gap-2">
                    <span aria-hidden>✅</span>
                    <span>Provider discovery and verified listing filtering.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden>✅</span>
                    <span>Franchise city operations and onboarding routing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden>✅</span>
                    <span>Jobs + marketplace suggestions for your area.</span>
                  </li>
                </ul>
              </div>
              <div className="glass-card rounded-2xl border p-5" style={{ borderColor: `${accent}30` }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Next step</p>
                <p className="text-ehb-textBody text-[12px] leading-relaxed">
                  Create a service listing with this location context to see consistent trust-aware flow.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/dashboard/services/new"
                    className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#22b14c] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
                  >
                    Create service
                    <span className="text-xs ml-2" aria-hidden>
                      →
                    </span>
                  </Link>
                  <Link
                    href="/franchise"
                    className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-ehb-textBody hover:bg-white/10 transition-all"
                  >
                    Franchise impact
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Selected</p>
                <p className="text-sm text-ehb-textBody mt-2 leading-relaxed">
                  {selected.c?.name ?? "—"} · {selected.s?.name ?? "—"} ·{" "}
                  <span className="text-white font-semibold">{selected.city?.name ?? "—"}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

