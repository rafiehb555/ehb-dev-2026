"use client";

/**
 * Complaints — Phase 3 Operations rebuild (2026-04-12).
 *
 * Design system compliance:
 *   - VerificationUI primitives only (no local KpiCard, no <table>)
 *   - Gradient accent bars + corner decorations
 *   - Drill-in drawer per complaint with penalty ladder + STL impact
 *   - Severity filter chips + status filter chips
 *   - SeverityMeter for complaint severity distribution
 *
 * Prototype-only.
 */

import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  SeverityMeter,
  STLBadge,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

/* ================================================================== */
/* Types + demo data                                                   */
/* ================================================================== */

type ComplaintSeverity = "low" | "medium" | "high" | "critical";
type ComplaintStatus = "new" | "investigating" | "penalty" | "resolved" | "appealed";

type Complaint = {
  id: string;
  subject: string;
  body: string;
  againstSeller: string;
  sellerStl: number;
  industry: string;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  filedBy: string;
  filedAt: string;
  penaltyStep?: 1 | 2 | 3 | 4;
  stlImpact: number; // negative score delta
};

const DEMO: Complaint[] = [
  {
    id: "CX-7741",
    subject: "Counterfeit product delivered",
    body: "Product received was a counterfeit — serial number doesn't match the brand database. Packaging inconsistent with manufacturer.",
    againstSeller: "KarachiKart (GoSellr)",
    sellerStl: 5,
    industry: "E-commerce",
    severity: "critical",
    status: "investigating",
    filedBy: "sara.k@example.com",
    filedAt: "2026-04-11T08:40:00Z",
    penaltyStep: 3,
    stlImpact: -12,
  },
  {
    id: "CX-7740",
    subject: "Legal contract missed deadline",
    body: "Signed agreement required filing by 2026-04-08. Firm filed on 2026-04-11 without notification.",
    againstSeller: "OLS Lahore · Ali Legal",
    sellerStl: 7,
    industry: "Legal",
    severity: "high",
    status: "penalty",
    filedBy: "hassan@company.pk",
    filedAt: "2026-04-11T07:12:00Z",
    penaltyStep: 2,
    stlImpact: -8,
  },
  {
    id: "CX-7739",
    subject: "Travel itinerary changed silently",
    body: "Flight was moved 4 hours later without any notification to the customer. Missed connecting transportation.",
    againstSeller: "AGTS Skyline",
    sellerStl: 6,
    industry: "Travel",
    severity: "medium",
    status: "new",
    filedBy: "zainab.t@example.com",
    filedAt: "2026-04-11T06:30:00Z",
    stlImpact: -4,
  },
  {
    id: "CX-7738",
    subject: "Medical prescription wrong dosage",
    body: "Clinic issued a prescription with dose 2× standard for patient's weight. Caught by pharmacy before dispensing.",
    againstSeller: "WMS Clinic 22",
    sellerStl: 4,
    industry: "Medical",
    severity: "critical",
    status: "penalty",
    filedBy: "family@example.com",
    filedAt: "2026-04-10T22:40:00Z",
    penaltyStep: 4,
    stlImpact: -18,
  },
  {
    id: "CX-7737",
    subject: "Tutor didn't show up",
    body: "Scheduled session at 5pm, tutor marked absent without prior notice. Refund issued.",
    againstSeller: "HPS Tutor · Maria K",
    sellerStl: 3,
    industry: "Education",
    severity: "low",
    status: "resolved",
    filedBy: "parent@example.com",
    filedAt: "2026-04-10T19:50:00Z",
    penaltyStep: 1,
    stlImpact: -2,
  },
  {
    id: "CX-7736",
    subject: "Appeal: fine revision requested",
    body: "Requesting review of the $400 fine — claim there was no service failure. Submitting evidence docs.",
    againstSeller: "OLS Lahore · Ali Legal",
    sellerStl: 7,
    industry: "Legal",
    severity: "high",
    status: "appealed",
    filedBy: "ali.legal@ols.pk",
    filedAt: "2026-04-10T14:22:00Z",
    penaltyStep: 2,
    stlImpact: -6,
  },
];

type LadderStep = {
  step: 1 | 2 | 3 | 4;
  label: string;
  scope: string;
  icon: React.ReactNode;
  tone: VerificationTone;
};

const PENALTY_LADDER: LadderStep[] = [
  { step: 1, label: "Warning",         scope: "First offense, low severity",     icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, tone: "amber" },
  { step: 2, label: "Fine (USD)",      scope: "Repeat or medium severity",       icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, tone: "amber" },
  { step: 3, label: "Temporary lock",  scope: "High severity · 7-30 days",      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, tone: "red" },
  { step: 4, label: "Account ban",     scope: "Critical · STL reset to L1 FREE", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>, tone: "red" },
];

/* ================================================================== */
/* Helpers                                                             */
/* ================================================================== */

function severityTone(s: ComplaintSeverity): VerificationTone {
  switch (s) {
    case "low":      return "green";
    case "medium":   return "amber";
    case "high":     return "red";
    case "critical": return "red";
  }
}

function statusTone(s: ComplaintStatus): VerificationTone {
  switch (s) {
    case "new":           return "purple";
    case "investigating": return "cyan";
    case "penalty":       return "red";
    case "resolved":      return "green";
    case "appealed":      return "amber";
  }
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

type StatusFilter = "ALL" | ComplaintStatus;

export default function ComplaintsPage() {
  const [rows] = useState<Complaint[]>(DEMO);
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [statDrawer, setStatDrawer] = useState<
    null | "open" | "penalty" | "appeals" | "resolved"
  >(null);

  const stats = useMemo(() => {
    const open = rows.filter((r) => r.status === "new" || r.status === "investigating").length;
    const penalty = rows.filter((r) => r.status === "penalty").length;
    const appeals = rows.filter((r) => r.status === "appealed").length;
    const resolved = rows.filter((r) => r.status === "resolved").length;
    return { open, penalty, appeals, resolved };
  }, [rows]);

  const severityBreakdown = useMemo(
    () => ({
      low:      rows.filter((r) => r.severity === "low").length,
      medium:   rows.filter((r) => r.severity === "medium").length,
      high:     rows.filter((r) => r.severity === "high").length,
      critical: rows.filter((r) => r.severity === "critical").length,
    }),
    [rows]
  );

  const visible = useMemo(
    () => (status === "ALL" ? rows : rows.filter((r) => r.status === status)),
    [rows, status]
  );

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-2xl border border-[rgba(240,88,88,0.35)] bg-gradient-to-br from-[rgba(240,88,88,0.14)] via-[rgba(19,22,42,0.92)] to-[rgba(240,160,48,0.10)] p-6"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #F05858 30%, #F0A030 70%, transparent 100%)",
            boxShadow: "0 0 16px #F05858",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 h-4 w-4 opacity-60 border-l-[1.5px] border-t-[1.5px] border-[#F05858] rounded-tl-[4px]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 opacity-60 border-r-[1.5px] border-b-[1.5px] border-[#F0A030] rounded-br-[4px]"
        />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F05858]/22 via-[#F0A030]/15 to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F05858]">Complaints</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Complaints</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Customer complaints queue, canonical penalty ladder, aur appeals workflow.
              Directly feeds the Anti-Fraud MIN rule on STL — ek bhi serious complaint seller
              ke trust score ko pulldown kar sakti hai.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dmo/stl"
              className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A098F8] transition-colors hover:border-[#7B6EF6]/80 hover:bg-[#7B6EF6]/25 hover:text-white"
            >
              STL impact
            </Link>
            <Link
              href="/dmo/up-guard"
              className="rounded-xl border border-[#F0A030]/50 bg-[#F0A030]/15 px-3 py-1.5 text-xs font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/80 hover:bg-[#F0A030]/25 hover:text-white"
            >
              Up-Guard
            </Link>
          </div>
        </div>
      </section>

      {/* KPI stats */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" /></svg>}
          label="Open complaints"
          value={stats.open}
          sub="New + investigating"
          onClick={() => setStatDrawer("open")}
        />
        <VerificationStatCard
          tone="red"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M4.93 4.93l14.14 14.14" stroke="currentColor" strokeWidth="1.5" /></svg>}
          label="Under penalty"
          value={stats.penalty}
          sub="Active sanctions"
          onClick={() => setStatDrawer("penalty")}
        />
        <VerificationStatCard
          tone="amber"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3v3m6.36.64l-2.12 2.12M21 12h-3M18.36 18.36l-2.12-2.12M12 21v-3M7.76 18.36l-2.12-2.12M3 12h3M5.64 5.64l2.12 2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Appeals"
          value={stats.appeals}
          sub="Awaiting review"
          onClick={() => setStatDrawer("appeals")}
        />
        <VerificationStatCard
          tone="green"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.5" /><polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          label="Resolved (MTD)"
          value={stats.resolved}
          sub="Closed this month"
          onClick={() => setStatDrawer("resolved")}
        />
      </section>

      {/* Two-col: Penalty ladder (left) + Severity meter (right) */}
      <section className="grid gap-4 xl:grid-cols-3">
        {/* Penalty ladder */}
        <div
          className="relative overflow-hidden rounded-2xl border border-[#F0A030]/25 bg-[#13162A]/70 p-5 xl:col-span-2 backdrop-blur-sm"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, #F0A030 0%, #F0A030 30%, #F05858 60%, #F05858 100%)",
              boxShadow: "0 0 10px #F0A030",
            }}
          />
          <SectionHeader
            eyebrow="Operations · Penalty Ladder"
            title="Canonical escalation"
            hint="warn → fine → lock → ban · each step auto-applies an STL score penalty."
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PENALTY_LADDER.map((p) => {
              const TONE_FG =
                p.tone === "red" ? "#F05858" : p.tone === "amber" ? "#F0A030" : "#A098F8";
              return (
                <div
                  key={p.step}
                  className="group relative overflow-hidden rounded-xl border bg-[#1A1D33]/75 p-3 transition-all duration-300 hover:-translate-y-[2px]"
                  style={{ borderColor: `${TONE_FG}44` }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${TONE_FG}55`;
                    (e.currentTarget as HTMLDivElement).style.borderColor = TONE_FG;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${TONE_FG}44`;
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
                    style={{ background: TONE_FG, boxShadow: `0 0 10px ${TONE_FG}` }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/12 bg-white/[0.04] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/60">
                      Step {p.step}
                    </span>
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black"
                      style={{ color: TONE_FG, background: `${TONE_FG}22`, filter: `drop-shadow(0 0 8px ${TONE_FG})` }}
                    >
                      {p.icon}
                    </span>
                  </div>
                  <p
                    className="mt-2 text-sm font-bold"
                    style={{ color: TONE_FG, textShadow: `0 0 10px ${TONE_FG}55` }}
                  >
                    {p.label}
                  </p>
                  <p className="mt-1 text-[10px] text-white/55">{p.scope}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity meter */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-sm"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, #38C878 0%, #F0A030 40%, #F05858 100%)",
              boxShadow: "0 0 10px #F05858",
            }}
          />
          <SectionHeader
            eyebrow="Complaints · Severity"
            title="Breakdown"
            hint="Distribution of open complaints by severity."
          />
          <div className="mt-3">
            <SeverityMeter
              segments={[
                { label: "Low",      value: severityBreakdown.low,      tone: "green" },
                { label: "Medium",   value: severityBreakdown.medium,   tone: "amber" },
                { label: "High",     value: severityBreakdown.high,     tone: "red" },
                { label: "Critical", value: severityBreakdown.critical, tone: "red" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Complaints queue row grid */}
      <section>
        <SectionHeader
          eyebrow="Complaints · Queue"
          title="Complaints queue"
          hint="Click any row to drill into the body, penalty step, and STL impact."
          right={
            <FilterChipRow<StatusFilter>
              value={status}
              onChange={setStatus}
              options={[
                { value: "ALL",           label: `ALL · ${rows.length}` },
                { value: "new",           label: "New" },
                { value: "investigating", label: "Investigating" },
                { value: "penalty",       label: "Penalty" },
                { value: "resolved",      label: "Resolved" },
                { value: "appealed",      label: "Appealed" },
              ]}
            />
          }
        />
        <VerificationRowGrid<Complaint>
          rows={visible}
          columns={complaintColumns}
          onRowClick={(r) => setSelected(r)}
          getRowTone={(r) =>
            r.severity === "critical" ? "red" : r.severity === "high" ? "red" : r.severity === "medium" ? "amber" : undefined
          }
          emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6"><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" stroke="currentColor" strokeWidth="1.4" /><path d="M3 7l9 4 9-4M12 21V11" stroke="currentColor" strokeWidth="1.4" /></svg>}
          emptyTitle="No complaints in this bucket"
          emptyHint="Switch filter to ALL."
        />
      </section>

      {/* Complaint drill-in drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? selected.subject : ""}
        subtitle={selected ? `${selected.id} · ${selected.industry}` : undefined}
        severity={
          selected?.severity === "critical"
            ? "critical"
            : selected?.severity === "high"
            ? "high"
            : selected?.severity === "medium"
            ? "warning"
            : "info"
        }
      >
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <VerificationChip tone={severityTone(selected.severity)}>
                {selected.severity}
              </VerificationChip>
              <VerificationChip tone={statusTone(selected.status)}>
                {selected.status}
              </VerificationChip>
              {selected.penaltyStep ? (
                <VerificationChip tone={PENALTY_LADDER[selected.penaltyStep - 1]!.tone}>
                  {PENALTY_LADDER[selected.penaltyStep - 1]!.icon} Step{" "}
                  {selected.penaltyStep} · {PENALTY_LADDER[selected.penaltyStep - 1]!.label}
                </VerificationChip>
              ) : null}
            </div>

            {/* Body */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Complaint body
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/85">
                {selected.body}
              </p>
            </div>

            {/* Seller + STL impact */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Against seller
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">
                    {selected.againstSeller}
                  </p>
                  <p className="text-[10px] text-white/45">{selected.industry}</p>
                </div>
                <STLBadge level={selected.sellerStl} size="sm" />
              </div>
              <div className="mt-3 border-t border-white/8 pt-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  STL impact
                </p>
                <p className="mt-1 font-mono text-xl font-black tabular-nums text-[#F05858]">
                  {selected.stlImpact} pts
                </p>
                <p className="text-[10px] text-white/45">
                  Applied immediately against seller STL score. Anti-fraud MIN rule may
                  cascade to dependent entities (product / company / owner).
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Filed by" value={selected.filedBy} mono />
              <InfoCell label="Filed at" value={fmtTime(selected.filedAt)} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-xl border border-[#38C878]/45 bg-[#38C878]/15 px-3 py-1.5 text-[11px] font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/25 hover:text-white"
              >
                Mark resolved
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F0A030]/45 bg-[#F0A030]/15 px-3 py-1.5 text-[11px] font-semibold text-[#F0A030] transition-colors hover:bg-[#F0A030]/25 hover:text-white"
              >
                Open appeal
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F05858]/45 bg-[#F05858]/15 px-3 py-1.5 text-[11px] font-semibold text-[#F05858] transition-colors hover:bg-[#F05858]/25 hover:text-white"
              >
                Escalate penalty
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Stat drawer */}
      <VerificationDrawer
        open={!!statDrawer}
        onClose={() => setStatDrawer(null)}
        title={
          statDrawer === "open"
            ? "Open complaints · drill-in"
            : statDrawer === "penalty"
            ? "Sellers under penalty"
            : statDrawer === "appeals"
            ? "Appeals awaiting review"
            : statDrawer === "resolved"
            ? "Resolved complaints (MTD)"
            : ""
        }
      >
        {statDrawer ? (
          <div className="space-y-2">
            {rows
              .filter((r) => {
                if (statDrawer === "open") return r.status === "new" || r.status === "investigating";
                if (statDrawer === "penalty") return r.status === "penalty";
                if (statDrawer === "appeals") return r.status === "appealed";
                if (statDrawer === "resolved") return r.status === "resolved";
                return false;
              })
              .map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">{r.subject}</p>
                    <p className="text-[10px] text-white/45">{r.againstSeller}</p>
                  </div>
                  <VerificationChip tone={severityTone(r.severity)} size="xs">
                    {r.severity}
                  </VerificationChip>
                </div>
              ))}
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}

/* ================================================================== */
/* Local helpers                                                       */
/* ================================================================== */

function InfoCell({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
        {label}
      </p>
      <p className={`mt-1 text-sm font-semibold text-white ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

/* ---------- Row columns ---------- */
const complaintColumns: RowColumn<Complaint>[] = [
  {
    key: "subject",
    header: "Complaint",
    width: "minmax(0,2.2fr)",
    render: (r) => (
      <div className="min-w-0">
        <div className="font-mono text-[10px] text-white/45">{r.id}</div>
        <div className="truncate font-semibold text-white">{r.subject}</div>
        <div className="truncate text-[10px] text-white/45">by {r.filedBy}</div>
      </div>
    ),
  },
  {
    key: "seller",
    header: "Against",
    width: "minmax(0,1.4fr)",
    render: (r) => (
      <div className="min-w-0">
        <div className="truncate text-xs text-white/85">{r.againstSeller}</div>
        <div className="text-[10px] text-white/45">{r.industry}</div>
      </div>
    ),
  },
  {
    key: "severity",
    header: "Severity",
    width: "minmax(0,0.75fr)",
    render: (r) => (
      <VerificationChip tone={severityTone(r.severity)} size="xs">
        {r.severity}
      </VerificationChip>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "minmax(0,0.85fr)",
    render: (r) => (
      <VerificationChip tone={statusTone(r.status)} size="xs">
        {r.status}
      </VerificationChip>
    ),
  },
  {
    key: "filed",
    header: "Filed",
    width: "minmax(0,0.9fr)",
    align: "right",
    render: (r) => (
      <span className="text-[10px] text-white/45">{fmtTime(r.filedAt)}</span>
    ),
  },
];
