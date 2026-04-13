"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { KpiCard } from "@/components/ui/KpiCard";
import { INDUSTRIES } from "@/lib/industry/config";

type CountryRow = { id: string; name: string; activeFranchises: number; pendingApprovals: number; accent: string };

const COUNTRIES: CountryRow[] = [
  { id: "PK-PUNJAB", name: "Pakistan · Punjab", activeFranchises: 18, pendingApprovals: 9, accent: "#33C3FF" },
  { id: "PK-SINDH", name: "Pakistan · Sindh", activeFranchises: 12, pendingApprovals: 6, accent: "#3b82f6" },
  { id: "PK-ISLAM", name: "Pakistan · Islamabad", activeFranchises: 9, pendingApprovals: 4, accent: "#22b14c" },
  { id: "UAE-DXB", name: "UAE · Dubai", activeFranchises: 7, pendingApprovals: 3, accent: "#f59e0b" },
];

export function DmoSuperAdminPanel() {
  const [industrySlug, setIndustrySlug] = useState<string>("it");

  const industry = useMemo(() => INDUSTRIES.find((i) => i.slug === industrySlug), [industrySlug]);

  const accent = industry?.accentColor ?? "#33C3FF";

  const summary = useMemo(() => {
    // Mock: simple deterministic-ish numbers based on industrySlug length.
    const t = industrySlug.trim().length;
    return {
      pending: COUNTRIES.reduce((s, c) => s + c.pendingApprovals, 0) + (t % 3),
      active: COUNTRIES.reduce((s, c) => s + c.activeFranchises, 0),
      risk: Math.min(92, 58 + t * 0.8),
      opsMode: "Global DMO Ops (mock)",
    };
  }, [industrySlug]);

  return (
    <div className="space-y-6">
      <section className="bg-white/[0.04] hover:bg-white/[0.06] transition-colors p-4 space-y-3 border border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">Super Admin · Global DMO Operations</h2>
            <p className="text-[10px] text-white/50">
              EHB head office controls: queue routing, STL thresholds, approval consistency. (UI mock)
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <label className="text-[10px] text-white/50">Industry</label>
            <select
              value={industrySlug}
              onChange={(e) => setIndustrySlug(e.target.value)}
              className="h-9 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-[11px] text-white focus:outline-none"
            >
              {INDUSTRIES.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name}
                </option>
              ))}
            </select>

            <Link
              href={`/dmo/applications${industrySlug ? `?industry=${encodeURIComponent(industrySlug)}` : ""}`}
              className="min-h-[44px] inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#3b82f6] px-4 py-2 text-[11px] font-semibold text-slate-950 shadow-lg hover:opacity-95 transition-all"
            >
              Open Workflow Queue
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pending Approvals" value={summary.pending} detail="Across all countries (mock)" />
        <KpiCard label="Active Franchises" value={summary.active} detail="Global coverage (mock)" />
        <KpiCard label="Risk Load (STL blend)" value={`${Math.round(summary.risk)}/100`} detail="Fraud + trust consistency (mock)" />
        <KpiCard label="Operations Mode" value={summary.opsMode} detail={`Industry accent: ${accent}`} />
      </section>

      <section className="bg-white/[0.04] hover:bg-white/[0.06] transition-colors p-4 space-y-3 border border-white/5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Country-wise DMO Activity</h3>
            <p className="text-[10px] text-white/50">To be connected with Phase 72–85 data pipeline later.</p>
          </div>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 border border-white/10 bg-white/5 text-[10px] text-white/70"
            style={{ borderColor: `${accent}55` }}
          >
            Global view
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[760px] space-y-2">
            <div className="grid grid-cols-12 text-[10px] text-white/50 px-2">
              <div className="col-span-4">Region</div>
              <div className="col-span-3">Active Franchises</div>
              <div className="col-span-2">Pending Approvals</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {COUNTRIES.map((c) => (
              <div key={c.id} className="grid grid-cols-12 items-center rounded-2xl bg-white/[0.03] border p-3 hover:bg-white/[0.06] transition-colors">
                <div className="col-span-4 min-w-0">
                  <div className="text-[11px] font-semibold text-white truncate">{c.name}</div>
                  <div className="text-[10px] text-white/50 truncate mt-0.5">Accent: {c.accent}</div>
                </div>
                <div className="col-span-3 text-[11px] text-white/70 font-semibold">{c.activeFranchises}</div>
                <div className="col-span-2 text-[11px] text-white/70 font-semibold">{c.pendingApprovals}</div>
                <div className="col-span-3 flex items-center justify-end gap-2">
                  <Link
                    href={`/dmo/applications?country=${encodeURIComponent(c.id.includes("PK-") ? "PK" : "UAE")}&industry=${encodeURIComponent(industrySlug)}`}
                    className="h-9 rounded-xl bg-white/[0.04] border border-white/10 px-3 text-[11px] text-white/70 hover:bg-white/5 transition-all inline-flex items-center justify-center"
                  >
                    Route queue
                  </Link>
                  <button
                    type="button"
                    className="h-9 rounded-xl bg-white/5 border border-white/10 px-3 text-[11px] text-white/70 hover:bg-white/10 transition-all inline-flex items-center justify-center"
                    onClick={() => window.alert(`Mock: updated routing policy for ${c.name} (later: backend)`) }
                  >
                    Adjust policy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

