"use client";

/**
 * DMO — Analytics — KPIs
 *   - Key Performance Indicators across all modules
 *   - VerificationUI primitives (no framer-motion, no emojis, no legacy classes)
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

type KpiModule = "STL" | "PSS" | "CRB" | "WALLET" | "FRANCHISE" | "COMPLAINTS";
type KpiUnit = "PERCENT" | "COUNT" | "CURRENCY" | "DAYS";
type KpiTrend = "UP" | "DOWN" | "FLAT";
type KpiStatus = "ON_TARGET" | "BELOW" | "CRITICAL";

type KpiRow = {
  id: string;
  kpiName: string;
  module: KpiModule;
  currentValue: number;
  targetValue: number;
  unit: KpiUnit;
  trend: KpiTrend;
  status: KpiStatus;
  description: string;
};

/* ── Demo data — 10 realistic KPIs ── */
const DEMO: KpiRow[] = [
  {
    id: "KPI-STL-001",
    kpiName: "Average STL Level",
    module: "STL",
    currentValue: 5.8,
    targetValue: 6.5,
    unit: "COUNT",
    trend: "UP",
    status: "BELOW",
    description: "Average Service Trust Level across all verified entities",
  },
  {
    id: "KPI-PSS-001",
    kpiName: "KYC Completion Rate",
    module: "PSS",
    currentValue: 87.5,
    targetValue: 95.0,
    unit: "PERCENT",
    trend: "DOWN",
    status: "BELOW",
    description: "Percentage of applicants completing KYC verification",
  },
  {
    id: "KPI-CRB-001",
    kpiName: "Certificate Issuance Count",
    module: "CRB",
    currentValue: 1247,
    targetValue: 1500,
    unit: "COUNT",
    trend: "UP",
    status: "ON_TARGET",
    description: "Total CRB certificates issued this month",
  },
  {
    id: "KPI-WALLET-001",
    kpiName: "Transaction Volume",
    module: "WALLET",
    currentValue: 450000,
    targetValue: 500000,
    unit: "CURRENCY",
    trend: "UP",
    status: "ON_TARGET",
    description: "Monthly transaction volume in PKR",
  },
  {
    id: "KPI-FRANCHISE-001",
    kpiName: "Franchise Activation",
    module: "FRANCHISE",
    currentValue: 12,
    targetValue: 20,
    unit: "COUNT",
    trend: "FLAT",
    status: "BELOW",
    description: "New franchises activated this quarter",
  },
  {
    id: "KPI-COMPLAINTS-001",
    kpiName: "Complaint Resolution Time",
    module: "COMPLAINTS",
    currentValue: 4.2,
    targetValue: 3.0,
    unit: "DAYS",
    trend: "DOWN",
    status: "CRITICAL",
    description: "Average days to resolve customer complaints",
  },
  {
    id: "KPI-STL-002",
    kpiName: "Entity Verification Success",
    module: "STL",
    currentValue: 94.3,
    targetValue: 98.0,
    unit: "PERCENT",
    trend: "UP",
    status: "BELOW",
    description: "Percentage of entities successfully verified",
  },
  {
    id: "KPI-PSS-002",
    kpiName: "AML Alert Rate",
    module: "PSS",
    currentValue: 2.1,
    targetValue: 1.5,
    unit: "PERCENT",
    trend: "UP",
    status: "CRITICAL",
    description: "Percentage of transactions flagged by AML",
  },
  {
    id: "KPI-CRB-002",
    kpiName: "Certificate Renewal Rate",
    module: "CRB",
    currentValue: 78.5,
    targetValue: 85.0,
    unit: "PERCENT",
    trend: "DOWN",
    status: "BELOW",
    description: "Percentage of certificates renewed on time",
  },
  {
    id: "KPI-WALLET-002",
    kpiName: "User Adoption Rate",
    module: "WALLET",
    currentValue: 62.4,
    targetValue: 75.0,
    unit: "PERCENT",
    trend: "UP",
    status: "ON_TARGET",
    description: "Active wallet user adoption rate",
  },
];

const STATUS_TONE: Record<KpiStatus, VerificationTone> = {
  ON_TARGET: "green",
  BELOW: "amber",
  CRITICAL: "red",
};

const MODULE_TONE: Record<KpiModule, VerificationTone> = {
  STL: "teal",
  PSS: "cyan",
  CRB: "purple",
  WALLET: "green",
  FRANCHISE: "amber",
  COMPLAINTS: "red",
};

const TREND_ICON = {
  UP: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.46 15.54 8 10 2 16" />
      <polyline points="23 6 23 16 13 16" />
    </svg>
  ),
  DOWN: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 18 13.46 8.46 8 14 2 8" />
      <polyline points="23 18 23 8 13 8" />
    </svg>
  ),
  FLAT: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  ),
};

function fmtValue(value: number, unit: KpiUnit): string {
  switch (unit) {
    case "PERCENT":
      return `${value.toFixed(1)}%`;
    case "CURRENCY":
      return `PKR ${(value / 1000).toFixed(0)}K`;
    case "DAYS":
      return `${value.toFixed(1)} days`;
    case "COUNT":
    default:
      return value.toFixed(2);
  }
}

function InfoCell({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function AnalyticsKpisPage() {
  const [rows] = useState<KpiRow[]>(DEMO);
  const [moduleFilter, setModuleFilter] = useState<"ALL" | KpiModule>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | KpiStatus>("ALL");
  const [selected, setSelected] = useState<KpiRow | null>(null);

  const stats = useMemo(() => {
    const st = {
      activeKpis: rows.length,
      onTarget: rows.filter((r) => r.status === "ON_TARGET").length,
      below: rows.filter((r) => r.status === "BELOW").length,
      critical: rows.filter((r) => r.status === "CRITICAL").length,
    };
    return st;
  }, [rows]);

  const statusBreakdown = useMemo(() => {
    const by: Record<KpiStatus, number> = { ON_TARGET: 0, BELOW: 0, CRITICAL: 0 };
    for (const r of rows) {
      by[r.status] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (moduleFilter !== "ALL" && r.module !== moduleFilter) return false;
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    return true;
  });

  const columns: RowColumn<KpiRow>[] = [
    {
      key: "kpiName",
      header: "KPI Name",
      width: "minmax(0,1.8fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {r.kpiName}
          </div>
          <div className="truncate text-[10px] text-white/45">
            {r.description}
          </div>
        </div>
      ),
    },
    {
      key: "module",
      header: "Module",
      width: "minmax(0,0.8fr)",
      render: (r) => (
        <VerificationChip tone={MODULE_TONE[r.module]} size="xs">
          {r.module}
        </VerificationChip>
      ),
    },
    {
      key: "current",
      header: "Current",
      width: "minmax(0,0.9fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-sm font-semibold text-white">
          {fmtValue(r.currentValue, r.unit)}
        </span>
      ),
    },
    {
      key: "target",
      header: "Target",
      width: "minmax(0,0.9fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/55">
          {fmtValue(r.targetValue, r.unit)}
        </span>
      ),
    },
    {
      key: "trend",
      header: "Trend",
      width: "minmax(0,0.5fr)",
      align: "center",
      render: (r) => {
        const trendTone = r.trend === "UP" ? "green" : r.trend === "DOWN" ? "red" : "amber";
        return (
          <div className={`inline-flex items-center gap-1 text-${trendTone}`}>
            {TREND_ICON[r.trend]}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <VerificationChip tone={STATUS_TONE[r.status]}>
          {r.status}
        </VerificationChip>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#F0A030]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #F0A030 25%, #7B6EF6 50%, #2BBFA0 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F0A030]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#F0A030]/14 via-[#7B6EF6]/10 to-transparent blur-3xl" />

        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/55">
            <Link
              href="/dmo"
              className="transition-colors hover:text-[#7B6EF6]"
            >
              DMO
            </Link>
            <span>/</span>
            <Link
              href="/dmo/analytics"
              className="transition-colors hover:text-[#7B6EF6]"
            >
              Analytics
            </Link>
            <span>/</span>
            <span className="text-white/75">KPIs</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Performance Indicators
          </h1>
          <p className="text-sm text-white/55">
            Track key metrics across STL, PSS, CRB, Wallet, Franchise, and Complaints modules
          </p>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <VerificationStatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
              <polyline points="12 12 20 7.5" />
              <polyline points="12 12 12 21" />
              <polyline points="12 12 4 7.5" />
            </svg>
          }
          label="Active KPIs"
          value={stats.activeKpis}
          tone="cyan"
        />
        <VerificationStatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4l-8.97 8.97" />
            </svg>
          }
          label="On Target"
          value={stats.onTarget}
          tone="green"
        />
        <VerificationStatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M10 17l-5-5m10-2l5-5" />
            </svg>
          }
          label="Below Target"
          value={stats.below}
          tone="amber"
        />
        <VerificationStatCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          }
          label="Critical"
          value={stats.critical}
          tone="red"
        />
      </div>

      {/* Status breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="KPI Health"
          title="Target Achievement"
          hint="Distribution of KPIs by target status"
        />
        <SeverityMeter
          segments={[
            {
              label: "On Target",
              value: statusBreakdown.ON_TARGET,
              tone: "green",
            },
            {
              label: "Below",
              value: statusBreakdown.BELOW,
              tone: "amber",
            },
            {
              label: "Critical",
              value: statusBreakdown.CRITICAL,
              tone: "red",
            },
          ]}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Module
          </p>
          <FilterChipRow<"ALL" | KpiModule>
            value={moduleFilter}
            options={[
              { value: "ALL", label: "All Modules" },
              { value: "STL", label: "STL" },
              { value: "PSS", label: "PSS" },
              { value: "CRB", label: "CRB" },
              { value: "WALLET", label: "Wallet" },
              { value: "FRANCHISE", label: "Franchise" },
              { value: "COMPLAINTS", label: "Complaints" },
            ]}
            onChange={setModuleFilter}
          />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Status
          </p>
          <FilterChipRow<"ALL" | KpiStatus>
            value={statusFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "ON_TARGET", label: "On Target" },
              { value: "BELOW", label: "Below Target" },
              { value: "CRITICAL", label: "Critical" },
            ]}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* KPIs grid */}
      <VerificationRowGrid<KpiRow>
        columns={columns}
        rows={visible}
        onRowClick={setSelected}
        getRowTone={(r) => STATUS_TONE[r.status]}
        emptyIcon={
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
            <polyline points="12 12 20 7.5" />
            <polyline points="12 12 12 21" />
            <polyline points="12 12 4 7.5" />
          </svg>
        }
        emptyTitle="No KPIs match filters"
        emptyHint="Try adjusting your module or status filters to see KPIs"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "KPI detail"}
        subtitle={selected ? `${selected.kpiName} (${selected.module})` : ""}
        severity={
          selected
            ? selected.status === "CRITICAL"
              ? "critical"
              : selected.status === "BELOW"
              ? "warning"
              : "info"
            : undefined
        }
      >
        {selected ? (
          <div className="space-y-4">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell
                label="KPI Name"
                value={selected.kpiName}
              />
              <InfoCell
                label="Module"
                value={
                  <VerificationChip tone={MODULE_TONE[selected.module]} size="xs">
                    {selected.module}
                  </VerificationChip>
                }
              />
              <InfoCell
                label="Current Value"
                value={fmtValue(selected.currentValue, selected.unit)}
                mono
              />
              <InfoCell
                label="Target Value"
                value={fmtValue(selected.targetValue, selected.unit)}
                mono
              />
              <InfoCell
                label="Achievement Rate"
                value={`${((selected.currentValue / selected.targetValue) * 100).toFixed(1)}%`}
                mono
              />
              <InfoCell
                label="Trend"
                value={
                  <span
                    className={
                      selected.trend === "UP"
                        ? "text-green-400"
                        : selected.trend === "DOWN"
                        ? "text-red-400"
                        : "text-amber-400"
                    }
                  >
                    {selected.trend}
                  </span>
                }
              />
              <InfoCell
                label="Status"
                value={
                  <VerificationChip tone={STATUS_TONE[selected.status]} size="xs">
                    {selected.status}
                  </VerificationChip>
                }
              />
              <InfoCell
                label="Unit"
                value={selected.unit}
              />
            </div>

            {/* Description */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Description
              </p>
              <p className="mt-2 text-sm text-white/80">
                {selected.description}
              </p>
            </div>

            {/* Gap analysis */}
            {selected.status !== "ON_TARGET" && (
              <div className="rounded-xl border border-[#F0A030]/30 bg-[#F0A030]/8 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#F0A030]/70">
                  Gap Analysis
                </p>
                <p className="mt-2 text-sm font-semibold text-white/90">
                  Gap:{" "}
                  {fmtValue(
                    selected.targetValue - selected.currentValue,
                    selected.unit
                  )}
                </p>
                <p className="mt-1 text-[10px] text-white/60">
                  {selected.status === "CRITICAL"
                    ? "Immediate action required to meet target"
                    : "Action plan needed to close the gap"}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
