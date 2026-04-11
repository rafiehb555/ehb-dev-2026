"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { KpiCard } from "@/components/ui/KpiCard";
import { INDUSTRIES, type Industry } from "@/lib/industry/config";

type FranchiseLevel = "Country" | "Corporate" | "Master" | "Sub";

export function DmoFranchiseDashboard({
  level,
  locationLabel,
  initialIndustrySlug = "it",
  locationQs = "",
}: {
  level: FranchiseLevel;
  locationLabel?: string;
  initialIndustrySlug?: string;
  locationQs?: string;
}) {
  const [industrySlug, setIndustrySlug] = useState(initialIndustrySlug);

  const industry: Industry | undefined = useMemo(() => INDUSTRIES.find((i) => i.slug === industrySlug), [industrySlug]);
  const accent = industry?.accentColor ?? "#33C3FF";

  const mock = useMemo(() => {
    const t = industrySlug.trim().length;
    const base = level === "Country" ? 1800 : level === "Corporate" ? 920 : level === "Master" ? 640 : 310;
    const pending = (t % 7) + (level === "Sub" ? 2 : 0);
    const activeProviders = Math.max(3, Math.round((base / 90) * (0.6 + (t % 10) / 30)));
    const revenue = base + 120 * (t % 6);
    const stlCompliance = Math.min(99, 72 + (t % 18));
    return { pending, activeProviders, revenue, stlCompliance };
  }, [industrySlug, level]);

  const levelMeta = useMemo(() => {
    if (level === "Country") return { title: "Country Franchise Dashboard", accent: "#33C3FF", action: "Route approvals" };
    if (level === "Corporate") return { title: "Corporate Franchise Dashboard", accent: "#3b82f6", action: "Manage corporate batch" };
    if (level === "Master") return { title: "Master Franchise Dashboard", accent: "#22b14c", action: "Monitor master-region" };
    return { title: "Sub Franchise Dashboard", accent: "#f59e0b", action: "Handle local onboarding" };
  }, [level]);

  return (
    <div className="space-y-6">
      <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">{levelMeta.title}</h2>
            <p className="text-[10px] text-ehb-textMuted">
              Same design for all franchise levels. Data changes with selected industry and location context. (UI mock)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[10px] text-ehb-textMuted">Industry</label>
            <select
              value={industrySlug}
              onChange={(e) => setIndustrySlug(e.target.value)}
              className="h-9 rounded-xl glass-panel border border-white/10 px-3 text-[11px] text-white focus:outline-none"
            >
              {INDUSTRIES.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name}
                </option>
              ))}
            </select>

            <Link
              href={`/dmo/applications${locationQs}${locationQs.includes("?") ? "&" : "?"}industry=${encodeURIComponent(industrySlug)}`}
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#3b82f6] px-4 py-2 text-[11px] font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
            >
              Open Queue
            </Link>
          </div>
        </div>

        {locationLabel ? (
          <div
            className="inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1 text-[11px] text-ehb-textBody border"
            style={{ borderColor: `${accent}55`, boxShadow: `0 0 28px ${accent}22` }}
          >
            <span aria-hidden>📍</span>
            <span>
              Near you: <span className="text-white font-semibold">{locationLabel}</span>
            </span>
          </div>
        ) : null}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pending Approvals" value={mock.pending} detail="Queue entries awaiting officer action" />
        <KpiCard label="Active Providers" value={mock.activeProviders} detail="Verified providers under this level" />
        <KpiCard label="Revenue (mock)" value={`$${mock.revenue.toLocaleString()}`} detail="Derived from approved service drafts" />
        <KpiCard label="STL Compliance" value={`${mock.stlCompliance}%`} detail="Trust-adjusted approval readiness" />
      </section>

      <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Actions</h3>
            <p className="text-[10px] text-ehb-textMuted">
              Later backend will connect to DMO workflow and wallet escrow.
            </p>
          </div>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 border border-white/10 bg-white/5 text-[10px] text-ehb-textBody"
            style={{ borderColor: `${levelMeta.accent}55` }}
          >
            {levelMeta.action}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Review applicants", desc: "Check New → In Review queue for this context (mock)." },
            { title: "Escalate exceptions", desc: "Flag high risk items for manual STL review (mock)." },
            { title: "Report analytics", desc: "Generate AI business analytics report later (mock)." },
            { title: "Update availability", desc: "Mark onboarding window for providers in this region (mock)." },
            { title: "Route trust signals", desc: "Ensure STL engine uses correct policy (mock)." },
            { title: "Manage franchise batch", desc: "Coordinate provider batches for approvals (mock)." },
          ].map((a) => (
            <div key={a.title} className="rounded-2xl glass-card border p-5 card-hover">
              <p className="text-sm font-semibold text-white">{a.title}</p>
              <p className="text-[11px] text-ehb-textBody mt-1 leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

