"use client";

/**
 * Coin Lock — DMO / Wallet Control / Coin Lock
 *
 * Manages locked/staked EHB coins with lock periods. Includes:
 *   - Hero section with breadcrumb + description
 *   - 4 stat cards: Total locked, Active locks, Unlocking soon, Matured
 *   - Filter by status (LOCKED|UNLOCKING|MATURED|WITHDRAWN)
 *   - VerificationRowGrid with 8 demo coin lock rows
 *   - Detail drawer showing lock terms, APY details, early withdrawal penalty info
 *
 * Design system: dark glassmorphism, purple/teal/green/cyan tones, EHB typography.
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

type LockStatus = "LOCKED" | "UNLOCKING" | "MATURED" | "WITHDRAWN";
type LockPeriod = "30D" | "90D" | "180D" | "365D";

type CoinLockRow = {
  id: string;
  entityName: string;
  lockedAmount: number;
  lockPeriod: LockPeriod;
  startDate: string;
  unlockDate: string;
  status: LockStatus;
  apy: number;
};

// Demo data: 8 coin locks
const DEMO_LOCKS: CoinLockRow[] = [
  { id: "LOCK001", entityName: "Ali Khan", lockedAmount: 5000, lockPeriod: "90D", startDate: "2026-02-11T00:00:00Z", unlockDate: "2026-05-11T00:00:00Z", status: "LOCKED", apy: 12 },
  { id: "LOCK002", entityName: "Sara Malik", lockedAmount: 12000, lockPeriod: "365D", startDate: "2025-04-12T00:00:00Z", unlockDate: "2026-04-12T00:00:00Z", status: "UNLOCKING", apy: 18 },
  { id: "LOCK003", entityName: "Ahmed Enterprises", lockedAmount: 45000, lockPeriod: "180D", startDate: "2025-10-12T00:00:00Z", unlockDate: "2026-04-11T00:00:00Z", status: "MATURED", apy: 15 },
  { id: "LOCK004", entityName: "Zainab Services", lockedAmount: 8500, lockPeriod: "30D", startDate: "2026-03-12T00:00:00Z", unlockDate: "2026-04-11T00:00:00Z", status: "MATURED", apy: 8 },
  { id: "LOCK005", entityName: "Education Plus", lockedAmount: 75000, lockPeriod: "365D", startDate: "2025-01-15T00:00:00Z", unlockDate: "2026-01-15T00:00:00Z", status: "WITHDRAWN", apy: 18 },
  { id: "LOCK006", entityName: "Tech Solutions Ltd", lockedAmount: 32000, lockPeriod: "180D", startDate: "2026-01-12T00:00:00Z", unlockDate: "2026-07-10T00:00:00Z", status: "LOCKED", apy: 15 },
  { id: "LOCK007", entityName: "Global Trade Inc", lockedAmount: 18500, lockPeriod: "90D", startDate: "2026-03-15T00:00:00Z", unlockDate: "2026-06-13T00:00:00Z", status: "LOCKED", apy: 12 },
  { id: "LOCK008", entityName: "Medical Hub Co", lockedAmount: 6200, lockPeriod: "30D", startDate: "2026-03-20T00:00:00Z", unlockDate: "2026-04-19T00:00:00Z", status: "UNLOCKING", apy: 8 },
];

function lockPeriodDays(period: LockPeriod): number {
  const map: Record<LockPeriod, number> = { "30D": 30, "90D": 90, "180D": 180, "365D": 365 };
  return map[period];
}

function statusTone(status: LockStatus): "purple" | "cyan" | "teal" | "green" {
  if (status === "LOCKED") return "purple";
  if (status === "UNLOCKING") return "cyan";
  if (status === "MATURED") return "teal";
  return "green";
}

function fmt(dateStr: string): string {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

function daysRemaining(unlockDate: string): string {
  const unlock = new Date(unlockDate);
  if (Number.isNaN(unlock.getTime())) return "—";
  const now = new Date();
  const diff = Math.ceil((unlock.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Matured";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${diff}d`;
}

function calculateRewards(amount: number, apy: number, periodDays: number): number {
  return Math.round((amount * apy * periodDays) / (365 * 100));
}

export default function WalletCoinLockPage() {
  const [locks] = useState<CoinLockRow[]>(DEMO_LOCKS);
  const [filterStatus, setFilterStatus] = useState<LockStatus | "ALL">("ALL");
  const [selectedLock, setSelectedLock] = useState<CoinLockRow | null>(null);

  const filteredLocks = useMemo(
    () => locks.filter((l) => filterStatus === "ALL" || l.status === filterStatus),
    [locks, filterStatus]
  );

  const stats = useMemo(() => {
    const totalLocked = locks.reduce((sum, l) => sum + l.lockedAmount, 0);
    const activeLocks = locks.filter((l) => l.status === "LOCKED").length;
    const unlockingSoon = locks.filter((l) => {
      const days = daysRemaining(l.unlockDate);
      const parsed = parseInt(days);
      return !isNaN(parsed) && parsed <= 7 && parsed > 0;
    }).length;
    const matured = locks.filter((l) => l.status === "MATURED" || l.status === "WITHDRAWN").length;
    return { totalLocked, activeLocks, unlockingSoon, matured };
  }, [locks]);

  const columns: RowColumn<CoinLockRow>[] = [
    {
      key: "entityName",
      header: "Entity",
      width: "minmax(140px, 2fr)",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-white">{row.entityName}</span>
          <span className="text-[10px] text-white/45">#{row.id}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Locked Amount",
      width: "minmax(120px, 1.5fr)",
      align: "right",
      render: (row) => (
        <div className="text-right">
          <div className="font-semibold text-white">{row.lockedAmount.toLocaleString()} EHB</div>
          <div className="text-[10px] text-white/45">{row.lockPeriod} period</div>
        </div>
      ),
    },
    {
      key: "apy",
      header: "APY",
      width: "minmax(80px, 1fr)",
      align: "center",
      render: (row) => (
        <div className="text-center">
          <span className="font-bold text-[#38C878]">{row.apy}%</span>
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
      key: "unlock",
      header: "Unlock",
      width: "minmax(100px, 1fr)",
      render: (row) => <span className="text-white/70">{daysRemaining(row.unlockDate)}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-[#38C878]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#38C878]/22 via-[#2BBFA0]/12 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-500/18 via-cyan-400/10 to-transparent blur-3xl" />
        <div className="relative space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#38C878]">
            DMO · Wallet Control
          </p>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Coin Lock
          </h1>
          <p className="max-w-xl text-sm text-white/65">
            Manage staked EHB coins with fixed lock periods and variable APY returns. Monitor maturation,
            withdrawal penalties, and reward accrual across all active locks.
          </p>
        </div>
      </section>

      {/* Stats grid: Total locked, Active locks, Unlocking soon, Matured */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="cyan"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></svg>}
          label="Total Locked"
          value={`${(stats.totalLocked / 1000).toFixed(1)}K`}
          sub="EHB coins staked"
        />
        <VerificationStatCard
          tone="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" /><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Active Locks"
          value={stats.activeLocks}
          sub="Currently locked"
        />
        <VerificationStatCard
          tone="teal"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" stroke="currentColor" strokeWidth="1.5" /></svg>}
          label="Unlocking Soon"
          value={stats.unlockingSoon}
          sub="Next 7 days"
        />
        <VerificationStatCard
          tone="green"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Matured"
          value={stats.matured}
          sub="Ready for withdrawal"
        />
      </section>

      {/* Filter buttons */}
      <section className="flex flex-wrap gap-2">
        {(["ALL", "LOCKED", "UNLOCKING", "MATURED", "WITHDRAWN"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className="rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors"
            style={{
              borderColor:
                filterStatus === status
                  ? status === "ALL"
                    ? "#7B6EF6"
                    : status === "LOCKED"
                    ? "#7B6EF6"
                    : status === "UNLOCKING"
                    ? "#67E8F9"
                    : status === "MATURED"
                    ? "#2BBFA0"
                    : "#38C878"
                  : "rgba(255,255,255,0.1)",
              color:
                filterStatus === status
                  ? status === "ALL"
                    ? "#A098F8"
                    : status === "LOCKED"
                    ? "#A098F8"
                    : status === "UNLOCKING"
                    ? "#67E8F9"
                    : status === "MATURED"
                    ? "#2BBFA0"
                    : "#38C878"
                  : "rgba(255,255,255,0.5)",
              backgroundColor:
                filterStatus === status
                  ? status === "ALL"
                    ? "rgba(123,110,246,0.15)"
                    : status === "LOCKED"
                    ? "rgba(123,110,246,0.15)"
                    : status === "UNLOCKING"
                    ? "rgba(103,232,249,0.15)"
                    : status === "MATURED"
                    ? "rgba(43,191,160,0.15)"
                    : "rgba(56,200,120,0.15)"
                  : "transparent",
            }}
          >
            {status}
          </button>
        ))}
      </section>

      {/* Data grid */}
      <VerificationRowGrid<CoinLockRow>
        columns={columns}
        rows={filteredLocks}
        emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-8 w-8"><rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" /></svg>}
        emptyTitle="No locks found"
        emptyHint="Adjust your filter or check back later."
        onRowClick={(row) => setSelectedLock(row)}
      />

      {/* Detail drawer */}
      <VerificationDrawer
        open={!!selectedLock}
        onClose={() => setSelectedLock(null)}
        title={`Lock #${selectedLock?.id ?? ""}`}
        subtitle={selectedLock?.entityName}
        severity={selectedLock?.status === "UNLOCKING" ? "warning" : selectedLock?.status === "MATURED" ? "info" : "info"}
      >
        {selectedLock && (
          <div className="space-y-6">
            {/* Lock terms */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Lock Terms</h3>
              <div className="grid gap-4 rounded-lg bg-white/[0.04] p-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Locked Amount</div>
                  <div className="text-lg font-bold text-white">{selectedLock.lockedAmount.toLocaleString()} EHB</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Lock Period</div>
                  <div className="text-sm text-white">{selectedLock.lockPeriod} ({lockPeriodDays(selectedLock.lockPeriod)} days)</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Status</div>
                  <VerificationChip tone={statusTone(selectedLock.status)}>{selectedLock.status}</VerificationChip>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Timeline</h3>
              <div className="space-y-2 rounded-lg bg-white/[0.04] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Started</span>
                  <span className="text-white">{fmt(selectedLock.startDate)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">Unlock Date</span>
                  <span className="text-white font-semibold">{fmt(selectedLock.unlockDate)}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2 mt-2">
                  <span className="text-white/70">Days Remaining</span>
                  <span className="text-[#38C878] font-semibold">{daysRemaining(selectedLock.unlockDate)}</span>
                </div>
              </div>
            </div>

            {/* APY & Rewards */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Returns & APY</h3>
              <div className="grid gap-4 rounded-lg bg-white/[0.04] p-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Annual Percentage Yield</div>
                  <div className="text-lg font-bold text-[#38C878]">{selectedLock.apy}% APY</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-1">Estimated Rewards ({selectedLock.lockPeriod})</div>
                  <div className="text-sm font-semibold text-white">
                    {calculateRewards(selectedLock.lockedAmount, selectedLock.apy, lockPeriodDays(selectedLock.lockPeriod))} EHB
                  </div>
                  <div className="text-[10px] text-white/45 mt-1">
                    Total unlock: {(selectedLock.lockedAmount + calculateRewards(selectedLock.lockedAmount, selectedLock.apy, lockPeriodDays(selectedLock.lockPeriod))).toLocaleString()} EHB
                  </div>
                </div>
              </div>
            </div>

            {/* Early withdrawal info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Early Withdrawal</h3>
              <div className="rounded-lg bg-[#F0A030]/15 border border-[#F0A030]/40 p-4">
                <div className="text-xs text-[#F0A030] leading-relaxed">
                  <p className="font-semibold mb-2">Penalty: 5% of rewards + 2% of principal</p>
                  <p className="text-[11px] text-white/70">
                    Withdrawing before the unlock date will forfeit 5% of accrued rewards and apply a 2% penalty
                    on the locked principal. Plan accordingly to maximize returns.
                  </p>
                </div>
              </div>
            </div>

            {/* Action footer */}
            {selectedLock.status === "MATURED" && (
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#38C878]/20 border border-[#38C878]/50 px-3 py-2 text-xs font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/30 hover:border-[#38C878]/70"
                >
                  Withdraw Coins
                </button>
              </div>
            )}
            {selectedLock.status === "LOCKED" && (
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#F0A030]/20 border border-[#F0A030]/50 px-3 py-2 text-xs font-semibold text-[#F0A030] transition-colors hover:bg-[#F0A030]/30 hover:border-[#F0A030]/70"
                >
                  Early Withdrawal
                </button>
              </div>
            )}
            {selectedLock.status === "UNLOCKING" && (
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#38C878]/20 border border-[#38C878]/50 px-3 py-2 text-xs font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/30 hover:border-[#38C878]/70"
                >
                  Complete Withdrawal
                </button>
              </div>
            )}
          </div>
        )}
      </VerificationDrawer>
    </div>
  );
}
