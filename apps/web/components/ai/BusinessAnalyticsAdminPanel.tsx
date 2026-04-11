"use client";

import { useMemo, useState } from "react";
import { KpiCard } from "@/components/ui/KpiCard";

type Tab = "Industry" | "Franchise" | "Provider";
type Period = "30d" | "thisMonth" | "thisQuarter";

type ReportCard = {
  title: string;
  subtitle: string;
  bullets: string[];
  accent: string;
};

const PERIOD_LABEL: Record<Period, string> = {
  "30d": "Last 30 days",
  thisMonth: "This month",
  thisQuarter: "This quarter",
};

const MOCK_REPORTS: Record<Tab, Record<Period, { kpis: { a: any; b: any; c: any }; cards: ReportCard[] }>> = {
  Industry: {
    "30d": {
      kpis: { a: "+18.4%", b: "IT · Health · Retail", c: "Top demand: Web Dev" },
      cards: [
        {
          title: "Demand Change Snapshot",
          subtitle: "Industry-level growth vs previous window",
          bullets: ["IT demand increased 18.4%", "Health appointment demand up 9.1%", "Retail services stabilized after surge"],
          accent: "#33C3FF",
        },
        {
          title: "Top Services Ranking",
          subtitle: "Services with highest verified conversion",
          bullets: ["Website Development (Tier-1)", "Doctor Consultation (Tier-2)", "Tutor Packages (Tier-2)"],
          accent: "#22b14c",
        },
      ],
    },
    thisMonth: {
      kpis: { a: "+12.0%", b: "Health · Travel · Education", c: "Top demand: Appointments" },
      cards: [
        {
          title: "Trust-Adjusted Conversion",
          subtitle: "Using STL quality signals",
          bullets: ["High-STL providers outperform by 1.7x", "Low-STL fraud risk reduces conversion by 0.8x"],
          accent: "#f59e0b",
        },
      ],
    },
    thisQuarter: {
      kpis: { a: "+26.7%", b: "IT · Education · Logistics", c: "Top demand: Corporate contracts" },
      cards: [
        {
          title: "Quarter Trend",
          subtitle: "Longer horizon prediction readiness",
          bullets: ["Education adoption up across new cities", "Logistics demand spikes correlate with seasonality", "Market fit improving with AI matching"],
          accent: "#8b5cf6",
        },
      ],
    },
  },
  Franchise: {
    "30d": {
      kpis: { a: "$12,430", b: "Rawalpindi · Lahore", c: "Commission collected: 6.2%" },
      cards: [
        {
          title: "Franchise Earnings Report",
          subtitle: "Verified order settlement + escrow health",
          bullets: ["Avg settlement time: 3.2h", "Escrow success: 99.1%", "Commission uplift: +6.2%"],
          accent: "#3b82f6",
        },
        {
          title: "Provider Revenue Mix",
          subtitle: "Which provider segments drive earnings",
          bullets: ["STL High providers: 61%", "STL Medium providers: 28%", "STL Basic: 11%"],
          accent: "#33C3FF",
        },
      ],
    },
    thisMonth: {
      kpis: { a: "$18,210", b: "Islamabad · Karachi", c: "Top segment: AI tools" },
      cards: [
        {
          title: "Month Summary",
          subtitle: "Actionable highlights for owners",
          bullets: ["AI tool adoption rising in tech cities", "Fraud flags reduced by -14% with better filters", "Demand prediction accuracy improved"],
          accent: "#22b14c",
        },
      ],
    },
    thisQuarter: {
      kpis: { a: "$54,880", b: "Global rollouts", c: "ROI forecast: +21%" },
      cards: [
        {
          title: "Quarter ROI Forecast",
          subtitle: "Based on demand + verified conversion",
          bullets: ["Forecast confidence: 0.74", "Best ROI sector: Logistics & Delivery", "Risk notes: watch geo mismatch spikes"],
          accent: "#f43f5e",
        },
      ],
    },
  },
  Provider: {
    "30d": {
      kpis: { a: "+22%", b: "Top providers: 18", c: "Recommended activation: 6" },
      cards: [
        {
          title: "Provider Performance Summary",
          subtitle: "Verified outcomes adjusted by trust signals",
          bullets: ["Avg rating stable: 4.7/5", "Order success rate: 97.4%", "Top activation opportunities: 6"],
          accent: "#10b981",
        },
      ],
    },
    thisMonth: {
      kpis: { a: "+9%", b: "STL Premium focus", c: "Rebooking rate: 31%" },
      cards: [
        {
          title: "Rebooking & Retention",
          subtitle: "How well providers retain customers",
          bullets: ["Rebooking rate improving", "Support response time under threshold", "Lower fraud risk → higher repeat orders"],
          accent: "#3b82f6",
        },
      ],
    },
    thisQuarter: {
      kpis: { a: "+34%", b: "Quality uplift", c: "Fraud risk: declining trend" },
      cards: [
        {
          title: "Quality Uplift Report",
          subtitle: "AI business analytics for STL upgrades",
          bullets: ["High STL share increased", "Trust badges correlate with conversion", "Automation suggestions applied in 26% of segments"],
          accent: "#8b5cf6",
        },
      ],
    },
  },
};

export function BusinessAnalyticsAdminPanel() {
  const [tab, setTab] = useState<Tab>("Industry");
  const [period, setPeriod] = useState<Period>("30d");

  const report = MOCK_REPORTS[tab][period];

  const accent = useMemo(() => {
    if (tab === "Industry") return "#33C3FF";
    if (tab === "Franchise") return "#3b82f6";
    return "#22b14c";
  }, [tab]);

  return (
    <div className="space-y-6">
      <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">AI Business Analytics</h2>
            <p className="text-[10px] text-ehb-textMuted">
              Auto-generated reports for franchise owners, providers, and the platform (UI mock).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["Industry", "Franchise", "Provider"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`min-h-touch rounded-full px-3 py-1.5 text-[11px] font-medium transition-all border ${
                  tab === t
                    ? "bg-gradient-to-r from-[#33C3FF]/25 to-[#3b82f6]/25 text-white border-white/15 shadow-sm"
                    : "bg-white/0 text-ehb-textMuted hover:text-ehb-textBody border-white/10"
                }`}
              >
                {t}
              </button>
            ))}

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-white focus:outline-none"
              aria-label="Period"
            >
              <option value="30d">{PERIOD_LABEL["30d"]}</option>
              <option value="thisMonth">{PERIOD_LABEL.thisMonth}</option>
              <option value="thisQuarter">{PERIOD_LABEL.thisQuarter}</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Headline Metric" value={report.kpis.a} detail={`Scope: ${tab} · ${PERIOD_LABEL[period]}`} />
        <KpiCard label="Focus Areas" value={report.kpis.b} detail="Top segments for action" />
        <KpiCard label="Suggested Focus" value={report.kpis.c} detail="Based on trust-adjusted demand" />
        <KpiCard label="Report Mode" value="Template + AI" detail="NLG later (UI mock)" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {report.cards.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl glass-card card-hover border p-5"
            style={{
              borderColor: `${c.accent}35`,
              boxShadow: `0 0 26px ${c.accent}18`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{c.title}</p>
                <p className="text-[11px] text-ehb-textMuted mt-1 leading-relaxed">{c.subtitle}</p>
              </div>
              <span
                className="inline-flex items-center rounded-full px-2 py-1 text-[10px] border border-white/10 bg-white/5 text-ehb-textBody"
                style={{ borderColor: `${accent}55` }}
              >
                AI Report
              </span>
            </div>
            <ul className="mt-4 space-y-1.5 text-[11px] text-ehb-textBody">
              {c.bullets.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

