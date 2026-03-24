"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FranchiseIndustryMarquee } from "@/components/FranchiseIndustryMarquee";

type AreaOption = {
  label: string;
  country: string;
  region: string;
  stateCode: string;
  cityCode: string;
};

const AREA_OPTIONS: AreaOption[] = [
  { label: "Dubai, UAE", country: "UAE", region: "Dubai", stateCode: "dubai", cityCode: "dubai" },
  { label: "Lahore, Pakistan", country: "Pakistan", region: "Lahore", stateCode: "punjab", cityCode: "lahore" },
  { label: "Rawalpindi, Pakistan", country: "Pakistan", region: "Rawalpindi", stateCode: "punjab", cityCode: "rawalpindi" },
  { label: "Karachi, Pakistan", country: "Pakistan", region: "Karachi", stateCode: "sindh", cityCode: "karachi" },
  { label: "Islamabad, Pakistan", country: "Pakistan", region: "Islamabad", stateCode: "islamabad", cityCode: "islamabad" },
];

type SubLevel = {
  level: number;
  licenseUsd: number;
  licensePkr: number;
  monthlyOrders: number;
  dailyOrders: number;
  passiveIncomeNote: string;
};

const SUB_LEVELS: SubLevel[] = [
  { level: 1, licenseUsd: 1000, licensePkr: 310000, monthlyOrders: 500, dailyOrders: 10, passiveIncomeNote: "Passive + verified delivery" },
  { level: 2, licenseUsd: 2000, licensePkr: 620000, monthlyOrders: 800, dailyOrders: 16, passiveIncomeNote: "Passive + verified delivery" },
  { level: 3, licenseUsd: 3000, licensePkr: 930000, monthlyOrders: 1200, dailyOrders: 24, passiveIncomeNote: "Passive + verified delivery" },
  { level: 4, licenseUsd: 4000, licensePkr: 1240000, monthlyOrders: 1500, dailyOrders: 30, passiveIncomeNote: "Passive + verified delivery" },
  { level: 5, licenseUsd: 5000, licensePkr: 1550000, monthlyOrders: 1800, dailyOrders: 36, passiveIncomeNote: "Passive + verified delivery" },
  { level: 6, licenseUsd: 6000, licensePkr: 1860000, monthlyOrders: 2200, dailyOrders: 44, passiveIncomeNote: "Passive + verified delivery" },
  { level: 7, licenseUsd: 7000, licensePkr: 2170000, monthlyOrders: 2500, dailyOrders: 50, passiveIncomeNote: "Passive + verified delivery" },
  { level: 8, licenseUsd: 8000, licensePkr: 2480000, monthlyOrders: 2800, dailyOrders: 56, passiveIncomeNote: "Passive + verified delivery" },
  { level: 9, licenseUsd: 9000, licensePkr: 2790000, monthlyOrders: 3100, dailyOrders: 62, passiveIncomeNote: "Passive + verified delivery" },
  { level: 10, licenseUsd: 10000, licensePkr: 3100000, monthlyOrders: 3500, dailyOrders: 70, passiveIncomeNote: "Passive + verified delivery" },
];

export default function FranchisePage({
  searchParams,
}: {
  searchParams?: { country?: string; state?: string; city?: string };
}) {
  const [area, setArea] = useState<AreaOption>(() => {
    const country = searchParams?.country ?? "";
    const state = searchParams?.state ?? "";
    const city = searchParams?.city ?? "";

    const match =
      AREA_OPTIONS.find((x) => city && x.cityCode === city) ??
      AREA_OPTIONS.find((x) => country && x.country === country && state && x.stateCode === state) ??
      null;
    return match ?? AREA_OPTIONS[0];
  });

  const accent = useMemo(() => {
    // simple mapping for selected area visuals
    if (area.country === "UAE") return { a: "#00AEEF", b: "#22C55E" };
    return { a: "#8B5CF6", b: "#00AEEF" };
  }, [area.country]);

  const locationQs = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("country", area.country === "UAE" ? "UAE" : "PK");
    // Map country display to query country code used by /locations and /ai-marketplace.
    // UAE stays UAE, Pakistan becomes PK.
    const stateCode = area.stateCode;
    const cityCode = area.cityCode;
    sp.set("state", stateCode);
    sp.set("city", cityCode);
    return `?${sp.toString()}`;
  }, [area.country, area.stateCode, area.cityCode]);

  const nearYouLabel = `${area.region} · ${area.country === "UAE" ? "United Arab Emirates" : "Pakistan"}`;

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">
              GoSellr GSM Franchise Model
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              GoSellr GSM (Global Shopping Management) franchise starts with booking your area — earn passive income with a verified GoSellr EHB system.
            </p>
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-[11px] text-slate-200 border"
              style={{ borderColor: `${accent.a}55`, boxShadow: `0 0 28px ${accent.a}22` }}
            >
              <span aria-hidden>📍</span>
              <span>
                Near you: <span className="text-white font-semibold">{nearYouLabel}</span>
              </span>
            </div>
          </div>

          <div className="glass-panel border border-white/10 rounded-2xl p-4 w-full lg:w-[360px]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">Selected area</p>
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-lg">
                📍
              </span>
              <select
                value={area.label}
                onChange={(e) => {
                  const next = AREA_OPTIONS.find((x) => x.label === e.target.value) ?? AREA_OPTIONS[0];
                  setArea(next);
                }}
                className="w-full bg-transparent outline-none text-sm text-slate-200"
                aria-label="Select area"
              >
                {AREA_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />
            <p className="text-[12px] text-slate-300 mt-3">
              You selected <span className="text-white font-semibold">{area.region}</span> ({" "}
              <span className="text-white font-semibold">{area.country}</span> )
            </p>
          </div>
        </div>

        {/* Booking + More info hero */}
        <section className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div
              className="absolute left-[-30px] top-[-30px] h-72 w-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle at 30% 30%, ${accent.a}, transparent 55%)` }}
            />
            <div
              className="absolute right-[-30px] bottom-[-30px] h-72 w-72 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle at 30% 30%, ${accent.b}, transparent 55%)` }}
            />
          </div>

          <div className="relative grid gap-6 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Book your own area GoSellr GSM franchise
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                Book your area franchise and start passive income for the life time with real generation
              </h2>
              <p className="text-slate-400 text-sm md:text-base">
                Your selected region gets onboarding support, GoSellr GSM marketplace dashboards, and verified services.
                You earn from the platform’s transactions while the verification departments keep quality consistent.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#booking"
                  className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00AEEF] to-[#22C55E] px-6 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
                >
                  Book franchise
                </a>
                <a
                  href="#details"
                  className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all"
                >
                  More information
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className="rounded-2xl glass-panel border p-4 border-white/10"
                style={{
                  boxShadow: `0 0 28px ${accent.a}22`,
                }}
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">What you get</p>
                <div className="space-y-2">
                  {[
                    "Verified onboarding system (PSS + DMO + EHB‑STL).",
                    "Earnings tracking and weekly goals dashboard.",
                    "Franchise support training + SOPs.",
                    "Passive revenue from transactions in your area.",
                  ].map((t) => (
                    <div key={t} className="flex items-start gap-2">
                      <span aria-hidden>✅</span>
                      <p className="text-[12px] text-slate-300 leading-relaxed">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Franchise hierarchy */}
        <section id="details" className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Franchise hierarchy</p>

          <div className="grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="relative">
                <div className="absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-[2px] bg-gradient-to-b from-white/10 via-white/10 to-transparent" aria-hidden />
                <div className="space-y-3">
                  <div className="rounded-2xl glass-panel border p-4 border-[#00AEEF]/30" style={{ boxShadow: "0 0 28px rgba(0,234,255,0.12)" }}>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Country Franchise</p>
                    <h3 className="text-lg font-semibold text-white mt-1">GoSellr GSM at country level</h3>
                    <p className="text-[12px] text-slate-300 mt-2">Country rights + revenue share across regions.</p>
                  </div>

                  <div className="rounded-2xl glass-panel border p-4 border-[#22C55E]/30" style={{ boxShadow: "0 0 28px rgba(34,197,94,0.12)" }}>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Corporate Franchise</p>
                    <h3 className="text-lg font-semibold text-white mt-1">GoSellr GSM corporate operations</h3>
                    <p className="text-[12px] text-slate-300 mt-2">Manage city/sector orders + verified provider onboarding.</p>
                  </div>

                  <div className="rounded-2xl glass-panel border p-4 border-[#8B5CF6]/30" style={{ boxShadow: "0 0 28px rgba(139,92,246,0.12)" }}>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Master Franchise</p>
                    <h3 className="text-lg font-semibold text-white mt-1">GoSellr GSM multi-city control</h3>
                    <p className="text-[12px] text-slate-300 mt-2">
                      Manage corporate + sub partners for bigger passive income.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">Sub franchises</p>
                    <h3 className="text-xl font-semibold text-white">GoSellr GSM levels 1 to 10</h3>
                    <p className="text-sm text-slate-400 mt-2">
                      Sub franchise tiers 1–10. Choose your tier for the area and start earning with verified services.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-amber-200 font-semibold">License fee</p>
                    <p className="text-sm text-slate-200 mt-1">Demo values for UI</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {SUB_LEVELS.map((lvl) => (
                    <div
                      key={lvl.level}
                      className="rounded-2xl glass-card border p-4 card-hover"
                      style={{
                        borderColor: "rgba(0,234,255,0.18)",
                        boxShadow: "0 0 24px rgba(0,234,255,0.10)",
                      }}
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Level {lvl.level}</p>
                      <p className="text-sm font-semibold text-white mt-2">${lvl.licenseUsd.toLocaleString()} License</p>
                      <p className="text-[12px] text-slate-300 mt-1">PKR: {lvl.licensePkr.toLocaleString()}</p>
                      <div className="mt-3 space-y-1">
                        <p className="text-[12px] text-slate-300">Daily orders: {lvl.dailyOrders}</p>
                        <p className="text-[12px] text-slate-300">Monthly orders: {lvl.monthlyOrders}</p>
                        <p className="text-[11px] text-emerald-200">{lvl.passiveIncomeNote}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 6 — Global expansion preview */}
        <section className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 overflow-hidden relative space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Phase 6 — Global Expansion</p>
              <h3 className="text-xl font-semibold text-white">Multi-country growth (demo)</h3>
              <p className="text-sm text-slate-400">
                Expand your verified franchise across countries while DMO keeps approvals, STL scoring and registry consistent.
              </p>
            </div>
            <Link
              href={`/global${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#3b82f6] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
            >
              Open global dashboard
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { code: "UAE", name: "Dubai-ready", accent: "#00AEEF" },
              { code: "PK", name: "City expansion active", accent: "#22C55E" },
              { code: "SA", name: "Coming soon batches", accent: "#F59E0B" },
            ].map((c) => (
              <div
                key={c.code}
                className="rounded-2xl glass-card border p-4 card-hover"
                style={{ borderColor: `${c.accent}30`, boxShadow: `0 0 24px ${c.accent}12` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{c.code}</span>
                  <span aria-hidden className="text-[13px]">
                    ↗
                  </span>
                </div>
                <div className="text-sm font-semibold text-white mt-2">{c.name}</div>
                <div className="text-[11px] text-slate-400 mt-1">Trust stack supported: PSS + CRB + STL</div>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 8 — Blockchain governance preview */}
        <section className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 overflow-hidden relative space-y-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Phase 8 — Blockchain Governance</p>
              <h3 className="text-xl font-semibold text-white">Trust anchors for franchise monitoring (demo)</h3>
              <p className="text-sm text-slate-400">
                Smart contracts and trust anchors keep verified franchise operations consistent across countries and cities.
              </p>
            </div>
            <Link
              href={`/blockchain-governance${locationQs}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00eaff] to-[#8b5cf6] px-5 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
            >
              Open blockchain page
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Anchored verification", note: "PSS/CRB signals become tamper-aware (demo)", accent: "#00AEEF" },
              { label: "Smart settlement", note: "STL passes unlock safe payout flow (demo)", accent: "#8B5CF6" },
              { label: "Investor audit trail", note: "Readable history for governance confidence", accent: "#F59E0B" },
            ].map((c) => (
              <div
                key={c.label}
                className="rounded-2xl glass-card border p-4 card-hover"
                style={{ borderColor: `${c.accent}30`, boxShadow: `0 0 24px ${c.accent}12` }}
              >
                <div className="text-sm font-semibold text-white">{c.label}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{c.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Booking section */}
        <section id="booking" className="rounded-3xl glass-panel border border-white/10 p-5 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mb-2">Booking</p>
              <h3 className="text-xl font-semibold text-white">Book your GoSellr GSM area now</h3>
              <p className="text-sm text-slate-400 mt-2">
                Selected area: <span className="text-white font-semibold">{area.label}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/franchise#booking"
                className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00AEEF] to-[#22C55E] px-6 py-2.5 text-sm font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
              >
                Book franchise
              </Link>
              <Link
                href="/franchise#details"
                className="min-h-touch inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all"
              >
                More information
              </Link>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Demo booking UI only. Real checkout/payment will be connected later to the verified franchise system.
          </p>
        </section>

        {/* Moving cards row */}
        <section className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Other industry franchise cards</p>
          <FranchiseIndustryMarquee selectedAccent={accent.a} />
        </section>
      </div>
    </main>
  );
}

