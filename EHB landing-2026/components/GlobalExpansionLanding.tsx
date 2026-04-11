"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrustBadgeLegend } from "@/components/TrustBadgeLegend";
import { STLLevelsAndSecurity } from "@/components/STLLevelsAndSecurity";
import { AIToolsSection } from "@/components/AIToolsSection";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

type Country = {
  code: string;
  name: string;
  accent: string;
  cities: string[];
  readinessPct: number;
  franchiseStage: string;
};

const COUNTRIES: Country[] = [
  {
    code: "UAE",
    name: "United Arab Emirates",
    accent: "#29ABE2",
    cities: ["Dubai"],
    readinessPct: 82,
    franchiseStage: "GoSellr GSM live onboarding",
  },
  {
    code: "PK",
    name: "Pakistan",
    accent: "#22B14C",
    cities: ["Lahore", "Karachi", "Islamabad"],
    readinessPct: 76,
    franchiseStage: "Verification + city expansion running",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    accent: "#F59E0B",
    cities: ["Riyadh", "Jeddah"],
    readinessPct: 41,
    franchiseStage: "Coming soon — onboarding next batch",
  },
  {
    code: "UK",
    name: "United Kingdom",
    accent: "#6366F1",
    cities: ["London", "Manchester"],
    readinessPct: 33,
    franchiseStage: "Coming soon — license registry setup",
  },
];

export function GlobalExpansionLanding({
  locationQuery,
}: {
  locationQuery?: { country?: string; state?: string; city?: string };
}) {
  const initialCode =
    locationQuery?.country && COUNTRIES.some((c) => c.code === locationQuery.country) ? locationQuery.country : COUNTRIES[0]?.code ?? "UAE";

  const [selectedCode, setSelectedCode] = useState(initialCode);

  const selected = useMemo(() => {
    return COUNTRIES.find((c) => c.code === selectedCode) ?? COUNTRIES[0];
  }, [selectedCode]);

  const selectedCountry = useMemo(() => {
    const c = locationQuery?.country?.trim() || "";
    return c ? getCountryByCode(c) : undefined;
  }, [locationQuery?.country]);

  const selectedState = useMemo(() => {
    const c = locationQuery?.country?.trim() || "";
    const s = locationQuery?.state?.trim() || "";
    return c && s ? getStateByCode(c, s) : undefined;
  }, [locationQuery?.country, locationQuery?.state]);

  const selectedCity = useMemo(() => {
    const c = locationQuery?.country?.trim() || "";
    const s = locationQuery?.state?.trim() || "";
    const city = locationQuery?.city?.trim() || "";
    return c && s && city ? getCityByCode(c, s, city) : undefined;
  }, [locationQuery?.country, locationQuery?.state, locationQuery?.city]);

  const locationAccent = selectedCountry?.accent ?? selected.accent;
  const locationLabel = selectedCity?.name || selectedState?.name || selectedCountry?.name || "";

  const locationQs = useMemo(() => {
    const sp = new URLSearchParams();
    if (locationQuery?.country) sp.set("country", locationQuery.country);
    if (locationQuery?.state) sp.set("state", locationQuery.state);
    if (locationQuery?.city) sp.set("city", locationQuery.city);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  }, [locationQuery?.country, locationQuery?.state, locationQuery?.city]);

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <section className="space-y-2">
          <div
            className="inline-flex items-center gap-2 rounded-full border glass-panel px-3 py-1.5 text-[11px] text-ehb-textBody border-white/10"
            style={{ borderColor: `${selected.accent}55`, boxShadow: `0 0 22px ${selected.accent}22` }}
          >
            <span aria-hidden>🌍</span>
            <span className="text-ehb-textMuted">Phase 6</span>
            <span className="text-white font-semibold">Global Expansion</span>
          </div>

          {locationLabel ? (
            <div
              className="inline-flex items-center gap-2 rounded-full border glass-panel px-3 py-1.5 text-[11px] text-ehb-textBody border-white/10"
              style={{ borderColor: `${locationAccent}55`, boxShadow: `0 0 22px ${locationAccent}22` }}
            >
              <span aria-hidden>📍</span>
              <span>
                Near you: <span className="text-white font-semibold">{locationLabel}</span>
              </span>
            </div>
          ) : null}

          <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
            Multi-country franchise onboarding (demo)
          </h1>

          <p className="text-ehb-textMuted max-w-2xl">
            One verified system scales across countries. DMO coordinates trust (PSS, CRB, STL) while
            franchise operations keep local delivery and orders consistent.
          </p>
        </section>

        <section className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 overflow-hidden relative">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            aria-hidden
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Select country</p>
                  <h2 className="text-lg font-semibold text-white">
                    {selected.name} <span className="text-ehb-textMuted text-sm font-medium">({selected.code})</span>
                  </h2>
                </div>
                <div className="glass-panel border border-white/10 rounded-2xl px-4 py-3 w-full sm:w-[280px]">
                  <label className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Country</label>
                  <select
                    value={selectedCode}
                    onChange={(e) => setSelectedCode(e.target.value)}
                    className="mt-2 w-full bg-transparent outline-none text-sm text-ehb-textBody"
                    aria-label="Select country"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Expansion readiness</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-ehb-textBody">{selected.franchiseStage}</div>
                  <div className="text-sm font-semibold" style={{ color: selected.accent }}>
                    {selected.readinessPct}%
                  </div>
                </div>
                <div className="mt-3 w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${selected.readinessPct}%`,
                      background: `linear-gradient(90deg, ${selected.accent}, rgba(34, 177, 76,0.9))`,
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {selected.cities.map((city) => (
                  <div
                    key={city}
                    className="glass-card rounded-2xl border p-4 card-hover"
                    style={{ borderColor: `${selected.accent}30`, boxShadow: `0 0 22px ${selected.accent}12` }}
                  >
                    <div className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">City</div>
                    <div className="text-sm font-semibold text-white mt-2">{city}</div>
                    <div className="text-[11px] text-ehb-textMuted mt-1">Verified onboarding included</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card rounded-2xl border p-4" style={{ borderColor: `${selected.accent}30` }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">How scaling works</p>
                <ul className="space-y-2 text-ehb-textBody">
                  <li className="flex items-start gap-2">
                    <span aria-hidden className="mt-[2px]">
                      ✅
                    </span>
                    <span>DMO coordinates verification + workflow approvals.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden className="mt-[2px]">
                      ✅
                    </span>
                    <span>Franchise operations keep local service delivery consistent.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden className="mt-[2px]">
                      ✅
                    </span>
                    <span>AI Marketplace matches trusted tools for each need.</span>
                  </li>
                </ul>
              </div>

              <div className="glass-card rounded-2xl border p-4" style={{ borderColor: "rgba(245,158,11,0.35)" }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Next action</p>
                <p className="text-sm text-ehb-textBody leading-relaxed">
                  Book your area in the live ecommerce franchise and start earning with the verified EHB system.
                </p>
                <div className="mt-3 grid gap-2">
                  <Link
                    href={`/franchise${locationQs}#booking`}
                    className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#29ABE2] to-[#22B14C] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
                  >
                    Book area franchise
                    <span className="text-xs ml-2" aria-hidden>
                      →
                    </span>
                  </Link>
                  <Link
                    href={`/ai-marketplace${locationQs}`}
                    className="text-sm text-ehb-textBody hover:underline text-center"
                  >
                    Explore verified AI tools
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustBadgeLegend />
        <STLLevelsAndSecurity />
        <AIToolsSection locationQuery={locationQuery} />
      </div>
    </main>
  );
}

