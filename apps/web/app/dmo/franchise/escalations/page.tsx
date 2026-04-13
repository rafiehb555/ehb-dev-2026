"use client";

/**
 * DMO — Franchise Control — Escalations
 *   - Escalated issues from franchise operators
 *   - Severity tracking, resolution management, timeline tracking
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

type EscalationSeverity = "CRITICAL" | "HIGH" | "MEDIUM";
type EscalationStatus = "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED";

type FranchiseEscalation = {
  id: string;
  subject: string;
  franchise: string;
  country: string;
  escalatedBy: string;
  severity: EscalationSeverity;
  status: EscalationStatus;
  escalatedAt: string;
  resolvedAt: string | null;
  description: string;
  resolutionNotes: string | null;
  timeline: {
    date: string;
    action: string;
  }[];
};

/* ── Demo data — 8 realistic franchise escalations ── */
const DEMO: FranchiseEscalation[] = [
  {
    id: "ESC-FR-001",
    subject: "Payment Processing Delays - Merchant Refunds",
    franchise: "EHB Pakistan",
    country: "Pakistan",
    escalatedBy: "Tariq Ahmed",
    severity: "CRITICAL",
    status: "INVESTIGATING",
    escalatedAt: "2026-04-11T14:30:00Z",
    resolvedAt: null,
    description:
      "Multiple merchants reporting 48+ hour delays in refund processing. Affecting payment gateway operations.",
    resolutionNotes: null,
    timeline: [
      { date: "2026-04-11T14:30:00Z", action: "Escalation received from franchise" },
      { date: "2026-04-11T15:15:00Z", action: "Technical team engaged" },
      { date: "2026-04-11T16:45:00Z", action: "Root cause identified - API rate limiting issue" },
    ],
  },
  {
    id: "ESC-FR-002",
    subject: "CRB Verification Failure - 52 Service Providers",
    franchise: "EHB Bangladesh",
    country: "Bangladesh",
    escalatedBy: "Fatima Khan",
    severity: "HIGH",
    status: "INVESTIGATING",
    escalatedAt: "2026-04-10T10:00:00Z",
    resolvedAt: null,
    description:
      "Batch verification job failed for 52 providers. CRB certificate generation stalled.",
    resolutionNotes: null,
    timeline: [
      { date: "2026-04-10T10:00:00Z", action: "Issue reported" },
      { date: "2026-04-10T11:30:00Z", action: "Database logs reviewed" },
      { date: "2026-04-10T13:00:00Z", action: "Manual certificate generation in progress" },
    ],
  },
  {
    id: "ESC-FR-003",
    subject: "Franchise Agreement Dispute - Payment Terms",
    franchise: "EHB UAE",
    country: "United Arab Emirates",
    escalatedBy: "Usman Raza",
    severity: "HIGH",
    status: "OPEN",
    escalatedAt: "2026-04-11T09:15:00Z",
    resolvedAt: null,
    description:
      "Disagreement between corporate and franchise on 40/25/20/15 revenue split. Requires legal review.",
    resolutionNotes: null,
    timeline: [
      { date: "2026-04-11T09:15:00Z", action: "Escalation submitted" },
    ],
  },
  {
    id: "ESC-FR-004",
    subject: "Service Center Compliance Failure",
    franchise: "EHB Sri Lanka",
    country: "Sri Lanka",
    escalatedBy: "Sara Malik",
    severity: "CRITICAL",
    status: "RESOLVED",
    escalatedAt: "2026-04-08T16:20:00Z",
    resolvedAt: "2026-04-09T14:45:00Z",
    description:
      "3 service centers failed PSS compliance audit. Immediate closure ordered.",
    resolutionNotes:
      "Centers have completed remediation and passed re-audit. Operations resumed with increased monitoring.",
    timeline: [
      { date: "2026-04-08T16:20:00Z", action: "Audit failure reported" },
      { date: "2026-04-08T17:30:00Z", action: "Centers given 24-hour remediation notice" },
      { date: "2026-04-09T10:00:00Z", action: "Re-audit conducted" },
      { date: "2026-04-09T14:45:00Z", action: "All 3 centers re-certified" },
    ],
  },
  {
    id: "ESC-FR-005",
    subject: "JPS (Job Skill Matching) Algorithm Bias",
    franchise: "EHB India",
    country: "India",
    escalatedBy: "Hassan Rauf",
    severity: "MEDIUM",
    status: "RESOLVED",
    escalatedAt: "2026-04-06T11:00:00Z",
    resolvedAt: "2026-04-09T10:30:00Z",
    description:
      "Job recommendations showing regional bias. Certain skill categories underrepresented.",
    resolutionNotes:
      "Algorithm recalibrated with regional weighting adjustments. QA testing passed. Live deployment complete.",
    timeline: [
      { date: "2026-04-06T11:00:00Z", action: "Issue identified in analytics" },
      { date: "2026-04-07T09:00:00Z", action: "AI team began algorithm audit" },
      { date: "2026-04-08T15:00:00Z", action: "Fix implemented and tested" },
      { date: "2026-04-09T10:30:00Z", action: "Deployed to production" },
    ],
  },
  {
    id: "ESC-FR-006",
    subject: "Affiliate Program Commission Audit",
    franchise: "EHB Nepal",
    country: "Nepal",
    escalatedBy: "Amina Farah",
    severity: "MEDIUM",
    status: "CLOSED",
    escalatedAt: "2026-03-28T13:20:00Z",
    resolvedAt: "2026-04-02T16:00:00Z",
    description:
      "Discrepancies found in affiliate commission calculations for March 2026.",
    resolutionNotes:
      "Audit complete. $12,400 in discrepancies identified and corrected. Affected affiliates notified and compensated.",
    timeline: [
      { date: "2026-03-28T13:20:00Z", action: "Audit initiated" },
      { date: "2026-03-30T10:00:00Z", action: "Discrepancies identified" },
      { date: "2026-04-01T14:00:00Z", action: "Corrections applied" },
      { date: "2026-04-02T16:00:00Z", action: "Closed with affiliate compensation" },
    ],
  },
  {
    id: "ESC-FR-007",
    subject: "Data Export Performance - Large Batch",
    franchise: "EHB Malaysia",
    country: "Malaysia",
    escalatedBy: "Muhammad Ali",
    severity: "MEDIUM",
    status: "INVESTIGATING",
    escalatedAt: "2026-04-11T12:45:00Z",
    resolvedAt: null,
    description:
      "Monthly data export for 1500+ merchants timing out. Affects reporting cycle.",
    resolutionNotes: null,
    timeline: [
      { date: "2026-04-11T12:45:00Z", action: "Escalation reported" },
      { date: "2026-04-11T13:30:00Z", action: "Database team investigating query performance" },
    ],
  },
  {
    id: "ESC-FR-008",
    subject: "Sub-Franchise Onboarding Delay",
    franchise: "EHB Thailand",
    country: "Thailand",
    escalatedBy: "Zainab Ahmed",
    severity: "HIGH",
    status: "OPEN",
    escalatedAt: "2026-04-09T15:00:00Z",
    resolvedAt: null,
    description:
      "5 sub-franchise applications stuck in legal review. 45 days overdue. Impacting regional expansion.",
    resolutionNotes: null,
    timeline: [
      { date: "2026-04-09T15:00:00Z", action: "Escalation filed" },
      { date: "2026-04-10T10:00:00Z", action: "Legal team contacted for priority review" },
    ],
  },
];

const SEVERITY_TONE: Record<EscalationSeverity, VerificationTone> = {
  CRITICAL: "red",
  HIGH: "amber",
  MEDIUM: "amber",
};

const STATUS_TONE: Record<EscalationStatus, VerificationTone> = {
  OPEN: "purple",
  INVESTIGATING: "amber",
  RESOLVED: "green",
  CLOSED: "teal",
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

function ResolutionTime({ start, end }: { start: string; end: string | null }) {
  if (!end) return <span className="text-white/60">—</span>;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return (
    <span className="font-mono text-[10px] text-white/85">
      {days}d {hours}h
    </span>
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

export default function FranchiseEscalationsPage() {
  const [rows] = useState<FranchiseEscalation[]>(DEMO);
  const [severityFilter, setSeverityFilter] = useState<"ALL" | EscalationSeverity>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | EscalationStatus>("ALL");
  const [selected, setSelected] = useState<FranchiseEscalation | null>(null);

  const stats = useMemo(() => {
    const st = {
      active: rows.filter((r) => r.status !== "CLOSED").length,
      critical: rows.filter((r) => r.severity === "CRITICAL").length,
      high: rows.filter((r) => r.severity === "HIGH").length,
      resolved: rows.filter((r) => r.status === "RESOLVED").length,
      investigating: rows.filter((r) => r.status === "INVESTIGATING").length,
    };
    return st;
  }, [rows]);

  const avgResolutionTime = useMemo(() => {
    const resolved = rows.filter((r) => r.resolvedAt);
    if (resolved.length === 0) return "—";
    const avgMs = resolved.reduce((sum, r) => {
      const ms = new Date(r.resolvedAt!).getTime() - new Date(r.escalatedAt).getTime();
      return sum + ms;
    }, 0) / resolved.length;
    const days = Math.floor(avgMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((avgMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  }, [rows]);

  const thisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return rows.filter((r) => new Date(r.resolvedAt || r.escalatedAt) >= weekAgo).length;
  }, [rows]);

  const severityBreakdown = useMemo(() => {
    const by: Record<EscalationSeverity, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0 };
    for (const r of rows) {
      by[r.severity] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (severityFilter !== "ALL" && r.severity !== severityFilter) return false;
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    return true;
  });

  const columns: RowColumn<FranchiseEscalation>[] = [
    {
      key: "id",
      header: "Escalation ID",
      width: "minmax(0,0.75fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.id}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      width: "minmax(0,2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {r.subject}
          </div>
          <div className="truncate text-[10px] text-white/45">
            {r.franchise} ({r.country})
          </div>
        </div>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      width: "minmax(0,0.8fr)",
      render: (r) => (
        <VerificationChip tone={SEVERITY_TONE[r.severity]}>
          {r.severity}
        </VerificationChip>
      ),
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
      key: "resolution",
      header: "Time to Resolve",
      width: "minmax(0,1fr)",
      align: "right",
      render: (r) => (
        <ResolutionTime start={r.escalatedAt} end={r.resolvedAt} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#F05858]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#F05858] via-[#F0A030] via-[#7B6EF6] to-transparent"
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F05858]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#F05858]/14 via-[#F0A030]/10 to-transparent blur-3xl" />

        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/55">
            <Link
              href="/dmo"
              className="transition-colors hover:text-[#F05858]"
            >
              DMO
            </Link>
            <span>/</span>
            <Link
              href="/dmo/franchise"
              className="transition-colors hover:text-[#F05858]"
            >
              Franchise
            </Link>
            <span>/</span>
            <span className="text-white/75">Escalations</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Escalated Issues
          </h1>
          <p className="text-sm text-white/55">
            Track and resolve escalated issues from franchise operators across all territories
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          }
          label="Active Escalations"
          value={stats.active}
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
              <path d="M8 12h8" />
            </svg>
          }
          label="Critical"
          value={stats.critical}
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4l-8.97 8.97" />
            </svg>
          }
          label="Resolved"
          value={stats.resolved}
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
              <polyline points="23 6 13.5 15.5 8 10 1 17" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          }
          label="Avg Resolution"
          value={avgResolutionTime}
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2.5" />
            </svg>
          }
          label="Resolved This Week"
          value={thisWeek}
          tone="teal"
        />
      </div>

      {/* Severity breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Issue Distribution"
          title="Escalations by Severity"
          hint="Breakdown of open and investigating escalations by severity level"
        />
        <SeverityMeter
          segments={[
            {
              label: "Critical",
              value: severityBreakdown.CRITICAL,
              tone: "red",
            },
            {
              label: "High",
              value: severityBreakdown.HIGH,
              tone: "amber",
            },
            {
              label: "Medium",
              value: severityBreakdown.MEDIUM,
              tone: "amber",
            },
          ]}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Severity
          </p>
          <FilterChipRow<"ALL" | EscalationSeverity>
            value={severityFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "CRITICAL", label: "Critical" },
              { value: "HIGH", label: "High" },
              { value: "MEDIUM", label: "Medium" },
            ]}
            onChange={setSeverityFilter}
          />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Status
          </p>
          <FilterChipRow<"ALL" | EscalationStatus>
            value={statusFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "OPEN", label: "Open" },
              { value: "INVESTIGATING", label: "Investigating" },
              { value: "RESOLVED", label: "Resolved" },
              { value: "CLOSED", label: "Closed" },
            ]}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Escalations grid */}
      <VerificationRowGrid<FranchiseEscalation>
        columns={columns}
        rows={visible}
        onRowClick={setSelected}
        getRowTone={(r) => SEVERITY_TONE[r.severity]}
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
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M12 8v8" />
          </svg>
        }
        emptyTitle="No escalations match filters"
        emptyHint="Try adjusting your severity or status filters to see escalations"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Escalation detail"}
        subtitle={selected ? selected.subject : ""}
        severity={
          selected
            ? selected.severity === "CRITICAL"
              ? "critical"
              : selected.severity === "HIGH"
              ? "high"
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
                label="Escalated By"
                value={selected.escalatedBy}
              />
              <InfoCell
                label="Severity"
                value={
                  <VerificationChip tone={SEVERITY_TONE[selected.severity]}>
                    {selected.severity}
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
                label="Time Since Escalation"
                value={`${Math.floor((Date.now() - new Date(selected.escalatedAt).getTime()) / (1000 * 60 * 60))}h`}
              />
              <InfoCell
                label="Escalated At"
                value={fmtTime(selected.escalatedAt)}
              />
              {selected.resolvedAt && (
                <InfoCell
                  label="Resolved At"
                  value={fmtTime(selected.resolvedAt)}
                />
              )}
            </div>

            {/* Description */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Issue Description
              </p>
              <p className="mt-2 text-sm text-white/80">{selected.description}</p>
            </div>

            {/* Resolution notes */}
            {selected.resolutionNotes && (
              <div className="rounded-xl border border-[#38C878]/30 bg-[#38C878]/8 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#38C878]/70">
                  Resolution Notes
                </p>
                <p className="mt-2 text-sm text-white/80">{selected.resolutionNotes}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Resolution Timeline
              </p>
              <div className="mt-3 space-y-2">
                {selected.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-[#7B6EF6]/60 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-white/80">{event.action}</p>
                      <p className="text-[9px] text-white/45">{fmtTime(event.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              {selected.status === "OPEN" && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#F0A030]/40 bg-[#F0A030]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#F0A030] transition-all hover:border-[#F0A030]/70 hover:bg-[#F0A030]/25"
                >
                  Start Investigation
                </button>
              )}
              {(selected.status === "INVESTIGATING" || selected.status === "RESOLVED") && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#38C878]/40 bg-[#38C878]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#38C878] transition-all hover:border-[#38C878]/70 hover:bg-[#38C878]/25"
                >
                  Mark as Resolved
                </button>
              )}
              {selected.status !== "CLOSED" && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#7B6EF6] transition-all hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/25"
                >
                  Close Ticket
                </button>
              )}
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
