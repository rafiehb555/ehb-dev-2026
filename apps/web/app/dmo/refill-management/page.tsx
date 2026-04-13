"use client";

/**
 * Refill Management — Phase 3 Operations rebuild (2026-04-12).
 *
 * Design system compliance:
 *   - VerificationUI primitives (no <table>)
 *   - Gradient accent bars + corner decorations
 *   - STLBadge for current level + STLLevelTrack for downgrade preview
 *   - SeverityMeter for refill health distribution
 *   - Drill-in drawers on every stat + row
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
  STLLevelTrack,
  getStlMeta,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

/* ================================================================== */
/* Types + demo data                                                   */
/* ================================================================== */

type RefillBucket = "active" | "expiring" | "expired" | "completed";

type RefillRow = {
  id: string;
  seller: string;
  industry: string;
  currentLevel: number;       // STL L1..L10
  downgradeLevel: number;     // where user would land if refill lapses
  expiryDays: number;         // negative = expired
  bucket: RefillBucket;
  feeUsd: number;
  cycleStart: string;
  lastExamScore: number;
  refillType: "basic" | "advanced" | "professional";
};

const DEMO_REFILLS: RefillRow[] = [
  { id: "RF-5580", seller: "Ayesha · GoSellr", industry: "E-commerce", currentLevel: 7, downgradeLevel: 5, expiryDays:  42, bucket: "active",    feeUsd: 180, cycleStart: "2026-03-01", lastExamScore: 86, refillType: "professional" },
  { id: "RF-5579", seller: "Hamza · WMS",      industry: "Medical",    currentLevel: 5, downgradeLevel: 3, expiryDays:   9, bucket: "expiring",  feeUsd: 120, cycleStart: "2025-10-12", lastExamScore: 68, refillType: "advanced" },
  { id: "RF-5578", seller: "Sana · OLS",       industry: "Legal",      currentLevel: 6, downgradeLevel: 4, expiryDays:   3, bucket: "expiring",  feeUsd: 140, cycleStart: "2025-10-05", lastExamScore: 77, refillType: "professional" },
  { id: "RF-5577", seller: "Fahad · AGTS",     industry: "Travel",     currentLevel: 4, downgradeLevel: 2, expiryDays:  -2, bucket: "expired",   feeUsd:  90, cycleStart: "2025-10-10", lastExamScore: 61, refillType: "basic" },
  { id: "RF-5576", seller: "Bilal · HPS",      industry: "Education",  currentLevel: 3, downgradeLevel: 1, expiryDays: -11, bucket: "expired",   feeUsd:  60, cycleStart: "2025-10-01", lastExamScore: 52, refillType: "basic" },
  { id: "RF-5575", seller: "Zara · GoSellr",   industry: "E-commerce", currentLevel: 8, downgradeLevel: 6, expiryDays: 180, bucket: "active",    feeUsd: 450, cycleStart: "2026-01-15", lastExamScore: 94, refillType: "professional" },
  { id: "RF-5574", seller: "Omer · OLS",       industry: "Legal",      currentLevel: 5, downgradeLevel: 3, expiryDays: 120, bucket: "completed", feeUsd: 120, cycleStart: "2026-04-01", lastExamScore: 73, refillType: "advanced" },
  { id: "RF-5573", seller: "Mariam · WMS",     industry: "Medical",    currentLevel: 6, downgradeLevel: 4, expiryDays:   5, bucket: "expiring",  feeUsd: 140, cycleStart: "2025-10-07", lastExamScore: 81, refillType: "advanced" },
];

/* ================================================================== */
/* Helpers                                                             */
/* ================================================================== */

const bucketMeta: Record<
  RefillBucket,
  { label: string; tone: VerificationTone; icon: React.ReactNode }
> = {
  active:    { label: "Active",        tone: "green",  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  expiring:  { label: "Expiring (14d)", tone: "amber",  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  expired:   { label: "Expired",       tone: "red",    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
  completed: { label: "Completed",     tone: "purple", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
};

function expiryLabel(days: number): string {
  if (days < 0) return `${Math.abs(days)}d overdue`;
  return `${days}d left`;
}

function expiryTone(days: number): VerificationTone {
  if (days < 0) return "red";
  if (days <= 14) return "amber";
  return "green";
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

type BucketFilter = "ALL" | RefillBucket;

export default function RefillManagementPage() {
  const [rows] = useState<RefillRow[]>(DEMO_REFILLS);
  const [bucket, setBucket] = useState<BucketFilter>("ALL");
  const [selected, setSelected] = useState<RefillRow | null>(null);
  const [statDrawer, setStatDrawer] = useState<null | RefillBucket>(null);

  const counts = useMemo(
    () => ({
      active:    rows.filter((r) => r.bucket === "active").length,
      expiring:  rows.filter((r) => r.bucket === "expiring").length,
      expired:   rows.filter((r) => r.bucket === "expired").length,
      completed: rows.filter((r) => r.bucket === "completed").length,
    }),
    [rows]
  );

  const visible = useMemo(
    () => (bucket === "ALL" ? rows : rows.filter((r) => r.bucket === bucket)),
    [rows, bucket]
  );

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/35 bg-gradient-to-br from-[#A098F8]/10 via-[#13162A]/90 to-[#2BBFA0]/10 p-6">
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #7B6EF6 30%, #2BBFA0 70%, transparent 100%)",
            boxShadow: "0 0 16px #7B6EF6",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 h-4 w-4 opacity-60"
          style={{ borderLeft: "1.5px solid #7B6EF6", borderTop: "1.5px solid #7B6EF6", borderTopLeftRadius: 4 }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 opacity-60"
          style={{ borderRight: "1.5px solid #2BBFA0", borderBottom: "1.5px solid #2BBFA0", borderBottomRightRadius: 4 }}
        />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Refill</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Refill Management</h1>
            <p className="max-w-2xl text-sm text-white/65">
              STL refill cycles — active, expiring, expired, completed. Sellers ko apnay
              level pa rakhnay ke liye har cycle ka tight tracking yahaan se hota hai.
              Refill lapse hoga to auto-downgrade preview bhi visible hai.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dmo"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              ← Back to DMO
            </Link>
            <Link
              href="/dmo/crb"
              className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A098F8] transition-colors hover:border-[#7B6EF6]/80 hover:bg-[#7B6EF6]/25 hover:text-white"
            >
              CRB exams
            </Link>
            <button
              type="button"
              className="rounded-xl border border-[#F0A030]/50 bg-[#F0A030]/15 px-3 py-1.5 text-xs font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/80 hover:bg-[#F0A030]/25 hover:text-white"
            >
              Send expiry reminders
            </button>
          </div>
        </div>
      </section>

      {/* KPI stat cards */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="green"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.5" /><polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          label="Active"
          value={counts.active}
          sub="Healthy cycle"
          onClick={() => setStatDrawer("active")}
        />
        <VerificationStatCard
          tone="amber"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Expiring (14d)"
          value={counts.expiring}
          sub="Needs attention"
          onClick={() => setStatDrawer("expiring")}
        />
        <VerificationStatCard
          tone="red"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" /><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Expired"
          value={counts.expired}
          sub="Downgrade triggered"
          onClick={() => setStatDrawer("expired")}
        />
        <VerificationStatCard
          tone="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" /></svg>}
          label="Completed"
          value={counts.completed}
          sub="This cycle"
          onClick={() => setStatDrawer("completed")}
        />
      </section>

      {/* Refill health meter */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, #38C878 0%, #F0A030 40%, #F05858 70%, #7B6EF6 100%)",
            boxShadow: "0 0 12px rgba(123,110,246,0.5)",
          }}
        />
        <SectionHeader
          eyebrow="Refill · Health"
          title="Cycle distribution"
          hint="Percentage split of active / expiring / expired / completed refills."
        />
        <div className="mt-3">
          <SeverityMeter
            segments={[
              { label: "Active",    value: counts.active,    tone: "green" },
              { label: "Expiring",  value: counts.expiring,  tone: "amber" },
              { label: "Expired",   value: counts.expired,   tone: "red" },
              { label: "Completed", value: counts.completed, tone: "purple" },
            ]}
          />
        </div>
      </section>

      {/* Queue */}
      <section>
        <SectionHeader
          eyebrow="Refill · Queue"
          title="Refill queue"
          hint="Click any row to preview the auto-downgrade target on the level track."
          right={
            <FilterChipRow<BucketFilter>
              value={bucket}
              onChange={setBucket}
              options={[
                { value: "ALL",       label: `ALL · ${rows.length}` },
                { value: "active",    label: "Active" },
                { value: "expiring",  label: "Expiring" },
                { value: "expired",   label: "Expired" },
                { value: "completed", label: "Completed" },
              ]}
            />
          }
        />
        <VerificationRowGrid<RefillRow>
          rows={visible}
          columns={refillColumns}
          onRowClick={(r) => setSelected(r)}
          getRowTone={(r) => (r.bucket === "expired" ? "red" : r.bucket === "expiring" ? "amber" : undefined)}
          emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6"><polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><polyline points="1 20 1 14 7 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
          emptyTitle="No refills in this bucket"
          emptyHint="Switch filter to ALL or run a refill cycle audit."
        />
      </section>

      {/* Drill-in drawer — shows downgrade preview + STL level track */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Refill · ${selected.seller}` : ""}
        subtitle={selected ? `${selected.id} · ${selected.industry}` : undefined}
        severity={
          selected?.bucket === "expired"
            ? "critical"
            : selected?.bucket === "expiring"
            ? "warning"
            : "info"
        }
      >
        {selected ? (
          <div className="space-y-5">
            {/* Current → downgrade preview */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {selected.bucket === "expired" ? "Auto-downgrade in effect" : "Downgrade preview if lapse"}
              </p>

              <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row sm:items-stretch sm:justify-between">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                    Current
                  </p>
                  <STLBadge level={selected.currentLevel} size="sm" />
                </div>
                <div className="flex flex-1 items-center justify-center text-3xl text-white/40">
                  →
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                    After lapse
                  </p>
                  <STLBadge level={selected.downgradeLevel} size="sm" />
                </div>
              </div>

              <div className="mt-5">
                <STLLevelTrack
                  activeLevel={
                    selected.bucket === "expired" ? selected.downgradeLevel : selected.currentLevel
                  }
                />
              </div>
            </div>

            {/* Meta grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Current STL" value={`L${selected.currentLevel} · ${getStlMeta(selected.currentLevel).label}`} />
              <InfoCell
                label="Expiry"
                value={expiryLabel(selected.expiryDays)}
                tone={selected.expiryDays < 0 ? "red" : selected.expiryDays <= 14 ? "amber" : "teal"}
              />
              <InfoCell label="Cycle start" value={selected.cycleStart} />
              <InfoCell label="Last exam score" value={`${selected.lastExamScore} / 100`} />
              <InfoCell label="Refill type" value={selected.refillType.toUpperCase()} />
              <InfoCell label="Refill fee" value={`$${selected.feeUsd}`} tone="teal" />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-xl border border-[#38C878]/45 bg-[#38C878]/15 px-3 py-1.5 text-[11px] font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/25 hover:text-white"
              >
                Approve refill
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F0A030]/45 bg-[#F0A030]/15 px-3 py-1.5 text-[11px] font-semibold text-[#F0A030] transition-colors hover:bg-[#F0A030]/25 hover:text-white"
              >
                Send reminder
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F05858]/45 bg-[#F05858]/15 px-3 py-1.5 text-[11px] font-semibold text-[#F05858] transition-colors hover:bg-[#F05858]/25 hover:text-white"
              >
                Force downgrade
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Stat drill-in */}
      <VerificationDrawer
        open={!!statDrawer}
        onClose={() => setStatDrawer(null)}
        title={statDrawer ? `${bucketMeta[statDrawer].label} · drill-in` : ""}
        severity={statDrawer === "expired" ? "critical" : statDrawer === "expiring" ? "warning" : "info"}
      >
        {statDrawer ? (
          <div className="space-y-3">
            <p className="text-xs text-white/75">
              {statDrawer === "active"
                ? "Healthy refill cycles with >14 days remaining."
                : statDrawer === "expiring"
                ? "Refill cycles expiring in 14 days or less. Trigger reminders now to prevent downgrade."
                : statDrawer === "expired"
                ? "Refill cycles that have lapsed. Auto-downgrade already in effect; manual override available."
                : "Refill cycles completed this month."}
            </p>
            <div className="space-y-2">
              {rows
                .filter((r) => r.bucket === statDrawer)
                .map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{r.seller}</p>
                      <p className="text-[10px] text-white/45">{r.id}</p>
                    </div>
                    <VerificationChip tone={expiryTone(r.expiryDays)} size="xs">
                      {expiryLabel(r.expiryDays)}
                    </VerificationChip>
                  </div>
                ))}
            </div>
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
  tone,
}: {
  label: string;
  value: string;
  tone?: "teal" | "red" | "amber";
}) {
  const fg =
    tone === "teal" ? "#2BBFA0" : tone === "red" ? "#F05858" : tone === "amber" ? "#F0A030" : "#ffffff";
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold" style={{ color: fg }}>
        {value}
      </p>
    </div>
  );
}

/* ---------- Row columns ---------- */
const refillColumns: RowColumn<RefillRow>[] = [
  {
    key: "seller",
    header: "Seller",
    width: "minmax(0,1.8fr)",
    render: (r) => (
      <div className="min-w-0">
        <div className="font-mono text-[10px] text-white/45">{r.id}</div>
        <div className="truncate font-semibold text-white">{r.seller}</div>
        <div className="text-[10px] text-white/45">{r.industry}</div>
      </div>
    ),
  },
  {
    key: "stl",
    header: "Current",
    width: "minmax(0,0.7fr)",
    render: (r) => {
      const meta = getStlMeta(r.currentLevel);
      return (
        <VerificationChip
          tone={
            r.currentLevel >= 8 ? "amber"
              : r.currentLevel >= 6 ? "purple"
              : r.currentLevel >= 4 ? "teal" : "cyan"
          }
          size="xs"
        >
          L{r.currentLevel} · {meta.label}
        </VerificationChip>
      );
    },
  },
  {
    key: "bucket",
    header: "Status",
    width: "minmax(0,0.8fr)",
    render: (r) => (
      <VerificationChip tone={bucketMeta[r.bucket].tone} size="xs">
        {bucketMeta[r.bucket].icon} {bucketMeta[r.bucket].label}
      </VerificationChip>
    ),
  },
  {
    key: "expiry",
    header: "Expiry",
    width: "minmax(0,0.7fr)",
    render: (r) => (
      <span
        className="font-mono text-[11px] font-semibold tabular-nums"
        style={{
          color:
            r.expiryDays < 0 ? "#F05858" : r.expiryDays <= 14 ? "#F0A030" : "#38C878",
        }}
      >
        {expiryLabel(r.expiryDays)}
      </span>
    ),
  },
  {
    key: "fee",
    header: "Fee",
    width: "minmax(0,0.5fr)",
    align: "right",
    render: (r) => (
      <span className="font-mono text-xs font-bold text-white tabular-nums">
        ${r.feeUsd}
      </span>
    ),
  },
];
