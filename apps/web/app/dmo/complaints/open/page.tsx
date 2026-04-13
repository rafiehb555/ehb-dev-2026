"use client";

/**
 * DMO — Complaints — Open
 *   - Active complaints awaiting resolution
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
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type ComplaintCategory = "SERVICE_QUALITY" | "PAYMENT" | "FRAUD" | "DELIVERY" | "ACCOUNT";
type ComplaintPriority = "URGENT" | "HIGH" | "NORMAL";

type OpenComplaintRow = {
  id: string;
  subject: string;
  complainantName: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  assignedTo: string;
  createdAt: string;
  daysSinceOpen: number;
};

/* ── Demo data — 8 realistic open complaints ── */
const DEMO: OpenComplaintRow[] = [
  {
    id: "COMP-2026-0847",
    subject: "Payment not received after 10 days",
    complainantName: "Muhammad Hassan",
    category: "PAYMENT",
    priority: "URGENT",
    assignedTo: "Resolver_KCH01",
    createdAt: "2026-04-02T14:30:00Z",
    daysSinceOpen: 10,
  },
  {
    id: "COMP-2026-0851",
    subject: "Fraudulent transaction on account",
    complainantName: "Saira Ahmed",
    category: "FRAUD",
    priority: "URGENT",
    assignedTo: "Resolver_ISB02",
    createdAt: "2026-04-01T09:15:00Z",
    daysSinceOpen: 11,
  },
  {
    id: "COMP-2026-0855",
    subject: "Delivery package marked complete but not received",
    complainantName: "Usman Malik",
    category: "DELIVERY",
    priority: "HIGH",
    assignedTo: "Resolver_LHR03",
    createdAt: "2026-04-08T11:20:00Z",
    daysSinceOpen: 4,
  },
  {
    id: "COMP-2026-0858",
    subject: "Account access unauthorized after password change",
    complainantName: "Fatima Khan",
    category: "ACCOUNT",
    priority: "HIGH",
    assignedTo: "Resolver_PKH01",
    createdAt: "2026-04-09T16:45:00Z",
    daysSinceOpen: 3,
  },
  {
    id: "COMP-2026-0862",
    subject: "Service not rendered as per contract",
    complainantName: "Ali Raza",
    category: "SERVICE_QUALITY",
    priority: "NORMAL",
    assignedTo: "Resolver_KCH02",
    createdAt: "2026-04-10T10:00:00Z",
    daysSinceOpen: 2,
  },
  {
    id: "COMP-2026-0865",
    subject: "Incorrect billing amount charged twice",
    complainantName: "Noor Ahmed",
    category: "PAYMENT",
    priority: "HIGH",
    assignedTo: "Resolver_ISB01",
    createdAt: "2026-04-09T13:30:00Z",
    daysSinceOpen: 3,
  },
  {
    id: "COMP-2026-0868",
    subject: "Quality defects in received shipment",
    complainantName: "Hassan Wasim",
    category: "SERVICE_QUALITY",
    priority: "NORMAL",
    assignedTo: "Resolver_LHR01",
    createdAt: "2026-04-11T08:00:00Z",
    daysSinceOpen: 1,
  },
  {
    id: "COMP-2026-0871",
    subject: "Delivery delay beyond promised timeline",
    complainantName: "Amina Sara",
    category: "DELIVERY",
    priority: "NORMAL",
    assignedTo: "Resolver_PKH02",
    createdAt: "2026-04-11T15:00:00Z",
    daysSinceOpen: 0,
  },
];

const CATEGORY_TONE: Record<ComplaintCategory, VerificationTone> = {
  SERVICE_QUALITY: "amber",
  PAYMENT: "purple",
  FRAUD: "red",
  DELIVERY: "cyan",
  ACCOUNT: "teal",
};

const PRIORITY_TONE: Record<ComplaintPriority, VerificationTone> = {
  URGENT: "red",
  HIGH: "amber",
  NORMAL: "green",
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

export default function OpenComplaintsPage() {
  const [rows] = useState<OpenComplaintRow[]>(DEMO);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | ComplaintCategory>("ALL");
  const [selected, setSelected] = useState<OpenComplaintRow | null>(null);

  const stats = useMemo(() => {
    const st = {
      total: rows.length,
      urgent: rows.filter((r) => r.priority === "URGENT").length,
      avgAge: rows.length > 0
        ? (rows.reduce((sum, r) => sum + r.daysSinceOpen, 0) / rows.length).toFixed(1)
        : "0",
      assigned: rows.filter((r) => r.assignedTo).length,
    };
    return st;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (categoryFilter !== "ALL" && r.category !== categoryFilter) return false;
    return true;
  });

  const columns: RowColumn<OpenComplaintRow>[] = [
    {
      key: "id",
      header: "Complaint ID",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.id}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      width: "minmax(0,1.8fr)",
      render: (r) => (
        <div className="truncate text-sm font-semibold text-white">
          {r.subject}
        </div>
      ),
    },
    {
      key: "complainant",
      header: "Complainant",
      width: "minmax(0,1.2fr)",
      render: (r) => (
        <div className="text-sm text-white/80">{r.complainantName}</div>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <VerificationChip tone={CATEGORY_TONE[r.category]} size="xs">
          {r.category}
        </VerificationChip>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      width: "minmax(0,0.8fr)",
      render: (r) => (
        <VerificationChip tone={PRIORITY_TONE[r.priority]} size="xs">
          {r.priority}
        </VerificationChip>
      ),
    },
    {
      key: "days",
      header: "Days Open",
      width: "minmax(0,0.7fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-[10px] text-white/55">{r.daysSinceOpen}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#F05858]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #F05858 25%, #7B6EF6 50%, #2BBFA0 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F05858]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#F05858]/14 via-[#7B6EF6]/10 to-transparent blur-3xl" />

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
            <span className="text-white/75">Open</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Open Complaints
          </h1>
          <p className="text-sm text-white/55">
            Monitor active complaints awaiting resolution and assignment
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
          label="Open Complaints"
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
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 6 15 14 23 14 17 20 19 28 12 24 5 28 7 20 1 14 9 14" />
            </svg>
          }
          label="Urgent"
          value={stats.urgent}
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2.5" />
            </svg>
          }
          label="Avg Age (days)"
          value={stats.avgAge}
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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          label="Assigned"
          value={stats.assigned}
          tone="green"
        />
      </div>

      {/* Filter */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Filter by Category
        </p>
        <FilterChipRow<"ALL" | ComplaintCategory>
          value={categoryFilter}
          options={[
            { value: "ALL", label: "All" },
            { value: "SERVICE_QUALITY", label: "Service Quality" },
            { value: "PAYMENT", label: "Payment" },
            { value: "FRAUD", label: "Fraud" },
            { value: "DELIVERY", label: "Delivery" },
            { value: "ACCOUNT", label: "Account" },
          ]}
          onChange={setCategoryFilter}
        />
      </div>

      {/* Complaints grid */}
      <VerificationRowGrid<OpenComplaintRow>
        columns={columns}
        rows={visible}
        onRowClick={setSelected}
        getRowTone={(r) => PRIORITY_TONE[r.priority]}
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
        emptyTitle="No open complaints"
        emptyHint="Try adjusting your category filter to see complaints"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Complaint detail"}
        subtitle={selected ? `${selected.category} complaint from ${selected.complainantName}` : ""}
        severity={
          selected
            ? selected.priority === "URGENT"
              ? "critical"
              : selected.priority === "HIGH"
              ? "high"
              : "warning"
            : undefined
        }
      >
        {selected ? (
          <div className="space-y-4">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="Complaint ID" value={selected.id} mono />
              <InfoCell
                label="Subject"
                value={
                  <span className="block truncate text-sm">{selected.subject}</span>
                }
              />
              <InfoCell label="Complainant" value={selected.complainantName} />
              <InfoCell
                label="Category"
                value={
                  <VerificationChip tone={CATEGORY_TONE[selected.category]} size="xs">
                    {selected.category}
                  </VerificationChip>
                }
              />
              <InfoCell
                label="Priority"
                value={
                  <VerificationChip tone={PRIORITY_TONE[selected.priority]} size="xs">
                    {selected.priority}
                  </VerificationChip>
                }
              />
              <InfoCell label="Days Open" value={selected.daysSinceOpen} />
              <InfoCell
                label="Created"
                value={fmtTime(selected.createdAt)}
              />
              <InfoCell
                label="Assigned To"
                value={selected.assignedTo}
                mono
              />
            </div>

            {/* Timeline placeholder */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Complaint Timeline
              </p>
              <div className="mt-2 space-y-2 text-[10px] text-white/65">
                <p>• Opened on {fmtTime(selected.createdAt)}</p>
                <p>• Assigned to {selected.assignedTo}</p>
                <p>• Awaiting resolution update</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#7B6EF6] transition-all hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/25"
              >
                Update Status
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg border border-[#F0A030]/40 bg-[#F0A030]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#F0A030] transition-all hover:border-[#F0A030]/70 hover:bg-[#F0A030]/25"
              >
                Escalate
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
