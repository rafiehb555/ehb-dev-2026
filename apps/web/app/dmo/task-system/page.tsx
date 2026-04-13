"use client";

/**
 * DMO — Task System
 *   - VerificationUI primitives only (no <table>, no local Kpi)
 *   - Gradient accent bars, corner decorations
 *   - Claim/release semantics on unclaimed rows
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

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type TaskPriority = "low" | "normal" | "high" | "sla_breach";
type TaskStatus = "unclaimed" | "claimed" | "in_progress" | "done";

type Task = {
  id: string;
  title: string;
  origin: "STL" | "PSS" | "CRB" | "Complaints" | "Refill" | "Wallet";
  priority: TaskPriority;
  status: TaskStatus;
  slaMinutesLeft: number;
  assignee?: string;
};

/* ------------------------------------------------------------------ */
/* Demo data                                                           */
/* ------------------------------------------------------------------ */

const DEMO: Task[] = [
  { id: "T-4421", title: "Review CRB inspection report · OLS Lahore", origin: "CRB", priority: "high", status: "claimed", slaMinutesLeft: 48, assignee: "dmo.ayesha" },
  { id: "T-4420", title: "Respond to complaint CX-7740", origin: "Complaints", priority: "sla_breach", status: "unclaimed", slaMinutesLeft: -23 },
  { id: "T-4419", title: "Expiring refill reminder batch · 12 sellers", origin: "Refill", priority: "normal", status: "in_progress", slaMinutesLeft: 340, assignee: "dmo.sara" },
  { id: "T-4418", title: "STL dispute · counterfeit GoSellr seller", origin: "STL", priority: "high", status: "unclaimed", slaMinutesLeft: 90 },
  { id: "T-4417", title: "PSS liveness override review", origin: "PSS", priority: "sla_breach", status: "claimed", slaMinutesLeft: -8, assignee: "dmo.hamza" },
  { id: "T-4416", title: "Escrow release · APP-77240", origin: "Wallet", priority: "normal", status: "done", slaMinutesLeft: 0, assignee: "dmo.bilal" },
  { id: "T-4415", title: "Weekly STL recalculation audit", origin: "STL", priority: "low", status: "unclaimed", slaMinutesLeft: 1440 },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const PRIORITY_TONE: Record<TaskPriority, VerificationTone> = {
  low: "cyan",
  normal: "purple",
  high: "amber",
  sla_breach: "red",
};

const STATUS_TONE: Record<TaskStatus, VerificationTone> = {
  unclaimed: "purple",
  claimed: "cyan",
  in_progress: "amber",
  done: "green",
};

const ORIGIN_TONE: Record<Task["origin"], VerificationTone> = {
  STL: "purple",
  PSS: "teal",
  CRB: "cyan",
  Complaints: "red",
  Refill: "green",
  Wallet: "amber",
};

function slaBadge(mins: number): { label: string; tone: VerificationTone } {
  if (mins < 0) return { label: `${Math.abs(mins)}m overdue`, tone: "red" };
  if (mins < 60) return { label: `${mins}m left`, tone: "amber" };
  const h = Math.floor(mins / 60);
  return { label: `${h}h left`, tone: "green" };
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function TaskSystemPage() {
  const [tasks, setTasks] = useState<Task[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | TaskStatus>("ALL");
  const [active, setActive] = useState<Task | null>(null);

  const kpis = useMemo(
    () => ({
      unclaimed: tasks.filter((t) => t.status === "unclaimed").length,
      inProgress: tasks.filter((t) => t.status === "in_progress" || t.status === "claimed").length,
      breaches: tasks.filter((t) => t.priority === "sla_breach").length,
      done: tasks.filter((t) => t.status === "done").length,
    }),
    [tasks]
  );

  const visible = useMemo(
    () => (statusFilter === "ALL" ? tasks : tasks.filter((t) => t.status === statusFilter)),
    [tasks, statusFilter]
  );

  function claim(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id && t.status === "unclaimed"
          ? { ...t, status: "claimed" as TaskStatus, assignee: "me" }
          : t
      )
    );
  }

  const columns: RowColumn<Task>[] = [
    {
      key: "task",
      header: "Task",
      width: "minmax(0,2.2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-white/45">{r.id}</div>
          <div className="truncate text-sm font-semibold text-white">{r.title}</div>
          {r.assignee ? (
            <div className="text-[10px] text-white/50">assignee: {r.assignee}</div>
          ) : null}
        </div>
      ),
    },
    {
      key: "origin",
      header: "Origin",
      width: "minmax(0,0.8fr)",
      render: (r) => <VerificationChip tone={ORIGIN_TONE[r.origin]}>{r.origin}</VerificationChip>,
    },
    {
      key: "priority",
      header: "Priority",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <VerificationChip tone={PRIORITY_TONE[r.priority]}>
          {r.priority.replace("_", " ")}
        </VerificationChip>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <VerificationChip tone={STATUS_TONE[r.status]}>
          {r.status.replace("_", " ")}
        </VerificationChip>
      ),
    },
    {
      key: "sla",
      header: "SLA",
      width: "minmax(0,0.8fr)",
      render: (r) => {
        const s = slaBadge(r.slaMinutesLeft);
        return <VerificationChip tone={s.tone} size="xs">{s.label}</VerificationChip>;
      },
    },
    {
      key: "action",
      header: "Action",
      width: "minmax(0,0.8fr)",
      align: "right",
      render: (r) =>
        r.status === "unclaimed" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              claim(r.id);
            }}
            className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1 text-[11px] font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/80 hover:bg-[#7B6EF6]/25 hover:text-white"
          >
            Claim
          </button>
        ) : (
          <span className="text-[11px] text-white/40">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#A098F8]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #A098F8 25%, #F0A030 50%, #F05858 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#A098F8]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#F0A030]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#A098F8]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F0A030]">Tasks</span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A098F8]">
              Intelligence · Task System
            </p>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Task System</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Routing-rule-driven work queue for DMO operators. STL, PSS, CRB, Complaints,
              Refill, Wallet — sab ki tasks yahaan come kar ke SLA clock ke saath route hoti
              hain. Claim &amp; release semantics + burndown analytics.
            </p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Unclaimed"
          value={kpis.unclaimed}
          sub="waiting for claim"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="cyan"
          label="In progress"
          value={kpis.inProgress}
          sub="claimed + working"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M12 4v8l5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="red"
          label="SLA breaches"
          value={kpis.breaches}
          sub="overdue tasks"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="green"
          label="Done today"
          value={kpis.done}
          sub="completed"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </section>

      {/* Status distribution */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Status distribution" hint="Task queue breakdown" />
        <SeverityMeter
          segments={[
            { label: "Unclaimed", value: kpis.unclaimed, tone: "purple" },
            { label: "In progress", value: kpis.inProgress, tone: "cyan" },
            { label: "Done", value: kpis.done, tone: "green" },
          ]}
        />
      </section>

      {/* Queue */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          eyebrow="Work queue"
          title="Tasks"
          hint="Click a task row to open detail · SLA clock updates live"
          right={<span className="text-[10px] text-white/45">{visible.length} task(s)</span>}
        />
        <div className="mt-3">
          <FilterChipRow<"ALL" | TaskStatus>
            options={[
              { value: "ALL", label: `All · ${tasks.length}` },
              { value: "unclaimed", label: `Unclaimed · ${kpis.unclaimed}` },
              { value: "claimed", label: "Claimed" },
              { value: "in_progress", label: "In progress" },
              { value: "done", label: `Done · ${kpis.done}` },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<Task>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => (r.priority === "sla_breach" ? "red" : STATUS_TONE[r.status])}
            emptyTitle="No tasks in this bucket"
            emptyHint="Switch filter to see tasks."
          />
        </div>
      </section>

      {/* Drawer */}
      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? active.title : "Task detail"}
        subtitle={active ? `${active.id} · ${active.origin} module` : undefined}
        severity={
          active?.priority === "sla_breach"
            ? "critical"
            : active?.priority === "high"
            ? "high"
            : "info"
        }
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={ORIGIN_TONE[active.origin]}>{active.origin}</VerificationChip>
              <VerificationChip tone={PRIORITY_TONE[active.priority]}>
                {active.priority.replace("_", " ")}
              </VerificationChip>
              <VerificationChip tone={STATUS_TONE[active.status]}>
                {active.status.replace("_", " ")}
              </VerificationChip>
              {(() => {
                const s = slaBadge(active.slaMinutesLeft);
                return <VerificationChip tone={s.tone}>{s.label}</VerificationChip>;
              })()}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Task ID" value={active.id} mono />
              <InfoCell label="Origin" value={active.origin} />
              <InfoCell label="Assignee" value={active.assignee ?? "Unclaimed"} />
              <InfoCell
                label="SLA"
                value={
                  active.slaMinutesLeft < 0
                    ? `${Math.abs(active.slaMinutesLeft)}m OVERDUE`
                    : `${active.slaMinutesLeft}m remaining`
                }
                mono
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                className="rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-3 py-2 text-[11px] font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/70 hover:bg-[#7B6EF6]/20"
              >
                Claim
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-3 py-2 text-[11px] font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20"
              >
                Escalate
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20"
              >
                Mark done
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
