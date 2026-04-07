"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrustBadgeLegend } from "@/components/TrustBadgeLegend";
import { STLLevelsAndSecurity } from "@/components/STLLevelsAndSecurity";
import { AIToolsSection } from "@/components/AIToolsSection";
import { getCityByCode, getCountryByCode, getStateByCode } from "@/lib/locations";

type TabKey = "trust" | "contracts" | "anchors";

export function BlockchainGovernanceLanding({
  locationQuery,
}: {
  locationQuery?: { country?: string; state?: string; city?: string };
}) {
  const [tab, setTab] = useState<TabKey>("trust");

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

  const locationAccent = selectedCountry?.accent ?? "rgba(0,174,239,0.35)";
  const locationLabel = selectedCity?.name || selectedState?.name || selectedCountry?.name || "";

  const locationQs = useMemo(() => {
    const sp = new URLSearchParams();
    if (locationQuery?.country) sp.set("country", locationQuery.country);
    if (locationQuery?.state) sp.set("state", locationQuery.state);
    if (locationQuery?.city) sp.set("city", locationQuery.city);
    const qs = sp.toString();
    return qs ? `?${qs}` : "";
  }, [locationQuery?.country, locationQuery?.state, locationQuery?.city]);

  const copy = useMemo(() => {
    const map: Record<TabKey, { title: string; headline: string; detail: string; bullets: string[]; accent: string }> = {
      trust: {
        title: "Trust Network",
        headline: "Verification stays consistent across time",
        detail:
          "EHB continuously anchors trust verification integrity so buyers, providers, and franchises all receive the same trusted signals.",
        bullets: [
          "Verification hashes track renewals",
          "Risk signals stay visible to DMO",
          "STL trust strength stays aligned",
        ],
        accent: "rgba(0,174,239,0.35)",
      },
      contracts: {
        title: "Smart Contracts",
        headline: "Safe agreements for bookings & payouts",
        detail:
          "Smart contracts automate settlement flow after STL trust passes. Results keep compliance records readable and consistent.",
        bullets: [
          "Automated escrow unlock logic (demo)",
          "PSS/CRB-linked terms for clarity",
          "Audit trail for investor trust",
        ],
        accent: "rgba(139,92,246,0.35)",
      },
      anchors: {
        title: "On-chain Anchoring",
        headline: "Documents stay tamper-aware",
        detail:
          "Anchoring ties documents and registry updates to trust layers. If something changes, it becomes easier to detect and explain.",
        bullets: [
          "Document anchoring after CRB steps",
          "Registry updates stay traceable",
          "Refilling renewals increment visibility",
        ],
        accent: "rgba(245,158,11,0.35)",
      },
    };

    return map[tab];
  }, [tab]);

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border glass-panel px-3 py-1.5 text-[11px] text-slate-200 border-white/10">
            <span aria-hidden>⛓️</span>
            <span className="text-ehb-textMuted">Phase 8</span>
            <span className="text-white font-semibold">Blockchain Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">Trust network + smart contracts (demo)</h1>
          <p className="text-ehb-textMuted max-w-2xl">
            Smart contracts and trust anchoring create an investor-ready integrity layer for every verified transaction.
          </p>

          {locationLabel ? (
            <div
              className="inline-flex items-center gap-2 rounded-full border glass-panel px-3 py-1.5 text-[11px] text-slate-200 border-white/10"
              style={{ borderColor: `${locationAccent}55`, boxShadow: `0 0 22px ${locationAccent}22` }}
            >
              <span aria-hidden>📍</span>
              <span>
                Near you: <span className="text-white font-semibold">{locationLabel}</span>
              </span>
            </div>
          ) : null}
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
              <div className="flex flex-wrap gap-2">
                {([
                  { key: "trust" as const, label: "Trust Network", icon: "🛡️" },
                  { key: "contracts" as const, label: "Smart Contracts", icon: "🧾" },
                  { key: "anchors" as const, label: "Anchors", icon: "📌" },
                ] as const).map((t) => {
                  const isActive = tab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTab(t.key)}
                      className="min-h-touch inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold transition-all duration-200"
                      style={{
                        borderColor: isActive ? "rgba(0,174,239,0.55)" : "rgba(255,255,255,0.12)",
                        background: isActive ? "rgba(0,234,255,0.08)" : "rgba(255,255,255,0.03)",
                        color: isActive ? "rgba(226,232,240,0.98)" : "rgba(226,232,240,0.85)",
                        boxShadow: isActive ? "0 0 26px rgba(0,174,239,0.18)" : "none",
                      }}
                      aria-pressed={isActive}
                    >
                      <span aria-hidden>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="glass-card rounded-2xl border p-5" style={{ borderColor: `${copy.accent}`, boxShadow: `0 0 30px ${copy.accent}` }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">{copy.title}</p>
                <h2 className="text-xl font-semibold text-white mt-2">{copy.headline}</h2>
                <p className="text-ehb-textBody mt-3 leading-relaxed">{copy.detail}</p>
                <ul className="mt-4 space-y-2 text-slate-200">
                  {copy.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span aria-hidden className="mt-[2px]">
                        ✅
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/admin/blockchain${locationQs}`}
                    className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#8b5cf6] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
                  >
                    Open monitoring
                    <span className="text-xs ml-2" aria-hidden>
                      →
                    </span>
                  </Link>
                  <Link
                    href={`/franchise${locationQs}`}
                    className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all"
                  >
                    Franchise impact
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card rounded-2xl border p-4" style={{ borderColor: "rgba(0,174,239,0.25)" }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">On-chain status (demo)</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-ehb-textBody">Active validators</span>
                    <span className="text-[12px] text-white font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-ehb-textBody">Anchors verified</span>
                    <span className="text-[12px] text-white font-semibold">98.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-ehb-textBody">Smart contracts</span>
                    <span className="text-[12px] text-white font-semibold">6 active</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl border p-4" style={{ borderColor: "rgba(245,158,11,0.25)" }}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted mb-2">Why it matters</p>
                <p className="text-ehb-textBody text-[12px] leading-relaxed">
                  Blockchain governance adds tamper-aware integrity to approvals, registry updates and settlement flows.
                </p>
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

