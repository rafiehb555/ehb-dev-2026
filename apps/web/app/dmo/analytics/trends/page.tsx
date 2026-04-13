"use client";

/**
 * DMO — Analytics — Trends
 *   - Platform growth and usage trends
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

type TrendDirection = "UP" | "DOWN";

type TrendRow = {
  id: string;
  metric: string;
  period: string;
  value: number;
  previousValue: number;
  changePercent: number;
  direction: TrendDirection;
  category: string;
};

/* ── Demo data — 8 realistic trends ── */
const DEMO: TrendRow[] = [
  {
    id: "TREND-001",
    metric: "Monthly Active Users",
    period: "April 2026",
    value: 12400,
    previousValue: 11800,
    changePercent: 5.08,
    direction: "UP",
    category: "Engagement",
  },
  {
    id: "TREND-002",
    metric: "Platform Growth Rate",
    period: "YoY",
    value: 8.3,
    previousValue: 7.1,
    changePercent: 1.2,
    direction: "UP",
    category: "Growth",
  },
  {
    id: "TREND-003",
    metric: "User Retention Rate",
    period: "30-day",
    value: 74.2,
    previousValue: 76.5,
    changePercent: -2.3,
    direction: "DOWN",
    category: "Health",
  },
  {
    id: "TREND-004",
    metric: "Monthly Churn Rate",
    period: "April 2026",
    value: 3.2,
    previousValue: 2.8,
    changePercent: 14.29,
    direction: "UP",
    category: "Health",
  },
  {
    id: "TREND-005",
    metric: "Transaction Velocity",
    period: "Daily avg",
    value: 4580,
    previousValue: 4120,
    changePercent: 11.15,
    direction: "UP",
    category: "Finance",
  },
  {
    id: "TREND-006",
    metric: "New Verifications",
    period: "Weekly",
    value: 287,
    previousValue: 245,
    changePercent: 17.14,
    direction: "UP",
    category: "Verification",
  },
  {
    id: "TREND-007",
    metric: "Customer Support Tickets",
    period: "Weekly",
    value: 156,
    previousValue: 178,
    changePercent: -12.36,
    direction: "DOWN",
    category: "Support",
  },
  {
    id: "TREND-008",
    metric: "Average Session Duration",
    period: "Minutes",
    value: 12.5,
    previousValue: 13.8,
    changePercent: -9.42,
    direction: "DOWN",
    category: "Engagement",
  },
];

const CATEGORY_TONE: Record<string, VerificationTone> = {
  Engagement: "cyan",
  Growth: "green",
  Health: "amber",
  Finance: "purple",
  Verification: "teal",
  Support: "red",
};

const DIRECTION_TONE: Record<TrendDirection, VerificationTone> = {
  UP: "green",
  DOWN: "red",
};

const DIRECTION_ICON = {
  UP: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.46 15.54 8 10 2 16" />
      <polyline points="23 6 23 16 13 16" />
    </svg>
  ),
  DOWN: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 18 13.46 8.46 8 14 2 8" />
      <polyline points="23 18 23 8 13 8" />
    </svg>
  ),
};

function fmtValue(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(2);
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

export default function AnalyticsTrendsPage() {
  const [rows] = useState<TrendRow[]>(DEMO);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | string>("ALL");
  const [directionFilter, setDirectionFilter] = useState<"ALL" | TrendDirection>("ALL");
  const [selected, setSelected] = useState<TrendRow | null>(null);

  const stats = useMemo(() => {
    const monthlyUsers = rows.find((r) => r.id === "TREND-001");
    const retentionRate = rows.find((r) => r.id === "TREND-003");
    const churnRate = rows.find((r) => r.id === "TREND-004");
    const growthRate = rows.find((r) => r.id === "TREND-002");

    return {
      monthlyUsers: monthlyUsers?.value ?? 0,
      growthRate: growthRate?.value ?? 0,
      retention: retentionRate?.value ?? 0,
      churn: churnRate?.value ?? 0,
    };
  }, [rows]);

  const categories = Array.from(new Set(rows.map((r) => r.category)));
  const directionBreakdown = useMemo(() => {
    const by: Record<TrendDirection, number> = { UP: 0, DOWN: 0 };
    for (const r of rows) {
      by[r.direction] += 1;
    }
    return by;
  }, [rows]);

  const visible = rows.filter((r) => {
    if (categoryFilter !== "ALL" && r.category !== categoryFilter) return false;
    if (directionFilter !== "ALL" && r.direction !== directionFilter) return false;
    return true;
  });

  const columns: RowColumn<TrendRow>[] = [
    {
      key: "metric",
      header: "Metric",
      width: "minmax(0,1.6fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {r.metric}
          </div>
          <div className="truncate text-[10px] text-white/45">
            {r.period}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <VerificationChip tone={CATEGORY_TONE[r.category] || "cyan"} size="xs">
          {r.category}
        </VerificationChip>
      ),
    },
    {
      key: "value",
      header: "Current",
      width: "minmax(0,0.8fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-sm font-semibold text-white">
          {fmtValue(r.value)}
        </span>
      ),
    },
    {
      key: "previous",
      header: "Previous",
      width: "minmax(0,0.8fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/55">
          {fmtValue(r.previousValue)}
        </span>
      ),
    },
    {
      key: "change",
      header: "Change %",
      width: "minmax(0,0.8fr)",
      align: "right",
      render: (r) => {
        const tone = r.direction === "UP" ? "green" : "red";
        const sign = r.direction === "UP" ? "+" : "";
        return (
          <span
            className={`font-mono text-sm font-semibold ${
              tone === "green" ? "text-[#38C878]" : "text-[#F05858]"
            }`}
          >
            {sign}
            {r.changePercent.toFixed(2)}%
          </span>
        );
      },
    },
    {
      key: "direction",
      header: "Trend",
      width: "minmax(0,0.5fr)",
      align: "center",
      render: (r) => (
        <div
          className={`inline-flex items-center gap-1 ${
            r.direction === "UP" ? "text-[#38C878]" : "text-[#F05858]"
          }`}
        >
          {DIRECTION_ICON[r.direction]}
        </div>
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
              "linear-gradient(90deg, transparent 0%, #2BBFA0 25%, #7B6EF6 50%, #38C878 75%, transparent 100%)",
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
              href="/dmo/analytics"
              className="transition-colors hover:text-[#7B6EF6]"
            >
              Analytics
            </Link>
            <span>/</span>
            <span className="text-white/75">Trends</span>
          </div>
          <h1 className="mb-1 text-3xl font-black text-white">
            Platform Trends
          </h1>
          <p className="text-sm text-white/55">
            Monitor growth, engagement, health, and usage trends across the platform
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
          label="Monthly Users"
          value={`${(stats.monthlyUsers / 1000).toFixed(1)}K`}
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
              <polyline points="23 6 13.46 15.54 8 10 2 16" />
              <polyline points="23 6 23 16 13 16" />
            </svg>
          }
          label="Growth Rate"
          value={`${stats.growthRate.toFixed(1)}%`}
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
              <path d="M12 6v6l4 2" />
            </svg>
          }
          label="Retention"
          value={`${stats.retention.toFixed(1)}%`}
          tone="teal"
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
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          }
          label="Churn Rate"
          value={`${stats.churn.toFixed(1)}%`}
          tone="amber"
        />
      </div>

      {/* Trend direction breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          eyebrow="Trend Summary"
          title="Direction Breakdown"
          hint="Metrics trending upward vs downward"
        />
        <SeverityMeter
          segments={[
            {
              label: "Uptrend",
              value: directionBreakdown.UP,
              tone: "green",
            },
            {
              label: "Downtrend",
              value: directionBreakdown.DOWN,
              tone: "red",
            },
          ]}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Category
          </p>
          <FilterChipRow<"ALL" | string>
            value={categoryFilter}
            options={[
              { value: "ALL", label: "All Categories" },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
            onChange={setCategoryFilter}
          />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Filter by Direction
          </p>
          <FilterChipRow<"ALL" | TrendDirection>
            value={directionFilter}
            options={[
              { value: "ALL", label: "All" },
              { value: "UP", label: "Uptrend" },
              { value: "DOWN", label: "Downtrend" },
            ]}
            onChange={setDirectionFilter}
          />
        </div>
      </div>

      {/* Trends grid */}
      <VerificationRowGrid<TrendRow>
        columns={columns}
        rows={visible}
        onRowClick={setSelected}
        getRowTone={(r) => DIRECTION_TONE[r.direction]}
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
            <polyline points="23 6 13.46 15.54 8 10 2 16" />
            <polyline points="23 6 23 16 13 16" />
          </svg>
        }
        emptyTitle="No trends match filters"
        emptyHint="Try adjusting your category or direction filters to see trends"
      />

      {/* Drawer */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id ?? "Trend detail"}
        subtitle={selected ? `${selected.metric} — ${selected.period}` : ""}
        severity={selected?.direction === "DOWN" ? "warning" : "info"}
      >
        {selected ? (
          <div className="space-y-4">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCell
                label="Metric"
                value={selected.metric}
              />
              <InfoCell
                label="Category"
                value={
                  <VerificationChip
                    tone={CATEGORY_TONE[selected.category] || "cyan"}
                    size="xs"
                  >
                    {selected.category}
                  </VerificationChip>
                }
              />
              <InfoCell
                label="Period"
                value={selected.period}
              />
              <InfoCell
                label="Current Value"
                value={fmtValue(selected.value)}
                mono
              />
              <InfoCell
                label="Previous Value"
                value={fmtValue(selected.previousValue)}
                mono
              />
              <InfoCell
                label="Change"
                value={
                  <span
                    className={
                      selected.direction === "UP"
                        ? "text-[#38C878]"
                        : "text-[#F05858]"
                    }
                  >
                    {selected.direction === "UP" ? "+" : ""}
                    {selected.changePercent.toFixed(2)}%
                  </span>
                }
              />
            </div>

            {/* Trend insight */}
            <div
              className={`rounded-xl border p-3 ${
                selected.direction === "UP"
                  ? "border-[#38C878]/30 bg-[#38C878]/8"
                  : "border-[#F05858]/30 bg-[#F05858]/8"
              }`}
            >
              <p
                className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${
                  selected.direction === "UP"
                    ? "text-[#38C878]/70"
                    : "text-[#F05858]/70"
                }`}
              >
                Trend Insight
              </p>
              <p className="mt-2 text-sm text-white/80">
                {selected.direction === "UP"
                  ? `This metric is trending upward with a ${selected.changePercent.toFixed(2)}% increase compared to the previous period.`
                  : `This metric is trending downward with a ${Math.abs(selected.changePercent).toFixed(2)}% decrease compared to the previous period.`}
              </p>
            </div>

            {/* Absolute vs relative change */}
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Absolute Change
              </p>
              <p className="mt-2 text-sm font-semibold text-white/90">
                {selected.direction === "UP" ? "+" : ""}
                {(selected.value - selected.previousValue).toFixed(2)}
              </p>
              <p className="mt-1 text-[10px] text-white/60">
                From {fmtValue(selected.previousValue)} to {fmtValue(selected.value)}
              </p>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
