"use client";

/**
 * DMO — AI Automation Panel
 *   - VerificationUI primitives only (no <table>, no local Card)
 *   - Gradient accent bars, corner decorations, STL badge system
 *   - In-file demo data (prototype only, no fetch)
 */

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  SeverityMeter,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type RuleStatus = "active" | "disabled" | "paused";

type AutomationRule = {
  id: string;
  event: string;
  action: string;
  status: RuleStatus;
  triggersToday: number;
  lastTriggered?: string;
  module: "STL" | "PSS" | "CRB" | "Wallet" | "Complaints" | "Refill";
};

/* ------------------------------------------------------------------ */
/* Demo data                                                           */
/* ------------------------------------------------------------------ */

const RULES: AutomationRule[] = [
  { id: "AR-001", event: "STL score drops below L4", action: "Auto-lock seller + notify franchise", status: "active", triggersToday: 3, lastTriggered: "2026-04-12T08:45:00Z", module: "STL" },
  { id: "AR-002", event: "CRB certificate expires in 7 days", action: "Send renewal reminder + flag DMO", status: "active", triggersToday: 8, lastTriggered: "2026-04-12T09:12:00Z", module: "CRB" },
  { id: "AR-003", event: "Escrow hold > 30 days", action: "Escalate to finance team + freeze payout", status: "active", triggersToday: 1, lastTriggered: "2026-04-12T07:30:00Z", module: "Wallet" },
  { id: "AR-004", event: "Complaint severity = critical", action: "Auto-assign to senior DMO + page admin", status: "active", triggersToday: 2, lastTriggered: "2026-04-12T10:05:00Z", module: "Complaints" },
  { id: "AR-005", event: "PSS liveness check fails 3x", action: "Suspend seller PSS + trigger CRB review", status: "paused", triggersToday: 0, module: "PSS" },
  { id: "AR-006", event: "Refill cycle 90% complete", action: "Pre-schedule exam slot + notify seller", status: "active", triggersToday: 5, lastTriggered: "2026-04-12T06:22:00Z", module: "Refill" },
  { id: "AR-007", event: "Fraud score exceeds threshold", action: "Auto-ban + freeze wallet + alert chain", status: "disabled", triggersToday: 0, module: "STL" },
  { id: "AR-008", event: "New franchise onboard approved", action: "Provision wallet + seed STL L2 + notify", status: "active", triggersToday: 1, lastTriggered: "2026-04-12T11:00:00Z", module: "Wallet" },
];

const AI_SUGGESTIONS = [
  "Consider enabling fraud auto-ban rule — 3 flagged sellers in last 48h.",
  "CRB renewal reminders should fire at 14 days (currently 7) — 2 expirations missed last month.",
  "Refill pre-scheduling could add SMS channel — 23% of sellers miss email-only.",
  "STL auto-lock threshold could tighten to L5 for GoSellr vertical (higher chargeback risk).",
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const STATUS_TONE: Record<RuleStatus, VerificationTone> = {
  active: "green",
  paused: "amber",
  disabled: "red",
};

const MODULE_TONE: Record<AutomationRule["module"], VerificationTone> = {
  STL: "purple",
  PSS: "teal",
  CRB: "cyan",
  Wallet: "amber",
  Complaints: "red",
  Refill: "green",
};

function fmtTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function AutomationPage() {
  const [rules] = useState<AutomationRule[]>(RULES);
  const [statusFilter, setStatusFilter] = useState<"ALL" | RuleStatus>("ALL");
  const [active, setActive] = useState<AutomationRule | null>(null);

  const stats = {
    active: rules.filter((r) => r.status === "active").length,
    triggersToday: rules.reduce((s, r) => s + r.triggersToday, 0),
    paused: rules.filter((r) => r.status === "paused").length,
    disabled: rules.filter((r) => r.status === "disabled").length,
  };

  const visible = statusFilter === "ALL" ? rules : rules.filter((r) => r.status === statusFilter);

  const columns: RowColumn<AutomationRule>[] = [
    {
      key: "rule",
      header: "Rule",
      width: "minmax(0,2.2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-white/45">{r.id}</div>
          <div className="truncate text-sm font-semibold text-white">{r.event}</div>
          <div className="truncate text-[10px] text-white/50">{r.action}</div>
        </div>
      ),
    },
    {
      key: "module",
      header: "Module",
      width: "minmax(0,0.8fr)",
      render: (r) => <VerificationChip tone={MODULE_TONE[r.module]}>{r.module}</VerificationChip>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.8fr)",
      render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip>,
    },
    {
      key: "triggers",
      header: "Today",
      width: "minmax(0,0.6fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-sm text-white/85">{r.triggersToday}</span>
      ),
    },
    {
      key: "last",
      header: "Last fired",
      width: "minmax(0,1fr)",
      align: "right",
      render: (r) => <span className="text-[10px] text-white/45">{fmtTime(r.lastTriggered)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#2BBFA0]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Automation</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">AI Automation Panel</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Event-driven rule engine — STL drops, CRB expirations, fraud flags, aur wallet
              holds sab ko auto-actions assign hoti hain. AI Brain 2.0 suggestions bhi yahaan
              show hoti hain.
            </p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="green"
          label="Active rules"
          value={stats.active}
          sub="currently running"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="purple"
          label="Triggers today"
          value={stats.triggersToday}
          sub="total fires across rules"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="amber"
          label="Paused"
          value={stats.paused}
          sub="temporarily suspended"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <rect x="6" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.6" />
              <rect x="14" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="red"
          label="Disabled"
          value={stats.disabled}
          sub="needs review"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
        />
      </section>

      {/* AI suggestions panel */}
      <section className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-5 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #A098F8 30%, #2BBFA0 70%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 border-l-[1.5px] border-t-[1.5px] border-[#A098F8]/50" style={{ borderTopLeftRadius: "3px" }} />
        <div className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" style={{ borderBottomRightRadius: "3px" }} />
        <SectionHeader
          eyebrow="AI Brain 2.0"
          title="Optimisation suggestions"
          hint="Based on last 30 days of rule performance + incident data"
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {AI_SUGGESTIONS.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-[12px] leading-relaxed text-white/70 transition-colors hover:border-[#A098F8]/30 hover:bg-white/[0.05]"
            >
              <span className="mr-1.5 inline-block font-mono text-[10px] text-[#A098F8]">#{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* Rule severity distribution */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Rule distribution" hint="Active vs paused vs disabled" />
        <SeverityMeter
          segments={[
            { label: "Active", value: stats.active, tone: "green" },
            { label: "Paused", value: stats.paused, tone: "amber" },
            { label: "Disabled", value: stats.disabled, tone: "red" },
          ]}
        />
      </section>

      {/* Rules queue */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          eyebrow="Engine"
          title="Automation rules"
          hint="Event → action mappings with SLA triggers"
          right={<span className="text-[10px] text-white/45">{visible.length} rule(s)</span>}
        />
        <div className="mt-3">
          <FilterChipRow<"ALL" | RuleStatus>
            options={[
              { value: "ALL", label: `All · ${rules.length}` },
              { value: "active", label: `Active · ${stats.active}` },
              { value: "paused", label: `Paused · ${stats.paused}` },
              { value: "disabled", label: `Disabled · ${stats.disabled}` },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<AutomationRule>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => STATUS_TONE[r.status]}
            emptyTitle="No rules in this filter"
            emptyHint="Adjust filter to see automation rules."
          />
        </div>
      </section>

      {/* Rule drawer */}
      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? active.event : "Rule detail"}
        subtitle={active ? `${active.id} · ${active.module} module` : undefined}
        severity={active?.status === "disabled" ? "high" : active?.status === "paused" ? "warning" : "info"}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={MODULE_TONE[active.module]}>{active.module}</VerificationChip>
              <VerificationChip tone={STATUS_TONE[active.status]}>{active.status}</VerificationChip>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Action</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/75">{active.action}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Rule ID" value={active.id} mono />
              <InfoCell label="Module" value={active.module} />
              <InfoCell label="Triggers today" value={active.triggersToday} mono />
              <InfoCell label="Last fired" value={fmtTime(active.lastTriggered)} />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20"
              >
                Enable
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-3 py-2 text-[11px] font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20"
              >
                Pause
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F05858]/40 bg-[#F05858]/12 px-3 py-2 text-[11px] font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/70 hover:bg-[#F05858]/20"
              >
                Disable
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
