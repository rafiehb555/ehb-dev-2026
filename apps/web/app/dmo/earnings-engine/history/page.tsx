"use client";

/**
 * DMO — Earnings Engine / History
 *   - Full audit trail of all revenue events
 *   - Filter by source (GoSellr, OLS, WMS, HPS, AGTS, JPS)
 *   - Type: SALE, SUBSCRIPTION, COMMISSION, REFUND
 *   - Drawer with event detail and fee breakdown
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
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type EarningsSource = "GOSELLR" | "OLS" | "WMS" | "HPS" | "AGTS" | "JPS";
type EventType = "SALE" | "SUBSCRIPTION" | "COMMISSION" | "REFUND";
type EventStatus = "SETTLED" | "PENDING" | "REFUNDED";

type EarningsEvent = {
  id: string;
  source: EarningsSource;
  type: EventType;
  amount: number;
  netAmount: number;
  fee: number;
  createdAt: string;
  status: EventStatus;
};

const DEMO: EarningsEvent[] = [
  { id: "EV-1240", source: "GOSELLR", type: "SALE", amount: 3500, netAmount: 3150, fee: 350, createdAt: "2026-04-11T18:15:00Z", status: "SETTLED" },
  { id: "EV-1239", source: "OLS", type: "COMMISSION", amount: 2100, netAmount: 1890, fee: 210, createdAt: "2026-04-11T17:42:00Z", status: "SETTLED" },
  { id: "EV-1238", source: "WMS", type: "SUBSCRIPTION", amount: 5000, netAmount: 4500, fee: 500, createdAt: "2026-04-11T16:28:00Z", status: "SETTLED" },
  { id: "EV-1237", source: "HPS", type: "SALE", amount: 1800, netAmount: 1620, fee: 180, createdAt: "2026-04-11T15:33:00Z", status: "SETTLED" },
  { id: "EV-1236", source: "GOSELLR", type: "SALE", amount: 4200, netAmount: 3780, fee: 420, createdAt: "2026-04-11T14:50:00Z", status: "SETTLED" },
  { id: "EV-1235", source: "JPS", type: "COMMISSION", amount: 3300, netAmount: 2970, fee: 330, createdAt: "2026-04-11T14:12:00Z", status: "SETTLED" },
  { id: "EV-1234", source: "AGTS", type: "SALE", amount: 6500, netAmount: 5850, fee: 650, createdAt: "2026-04-11T13:25:00Z", status: "PENDING" },
  { id: "EV-1233", source: "WMS", type: "REFUND", amount: -1200, netAmount: -1080, fee: 120, createdAt: "2026-04-11T12:40:00Z", status: "REFUNDED" },
  { id: "EV-1232", source: "HPS", type: "SUBSCRIPTION", amount: 2500, netAmount: 2250, fee: 250, createdAt: "2026-04-11T11:55:00Z", status: "SETTLED" },
  { id: "EV-1231", source: "GOSELLR", type: "SALE", amount: 5800, netAmount: 5220, fee: 580, createdAt: "2026-04-11T11:10:00Z", status: "SETTLED" },
];

const SOURCE_TONE: Record<EarningsSource, VerificationTone> = {
  GOSELLR: "purple",
  OLS: "cyan",
  WMS: "teal",
  HPS: "amber",
  AGTS: "green",
  JPS: "green",
};

const TYPE_TONE: Record<EventType, VerificationTone> = {
  SALE: "green",
  SUBSCRIPTION: "teal",
  COMMISSION: "purple",
  REFUND: "red",
};

const STATUS_TONE: Record<EventStatus, VerificationTone> = {
  SETTLED: "green",
  PENDING: "amber",
  REFUNDED: "red",
};

function fmtCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function EarningsHistoryPage() {
  const [rows] = useState<EarningsEvent[]>(DEMO);
  const [filter, setFilter] = useState<"ALL" | EarningsSource>("ALL");
  const [active, setActive] = useState<EarningsEvent | null>(null);

  const visible = useMemo(
    () => (filter === "ALL" ? rows : rows.filter((e) => e.source === filter)),
    [rows, filter],
  );

  const stats = useMemo(() => {
    const totalAmount = rows.reduce((s, e) => s + e.amount, 0);
    const totalNet = rows.reduce((s, e) => s + e.netAmount, 0);
    const avgTransaction = rows.length > 0 ? totalAmount / rows.length : 0;
    const sources = rows.reduce<Record<EarningsSource, number>>(
      (acc, e) => {
        acc[e.source] = (acc[e.source] ?? 0) + e.amount;
        return acc;
      },
      {} as Record<EarningsSource, number>,
    );
    const topSource = Object.entries(sources).sort((a, b) => b[1] - a[1])[0];

    return {
      totalEvents: rows.length,
      totalAmount,
      thisMonth: totalAmount,
      avgTransaction: Math.round(avgTransaction),
      topSource: topSource?.[0] ?? "N/A",
    };
  }, [rows]);

  const columns: RowColumn<EarningsEvent>[] = [
    {
      key: "id",
      header: "Event",
      width: "minmax(0, 1.2fr)",
      render: (e) => (
        <div className="min-w-0">
          <div className="truncate font-mono text-[11px] text-white">{e.id}</div>
          <div className="text-[9px] text-white/50">{fmtTime(e.createdAt)}</div>
        </div>
      ),
    },
    {
      key: "source",
      header: "Source",
      width: "minmax(0, 0.9fr)",
      render: (e) => <VerificationChip tone={SOURCE_TONE[e.source]} size="xs">{e.source}</VerificationChip>,
    },
    {
      key: "type",
      header: "Type",
      width: "minmax(0, 1fr)",
      render: (e) => <VerificationChip tone={TYPE_TONE[e.type]} size="xs">{e.type}</VerificationChip>,
    },
    {
      key: "amount",
      header: "Amount",
      width: "minmax(0, 0.9fr)",
      align: "right",
      render: (e) => (
        <div className="text-right">
          <div className="font-semibold text-white">{fmtCurrency(e.amount)}</div>
          <div className="text-[9px] text-white/50">Fee: {fmtCurrency(e.fee)}</div>
        </div>
      ),
    },
    {
      key: "netAmount",
      header: "Net",
      width: "minmax(0, 0.9fr)",
      align: "right",
      render: (e) => <span className="font-semibold text-white">{fmtCurrency(e.netAmount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0, 0.8fr)",
      align: "right",
      render: (e) => <VerificationChip tone={STATUS_TONE[e.status]} size="xs">{e.status}</VerificationChip>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F0A030]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#F0A030] via-[#38C878] via-[#7B6EF6] to-transparent" />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F0A030]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#38C878]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F0A030]/20 via-[#38C878]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/earnings-engine" className="text-white/40 hover:text-white/70 transition-colors">Earnings</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F0A030]">History</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Earnings History</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Complete audit trail of all revenue events across the EHB platform. Track every sale, subscription, commission, and refund in real-time.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total Events" value={stats.totalEvents} sub="all time" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="green" label="This Month" value={fmtCurrency(stats.thisMonth)} sub="total revenue" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor" /></svg>} />
        <VerificationStatCard tone="teal" label="Avg Transaction" value={fmtCurrency(stats.avgTransaction)} sub="per event" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor" /></svg>} />
        <VerificationStatCard tone="amber" label="Top Source" value={stats.topSource} sub="by revenue" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Revenue events" title="Complete History" hint="Filter by source and view full breakdown" right={<span className="text-[10px] text-white/45">{visible.length} event(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | EarningsSource>
            options={[
              { value: "ALL" as const, label: `All · ${rows.length}` },
              { value: "GOSELLR" as const, label: "GoSellr" },
              { value: "OLS" as const, label: "OLS" },
              { value: "WMS" as const, label: "WMS" },
              { value: "HPS" as const, label: "HPS" },
              { value: "AGTS" as const, label: "AGTS" },
              { value: "JPS" as const, label: "JPS" },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<EarningsEvent>
            rows={visible}
            columns={columns}
            onRowClick={(e) => setActive(e)}
            getRowTone={(e) => STATUS_TONE[e.status]}
            emptyTitle="No events in this source"
            emptyHint="Adjust filter to see other revenue events."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `${active.type} Event · ${active.id}` : "Event Detail"}
        subtitle={active ? `${active.source} · ${new Date(active.createdAt).toLocaleString()}` : undefined}
        severity={active?.status === "REFUNDED" ? "warning" : active?.status === "PENDING" ? "info" : undefined}
      >
        {active && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Event Overview</p>
                <div className="mt-3 grid gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Type:</span>
                    <VerificationChip tone={TYPE_TONE[active.type]}>{active.type}</VerificationChip>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Source:</span>
                    <VerificationChip tone={SOURCE_TONE[active.source]}>{active.source}</VerificationChip>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Status:</span>
                    <VerificationChip tone={STATUS_TONE[active.status]}>{active.status}</VerificationChip>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Event ID:</span>
                    <span className="font-mono text-white">{active.id}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Fee Breakdown</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Gross Amount:</span>
                    <span className="font-semibold text-white">{fmtCurrency(active.amount)}</span>
                  </div>
                  <div className="flex h-px bg-white/10" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Platform Fee ({(active.fee / active.amount * 100).toFixed(1)}%):</span>
                    <span className="text-[#F05858]">-{fmtCurrency(active.fee)}</span>
                  </div>
                  <div className="flex h-px bg-white/10" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Net Amount:</span>
                    <span className="font-bold text-[#38C878]">{fmtCurrency(active.netAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Audit Trail</p>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Created At:</span>
                    <span className="text-white">{new Date(active.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Settlement:</span>
                    <span className={`font-semibold ${active.status === "SETTLED" ? "text-[#38C878]" : "text-[#F0A030]"}`}>
                      {active.status === "SETTLED" ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Recipient:</span>
                    <span className="text-white">Auto-distributed to wallet</span>
                  </div>
                </div>
              </div>

              {active.type === "REFUND" && (
                <div className="rounded-xl border border-[#F05858]/30 bg-[#F05858]/10 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F05858]">Refund Note</p>
                  <p className="mt-2 text-sm text-white/70">Customer initiated refund request for service cancellation. Full amount reversed to payment method within 3-5 business days.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </VerificationDrawer>
    </div>
  );
}
