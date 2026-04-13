"use client";

/**
 * DMO — Franchise Control — In Progress
 *   - Active franchise operations being processed
 *   - Progress tracking, milestone management, blocker identification
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

type OperationStatus = "ON_TRACK" | "AT_RISK" | "BLOCKED" | "ACCELERATED";

type FranchiseOperation = {
  id: string;
  operationName: string;
  franchise: string;
  country: string;
  progress: number; // 0-100
  startedAt: string;
  estimatedCompletion: string;
  blockers: number;
  status: OperationStatus;
  milestone: string;
  assignedTo: string;
  budget: number;
  spent: number;
};

/* ── Demo data — 8 realistic active operations ── */
const DEMO: FranchiseOperation[] = [
  {
    id: "OP-FR-001",
    operationName: "Pakistan Market Expansion",
    franchise: "EHB Pakistan",
    country: "Pakistan",
    progress: 78,
    startedAt: "2026-02-15T09:00:00Z",
    estimatedCompletion: "2026-05-15T17:00:00Z",
    blockers: 0,
    status: "ON_TRACK",
    milestone: "Launch 5 new service centers",
    assignedTo: "Ahmed Hassan",
    budget: 500000,
    spent: 380000,
  },
  {
    id: "OP-FR-002",
    operationName: "Bangladesh Sub-Franchise Setup",
    franchise: "EHB Bangladesh",
    country: "Bangladesh",
    progress: 45,
    startedAt: "2026-03-01T10:30:00Z",
    estimatedCompletion: "2026-06-30T17:00:00Z",
    blockers: 1,
    status: "AT_RISK",
    milestone: "Recruit and train 3 sub-franchise operators",
    assignedTo: "Fatima Khan",
    budget: 350000,
    spent: 156000,
  },
  {
    id: "OP-FR-003",
    operationName: "UAE Compliance & CRB Integration",
    franchise: "EHB UAE",
    country: "United Arab Emirates",
    progress: 92,
    startedAt: "2026-01-10T08:00:00Z",
    estimatedCompletion: "2026-04-18T15:00:00Z",
    blockers: 0,
    status: "ON_TRACK",
    milestone: "Complete CRB certificate hashing",
    assignedTo: "Usman Raza",
    budget: 250000,
    spent: 225000,
  },
  {
    id: "OP-FR-004",
    operationName: "Sri Lanka Wallet & Payment Gateway",
    franchise: "EHB Sri Lanka",
    country: "Sri Lanka",
    progress: 38,
    startedAt: "2026-03-15T11:00:00Z",
    estimatedCompletion: "2026-07-15T17:00:00Z",
    blockers: 2,
    status: "BLOCKED",
    milestone: "Integrate 4 local payment providers",
    assignedTo: "Sara Malik",
    budget: 420000,
    spent: 160000,
  },
  {
    id: "OP-FR-005",
    operationName: "India JPS (Job Profile & Skill) Rollout",
    franchise: "EHB India",
    country: "India",
    progress: 65,
    startedAt: "2026-02-20T09:30:00Z",
    estimatedCompletion: "2026-05-30T16:00:00Z",
    blockers: 0,
    status: "ON_TRACK",
    milestone: "Onboard 500 job service providers",
    assignedTo: "Hassan Rauf",
    budget: 600000,
    spent: 390000,
  },
  {
    id: "OP-FR-006",
    operationName: "Nepal Regional PSS Deployment",
    franchise: "EHB Nepal",
    country: "Nepal",
    progress: 88,
    startedAt: "2026-01-25T10:00:00Z",
    estimatedCompletion: "2026-04-25T17:00:00Z",
    blockers: 0,
    status: "ACCELERATED",
    milestone: "Deploy KYC/KYB across 12 centers",
    assignedTo: "Amina Farah",
    budget: 280000,
    spent: 240000,
  },
  {
    id: "OP-FR-007",
    operationName: "Malaysia Affiliate System Build",
    franchise: "EHB Malaysia",
    country: "Malaysia",
    progress: 52,
    startedAt: "2026-03-10T08:30:00Z",
    estimatedCompletion: "2026-06-15T17:00:00Z",
    blockers: 1,
    status: "AT_RISK",
    milestone: "Launch multi-level referral tracking",
    assignedTo: "Muhammad Ali",
    budget: 320000,
    spent: 166000,
  },
  {
    id: "OP-FR-008",
    operationName: "Thailand GoSellr E-commerce Hub",
    franchise: "EHB Thailand",
    country: "Thailand",
    progress: 71,
    startedAt: "2026-02-01T09:00:00Z",
    estimatedCompletion: "2026-05-20T16:30:00Z",
    blockers: 0,
    status: "ON_TRACK",
    milestone: "Onboard 200+ SME merchants",
    assignedTo: "Zainab Ahmed",
    budget: 480000,
    spent: 341000,
  },
];

const STATUS_TONE: Record<OperationStatus, VerificationTone> = {
  ON_TRACK: "green",
  AT_RISK: "amber",
  BLOCKED: "red",
  ACCELERATED: "teal",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}

function fmtCurrency(num: number) {
  return `$${(num / 1000).toFixed(0)}K`;
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 overflow-hidden rounded-full bg-white/10 h-2">
        <div
          className="h-full bg-gradient-to-r from-[#2BBFA0] to-[#38C878] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold text-white/70 min-w-fit">
        {progress}%
      </span>
    </div>
  );
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

export default function FranchiseInProgressPage() {
  const [rows] = useState<FranchiseOperation[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | OperationStatus>("ALL");
  const [selected, setSelected] = useState<FranchiseOperation | null>(null);

  const stats = useMemo(() => {
    const st = {
      active: rows.length,
      onTrack: rows.filter((r) => r.status === "ON_TRACK").length,
      atRisk: rows.filter((r) => r.status === "AT_RISK").length,
      blocked: rows.filter((r) => r.status === "BLOCKED").length,
      nearDeadline: rows.filter((r) => {
        const daysUntil =
          (new Date(r.estimatedCompletion).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24);
        return daysUntil > 0 && daysUntil <= 14;
      }).length,
    };
    return st;
  }, [rows]);

  const avgProgress = useMemo(() => {
    const avg = rows.reduce((sum, r) => sum + r.progress, 0) / rows.length;
    return Math.round(avg);
  }, [rows]);

  const statusBreakdown = useMemo(() => {
    const by: Record<OperationStatus, number> = {
      ON_TRACK: 0,
      AT_RISK: 0,
      BLOCKED: 0,
      ACCELERATED: 0,
    };
    for (const r of rows) {
      by[r.status] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    return true;
  });

  const columns: RowColumn<FranchiseOperation>[] = [
    {
      key: "id",
      header: "Operation ID",
      width: "minmax(0,0.7fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.id}
        </span>
      ),
    },
    {
      key: "operationName",
      header: "Operation",
      width: "minmax(0,1.8fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {r.operationName}
          </div>
          <div className="truncate text-[10px] text-white/45">
            {r.franchise} ({r.country})
          </div>
        </div>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      width: "minmax(0,1.2fr)",
      render: (r) => <ProgressBar progress={r.progress} />,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <VerificationChip tone={STATUS_TONE[r.status]} size="xs">
          {r.status}
        </VerificationChip>
      ),
    },
    {
      key: "blockers",
      header: "Blockers",
      width: "minmax(0,0.65fr)",
      align: "center",
      render: (r) =>
        r.blockers > 0 ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F05858]/20 text-[10px] font-bold text-[#F05858]">
            {r.blockers}
          </span>
        ) : (
          <span className="text-[10px] text-white/40">—</span>
        ),
    },
    {
      key: "completion",
      header: "Est. Completion",
      width: "minmax(0,0.95fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/45">{fmtDate(r.estimatedCompletion)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #2BBFA0 25%, #7B6EF6 50%, #F0A030 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#2BBFA0]/14 via-[#7B6EF6]/10 to-transparent blur-3xl" />

        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/55">
            <Link
              href="/dmo"
              className="transition-colors hover:text-[#2BBFA0]"
            >
              DMO
            </Link>
            <span>/</span>
            <Link
              href="/dmo/franchise"
              className="transition-colors hover:text-[#2BBFA0]"
            >
              Franchise
            </Link>
            <span>/</span>
            <span className="text-white/75">In Progress</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Active Operations
          </h1>
          <p className="text-sm text-white/55">
            Monitor real-time progress on all active franchise expansion initiatives
          </p>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
          label="Active Operations"
          value={stats.active}
          tone="teal"
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
          label="On Track"
          value={stats.onTrack}
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
              <path d="M12 6v6l4 2.5" />
            </svg>
          }
          label="Near Deadline"
          value={stats.nearDeadline}
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
          label="Blocked"
          value={stats.blocked}
          tone="red"
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
              <polyline points="23 6 13.5 15.5 8 10 1 17" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          }
          label="Avg Progress"
          value={`${avgProgress}%`}
          tone="cyan"
        />
      </div>

      {/* Status breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Operations Health"
          title="Status Distribution"
          hint="Breakdown of operations by current health status"
        />
        <SeverityMeter
          segments={[
            {
              label: "On Track",
              value: statusBreakdown.ON_TRACK,
              tone: "green",
            },
            {
              label: "At Risk",
              value: statusBreakdown.AT_RISK,
              tone: "amber",
            },
            {
              label: "Blocked",
              value: statusBreakdown.BLOCKED,
              tone: "red",
            },
            {
              label: "Accelerated",
              value: statusBreakdown.ACCELERATED,
              tone: "teal",
            },
          ]}
        />
      </div>

      {/* Filters */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Filter by Status
        </p>
        <FilterChipRow<"ALL" | OperationStatus>
          value={statusFilter}
          options={[
            { value: "ALL", label: "All" },
            { value: "ON_TRACK", label: "On Track" },
            { value: "AT_RISK", label: "At Risk" },
            { value: "BLOCKED", label: "Blocked" },
            { value: "ACCELERATED", label: "Accelerated" },
          ]}
          onChange={setStatusFilter}
        />
      </div>

      {/* Operations grid */}
      <VerificationRowGrid<FranchiseOperation>
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
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        }
        emptyTitle="No operations match filters"
        emptyHint="Try adjusting your status filter to see active operations"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Operation detail"}
        subtitle={selected ? selected.operationName : ""}
        severity={
          selected
            ? selected.status === "BLOCKED"
              ? "critical"
              : selected.status === "AT_RISK"
              ? "high"
              : selected.status === "ON_TRACK"
              ? "info"
              : "warning"
            : undefined
        }
      >
        {selected ? (
          <div className="space-y-4">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell
                label="Franchise"
                value={selected.franchise}
              />
              <InfoCell
                label="Country"
                value={selected.country}
              />
              <InfoCell
                label="Assigned To"
                value={selected.assignedTo}
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
                label="Current Progress"
                value={`${selected.progress}%`}
              />
              <InfoCell
                label="Blockers"
                value={
                  selected.blockers > 0 ? (
                    <span className="font-semibold text-[#F05858]">
                      {selected.blockers} blocker(s)
                    </span>
                  ) : (
                    <span className="text-white/60">None</span>
                  )
                }
              />
              <InfoCell
                label="Started"
                value={fmtDate(selected.startedAt)}
              />
              <InfoCell
                label="Est. Completion"
                value={fmtDate(selected.estimatedCompletion)}
              />
            </div>

            {/* Budget tracking */}
            <div className="rounded-xl border border-[#7B6EF6]/30 bg-[#7B6EF6]/8 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#7B6EF6]/70">
                Budget Status
              </p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Allocated:</span>
                  <span className="font-semibold text-white">
                    {fmtCurrency(selected.budget)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Spent:</span>
                  <span className="font-semibold text-white">
                    {fmtCurrency(selected.spent)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Remaining:</span>
                  <span className="font-semibold text-[#7B6EF6]">
                    {fmtCurrency(selected.budget - selected.spent)}
                  </span>
                </div>
              </div>
            </div>

            {/* Milestone */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Current Milestone
              </p>
              <p className="mt-2 text-sm font-semibold text-white/90">
                {selected.milestone}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              {selected.status === "BLOCKED" && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#F05858]/40 bg-[#F05858]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#F05858] transition-all hover:border-[#F05858]/70 hover:bg-[#F05858]/25"
                >
                  Unblock
                </button>
              )}
              {selected.status === "AT_RISK" && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#7B6EF6] transition-all hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/25"
                >
                  Create Action Plan
                </button>
              )}
              <button
                type="button"
                className="flex-1 rounded-lg border border-[#38C878]/40 bg-[#38C878]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#38C878] transition-all hover:border-[#38C878]/70 hover:bg-[#38C878]/25"
              >
                View Timeline
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
