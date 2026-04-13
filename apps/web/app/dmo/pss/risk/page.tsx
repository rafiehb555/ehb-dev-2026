"use client";

/**
 * DMO — PSS Risk Analysis Dashboard
 *   - Risk scoring and flagged entities
 *   - VerificationUI primitives only (no <table>, no local Card)
 *   - In-file demo data (prototype only, no fetch)
 *   - Risk signals, severity distribution, entity drill-in
 */

import { useState, useMemo } from "react";
import Link from "next/link";
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

/* ================================================================ */
/* Types                                                            */
/* ================================================================ */

type RiskLevel = "critical" | "high" | "medium" | "low";

type RiskSignal = {
  id: string;
  name: string;
  description: string;
  count: number;
  trend: number; // +2, -1, 0
};

type FlaggedEntity = {
  id: string;
  entityName: string;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  signals: string[]; // signal IDs
  flaggedAt: string;
  status: "open" | "investigating" | "resolved";
};

/* ================================================================ */
/* Demo Data                                                        */
/* ================================================================ */

const RISK_SIGNALS: RiskSignal[] = [
  {
    id: "sig-velocity",
    name: "Velocity Anomaly",
    description: "Unusual spike in transaction frequency or volume",
    count: 12,
    trend: 3,
  },
  {
    id: "sig-geo",
    name: "Geographic Mismatch",
    description: "IP location does not match registered address",
    count: 8,
    trend: -1,
  },
  {
    id: "sig-forgery",
    name: "Document Forgery",
    description: "Suspected forged or tampered document detected",
    count: 5,
    trend: 2,
  },
  {
    id: "sig-behavior",
    name: "Behavioral Pattern",
    description: "Deviation from historical user behavior patterns",
    count: 18,
    trend: 1,
  },
  {
    id: "sig-aml",
    name: "AML Hit",
    description: "Name or entity matched on AML watchlist",
    count: 3,
    trend: 0,
  },
];

const FLAGGED_ENTITIES: FlaggedEntity[] = [
  {
    id: "ENT-001",
    entityName: "Karachi Trading Co.",
    riskScore: 92,
    riskLevel: "critical",
    signals: ["sig-velocity", "sig-behavior", "sig-aml"],
    flaggedAt: "2026-04-11",
    status: "investigating",
  },
  {
    id: "ENT-002",
    entityName: "Ahmed & Sons Import",
    riskScore: 78,
    riskLevel: "high",
    signals: ["sig-geo", "sig-forgery"],
    flaggedAt: "2026-04-10",
    status: "open",
  },
  {
    id: "ENT-003",
    entityName: "Lahore Digital Services",
    riskScore: 65,
    riskLevel: "high",
    signals: ["sig-velocity", "sig-behavior"],
    flaggedAt: "2026-04-09",
    status: "open",
  },
  {
    id: "ENT-004",
    entityName: "Islamabad Healthcare Ltd.",
    riskScore: 42,
    riskLevel: "medium",
    signals: ["sig-behavior"],
    flaggedAt: "2026-04-08",
    status: "resolved",
  },
  {
    id: "ENT-005",
    entityName: "Peshawar Logistics Hub",
    riskScore: 88,
    riskLevel: "critical",
    signals: ["sig-velocity", "sig-geo", "sig-forgery", "sig-behavior"],
    flaggedAt: "2026-04-11",
    status: "investigating",
  },
  {
    id: "ENT-006",
    entityName: "Quetta Export Group",
    riskScore: 71,
    riskLevel: "high",
    signals: ["sig-aml", "sig-behavior"],
    flaggedAt: "2026-04-07",
    status: "open",
  },
  {
    id: "ENT-007",
    entityName: "Multan Services Pvt",
    riskScore: 38,
    riskLevel: "medium",
    signals: ["sig-velocity"],
    flaggedAt: "2026-04-06",
    status: "resolved",
  },
  {
    id: "ENT-008",
    entityName: "Faisalabad Trade Partners",
    riskScore: 82,
    riskLevel: "high",
    signals: ["sig-velocity", "sig-geo"],
    flaggedAt: "2026-04-12",
    status: "open",
  },
];

/* ================================================================ */
/* Helpers                                                          */
/* ================================================================ */

const RISK_LEVEL_TONE: Record<RiskLevel, VerificationTone> = {
  critical: "red",
  high: "red",
  medium: "amber",
  low: "green",
};

const STATUS_TONE: Record<FlaggedEntity["status"], VerificationTone> = {
  open: "red",
  investigating: "amber",
  resolved: "green",
};

function getRiskLevelLabel(level: RiskLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function getStatusLabel(status: FlaggedEntity["status"]): string {
  const map: Record<FlaggedEntity["status"], string> = {
    open: "Open",
    investigating: "Investigating",
    resolved: "Resolved",
  };
  return map[status];
}

function TrendBadge({ trend }: { trend: number }) {
  if (trend === 0) return <span className="text-white/50 text-[11px]">—</span>;
  const isUp = trend > 0;
  const arrow = isUp ? "↑" : "↓";
  const color = isUp ? "#F05858" : "#38C878";
  return (
    <span style={{ color }} className="text-[11px] font-semibold">
      {arrow} {Math.abs(trend)}
    </span>
  );
}

function SignalList({ signalIds }: { signalIds: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {signalIds.map((sid) => {
        const signal = RISK_SIGNALS.find((s) => s.id === sid);
        if (!signal) return null;
        return (
          <VerificationChip key={sid} tone="amber" size="xs">
            {signal.name.split(" ")[0]}
          </VerificationChip>
        );
      })}
    </div>
  );
}

function RiskScoreMeter({ score }: { score: number }) {
  const tone: VerificationTone = score >= 80 ? "red" : score >= 60 ? "amber" : "green";
  const colors: Record<VerificationTone, string> = {
    red: "#F05858",
    amber: "#F0A030",
    green: "#38C878",
    purple: "#7B6EF6",
    teal: "#2BBFA0",
    cyan: "#67E8F9",
  };
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
          Risk Score
        </span>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: colors[tone] }}
        >
          {score}/100
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full transition-[width] duration-500"
          style={{
            width: `${score}%`,
            background: colors[tone],
            boxShadow: `0 0 8px ${colors[tone]}`,
          }}
        />
      </div>
    </div>
  );
}

/* ================================================================ */
/* Main Page                                                        */
/* ================================================================ */

export default function RiskAnalysisPage() {
  const [filterLevel, setFilterLevel] = useState<RiskLevel | "all">("all");
  const [selectedEntity, setSelectedEntity] = useState<FlaggedEntity | null>(null);

  /* Filter entities */
  const filteredEntities = useMemo(() => {
    if (filterLevel === "all") return FLAGGED_ENTITIES;
    return FLAGGED_ENTITIES.filter((e) => e.riskLevel === filterLevel);
  }, [filterLevel]);

  /* Compute stats */
  const totalFlagged = FLAGGED_ENTITIES.length;
  const criticalCount = FLAGGED_ENTITIES.filter(
    (e) => e.riskLevel === "critical"
  ).length;
  const highCount = FLAGGED_ENTITIES.filter(
    (e) => e.riskLevel === "high"
  ).length;
  const resolvedThisWeek = FLAGGED_ENTITIES.filter(
    (e) => e.status === "resolved"
  ).length;

  const severitySegments = [
    { label: "Critical", value: criticalCount, tone: "red" as const },
    { label: "High", value: highCount, tone: "amber" as const },
    {
      label: "Medium",
      value: FLAGGED_ENTITIES.filter((e) => e.riskLevel === "medium").length,
      tone: "amber" as const,
    },
    {
      label: "Low",
      value: FLAGGED_ENTITIES.filter((e) => e.riskLevel === "low").length,
      tone: "green" as const,
    },
  ];

  /* Row columns for entity grid */
  const entityColumns: RowColumn<FlaggedEntity>[] = [
    {
      key: "entity",
      header: "Entity",
      width: "minmax(0,1.6fr)",
      render: (row) => (
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{row.entityName}</div>
          <div className="text-[10px] text-white/50">ID: {row.id}</div>
        </div>
      ),
    },
    {
      key: "score",
      header: "Risk Score",
      width: "minmax(0,0.8fr)",
      render: (row) => (
        <span
          className="text-sm font-bold tabular-nums"
          style={{
            color: RISK_LEVEL_TONE[row.riskLevel] === "red"
              ? "#F05858"
              : RISK_LEVEL_TONE[row.riskLevel] === "amber"
              ? "#F0A030"
              : "#38C878",
          }}
        >
          {row.riskScore}
        </span>
      ),
    },
    {
      key: "level",
      header: "Level",
      width: "minmax(0,0.6fr)",
      render: (row) => (
        <VerificationChip tone={RISK_LEVEL_TONE[row.riskLevel]} size="xs">
          {getRiskLevelLabel(row.riskLevel)}
        </VerificationChip>
      ),
    },
    {
      key: "signals",
      header: "Signals",
      width: "minmax(0,1.4fr)",
      render: (row) => <SignalList signalIds={row.signals} />,
    },
    {
      key: "flagged",
      header: "Flagged At",
      width: "minmax(0,0.7fr)",
      render: (row) => <span className="text-[10px] text-white/50">{row.flaggedAt}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.7fr)",
      align: "right",
      render: (row) => (
        <VerificationChip tone={STATUS_TONE[row.status]} size="xs">
          {getStatusLabel(row.status)}
        </VerificationChip>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
      {/* Hero Section with Breadcrumb */}
      <section className="relative overflow-hidden border-b border-white/8 bg-gradient-to-b from-[#13162A]/40 to-transparent px-4 py-8 sm:px-6 lg:px-8">
        {/* Ambient blur orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full blur-3xl opacity-20"
          style={{ background: "#F05858" }}
        />

        {/* Breadcrumb */}
        <div className="relative z-10 mb-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
          <Link href="/dmo" className="transition-colors hover:text-white/85">
            DMO
          </Link>
          <span>/</span>
          <Link href="/dmo/pss" className="transition-colors hover:text-white/85">
            PSS
          </Link>
          <span>/</span>
          <span className="text-white/70">Risk Analysis</span>
        </div>

        {/* Title + Red Accent Bar */}
        <div className="relative z-10">
          <div className="mb-2 h-[2px] max-w-sm">
            <div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, #F05858 0%, transparent 100%)",
                boxShadow: "0 0 16px #F05858",
              }}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Risk Analysis Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/55">
            Real-time risk scoring, signal detection, and entity monitoring
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative px-4 py-8 sm:px-6 lg:px-8">
        {/* Stat Cards Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <VerificationStatCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M7 10l2 2 4-4M7 16l2 2 4-4" />
              </svg>
            }
            label="Total Flagged"
            value={totalFlagged}
            sub="Active & Resolved"
            tone="purple"
            onClick={() => setFilterLevel("all")}
          />
          <VerificationStatCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 3v18M3 12h18" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            }
            label="Critical Risk"
            value={criticalCount}
            sub="Immediate action"
            tone="red"
            onClick={() => setFilterLevel("critical")}
          />
          <VerificationStatCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2v20M22 12H2M18.5 5.5L5.5 18.5M5.5 5.5l13 13" />
              </svg>
            }
            label="High Risk"
            value={highCount}
            sub="Require review"
            tone="amber"
            onClick={() => setFilterLevel("high")}
          />
          <VerificationStatCard
            icon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 12l2 2 4-4M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            label="Resolved"
            value={resolvedThisWeek}
            sub="This week"
            tone="green"
          />
        </div>

        {/* Risk Matrix Section */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#13162A]/70 p-6 backdrop-blur-xl">
          <SectionHeader
            eyebrow="SEVERITY DISTRIBUTION"
            title="Risk Level Breakdown"
            hint="Distribution of flagged entities across risk severity levels"
          />
          <div className="mt-6">
            <SeverityMeter segments={severitySegments} />
          </div>
        </div>

        {/* Risk Signals Section */}
        <div className="mb-8">
          <SectionHeader
            eyebrow="ACTIVE SIGNALS"
            title="Risk Signal Summary"
            hint="Top risk signals detected in the platform"
          />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {RISK_SIGNALS.map((signal) => (
              <div
                key={signal.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#13162A]/85"
              >
                {/* Corner accent */}
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-16 w-16 rounded-full blur-2xl opacity-0 transition-opacity group-hover:opacity-60"
                  style={{ background: "#F0A030" }}
                />

                <div className="relative z-10 space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    {signal.name}
                  </p>
                  <p className="text-2xl font-black text-[#F0A030] tabular-nums">
                    {signal.count}
                  </p>
                  <p className="text-[11px] leading-relaxed text-white/55">
                    {signal.description}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/8">
                    <span className="text-[9px] text-white/45 uppercase tracking-wider">
                      Trend
                    </span>
                    <TrendBadge trend={signal.trend} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter & Flagged Entities Grid */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeader
              eyebrow="FLAGGED ENTITIES"
              title="Risk Monitoring"
              hint={`Showing ${filteredEntities.length} of ${FLAGGED_ENTITIES.length} entities`}
            />
          </div>

          {/* Filter Chips */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Filter by Risk Level
            </p>
            <FilterChipRow<RiskLevel | "all">
              value={filterLevel}
              options={[
                { value: "all", label: "All" },
                { value: "critical", label: "Critical" },
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
              onChange={(v) => setFilterLevel(v)}
            />
          </div>

          {/* Entity Grid */}
          <VerificationRowGrid<FlaggedEntity>
            columns={entityColumns}
            rows={filteredEntities}
            onRowClick={(entity) => setSelectedEntity(entity)}
            getRowTone={(row) => RISK_LEVEL_TONE[row.riskLevel]}
            emptyIcon={
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <path d="M12 6v6m0 4v1" />
              </svg>
            }
            emptyTitle="No flagged entities"
            emptyHint="Adjust filters to see more results or entities are clean"
          />
        </div>
      </section>

      {/* Entity Detail Drawer */}
      <VerificationDrawer
        open={selectedEntity !== null}
        onClose={() => setSelectedEntity(null)}
        title={selectedEntity?.entityName ?? "Entity Details"}
        subtitle={selectedEntity?.id}
        severity={
          selectedEntity
            ? selectedEntity.riskLevel === "critical"
              ? "critical"
              : selectedEntity.riskLevel === "high"
              ? "high"
              : "warning"
            : undefined
        }
        footer={
          selectedEntity ? (
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-white/12 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white/75 transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B6EF6]/60"
              >
                Clear Risk
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0A030]/60"
              >
                Escalate
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-[#F05858]/40 bg-[#F05858]/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#F05858] transition-colors hover:border-[#F05858]/70 hover:bg-[#F05858]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F05858]/60"
              >
                Block
              </button>
            </div>
          ) : null
        }
      >
        {selectedEntity ? (
          <div className="space-y-5">
            {/* Risk Score Display */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <RiskScoreMeter score={selectedEntity.riskScore} />
            </div>

            {/* Entity Info */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Entity Information
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Entity Name
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-white">
                    {selectedEntity.entityName}
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Entity ID
                  </p>
                  <p className="mt-1.5 text-sm font-mono text-white/75">
                    {selectedEntity.id}
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Risk Level
                  </p>
                  <p className="mt-1.5">
                    <VerificationChip
                      tone={RISK_LEVEL_TONE[selectedEntity.riskLevel]}
                      size="sm"
                    >
                      {getRiskLevelLabel(selectedEntity.riskLevel)}
                    </VerificationChip>
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Status
                  </p>
                  <p className="mt-1.5">
                    <VerificationChip
                      tone={STATUS_TONE[selectedEntity.status]}
                      size="sm"
                    >
                      {getStatusLabel(selectedEntity.status)}
                    </VerificationChip>
                  </p>
                </div>
              </div>
            </div>

            {/* Flagged Timeline */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Timeline
              </p>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Flagged On
                  </span>
                  <span className="text-sm text-white">{selectedEntity.flaggedAt}</span>
                </div>
              </div>
            </div>

            {/* Risk Signals List */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Detected Signals ({selectedEntity.signals.length})
              </p>
              <div className="space-y-2">
                {selectedEntity.signals.map((sigId) => {
                  const signal = RISK_SIGNALS.find((s) => s.id === sigId);
                  if (!signal) return null;
                  return (
                    <div
                      key={sigId}
                      className="rounded-xl border border-white/8 bg-white/[0.03] p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">
                            {signal.name}
                          </p>
                          <p className="mt-1 text-[11px] text-white/55">
                            {signal.description}
                          </p>
                        </div>
                        <VerificationChip tone="amber" size="xs">
                          {signal.count}
                        </VerificationChip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Risk Score Breakdown */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Score Components
              </p>
              <div className="space-y-1.5">
                {selectedEntity.signals.map((sigId) => {
                  const signal = RISK_SIGNALS.find((s) => s.id === sigId);
                  if (!signal) return null;
                  const weight = Math.floor(
                    (selectedEntity.riskScore * 0.9) / selectedEntity.signals.length
                  );
                  return (
                    <div
                      key={sigId}
                      className="flex items-center justify-between text-[11px]"
                    >
                      <span className="text-white/60">{signal.name}</span>
                      <span
                        className="font-semibold tabular-nums"
                        style={{ color: "#F0A030" }}
                      >
                        +{weight}
                      </span>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between border-t border-white/8 pt-1.5 text-[11px] font-semibold">
                  <span className="text-white">Total</span>
                  <span style={{ color: "#F05858" }}>{selectedEntity.riskScore}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </main>
  );
}
