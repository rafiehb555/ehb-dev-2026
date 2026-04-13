"use client";

/**
 * DMO — PSS (Proof & Security System) — Cases
 *   - KYC/KYB/AML/Liveness verification cases
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

type VerificationType = "KYC" | "KYB" | "AML" | "LIVENESS";
type VerificationStatus = "PENDING" | "IN_REVIEW" | "VERIFIED" | "REJECTED" | "EXPIRED";
type RiskLevel = "low" | "medium" | "high" | "critical";

type PssCaseRow = {
  id: string;
  applicantName: string;
  applicantEmail: string;
  verificationType: VerificationType;
  status: VerificationStatus;
  riskLevel: RiskLevel;
  submittedAt: string;
  reviewedBy: string | null;
  documentCount: number;
  riskScore: number;
};

/* ── Demo data — 8-10 realistic Pakistani cases ── */
const DEMO: PssCaseRow[] = [
  {
    id: "PSS-KYC-001",
    applicantName: "Muhammad Ali Khan",
    applicantEmail: "m.ali@business.pk",
    verificationType: "KYC",
    status: "VERIFIED",
    riskLevel: "low",
    submittedAt: "2026-04-08T10:30:00Z",
    reviewedBy: "Verifier_PKH01",
    documentCount: 4,
    riskScore: 18,
  },
  {
    id: "PSS-KYB-002",
    applicantName: "TechVision Solutions Pvt Ltd",
    applicantEmail: "compliance@techvision.pk",
    verificationType: "KYB",
    status: "IN_REVIEW",
    riskLevel: "medium",
    submittedAt: "2026-04-10T14:15:00Z",
    reviewedBy: "Verifier_KCH02",
    documentCount: 7,
    riskScore: 51,
  },
  {
    id: "PSS-AML-003",
    applicantName: "Fatima Noor Ahmed",
    applicantEmail: "fatima.noor@merchant.pk",
    verificationType: "AML",
    status: "PENDING",
    riskLevel: "high",
    submittedAt: "2026-04-11T09:00:00Z",
    reviewedBy: null,
    documentCount: 3,
    riskScore: 72,
  },
  {
    id: "PSS-LIVENESS-004",
    applicantName: "Usman Raza",
    applicantEmail: "usman.raza@startup.pk",
    verificationType: "LIVENESS",
    status: "VERIFIED",
    riskLevel: "low",
    submittedAt: "2026-04-09T16:45:00Z",
    reviewedBy: "Verifier_ISB01",
    documentCount: 2,
    riskScore: 22,
  },
  {
    id: "PSS-KYC-005",
    applicantName: "Saif Ul Islam",
    applicantEmail: "saif.islam@freelancer.pk",
    verificationType: "KYC",
    status: "REJECTED",
    riskLevel: "critical",
    submittedAt: "2026-04-06T11:20:00Z",
    reviewedBy: "Verifier_LHR03",
    documentCount: 2,
    riskScore: 88,
  },
  {
    id: "PSS-KYB-006",
    applicantName: "Elite Trading Company",
    applicantEmail: "admin@elitetrading.pk",
    verificationType: "KYB",
    status: "EXPIRED",
    riskLevel: "high",
    submittedAt: "2026-03-15T08:00:00Z",
    reviewedBy: "Verifier_KCH01",
    documentCount: 5,
    riskScore: 67,
  },
  {
    id: "PSS-AML-007",
    applicantName: "Sara Malik",
    applicantEmail: "sara.malik@finance.pk",
    verificationType: "AML",
    status: "IN_REVIEW",
    riskLevel: "medium",
    submittedAt: "2026-04-11T13:30:00Z",
    reviewedBy: "Verifier_ISB02",
    documentCount: 6,
    riskScore: 44,
  },
  {
    id: "PSS-LIVENESS-008",
    applicantName: "Hassan Rauf",
    applicantEmail: "hassan.rauf@business.pk",
    verificationType: "LIVENESS",
    status: "PENDING",
    riskLevel: "low",
    submittedAt: "2026-04-11T15:00:00Z",
    reviewedBy: null,
    documentCount: 1,
    riskScore: 28,
  },
  {
    id: "PSS-KYC-009",
    applicantName: "Amina Farah",
    applicantEmail: "amina.farah@ecommerce.pk",
    verificationType: "KYC",
    status: "IN_REVIEW",
    riskLevel: "medium",
    submittedAt: "2026-04-10T10:00:00Z",
    reviewedBy: "Verifier_PKH02",
    documentCount: 4,
    riskScore: 55,
  },
  {
    id: "PSS-KYB-010",
    applicantName: "Digital Commerce Hub",
    applicantEmail: "ops@digcomhub.pk",
    verificationType: "KYB",
    status: "VERIFIED",
    riskLevel: "low",
    submittedAt: "2026-04-07T12:00:00Z",
    reviewedBy: "Verifier_KCH03",
    documentCount: 8,
    riskScore: 16,
  },
];

const STATUS_TONE: Record<VerificationStatus, VerificationTone> = {
  PENDING: "purple",
  IN_REVIEW: "amber",
  VERIFIED: "green",
  REJECTED: "red",
  EXPIRED: "cyan",
};

const TYPE_TONE: Record<VerificationType, VerificationTone> = {
  KYC: "teal",
  KYB: "cyan",
  AML: "amber",
  LIVENESS: "green",
};

const RISK_TONE: Record<RiskLevel, VerificationTone> = {
  low: "green",
  medium: "amber",
  high: "red",
  critical: "red",
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

export default function PssCasesPage() {
  const [rows] = useState<PssCaseRow[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | VerificationStatus>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | VerificationType>("ALL");
  const [selected, setSelected] = useState<PssCaseRow | null>(null);

  const stats = useMemo(() => {
    const st = {
      total: rows.length,
      pending: rows.filter((r) => r.status === "PENDING").length,
      inReview: rows.filter((r) => r.status === "IN_REVIEW").length,
      verified: rows.filter((r) => r.status === "VERIFIED").length,
      rejected: rows.filter((r) => r.status === "REJECTED").length,
    };
    return st;
  }, [rows]);

  const riskBreakdown = useMemo(() => {
    const by: Record<RiskLevel, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const r of rows) {
      by[r.riskLevel] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (typeFilter !== "ALL" && r.verificationType !== typeFilter) return false;
    return true;
  });

  const columns: RowColumn<PssCaseRow>[] = [
    {
      key: "id",
      header: "Case ID",
      width: "minmax(0,0.8fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.id}
        </span>
      ),
    },
    {
      key: "applicant",
      header: "Applicant",
      width: "minmax(0,1.6fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {r.applicantName}
          </div>
          <div className="truncate text-[10px] text-white/45">
            {r.applicantEmail}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      width: "minmax(0,0.7fr)",
      render: (r) => (
        <VerificationChip tone={TYPE_TONE[r.verificationType]} size="xs">
          {r.verificationType}
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
      key: "risk",
      header: "Risk",
      width: "minmax(0,0.7fr)",
      render: (r) => (
        <VerificationChip
          tone={RISK_TONE[r.riskLevel]}
          size="xs"
        >
          {r.riskLevel.toUpperCase()}
        </VerificationChip>
      ),
    },
    {
      key: "submitted",
      header: "Submitted",
      width: "minmax(0,1.1fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/45">{fmtTime(r.submittedAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #2BBFA0 25%, #7B6EF6 50%, #F0A030 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#2BBFA0]/14 via-[#7B6EF6]/10 to-transparent blur-3xl" />

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
              href="/dmo/pss"
              className="transition-colors hover:text-[#7B6EF6]"
            >
              PSS
            </Link>
            <span>/</span>
            <span className="text-white/75">Cases</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Verification Cases
          </h1>
          <p className="text-sm text-white/55">
            Monitor and manage KYC, KYB, AML, and Liveness verification workflows
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2.5" />
            </svg>
          }
          label="Total Cases"
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
          label="In Review"
          value={stats.inReview}
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
          label="Verified"
          value={stats.verified}
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
          label="Rejected"
          value={stats.rejected}
          tone="red"
        />
      </div>

      {/* Risk breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Risk Distribution"
          title="Case Risk Severity"
          hint="Breakdown of cases by risk level"
        />
        <SeverityMeter
          segments={[
            {
              label: "Low",
              value: riskBreakdown.low,
              tone: "green",
            },
            {
              label: "Medium",
              value: riskBreakdown.medium,
              tone: "amber",
            },
            {
              label: "High",
              value: riskBreakdown.high,
              tone: "red",
            },
            {
              label: "Critical",
              value: riskBreakdown.critical,
              tone: "red",
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
          <FilterChipRow<"ALL" | VerificationStatus>
            value={statusFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "PENDING", label: "Pending" },
              { value: "IN_REVIEW", label: "In Review" },
              { value: "VERIFIED", label: "Verified" },
              { value: "REJECTED", label: "Rejected" },
              { value: "EXPIRED", label: "Expired" },
            ]}
            onChange={setStatusFilter}
          />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Type
          </p>
          <FilterChipRow<"ALL" | VerificationType>
            value={typeFilter}
            options={[
              { value: "ALL", label: "All Types" },
              { value: "KYC", label: "KYC" },
              { value: "KYB", label: "KYB" },
              { value: "AML", label: "AML" },
              { value: "LIVENESS", label: "Liveness" },
            ]}
            onChange={setTypeFilter}
          />
        </div>
      </div>

      {/* Cases grid */}
      <VerificationRowGrid<PssCaseRow>
        columns={columns}
        rows={visible}
        onRowClick={setSelected}
        getRowTone={(r) => RISK_TONE[r.riskLevel]}
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
            <path d="M8 12h8" />
          </svg>
        }
        emptyTitle="No cases match filters"
        emptyHint="Try adjusting your status or type filters to see cases"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Case detail"}
        subtitle={selected ? `${selected.verificationType} case for ${selected.applicantName}` : ""}
        severity={
          selected
            ? selected.riskLevel === "critical"
              ? "critical"
              : selected.riskLevel === "high"
              ? "high"
              : selected.riskLevel === "medium"
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
                label="Applicant Name"
                value={selected.applicantName}
              />
              <InfoCell
                label="Email"
                value={selected.applicantEmail}
              />
              <InfoCell
                label="Verification Type"
                value={
                  <VerificationChip tone={TYPE_TONE[selected.verificationType]} size="xs">
                    {selected.verificationType}
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
                label="Risk Level"
                value={
                  <VerificationChip tone={RISK_TONE[selected.riskLevel]} size="xs">
                    {selected.riskLevel.toUpperCase()}
                  </VerificationChip>
                }
              />
              <InfoCell
                label="Risk Score"
                value={`${selected.riskScore}/100`}
                mono
              />
              <InfoCell
                label="Submitted At"
                value={fmtTime(selected.submittedAt)}
              />
              <InfoCell
                label="Documents"
                value={`${selected.documentCount} file(s)`}
              />
            </div>

            {/* Reviewer info */}
            {selected.reviewedBy && (
              <div className="rounded-xl border border-[#2BBFA0]/30 bg-[#2BBFA0]/8 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#2BBFA0]/70">
                  Reviewed By
                </p>
                <p className="mt-1 text-sm font-semibold text-white/90">
                  {selected.reviewedBy}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              {selected.status === "PENDING" && (
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#7B6EF6] transition-all hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/25"
                >
                  Start Review
                </button>
              )}
              {selected.status === "IN_REVIEW" && (
                <>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-[#38C878]/40 bg-[#38C878]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#38C878] transition-all hover:border-[#38C878]/70 hover:bg-[#38C878]/25"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-[#F05858]/40 bg-[#F05858]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#F05858] transition-all hover:border-[#F05858]/70 hover:bg-[#F05858]/25"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
