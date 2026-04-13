"use client";

/**
 * DMO — Analytics — Segments
 *   - User segment behavioral and demographic analysis
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

type SegmentTier = "ENTERPRISE" | "PROFESSIONAL" | "STANDARD" | "STARTER";

type SegmentRow = {
  id: string;
  segmentName: string;
  size: number;
  avgStlLevel: number;
  avgRevenue: number;
  retentionRate: number;
  growthRate: number;
  tier: SegmentTier;
  topIndustry: string;
};

/* ── Demo data — 8 realistic segments ── */
const DEMO: SegmentRow[] = [
  {
    id: "SEG-001",
    segmentName: "Enterprise Partners",
    size: 124,
    avgStlLevel: 7.4,
    avgRevenue: 85000,
    retentionRate: 92.3,
    growthRate: 3.2,
    tier: "ENTERPRISE",
    topIndustry: "E-commerce",
  },
  {
    id: "SEG-002",
    segmentName: "Professional Services",
    size: 298,
    avgStlLevel: 6.2,
    avgRevenue: 28500,
    retentionRate: 78.9,
    growthRate: 8.7,
    tier: "PROFESSIONAL",
    topIndustry: "Legal",
  },
  {
    id: "SEG-003",
    segmentName: "Small Business",
    size: 512,
    avgStlLevel: 4.8,
    avgRevenue: 8200,
    retentionRate: 65.4,
    growthRate: 12.1,
    tier: "STANDARD",
    topIndustry: "Retail",
  },
  {
    id: "SEG-004",
    segmentName: "Startup Ecosystem",
    size: 187,
    avgStlLevel: 3.5,
    avgRevenue: 3400,
    retentionRate: 58.2,
    growthRate: 24.5,
    tier: "STARTER",
    topIndustry: "Technology",
  },
  {
    id: "SEG-005",
    segmentName: "Individual Freelancers",
    size: 831,
    avgStlLevel: 3.2,
    avgRevenue: 1800,
    retentionRate: 48.7,
    growthRate: 18.3,
    tier: "STARTER",
    topIndustry: "Consulting",
  },
  {
    id: "SEG-006",
    segmentName: "Education Institutions",
    size: 45,
    avgStlLevel: 5.9,
    avgRevenue: 42000,
    retentionRate: 88.9,
    growthRate: 5.6,
    tier: "PROFESSIONAL",
    topIndustry: "Education",
  },
  {
    id: "SEG-007",
    segmentName: "Healthcare Providers",
    size: 92,
    avgStlLevel: 6.8,
    avgRevenue: 65000,
    retentionRate: 94.1,
    growthRate: 7.2,
    tier: "PROFESSIONAL",
    topIndustry: "Medical",
  },
  {
    id: "SEG-008",
    segmentName: "Travel & Logistics",
    size: 156,
    avgStlLevel: 5.3,
    avgRevenue: 18500,
    retentionRate: 72.4,
    growthRate: 10.8,
    tier: "STANDARD",
    topIndustry: "Travel",
  },
];

const TIER_TONE: Record<SegmentTier, VerificationTone> = {
  ENTERPRISE: "purple",
  PROFESSIONAL: "teal",
  STANDARD: "cyan",
  STARTER: "amber",
};

const TIER_COLORS: Record<SegmentTier, string> = {
  ENTERPRISE: "#7B6EF6",
  PROFESSIONAL: "#2BBFA0",
  STANDARD: "#67E8F9",
  STARTER: "#F0A030",
};

function fmtCurrency(value: number): string {
  return `PKR ${(value / 1000).toFixed(0)}K`;
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

export default function AnalyticsSegmentsPage() {
  const [rows] = useState<SegmentRow[]>(DEMO);
  const [tierFilter, setTierFilter] = useState<"ALL" | SegmentTier>("ALL");
  const [selected, setSelected] = useState<SegmentRow | null>(null);

  const stats = useMemo(() => {
    const largest = rows.reduce((a, b) => (a.size > b.size ? a : b));
    const smallest = rows.reduce((a, b) => (a.size < b.size ? a : b));
    const newThisMonth = 245; // demo data

    return {
      totalSegments: rows.length,
      largestSegment: `${largest.segmentName} - ${((largest.size / rows.reduce((sum, r) => sum + r.size, 0)) * 100).toFixed(0)}%`,
      smallestSegment: `${smallest.segmentName} - ${((smallest.size / rows.reduce((sum, r) => sum + r.size, 0)) * 100).toFixed(0)}%`,
      newThisMonth,
    };
  }, [rows]);

  const tierBreakdown = useMemo(() => {
    const by: Record<SegmentTier, number> = {
      ENTERPRISE: 0,
      PROFESSIONAL: 0,
      STANDARD: 0,
      STARTER: 0,
    };
    for (const r of rows) {
      by[r.tier] += r.size;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (tierFilter !== "ALL" && r.tier !== tierFilter) return false;
    return true;
  });

  const columns: RowColumn<SegmentRow>[] = [
    {
      key: "segmentName",
      header: "Segment",
      width: "minmax(0,1.6fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {r.segmentName}
          </div>
          <div className="truncate text-[10px] text-white/45">
            {r.topIndustry}
          </div>
        </div>
      ),
    },
    {
      key: "tier",
      header: "Tier",
      width: "minmax(0,0.8fr)",
      render: (r) => (
        <VerificationChip tone={TIER_TONE[r.tier]} size="xs">
          {r.tier}
        </VerificationChip>
      ),
    },
    {
      key: "size",
      header: "Size",
      width: "minmax(0,0.7fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-sm font-semibold text-white">
          {r.size}
        </span>
      ),
    },
    {
      key: "stl",
      header: "Avg STL",
      width: "minmax(0,0.6fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/55">
          L{r.avgStlLevel.toFixed(1)}
        </span>
      ),
    },
    {
      key: "revenue",
      header: "Avg Revenue",
      width: "minmax(0,0.9fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-[10px] text-white/70">
          {fmtCurrency(r.avgRevenue)}
        </span>
      ),
    },
    {
      key: "retention",
      header: "Retention",
      width: "minmax(0,0.8fr)",
      align: "right",
      render: (r) => {
        const tone =
          r.retentionRate >= 80
            ? "green"
            : r.retentionRate >= 65
            ? "amber"
            : "red";
        return (
          <span
            className={`text-[10px] font-semibold ${
              tone === "green"
                ? "text-[#38C878]"
                : tone === "amber"
                ? "text-[#F0A030]"
                : "text-[#F05858]"
            }`}
          >
            {r.retentionRate.toFixed(1)}%
          </span>
        );
      },
    },
    {
      key: "growth",
      header: "Growth",
      width: "minmax(0,0.7fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] font-semibold text-[#38C878]">
          +{r.growthRate.toFixed(1)}%
        </span>
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
              "linear-gradient(90deg, transparent 0%, #7B6EF6 25%, #2BBFA0 50%, #67E8F9 75%, transparent 100%)",
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
              href="/dmo/analytics"
              className="transition-colors hover:text-[#7B6EF6]"
            >
              Analytics
            </Link>
            <span>/</span>
            <span className="text-white/75">Segments</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            User Segments
          </h1>
          <p className="text-sm text-white/55">
            Behavioral and demographic segmentation across all user tiers
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          label="Total Segments"
          value={stats.totalSegments}
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
          label="Largest Segment"
          value="34%"
          sub="Enterprise"
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          }
          label="Smallest Segment"
          value="8%"
          sub="Starter"
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
              <path d="M12 2v20M2 12h20" />
            </svg>
          }
          label="New This Month"
          value={stats.newThisMonth}
          tone="teal"
        />
      </div>

      {/* Tier breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Segment Distribution"
          title="Users by Tier"
          hint="Total users across all customer tiers"
        />
        <SeverityMeter
          segments={[
            {
              label: "Enterprise",
              value: tierBreakdown.ENTERPRISE,
              tone: "purple",
            },
            {
              label: "Professional",
              value: tierBreakdown.PROFESSIONAL,
              tone: "teal",
            },
            {
              label: "Standard",
              value: tierBreakdown.STANDARD,
              tone: "cyan",
            },
            {
              label: "Starter",
              value: tierBreakdown.STARTER,
              tone: "amber",
            },
          ]}
        />
      </div>

      {/* Filter */}
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Filter by Tier
        </p>
        <FilterChipRow<"ALL" | SegmentTier>
          value={tierFilter}
          options={[
            { value: "ALL", label: "All Tiers" },
            { value: "ENTERPRISE", label: "Enterprise" },
            { value: "PROFESSIONAL", label: "Professional" },
            { value: "STANDARD", label: "Standard" },
            { value: "STARTER", label: "Starter" },
          ]}
          onChange={setTierFilter}
        />
      </div>

      {/* Segments grid */}
      <VerificationRowGrid<SegmentRow>
        columns={columns}
        rows={visible}
        onRowClick={setSelected}
        getRowTone={(r) => TIER_TONE[r.tier]}
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
        emptyTitle="No segments match filters"
        emptyHint="Try adjusting your tier filter to see segments"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Segment detail"}
        subtitle={selected ? `${selected.segmentName} — ${selected.tier} Tier` : ""}
        severity={
          (selected?.retentionRate ?? 0) >= 80
            ? "info"
            : (selected?.retentionRate ?? 0) >= 65
            ? "warning"
            : "high"
        }
      >
        {selected ? (
          <div className="space-y-4">
            {/* Overview grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell
                label="Segment Name"
                value={selected.segmentName}
              />
              <InfoCell
                label="Tier"
                value={
                  <VerificationChip tone={TIER_TONE[selected.tier]} size="xs">
                    {selected.tier}
                  </VerificationChip>
                }
              />
              <InfoCell
                label="Segment Size"
                value={selected.size}
                mono
              />
              <InfoCell
                label="Top Industry"
                value={selected.topIndustry}
              />
              <InfoCell
                label="Avg STL Level"
                value={`L${selected.avgStlLevel.toFixed(1)}`}
                mono
              />
              <InfoCell
                label="Avg Revenue"
                value={fmtCurrency(selected.avgRevenue)}
                mono
              />
            </div>

            {/* Health metrics */}
            <div className="space-y-3">
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Retention Rate
                </p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-2xl font-black text-white">
                    {selected.retentionRate.toFixed(1)}%
                  </p>
                  <div className="h-16 w-24 rounded bg-white/10" style={{
                    background: `linear-gradient(to top, ${TIER_COLORS[selected.tier]}40, transparent)`,
                  }}>
                    <div
                      style={{
                        height: `${selected?.retentionRate}%`,
                        background: TIER_COLORS[selected.tier],
                        borderRadius: "4px",
                        marginTop: `${100 - selected?.retentionRate}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Growth Rate
                </p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-2xl font-black text-[#38C878]">
                    +{selected.growthRate.toFixed(1)}%
                  </p>
                  <div className="text-[10px] text-white/60">
                    Month-over-month
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement summary */}
            <div className="rounded-xl border border-[#2BBFA0]/30 bg-[#2BBFA0]/8 p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#2BBFA0]/70">
                Segment Health
              </p>
              <p className="mt-2 text-sm text-white/80">
                {selected?.retentionRate >= 80
                  ? "High engagement and strong retention. Consider expansion opportunities."
                  : selected?.retentionRate >= 65
                  ? "Moderate retention. Focus on engagement initiatives to improve loyalty."
                  : "Low retention. Immediate action recommended to understand churn drivers."}
              </p>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
