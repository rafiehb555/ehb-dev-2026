"use client";

/**
 * /certification/inspection — My Inspections
 * Upcoming schedule and past inspection results
 */

import Link from "next/link";
import { useState, useMemo } from "react";

interface Inspection {
  id: string;
  certificateId: string;
  certificateName: string;
  scheduledDate: string;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  inspectorName: string;
  inspectorEmail: string;
  location: string;
  score?: number;
  result?: "PASSED" | "CONDITIONAL" | "FAILED";
  notes?: string;
}

const DEMO_INSPECTIONS: Inspection[] = [
  {
    id: "INS-2026-001",
    certificateId: "CERT-2024-001",
    certificateName: "Business Registration",
    scheduledDate: "2026-04-25",
    status: "UPCOMING",
    inspectorName: "Amir Khan",
    inspectorEmail: "amir.khan@crb.gov.pk",
    location: "Islamabad Main Office",
  },
  {
    id: "INS-2026-002",
    certificateId: "CERT-2024-003",
    certificateName: "Trade License",
    scheduledDate: "2026-05-10",
    status: "UPCOMING",
    inspectorName: "Fatima Ahmed",
    inspectorEmail: "fatima.ahmed@crb.gov.pk",
    location: "Virtual / Online",
  },
  {
    id: "INS-2026-003",
    certificateId: "CERT-2024-001",
    certificateName: "Business Registration",
    scheduledDate: "2026-03-10",
    status: "COMPLETED",
    inspectorName: "Amir Khan",
    inspectorEmail: "amir.khan@crb.gov.pk",
    location: "Islamabad Main Office",
    score: 94,
    result: "PASSED",
    notes: "Full compliance verified. All documentation complete and verified.",
  },
  {
    id: "INS-2025-004",
    certificateId: "CERT-2024-003",
    certificateName: "Trade License",
    scheduledDate: "2025-09-20",
    status: "COMPLETED",
    inspectorName: "Sarah Ahmed",
    inspectorEmail: "sarah.ahmed@crb.gov.pk",
    location: "Regional Office",
    score: 88,
    result: "CONDITIONAL",
    notes: "Minor compliance gaps noted. Updated documentation received and approved.",
  },
  {
    id: "INS-2025-005",
    certificateId: "CERT-2024-002",
    certificateName: "Tax ID Certificate",
    scheduledDate: "2025-08-15",
    status: "COMPLETED",
    inspectorName: "Muhammad Hassan",
    inspectorEmail: "hassan@crb.gov.pk",
    location: "Lahore Branch",
    score: 92,
    result: "PASSED",
    notes: "Excellent compliance. All records verified and confirmed.",
  },
];

function InspectionCard({ inspection }: { inspection: Inspection }) {
  const isUpcoming = inspection.status === "UPCOMING";

  const statusColor =
    inspection.status === "UPCOMING"
      ? "bg-blue-500/10 border-blue-500/30"
      : inspection.result === "PASSED"
        ? "bg-emerald-500/10 border-emerald-500/30"
        : inspection.result === "CONDITIONAL"
          ? "bg-amber-500/10 border-amber-500/30"
          : "bg-red-500/10 border-red-500/30";

  const scheduledDate = new Date(inspection.scheduledDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`overflow-hidden rounded-2xl border ${statusColor} bg-gradient-to-br from-[#13162A]/40 to-[#1A1D33]/40 p-6 backdrop-blur transition-all hover:shadow-lg`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">{inspection.certificateName}</h3>
            <p className="text-[10px] text-white/50">{inspection.id}</p>
          </div>
          <div className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
            {isUpcoming && <span className="bg-blue-500/20 text-blue-300">Upcoming</span>}
            {inspection.result === "PASSED" && <span className="bg-emerald-500/20 text-emerald-300">Passed</span>}
            {inspection.result === "CONDITIONAL" && <span className="bg-amber-500/20 text-amber-300">Conditional</span>}
            {inspection.result === "FAILED" && <span className="bg-red-500/20 text-red-300">Failed</span>}
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">Date</p>
            <p className="mt-1 text-sm font-semibold text-white">{scheduledDate}</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">Location</p>
            <p className="mt-1 text-sm font-semibold text-white">{inspection.location}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">Inspector</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-teal-400"></div>
              <div>
                <p className="text-xs font-semibold text-white">{inspection.inspectorName}</p>
                <p className="text-[9px] text-white/50">{inspection.inspectorEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score & Notes (if completed) */}
        {!isUpcoming && (
          <div className="space-y-3 border-t border-white/5 pt-4">
            {inspection.score !== undefined && (
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-xs text-white/70">Inspection Score</span>
                <span className="text-lg font-bold text-white">{inspection.score}%</span>
              </div>
            )}
            {inspection.notes && (
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">Notes</p>
                <p className="mt-2 text-xs text-white/80">{inspection.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 border-t border-white/5 pt-4">
          {isUpcoming && (
            <>
              <button className="flex-1 rounded-lg border border-white/20 py-2 text-xs font-semibold text-white transition-all hover:bg-white/5">
                Reschedule
              </button>
              <button className="flex-1 rounded-lg bg-purple-600 py-2 text-xs font-semibold text-white transition-all hover:bg-purple-700">
                View Details
              </button>
            </>
          )}
          {!isUpcoming && (
            <button className="flex-1 rounded-lg border border-white/20 py-2 text-xs font-semibold text-white transition-all hover:bg-white/5">
              Download Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InspectionPage() {
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "completed">("upcoming");

  const stats = useMemo(() => {
    const upcoming = DEMO_INSPECTIONS.filter((i) => i.status === "UPCOMING");
    const completed = DEMO_INSPECTIONS.filter((i) => i.status === "COMPLETED");
    const passed = completed.filter((i) => i.result === "PASSED");
    const conditional = completed.filter((i) => i.result === "CONDITIONAL");

    return {
      upcoming: upcoming.length,
      completed: completed.length,
      passed: passed.length,
      conditional: conditional.length,
      avgScore:
        completed.length > 0
          ? Math.round(completed.reduce((sum, i) => sum + (i.score || 0), 0) / completed.length)
          : 0,
    };
  }, []);

  const visibleInspections = DEMO_INSPECTIONS.filter((i) =>
    selectedTab === "upcoming" ? i.status === "UPCOMING" : i.status === "COMPLETED"
  );

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">Verification</div>
          <h1 className="text-3xl font-bold">My Inspections</h1>
          <p className="text-sm text-white/60">Track scheduled inspections and review past inspection results.</p>
        </div>

        {/* Stats grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
            <div className="text-2xl font-bold text-blue-300">{stats.upcoming}</div>
            <div className="text-[10px] text-white/60 mt-1">Upcoming</div>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
            <div className="text-[10px] text-white/60 mt-1">Completed</div>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
            <div className="text-2xl font-bold text-emerald-300">{stats.passed}</div>
            <div className="text-[10px] text-white/60 mt-1">Passed</div>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
            <div className="text-2xl font-bold text-amber-300">{stats.conditional}</div>
            <div className="text-[10px] text-white/60 mt-1">Conditional</div>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">{stats.avgScore}%</div>
            <div className="text-[10px] text-white/60 mt-1">Avg Score</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-white/10">
          <button
            onClick={() => setSelectedTab("upcoming")}
            className={`px-4 py-3 text-sm font-semibold transition-all ${
              selectedTab === "upcoming"
                ? "border-b-2 border-purple-600 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Upcoming ({stats.upcoming})
          </button>
          <button
            onClick={() => setSelectedTab("completed")}
            className={`px-4 py-3 text-sm font-semibold transition-all ${
              selectedTab === "completed"
                ? "border-b-2 border-purple-600 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {/* Inspections list */}
        {visibleInspections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {visibleInspections.map((inspection) => (
              <InspectionCard key={inspection.id} inspection={inspection} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-12 text-center">
            <div className="text-4xl">📅</div>
            <h3 className="mt-4 text-lg font-semibold text-white">No {selectedTab} Inspections</h3>
            <p className="mt-2 text-sm text-white/60">
              {selectedTab === "upcoming"
                ? "You have no scheduled inspections at this time."
                : "You haven't completed any inspections yet."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
