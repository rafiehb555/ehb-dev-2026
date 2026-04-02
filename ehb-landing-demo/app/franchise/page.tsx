"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/fetchJson";

type DashboardPayload = {
  stats: {
    openTasks: number;
    inProgress: number;
    completed: number;
    escalated: number;
    pendingBookings: number;
    activeBookings: number;
  };
  profile: {
    roleScope: string;
    operatorId: string;
    assignedFranchises: Array<{ id: string; name: string; city: string; level: string; status: string }>;
    nextDueTask: { id: string; industry: string; dueDate: string; status: string } | null;
  };
  suggestions: string[];
};

const fallbackDashboard: DashboardPayload = {
  stats: {
    openTasks: 4,
    inProgress: 2,
    completed: 12,
    escalated: 1,
    pendingBookings: 6,
    activeBookings: 3,
  },
  profile: {
    roleScope: "Franchise Operations",
    operatorId: "demo-franchise-ops",
    assignedFranchises: [
      { id: "fr-1", name: "Lahore East", city: "Lahore", level: "SUB", status: "active" },
      { id: "fr-2", name: "Karachi Core", city: "Karachi", level: "CORPORATE", status: "active" },
    ],
    nextDueTask: {
      id: "task-1",
      industry: "Construction",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      status: "ASSIGNED",
    },
  },
  suggestions: [
    "Review pending service bookings and assign operators.",
    "Submit overdue inspection reports to keep DMO queue healthy.",
    "Monitor escalations before they reach corporate level.",
  ],
};

export default function FranchisePage() {
  const [data, setData] = useState<DashboardPayload>(fallbackDashboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchJson<DashboardPayload>("/api/franchise/dashboard", fallbackDashboard)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">Franchise Control Center</p>
              <h1 className="mt-1 text-2xl font-semibold gradient-text">EHB Franchise Home</h1>
              <p className="mt-1 text-sm text-slate-300">
                A unified workspace for local bookings, inspections, escalations, and DMO coordination.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/franchise/bookings" className="ehb-btn-primary ehb-press">
                Open Booking Queue
              </Link>
              <Link href="/franchise/inspections" className="ehb-btn-secondary ehb-press">
                Open Inspections
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Open Tasks</div><div className="mt-2 text-2xl font-semibold">{data.stats.openTasks}</div></div>
          <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">In Progress</div><div className="mt-2 text-2xl font-semibold text-cyan-200">{data.stats.inProgress}</div></div>
          <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Completed</div><div className="mt-2 text-2xl font-semibold text-emerald-200">{data.stats.completed}</div></div>
          <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Escalated</div><div className="mt-2 text-2xl font-semibold text-amber-200">{data.stats.escalated}</div></div>
          <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Pending Bookings</div><div className="mt-2 text-2xl font-semibold text-violet-200">{data.stats.pendingBookings}</div></div>
          <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Active Bookings</div><div className="mt-2 text-2xl font-semibold text-sky-200">{data.stats.activeBookings}</div></div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="ehb-card-elevated space-y-4">
            <div>
              <div className="text-sm font-semibold text-white">Assigned Franchise Network</div>
              <div className="text-xs text-slate-400 mt-1">
                Scope: {data.profile.roleScope} · Operator: {data.profile.operatorId}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {data.profile.assignedFranchises.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-white">{item.name}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {item.city} · {item.level} · {item.status}
                  </div>
                </div>
              ))}
            </div>
            {data.profile.assignedFranchises.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
                No franchise membership mapped yet.
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="ehb-card-elevated">
              <div className="text-sm font-semibold text-white">Next Due Inspection</div>
              {data.profile.nextDueTask ? (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-slate-400">{data.profile.nextDueTask.industry}</div>
                  <div className="mt-1 text-sm font-semibold text-white">{data.profile.nextDueTask.id}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {new Date(data.profile.nextDueTask.dueDate).toLocaleString()} · {data.profile.nextDueTask.status}
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
                  No due inspection task found.
                </div>
              )}
            </div>

            <div className="ehb-card-elevated">
              <div className="text-sm font-semibold text-white">Action Plan</div>
              <div className="mt-3 space-y-2">
                {data.suggestions.map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/franchise/bookings" className="glass-panel card-hover p-4 border border-white/10 block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Booking Queue</span>
            <p className="mt-1 text-sm font-semibold text-white">Handle service booking requests</p>
            <p className="mt-1 text-xs text-slate-400">
              Claim requests, update status, schedule visits, and coordinate with DMO.
            </p>
          </Link>
          <Link href="/franchise/inspections" className="glass-panel card-hover p-4 border border-white/10 block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Inspections</span>
            <p className="mt-1 text-sm font-semibold text-white">Submit geo-tagged inspection reports</p>
            <p className="mt-1 text-xs text-slate-400">
              Use score, fraud notes, media links, and escalation paths from one screen.
            </p>
          </Link>
          <Link href="/dmo/franchise" className="glass-panel card-hover p-4 border border-white/10 block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">DMO Coordination</span>
            <p className="mt-1 text-sm font-semibold text-white">Review franchise tasks inside DMO</p>
            <p className="mt-1 text-xs text-slate-400">
              Track reports, escalations, and inspection queue health from the DMO workspace.
            </p>
          </Link>
        </section>

        {loading ? <div className="text-xs text-slate-500">Loading live franchise dashboard...</div> : null}
      </div>
    </main>
  );
}
