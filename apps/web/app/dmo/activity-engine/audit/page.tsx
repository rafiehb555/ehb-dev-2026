"use client";

/**
 * DMO — Activity Engine: Audit Log
 *   - Searchable, filterable audit trail
 *   - Columns: Timestamp, Actor, Action, Target, IP, Status
 *   - Export button
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT" | "VIEW" | "EXPORT";
type AuditStatus = "success" | "failure" | "pending";

type AuditRecord = {
  id: string;
  timestamp: string;
  actor: string;
  action: AuditAction;
  target: string;
  targetId: string;
  ip: string;
  status: AuditStatus;
};

const DEMO: AuditRecord[] = [
  { id: "AU-8825", timestamp: "2026-04-11T10:42:30Z", actor: "dmo.sara", action: "APPROVE", target: "CRB Application", targetId: "CRB-2741", ip: "203.0.113.42", status: "success" },
  { id: "AU-8824", timestamp: "2026-04-11T10:35:15Z", actor: "dmo.hamza", action: "UPDATE", target: "STL Score", targetId: "STL-L7-482", ip: "203.0.113.58", status: "success" },
  { id: "AU-8823", timestamp: "2026-04-11T10:20:00Z", actor: "pss.engine", action: "CREATE", target: "Verification Record", targetId: "PSS-VER-99241", ip: "10.0.1.5", status: "success" },
  { id: "AU-8822", timestamp: "2026-04-11T10:15:45Z", actor: "dmo.ayesha", action: "VIEW", target: "Complaint Details", targetId: "CX-7740", ip: "203.0.113.61", status: "success" },
  { id: "AU-8821", timestamp: "2026-04-11T10:10:20Z", actor: "wallet.svc", action: "CREATE", target: "Escrow Record", targetId: "ESC-77281", ip: "10.0.2.14", status: "success" },
  { id: "AU-8820", timestamp: "2026-04-11T10:05:00Z", actor: "dmo.razi", action: "REJECT", target: "CRB Application", targetId: "CRB-2740", ip: "203.0.113.55", status: "success" },
  { id: "AU-8819", timestamp: "2026-04-11T09:58:30Z", actor: "stl.cron", action: "CREATE", target: "STL Recalculation", targetId: "STL-REC-48201", ip: "10.0.1.3", status: "success" },
  { id: "AU-8818", timestamp: "2026-04-11T09:45:15Z", actor: "dmo.admin", action: "DELETE", target: "Draft CRB Form", targetId: "DRF-291", ip: "203.0.113.50", status: "success" },
];

const ACTION_TONE: Record<AuditAction, VerificationTone> = {
  CREATE: "green",
  UPDATE: "cyan",
  DELETE: "red",
  APPROVE: "green",
  REJECT: "red",
  VIEW: "purple",
  EXPORT: "amber",
};

const STATUS_TONE: Record<AuditStatus, VerificationTone> = {
  success: "green",
  failure: "red",
  pending: "amber",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function AuditPage() {
  const [filter, setFilter] = useState<"ALL" | AuditStatus>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const visible = useMemo(() => {
    let filtered = DEMO;
    if (filter !== "ALL") {
      filtered = filtered.filter((a) => a.status === filter);
    }
    if (searchTerm) {
      filtered = filtered.filter((a) =>
        a.actor.includes(searchTerm.toLowerCase()) ||
        a.action.includes(searchTerm.toUpperCase()) ||
        a.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.targetId.includes(searchTerm.toUpperCase())
      );
    }
    return filtered;
  }, [filter, searchTerm]);

  const stats = useMemo(
    () => ({
      total: DEMO.length,
      success: DEMO.filter((a) => a.status === "success").length,
      failure: DEMO.filter((a) => a.status === "failure").length,
      pending: DEMO.filter((a) => a.status === "pending").length,
    }),
    []
  );

  const columns: RowColumn<AuditRecord>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      width: "minmax(0,1fr)",
      render: (r) => <span className="font-mono text-[10px] text-white/55">{fmtTime(r.timestamp)}</span>,
    },
    {
      key: "actor",
      header: "Actor",
      width: "minmax(0,0.8fr)",
      render: (r) => <span className="text-sm text-white/80">{r.actor}</span>,
    },
    {
      key: "action",
      header: "Action",
      width: "minmax(0,0.8fr)",
      render: (r) => <VerificationChip tone={ACTION_TONE[r.action]}>{r.action}</VerificationChip>,
    },
    {
      key: "target",
      header: "Target",
      width: "minmax(0,1.5fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="text-sm text-white">{r.target}</div>
          <div className="font-mono text-[10px] text-white/45">{r.targetId}</div>
        </div>
      ),
    },
    {
      key: "ip",
      header: "IP Address",
      width: "minmax(0,1fr)",
      render: (r) => <span className="font-mono text-[11px] text-white/70">{r.ip}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.8fr)",
      render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Activity Engine</span>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Audit Log</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Full Audit Log</h1>
            <p className="max-w-2xl text-sm text-white/65">Searchable and filterable audit trail — immutable append-only log.</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total records" value={stats.total} sub="all time" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 12h6m-6 4h6M9 8h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Success" value={stats.success} sub="completed" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="red" label="Failures" value={stats.failure} sub="errors logged" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Pending" value={stats.pending} sub="in progress" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Search & Filter" hint="Find audit records by actor, action, or target" />
        <div className="mt-3 space-y-3">
          <input
            type="text"
            placeholder="Search by actor, action, target, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0C0E1A]/80 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none focus:border-[#7B6EF6]/55"
          />
          <FilterChipRow<"ALL" | AuditStatus>
            options={[
              { value: "ALL", label: `All · ${DEMO.length}` },
              { value: "success", label: `Success · ${stats.success}` },
              { value: "failure", label: `Failure · ${stats.failure}` },
              { value: "pending", label: `Pending · ${stats.pending}` },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Audit records" hint={`${visible.length} record(s) · immutable log`} />
          <button
            type="button"
            className="rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/12 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/80 hover:bg-[#2BBFA0]/25"
          >
            Export CSV
          </button>
        </div>
        <VerificationRowGrid<AuditRecord>
          rows={visible}
          columns={columns}
          emptyTitle="No audit records found"
          emptyHint="Adjust search or filter to see logs."
        />
      </section>
    </div>
  );
}
