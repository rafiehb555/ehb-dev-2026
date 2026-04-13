"use client";

/**
 * DMO — Complaints — Penalty Ladder
 *   - Progressive penalty/warning system for repeat offenders
 *   - 5-level ladder: Warning, Fine, Suspension, STL Downgrade, Permanent Ban
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
  SeverityMeter,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type PenaltyLevel = 1 | 2 | 3 | 4 | 5;

type PenaltyLadderRow = {
  id: string;
  entityName: string;
  currentLevel: PenaltyLevel;
  totalComplaints: number;
  lastAction: string;
  lastActionDate: string;
  stlLevel: number;
};

/* ── Demo data — 8 realistic penalty ladder cases ── */
const DEMO: PenaltyLadderRow[] = [
  {
    id: "PLR-0001",
    entityName: "TechVision Solutions Pvt Ltd",
    currentLevel: 2,
    totalComplaints: 6,
    lastAction: "Fine Issued",
    lastActionDate: "2026-04-08T10:00:00Z",
    stlLevel: 4,
  },
  {
    id: "PLR-0002",
    entityName: "Express Delivery Co",
    currentLevel: 3,
    totalComplaints: 15,
    lastAction: "Suspension Initiated",
    lastActionDate: "2026-04-05T14:30:00Z",
    stlLevel: 2,
  },
  {
    id: "PLR-0003",
    entityName: "Quality Retail Store",
    currentLevel: 1,
    totalComplaints: 2,
    lastAction: "Warning Issued",
    lastActionDate: "2026-04-10T09:15:00Z",
    stlLevel: 6,
  },
  {
    id: "PLR-0004",
    entityName: "Elite Trading Company",
    currentLevel: 4,
    totalComplaints: 28,
    lastAction: "STL Downgrade Applied",
    lastActionDate: "2026-04-01T11:45:00Z",
    stlLevel: 1,
  },
  {
    id: "PLR-0005",
    entityName: "Global Commerce Hub",
    currentLevel: 5,
    totalComplaints: 42,
    lastAction: "Permanent Ban Issued",
    lastActionDate: "2026-03-25T16:20:00Z",
    stlLevel: 0,
  },
  {
    id: "PLR-0006",
    entityName: "Premium Services Ltd",
    currentLevel: 1,
    totalComplaints: 1,
    lastAction: "Warning Issued",
    lastActionDate: "2026-04-09T13:00:00Z",
    stlLevel: 7,
  },
  {
    id: "PLR-0007",
    entityName: "Rapid Logistics Inc",
    currentLevel: 3,
    totalComplaints: 18,
    lastAction: "Suspension Initiated",
    lastActionDate: "2026-04-02T10:30:00Z",
    stlLevel: 1,
  },
  {
    id: "PLR-0008",
    entityName: "Digital Market Place",
    currentLevel: 2,
    totalComplaints: 8,
    lastAction: "Fine Issued",
    lastActionDate: "2026-04-06T15:15:00Z",
    stlLevel: 3,
  },
];

const LEVEL_TONE: Record<PenaltyLevel, VerificationTone> = {
  1: "green",
  2: "amber",
  3: "amber",
  4: "red",
  5: "red",
};

const LEVEL_LABEL: Record<PenaltyLevel, string> = {
  1: "Warning",
  2: "Fine",
  3: "Suspension",
  4: "STL Downgrade",
  5: "Permanent Ban",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
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

export default function PenaltyLadderPage() {
  const [rows] = useState<PenaltyLadderRow[]>(DEMO);
  const [selected, setSelected] = useState<PenaltyLadderRow | null>(null);

  const stats = useMemo(() => {
    const st = {
      total: rows.length,
      warning: rows.filter((r) => r.currentLevel === 1).length,
      fine: rows.filter((r) => r.currentLevel === 2).length,
      suspended: rows.filter((r) => r.currentLevel === 3).length,
      downgraded: rows.filter((r) => r.currentLevel === 4).length,
      banned: rows.filter((r) => r.currentLevel === 5).length,
    };
    return st;
  }, [rows]);

  const columns: RowColumn<PenaltyLadderRow>[] = [
    {
      key: "id",
      header: "Entity ID",
      width: "minmax(0,0.8fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.id}
        </span>
      ),
    },
    {
      key: "entityName",
      header: "Entity Name",
      width: "minmax(0,1.6fr)",
      render: (r) => (
        <div className="truncate text-sm font-semibold text-white">
          {r.entityName}
        </div>
      ),
    },
    {
      key: "level",
      header: "Penalty Level",
      width: "minmax(0,1.1fr)",
      render: (r) => (
        <div className="flex items-center gap-2">
          <VerificationChip tone={LEVEL_TONE[r.currentLevel]} size="xs">
            L{r.currentLevel}
          </VerificationChip>
          <span className="text-[10px] text-white/65">
            {LEVEL_LABEL[r.currentLevel]}
          </span>
        </div>
      ),
    },
    {
      key: "complaints",
      header: "Total Complaints",
      width: "minmax(0,0.8fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-[10px] text-white/55">{r.totalComplaints}</span>
      ),
    },
    {
      key: "stl",
      header: "STL Level",
      width: "minmax(0,0.7fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-[10px] text-white/55">{r.stlLevel}</span>
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
              "linear-gradient(90deg, transparent 0%, #F0A030 25%, #F05858 50%, #7B6EF6 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F0A030]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#F05858]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#F0A030]/14 via-[#F05858]/10 to-transparent blur-3xl" />

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
              href="/dmo/complaints"
              className="transition-colors hover:text-[#7B6EF6]"
            >
              Complaints
            </Link>
            <span>/</span>
            <span className="text-white/75">Penalty Ladder</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Penalty Ladder
          </h1>
          <p className="text-sm text-white/55">
            Progressive penalty system for entities with repeat compliance issues
          </p>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
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
          label="Total Entities"
          value={stats.total}
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
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Warning (L1)"
          value={stats.warning}
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
              <path d="M12 8v4l3 2" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Fine (L2)"
          value={stats.fine}
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
              <path d="M6 9h12M6 9l1.5-3h9l1.5 3" />
              <path d="M6 9v10a1 1 0 001 1h10a1 1 0 001-1V9" />
            </svg>
          }
          label="Suspended (L3)"
          value={stats.suspended}
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
              <path d="M12 9v2m0 4v2m-9-10h18M3 8v11a2 2 0 002 2h14a2 2 0 002-2V8" />
            </svg>
          }
          label="Downgraded (L4)"
          value={stats.downgraded}
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
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          }
          label="Banned (L5)"
          value={stats.banned}
          tone="red"
        />
      </div>

      {/* Level distribution meter */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Penalty Distribution"
          title="Entity Ladder Distribution"
          hint="Distribution across the 5-level penalty ladder"
        />
        <SeverityMeter
          segments={[
            {
              label: "Warning",
              value: stats.warning,
              tone: "green",
            },
            {
              label: "Fine",
              value: stats.fine,
              tone: "amber",
            },
            {
              label: "Suspended",
              value: stats.suspended,
              tone: "amber",
            },
            {
              label: "Downgraded",
              value: stats.downgraded,
              tone: "red",
            },
            {
              label: "Banned",
              value: stats.banned,
              tone: "red",
            },
          ]}
        />
      </div>

      {/* Ladder grid */}
      <VerificationRowGrid<PenaltyLadderRow>
        columns={columns}
        rows={rows}
        onRowClick={setSelected}
        getRowTone={(r) => LEVEL_TONE[r.currentLevel]}
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4l-8.97 8.97" />
          </svg>
        }
        emptyTitle="No penalty ladder entries"
        emptyHint="All entities are in good standing"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Penalty detail"}
        subtitle={selected ? `${selected.entityName} - ${LEVEL_LABEL[selected.currentLevel]}` : ""}
        severity={
          selected
            ? selected.currentLevel === 5
              ? "critical"
              : selected.currentLevel === 4
              ? "high"
              : selected.currentLevel === 3
              ? "high"
              : selected.currentLevel === 2
              ? "warning"
              : "info"
            : undefined
        }
      >
        {selected ? (
          <div className="space-y-4">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="Entity ID" value={selected.id} mono />
              <InfoCell label="Entity Name" value={selected.entityName} />
              <InfoCell
                label="Current Level"
                value={
                  <div className="flex items-center gap-2">
                    <VerificationChip tone={LEVEL_TONE[selected.currentLevel]} size="xs">
                      L{selected.currentLevel}
                    </VerificationChip>
                    <span className="text-[10px]">
                      {LEVEL_LABEL[selected.currentLevel]}
                    </span>
                  </div>
                }
              />
              <InfoCell
                label="Total Complaints"
                value={selected.totalComplaints}
                mono
              />
              <InfoCell label="STL Level" value={selected.stlLevel} mono />
              <InfoCell label="Last Action" value={selected.lastAction} />
              <InfoCell
                label="Last Action Date"
                value={fmtTime(selected.lastActionDate)}
              />
              <InfoCell
                label="Days Since"
                value={Math.floor(
                  (new Date().getTime() - new Date(selected.lastActionDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
                mono
              />
            </div>

            {/* Escalation path */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Escalation Path
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px]">
                <div className={`flex flex-col items-center gap-1 px-2 ${selected.currentLevel >= 1 ? "text-green-400" : "text-white/30"}`}>
                  <div className="h-2 w-2 rounded-full" />
                  <span>Warning</span>
                </div>
                <div className={`h-0.5 flex-1 mx-1 ${selected.currentLevel >= 2 ? "bg-amber-400" : "bg-white/10"}`} />
                <div className={`flex flex-col items-center gap-1 px-2 ${selected.currentLevel >= 2 ? "text-amber-400" : "text-white/30"}`}>
                  <div className="h-2 w-2 rounded-full" />
                  <span>Fine</span>
                </div>
                <div className={`h-0.5 flex-1 mx-1 ${selected.currentLevel >= 3 ? "bg-amber-400" : "bg-white/10"}`} />
                <div className={`flex flex-col items-center gap-1 px-2 ${selected.currentLevel >= 3 ? "text-amber-400" : "text-white/30"}`}>
                  <div className="h-2 w-2 rounded-full" />
                  <span>Suspended</span>
                </div>
                <div className={`h-0.5 flex-1 mx-1 ${selected.currentLevel >= 4 ? "bg-red-400" : "bg-white/10"}`} />
                <div className={`flex flex-col items-center gap-1 px-2 ${selected.currentLevel >= 4 ? "text-red-400" : "text-white/30"}`}>
                  <div className="h-2 w-2 rounded-full" />
                  <span>Downgrade</span>
                </div>
                <div className={`h-0.5 flex-1 mx-1 ${selected.currentLevel >= 5 ? "bg-red-500" : "bg-white/10"}`} />
                <div className={`flex flex-col items-center gap-1 px-2 ${selected.currentLevel >= 5 ? "text-red-500" : "text-white/30"}`}>
                  <div className="h-2 w-2 rounded-full" />
                  <span>Ban</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#7B6EF6] transition-all hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/25"
              >
                Review History
              </button>
              {selected.currentLevel < 5 && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#F0A030]/40 bg-[#F0A030]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#F0A030] transition-all hover:border-[#F0A030]/70 hover:bg-[#F0A030]/25"
                >
                  Escalate Level
                </button>
              )}
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
