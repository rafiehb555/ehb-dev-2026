"use client";

/**
 * Escrow Management — DMO / Wallet Control / Escrow
 *
 * Tracks funds held in escrow for transactions. Includes:
 *   - Hero section with breadcrumb + description
 *   - 4 stat cards: Active escrows, Total held, Released today, Disputed
 *   - Filter by status (HELD|RELEASED|DISPUTED|EXPIRED)
 *   - VerificationRowGrid with 8 demo escrow rows
 *   - Detail drawer showing escrow timeline, buyer/seller info, release conditions
 *
 * Design system: dark glassmorphism, purple/teal/green/red/amber tones, EHB typography.
 * Demo data only (no API calls). Icons are inline SVG.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  type RowColumn,
} from "@/components/dmo/verification/VerificationUI";

type EscrowStatus = "HELD" | "RELEASED" | "DISPUTED" | "EXPIRED";
type EscrowReason = "PURCHASE" | "SERVICE" | "FRANCHISE_FEE" | "SUBSCRIPTION";
type CurrencyType = "USD" | "PKR" | "EHB";

type EscrowRow = {
  id: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  currency: CurrencyType;
  reason: EscrowReason;
  status: EscrowStatus;
  createdAt: string;
};

// Demo data: 8 escrow transactions
const DEMO_ESCROWS: EscrowRow[] = [
  { id: "ESC001", buyerName: "Ali Khan", sellerName: "Tech Solutions Ltd", amount: 5000, currency: "USD", reason: "PURCHASE", status: "HELD", createdAt: "2026-04-11T10:00:00Z" },
  { id: "ESC002", buyerName: "Sara Malik", sellerName: "Legal Pro Services", amount: 2500, currency: "USD", reason: "SERVICE", status: "RELEASED", createdAt: "2026-04-10T15:30:00Z" },
  { id: "ESC003", buyerName: "Ahmed Enterprises", sellerName: "Global Trade Inc", amount: 150000, currency: "PKR", reason: "FRANCHISE_FEE", status: "HELD", createdAt: "2026-04-11T09:15:00Z" },
  { id: "ESC004", buyerName: "Zainab Services", sellerName: "Education Plus", amount: 1200, currency: "EHB", reason: "SUBSCRIPTION", status: "DISPUTED", createdAt: "2026-04-08T14:00:00Z" },
  { id: "ESC005", buyerName: "Medical Hub Co", sellerName: "WMS Provider", amount: 8500, currency: "USD", reason: "SERVICE", status: "RELEASED", createdAt: "2026-04-09T11:45:00Z" },
  { id: "ESC006", buyerName: "Tech Solutions Ltd", sellerName: "Global Supplier", amount: 25000, currency: "USD", reason: "PURCHASE", status: "HELD", createdAt: "2026-04-11T13:20:00Z" },
  { id: "ESC007", buyerName: "Education Hub", sellerName: "JPS Partner", amount: 3600, currency: "EHB", reason: "SERVICE", status: "EXPIRED", createdAt: "2026-03-28T08:00:00Z" },
  { id: "ESC008", buyerName: "Fashion Brand Co", sellerName: "Logistics Pros", amount: 45000, currency: "PKR", reason: "PURCHASE", status: "HELD", createdAt: "2026-04-11T16:00:00Z" },
];

function formatCurrency(amount: number, currency: CurrencyType): string {
  if (currency === "USD") return `$${amount.toLocaleString()}`;
  if (currency === "PKR") return `₨${amount.toLocaleString()}`;
  return `${amount.toLocaleString()} EHB`;
}

function statusTone(status: EscrowStatus): "teal" | "red" | "amber" | "green" {
  if (status === "HELD") return "amber";
  if (status === "RELEASED") return "teal";
  if (status === "DISPUTED") return "red";
  return "green";
}

function reasonLabel(reason: EscrowReason): string {
  const labels: Record<EscrowReason, string> = {
    PURCHASE: "Purchase",
    SERVICE: "Service",
    FRANCHISE_FEE: "Franchise Fee",
    SUBSCRIPTION: "Subscription",
  };
  return labels[reason];
}

function fmt(dateStr: string): string {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function daysAgo(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff}d ago`;
}

export default function WalletEscrowPage() {
  const [escrows] = useState<EscrowRow[]>(DEMO_ESCROWS);
  const [filterStatus, setFilterStatus] = useState<EscrowStatus | "ALL">("ALL");
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowRow | null>(null);

  const filteredEscrows = useMemo(
    () => escrows.filter((e) => filterStatus === "ALL" || e.status === filterStatus),
    [escrows, filterStatus]
  );

  const stats = useMemo(() => {
    const activeEscrows = escrows.filter((e) => e.status === "HELD").length;
    const totalHeld = escrows.filter((e) => e.status === "HELD").reduce((sum, e) => sum + e.amount, 0);
    const releasedToday = escrows.filter((e) => {
      if (e.status !== "RELEASED") return false;
      const createdDate = new Date(e.createdAt);
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return createdDate > dayAgo;
    }).length;
    const disputed = escrows.filter((e) => e.status === "DISPUTED").length;
    return { activeEscrows, totalHeld, releasedToday, disputed };
  }, [escrows]);

  const columns: RowColumn<EscrowRow>[] = [
    {
      key: "buyerSeller",
      header: "Buyer → Seller",
      width: "minmax(200px, 2.5fr)",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{row.buyerName}</span>
            <span className="text-white/40">→</span>
            <span className="font-semibold text-white">{row.sellerName}</span>
          </div>
          <span className="text-[10px] text-white/45">{reasonLabel(row.reason)}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      width: "minmax(130px, 1.5fr)",
      align: "right",
      render: (row) => (
        <div className="text-right">
          <div className="font-semibold text-white">{formatCurrency(row.amount, row.currency)}</div>
          <div className="text-[10px] text-white/45">{row.currency}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(110px, 1fr)",
      render: (row) => <VerificationChip tone={statusTone(row.status)}>{row.status}</VerificationChip>,
    },
    {
      key: "age",
      header: "Age",
      width: "minmax(100px, 1fr)",
      render: (row) => <span className="text-white/70">{daysAgo(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#2BBFA0]/22 via-cyan-500/12 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-gradient-to-br from-[#F0A030]/18 via-amber-500/10 to-transparent blur-3xl" />
        <div className="relative space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2BBFA0]">
            DMO · Wallet Control
          </p>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Escrow Management
          </h1>
          <p className="max-w-xl text-sm text-white/65">
            Monitor all funds held in escrow across purchase, service, franchise, and subscription transactions.
            Track disputes, release conditions, and payment timelines.
          </p>
        </div>
      </section>

      {/* Stats grid: Active escrows, Total held, Released today, Disputed */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="amber"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M3 9h18M9 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Active Escrows"
          value={stats.activeEscrows}
          sub="Awaiting release"
        />
        <VerificationStatCard
          tone="teal"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16z" stroke="currentColor" strokeWidth="1.5" /><path d="M12 7v5l3 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Total Held"
          value={`$${(stats.totalHeld / 1000).toFixed(1)}K`}
          sub="USD equivalent"
        />
        <VerificationStatCard
          tone="green"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Released Today"
          value={stats.releasedToday}
          sub="Completed transactions"
        />
        <VerificationStatCard
          tone="red"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 9v2m0 4v2m0-10a9 9 0 00-9 9 9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9z" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>}
          label="Disputed"
          value={stats.disputed}
          sub="Needs resolution"
        />
      </section>

      {/* Filter buttons */}
      <section className="flex flex-wrap gap-2">
        {(["ALL", "HELD", "RELEASED", "DISPUTED", "EXPIRED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className="rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors"
            style={{
              borderColor:
                filterStatus === status
                  ? status === "ALL"
                    ? "#7B6EF6"
                    : status === "HELD"
                    ? "#F0A030"
                    : status === "RELEASED"
                    ? "#2BBFA0"
                    : status === "DISPUTED"
                    ? "#F05858"
                    : "#38C878"
                  : "rgba(255,255,255,0.1)",
              color:
                filterStatus === status
                  ? status === "ALL"
                    ? "#A098F8"
                    : status === "HELD"
                    ? "#F0A030"
                    : status === "RELEASED"
                    ? "#2BBFA0"
                    : status === "DISPUTED"
                    ? "#F05858"
                    : "#38C878"
                  : "rgba(255,255,255,0.5)",
              backgroundColor:
                filterStatus === status
                  ? status === "ALL"
                    ? "rgba(123,110,246,0.15)"
                    : status === "HELD"
                    ? "rgba(240,160,48,0.15)"
                    : status === "RELEASED"
                    ? "rgba(43,191,160,0.15)"
                    : status === "DISPUTED"
                    ? "rgba(240,88,88,0.15)"
                    : "rgba(56,200,120,0.15)"
                  : "transparent",
            }}
          >
            {status}
          </button>
        ))}
      </section>

      {/* Data grid */}
      <VerificationRowGrid<EscrowRow>
        columns={columns}
        rows={filteredEscrows}
        emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-8 w-8"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M3 9h18M9 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
        emptyTitle="No escrows found"
        emptyHint="Adjust your filter or check back later."
        onRowClick={(row) => setSelectedEscrow(row)}
      />

      {/* Detail drawer */}
      <VerificationDrawer
        open={!!selectedEscrow}
        onClose={() => setSelectedEscrow(null)}
        title={`Escrow #${selectedEscrow?.id ?? ""}`}
        subtitle={`${selectedEscrow?.buyerName ?? ""} → ${selectedEscrow?.sellerName ?? ""}`}
        severity={selectedEscrow?.status === "DISPUTED" ? "high" : selectedEscrow?.status === "EXPIRED" ? "warning" : "info"}
      >
        {selectedEscrow && (
          <div className="space-y-6">
            {/* Transaction summary */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Transaction</h3>
              <div className="grid gap-4 rounded-lg bg-white/[0.04] p-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Type</div>
                  <div className="text-sm text-white">{reasonLabel(selectedEscrow.reason)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Amount</div>
                  <div className="text-lg font-bold text-white">{formatCurrency(selectedEscrow.amount, selectedEscrow.currency)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Status</div>
                  <VerificationChip tone={statusTone(selectedEscrow.status)}>{selectedEscrow.status}</VerificationChip>
                </div>
              </div>
            </div>

            {/* Buyer & Seller info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Parties</h3>
              <div className="grid gap-3">
                <div className="rounded-lg bg-white/[0.04] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-2">Buyer</div>
                  <div className="text-sm font-semibold text-white">{selectedEscrow.buyerName}</div>
                  <div className="text-[10px] text-white/45 mt-1">Funds receiver upon release</div>
                </div>
                <div className="rounded-lg bg-white/[0.04] p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-2">Seller</div>
                  <div className="text-sm font-semibold text-white">{selectedEscrow.sellerName}</div>
                  <div className="text-[10px] text-white/45 mt-1">Funds provider (held pending)</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Timeline</h3>
              <div className="space-y-2 rounded-lg bg-white/[0.04] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Created</span>
                  <span className="text-white">{fmt(selectedEscrow.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2 mt-2">
                  <span className="text-white/70">Hold Duration</span>
                  <span className="text-white font-semibold">{daysAgo(selectedEscrow.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Release Conditions</span>
                  <span className="text-white/80">Pending verification</span>
                </div>
              </div>
            </div>

            {/* Action footer */}
            {selectedEscrow.status === "HELD" && (
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#2BBFA0]/20 border border-[#2BBFA0]/50 px-3 py-2 text-xs font-semibold text-[#2BBFA0] transition-colors hover:bg-[#2BBFA0]/30 hover:border-[#2BBFA0]/70"
                >
                  Release Escrow
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#F05858]/20 border border-[#F05858]/50 px-3 py-2 text-xs font-semibold text-[#F05858] transition-colors hover:bg-[#F05858]/30 hover:border-[#F05858]/70"
                >
                  Dispute
                </button>
              </div>
            )}
            {selectedEscrow.status === "DISPUTED" && (
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#7B6EF6]/20 border border-[#7B6EF6]/50 px-3 py-2 text-xs font-semibold text-[#A098F8] transition-colors hover:bg-[#7B6EF6]/30 hover:border-[#7B6EF6]/70"
                >
                  View Dispute Details
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#F0A030]/20 border border-[#F0A030]/50 px-3 py-2 text-xs font-semibold text-[#F0A030] transition-colors hover:bg-[#F0A030]/30 hover:border-[#F0A030]/70"
                >
                  Escalate to Arbitration
                </button>
              </div>
            )}
          </div>
        )}
      </VerificationDrawer>
    </div>
  );
}
