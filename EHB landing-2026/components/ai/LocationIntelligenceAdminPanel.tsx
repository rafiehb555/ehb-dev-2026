"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/ui/KpiCard";
import { INDUSTRIES } from "@/lib/industry/config";

type CityCode = "rawalpindi" | "lahore" | "islamabad" | "karachi";
type CityInfo = { code: CityCode; label: string; accent: string };

const CITIES: CityInfo[] = [
  { code: "rawalpindi", label: "Rawalpindi", accent: "#00eaff" },
  { code: "lahore", label: "Lahore", accent: "#3b82f6" },
  { code: "islamabad", label: "Islamabad", accent: "#22c55e" },
  { code: "karachi", label: "Karachi", accent: "#f59e0b" },
];

type Insight = {
  title: string;
  deltaText: string; // +17% etc
  bullets: string[];
  accent: string;
};

const MOCK_INSIGHTS: Record<CityCode, Record<string, Insight[]>> = {
  rawalpindi: {
    it: [
      {
        title: "Web services demand rising",
        deltaText: "+17% verified requests",
        bullets: ["Website Development top signal", "High-STL providers converting faster", "Fraud flags improved after stricter checks"],
        accent: "#00eaff",
      },
      {
        title: "Gap: mobile onboarding",
        deltaText: "Low supply vs demand",
        bullets: ["Mobile Development has weaker provider count", "Automation suggestions recommended to boost listings"],
        accent: "#22c55e",
      },
    ],
    health: [
      {
        title: "Appointment demand stable",
        deltaText: "+9% month over month",
        bullets: ["Doctor Consultation consistently trending", "Lab Reports trust score improved", "Location mismatch risk is low"],
        accent: "#00eaff",
      },
    ],
  },
  lahore: {
    travel: [
      {
        title: "Tour demand spiking",
        deltaText: "+14% verified bookings",
        bullets: ["Smart Search improves matching quality", "Affiliate campaigns show higher conversion", "Fraud risk slightly elevated for new accounts"],
        accent: "#3b82f6",
      },
    ],
    education: [
      {
        title: "Admissions pipeline strong",
        deltaText: "+11% growth",
        bullets: ["IELTS Preparation demand up", "Tors/Teachers listings gaining trust", "Recommend AI action: promote top tutors"],
        accent: "#22c55e",
      },
    ],
  },
  islamabad: {
    finance: [
      {
        title: "Trust-adjusted finance demand",
        deltaText: "+7% verified conversions",
        bullets: ["Account & Cards segment steady", "Wallet escrow health strong", "Fraud detection risk: medium"],
        accent: "#22c55e",
      },
    ],
  },
  karachi: {
    logistics: [
      {
        title: "Delivery services require scale",
        deltaText: "+16% demand",
        bullets: ["Same-day delivery trending", "Geographic supply gap detected", "Suggest AI automation: activate logistics services"],
        accent: "#f59e0b",
      },
    ],
  },
};

function getDefaultIndustrySlug(industrySlug: string | undefined) {
  return industrySlug && industrySlug.trim() ? industrySlug : "it";
}

export function LocationIntelligenceAdminPanel({
  initialIndustrySlug,
}: {
  initialIndustrySlug?: string;
}) {
  const [city, setCity] = useState<CityCode>("rawalpindi");
  const [industrySlug, setIndustrySlug] = useState<string>(getDefaultIndustrySlug(initialIndustrySlug));

  const cityInfo = CITIES.find((c) => c.code === city)!;

  const insights = useMemo(() => {
    const byCity = MOCK_INSIGHTS[city];
    return byCity[industrySlug] ?? [
      {
        title: "No specific dataset yet",
        deltaText: "Mock placeholder",
        bullets: ["Later: extend ai_insights with city + industry filters", "Until then: show template insights"],
        accent: cityInfo.accent,
      },
    ];
  }, [city, cityInfo.accent, industrySlug]);

  const primaryDelta = insights[0]?.deltaText ?? "—";

  return (
    <div className="space-y-6">
      <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">Location Intelligence AI</h2>
            <p className="text-[10px] text-slate-400">
              City/region demand insights and trust-adjusted gaps. (UI mock; backend later)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[10px] text-slate-400">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value as CityCode)}
              className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-slate-100 focus:outline-none"
            >
              {CITIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>

            <label className="text-[10px] text-slate-400">Industry</label>
            <select
              value={industrySlug}
              onChange={(e) => setIndustrySlug(e.target.value)}
              className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-slate-100 focus:outline-none max-w-[220px]"
            >
              {INDUSTRIES.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Primary Delta" value={primaryDelta} detail={`City: ${cityInfo.label}`} />
        <KpiCard label="Trust Signal Weight" value="High" detail="STL + fraud risk blended" />
        <KpiCard label="Suggested Action Type" value="Automation + Match" detail="Phase 84 / Phase 80 connection" />
        <KpiCard label="Data Refresh" value="Hourly (mock)" detail="Later: pipeline update (Phase 85)" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {insights.map((ins) => (
          <div
            key={ins.title}
            className="rounded-2xl glass-card card-hover border p-5"
            style={{
              borderColor: `${ins.accent}35`,
              boxShadow: `0 0 26px ${ins.accent}18`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{ins.title}</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ins.deltaText}</p>
              </div>
              <span
                className="inline-flex items-center rounded-full px-2 py-1 text-[10px] border border-white/10 bg-white/5 text-slate-200"
                style={{ borderColor: `${ins.accent}55` }}
              >
                Insight
              </span>
            </div>

            <ul className="mt-4 space-y-1.5 text-[11px] text-slate-300">
              {ins.bullets.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

