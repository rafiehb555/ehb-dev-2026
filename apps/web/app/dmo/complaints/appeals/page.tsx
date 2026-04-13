"use client";

/**
 * DMO — Complaints — Appeals
 *   - Entities appealing complaint decisions or penalties
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
  FilterChipRow,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type AppealStatus = "PENDING" | "UNDER_REVIEW" | "GRANTED" | "DENIED";

type AppealRow = {
  id: string;
  entityName: string;
  originalComplaintId: string;
  appealReason: string;
  status: AppealStatus;
  filedAt: string;
  reviewDeadline: string;
};

/* ── Demo data — 8 realistic appeals ── */
const DEMO: AppealRow[] = [
  {
    id: "APPEAL-0001",
    entityName: "TechVision Solutions Pvt Ltd",
    originalComplaintId: "COMP-2026-0847",
    appealReason: "Fine imposed incorrectly due to system error",
    status: "PENDING",
    filedAt: "2026-04-10T14:30:00Z",
    reviewDeadline: "2026-04-24T23:59:59Z",
  },
  {
    id: "APPEAL-0002",
    entityName: "Express Delivery Co",
    originalComplaintId: "COMP-2026-0851",
    appealReason: "Suspension challenged - circumstances misunderstood",
    status: "UNDER_REVIEW",
    filedAt: "2026-04-06T10:15:00Z",
    reviewDeadline: "2026-04-20T23:59:59Z",
  },
  {
    id: "APPEAL-0003",
    entityName: "Quality Retail Store",
    originalComplaintId: "COMP-2026-0855",
    appealReason: "Evidence of service completion presented",
    status: "GRANTED",
    filedAt: "2026-03-28T09:00:00Z",
    reviewDeadline: "2026-04-11T23:59:59Z",
  },
  {
    id: "APPEAL-0004",
    entityName: "Elite Trading Company",
    originalComplaintId: "COMP-2026-0858",
    appealReason: "Penality excessive for first-time offense",
    status: "UNDER_REVIEW",
    filedAt: "2026-04-04T16:45:00Z",
    reviewDeadline: "2026-04-18T23:59:59Z",
  },
  {
    id: "APPEAL-0005",
    entityName: "Global Commerce Hub",
    originalComplaintId: "COMP-2026-0862",
    appealReason: "Permanent ban should be reviewed after restructuring",
    status: "PENDING",
    filedAt: "2026-04-08T13:20:00Z",
    reviewDeadline: "2026-04-22T23:59:59Z",
  },
  {
    id: "APPEAL-0006",
    entityName: "Premium Services Ltd",
    originalComplaintId: "COMP-2026-0865",
    appealReason: "Complaint dismissed without proper evidence",
    status: "DENIED",
    filedAt: "2026-04-02T11:00:00Z",
    reviewDeadline: "2026-04-16T23:59:59Z",
  },
  {
    id: "APPEAL-0007",
    entityName: "Rapid Logistics Inc",
    originalComplaintId: "COMP-2026-0868",
    appealReason: "New documentation contradicts decision",
    status: "GRANTED",
    filedAt: "2026-03-25T15:30:00Z",
    reviewDeadline: "2026-04-08T23:59:59Z",
  },
  {
    id: "APPEAL-0008",
    entityName: "Digital Market Place",
    originalComplaintId: "COMP-2026-0871",
    appealReason: "Jurisdiction challenge - case belongs to arbitration",
    status: "PENDING",
    filedAt: "2026-04-09T10:45:00Z",
    reviewDeadline: "2026-04-23T23:59:59Z",
  },
];

const STATUS_TONE: Record<AppealStatus, VerificationTone> = {
  PENDING: "purple",
  UNDER_REVIEW: "amber",
  GRANTED: "green",
  DENIED: "red",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

function daysUntil(iso: string): number {
  const deadline = new Date(iso).getTime();
  const now = new Date().getTime();
  return Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
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

export default function AppealsPage() {
  const [rows] = useState<AppealRow[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | AppealStatus>("ALL");
  const [selected, setSelected] = useState<AppealRow | null>(null);

  const stats = useMemo(() => {
    const st = {
      total: rows.length,
      pending: rows.filter((r) => r.status === "PENDING").length,
      underReview: rows.filter((r) => r.status === "UNDER_REVIEW").length,
      granted: rows.filter((r) => r.status === "GRANTED").length,
      denied: rows.filter((r) => r.status === "DENIED").length,
    };
    return st;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    return true;
  });

  const columns: RowColumn<AppealRow>[] = [
    {
      key: "id",
      header: "Appeal ID",
      width: "minmax(0,0.85fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.id}
        </span>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      width: "minmax(0,1.4fr)",
      render: (r) => (
        <div className="truncate text-sm font-semibold text-white">
          {r.entityName}
        </div>
      ),
    },
    {
      key: "reason",
      header: "Appeal Reason",
      width: "minmax(0,1.8fr)",
      render: (r) => (
        <div className="line-clamp-2 text-sm text-white/75">
          {r.appealReason}
        </div>
      ),
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
    {
      key: "deadline",
      header: "Days Left",
      width: "minmax(0,0.7fr)",
      align: "right",
      render: (r) => {
        const days = daysUntil(r.reviewDeadline);
        const tone: VerificationTone =
          days < 0 ? "red" : days < 7 ? "amber" : "green";
        return (
          <span
            className={`font-mono text-[10px] ${
              tone === "red"
                ? "text-red-400"
                : tone === "amber"
                ? "text-amber-400"
                : "text-green-400"
            }`}
          >
            {days > 0 ? days : "Expired"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #38C878 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#7B6EF6]/14 via-[#2BBFA0]/10 to-transparent blur-3xl" />

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
            <span className="text-white/75">Appeals</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Complaint Appeals
          </h1>
          <p className="text-sm text-white/55">
            Manage appeals against complaint decisions and penalties
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          }
          label="Total Appeals"
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
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          }
          label="Pending"
          value={stats.pending}
          tone="purple"
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
          label="Under Review"
          value={stats.underReview}
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4l-8.97 8.97" />
            </svg>
          }
          label="Granted"
          value={stats.granted}
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
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          }
          label="Denied"
          value={stats.denied}
          tone="red"
        />
      </div>

      {/* Filter */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Filter by Status
        </p>
        <FilterChipRow<"ALL" | AppealStatus>
          value={statusFilter}
          options={[
            { value: "ALL", label: "All" },
            { value: "PENDING", label: "Pending" },
            { value: "UNDER_REVIEW", label: "Under Review" },
            { value: "GRANTED", label: "Granted" },
            { value: "DENIED", label: "Denied" },
          ]}
          onChange={setStatusFilter}
        />
      </div>

      {/* Appeals grid */}
      <VerificationRowGrid<AppealRow>
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4l-8.97 8.97" />
          </svg>
        }
        emptyTitle="No appeals"
        emptyHint="Try adjusting your status filter to see appeals"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Appeal detail"}
        subtitle={selected ? `Appeal from ${selected.entityName}` : ""}
        severity={
          selected
            ? selected.status === "PENDING"
              ? "info"
              : selected.status === "UNDER_REVIEW"
              ? "warning"
              : selected.status === "GRANTED"
              ? "info"
              : "high"
            : undefined
        }
      >
        {selected ? (
          <div className="space-y-4">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="Appeal ID" value={selected.id} mono />
              <InfoCell label="Entity Name" value={selected.entityName} />
              <InfoCell
                label="Original Complaint"
                value={selected.originalComplaintId}
                mono
              />
              <InfoCell
                label="Status"
                value={
                  <VerificationChip tone={STATUS_TONE[selected.status]}>
                    {selected.status}
                  </VerificationChip>
                }
              />
              <InfoCell label="Filed" value={fmtTime(selected.filedAt)} />
              <InfoCell label="Deadline" value={fmtTime(selected.reviewDeadline)} />
            </div>

            {/* Appeal reason */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Appeal Reason
              </p>
              <p className="mt-2 text-sm text-white/80">
                {selected.appealReason}
              </p>
            </div>

            {/* Original complaint summary */}
            <div className="rounded-xl border border-[#2BBFA0]/20 bg-[#2BBFA0]/8 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#2BBFA0]/70">
                Original Complaint Summary
              </p>
              <p className="mt-2 text-[10px] text-white/75">
                Reference: {selected.originalComplaintId}
              </p>
              <p className="mt-1 text-[10px] text-white/65">
                Appeal evidence and reviewer notes pending in full case review.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              {selected.status === "PENDING" && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#F0A030]/40 bg-[#F0A030]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#F0A030] transition-all hover:border-[#F0A030]/70 hover:bg-[#F0A030]/25"
                >
                  Start Review
                </button>
              )}
              {selected.status === "UNDER_REVIEW" && (
                <>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-[#38C878]/40 bg-[#38C878]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#38C878] transition-all hover:border-[#38C878]/70 hover:bg-[#38C878]/25"
                  >
                    Grant Appeal
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-[#F05858]/40 bg-[#F05858]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#F05858] transition-all hover:border-[#F05858]/70 hover:bg-[#F05858]/25"
                  >
                    Deny Appeal
                  </button>
                </>
              )}
              {(selected.status === "GRANTED" || selected.status === "DENIED") && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#7B6EF6] transition-all hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/25"
                >
                  View Decision
                </button>
              )}
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
