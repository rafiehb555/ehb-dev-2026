"use client";

/**
 * DMO — Earnings Engine / Revenue Split Dashboard
 *   - Visualizes the EHB 40/25/20/15 revenue split model
 *   - Platform (40%), Seller (25%), Franchise (20%), Affiliate (15%)
 *   - SeverityMeter showing 4-way split
 *   - Transaction rows with split breakdown in drawer
 */

import Link from "next/link";
import { useState } from "react";
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

type RevenueStatus = "DISTRIBUTED" | "PENDING" | "HELD";

type Transaction = {
  id: string;
  transactionId: string;
  totalAmount: number;
  platformShare: number;
  sellerShare: number;
  franchiseShare: number;
  affiliateShare: number;
  status: RevenueStatus;
  createdAt: string;
};

const DEMO: Transaction[] = [
  {
    id: "T-1",
    transactionId: "TXN-001847",
    totalAmount: 15000,
    platformShare: 6000,
    sellerShare: 3750,
    franchiseShare: 3000,
    affiliateShare: 2250,
    status: "DISTRIBUTED",
    createdAt: "2026-04-11T14:32:00Z",
  },
  {
    id: "T-2",
    transactionId: "TXN-001846",
    totalAmount: 8500,
    platformShare: 3400,
    sellerShare: 2125,
    franchiseShare: 1700,
    affiliateShare: 1275,
    status: "DISTRIBUTED",
    createdAt: "2026-04-11T13:18:00Z",
  },
  {
    id: "T-3",
    transactionId: "TXN-001845",
    totalAmount: 12200,
    platformShare: 4880,
    sellerShare: 3050,
    franchiseShare: 2440,
    affiliateShare: 1830,
    status: "DISTRIBUTED",
    createdAt: "2026-04-11T12:05:00Z",
  },
  {
    id: "T-4",
    transactionId: "TXN-001844",
    totalAmount: 6800,
    platformShare: 2720,
    sellerShare: 1700,
    franchiseShare: 1360,
    affiliateShare: 1020,
    status: "PENDING",
    createdAt: "2026-04-11T11:42:00Z",
  },
  {
    id: "T-5",
    transactionId: "TXN-001843",
    totalAmount: 21500,
    platformShare: 8600,
    sellerShare: 5375,
    franchiseShare: 4300,
    affiliateShare: 3225,
    status: "DISTRIBUTED",
    createdAt: "2026-04-11T10:28:00Z",
  },
  {
    id: "T-6",
    transactionId: "TXN-001842",
    totalAmount: 9300,
    platformShare: 3720,
    sellerShare: 2325,
    franchiseShare: 1860,
    affiliateShare: 1395,
    status: "HELD",
    createdAt: "2026-04-11T09:15:00Z",
  },
  {
    id: "T-7",
    transactionId: "TXN-001841",
    totalAmount: 18700,
    platformShare: 7480,
    sellerShare: 4675,
    franchiseShare: 3740,
    affiliateShare: 2805,
    status: "DISTRIBUTED",
    createdAt: "2026-04-11T08:52:00Z",
  },
  {
    id: "T-8",
    transactionId: "TXN-001840",
    totalAmount: 11400,
    platformShare: 4560,
    sellerShare: 2850,
    franchiseShare: 2280,
    affiliateShare: 1710,
    status: "DISTRIBUTED",
    createdAt: "2026-04-11T07:33:00Z",
  },
];

const STATUS_TONE: Record<RevenueStatus, VerificationTone> = {
  DISTRIBUTED: "green",
  PENDING: "amber",
  HELD: "red",
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

function SplitBreakdown({ label, value, percentage }: { label: string; value: number; percentage: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/60">{label}</span>
        <span className="font-semibold text-white">{fmtCurrency(value)}</span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0]"
          style={{ width: `${percentage * 100}%` }}
        />
      </div>
      <div className="text-[10px] text-white/45">{(percentage * 100).toFixed(1)}%</div>
    </div>
  );
}

export default function RevenueSplitPage() {
  const [rows] = useState<Transaction[]>(DEMO);
  const [active, setActive] = useState<Transaction | null>(null);

  const stats = {
    total: rows.reduce((s, t) => s + t.totalAmount, 0),
    distributed: rows.filter((t) => t.status === "DISTRIBUTED").reduce((s, t) => s + t.totalAmount, 0),
    pending: rows.filter((t) => t.status === "PENDING").reduce((s, t) => s + t.totalAmount, 0),
    held: rows.filter((t) => t.status === "HELD").reduce((s, t) => s + t.totalAmount, 0),
  };

  const platformTotal = rows.reduce((s, t) => s + t.platformShare, 0);
  const sellerTotal = rows.reduce((s, t) => s + t.sellerShare, 0);
  const franchiseTotal = rows.reduce((s, t) => s + t.franchiseShare, 0);
  const affiliateTotal = rows.reduce((s, t) => s + t.affiliateShare, 0);

  const columns: RowColumn<Transaction>[] = [
    {
      key: "id",
      header: "Transaction",
      width: "minmax(0, 1.2fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate font-mono text-[11px] text-white">{r.transactionId}</div>
          <div className="text-[9px] text-white/50">{fmtTime(r.createdAt)}</div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Total",
      width: "minmax(0, 0.9fr)",
      align: "right",
      render: (r) => <span className="font-semibold text-white">{fmtCurrency(r.totalAmount)}</span>,
    },
    {
      key: "platformShare",
      header: "Platform (40%)",
      width: "minmax(0, 0.9fr)",
      align: "right",
      render: (r) => <span className="text-white/70">{fmtCurrency(r.platformShare)}</span>,
    },
    {
      key: "sellerShare",
      header: "Seller (25%)",
      width: "minmax(0, 0.9fr)",
      align: "right",
      render: (r) => <span className="text-white/70">{fmtCurrency(r.sellerShare)}</span>,
    },
    {
      key: "franchiseShare",
      header: "Franchise (20%)",
      width: "minmax(0, 0.9fr)",
      align: "right",
      render: (r) => <span className="text-white/70">{fmtCurrency(r.franchiseShare)}</span>,
    },
    {
      key: "affiliateShare",
      header: "Affiliate (15%)",
      width: "minmax(0, 0.9fr)",
      align: "right",
      render: (r) => <span className="text-white/70">{fmtCurrency(r.affiliateShare)}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0, 0.8fr)",
      align: "right",
      render: (r) => <VerificationChip tone={STATUS_TONE[r.status]} size="xs">{r.status}</VerificationChip>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#7B6EF6] via-[#2BBFA0] via-[#F0A030] to-transparent" />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/earnings-engine" className="text-white/40 hover:text-white/70 transition-colors">Earnings</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#7B6EF6]">Split</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">40-25-20-15 Split</h1>
            <p className="max-w-2xl text-sm text-white/65">
              EHB revenue model: Platform 40%, Seller 25%, Franchise 20%, Affiliate 15%. Track every transaction breakdown in real-time.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total Revenue" value={fmtCurrency(stats.total)} sub="all transactions" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor" /></svg>} />
        <VerificationStatCard tone="green" label="Distributed" value={fmtCurrency(stats.distributed)} sub="settled" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" /></svg>} />
        <VerificationStatCard tone="amber" label="Pending" value={fmtCurrency(stats.pending)} sub="awaiting split" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" /></svg>} />
        <VerificationStatCard tone="red" label="On Hold" value={fmtCurrency(stats.held)} sub="review needed" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Revenue Split Model" hint="Cumulative distribution across all transactions" />
        <SeverityMeter segments={[
          { label: "Platform (40%)", value: platformTotal, tone: "purple" },
          { label: "Seller (25%)", value: sellerTotal, tone: "teal" },
          { label: "Franchise (20%)", value: franchiseTotal, tone: "amber" },
          { label: "Affiliate (15%)", value: affiliateTotal, tone: "green" },
        ]} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Transaction list" title="Revenue Distribution" hint="Click row for full breakdown" right={<span className="text-[10px] text-white/45">{rows.length} transaction(s)</span>} />
        <div className="mt-4">
          <VerificationRowGrid<Transaction>
            rows={rows}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => STATUS_TONE[r.status]}
            emptyTitle="No transactions found"
            emptyHint="Revenue will appear here as transactions are processed."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `Split Breakdown · ${active.transactionId}` : "Split Breakdown"}
        subtitle={active ? `Total: ${fmtCurrency(active.totalAmount)} · ${fmtTime(active.createdAt)}` : undefined}
        severity={active?.status === "HELD" ? "warning" : active?.status === "PENDING" ? "info" : undefined}
      >
        {active && (
          <div className="space-y-6">
            <div className="space-y-3">
              <SplitBreakdown label="Platform Share" value={active.platformShare} percentage={active.platformShare / active.totalAmount} />
              <SplitBreakdown label="Seller Share" value={active.sellerShare} percentage={active.sellerShare / active.totalAmount} />
              <SplitBreakdown label="Franchise Share" value={active.franchiseShare} percentage={active.franchiseShare / active.totalAmount} />
              <SplitBreakdown label="Affiliate Share" value={active.affiliateShare} percentage={active.affiliateShare / active.totalAmount} />
            </div>

            <div className="space-y-2 rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Transaction Info</p>
              <div className="grid gap-2 text-[11px] text-white/70">
                <div className="flex items-center justify-between">
                  <span>ID:</span>
                  <span className="font-mono text-white">{active.transactionId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <VerificationChip tone={STATUS_TONE[active.status]} size="xs">{active.status}</VerificationChip>
                </div>
                <div className="flex items-center justify-between">
                  <span>Created:</span>
                  <span>{new Date(active.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </VerificationDrawer>
    </div>
  );
}
