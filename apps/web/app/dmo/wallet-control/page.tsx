"use client";

/**
 * Wallet Control — Phase 3 Operations rebuild (2026-04-12).
 *
 * Design system compliance:
 *   - VerificationUI primitives (stat cards, row grid, drawer, chip row)
 *   - No <table> (§10 forbidden)
 *   - Gradient accent bars + corner decorations (ehb-uiux-auto-designer skill)
 *   - STLBadge + STLLevelTrack for coin-lock ladder
 *   - Drill-in drawers on every stat + row
 *
 * Prototype-only (no backend wiring) per Rafi's current UI/UX-first plan.
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
  STLBadge,
  STL_LEVELS,
  getStlMeta,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

/* ================================================================== */
/* Types + demo data                                                   */
/* ================================================================== */

type TxKind = "deposit" | "withdraw" | "escrow" | "release" | "fee" | "lock" | "unlock";
type TxStatus = "pending" | "cleared" | "held" | "failed";

type WalletTx = {
  id: string;
  kind: TxKind;
  amount: number;
  user: string;
  ref: string;
  createdAt: string;
  status: TxStatus;
  note?: string;
};

type CoinLockTier = {
  level: number; // STL L1..L10
  holders: number;
  totalLockedEhbgc: number;
  share: number; // % of total lock
};

type EscrowRow = {
  id: string;
  user: string;
  amount: number;
  reason: string;
  releaseEta: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
};

const DEMO_TX: WalletTx[] = [
  { id: "TX-991023", kind: "deposit",  amount: 1250,  user: "sara.k@gosellr.pk",   ref: "EASYPAISA · #9011",      createdAt: "2026-04-11T10:22:00Z", status: "cleared", note: "Auto-deposit from EasyPaisa wallet, KYC verified." },
  { id: "TX-991022", kind: "escrow",   amount: 8600,  user: "ols.karachi@ehb.dev", ref: "CRB fee · APP-77281",    createdAt: "2026-04-11T10:17:00Z", status: "held",    note: "Legal firm franchise fee held until CRB approval." },
  { id: "TX-991021", kind: "withdraw", amount: 3200,  user: "hamza.r@agts.pk",     ref: "STRIPE · ***4411",       createdAt: "2026-04-11T09:48:00Z", status: "pending", note: "Pending risk review — amount > $3k threshold." },
  { id: "TX-991020", kind: "release",  amount: 4400,  user: "wms.lhr@ehb.dev",     ref: "Escrow release · APP-77240", createdAt: "2026-04-11T09:12:00Z", status: "cleared", note: "Medical clinic CRB approved, escrow released to owner." },
  { id: "TX-991019", kind: "fee",      amount: 120,   user: "GoSellr · platform",  ref: "40/25/20/15 split",       createdAt: "2026-04-11T09:05:00Z", status: "cleared", note: "Platform share after franchise/affiliate/owner split." },
  { id: "TX-991018", kind: "withdraw", amount: 950,   user: "ayesha@obs.pk",       ref: "JAZZCASH · ***7712",     createdAt: "2026-04-11T08:51:00Z", status: "failed",  note: "Provider returned insufficient funds at JazzCash side." },
  { id: "TX-991017", kind: "lock",     amount: 2000,  user: "hammad.hps@ehb.dev",  ref: "STL upgrade → L8",        createdAt: "2026-04-11T08:40:00Z", status: "cleared", note: "Coin lock for L8 VIP upgrade, 2000 EHBGC · 2yr lockup." },
  { id: "TX-991016", kind: "unlock",   amount: 500,   user: "rida.pss@ehb.dev",    ref: "Expiry · 1yr lock",       createdAt: "2026-04-11T08:22:00Z", status: "cleared", note: "1yr lock expired, funds moved back to free balance." },
];

const COIN_LOCK_LADDER: CoinLockTier[] = [
  { level: 2,  holders: 1842, totalLockedEhbgc: 36_840,   share: 2 },
  { level: 3,  holders: 1204, totalLockedEhbgc: 60_200,   share: 3 },
  { level: 4,  holders: 802,  totalLockedEhbgc: 80_200,   share: 5 },
  { level: 5,  holders: 612,  totalLockedEhbgc: 122_400,  share: 7 },
  { level: 6,  holders: 310,  totalLockedEhbgc: 155_000,  share: 9 },
  { level: 7,  holders: 184,  totalLockedEhbgc: 184_000,  share: 11 },
  { level: 8,  holders: 88,   totalLockedEhbgc: 176_000,  share: 10 },
  { level: 9,  holders: 22,   totalLockedEhbgc: 88_000,   share: 5 },
  { level: 10, holders: 7,    totalLockedEhbgc: 70_000,   share: 4 },
];

const DEMO_ESCROW: EscrowRow[] = [
  { id: "ESC-71", user: "ols.karachi@ehb.dev", amount: 8600, reason: "OLS franchise fee — pending CRB", releaseEta: "2026-04-14", risk: "LOW" },
  { id: "ESC-72", user: "gosellr.sialkot",     amount: 4200, reason: "Refund guarantee — 7-day clock",    releaseEta: "2026-04-18", risk: "MEDIUM" },
  { id: "ESC-73", user: "wms.lahore",          amount: 2100, reason: "Dispute frozen — complaint #44981", releaseEta: "2026-04-20", risk: "HIGH" },
  { id: "ESC-74", user: "agts.islamabad",      amount: 6800, reason: "Booking hold — awaiting delivery",  releaseEta: "2026-04-13", risk: "LOW" },
];

/* ================================================================== */
/* Helpers                                                             */
/* ================================================================== */

const usd = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const ehbgc = (n: number) =>
  `${new Intl.NumberFormat().format(n)} EHBGC`;

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function kindTone(kind: TxKind): VerificationTone {
  switch (kind) {
    case "deposit":  return "teal";
    case "withdraw": return "amber";
    case "escrow":   return "purple";
    case "release":  return "green";
    case "fee":      return "cyan";
    case "lock":     return "purple";
    case "unlock":   return "cyan";
  }
}

function statusTone(s: TxStatus): VerificationTone {
  switch (s) {
    case "cleared": return "green";
    case "pending": return "amber";
    case "held":    return "purple";
    case "failed":  return "red";
  }
}

function riskTone(r: EscrowRow["risk"]): VerificationTone {
  switch (r) {
    case "LOW":    return "green";
    case "MEDIUM": return "amber";
    case "HIGH":   return "red";
  }
}

/* ================================================================== */
/* Page                                                                */
/* ================================================================== */

type KindFilter = "ALL" | TxKind;

export default function WalletControlPage() {
  const [tx] = useState<WalletTx[]>(DEMO_TX);
  const [withdrawalsPaused, setWithdrawalsPaused] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<WalletTx | null>(null);
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowRow | null>(null);
  const [kindFilter, setKindFilter] = useState<KindFilter>("ALL");
  const [statDrawer, setStatDrawer] = useState<
    null | "liquidity" | "escrow" | "pending" | "locked"
  >(null);

  const kpis = useMemo(() => {
    const totalLiquidity = 8_420_000;
    const escrowHeld =
      tx.filter((t) => t.kind === "escrow" && t.status === "held").reduce((s, t) => s + t.amount, 0) + 2_180_000;
    const pendingWithdraw =
      tx.filter((t) => t.kind === "withdraw" && t.status === "pending").reduce((s, t) => s + t.amount, 0) + 18_200;
    const totalLockedEhbgc = COIN_LOCK_LADDER.reduce((s, t) => s + t.totalLockedEhbgc, 0);
    return { totalLiquidity, escrowHeld, pendingWithdraw, totalLockedEhbgc };
  }, [tx]);

  const visibleTx = useMemo(() => {
    if (kindFilter === "ALL") return tx;
    return tx.filter((t) => t.kind === kindFilter);
  }, [tx, kindFilter]);

  function flashToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 2600);
  }

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-2xl border p-6 border-[rgba(240,160,48,0.35)] bg-gradient-to-br from-[rgba(240,160,48,0.12)] via-[rgba(19,22,42,0.92)] to-[rgba(43,191,160,0.10)]"
      >
        {/* gradient accent bar */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#F0A030] to-transparent shadow-[0_0_16px_#F0A030]"
        />
        {/* corner decorations */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 h-4 w-4 opacity-60 border-l-[1.5px] border-t-[1.5px] border-[#F0A030] rounded-tl-[4px]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 opacity-60 border-r-[1.5px] border-b-[1.5px] border-[#2BBFA0] rounded-br-[4px]"
        />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F0A030]/25 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-gradient-to-tr from-[#7B6EF6]/18 via-transparent to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">Wallet</span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F0A030]">
              Operations · Wallet Engine
            </p>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Wallet Control</h1>
            <p className="max-w-2xl text-sm text-white/65">
              EHB wallet admin surface — balances, escrow, coin-lock ladder (STL L1 → L10),
              aur revenue split 40/25/20/15. Withdrawals aur escrow release yahaan se
              control hoti hain.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setWithdrawalsPaused((p) => !p);
                flashToast(withdrawalsPaused ? "Withdrawals resumed." : "Withdrawals paused globally.");
              }}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                withdrawalsPaused
                  ? "border-[#F05858]/55 bg-[#F05858]/20 text-[#F05858] shadow-[0_0_18px_rgba(240,88,88,0.35)] hover:bg-[#F05858]/30"
                  : "border-[#F0A030]/50 bg-[#F0A030]/15 text-[#F0A030] hover:border-[#F0A030]/80 hover:bg-[#F0A030]/25 hover:text-white"
              }`}
            >
              {withdrawalsPaused ? (<><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1"><circle cx="12" cy="12" r="6"/></svg>Resume withdrawals</>) : (<><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline mr-1"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>Pause withdrawals</>)}
            </button>
            <Link
              href="/dmo/blockchain-control"
              className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/80 hover:bg-[#7B6EF6]/25 hover:text-white"
            >
              On-chain proofs
            </Link>
          </div>
        </div>
      </section>

      {/* KPI stats */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="teal"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          label="Total liquidity"
          value={usd(kpis.totalLiquidity)}
          sub="Free + locked + escrow"
          onClick={() => setStatDrawer("liquidity")}
        />
        <VerificationStatCard
          tone="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" /></svg>}
          label="Escrow held"
          value={usd(kpis.escrowHeld)}
          sub="Dispute + release hold"
          onClick={() => setStatDrawer("escrow")}
        />
        <VerificationStatCard
          tone="amber"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Pending withdrawals"
          value={usd(kpis.pendingWithdraw)}
          sub="Awaiting risk review"
          onClick={() => setStatDrawer("pending")}
        />
        <VerificationStatCard
          tone="cyan"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polygon points="6 3 18 3 22 9 12 22 2 9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
          label="Coin-locked"
          value={ehbgc(kpis.totalLockedEhbgc)}
          sub="STL ladder stake"
          onClick={() => setStatDrawer("locked")}
        />
      </section>

      {/* Coin-lock ladder — STL L1→L10 bento grid */}
      <section
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 backdrop-blur-sm"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#2BBFA0] via-[#7B6EF6] to-transparent shadow-[0_0_12px_rgba(123,110,246,0.5)]"
        />
        <SectionHeader
          eyebrow="Wallet · Coin-Lock Ladder"
          title="EHBGC locked per STL tier"
          hint="Every STL tier requires a minimum EHBGC lock. Higher tier = higher trust, higher earnings, lower fees."
          right={
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              {COIN_LOCK_LADDER.reduce((s, t) => s + t.holders, 0).toLocaleString()} holders
            </span>
          }
        />

        <div className="mt-3 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {COIN_LOCK_LADDER.map((tier) => {
            const meta = getStlMeta(tier.level);
            return (
              <div
                key={tier.level}
                className="group relative overflow-hidden rounded-xl border bg-[#1A1D33]/75 p-3 transition-all duration-300 hover:-translate-y-[2px]"
                style={{
                  borderColor: `${meta.accent}44`,
                  boxShadow: `0 0 0 rgba(0,0,0,0)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${meta.glow}`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = meta.accent;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${meta.accent}44`;
                }}
              >
                {/* accent bar */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
                  style={{
                    background: meta.accent,
                    boxShadow: `0 0 8px ${meta.accent}`,
                  }}
                />
                <div className="flex items-center gap-3">
                  <STLBadge level={tier.level} size="sm" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                      Min lock
                    </p>
                    <p
                      className="text-sm font-black tabular-nums"
                      style={{ color: meta.accent }}
                    >
                      {meta.coinLock.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-white/40">EHBGC</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 border-t border-white/8 pt-2 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-white/45 uppercase tracking-wider">Holders</span>
                    <span className="font-mono text-white/85">
                      {tier.holders.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/45 uppercase tracking-wider">Total</span>
                    <span
                      className="font-mono font-bold"
                      style={{ color: meta.accent }}
                    >
                      {tier.totalLockedEhbgc.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/45 uppercase tracking-wider">Share</span>
                    <span className="font-mono text-white/65">{tier.share}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two-column: Transactions queue (left) + Escrow holds (right) */}
      <section className="grid gap-4 xl:grid-cols-3">
        {/* Transactions row grid */}
        <div className="xl:col-span-2 space-y-3">
          <SectionHeader
            eyebrow="Wallet · Live Feed"
            title="Recent transactions"
            hint="Click any row to inspect provider refs, status history, and next action."
            right={
              <FilterChipRow<KindFilter>
                value={kindFilter}
                onChange={setKindFilter}
                options={[
                  { value: "ALL",      label: `ALL · ${tx.length}` },
                  { value: "deposit",  label: "Deposit" },
                  { value: "withdraw", label: "Withdraw" },
                  { value: "escrow",   label: "Escrow" },
                  { value: "release",  label: "Release" },
                  { value: "lock",     label: "Lock" },
                  { value: "unlock",   label: "Unlock" },
                  { value: "fee",      label: "Fee" },
                ]}
              />
            }
          />
          <VerificationRowGrid<WalletTx>
            rows={visibleTx}
            columns={txColumns}
            onRowClick={(r) => setSelectedTx(r)}
            getRowTone={(r) => (r.status === "failed" ? "red" : r.status === "pending" ? "amber" : undefined)}
            emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
            emptyTitle="No transactions match filter"
            emptyHint="Try switching filter to ALL."
          />
        </div>

        {/* Escrow holds card stack */}
        <div className="space-y-3">
          <SectionHeader
            eyebrow="Wallet · Escrow"
            title="Held escrow queue"
            hint="Dispute + CRB-pending holds."
          />
          <div className="space-y-2">
            {DEMO_ESCROW.map((e) => {
              const tone = riskTone(e.risk);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setSelectedEscrow(e)}
                  className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#13162A]/75 p-3 text-left transition-all duration-200 hover:-translate-y-[1px] hover:border-[#7B6EF6]/50 hover:shadow-[0_0_16px_rgba(123,110,246,0.32)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] text-white/40">{e.id}</p>
                      <p className="truncate text-xs font-semibold text-white">{e.user}</p>
                      <p className="line-clamp-2 text-[10px] text-white/55">{e.reason}</p>
                    </div>
                    <VerificationChip tone={tone} size="xs">
                      {e.risk}
                    </VerificationChip>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-white/8 pt-2 text-[10px]">
                    <span className="text-white/45">ETA {e.releaseEta}</span>
                    <span className="font-mono text-sm font-bold text-white">
                      {usd(e.amount)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transaction drill-in drawer */}
      <VerificationDrawer
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title={selectedTx ? `Transaction · ${selectedTx.id}` : ""}
        subtitle={selectedTx ? fmtTime(selectedTx.createdAt) : undefined}
        severity={
          selectedTx?.status === "failed"
            ? "critical"
            : selectedTx?.status === "pending"
            ? "warning"
            : "info"
        }
      >
        {selectedTx ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <VerificationChip tone={kindTone(selectedTx.kind)}>
                {selectedTx.kind}
              </VerificationChip>
              <VerificationChip tone={statusTone(selectedTx.status)}>
                {selectedTx.status}
              </VerificationChip>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="User" value={selectedTx.user} />
              <InfoCell label="Amount" value={usd(selectedTx.amount)} tone="teal" />
              <InfoCell label="Reference" value={selectedTx.ref} mono />
              <InfoCell label="Submitted" value={fmtTime(selectedTx.createdAt)} />
            </div>
            {selectedTx.note ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  Operator note
                </p>
                <p className="text-xs leading-relaxed text-white/80">{selectedTx.note}</p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => flashToast(`Marked ${selectedTx.id} as cleared.`)}
                className="rounded-xl border border-[#2BBFA0]/45 bg-[#2BBFA0]/15 px-3 py-1.5 text-[11px] font-semibold text-[#2BBFA0] transition-colors hover:bg-[#2BBFA0]/25 hover:text-white"
              >
                Mark cleared
              </button>
              <button
                type="button"
                onClick={() => flashToast(`Escalated ${selectedTx.id} to fraud team.`)}
                className="rounded-xl border border-[#F05858]/45 bg-[#F05858]/15 px-3 py-1.5 text-[11px] font-semibold text-[#F05858] transition-colors hover:bg-[#F05858]/25 hover:text-white"
              >
                Escalate to fraud
              </button>
              <button
                type="button"
                onClick={() => flashToast(`Opened audit trail for ${selectedTx.id}.`)}
                className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                Audit trail
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Escrow drill-in drawer */}
      <VerificationDrawer
        open={!!selectedEscrow}
        onClose={() => setSelectedEscrow(null)}
        title={selectedEscrow ? `Escrow hold · ${selectedEscrow.id}` : ""}
        subtitle={selectedEscrow ? `Release ETA ${selectedEscrow.releaseEta}` : undefined}
        severity={
          selectedEscrow?.risk === "HIGH" ? "critical" : selectedEscrow?.risk === "MEDIUM" ? "warning" : "info"
        }
      >
        {selectedEscrow ? (
          <div className="space-y-4">
            <VerificationChip tone={riskTone(selectedEscrow.risk)}>
              Risk · {selectedEscrow.risk}
            </VerificationChip>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Held for" value={selectedEscrow.user} />
              <InfoCell label="Amount" value={usd(selectedEscrow.amount)} tone="teal" />
              <InfoCell label="Reason" value={selectedEscrow.reason} />
              <InfoCell label="Release ETA" value={selectedEscrow.releaseEta} />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => flashToast(`Released ${selectedEscrow.id} to owner.`)}
                className="rounded-xl border border-[#38C878]/45 bg-[#38C878]/15 px-3 py-1.5 text-[11px] font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/25 hover:text-white"
              >
                Release now
              </button>
              <button
                type="button"
                onClick={() => flashToast(`Hold extended for ${selectedEscrow.id}.`)}
                className="rounded-xl border border-[#F0A030]/45 bg-[#F0A030]/15 px-3 py-1.5 text-[11px] font-semibold text-[#F0A030] transition-colors hover:bg-[#F0A030]/25 hover:text-white"
              >
                Extend hold
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Stat drill-in drawer */}
      <VerificationDrawer
        open={!!statDrawer}
        onClose={() => setStatDrawer(null)}
        title={
          statDrawer === "liquidity"
            ? "Total liquidity · breakdown"
            : statDrawer === "escrow"
            ? "Escrow held · drill-in"
            : statDrawer === "pending"
            ? "Pending withdrawals · queue"
            : statDrawer === "locked"
            ? "Coin-locked EHBGC · by tier"
            : ""
        }
      >
        {statDrawer === "locked" ? (
          <div className="space-y-4">
            <p className="text-xs text-white/75">
              Distribution of locked EHBGC across STL tiers. Higher tiers represent deeper
              trust + longer lockups (1yr / 2yr / 3yr).
            </p>
            <SeverityMeter
              segments={COIN_LOCK_LADDER.map((t) => ({
                label: `L${t.level}`,
                value: t.totalLockedEhbgc,
                tone: t.level >= 8 ? "amber" : t.level >= 6 ? "purple" : t.level >= 4 ? "teal" : "cyan",
              }))}
            />
            <div className="space-y-2">
              {COIN_LOCK_LADDER.map((t) => {
                const meta = getStlMeta(t.level);
                return (
                  <div
                    key={t.level}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ background: meta.accent, boxShadow: `0 0 6px ${meta.accent}` }}
                      />
                      <span className="text-xs font-semibold text-white">
                        L{t.level} · {meta.label}
                      </span>
                    </div>
                    <span className="font-mono text-xs" style={{ color: meta.accent }}>
                      {t.totalLockedEhbgc.toLocaleString()} EHBGC
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : statDrawer === "liquidity" ? (
          <div className="space-y-3 text-xs text-white/75">
            <p>
              Total liquidity = free float + escrow held + coin-locked pool. Split shown
              below.
            </p>
            <SeverityMeter
              segments={[
                { label: "Free",    value: kpis.totalLiquidity - kpis.escrowHeld, tone: "teal" },
                { label: "Escrow",  value: kpis.escrowHeld,                         tone: "purple" },
              ]}
            />
          </div>
        ) : statDrawer === "escrow" ? (
          <div className="space-y-3 text-xs text-white/75">
            <p>Escrow is held for CRB approval, dispute resolution, or delivery confirmation.</p>
            <ul className="space-y-2">
              {DEMO_ESCROW.map((e) => (
                <li key={e.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                  <span className="truncate">{e.user}</span>
                  <span className="font-mono text-white">{usd(e.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : statDrawer === "pending" ? (
          <div className="space-y-3 text-xs text-white/75">
            <p>Withdrawals currently in risk review queue.</p>
            <ul className="space-y-2">
              {tx.filter((t) => t.kind === "withdraw" && t.status === "pending").map((t) => (
                <li key={t.id} className="flex items-center justify-between rounded-xl border border-[#F0A030]/30 bg-[#F0A030]/8 px-3 py-2">
                  <span className="truncate">{t.user}</span>
                  <span className="font-mono text-[#F0A030]">{usd(t.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </VerificationDrawer>

      {toast ? (
        <div className="fixed bottom-6 right-6 z-[80] rounded-xl border border-[#7B6EF6]/45 bg-[#13162A]/95 px-4 py-3 text-xs text-white shadow-[0_20px_60px_-20px_rgba(123,110,246,0.7)]">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

/* ================================================================== */
/* Local helpers                                                       */
/* ================================================================== */

function InfoCell({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "teal" | "amber" | "red";
}) {
  const fg =
    tone === "teal" ? "#2BBFA0" : tone === "amber" ? "#F0A030" : tone === "red" ? "#F05858" : "#ffffff";
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${mono ? "font-mono" : ""}`}
        style={{ color: fg }}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------- Row columns ---------- */
const txColumns: RowColumn<WalletTx>[] = [
  {
    key: "entity",
    header: "Tx / user",
    width: "minmax(0,2fr)",
    render: (t) => (
      <div className="min-w-0">
        <div className="font-mono text-[10px] text-white/45">{t.id}</div>
        <div className="truncate font-semibold text-white">{t.user}</div>
        <div className="truncate text-[10px] text-white/45">
          {t.ref} · {fmtTime(t.createdAt)}
        </div>
      </div>
    ),
  },
  {
    key: "kind",
    header: "Kind",
    width: "minmax(0,0.9fr)",
    render: (t) => (
      <VerificationChip tone={kindTone(t.kind)} size="xs">
        {t.kind}
      </VerificationChip>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    width: "minmax(0,1fr)",
    align: "right",
    render: (t) => (
      <span className="font-mono text-sm font-bold text-white tabular-nums">
        {usd(t.amount)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "minmax(0,0.9fr)",
    align: "right",
    render: (t) => (
      <VerificationChip tone={statusTone(t.status)} size="xs">
        {t.status}
      </VerificationChip>
    ),
  },
];
