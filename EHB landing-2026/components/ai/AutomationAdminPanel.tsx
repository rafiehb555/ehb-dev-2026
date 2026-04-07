"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { INDUSTRIES } from "@/lib/industry/config";

type ActionType = "activate_service" | "add_product" | "apply_to_job";

type SuggestedAction = {
  id: string;
  type: ActionType;
  title: string;
  reason: string;
  recommendedFor: { city: string; industrySlug: string };
  impact: string;
  confidence: number; // 0 - 1
};

const MOCK_ACTIONS: SuggestedAction[] = [
  {
    id: "aa_301",
    type: "activate_service",
    title: "Activate Delivery Rider listing",
    reason: "Demand predicted to rise in next 14 days; high STL providers are active",
    recommendedFor: { city: "Rawalpindi", industrySlug: "logistics" },
    impact: "Expected +8–12% verified conversions",
    confidence: 0.74,
  },
  {
    id: "aa_302",
    type: "add_product",
    title: "Add 'Preventive Maintenance' product bundle",
    reason: "Top demand includes after-sales services; fraud risk is low for stable listings",
    recommendedFor: { city: "Lahore", industrySlug: "automotive" },
    impact: "Expected +5–9% cart additions",
    confidence: 0.67,
  },
  {
    id: "aa_303",
    type: "apply_to_job",
    title: "Apply to 'Web Development (Part-time)' job",
    reason: "Smart Search matched your JPS skills; verified providers need onboarding",
    recommendedFor: { city: "Islamabad", industrySlug: "it" },
    impact: "Expected faster interview rate",
    confidence: 0.71,
  },
];

function typeToLabel(type: ActionType) {
  if (type === "activate_service") return "Activate Service";
  if (type === "add_product") return "Add Product";
  return "Apply to Job";
}

function confidenceToPill(conf: number) {
  if (conf >= 0.75) return { label: "High confidence", className: "bg-emerald-500/15 border-emerald-500/30 text-emerald-200" };
  if (conf >= 0.65)
    return { label: "Medium confidence", className: "bg-amber-500/15 border-amber-500/30 text-amber-200" };
  return { label: "Low confidence", className: "bg-rose-500/15 border-rose-500/30 text-rose-200" };
}

export function AutomationAdminPanel() {
  const [city, setCity] = useState("Rawalpindi");
  const [industrySlug, setIndustrySlug] = useState("logistics");
  const [appliedActionId, setAppliedActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const suggestions = useMemo(() => {
    return MOCK_ACTIONS.filter((a) => {
      return a.recommendedFor.city === city && a.recommendedFor.industrySlug === industrySlug;
    });
  }, [city, industrySlug]);

  const cityOptions = ["Rawalpindi", "Lahore", "Islamabad", "Karachi"];

  return (
    <div className="space-y-6">
      <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">AI Automation System</h2>
            <p className="text-[10px] text-ehb-textMuted">
              AI action suggestions without full automation — user confirmation required. (UI mock)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[10px] text-ehb-textMuted">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-white focus:outline-none"
            >
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label className="text-[10px] text-ehb-textMuted">Industry</label>
            <select
              value={industrySlug}
              onChange={(e) => setIndustrySlug(e.target.value)}
              className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-white focus:outline-none min-w-[240px]"
            >
              {INDUSTRIES.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {appliedActionId ? (
          <div className="rounded-xl glass-panel border border-emerald-500/25 p-3 text-[10px] text-emerald-100">
            Applied: <span className="text-white font-semibold">{appliedActionId}</span>
          </div>
        ) : null}

        {message ? (
          <div className="rounded-xl glass-panel border border-white/10 p-3 text-[10px] text-ehb-textBody">
            {message}
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {suggestions.map((a) => {
          const pill = confidenceToPill(a.confidence);
          return (
            <div key={a.id} className="rounded-2xl glass-card card-hover border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <p className="text-[11px] text-ehb-textMuted mt-1 leading-relaxed">{typeToLabel(a.type)}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] border ${pill.className}`}>
                  {pill.label}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-[11px] text-ehb-textBody">
                <div>
                  <span className="text-white font-semibold">Reason:</span> {a.reason}
                </div>
                <div>
                  <span className="text-white font-semibold">Impact:</span> {a.impact}
                </div>
                <div className="text-ehb-textMuted">
                  Recommended for: {a.recommendedFor.city} · {a.recommendedFor.industrySlug}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#22b14c] px-4 py-2 text-[11px] font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
                  onClick={() => {
                    setAppliedActionId(a.id);
                    setMessage(`Confirmed action: ${a.title}. (Mock) Later backend will trigger Phase 84 action handlers.`);
                  }}
                >
                  Confirm Action
                </button>
                <Link
                  href="/dashboard/services/new"
                  className="min-h-touch inline-flex items-center justify-center rounded-full glass-panel px-4 py-2 text-[11px] font-semibold text-ehb-textBody border border-white/10 hover:bg-white/5 transition-all"
                >
                  Open Service Creator
                </Link>
              </div>
            </div>
          );
        })}

        {suggestions.length === 0 ? (
          <div className="rounded-2xl glass-card border p-6 text-center text-[11px] text-ehb-textMuted lg:col-span-2">
            No suggested actions for this city + industry (mock dataset). Try another selection.
          </div>
        ) : null}
      </section>
    </div>
  );
}

