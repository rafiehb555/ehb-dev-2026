"use client";

/**
 * DMO — Earnings Engine / Payouts
 *   - Tracks scheduled and completed payouts to sellers/franchises/affiliates
 *   - Stats: Pending, Processing, Completed, Failed
 *   - Filter by status + RowGrid + Drawer with recipient details
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

type PayoutMethod = "BANK_TRANSFER" | "EHB_WALLET" | "MOBILE_MONEY";
type PayoutStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
type RecipientType = "SELLER" | "FRANCHISE" | "AFFILIATE" | "PLATFORM";

type Payout = {
  id: string;
  recipientName: string;
  recipientType: RecipientType;
  amount: number;
  method: PayoutMethod;
  status: PayoutStatus;
  scheduledAt: string;
};

const DEMO: Payout[] = [
  {
    id: "P-1",
    recipientName: "GoSellr Pakistan Ltd",
    recipientType: "SELLER",
    amount: 45000,
    method: "BANK_TRANSFER",
    status: "COMPLETED",
    scheduledAt: "2026-04-11T14:00:00Z",
  },
  {
    id: "P-2",
    recipientName: "OLS Legal Partners",
    recipientType: "FRANCHISE",
    amount: 28500,
    method: "EHB_WALLET",
    status: "PENDING",
    scheduledAt: "2026-04-12T09:00:00Z",
  },
  {
    id: "P-3",
    recipientName: "WMS Healthcare Hub",
    recipientType: "SELLER",
    amount: 12300,
    method: "BANK_TRANSFER",
    status: "FAILED",
    scheduledAt: "2026-04-11T16:30:00Z",
  },
  {
    id: "P-4",
    recipientName: "HPS Education Karachi",
    recipientType: "FRANCHISE",
    amount: 34200,
    method: "EHB_WALLET",
    status: "PROCESSING",
    scheduledAt: "2026-04-11T11:00:00Z",
  },
  {
    id: "P-5",
    recipientName: "Affiliate Network Tier 1",
    recipientType: "AFFILIATE",
    amount: 8900,
    method: "MOBILE_MONEY",
    status: "PENDING",
    scheduledAt: "2026-04-12T10:30:00Z",
  },
  {
    id: "P-6",
    recipientName: "JPS Job Matching Service",
    recipientType: "SELLER",
    amount: 67500,
    method: "BANK_TRANSFER",
    status: "COMPLETED",
    scheduledAt: "2026-04-11T15:15:00Z",
  },
  {
    id: "P-7",
    recipientName: "AGTS Travel Hub",
    recipientType: "SELLER",
    amount: 19800,
    method: "EHB_WALLET",
    status: "PROCESSING",
    scheduledAt: "2026-04-11T13:45:00Z",
  },
  {
    id: "P-8",
    recipientName: "Platform Reserve Account",
    recipientType: "PLATFORM",
    amount: 156000,
    method: "BANK_TRANSFER",
    status: "COMPLETED",
    scheduledAt: "2026-04-11T12:00:00Z",
  },
];

const STATUS_TONE: Record<PayoutStatus, VerificationTone> = {
  PENDING: "amber",
  PROCESSING: "cyan",
  COMPLETED: "green",
  FAILED: "red",
};

const METHOD_TONE: Record<PayoutMethod, VerificationTone> = {
  BANK_TRANSFER: "purple",
  EHB_WALLET: "teal",
  MOBILE_MONEY: "green",
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

function maskBankAccount(account: string) {
  if (account.length <= 4) return account;
  return "*".repeat(account.length - 4) + account.slice(-4);
}

export default function PayoutsPage() {
  const [rows] = useState<Payout[]>(DEMO);
  const [filter, setFilter] = useState<"ALL" | PayoutStatus>("ALL");
  const [active, setActive] = useState<Payout | null>(null);

  const visible = useMemo(
    () => (filter === "ALL" ? rows : rows.filter((p) => p.status === filter)),
    [rows, filter],
  );

  const stats = useMemo(
    () => ({
      pending: rows.filter((p) => p.status === "PENDING").length,
      processing: rows.filter((p) => p.status === "PROCESSING").length,
      completed: rows.filter((p) => p.status === "COMPLETED").length,
      failed: rows.filter((p) => p.status === "FAILED").length,
    }),
    [rows],
  );

  const columns: RowColumn<Payout>[] = [
    {
      key: "recipient",
      header: "Recipient",
      width: "minmax(0, 1.8fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate font-semibold text-white">{r.recipientName}</div>
          <div className="text-[9px] text-white/50">{r.recipientType}</div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      width: "minmax(0, 1fr)",
      align: "right",
      render: (r) => <span className="font-semibold text-white">{fmtCurrency(r.amount)}</span>,
    },
    {
      key: "method",
      header: "Method",
      width: "minmax(0, 1fr)",
      align: "center",
      render: (r) => <VerificationChip tone={METHOD_TONE[r.method]} size="xs">{r.method.replace(/_/g, " ")}</VerificationChip>,
    },
    {
      key: "scheduled",
      header: "Scheduled",
      width: "minmax(0, 0.8fr)",
      align: "center",
      render: (r) => <span className="text-[10px] text-white/60">{fmtTime(r.scheduledAt)}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0, 0.9fr)",
      align: "right",
      render: (r) => <VerificationChip tone={STATUS_TONE[r.status]} size="xs">{r.status}</VerificationChip>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#2BBFA0] via-[#38C878] via-[#F0A030] to-transparent" />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#2BBFA0]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#38C878]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#2BBFA0]/20 via-[#38C878]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/earnings-engine" className="text-white/40 hover:text-white/70 transition-colors">Earnings</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">Payouts</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Payouts</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Track scheduled and completed payouts to sellers, franchises, and affiliates. Monitor processing status and retry failed transfers.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="amber" label="Pending Payouts" value={stats.pending} sub="awaiting processing" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor" /></svg>} />
        <VerificationStatCard tone="cyan" label="Processing" value={stats.processing} sub="in flight" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor" /></svg>} />
        <VerificationStatCard tone="green" label="Completed Today" value={stats.completed} sub="settled" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" /></svg>} />
        <VerificationStatCard tone="red" label="Failed" value={stats.failed} sub="needs retry" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Payout distribution" title="Status Breakdown" hint="Filter by status and view details" right={<span className="text-[10px] text-white/45">{visible.length} payout(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<"ALL" | PayoutStatus>
            options={[
              { value: "ALL" as const, label: `All · ${rows.length}` },
              { value: "PENDING" as const, label: "Pending" },
              { value: "PROCESSING" as const, label: "Processing" },
              { value: "COMPLETED" as const, label: "Completed" },
              { value: "FAILED" as const, label: "Failed" },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<Payout>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => STATUS_TONE[r.status]}
            emptyTitle="No payouts in this status"
            emptyHint="Adjust filter to see other payouts."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? active.recipientName : "Payout Details"}
        subtitle={active ? `${active.id} · ${fmtCurrency(active.amount)}` : undefined}
        severity={active?.status === "FAILED" ? "critical" : active?.status === "PROCESSING" ? "info" : undefined}
      >
        {active && (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Payout Info</p>
                <div className="mt-3 grid gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Type:</span>
                    <span className="font-semibold text-white">{active.recipientType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Amount:</span>
                    <span className="font-semibold text-white">{fmtCurrency(active.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Status:</span>
                    <VerificationChip tone={STATUS_TONE[active.status]}>{active.status}</VerificationChip>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Method:</span>
                    <VerificationChip tone={METHOD_TONE[active.method]} size="xs">{active.method.replace(/_/g, " ")}</VerificationChip>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Recipient Bank Account (Masked)</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div>
                    <p className="text-[10px] text-white/50">Account Number</p>
                    <p className="mt-1 font-mono text-white">{maskBankAccount("1234567890123456")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50">Bank Name</p>
                    <p className="mt-1 text-white">National Bank of Pakistan</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50">IBAN</p>
                    <p className="mt-1 font-mono text-white">{maskBankAccount("PK36SCBLPKK100900001234567")}</p>
                  </div>
                </div>
              </div>

              {active.status === "FAILED" && (
                <div className="rounded-xl border border-red/30 bg-red/10 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F05858]">Failure Details</p>
                  <p className="mt-2 text-sm text-white/70">Bank rejected transfer: Invalid account details provided by recipient. Please contact recipient to verify account information.</p>
                  <button className="mt-3 rounded-lg border border-[#F05858]/50 bg-[#F05858]/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#F05858] transition-colors hover:bg-[#F05858]/25">
                    Retry Payout
                  </button>
                </div>
              )}

              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Timeline</p>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Scheduled:</span>
                    <span className="text-white">{new Date(active.scheduledAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Created:</span>
                    <span className="text-white">{new Date(Date.now() - 86400000).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </VerificationDrawer>
    </div>
  );
}
