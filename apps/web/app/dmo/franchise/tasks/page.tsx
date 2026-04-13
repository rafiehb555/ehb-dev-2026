"use client";

/**
 * DMO — Franchise Control — Tasks
 *   - Open tasks assigned to franchise managers
 *   - Task tracking, priority management, escalation tracking
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

type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
type TaskStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";

type FranchiseTask = {
  id: string;
  title: string;
  assignee: string;
  franchise: string;
  country: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  description: string;
  createdAt: string;
};

/* ── Demo data — 8 realistic franchise tasks ── */
const DEMO: FranchiseTask[] = [
  {
    id: "TASK-FR-001",
    title: "Quarterly STL Compliance Review",
    assignee: "Ahmed Hassan",
    franchise: "EHB Pakistan",
    country: "Pakistan",
    priority: "HIGH",
    dueDate: "2026-04-14T17:00:00Z",
    status: "OPEN",
    description: "Complete Q2 STL compliance audit for all service providers",
    createdAt: "2026-04-08T09:00:00Z",
  },
  {
    id: "TASK-FR-002",
    title: "Onboard New Service Providers",
    assignee: "Fatima Khan",
    franchise: "EHB Bangladesh",
    country: "Bangladesh",
    priority: "HIGH",
    dueDate: "2026-04-12T18:00:00Z",
    status: "OVERDUE",
    description: "Process and verify 12 new GoSellr merchant applications",
    createdAt: "2026-04-05T10:30:00Z",
  },
  {
    id: "TASK-FR-003",
    title: "Update Franchise Agreement Templates",
    assignee: "Usman Raza",
    franchise: "EHB UAE",
    country: "United Arab Emirates",
    priority: "MEDIUM",
    dueDate: "2026-04-20T16:00:00Z",
    status: "IN_PROGRESS",
    description: "Revise T&C and payment terms for Phase-2 industries",
    createdAt: "2026-04-09T11:15:00Z",
  },
  {
    id: "TASK-FR-004",
    title: "Resolve Escalated Payment Dispute",
    assignee: "Sara Malik",
    franchise: "EHB Sri Lanka",
    country: "Sri Lanka",
    priority: "HIGH",
    dueDate: "2026-04-13T14:00:00Z",
    status: "IN_PROGRESS",
    description: "Mediate payment dispute between franchise and 3 service providers",
    createdAt: "2026-04-11T08:45:00Z",
  },
  {
    id: "TASK-FR-005",
    title: "Deploy Regional CRB Verification",
    assignee: "Hassan Rauf",
    franchise: "EHB India",
    country: "India",
    priority: "MEDIUM",
    dueDate: "2026-04-25T17:00:00Z",
    status: "OPEN",
    description: "Roll out CRB integration for 50+ regional service centers",
    createdAt: "2026-04-10T13:20:00Z",
  },
  {
    id: "TASK-FR-006",
    title: "Audit Sub-Franchise Operations",
    assignee: "Amina Farah",
    franchise: "EHB Nepal",
    country: "Nepal",
    priority: "MEDIUM",
    dueDate: "2026-04-22T15:00:00Z",
    status: "COMPLETED",
    description: "Verify compliance of all sub-franchise partners in Kathmandu",
    createdAt: "2026-04-01T09:30:00Z",
  },
  {
    id: "TASK-FR-007",
    title: "Launch Affiliate Program",
    assignee: "Muhammad Ali",
    franchise: "EHB Malaysia",
    country: "Malaysia",
    priority: "LOW",
    dueDate: "2026-05-01T18:00:00Z",
    status: "OPEN",
    description: "Set up multi-level referral tracking system and commissions",
    createdAt: "2026-04-06T10:00:00Z",
  },
  {
    id: "TASK-FR-008",
    title: "Franchise Partner Training",
    assignee: "Zainab Ahmed",
    franchise: "EHB Thailand",
    country: "Thailand",
    priority: "LOW",
    dueDate: "2026-04-28T16:30:00Z",
    status: "OPEN",
    description: "Conduct monthly DMO platform training for 8 franchise managers",
    createdAt: "2026-04-07T14:00:00Z",
  },
];

const STATUS_TONE: Record<TaskStatus, VerificationTone> = {
  OPEN: "purple",
  IN_PROGRESS: "amber",
  COMPLETED: "green",
  OVERDUE: "red",
};

const PRIORITY_TONE: Record<TaskPriority, VerificationTone> = {
  HIGH: "red",
  MEDIUM: "amber",
  LOW: "teal",
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

export default function FranchiseTasksPage() {
  const [rows] = useState<FranchiseTask[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | TaskStatus>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | TaskPriority>("ALL");
  const [selected, setSelected] = useState<FranchiseTask | null>(null);

  const stats = useMemo(() => {
    const st = {
      total: rows.filter((r) => r.status !== "COMPLETED").length,
      open: rows.filter((r) => r.status === "OPEN").length,
      inProgress: rows.filter((r) => r.status === "IN_PROGRESS").length,
      overdue: rows.filter((r) => r.status === "OVERDUE").length,
      completed: rows.filter((r) => r.status === "COMPLETED").length,
    };
    return st;
  }, [rows]);

  const avgResolution = useMemo(() => {
    const completed = rows.filter((r) => r.status === "COMPLETED");
    if (completed.length === 0) return 0;
    const avg = completed.reduce((sum, r) => {
      const created = new Date(r.createdAt).getTime();
      const due = new Date(r.dueDate).getTime();
      const diff = (due - created) / (1000 * 60 * 60); // hours
      return sum + Math.abs(diff);
    }, 0) / completed.length;
    return (avg / 24).toFixed(1); // convert to days
  }, [rows]);

  const priorityBreakdown = useMemo(() => {
    const by: Record<TaskPriority, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    for (const r of rows.filter((t) => t.status !== "COMPLETED")) {
      by[r.priority] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (priorityFilter !== "ALL" && r.priority !== priorityFilter) return false;
    return true;
  });

  const columns: RowColumn<FranchiseTask>[] = [
    {
      key: "id",
      header: "Task ID",
      width: "minmax(0,0.75fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.id}
        </span>
      ),
    },
    {
      key: "title",
      header: "Title",
      width: "minmax(0,2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {r.title}
          </div>
          <div className="truncate text-[10px] text-white/45">
            {r.franchise} ({r.country})
          </div>
        </div>
      ),
    },
    {
      key: "assignee",
      header: "Assignee",
      width: "minmax(0,1fr)",
      render: (r) => (
        <span className="text-sm text-white/85">{r.assignee}</span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      width: "minmax(0,0.75fr)",
      render: (r) => (
        <VerificationChip tone={PRIORITY_TONE[r.priority]} size="xs">
          {r.priority}
        </VerificationChip>
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
      key: "dueDate",
      header: "Due Date",
      width: "minmax(0,0.95fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/45">{fmtDate(r.dueDate)}</span>
      ),
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
              "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)",
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
              href="/dmo/franchise"
              className="transition-colors hover:text-[#7B6EF6]"
            >
              Franchise
            </Link>
            <span>/</span>
            <span className="text-white/75">Tasks</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Franchise Tasks
          </h1>
          <p className="text-sm text-white/55">
            Track and manage franchise manager assignments across all territories
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
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Open Tasks"
          value={stats.open}
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
              <path d="M12 6v6l4 2.5" />
            </svg>
          }
          label="Overdue"
          value={stats.overdue}
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
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
          label="In Progress"
          value={stats.inProgress}
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
          label="Completed Today"
          value={stats.completed}
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          }
          label="Avg Resolution"
          value={`${avgResolution}d`}
          tone="teal"
        />
      </div>

      {/* Priority breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Task Distribution"
          title="Active Task Priorities"
          hint="Breakdown of open and in-progress tasks by priority level"
        />
        <SeverityMeter
          segments={[
            {
              label: "High",
              value: priorityBreakdown.HIGH,
              tone: "red",
            },
            {
              label: "Medium",
              value: priorityBreakdown.MEDIUM,
              tone: "amber",
            },
            {
              label: "Low",
              value: priorityBreakdown.LOW,
              tone: "teal",
            },
          ]}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Status
          </p>
          <FilterChipRow<"ALL" | TaskStatus>
            value={statusFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "OPEN", label: "Open" },
              { value: "IN_PROGRESS", label: "In Progress" },
              { value: "COMPLETED", label: "Completed" },
              { value: "OVERDUE", label: "Overdue" },
            ]}
            onChange={setStatusFilter}
          />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Priority
          </p>
          <FilterChipRow<"ALL" | TaskPriority>
            value={priorityFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "HIGH", label: "High" },
              { value: "MEDIUM", label: "Medium" },
              { value: "LOW", label: "Low" },
            ]}
            onChange={setPriorityFilter}
          />
        </div>
      </div>

      {/* Tasks grid */}
      <VerificationRowGrid<FranchiseTask>
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
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        emptyTitle="No tasks match filters"
        emptyHint="Try adjusting your status or priority filters to see tasks"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Task detail"}
        subtitle={selected ? selected.title : ""}
        severity={
          selected
            ? selected.priority === "HIGH"
              ? "high"
              : selected.priority === "MEDIUM"
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
                label="Franchise"
                value={selected.franchise}
              />
              <InfoCell
                label="Country"
                value={selected.country}
              />
              <InfoCell
                label="Assignee"
                value={selected.assignee}
              />
              <InfoCell
                label="Priority"
                value={
                  <VerificationChip tone={PRIORITY_TONE[selected.priority]} size="xs">
                    {selected.priority}
                  </VerificationChip>
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
                label="Due Date"
                value={fmtDate(selected.dueDate)}
              />
              <InfoCell
                label="Created"
                value={fmtTime(selected.createdAt)}
              />
              <InfoCell
                label="Days Until Due"
                value={Math.ceil(
                  (new Date(selected.dueDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )}
                mono
              />
            </div>

            {/* Description */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Description
              </p>
              <p className="mt-2 text-sm text-white/80">{selected.description}</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              {selected.status === "OPEN" && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#F0A030]/40 bg-[#F0A030]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#F0A030] transition-all hover:border-[#F0A030]/70 hover:bg-[#F0A030]/25"
                >
                  Start Task
                </button>
              )}
              {(selected.status === "OPEN" || selected.status === "IN_PROGRESS") && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#38C878]/40 bg-[#38C878]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#38C878] transition-all hover:border-[#38C878]/70 hover:bg-[#38C878]/25"
                >
                  Mark Complete
                </button>
              )}
              {selected.status === "OVERDUE" && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#7B6EF6] transition-all hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/25"
                >
                  Escalate
                </button>
              )}
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
