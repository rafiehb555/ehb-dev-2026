"use client";

/**
 * DMO — Complaints — History
 *   - Full archive of resolved/closed complaints
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

type ResolutionType = "RESOLVED_FAVOR_COMPLAINANT" | "RESOLVED_FAVOR_ENTITY" | "DISMISSED" | "WITHDRAWN";

type HistoryRow = {
  id: string;
  subject: string;
  complainantName: string;
  resolution: ResolutionType;
  resolvedAt: string;
  resolutionTime: number;
};

/* ── Demo data — 10 resolved complaints ── */
const DEMO: HistoryRow[] = [
  {
    id: "COMP-2026-0001",
    subject: "Payment delay resolved",
    complainantName: "Ahmed Hassan",
    resolution: "RESOLVED_FAVOR_COMPLAINANT",
    resolvedAt: "2026-03-28T14:30:00Z",
    resolutionTime: 7,
  },
  {
    id: "COMP-2026-0005",
    subject: "Service quality dispute settled",
    complainantName: "Noor Ahmed",
    resolution: "RESOLVED_FAVOR_ENTITY",
    resolvedAt: "2026-03-25T10:15:00Z",
    resolutionTime: 5,
  },
  {
    id: "COMP-2026-0008",
    subject: "Duplicate charge reversed",
    complainantName: "Saira Khan",
    resolution: "RESOLVED_FAVOR_COMPLAINANT",
    resolvedAt: "2026-03-22T16:45:00Z",
    resolutionTime: 3,
  },
  {
    id: "COMP-2026-0012",
    subject: "Account access restored",
    complainantName: "Hassan Malik",
    resolution: "RESOLVED_FAVOR_ENTITY",
    resolvedAt: "2026-03-20T09:00:00Z",
    resolutionTime: 8,
  },
  {
    id: "COMP-2026-0015",
    subject: "Delivery claim dismissed",
    complainantName: "Usman Raza",
    resolution: "DISMISSED",
    resolvedAt: "2026-03-18T11:30:00Z",
    resolutionTime: 4,
  },
  {
    id: "COMP-2026-0020",
    subject: "Fraudulent transaction refunded",
    complainantName: "Amina Sara",
    resolution: "RESOLVED_FAVOR_COMPLAINANT",
    resolvedAt: "2026-03-15T13:15:00Z",
    resolutionTime: 6,
  },
  {
    id: "COMP-2026-0025",
    subject: "Quality defect replacement offered",
    complainantName: "Ali Wasim",
    resolution: "RESOLVED_FAVOR_COMPLAINANT",
    resolvedAt: "2026-03-12T10:45:00Z",
    resolutionTime: 5,
  },
  {
    id: "COMP-2026-0030",
    subject: "Service cancellation request withdrawn",
    complainantName: "Fatima Noor",
    resolution: "WITHDRAWN",
    resolvedAt: "2026-03-10T15:20:00Z",
    resolutionTime: 2,
  },
  {
    id: "COMP-2026-0035",
    subject: "Billing discrepancy resolved",
    complainantName: "Muhammad Ali",
    resolution: "RESOLVED_FAVOR_ENTITY",
    resolvedAt: "2026-03-08T12:00:00Z",
    resolutionTime: 7,
  },
  {
    id: "COMP-2026-0040",
    subject: "Warranty claim denied",
    complainantName: "Sara Ahmed",
    resolution: "DISMISSED",
    resolvedAt: "2026-03-05T14:30:00Z",
    resolutionTime: 6,
  },
];

const RESOLUTION_TONE: Record<ResolutionType, VerificationTone> = {
  RESOLVED_FAVOR_COMPLAINANT: "green",
  RESOLVED_FAVOR_ENTITY: "teal",
  DISMISSED: "amber",
  WITHDRAWN: "cyan",
};

const RESOLUTION_LABEL: Record<ResolutionType, string> = {
  RESOLVED_FAVOR_COMPLAINANT: "Favored Complainant",
  RESOLVED_FAVOR_ENTITY: "Favored Entity",
  DISMISSED: "Dismissed",
  WITHDRAWN: "Withdrawn",
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

export default function HistoryPage() {
  const [rows] = useState<HistoryRow[]>(DEMO);
  const [resolutionFilter, setResolutionFilter] = useState<"ALL" | ResolutionType>("ALL");
  const [selected, setSelected] = useState<HistoryRow | null>(null);

  const stats = useMemo(() => {
    const thisMonth = rows.filter((r) => {
      const resolved = new Date(r.resolvedAt);
      const now = new Date();
      return (
        resolved.getMonth() === now.getMonth() &&
        resolved.getFullYear() === now.getFullYear()
      );
    }).length;

    const st = {
      total: rows.length,
      thisMonth,
      avgResolution:
        rows.length > 0
          ? (rows.reduce((sum, r) => sum + r.resolutionTime, 0) / rows.length).toFixed(1)
          : "0",
      satisfaction: 78,
    };
    return st;
  }, [rows]);

  const resolutionBreakdown = useMemo(() => {
    const by: Record<ResolutionType, number> = {
      RESOLVED_FAVOR_COMPLAINANT: 0,
      RESOLVED_FAVOR_ENTITY: 0,
      DISMISSED: 0,
      WITHDRAWN: 0,
    };
    for (const r of rows) {
      by[r.resolution] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (resolutionFilter !== "ALL" && r.resolution !== resolutionFilter) return false;
    return true;
  });

  const columns: RowColumn<HistoryRow>[] = [
    {
      key: "id",
      header: "Complaint ID",
      width: "minmax(0,0.85fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.id}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      width: "minmax(0,1.6fr)",
      render: (r) => (
        <div className="truncate text-sm font-semibold text-white">
          {r.subject}
        </div>
      ),
    },
    {
      key: "complainant",
      header: "Complainant",
      width: "minmax(0,1.1fr)",
      render: (r) => (
        <div className="text-sm text-white/80">{r.complainantName}</div>
      ),
    },
    {
      key: "resolution",
      header: "Resolution",
      width: "minmax(0,1.3fr)",
      render: (r) => (
        <VerificationChip tone={RESOLUTION_TONE[r.resolution]} size="xs">
          {RESOLUTION_LABEL[r.resolution]}
        </VerificationChip>
      ),
    },
    {
      key: "days",
      header: "Resolution Time (days)",
      width: "minmax(0,0.9fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-[10px] text-white/55">{r.resolutionTime}</span>
      ),
    },
    {
      key: "date",
      header: "Resolved",
      width: "minmax(0,1fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/45">{fmtTime(r.resolvedAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#38C878]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #38C878 25%, #2BBFA0 50%, #7B6EF6 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#38C878]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#38C878]/14 via-[#2BBFA0]/10 to-transparent blur-3xl" />

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
            <span className="text-white/75">History</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Complaints Archive
          </h1>
          <p className="text-sm text-white/55">
            Browse resolved and closed complaints with resolution details
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          }
          label="Total Resolved"
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2.5" />
            </svg>
          }
          label="This Month"
          value={stats.thisMonth}
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
              <path d="M8 12h8M12 8v8" />
            </svg>
          }
          label="Avg Resolution (days)"
          value={stats.avgResolution}
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
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          }
          label="Satisfaction"
          value={`${stats.satisfaction}%`}
          tone="teal"
        />
      </div>

      {/* Resolution distribution meter */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Resolution Breakdown"
          title="Complaint Resolution Types"
          hint="Distribution of resolved complaints by outcome type"
        />
        <SeverityMeter
          segments={[
            {
              label: "Favored Complainant",
              value: resolutionBreakdown.RESOLVED_FAVOR_COMPLAINANT,
              tone: "green",
            },
            {
              label: "Favored Entity",
              value: resolutionBreakdown.RESOLVED_FAVOR_ENTITY,
              tone: "teal",
            },
            {
              label: "Dismissed",
              value: resolutionBreakdown.DISMISSED,
              tone: "amber",
            },
            {
              label: "Withdrawn",
              value: resolutionBreakdown.WITHDRAWN,
              tone: "cyan",
            },
          ]}
        />
      </div>

      {/* Filter */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Filter by Resolution Type
        </p>
        <FilterChipRow<"ALL" | ResolutionType>
          value={resolutionFilter}
          options={[
            { value: "ALL", label: "All" },
            { value: "RESOLVED_FAVOR_COMPLAINANT", label: "Favored Complainant" },
            { value: "RESOLVED_FAVOR_ENTITY", label: "Favored Entity" },
            { value: "DISMISSED", label: "Dismissed" },
            { value: "WITHDRAWN", label: "Withdrawn" },
          ]}
          onChange={setResolutionFilter}
        />
      </div>

      {/* History grid */}
      <VerificationRowGrid<HistoryRow>
        columns={columns}
        rows={visible}
        onRowClick={setSelected}
        getRowTone={(r) => RESOLUTION_TONE[r.resolution]}
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
        emptyTitle="No historical records"
        emptyHint="Try adjusting your resolution filter to see complaints"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Complaint history"}
        subtitle={selected ? `${selected.subject} from ${selected.complainantName}` : ""}
        severity={
          selected
            ? selected.resolution === "RESOLVED_FAVOR_COMPLAINANT"
              ? "info"
              : selected.resolution === "RESOLVED_FAVOR_ENTITY"
              ? "info"
              : selected.resolution === "DISMISSED"
              ? "warning"
              : "info"
            : undefined
        }
      >
        {selected ? (
          <div className="space-y-4">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="Complaint ID" value={selected.id} mono />
              <InfoCell label="Subject" value={selected.subject} />
              <InfoCell label="Complainant" value={selected.complainantName} />
              <InfoCell
                label="Resolution"
                value={
                  <VerificationChip tone={RESOLUTION_TONE[selected.resolution]} size="xs">
                    {RESOLUTION_LABEL[selected.resolution]}
                  </VerificationChip>
                }
              />
              <InfoCell label="Resolution Time" value={`${selected.resolutionTime} days`} mono />
              <InfoCell label="Resolved" value={fmtTime(selected.resolvedAt)} />
            </div>

            {/* Resolution details */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Resolution Summary
              </p>
              <div className="mt-2 space-y-2 text-[10px] text-white/65">
                <p>
                  {selected.resolution === "RESOLVED_FAVOR_COMPLAINANT"
                    ? "Complaint upheld: Complainant awarded remedy"
                    : selected.resolution === "RESOLVED_FAVOR_ENTITY"
                    ? "Complaint dismissed: Entity found compliant"
                    : selected.resolution === "DISMISSED"
                    ? "Complaint dismissed: Insufficient evidence"
                    : "Complaint withdrawn: Complainant withdrew claim"}
                </p>
                <p>Resolved on {fmtTime(selected.resolvedAt)}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#7B6EF6] transition-all hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/25"
              >
                View Full Details
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg border border-[#2BBFA0]/40 bg-[#2BBFA0]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#2BBFA0] transition-all hover:border-[#2BBFA0]/70 hover:bg-[#2BBFA0]/25"
              >
                Export Report
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
