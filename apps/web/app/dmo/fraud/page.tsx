"use client";

/**
 * DMO — AI Fraud Detection Queue
 *   - VerificationUI primitives only (no emojis, no local styles)
 *   - In-file demo data (prototype only, no fetch)
 */

import Link from "next/link";
import { useMemo, useState } from "react";
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

type RiskTier = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

type FraudSignal = { type: string; weight: number; count: number };

type FraudEntry = {
  id: string;
  entityId: string;
  entityType: string;
  score: number;
  tier: RiskTier;
  autoBlock: boolean;
  signals: FraudSignal[];
};

const SIGNAL_LABELS: Record<string, string> = {
  FAILED_VERIFICATION: "Failed Verification",
  RAPID_SUBMISSION: "Rapid Submission",
  LOCATION_MISMATCH: "Location Mismatch",
  INCOMPLETE_PROFILE: "Incomplete Profile",
  LOW_CRB_BADGE: "Low CRB Badge",
  MULTIPLE_ACCOUNTS: "Multiple Accounts",
  SUSPICIOUS_ACTIVITY: "Suspicious Activity",
  FAKE_REVIEW: "Fake Review",
  COMPLAINT_RECEIVED: "Complaint Received",
};

const DEMO: FraudEntry[] = [
  { id: "FQ-001", entityId: "app-goselr-pk-01", entityType: "APPLICATION", score: 92, tier: "CRITICAL", autoBlock: true, signals: [{ type: "FAKE_REVIEW", weight: 15, count: 3 }, { type: "SUSPICIOUS_ACTIVITY", weight: 20, count: 2 }, { type: "LOCATION_MISMATCH", weight: 7, count: 1 }] },
  { id: "FQ-002", entityId: "ord-wms-isb-44", entityType: "ORDER", score: 78, tier: "HIGH", autoBlock: false, signals: [{ type: "RAPID_SUBMISSION", weight: 12, count: 4 }, { type: "INCOMPLETE_PROFILE", weight: 8, count: 2 }] },
  { id: "FQ-003", entityId: "app-ols-lhr-09", entityType: "APPLICATION", score: 55, tier: "MEDIUM", autoBlock: false, signals: [{ type: "FAILED_VERIFICATION", weight: 10, count: 2 }, { type: "LOW_CRB_BADGE", weight: 5, count: 3 }] },
  { id: "FQ-004", entityId: "usr-hps-khi-17", entityType: "USER", score: 88, tier: "CRITICAL", autoBlock: true, signals: [{ type: "MULTIPLE_ACCOUNTS", weight: 25, count: 1 }, { type: "FAKE_REVIEW", weight: 15, count: 2 }, { type: "COMPLAINT_RECEIVED", weight: 8, count: 3 }] },
  { id: "FQ-005", entityId: "ord-agts-mul-22", entityType: "ORDER", score: 42, tier: "MEDIUM", autoBlock: false, signals: [{ type: "LOCATION_MISMATCH", weight: 7, count: 3 }, { type: "RAPID_SUBMISSION", weight: 12, count: 1 }] },
  { id: "FQ-006", entityId: "app-jps-01", entityType: "APPLICATION", score: 23, tier: "LOW", autoBlock: false, signals: [{ type: "INCOMPLETE_PROFILE", weight: 8, count: 2 }] },
];

const TIER_TONE: Record<RiskTier, VerificationTone> = {
  CRITICAL: "red",
  HIGH: "amber",
  MEDIUM: "purple",
  LOW: "green",
};

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function DmoFraudPage() {
  const [rows] = useState<FraudEntry[]>(DEMO);
  const [tierFilter, setTierFilter] = useState<"ALL" | RiskTier>("ALL");
  const [active, setActive] = useState<FraudEntry | null>(null);

  const stats = useMemo(() => ({
    critical: rows.filter((e) => e.tier === "CRITICAL").length,
    high: rows.filter((e) => e.tier === "HIGH").length,
    medium: rows.filter((e) => e.tier === "MEDIUM").length,
    low: rows.filter((e) => e.tier === "LOW").length,
  }), [rows]);

  const visible = tierFilter === "ALL" ? rows : rows.filter((e) => e.tier === tierFilter);

  const columns: RowColumn<FraudEntry>[] = [
    {
      key: "entity",
      header: "Entity",
      width: "minmax(0,2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-white/45">{r.entityId}</div>
          <div className="text-sm font-semibold text-white">{r.entityType}</div>
          <div className="text-[10px] text-white/50">{r.signals.length} signal(s){r.autoBlock ? " · Auto-blocked" : ""}</div>
        </div>
      ),
    },
    {
      key: "tier",
      header: "Tier",
      width: "minmax(0,0.8fr)",
      render: (r) => <VerificationChip tone={TIER_TONE[r.tier]}>{r.tier}</VerificationChip>,
    },
    {
      key: "score",
      header: "Score",
      width: "minmax(0,0.8fr)",
      align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: r.tier === "CRITICAL" ? "#F05858" : r.tier === "HIGH" ? "#F0A030" : r.tier === "MEDIUM" ? "#A098F8" : "#38C878" }} />
          </div>
          <span className="font-mono text-sm text-white/80">{r.score}</span>
        </div>
      ),
    },
    {
      key: "block",
      header: "Block",
      width: "minmax(0,0.6fr)",
      align: "right",
      render: (r) => r.autoBlock
        ? <VerificationChip tone="red" size="xs">BLOCKED</VerificationChip>
        : <span className="text-[10px] text-white/35">—</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F05858]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #F05858 25%, #F0A030 50%, #7B6EF6 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F05858]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#F0A030]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F05858]/18 via-[#F0A030]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F05858]">Fraud</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">AI Fraud Detection Queue</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Real-time fraud signals aur risk scores — AI-powered triage. Critical tier
              auto-blocked hota hai, baaki manual review ke liye queue mein.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="red" label="Critical" value={stats.critical} sub="auto-blocked" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" /></svg>} />
        <VerificationStatCard tone="amber" label="High" value={stats.high} sub="needs review" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Medium" value={stats.medium} sub="monitoring" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="green" label="Low" value={stats.low} sub="cleared soon" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Risk distribution" hint="By tier" />
        <SeverityMeter segments={[
          { label: "Critical", value: stats.critical, tone: "red" },
          { label: "High", value: stats.high, tone: "amber" },
          { label: "Medium", value: stats.medium, tone: "purple" },
          { label: "Low", value: stats.low, tone: "green" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="AI triage" title="Fraud queue" hint="Click row for signal breakdown" right={<span className="text-[10px] text-white/45">{visible.length} item(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | RiskTier>
            options={[
              { value: "ALL" as const, label: `All · ${rows.length}` },
              { value: "CRITICAL" as const, label: `Critical · ${stats.critical}` },
              { value: "HIGH" as const, label: `High · ${stats.high}` },
              { value: "MEDIUM" as const, label: `Medium · ${stats.medium}` },
              { value: "LOW" as const, label: `Low · ${stats.low}` },
            ]}
            value={tierFilter}
            onChange={setTierFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<FraudEntry>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => TIER_TONE[r.tier]}
            emptyTitle="No fraud signals in this tier"
            emptyHint="Adjust filter to see entries."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `${active.entityType} · ${active.entityId}` : "Fraud detail"}
        subtitle={active ? `${active.id} · Score ${active.score}/100` : undefined}
        severity={active?.tier === "CRITICAL" ? "critical" : active?.tier === "HIGH" ? "high" : "warning"}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={TIER_TONE[active.tier]}>{active.tier}</VerificationChip>
              {active.autoBlock ? <VerificationChip tone="red">AUTO-BLOCKED</VerificationChip> : null}
              <VerificationChip tone="cyan">{active.entityType}</VerificationChip>
            </div>

            {/* Score gauge */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Risk score</span>
                <span className="text-2xl font-black text-white">{active.score}<span className="text-sm text-white/40">/100</span></span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                <div className="h-full rounded-full" style={{ width: `${active.score}%`, background: active.tier === "CRITICAL" ? "#F05858" : active.tier === "HIGH" ? "#F0A030" : active.tier === "MEDIUM" ? "#A098F8" : "#38C878" }} />
              </div>
            </div>

            {/* Signal breakdown */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">Signal breakdown</p>
              <div className="space-y-1.5">
                {active.signals.map((sig) => (
                  <div key={sig.type} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                    <span className="text-[12px] text-white/70">{SIGNAL_LABELS[sig.type] ?? sig.type}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/40">x{sig.count}</span>
                      <span className="font-mono text-[11px] text-[#F0A030]">+{sig.weight * sig.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Entity ID" value={active.entityId} mono />
              <InfoCell label="Entity type" value={active.entityType} />
              <InfoCell label="Total signals" value={active.signals.length} />
              <InfoCell label="Auto-block" value={active.autoBlock ? "Yes" : "No"} />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button type="button" className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20">Clear signals</button>
              <button type="button" className="rounded-xl border border-[#F05858]/40 bg-[#F05858]/12 px-3 py-2 text-[11px] font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/70 hover:bg-[#F05858]/20">Block entity</button>
              <button type="button" className="rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-3 py-2 text-[11px] font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/70 hover:bg-[#7B6EF6]/20">View profile</button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
