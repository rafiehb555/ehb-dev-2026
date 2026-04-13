"use client";

/**
 * PSS Refilling / Re-verification
 * When users fail PSS verification steps, they enter the refilling process.
 * DESIGN-ONLY — in-file demo data, no fetch.
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

type RefillReason = "KYC_EXPIRED" | "DOC_MISMATCH" | "LIVENESS_FAILED" | "AML_FLAG" | "MANUAL_REQUEST";

type RefillRow = {
  id: string;
  entityName: string;
  reason: RefillReason;
  attempt: number;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewer: string;
};

const REASON_TONE: Record<RefillReason, VerificationTone> = {
  KYC_EXPIRED: "amber",
  DOC_MISMATCH: "red",
  LIVENESS_FAILED: "red",
  AML_FLAG: "red",
  MANUAL_REQUEST: "purple",
};

const STATUS_TONE: Record<RefillRow["status"], VerificationTone> = {
  PENDING: "purple",
  UNDER_REVIEW: "cyan",
  APPROVED: "green",
  REJECTED: "red",
};

const DEMO: RefillRow[] = [
  { id: "RF-001", entityName: "Ali Raza", reason: "KYC_EXPIRED", attempt: 1, status: "PENDING", submittedAt: "2026-04-12T11:30:00Z", reviewer: "—" },
  { id: "RF-002", entityName: "Fatima Ahmed", reason: "LIVENESS_FAILED", attempt: 2, status: "UNDER_REVIEW", submittedAt: "2026-04-12T10:15:00Z", reviewer: "pss.maria" },
  { id: "RF-003", entityName: "Hassan Khan", reason: "DOC_MISMATCH", attempt: 1, status: "PENDING", submittedAt: "2026-04-12T09:45:00Z", reviewer: "—" },
  { id: "RF-004", entityName: "Sara Noor", reason: "AML_FLAG", attempt: 3, status: "UNDER_REVIEW", submittedAt: "2026-04-11T16:20:00Z", reviewer: "pss.amir" },
  { id: "RF-005", entityName: "Usman Khan", reason: "KYC_EXPIRED", attempt: 2, status: "APPROVED", submittedAt: "2026-04-11T14:00:00Z", reviewer: "pss.sara" },
  { id: "RF-006", entityName: "Zainab Ali", reason: "LIVENESS_FAILED", attempt: 1, status: "PENDING", submittedAt: "2026-04-11T13:30:00Z", reviewer: "—" },
  { id: "RF-007", entityName: "Bilal Hassan", reason: "MANUAL_REQUEST", attempt: 1, status: "APPROVED", submittedAt: "2026-04-11T11:00:00Z", reviewer: "admin.rafi" },
  { id: "RF-008", entityName: "Nida Malik", reason: "DOC_MISMATCH", attempt: 2, status: "REJECTED", submittedAt: "2026-04-10T17:45:00Z", reviewer: "pss.hamza" },
];

function fmt(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function PssRefillingPage() {
  const [rows] = useState(DEMO);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED">("ALL");
  const [active, setActive] = useState<RefillRow | null>(null);

  const visible =
    filter === "ALL"
      ? rows
      : rows.filter((r) => r.status === filter);

  const stats = useMemo(
    () => ({
      pending: rows.filter((r) => r.status === "PENDING").length,
      underReview: rows.filter((r) => r.status === "UNDER_REVIEW").length,
      approved: rows.filter((r) => r.status === "APPROVED").length,
      rejected: rows.filter((r) => r.status === "REJECTED").length,
    }),
    [rows]
  );

  const reasonDist = useMemo(() => {
    const dist: Record<RefillReason, number> = {
      KYC_EXPIRED: 0,
      DOC_MISMATCH: 0,
      LIVENESS_FAILED: 0,
      AML_FLAG: 0,
      MANUAL_REQUEST: 0,
    };
    rows.forEach((r) => {
      dist[r.reason]++;
    });
    return dist;
  }, [rows]);

  const columns: RowColumn<RefillRow>[] = [
    {
      key: "entity",
      header: "Entity",
      width: "minmax(0,1.5fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{r.entityName}</div>
          <div className="font-mono text-[10px] text-white/40">{r.id}</div>
        </div>
      ),
    },
    {
      key: "reason",
      header: "Reason",
      width: "minmax(0,1.1fr)",
      render: (r) => <VerificationChip tone={REASON_TONE[r.reason]}>{r.reason.replace(/_/g, " ")}</VerificationChip>,
    },
    {
      key: "attempt",
      header: "Attempt",
      width: "minmax(0,0.6fr)",
      align: "right",
      render: (r) => <span className="text-sm font-semibold text-white">#{r.attempt}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,1fr)",
      render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status.replace(/_/g, " ")}</VerificationChip>,
    },
    {
      key: "time",
      header: "Submitted",
      width: "minmax(0,1.2fr)",
      align: "right",
      render: (r) => <span className="text-[10px] text-white/45">{fmt(r.submittedAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #67E8F9 30%, #2BBFA0 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-cyan-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-400/18 via-[#2BBFA0]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">
                DMO
              </Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/pss" className="text-white/40 hover:text-white/70 transition-colors">
                PSS
              </Link>
              <span className="text-white/25">/</span>
              <span className="text-cyan-300">Refilling</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">PSS Refilling</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Re-verification queue — when KYC, liveness, or document checks fail, users refill and resubmit.
              Track attempts, reviewer assignments, and approval status.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/pss" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">
              PSS Overview
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Pending refills"
          value={stats.pending}
          sub="awaiting review"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="cyan"
          label="In review"
          value={stats.underReview}
          sub="assigned"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="green"
          label="Approved"
          value={stats.approved}
          sub="completed"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <VerificationStatCard
          tone="red"
          label="Rejected"
          value={stats.rejected}
          sub="need resubmit"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Refill reason distribution" />
        <SeverityMeter
          segments={[
            { label: "KYC Expired", value: reasonDist.KYC_EXPIRED, tone: "amber" },
            { label: "Doc Mismatch", value: reasonDist.DOC_MISMATCH, tone: "red" },
            { label: "Liveness Failed", value: reasonDist.LIVENESS_FAILED, tone: "red" },
            { label: "AML Flag", value: reasonDist.AML_FLAG, tone: "red" },
            { label: "Manual Request", value: reasonDist.MANUAL_REQUEST, tone: "purple" },
          ]}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Queue" title="Refill submissions" hint="Click row for detail" right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED">
            options={[
              { value: "ALL", label: `All · ${rows.length}` },
              { value: "PENDING", label: `Pending · ${stats.pending}` },
              { value: "UNDER_REVIEW", label: `In review · ${stats.underReview}` },
              { value: "APPROVED", label: `Approved · ${stats.approved}` },
              { value: "REJECTED", label: `Rejected · ${stats.rejected}` },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<RefillRow>
            rows={visible}
            columns={columns}
            onRowClick={setActive}
            getRowTone={(r) => (r.status === "APPROVED" ? "green" : r.status === "REJECTED" ? "red" : r.status === "UNDER_REVIEW" ? "cyan" : "purple")}
            emptyTitle="No refills match"
            emptyHint="Adjust filter."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.entityName ?? "Refill detail"}
        subtitle={active ? `${active.id} · ${fmt(active.submittedAt)}` : undefined}
        severity={active && active.status === "REJECTED" ? "critical" : active && active.status === "UNDER_REVIEW" ? "high" : active && active.status === "APPROVED" ? "info" : "warning"}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={REASON_TONE[active.reason]}>{active.reason.replace(/_/g, " ")}</VerificationChip>
              <VerificationChip tone={STATUS_TONE[active.status]}>{active.status.replace(/_/g, " ")}</VerificationChip>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="text-center">
                  <p className="text-[10px] text-white/40">Attempt</p>
                  <p className="mt-1 text-xl font-bold text-white">#{active.attempt}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-white/40">Uploaded docs</p>
                  <p className="mt-1 text-xl font-bold text-white">{active.attempt === 1 ? "3" : active.attempt === 2 ? "4" : "5"}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Reason" value={active.reason.replace(/_/g, " ")} />
              <InfoCell label="Status" value={active.status.replace(/_/g, " ")} />
              <InfoCell label="Reviewer" value={active.reviewer === "—" ? "Unassigned" : active.reviewer} mono />
              <InfoCell label="Submitted" value={fmt(active.submittedAt)} />
            </div>
            {active.status === "REJECTED" && (
              <div className="rounded-xl border border-[#F05858]/25 bg-[#F05858]/10 p-3">
                <p className="text-[10px] font-semibold text-[#F05858]">REJECTION NOTE</p>
                <p className="mt-2 text-xs text-white/70">Documents do not match identity information. Resubmit with certified copies.</p>
              </div>
            )}
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
