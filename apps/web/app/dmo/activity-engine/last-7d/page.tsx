"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type DailyActivity = {
  id: string;
  date: string;
  module: "STL" | "PSS" | "CRB" | "WALLET" | "FRANCHISE";
  eventCount: number;
  uniqueUsers: number;
  alertCount: number;
};

const DEMO_DAILY_ACTIVITY: DailyActivity[] = [
  {
    id: "day-001",
    date: "2026-04-12",
    module: "STL",
    eventCount: 287,
    uniqueUsers: 34,
    alertCount: 3,
  },
  {
    id: "day-002",
    date: "2026-04-11",
    module: "PSS",
    eventCount: 412,
    uniqueUsers: 52,
    alertCount: 7,
  },
  {
    id: "day-003",
    date: "2026-04-10",
    module: "CRB",
    eventCount: 156,
    uniqueUsers: 18,
    alertCount: 1,
  },
  {
    id: "day-004",
    date: "2026-04-09",
    module: "WALLET",
    eventCount: 523,
    uniqueUsers: 67,
    alertCount: 2,
  },
  {
    id: "day-005",
    date: "2026-04-08",
    module: "FRANCHISE",
    eventCount: 201,
    uniqueUsers: 22,
    alertCount: 4,
  },
  {
    id: "day-006",
    date: "2026-04-07",
    module: "STL",
    eventCount: 298,
    uniqueUsers: 38,
    alertCount: 2,
  },
  {
    id: "day-007",
    date: "2026-04-06",
    module: "PSS",
    eventCount: 263,
    uniqueUsers: 29,
    alertCount: 1,
  },
  {
    id: "day-008",
    date: "2026-04-05",
    module: "CRB",
    eventCount: 189,
    uniqueUsers: 25,
    alertCount: 3,
  },
  {
    id: "day-009",
    date: "2026-04-04",
    module: "WALLET",
    eventCount: 445,
    uniqueUsers: 58,
    alertCount: 5,
  },
  {
    id: "day-010",
    date: "2026-04-03",
    module: "FRANCHISE",
    eventCount: 166,
    uniqueUsers: 19,
    alertCount: 2,
  },
];

export default function Last7dActivityPage() {
  const [selectedDay, setSelectedDay] = useState<DailyActivity | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalEvents = DEMO_DAILY_ACTIVITY.reduce((sum, d) => sum + d.eventCount, 0);
    const dailyAvg = Math.round(totalEvents / 7);
    const totalUsers = new Set(
      DEMO_DAILY_ACTIVITY.map((d) => d.id)
    ).size;

    let maxDay = DEMO_DAILY_ACTIVITY[0];
    for (const day of DEMO_DAILY_ACTIVITY) {
      if (day.eventCount > maxDay.eventCount) {
        maxDay = day;
      }
    }
    const maxDayName = new Date(maxDay.date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const growth = 12;

    return {
      totalEvents,
      dailyAvg,
      mostActiveDay: maxDayName,
      growth: `+${growth}%`,
    };
  }, []);

  const moduleDistribution = useMemo(() => {
    const dist: Record<string, number> = {
      STL: 0,
      PSS: 0,
      CRB: 0,
      WALLET: 0,
      FRANCHISE: 0,
    };
    for (const day of DEMO_DAILY_ACTIVITY) {
      dist[day.module] = (dist[day.module] || 0) + day.eventCount;
    }
    return [
      { label: "STL", value: dist.STL, tone: "purple" as VerificationTone },
      { label: "PSS", value: dist.PSS, tone: "teal" as VerificationTone },
      { label: "CRB", value: dist.CRB, tone: "amber" as VerificationTone },
      { label: "WALLET", value: dist.WALLET, tone: "green" as VerificationTone },
      { label: "FRANCHISE", value: dist.FRANCHISE, tone: "cyan" as VerificationTone },
    ];
  }, []);

  const columns: RowColumn<DailyActivity>[] = [
    {
      key: "date",
      header: "Date",
      width: "minmax(0, 1fr)",
      render: (day) => {
        const dt = new Date(day.date);
        return `${dt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      },
    },
    {
      key: "module",
      header: "Module",
      width: "minmax(0, 0.9fr)",
      render: (day) => (
        <VerificationChip tone="purple">
          {day.module}
        </VerificationChip>
      ),
    },
    {
      key: "eventCount",
      header: "Events",
      width: "minmax(0, 0.8fr)",
      render: (day) => (
        <span style={{ color: "#A098F8", fontWeight: "600" }}>
          {day.eventCount}
        </span>
      ),
    },
    {
      key: "uniqueUsers",
      header: "Unique Users",
      width: "minmax(0, 1fr)",
      render: (day) => (
        <span style={{ color: "#2BBFA0", fontWeight: "600" }}>
          {day.uniqueUsers}
        </span>
      ),
    },
    {
      key: "alertCount",
      header: "Alerts",
      width: "minmax(0, 0.7fr)",
      render: (day) => (
        <VerificationChip tone={day.alertCount > 3 ? "red" : "amber"}>
          {day.alertCount}
        </VerificationChip>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0E1A] px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeader
        title="DMO / Activity Engine / Last 7 Days"
        hint="Daily event aggregation across all modules"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Total Events"
          value={stats.totalEvents.toString()}
          sub="In last 7 days"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="teal"
          label="Daily Average"
          value={stats.dailyAvg.toString()}
          sub="Events per day"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="amber"
          label="Most Active Day"
          value={stats.mostActiveDay}
          sub="Highest activity"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
          }
        />

        <VerificationStatCard
          tone="green"
          label="Growth"
          value={stats.growth}
          sub="Week-over-week"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          }
        />
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          title="Activity by Module"
          hint="Visual breakdown of module activity"
        />
        <SeverityMeter segments={moduleDistribution} />
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-xl">
        <SectionHeader
          title="Daily Activity"
          hint="Click a row to view daily breakdown"
        />
        <VerificationRowGrid<DailyActivity>
          rows={DEMO_DAILY_ACTIVITY}
          columns={columns}
          onRowClick={setSelectedDay}
        />
      </div>

      {selectedDay && (
        <VerificationDrawer
          open={!!selectedDay}
          onClose={() => setSelectedDay(null)}
          title={`Daily Activity #${selectedDay.id}`}
          subtitle={new Date(selectedDay.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          severity={selectedDay.alertCount > 3 ? "critical" : selectedDay.alertCount > 1 ? "warning" : "info"}
          children={
            <div className="space-y-4">
              <div>
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Module
                </div>
                <VerificationChip tone="purple">
                  {selectedDay.module}
                </VerificationChip>
              </div>

              <div>
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Total Events
                </div>
                <div className="text-2xl font-bold text-[#A098F8]">
                  {selectedDay.eventCount}
                </div>
              </div>

              <div>
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Unique Users
                </div>
                <div className="text-xl font-bold text-[#2BBFA0]">
                  {selectedDay.uniqueUsers} users
                </div>
              </div>

              <div>
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Alerts Triggered
                </div>
                <VerificationChip tone={selectedDay.alertCount > 3 ? "red" : "amber"}>
                  {selectedDay.alertCount} alerts
                </VerificationChip>
              </div>

              <div>
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Events per User
                </div>
                <div className="text-sm text-white/85">
                  {(selectedDay.eventCount / selectedDay.uniqueUsers).toFixed(1)} avg
                </div>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}
