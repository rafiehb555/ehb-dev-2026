"use client";

/**
 * DMO — Franchise Control — Reports
 *   - Performance reports per franchise territory
 *   - STL scoring, compliance metrics, operational analytics
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

type ReportType = "MONTHLY" | "QUARTERLY" | "ANNUAL" | "AUDIT";
type ReportStatus = "PUBLISHED" | "DRAFT" | "UNDER_REVIEW";

type FranchiseReport = {
  id: string;
  franchiseName: string;
  country: string;
  reportType: ReportType;
  period: string;
  avgStlScore: number;
  status: ReportStatus;
  createdAt: string;
  publishedAt: string | null;
  metrics: {
    totalProviders: number;
    verifiedProviders: number;
    complaintsResolved: number;
    avgResponseTime: number;
  };
};

/* ── Demo data — 8 realistic franchise reports ── */
const DEMO: FranchiseReport[] = [
  {
    id: "RPT-FR-001",
    franchiseName: "EHB Pakistan",
    country: "Pakistan",
    reportType: "MONTHLY",
    period: "April 2026",
    avgStlScore: 7.8,
    status: "PUBLISHED",
    createdAt: "2026-04-10T09:00:00Z",
    publishedAt: "2026-04-11T14:30:00Z",
    metrics: {
      totalProviders: 145,
      verifiedProviders: 142,
      complaintsResolved: 8,
      avgResponseTime: 4.2,
    },
  },
  {
    id: "RPT-FR-002",
    franchiseName: "EHB Bangladesh",
    country: "Bangladesh",
    reportType: "QUARTERLY",
    period: "Q1 2026",
    avgStlScore: 6.9,
    status: "UNDER_REVIEW",
    createdAt: "2026-04-08T10:15:00Z",
    publishedAt: null,
    metrics: {
      totalProviders: 87,
      verifiedProviders: 81,
      complaintsResolved: 12,
      avgResponseTime: 6.5,
    },
  },
  {
    id: "RPT-FR-003",
    franchiseName: "EHB UAE",
    country: "United Arab Emirates",
    reportType: "MONTHLY",
    period: "April 2026",
    avgStlScore: 8.4,
    status: "PUBLISHED",
    createdAt: "2026-04-09T11:00:00Z",
    publishedAt: "2026-04-10T16:20:00Z",
    metrics: {
      totalProviders: 203,
      verifiedProviders: 201,
      complaintsResolved: 3,
      avgResponseTime: 2.8,
    },
  },
  {
    id: "RPT-FR-004",
    franchiseName: "EHB Sri Lanka",
    country: "Sri Lanka",
    reportType: "MONTHLY",
    period: "April 2026",
    avgStlScore: 7.2,
    status: "DRAFT",
    createdAt: "2026-04-11T08:30:00Z",
    publishedAt: null,
    metrics: {
      totalProviders: 92,
      verifiedProviders: 88,
      complaintsResolved: 6,
      avgResponseTime: 5.1,
    },
  },
  {
    id: "RPT-FR-005",
    franchiseName: "EHB India",
    country: "India",
    reportType: "QUARTERLY",
    period: "Q1 2026",
    avgStlScore: 7.5,
    status: "PUBLISHED",
    createdAt: "2026-04-07T09:45:00Z",
    publishedAt: "2026-04-09T13:15:00Z",
    metrics: {
      totalProviders: 512,
      verifiedProviders: 498,
      complaintsResolved: 22,
      avgResponseTime: 3.9,
    },
  },
  {
    id: "RPT-FR-006",
    franchiseName: "EHB Nepal",
    country: "Nepal",
    reportType: "AUDIT",
    period: "March 2026",
    avgStlScore: 7.6,
    status: "PUBLISHED",
    createdAt: "2026-03-25T10:00:00Z",
    publishedAt: "2026-04-01T10:00:00Z",
    metrics: {
      totalProviders: 67,
      verifiedProviders: 65,
      complaintsResolved: 2,
      avgResponseTime: 3.2,
    },
  },
  {
    id: "RPT-FR-007",
    franchiseName: "EHB Malaysia",
    country: "Malaysia",
    reportType: "MONTHLY",
    period: "April 2026",
    avgStlScore: 7.3,
    status: "DRAFT",
    createdAt: "2026-04-11T12:00:00Z",
    publishedAt: null,
    metrics: {
      totalProviders: 156,
      verifiedProviders: 151,
      complaintsResolved: 7,
      avgResponseTime: 4.8,
    },
  },
  {
    id: "RPT-FR-008",
    franchiseName: "EHB Thailand",
    country: "Thailand",
    reportType: "MONTHLY",
    period: "April 2026",
    avgStlScore: 7.9,
    status: "PUBLISHED",
    createdAt: "2026-04-06T14:30:00Z",
    publishedAt: "2026-04-08T15:45:00Z",
    metrics: {
      totalProviders: 178,
      verifiedProviders: 175,
      complaintsResolved: 5,
      avgResponseTime: 3.5,
    },
  },
];

const STATUS_TONE: Record<ReportStatus, VerificationTone> = {
  PUBLISHED: "green",
  DRAFT: "purple",
  UNDER_REVIEW: "amber",
};

const REPORTTYPE_TONE: Record<ReportType, VerificationTone> = {
  MONTHLY: "teal",
  QUARTERLY: "cyan",
  ANNUAL: "purple",
  AUDIT: "red",
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

function StlScoreBadge({ score }: { score: number }) {
  const getTone = (s: number): VerificationTone => {
    if (s >= 8) return "green";
    if (s >= 7) return "teal";
    if (s >= 6) return "amber";
    return "red";
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold">
      <span className="text-[12px] font-black">{score.toFixed(1)}</span>
      <span className="text-[9px] text-white/60">/10</span>
    </div>
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

export default function FranchiseReportsPage() {
  const [rows] = useState<FranchiseReport[]>(DEMO);
  const [reportTypeFilter, setReportTypeFilter] = useState<"ALL" | ReportType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ReportStatus>("ALL");
  const [selected, setSelected] = useState<FranchiseReport | null>(null);

  const stats = useMemo(() => {
    const st = {
      totalReports: rows.length,
      thisMonth: rows.filter((r) => {
        const createdMonth = new Date(r.createdAt).getMonth();
        const thisMonth = new Date().getMonth();
        return createdMonth === thisMonth;
      }).length,
      published: rows.filter((r) => r.status === "PUBLISHED").length,
      draft: rows.filter((r) => r.status === "DRAFT").length,
    };
    return st;
  }, [rows]);

  const avgScore = useMemo(() => {
    const avg = rows.reduce((sum, r) => sum + r.avgStlScore, 0) / rows.length;
    return avg.toFixed(1);
  }, [rows]);

  const topFranchise = useMemo(() => {
    const sorted = [...rows].sort((a, b) => b.avgStlScore - a.avgStlScore);
    return sorted[0]?.country || "N/A";
  }, [rows]);

  const reportTypeBreakdown = useMemo(() => {
    const by: Record<ReportType, number> = { MONTHLY: 0, QUARTERLY: 0, ANNUAL: 0, AUDIT: 0 };
    for (const r of rows) {
      by[r.reportType] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (reportTypeFilter !== "ALL" && r.reportType !== reportTypeFilter) return false;
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    return true;
  });

  const columns: RowColumn<FranchiseReport>[] = [
    {
      key: "id",
      header: "Report ID",
      width: "minmax(0,0.75fr)",
      render: (r) => (
        <span className="font-mono text-[10px] font-semibold text-white/70">
          {r.id}
        </span>
      ),
    },
    {
      key: "franchise",
      header: "Franchise",
      width: "minmax(0,1.6fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {r.franchiseName}
          </div>
          <div className="truncate text-[10px] text-white/45">
            {r.country}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      width: "minmax(0,0.8fr)",
      render: (r) => (
        <VerificationChip tone={REPORTTYPE_TONE[r.reportType]} size="xs">
          {r.reportType}
        </VerificationChip>
      ),
    },
    {
      key: "period",
      header: "Period",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <span className="text-sm text-white/85">{r.period}</span>
      ),
    },
    {
      key: "score",
      header: "STL Score",
      width: "minmax(0,0.7fr)",
      align: "center",
      render: (r) => <StlScoreBadge score={r.avgStlScore} />,
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
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-[#F0A030]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #F0A030 25%, #7B6EF6 50%, #2BBFA0 75%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F0A030]/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/40" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#F0A030]/14 via-[#7B6EF6]/10 to-transparent blur-3xl" />

        <div className="relative">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/55">
            <Link
              href="/dmo"
              className="transition-colors hover:text-[#F0A030]"
            >
              DMO
            </Link>
            <span>/</span>
            <Link
              href="/dmo/franchise"
              className="transition-colors hover:text-[#F0A030]"
            >
              Franchise
            </Link>
            <span>/</span>
            <span className="text-white/75">Reports</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Franchise Reports
          </h1>
          <p className="text-sm text-white/55">
            Analyze performance metrics and STL compliance across all franchise territories
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
          label="Total Reports"
          value={stats.totalReports}
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
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          }
          label="This Month"
          value={stats.thisMonth}
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
              <polyline points="12 1 3 5 3 19 12 23 21 19 21 5 12 1" />
              <polyline points="12 12 3 7" />
              <polyline points="12 12 12 23" />
              <polyline points="12 12 21 7" />
            </svg>
          }
          label="Avg STL Score"
          value={avgScore}
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M9 8l4 4 4-4" />
            </svg>
          }
          label="Published"
          value={stats.published}
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
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          }
          label="Top Territory"
          value={topFranchise}
          tone="teal"
        />
      </div>

      {/* Report type breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Report Breakdown"
          title="Reports by Type"
          hint="Distribution of reports across different report types"
        />
        <SeverityMeter
          segments={[
            {
              label: "Monthly",
              value: reportTypeBreakdown.MONTHLY,
              tone: "teal",
            },
            {
              label: "Quarterly",
              value: reportTypeBreakdown.QUARTERLY,
              tone: "cyan",
            },
            {
              label: "Annual",
              value: reportTypeBreakdown.ANNUAL,
              tone: "purple",
            },
            {
              label: "Audit",
              value: reportTypeBreakdown.AUDIT,
              tone: "red",
            },
          ]}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Type
          </p>
          <FilterChipRow<"ALL" | ReportType>
            value={reportTypeFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "MONTHLY", label: "Monthly" },
              { value: "QUARTERLY", label: "Quarterly" },
              { value: "ANNUAL", label: "Annual" },
              { value: "AUDIT", label: "Audit" },
            ]}
            onChange={setReportTypeFilter}
          />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Status
          </p>
          <FilterChipRow<"ALL" | ReportStatus>
            value={statusFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "PUBLISHED", label: "Published" },
              { value: "UNDER_REVIEW", label: "Under Review" },
              { value: "DRAFT", label: "Draft" },
            ]}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Reports grid */}
      <VerificationRowGrid<FranchiseReport>
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
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        }
        emptyTitle="No reports match filters"
        emptyHint="Try adjusting your type or status filters to see reports"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Report detail"}
        subtitle={selected ? `${selected.reportType} Report: ${selected.franchiseName}` : ""}
        severity={
          selected
            ? selected.status === "DRAFT"
              ? "info"
              : selected.status === "UNDER_REVIEW"
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
                value={selected.franchiseName}
              />
              <InfoCell
                label="Country"
                value={selected.country}
              />
              <InfoCell
                label="Report Type"
                value={
                  <VerificationChip tone={REPORTTYPE_TONE[selected.reportType]} size="xs">
                    {selected.reportType}
                  </VerificationChip>
                }
              />
              <InfoCell
                label="Period"
                value={selected.period}
              />
              <InfoCell
                label="STL Score"
                value={<StlScoreBadge score={selected.avgStlScore} />}
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
                label="Created"
                value={fmtDate(selected.createdAt)}
              />
              {selected.publishedAt && (
                <InfoCell
                  label="Published"
                  value={fmtDate(selected.publishedAt)}
                />
              )}
            </div>

            {/* Key metrics */}
            <div className="rounded-xl border border-[#2BBFA0]/30 bg-[#2BBFA0]/8 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#2BBFA0]/70">
                Key Metrics
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-white/60">Total Providers</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {selected.metrics.totalProviders}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/60">Verified</p>
                  <p className="mt-1 text-lg font-bold text-[#2BBFA0]">
                    {selected.metrics.verifiedProviders}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/60">Complaints Resolved</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {selected.metrics.complaintsResolved}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-white/60">Avg Response Time</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {selected.metrics.avgResponseTime.toFixed(1)}h
                  </p>
                </div>
              </div>
            </div>

            {/* Verification rate */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Verification Rate
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 overflow-hidden rounded-full bg-white/10 h-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#2BBFA0] to-[#38C878]"
                    style={{
                      width: `${(selected.metrics.verifiedProviders / selected.metrics.totalProviders) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white/85">
                  {((selected.metrics.verifiedProviders / selected.metrics.totalProviders) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              {selected.status === "DRAFT" && (
                <>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#7B6EF6] transition-all hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/25"
                  >
                    Submit for Review
                  </button>
                </>
              )}
              {selected.status === "UNDER_REVIEW" && (
                <>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-[#38C878]/40 bg-[#38C878]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#38C878] transition-all hover:border-[#38C878]/70 hover:bg-[#38C878]/25"
                  >
                    Approve & Publish
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-[#F05858]/40 bg-[#F05858]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#F05858] transition-all hover:border-[#F05858]/70 hover:bg-[#F05858]/25"
                  >
                    Request Changes
                  </button>
                </>
              )}
              <button
                type="button"
                className="flex-1 rounded-lg border border-[#67E8F9]/40 bg-[#67E8F9]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#67E8F9] transition-all hover:border-[#67E8F9]/70 hover:bg-[#67E8F9]/25"
              >
                Download PDF
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
