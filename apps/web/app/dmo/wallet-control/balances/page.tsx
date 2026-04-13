"use client";

/**
 * Wallet Balances — DMO / Wallet Control / Balances
 *
 * Shows all entity wallet balances across the platform. Includes:
 *   - Hero section with breadcrumb + description
 *   - 4 stat cards: Total wallets, Total balance, Active today, Frozen
 *   - Filter by status (ACTIVE|FROZEN|RESTRICTED)
 *   - VerificationRowGrid with 8 demo wallet rows
 *   - Detail drawer showing wallet info, recent transactions, freeze/unfreeze actions
 *
 * Design system: dark glassmorphism, purple/teal/amber/red tones, EHB typography.
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

type WalletStatus = "ACTIVE" | "FROZEN" | "RESTRICTED";
type CurrencyType = "USD" | "PKR" | "EHB";

type WalletRow = {
  id: string;
  entityName: string;
  walletId: string;
  balance: number;
  currency: CurrencyType;
  status: WalletStatus;
  lastTransaction: string;
  region: string;
};

// Demo data: 8 wallets
const DEMO_WALLETS: WalletRow[] = [
  { id: "W001", entityName: "Ali Khan", walletId: "wallet_ali_001", balance: 1250, currency: "USD", status: "ACTIVE", lastTransaction: "2026-04-11T14:30:00Z", region: "PK" },
  { id: "W002", entityName: "Sara Malik", walletId: "wallet_sara_002", balance: 3400, currency: "PKR", status: "ACTIVE", lastTransaction: "2026-04-11T10:15:00Z", region: "PK" },
  { id: "W003", entityName: "Tech Solutions Ltd", walletId: "wallet_tech_001", balance: 45680, currency: "USD", status: "ACTIVE", lastTransaction: "2026-04-10T16:45:00Z", region: "US" },
  { id: "W004", entityName: "Global Trade Inc", walletId: "wallet_gtrade_001", balance: 0, currency: "EHB", status: "FROZEN", lastTransaction: "2026-04-08T09:00:00Z", region: "SG" },
  { id: "W005", entityName: "Zainab Services", walletId: "wallet_zain_001", balance: 2100, currency: "PKR", status: "ACTIVE", lastTransaction: "2026-04-11T13:20:00Z", region: "PK" },
  { id: "W006", entityName: "Ahmed Enterprises", walletId: "wallet_ahmed_001", balance: 8900, currency: "USD", status: "RESTRICTED", lastTransaction: "2026-04-09T11:30:00Z", region: "AE" },
  { id: "W007", entityName: "Education Plus", walletId: "wallet_edu_001", balance: 12450, currency: "EHB", status: "ACTIVE", lastTransaction: "2026-04-11T15:00:00Z", region: "PK" },
  { id: "W008", entityName: "Medical Hub Co", walletId: "wallet_med_001", balance: 0, currency: "USD", status: "FROZEN", lastTransaction: "2026-04-07T08:00:00Z", region: "US" },
];

function formatCurrency(amount: number, currency: CurrencyType): string {
  if (currency === "USD") return `$${amount.toLocaleString()}`;
  if (currency === "PKR") return `₨${amount.toLocaleString()}`;
  return `${amount.toLocaleString()} EHB`;
}

function statusTone(status: WalletStatus): "green" | "red" | "amber" {
  if (status === "ACTIVE") return "green";
  if (status === "FROZEN") return "red";
  return "amber";
}

function fmt(dateStr: string): string {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function WalletBalancesPage() {
  const [wallets] = useState<WalletRow[]>(DEMO_WALLETS);
  const [filterStatus, setFilterStatus] = useState<WalletStatus | "ALL">("ALL");
  const [selectedWallet, setSelectedWallet] = useState<WalletRow | null>(null);

  const filteredWallets = useMemo(
    () => wallets.filter((w) => filterStatus === "ALL" || w.status === filterStatus),
    [wallets, filterStatus]
  );

  const stats = useMemo(() => {
    const totalWallets = wallets.length;
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
    const activeToday = wallets.filter((w) => {
      const lastTx = new Date(w.lastTransaction);
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return lastTx > dayAgo;
    }).length;
    const frozen = wallets.filter((w) => w.status === "FROZEN").length;
    return { totalWallets, totalBalance, activeToday, frozen };
  }, [wallets]);

  const columns: RowColumn<WalletRow>[] = [
    {
      key: "entityName",
      header: "Entity",
      width: "minmax(140px, 2fr)",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-white">{row.entityName}</span>
          <span className="text-[10px] text-white/45">{row.walletId}</span>
        </div>
      ),
    },
    {
      key: "balance",
      header: "Balance",
      width: "minmax(120px, 1.5fr)",
      align: "right",
      render: (row) => (
        <div className="text-right">
          <div className="font-semibold text-white">{formatCurrency(row.balance, row.currency)}</div>
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
      key: "lastTransaction",
      header: "Last Tx",
      width: "minmax(150px, 1.5fr)",
      render: (row) => <span className="text-white/70">{fmt(row.lastTransaction)}</span>,
    },
    {
      key: "region",
      header: "Region",
      width: "minmax(80px, 1fr)",
      align: "center",
      render: (row) => <span className="text-white/70 font-semibold">{row.region}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#7B6EF6]/22 via-[#A098F8]/12 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-gradient-to-br from-[#2BBFA0]/18 via-cyan-500/10 to-transparent blur-3xl" />
        <div className="relative space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A098F8]">
            DMO · Wallet Control
          </p>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Wallet Balances
          </h1>
          <p className="max-w-xl text-sm text-white/65">
            Real-time balance visibility across all platform entities. Monitor account health, frozen status,
            and transaction activity by region and currency.
          </p>
        </div>
      </section>

      {/* Stats grid: Total wallets, Total balance, Active today, Frozen */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><path d="M12 8v4h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Total Wallets"
          value={stats.totalWallets}
          sub="All entities"
        />
        <VerificationStatCard
          tone="teal"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="2" y="7" width="20" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" /><path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" /></svg>}
          label="Total Balance"
          value={`$${(stats.totalBalance / 1000).toFixed(1)}K`}
          sub="USD equivalent"
        />
        <VerificationStatCard
          tone="green"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Active Today"
          value={stats.activeToday}
          sub="Recent transactions"
        />
        <VerificationStatCard
          tone="red"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M9 9h6M9 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Frozen"
          value={stats.frozen}
          sub="Requires review"
        />
      </section>

      {/* Filter buttons */}
      <section className="flex flex-wrap gap-2">
        {(["ALL", "ACTIVE", "FROZEN", "RESTRICTED"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className="rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors"
            style={{
              borderColor:
                filterStatus === status
                  ? status === "ALL"
                    ? "#7B6EF6"
                    : status === "ACTIVE"
                    ? "#38C878"
                    : status === "FROZEN"
                    ? "#F05858"
                    : "#F0A030"
                  : "rgba(255,255,255,0.1)",
              color:
                filterStatus === status
                  ? status === "ALL"
                    ? "#A098F8"
                    : status === "ACTIVE"
                    ? "#38C878"
                    : status === "FROZEN"
                    ? "#F05858"
                    : "#F0A030"
                  : "rgba(255,255,255,0.5)",
              backgroundColor:
                filterStatus === status
                  ? status === "ALL"
                    ? "rgba(123,110,246,0.15)"
                    : status === "ACTIVE"
                    ? "rgba(56,200,120,0.15)"
                    : status === "FROZEN"
                    ? "rgba(240,88,88,0.15)"
                    : "rgba(240,160,48,0.15)"
                  : "transparent",
            }}
          >
            {status}
          </button>
        ))}
      </section>

      {/* Data grid */}
      <VerificationRowGrid<WalletRow>
        columns={columns}
        rows={filteredWallets}
        emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-8 w-8"><rect x="2" y="7" width="20" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" /><path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" /></svg>}
        emptyTitle="No wallets found"
        emptyHint="Adjust your filter or check back later."
        onRowClick={(row) => setSelectedWallet(row)}
      />

      {/* Detail drawer */}
      <VerificationDrawer
        open={!!selectedWallet}
        onClose={() => setSelectedWallet(null)}
        title={selectedWallet?.entityName ?? "Wallet Details"}
        subtitle={selectedWallet?.walletId}
        severity={selectedWallet?.status === "FROZEN" ? "critical" : selectedWallet?.status === "RESTRICTED" ? "warning" : "info"}
      >
        {selectedWallet && (
          <div className="space-y-6">
            {/* Basic info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Wallet Details</h3>
              <div className="grid gap-4 rounded-lg bg-white/[0.04] p-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Entity</div>
                  <div className="text-sm text-white">{selectedWallet.entityName}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Wallet ID</div>
                  <div className="text-xs font-mono text-white/80">{selectedWallet.walletId}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Region</div>
                  <div className="text-sm text-white">{selectedWallet.region}</div>
                </div>
              </div>
            </div>

            {/* Balance info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Balance</h3>
              <div className="grid gap-4 rounded-lg bg-white/[0.04] p-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Amount</div>
                  <div className="text-lg font-bold text-white">{formatCurrency(selectedWallet.balance, selectedWallet.currency)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Status</div>
                  <VerificationChip tone={statusTone(selectedWallet.status)}>{selectedWallet.status}</VerificationChip>
                </div>
              </div>
            </div>

            {/* Recent transactions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Recent Activity</h3>
              <div className="space-y-2 rounded-lg bg-white/[0.04] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Last Transaction</span>
                  <span className="text-white">{fmt(selectedWallet.lastTransaction)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Status Age</span>
                  <span className="text-white/80">—</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2 mt-2">
                  <span className="text-white/70">Transaction Count (30d)</span>
                  <span className="text-white font-semibold">—</span>
                </div>
              </div>
            </div>

            {/* Action footer */}
            {selectedWallet.status === "FROZEN" && (
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#38C878]/20 border border-[#38C878]/50 px-3 py-2 text-xs font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/30 hover:border-[#38C878]/70"
                >
                  Unfreeze Wallet
                </button>
              </div>
            )}
            {selectedWallet.status === "RESTRICTED" && (
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#F0A030]/20 border border-[#F0A030]/50 px-3 py-2 text-xs font-semibold text-[#F0A030] transition-colors hover:bg-[#F0A030]/30 hover:border-[#F0A030]/70"
                >
                  Review Restrictions
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#38C878]/20 border border-[#38C878]/50 px-3 py-2 text-xs font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/30 hover:border-[#38C878]/70"
                >
                  Clear Restriction
                </button>
              </div>
            )}
          </div>
        )}
      </VerificationDrawer>
    </div>
  );
}
