"use client";

/**
 * Up-Guard Monitoring — Phase 2.4 rebuild (2026-04-12).
 *
 * Continuous monitoring layer across STL / PSS / CRB signals. Silent drift
 * detection, anomaly feed, kill-switch UI, and operator triage queue.
 *
 * Prototype-only per Rafi's current UI/UX-first plan (no backend wiring).
 *
 * Canonical spec:
 *   ehb-info/departments/DMO.md §4.4 monitoring layer
 *   design-system/EHB-UIUX-SYSTEM.md §7.1–§7.12
 *   design-system/ai-behavior.md §2 auto-upgrade · §10 forbidden list
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type GuardModule = "STL" | "PSS" | "CRB";
type Severity = "low" | "medium" | "high" | "critical";
type GuardStatus = "new" | "triage" | "investigating" | "resolved";

type UpGuardIncident = {
  id: string;
  module: GuardModule;
  severity: Severity;
  summary: string;
  detail: string;
  detectedAt: string;
  status: GuardStatus;
  affected: number;
  signal: string;
};

type AnomalyPulse = {
  id: string;
  ts: string;
  module: GuardModule;
  delta: string;
  severity: Severity;
  text: string;
};

/* ------------------------------------------------------------------ */
/* Demo data                                                           */
/* ------------------------------------------------------------------ */

const DEMO_INCIDENTS: UpGuardIncident[] = [
  {
    id: "UG-8821",
    module: "STL",
    severity: "high",
    summary: "Owner-level score drop (L7 → L5) on GoSellr seller cluster",
    detail:
      "14 sellers in the 'electronics-karachi' cluster ka owner-STL 12 ghantey mein 2 levels gir gaya. MIN-rule ke wajah se product listings automatically L5 cap par aa gayi hain.",
    detectedAt: "2026-04-11T08:12:00Z",
    status: "investigating",
    affected: 14,
    signal: "stl.owner.drop > 2L (12h window)",
  },
  {
    id: "UG-8820",
    module: "PSS",
    severity: "critical",
    summary: "Liveness false-positive spike on AGTS onboarding flow",
    detail:
      "AGTS travel module ke onboarding flow per pichle ghantey mein 38% liveness false-positive rate detect hui — baseline 4% ka hai. Anti-spoof module rollback candidate.",
    detectedAt: "2026-04-11T07:55:00Z",
    status: "triage",
    affected: 217,
    signal: "pss.liveness.fpr > 10x baseline",
  },
  {
    id: "UG-8818",
    module: "CRB",
    severity: "medium",
    summary: "3 inspections stuck > 72h — Karachi franchise",
    detail:
      "Karachi franchise ke 3 physical inspections 72 ghantey se zyada pending hain. Inspector bandwidth issue ya DMO escalation required.",
    detectedAt: "2026-04-11T06:41:00Z",
    status: "new",
    affected: 3,
    signal: "crb.inspection.ttr > 72h",
  },
  {
    id: "UG-8815",
    module: "STL",
    severity: "low",
    summary: "Rolling 7d drift of -0.4 on OLS legal services",
    detail:
      "OLS legal services bucket ke rolling 7-day STL average mein -0.4 drift. Warning band (-0.3 to -0.5). Auto-penalty trigger nahi hua, monitoring on.",
    detectedAt: "2026-04-10T22:15:00Z",
    status: "resolved",
    affected: 62,
    signal: "stl.bucket.drift.7d > 0.3",
  },
  {
    id: "UG-8812",
    module: "PSS",
    severity: "high",
    summary: "AML watchlist hit rate 3x baseline on Punjab users",
    detail:
      "Pichle 24 ghantey mein Punjab region ke new onboardings par AML watchlist hit rate 0.9% → 2.7% tak pohnch gaya. PSS deep-review escalation.",
    detectedAt: "2026-04-10T18:05:00Z",
    status: "investigating",
    affected: 44,
    signal: "pss.aml.hit.rate > 2.5x",
  },
];

const DEMO_PULSES: AnomalyPulse[] = [
  {
    id: "P-001",
    ts: "2026-04-11T08:14:00Z",
    module: "STL",
    delta: "-2L",
    severity: "high",
    text: "Cluster electronics-karachi drop detected",
  },
  {
    id: "P-002",
    ts: "2026-04-11T08:02:00Z",
    module: "PSS",
    delta: "+34%",
    severity: "critical",
    text: "Liveness FPR spike on AGTS",
  },
  {
    id: "P-003",
    ts: "2026-04-11T07:31:00Z",
    module: "CRB",
    delta: "3 cases",
    severity: "medium",
    text: "Karachi inspections SLA breach",
  },
  {
    id: "P-004",
    ts: "2026-04-11T06:58:00Z",
    module: "STL",
    delta: "-0.4",
    severity: "low",
    text: "OLS drift settled",
  },
  {
    id: "P-005",
    ts: "2026-04-11T05:12:00Z",
    module: "PSS",
    delta: "+1.8%",
    severity: "high",
    text: "AML hits trending up",
  },
  {
    id: "P-006",
    ts: "2026-04-11T04:42:00Z",
    module: "STL",
    delta: "+0.2",
    severity: "low",
    text: "GoSellr average score recovering",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function fmtRelative(iso: string) {
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return iso;
  const diff = Date.now() - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function severityTone(sev: Severity): VerificationTone {
  switch (sev) {
    case "critical":
      return "red";
    case "high":
      return "red";
    case "medium":
      return "amber";
    case "low":
      return "teal";
  }
}

function moduleTone(mod: GuardModule): VerificationTone {
  switch (mod) {
    case "STL":
      return "purple";
    case "PSS":
      return "teal";
    case "CRB":
      return "cyan";
  }
}

function statusTone(st: GuardStatus): VerificationTone {
  switch (st) {
    case "new":
      return "purple";
    case "triage":
      return "amber";
    case "investigating":
      return "cyan";
    case "resolved":
      return "green";
  }
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function UpGuardPage() {
  const [incidents] = useState<UpGuardIncident[]>(DEMO_INCIDENTS);
  const [pulses] = useState<AnomalyPulse[]>(DEMO_PULSES);
  const [filter, setFilter] = useState<"ALL" | GuardStatus>("ALL");
  const [selected, setSelected] = useState<UpGuardIncident | null>(null);
  const [statDrawer, setStatDrawer] = useState<
    null | "critical" | "high" | "open" | "tracked"
  >(null);
  const [killSwitch, setKillSwitch] = useState<
    Record<GuardModule, boolean>
  >({ STL: false, PSS: false, CRB: false });
  const [confirmKill, setConfirmKill] = useState<GuardModule | null>(null);

  const stats = useMemo(() => {
    const critical = incidents.filter((i) => i.severity === "critical").length;
    const high = incidents.filter((i) => i.severity === "high").length;
    const openTotal = incidents.filter((i) => i.status !== "resolved").length;
    return { critical, high, openTotal, all: incidents.length };
  }, [incidents]);

  const moduleBreakdown = useMemo(() => {
    const by: Record<GuardModule, number> = { STL: 0, PSS: 0, CRB: 0 };
    for (const i of incidents) by[i.module] += 1;
    return by;
  }, [incidents]);

  const severityBreakdown = useMemo(() => {
    const by: Record<Severity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    for (const i of incidents) by[i.severity] += 1;
    return by;
  }, [incidents]);

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? incidents
        : incidents.filter((i) => i.status === filter),
    [incidents, filter]
  );

  function toggleKill(m: GuardModule) {
    setKillSwitch((prev) => ({ ...prev, [m]: !prev[m] }));
    setConfirmKill(null);
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-[#F05858]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F05858]/20 via-[#F0A030]/15 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-gradient-to-br from-[#7B6EF6]/15 via-cyan-500/10 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F05858]">Up-Guard</span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F05858]">
              Verification · Up-Guard Engine
            </p>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Up-Guard Monitoring
            </h1>
            <p className="max-w-2xl text-sm text-white/65">
              Continuous monitoring layer jo STL / PSS / CRB ke signals pa
              silent drifts aur anomalies detect karta hai. Incidents DMO
              operators ke paas route hoti hain before they become penalties.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl border border-[#F05858]/50 bg-[#F05858]/15 px-3 py-1.5 text-xs font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/80 hover:bg-[#F05858]/25 hover:text-white"
            >
              Run fresh scan
            </button>
          </div>
        </div>
      </header>

      {/* 4 KPI stats — clickable with icons */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="red"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" /><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Critical"
          value={stats.critical}
          sub="Needs immediate attention"
          onClick={() => setStatDrawer("critical")}
        />
        <VerificationStatCard
          tone="amber"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="High severity"
          value={stats.high}
          sub="Escalate within 4h"
          onClick={() => setStatDrawer("high")}
        />
        <VerificationStatCard
          tone="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" /></svg>}
          label="Open incidents"
          value={stats.openTotal}
          sub="New · triage · investigating"
          onClick={() => setStatDrawer("open")}
        />
        <VerificationStatCard
          tone="teal"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Tracked (24h)"
          value={stats.all}
          sub="All anomalies detected"
          onClick={() => setStatDrawer("tracked")}
        />
      </section>

      {/* Module & severity breakdown + anomaly pulse feed */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* Module severity breakdown */}
        <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
          <SectionHeader
            eyebrow="Signal Health"
            title="Module severity breakdown"
            hint="Live incident density across STL / PSS / CRB"
          />
          <div className="space-y-4">
            <SeverityMeter
              segments={[
                {
                  label: "Critical",
                  value: severityBreakdown.critical,
                  tone: "red",
                },
                {
                  label: "High",
                  value: severityBreakdown.high,
                  tone: "red",
                },
                {
                  label: "Medium",
                  value: severityBreakdown.medium,
                  tone: "amber",
                },
                { label: "Low", value: severityBreakdown.low, tone: "teal" },
              ]}
            />
            <div className="grid gap-2 sm:grid-cols-3">
              {(["STL", "PSS", "CRB"] as const).map((m) => {
                const count = moduleBreakdown[m];
                const tone = moduleTone(m);
                return (
                  <div
                    key={m}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                    style={{
                      boxShadow: `inset 3px 0 0 0 ${
                        tone === "purple"
                          ? "#7B6EF6"
                          : tone === "teal"
                          ? "#2BBFA0"
                          : "#67E8F9"
                      }`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <VerificationChip tone={tone} size="xs">
                        {m}
                      </VerificationChip>
                      <span className="text-[10px] text-white/45">
                        {count} incidents
                      </span>
                    </div>
                    <p className="mt-2 text-2xl font-black leading-none text-white tabular-nums">
                      {count}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-wider text-white/40">
                      Last 24h
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Anomaly pulse feed */}
        <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
          <SectionHeader
            eyebrow="Live Feed"
            title="Anomaly pulse"
            hint="Rolling detection stream · newest first"
            right={
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#38C878]">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#38C878] shadow-[0_0_8px_#38C878]" />
                live
              </span>
            }
          />
          <div className="max-h-[340px] space-y-2 overflow-y-auto pr-1">
            {pulses.map((p) => {
              const tone = severityTone(p.severity);
              return (
                <div
                  key={p.id}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/25"
                >
                  <span
                    className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{
                      background:
                        tone === "red"
                          ? "#F05858"
                          : tone === "amber"
                          ? "#F0A030"
                          : "#2BBFA0",
                      boxShadow: `0 0 10px ${
                        tone === "red"
                          ? "#F05858"
                          : tone === "amber"
                          ? "#F0A030"
                          : "#2BBFA0"
                      }`,
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <VerificationChip tone={moduleTone(p.module)} size="xs">
                        {p.module}
                      </VerificationChip>
                      <span className="font-mono text-[10px] text-white/55">
                        {p.delta}
                      </span>
                      <span className="ml-auto text-[9px] uppercase tracking-wider text-white/40">
                        {fmtRelative(p.ts)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-white/80">
                      {p.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kill-switch section */}
      <section className="rounded-2xl border border-[#F05858]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-5">
        <SectionHeader
          eyebrow="Emergency Controls"
          title="Module kill-switches"
          hint="Pause a subsystem if anomaly rate exceeds safe bounds. Requires supervisor confirmation."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {(["STL", "PSS", "CRB"] as const).map((m) => {
            const isOn = killSwitch[m];
            const tone = moduleTone(m);
            return (
              <div
                key={m}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                style={{
                  boxShadow: isOn
                    ? `inset 3px 0 0 0 #F05858, 0 0 24px rgba(240,88,88,0.18)`
                    : `inset 3px 0 0 0 ${
                        tone === "purple"
                          ? "#7B6EF6"
                          : tone === "teal"
                          ? "#2BBFA0"
                          : "#67E8F9"
                      }`,
                }}
              >
                <div className="flex items-center justify-between">
                  <VerificationChip tone={tone} size="sm">
                    {m}
                  </VerificationChip>
                  <VerificationChip tone={isOn ? "red" : "green"} size="xs">
                    {isOn ? "paused" : "running"}
                  </VerificationChip>
                </div>
                <p className="mt-3 text-[11px] text-white/55">
                  {isOn
                    ? `${m} module halted. New writes are rejected until resumed.`
                    : `${m} monitoring is active. Click to pause if under attack.`}
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmKill(m)}
                  className={`mt-3 w-full rounded-xl border px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all ${
                    isOn
                      ? "border-[#38C878]/45 bg-[#38C878]/15 text-[#38C878] hover:border-[#38C878]/80 hover:bg-[#38C878]/25 hover:text-white"
                      : "border-[#F05858]/45 bg-[#F05858]/15 text-[#F05858] hover:border-[#F05858]/80 hover:bg-[#F05858]/25 hover:text-white"
                  }`}
                >
                  {isOn ? `Resume ${m}` : `Pause ${m}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Incident queue */}
      <section className="space-y-3">
        <SectionHeader
          eyebrow="Verification · Queue"
          title="Incident queue"
          hint="Module · severity · status · detected. Click any row to triage."
          right={
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
              {visible.length} rows
            </span>
          }
        />

        <div className="flex flex-wrap gap-1.5">
          {(["ALL", "new", "triage", "investigating", "resolved"] as const).map(
            (f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                    active
                      ? "border-[#7B6EF6]/60 bg-[#7B6EF6]/22 text-white shadow-[0_0_16px_rgba(123,110,246,0.35)]"
                      : "border-white/12 bg-white/[0.04] text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {f === "ALL" ? "All" : f}
                </button>
              );
            }
          )}
        </div>

        <VerificationRowGrid<UpGuardIncident>
          rows={visible}
          onRowClick={(row) => setSelected(row)}
          columns={incidentColumns}
          getRowTone={(row) => severityTone(row.severity)}
          emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.4" /></svg>}
          emptyTitle="No incidents in this bucket"
          emptyHint="System is quiet. Up-Guard keeps scanning STL / PSS / CRB signals."
        />
      </section>

      {/* Incident drill-in drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.id} · ${selected.module}` : ""}
        subtitle={selected?.summary}
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
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={moduleTone(selected.module)} size="sm">
                {selected.module}
              </VerificationChip>
              <VerificationChip
                tone={severityTone(selected.severity)}
                size="sm"
              >
                {selected.severity}
              </VerificationChip>
              <VerificationChip tone={statusTone(selected.status)} size="sm">
                {selected.status}
              </VerificationChip>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <InfoRow label="Signal" value={selected.signal} mono />
              <InfoRow label="Affected" value={`${selected.affected} entities`} />
              <InfoRow label="Detected" value={fmtTime(selected.detectedAt)} />
              <InfoRow label="Status" value={selected.status} />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Detail
              </p>
              <p className="text-xs leading-relaxed text-white/80">
                {selected.detail}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-[#7B6EF6]/80 hover:bg-[#7B6EF6]/30"
              >
                Open DMO task
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#2BBFA0]/45 bg-[#2BBFA0]/15 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/80 hover:bg-[#2BBFA0]/25 hover:text-white"
              >
                Mark as triaged
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F05858]/45 bg-[#F05858]/15 px-3 py-1.5 text-xs font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/80 hover:bg-[#F05858]/25 hover:text-white"
              >
                Escalate to L8
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Stat drill-in drawer */}
      <VerificationDrawer
        open={!!statDrawer}
        onClose={() => setStatDrawer(null)}
        title={
          statDrawer === "critical"
            ? "Critical incidents"
            : statDrawer === "high"
            ? "High severity incidents"
            : statDrawer === "open"
            ? "Open incidents"
            : statDrawer === "tracked"
            ? "All tracked (24h)"
            : ""
        }
        severity={
          statDrawer === "critical"
            ? "critical"
            : statDrawer === "high"
            ? "high"
            : "info"
        }
      >
        {statDrawer ? (
          <div className="space-y-4 text-xs text-white/75">
            <SeverityMeter
              segments={[
                { label: "Critical", value: severityBreakdown.critical, tone: "red" },
                { label: "High", value: severityBreakdown.high, tone: "red" },
                { label: "Medium", value: severityBreakdown.medium, tone: "amber" },
                { label: "Low", value: severityBreakdown.low, tone: "teal" },
              ]}
            />
            <div className="grid gap-2">
              {(statDrawer === "critical"
                ? incidents.filter((i) => i.severity === "critical")
                : statDrawer === "high"
                ? incidents.filter((i) => i.severity === "high")
                : statDrawer === "open"
                ? incidents.filter((i) => i.status !== "resolved")
                : incidents
              ).map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => {
                    setStatDrawer(null);
                    setSelected(i);
                  }}
                  className="group flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition-all hover:-translate-y-[1px] hover:border-white/25"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <VerificationChip tone={moduleTone(i.module)} size="xs">
                        {i.module}
                      </VerificationChip>
                      <span className="font-mono text-[10px] text-white/55">
                        {i.id}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-[11px] text-white/80">
                      {i.summary}
                    </div>
                  </div>
                  <VerificationChip tone={severityTone(i.severity)} size="xs">
                    {i.severity}
                  </VerificationChip>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Kill-switch confirmation drawer */}
      <VerificationDrawer
        open={!!confirmKill}
        onClose={() => setConfirmKill(null)}
        title={
          confirmKill
            ? `Confirm ${killSwitch[confirmKill] ? "resume" : "pause"} · ${confirmKill}`
            : ""
        }
        subtitle="Supervisor acknowledgement required"
        severity="critical"
        footer={
          confirmKill ? (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmKill(null)}
                className="rounded-xl border border-white/12 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/25 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => toggleKill(confirmKill)}
                className="rounded-xl border border-[#F05858]/50 bg-[#F05858]/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-[#F05858]/80 hover:bg-[#F05858]/30"
              >
                {killSwitch[confirmKill]
                  ? `Yes, resume ${confirmKill}`
                  : `Yes, pause ${confirmKill}`}
              </button>
            </div>
          ) : null
        }
      >
        {confirmKill ? (
          <div className="space-y-3 text-xs text-white/80">
            <p>
              Aap {confirmKill} module ko{" "}
              <strong className="text-white">
                {killSwitch[confirmKill] ? "resume" : "pause"}
              </strong>{" "}
              karna chahte hain. Is action ka platform-wide impact hoga:
            </p>
            <ul className="space-y-1.5 text-white/70">
              <li className="flex gap-2">
                <span className="text-[#F05858]">•</span>
                <span>
                  Naye writes {confirmKill} engine par{" "}
                  {killSwitch[confirmKill] ? "accept" : "reject"} honge.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#F05858]">•</span>
                <span>
                  MIN-rule dependent modules (STL/PSS/CRB) ko auto-signal jayega.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#F05858]">•</span>
                <span>
                  Supervisor action L8 ke audit log mein record hoga — aapke
                  naam se.
                </span>
              </li>
            </ul>
            <div className="rounded-xl border border-[#F05858]/40 bg-[#F05858]/10 p-3 text-[11px] text-[#F05858]">
              Production use karte waqt is action ke liye 2-of-3 supervisor
              MFA enforce hoga.
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}

/* ---------- helpers ---------- */
function InfoRow({
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
      <p
        className={`mt-1 text-xs font-semibold text-white/90 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------- columns ---------- */
const incidentColumns: RowColumn<UpGuardIncident>[] = [
  {
    key: "incident",
    header: "Incident",
    width: "minmax(0,2.2fr)",
    render: (i) => (
      <div className="min-w-0">
        <div className="font-mono text-[10px] text-white/55">{i.id}</div>
        <div className="truncate text-white">{i.summary}</div>
      </div>
    ),
  },
  {
    key: "module",
    header: "Module",
    width: "minmax(0,0.7fr)",
    render: (i) => (
      <VerificationChip tone={moduleTone(i.module)} size="xs">
        {i.module}
      </VerificationChip>
    ),
  },
  {
    key: "severity",
    header: "Severity",
    width: "minmax(0,0.8fr)",
    render: (i) => (
      <VerificationChip tone={severityTone(i.severity)} size="xs">
        {i.severity}
      </VerificationChip>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "minmax(0,0.8fr)",
    render: (i) => (
      <VerificationChip tone={statusTone(i.status)} size="xs">
        {i.status}
      </VerificationChip>
    ),
  },
  {
    key: "detected",
    header: "Detected",
    width: "minmax(0,1.1fr)",
    align: "right",
    render: (i) => (
      <span className="text-[10px] text-white/45">
        {fmtRelative(i.detectedAt)}
      </span>
    ),
  },
];
