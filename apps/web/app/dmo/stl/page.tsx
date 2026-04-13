"use client";

/**
 * STL Management landing — Phase 2.1 rebuild (2026-04-11).
 *
 * Real functionality kept:
 *   - Load STL scores + logs from /api/stl/calculate
 *   - Manual calculate (USER / SERVICE / PRODUCT)
 *   - Payment flow (create + verify) — real money rail
 *   - Ranking table + history
 *
 * Structural changes:
 *   - Outer <main> + container wrapper removed (DmoLayout provides both)
 *   - Hero upgraded to new EHB glass tokens (#13162A / #7B6EF6 / #2BBFA0)
 *   - Stats row upgraded to KPI-card style
 *   - Form and table sections re-skinned to match the new design system
 *
 * Naming: STL = Service Trust Level. Anti-fraud MIN rule referenced in the hero.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { StlWidget } from "@/components/features/stl/StlWidget";
import STLDashboard from "@/components/dmo/STLDashboard";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  STLBadge,
  STLLevelTrack,
  STL_LEVELS,
  getStlMeta,
  type RowColumn,
} from "@/components/dmo/verification/VerificationUI";

type EntityType = "USER" | "SERVICE" | "PRODUCT";

type StlScoreRow = {
  id: string;
  entityId: string;
  entityType: EntityType;
  score: number | string;
  level: number;
  breakdown: unknown;
  lastUpdated: string;
  createdAt: string;
};

type StlLogRow = {
  id: string;
  entityId: string;
  entityType: EntityType;
  change: number | string;
  reason: string;
  metadata: unknown;
  createdAt: string;
};

type PaymentType = "STL_UPGRADE" | "CRB_EXAM" | "DMO_REFILL" | "FRANCHISE_FEE";
type PaymentProvider = "EASYPAISA" | "JAZZCASH" | "STRIPE" | "PAYPAL";

function fmt(v: string): string {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString();
}

function levelChipTone(
  level: number
): "amber" | "purple" | "teal" | "cyan" | "red" {
  if (level >= 8) return "amber";
  if (level >= 7) return "purple";
  if (level >= 5) return "teal";
  if (level === 4) return "cyan";
  if (level === 3) return "purple";
  return "red";
}

/* ── Demo data ── */
const DEMO_SCORES: StlScoreRow[] = [
  { id: "STL-S01", entityId: "usr_ali_001", entityType: "USER", score: 82, level: 7, breakdown: {}, lastUpdated: "2026-04-11T10:00:00Z", createdAt: "2026-03-15T00:00:00Z" },
  { id: "STL-S02", entityId: "svc_gosellr_001", entityType: "SERVICE", score: 94, level: 8, breakdown: {}, lastUpdated: "2026-04-10T14:00:00Z", createdAt: "2026-01-20T00:00:00Z" },
  { id: "STL-S03", entityId: "usr_sara_002", entityType: "USER", score: 45, level: 3, breakdown: {}, lastUpdated: "2026-04-09T09:00:00Z", createdAt: "2026-04-01T00:00:00Z" },
  { id: "STL-S04", entityId: "prd_ols_001", entityType: "PRODUCT", score: 67, level: 5, breakdown: {}, lastUpdated: "2026-04-08T16:00:00Z", createdAt: "2026-02-10T00:00:00Z" },
  { id: "STL-S05", entityId: "usr_usman_003", entityType: "USER", score: 18, level: 1, breakdown: {}, lastUpdated: "2026-04-11T08:00:00Z", createdAt: "2026-04-10T00:00:00Z" },
  { id: "STL-S06", entityId: "svc_wms_001", entityType: "SERVICE", score: 73, level: 6, breakdown: {}, lastUpdated: "2026-04-07T12:00:00Z", createdAt: "2026-03-01T00:00:00Z" },
];

const DEMO_LOGS: StlLogRow[] = [
  { id: "LOG-01", entityId: "usr_ali_001", entityType: "USER", change: 5, reason: "KYC_VERIFIED", metadata: {}, createdAt: "2026-04-11T10:00:00Z" },
  { id: "LOG-02", entityId: "svc_gosellr_001", entityType: "SERVICE", change: -3, reason: "COMPLAINT_FILED", metadata: {}, createdAt: "2026-04-10T14:00:00Z" },
  { id: "LOG-03", entityId: "usr_sara_002", entityType: "USER", change: 12, reason: "CRB_CERTIFICATION", metadata: {}, createdAt: "2026-04-09T09:00:00Z" },
  { id: "LOG-04", entityId: "prd_ols_001", entityType: "PRODUCT", change: -8, reason: "FRAUD_DETECTED", metadata: {}, createdAt: "2026-04-08T16:00:00Z" },
  { id: "LOG-05", entityId: "usr_usman_003", entityType: "USER", change: 4, reason: "REFILL_COMPLETED", metadata: {}, createdAt: "2026-04-11T08:00:00Z" },
];

export default function DmoStlPage() {
  const [scores] = useState<StlScoreRow[]>(DEMO_SCORES);
  const [logs] = useState<StlLogRow[]>(DEMO_LOGS);
  const [selectedScore, setSelectedScore] = useState<StlScoreRow | null>(null);
  const [selectedLog, setSelectedLog] = useState<StlLogRow | null>(null);
  const [statDrawer, setStatDrawer] = useState<
    null | "total" | "elite" | "low" | "avg"
  >(null);

  const [calcEntityType, setCalcEntityType] = useState<EntityType>("USER");
  const [calcEntityId, setCalcEntityId] = useState("");
  const [calcRunning, setCalcRunning] = useState(false);

  const [paymentType, setPaymentType] = useState<PaymentType>("STL_UPGRADE");
  const [provider, setProvider] = useState<PaymentProvider>("STRIPE");
  const [amount, setAmount] = useState(50);
  const [paymentId, setPaymentId] = useState("");
  const [providerReference, setProviderReference] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState<string | null>(null);

  function runCalculate() {
    setCalcRunning(true);
    setTimeout(() => {
      setCalcRunning(false);
      setPaymentMsg(`STL recalculated for ${calcEntityType}${calcEntityId ? ` (${calcEntityId})` : ""} — demo mode.`);
    }, 800);
  }

  function createPayment() {
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      const fakeId = `PAY-${Date.now().toString(36).toUpperCase()}`;
      setPaymentId(fakeId);
      setPaymentMsg(`Payment intent created: ${fakeId} — ${provider} · $${amount} (demo).`);
    }, 600);
  }

  function verifyPayment() {
    if (!paymentId.trim()) {
      setPaymentMsg("paymentId required for verification");
      return;
    }
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentMsg(`Payment ${paymentId} verified — ${provider} confirmed (demo).`);
    }, 600);
  }

  const stats = useMemo(() => {
    const total = scores.length;
    const elite = scores.filter((s) => s.level >= 7).length;
    const low = scores.filter((s) => s.level <= 2).length;
    const avg = total > 0 ? Math.round(scores.reduce((sum, s) => sum + Number(s.score), 0) / total) : 0;
    return { total, elite, low, avg };
  }, [scores]);

  /**
   * Dominant level for the Trust Ladder showcase — the most common
   * STL level across tracked entities. Defaults to 7 (PRO) if no data
   * is loaded yet, so the prototype always looks alive.
   */
  const showcaseLevel = useMemo(() => {
    if (scores.length === 0) return 7;
    const counts: Record<number, number> = {};
    for (const s of scores) counts[s.level] = (counts[s.level] ?? 0) + 1;
    let best = 1;
    let bestCount = 0;
    for (const [lvl, c] of Object.entries(counts)) {
      if (c > bestCount) {
        best = Number(lvl);
        bestCount = c;
      }
    }
    return best;
  }, [scores]);
  const showcaseMeta = getStlMeta(showcaseLevel);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/25 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#7B6EF6]/22 via-[#A098F8]/12 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-gradient-to-br from-[#2BBFA0]/18 via-cyan-500/10 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A098F8]">
              Verification · STL Engine
            </p>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Service Trust Level Management
            </h1>
            <p className="max-w-xl text-sm text-white/65">
              Trust scoring across PSS, CRB, performance, behavior, industries, and refill
              lifecycle. Anti-fraud MIN rule enforces truth across{" "}
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-white/80">
                product / seller / company / owner
              </code>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dmo/ehb-stl-level"
              className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A098F8] transition-colors hover:border-[#7B6EF6]/80 hover:bg-[#7B6EF6]/25 hover:text-white"
            >
              EHB-STL-LEVEL reference
            </Link>
            <Link
              href="/dmo/complaints"
              className="rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/12 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/70 hover:bg-[#2BBFA0]/20 hover:text-white"
            >
              Complaints
            </Link>
          </div>
        </div>
      </section>

      {/* 4 KPI stats — §7.5 clickable stat cards with icon + drill-in */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" /></svg>}
          label="Tracked entities"
          value={stats.total}
          sub="User · Service · Product"
          onClick={() => setStatDrawer("total")}
        />
        <VerificationStatCard
          tone="teal"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>}
          label="VIP+ (L7-L10)"
          value={stats.elite}
          sub="Elite tier"
          onClick={() => setStatDrawer("elite")}
        />
        <VerificationStatCard
          tone="amber"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" /><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
          label="Low trust (L1-L2)"
          value={stats.low}
          sub="Needs attention"
          onClick={() => setStatDrawer("low")}
        />
        <VerificationStatCard
          tone="cyan"
          icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="12" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="10" y="7" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="17" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth="1.4" /></svg>}
          label="Average score"
          value={stats.avg}
          sub="Across all tracked"
          onClick={() => setStatDrawer("avg")}
        />
      </section>

      {/* Trust Ladder showcase — STLBadge + STLLevelTrack (§ skill: ehb-uiux-auto-designer) */}
      <section
        className="relative overflow-hidden rounded-2xl border p-5 bg-gradient-to-br from-[#7B6EF6]/10 via-[#1A1D33]/85 to-[#F0A030]/10"
        style={{
          borderColor: `${showcaseMeta.accent}55`,
          boxShadow: `0 0 40px ${showcaseMeta.glow}`,
        }}
      >
        {/* gradient accent bar */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${showcaseMeta.accent} 50%, transparent 100%)`,
            boxShadow: `0 0 14px ${showcaseMeta.accent}`,
          }}
        />
        {/* corner decorations */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 h-4 w-4 opacity-60"
          style={{
            borderLeft: `1.5px solid ${showcaseMeta.accent}`,
            borderTop: `1.5px solid ${showcaseMeta.accent}`,
            borderTopLeftRadius: 4,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 opacity-60"
          style={{
            borderRight: `1.5px solid ${showcaseMeta.accent}`,
            borderBottom: `1.5px solid ${showcaseMeta.accent}`,
            borderBottomRightRadius: 4,
          }}
        />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          {/* Left — animated badge */}
          <div className="flex shrink-0 flex-col items-center gap-3">
            <STLBadge level={showcaseLevel} size="lg" />
            <div className="text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Dominant tier
              </p>
              <p
                className="text-xs font-bold"
                style={{ color: showcaseMeta.accent }}
              >
                L{showcaseLevel} · {showcaseMeta.label}
              </p>
            </div>
          </div>

          {/* Right — level track + meta */}
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A098F8]">
                EHB Trust Ladder · L1 → L10
              </p>
              <h2 className="text-lg font-bold text-white">
                Service Trust Level progression
              </h2>
              <p className="text-[11px] text-white/55">
                FREE → BASIC → NORMAL → STANDARD → ADVANCED → HIGH → PRO → VIP →
                ELITE → SUPREME · gold-locked tiers require coin lock + L8
                approval + stable PSS/CRB signals.
              </p>
            </div>

            <STLLevelTrack activeLevel={showcaseLevel} />

            {/* Current tier requirements */}
            <div className="grid gap-2 rounded-xl border border-white/8 bg-white/[0.03] p-3 sm:grid-cols-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Score band
                </p>
                <p className="text-sm font-bold text-white tabular-nums">
                  {showcaseMeta.scoreMin}–{showcaseMeta.scoreMax}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Coin lock
                </p>
                <p
                  className="text-sm font-bold tabular-nums"
                  style={{ color: showcaseMeta.accent }}
                >
                  {showcaseMeta.coinLock.toLocaleString()} EHBGC
                </p>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Next tier
                </p>
                <p className="text-sm font-bold text-white">
                  {showcaseLevel < 10
                    ? `L${showcaseLevel + 1} · ${STL_LEVELS[showcaseLevel]!.label}`
                    : "— Maxed out —"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Widget + in-depth dashboard */}
      <section className="space-y-4">
        <StlWidget />
        <STLDashboard />
      </section>

      {/* Payment flow */}
      <section className="space-y-3 rounded-2xl border border-white/10 bg-[#13162A]/80 p-5">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F0A030]">
            Real Money Flow
          </p>
          <h3 className="text-sm font-semibold text-white">Payment System</h3>
        </div>
        <div className="grid gap-2 md:grid-cols-4">
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as PaymentType)}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/80"
          >
            <option value="STL_UPGRADE">STL Upgrade</option>
            <option value="CRB_EXAM">CRB Exam</option>
            <option value="DMO_REFILL">DMO Refill</option>
            <option value="FRANCHISE_FEE">Franchise Fee</option>
          </select>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as PaymentProvider)}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/80"
          >
            <option value="EASYPAISA">Easypaisa</option>
            <option value="JAZZCASH">JazzCash</option>
            <option value="STRIPE">Stripe</option>
            <option value="PAYPAL">PayPal</option>
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value || 0))}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/80"
            placeholder="Amount"
          />
          <input
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/80"
            placeholder="paymentId (auto after create)"
          />
        </div>
        {provider !== "STRIPE" ? (
          <input
            value={providerReference}
            onChange={(e) => setProviderReference(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/80"
            placeholder="Provider reference / txn id (required for verify)"
          />
        ) : null}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => void createPayment()}
            disabled={paymentLoading}
            className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-[#7B6EF6]/80 hover:bg-[#7B6EF6]/30 disabled:opacity-60"
          >
            {paymentLoading ? "Processing…" : "Create Payment"}
          </button>
          <button
            onClick={() => void verifyPayment()}
            disabled={paymentLoading}
            className="rounded-xl border border-[#2BBFA0]/45 bg-[#2BBFA0]/15 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/80 hover:bg-[#2BBFA0]/25 hover:text-white disabled:opacity-60"
          >
            Verify Payment
          </button>
        </div>
        <p className="text-[10px] text-white/45">
          Flow: create payment → complete with provider → verify payment → STL/DMO updates +
          affiliate commission if referred.
        </p>
        {paymentMsg ? (
          <div className="rounded-xl border border-[#2BBFA0]/35 bg-[#2BBFA0]/10 p-2 text-xs text-[#2BBFA0]">
            {paymentMsg}
          </div>
        ) : null}
      </section>

      {/* Manual calculate */}
      <section className="space-y-3 rounded-2xl border border-white/10 bg-[#13162A]/80 p-5">
        <h3 className="text-sm font-semibold text-white">Manual STL Calculation</h3>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={calcEntityType}
            onChange={(e) => setCalcEntityType(e.target.value as EntityType)}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/80"
          >
            <option value="USER">USER</option>
            <option value="SERVICE">SERVICE</option>
            <option value="PRODUCT">PRODUCT</option>
          </select>
          <input
            value={calcEntityId}
            onChange={(e) => setCalcEntityId(e.target.value)}
            className="min-w-[280px] rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/80 placeholder:text-white/35"
            placeholder={
              calcEntityType === "USER"
                ? "Optional userId (leave blank = current user)"
                : `Required ${calcEntityType.toLowerCase()} id`
            }
          />
          <button
            onClick={() => void runCalculate()}
            disabled={calcRunning || (calcEntityType !== "USER" && !calcEntityId.trim())}
            className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-[#7B6EF6]/80 hover:bg-[#7B6EF6]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {calcRunning ? "Calculating…" : "Calculate STL"}
          </button>
        </div>
        <p className="text-[10px] text-white/45">
          The STL engine supports USER, SERVICE, and PRODUCT entities.
        </p>
      </section>

      {/* Ranking — row grid (no <table> per §10 forbidden list) */}
      <section>
        <SectionHeader
          eyebrow="Verification · Leaderboard"
          title="STL Ranking"
          hint="Click any row to drill into the breakdown and change log."
          right={
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
              {scores.length} entities
            </span>
          }
        />
        <VerificationRowGrid<StlScoreRow>
          rows={scores}
          onRowClick={(row) => setSelectedScore(row)}
          columns={scoreColumns}
          emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.4" /></svg>}
          emptyTitle="No STL scores yet"
          emptyHint="Run a manual calculation to seed the leaderboard."
        />
      </section>

      {/* History — row grid */}
      <section>
        <SectionHeader
          eyebrow="Verification · Audit"
          title="STL History"
          hint="Every score change is logged. Click a row to open the reason."
          right={
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
              {logs.length} events
            </span>
          }
        />
        <VerificationRowGrid<StlLogRow>
          rows={logs}
          onRowClick={(row) => setSelectedLog(row)}
          columns={logColumns}
          emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.4" /><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.4" /></svg>}
          emptyTitle="No history yet"
          emptyHint="STL change events will show here as soon as they occur."
        />
      </section>

      {/* Score drill-in drawer */}
      <VerificationDrawer
        open={!!selectedScore}
        onClose={() => setSelectedScore(null)}
        title={selectedScore ? `STL score · ${selectedScore.entityId}` : ""}
        subtitle={
          selectedScore
            ? `${selectedScore.entityType} · L${selectedScore.level}`
            : undefined
        }
        severity={
          selectedScore
            ? selectedScore.level <= 2
              ? "high"
              : selectedScore.level <= 4
              ? "warning"
              : "info"
            : "info"
        }
      >
        {selectedScore ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <DrawerField
                label="Entity ID"
                value={selectedScore.entityId}
                mono
              />
              <DrawerField
                label="Type"
                value={selectedScore.entityType}
              />
              <DrawerField
                label="Score"
                value={Number(selectedScore.score).toFixed(2)}
              />
              <DrawerField
                label="Level"
                value={`L${selectedScore.level}`}
              />
              <DrawerField
                label="Updated"
                value={fmt(selectedScore.lastUpdated)}
              />
              <DrawerField
                label="Created"
                value={fmt(selectedScore.createdAt)}
              />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Anti-fraud MIN rule
              </p>
              <p className="text-xs leading-relaxed text-white/75">
                Final displayed STL = MIN(productSTL, sellerSTL,
                companySTL, ownerSTL). Agar kisi ek bhi layer ka
                STL <code>FREE</code> hai to poora product{" "}
                <code>FREE</code> dikhega.
              </p>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Log drill-in drawer */}
      <VerificationDrawer
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={selectedLog ? `STL change · ${selectedLog.entityId}` : ""}
        subtitle={selectedLog ? fmt(selectedLog.createdAt) : undefined}
        severity={
          selectedLog && Number(selectedLog.change) < 0 ? "warning" : "info"
        }
      >
        {selectedLog ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <DrawerField label="Entity ID" value={selectedLog.entityId} mono />
              <DrawerField label="Type" value={selectedLog.entityType} />
              <DrawerField
                label="Change"
                value={`${Number(selectedLog.change) >= 0 ? "+" : ""}${Number(
                  selectedLog.change
                ).toFixed(2)}`}
                tone={Number(selectedLog.change) >= 0 ? "teal" : "red"}
              />
              <DrawerField label="Reason" value={selectedLog.reason} />
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Stat drill-in drawer */}
      <VerificationDrawer
        open={!!statDrawer}
        onClose={() => setStatDrawer(null)}
        title={
          statDrawer === "total"
            ? "Tracked entities"
            : statDrawer === "elite"
            ? "VIP+ entities (L7–L10)"
            : statDrawer === "low"
            ? "Low-trust entities (L1–L2)"
            : statDrawer === "avg"
            ? "Average STL score"
            : ""
        }
      >
        {statDrawer === "total" ? (
          <div className="space-y-3 text-xs text-white/75">
            <p>
              Total entities currently tracked by the STL engine across USER,
              SERVICE and PRODUCT.
            </p>
            <p className="text-white/60">
              Count: <strong className="text-white">{stats.total}</strong>
            </p>
          </div>
        ) : statDrawer === "elite" ? (
          <div className="space-y-3">
            <p className="text-xs text-white/75">
              Entities in the VIP+ band (L7 PRO, L8 VIP, L9 ELITE, L10 SUPREME).
            </p>
            <div className="grid gap-2">
              {scores
                .filter((s) => s.level >= 7)
                .slice(0, 8)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs"
                  >
                    <span className="truncate text-white/85">{s.entityId}</span>
                    <VerificationChip tone={levelChipTone(s.level)} size="xs">
                      L{s.level}
                    </VerificationChip>
                  </div>
                ))}
            </div>
          </div>
        ) : statDrawer === "low" ? (
          <div className="space-y-3">
            <p className="text-xs text-white/75">
              Entities flagged as low trust (L1 FREE / L2 BASIC). These need
              PSS + CRB attention before any high-value listings.
            </p>
            <div className="grid gap-2">
              {scores
                .filter((s) => s.level <= 2)
                .slice(0, 8)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl border border-[#F05858]/30 bg-[#F05858]/8 px-3 py-2 text-xs"
                  >
                    <span className="truncate text-white/85">{s.entityId}</span>
                    <VerificationChip tone="red" size="xs">
                      L{s.level}
                    </VerificationChip>
                  </div>
                ))}
            </div>
          </div>
        ) : statDrawer === "avg" ? (
          <div className="space-y-3 text-xs text-white/75">
            <p>
              Rolling mean across all tracked entities. Formula includes PSS
              trust, CRB verification + refill, DMO engagement, locked-coin
              stake, minus valid complaint penalties.
            </p>
            <p className="text-white/60">
              Current average:{" "}
              <strong className="text-white">{stats.avg}</strong> / 100
            </p>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}

/* ---------- Drawer field helper ---------- */
function DrawerField({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "teal" | "red";
}) {
  const fg =
    tone === "teal" ? "#2BBFA0" : tone === "red" ? "#F05858" : "#ffffff";
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
const scoreColumns: RowColumn<StlScoreRow>[] = [
  {
    key: "entity",
    header: "Entity",
    width: "minmax(0,1.8fr)",
    render: (s) => (
      <div className="min-w-0">
        <div className="truncate font-semibold text-white">{s.entityId}</div>
        <div className="text-[10px] text-white/45">{s.entityType}</div>
      </div>
    ),
  },
  {
    key: "score",
    header: "Score",
    width: "minmax(0,0.8fr)",
    render: (s) => (
      <span className="font-mono tabular-nums text-white/85">
        {Number(s.score).toFixed(2)}
      </span>
    ),
  },
  {
    key: "level",
    header: "Level",
    width: "minmax(0,0.6fr)",
    render: (s) => (
      <VerificationChip tone={levelChipTone(s.level)} size="xs">
        L{s.level}
      </VerificationChip>
    ),
  },
  {
    key: "updated",
    header: "Updated",
    width: "minmax(0,1.2fr)",
    align: "right",
    render: (s) => (
      <span className="text-[10px] text-white/45">{fmt(s.lastUpdated)}</span>
    ),
  },
];

const logColumns: RowColumn<StlLogRow>[] = [
  {
    key: "entity",
    header: "Entity",
    width: "minmax(0,1.6fr)",
    render: (l) => (
      <div className="min-w-0">
        <div className="truncate font-semibold text-white">{l.entityId}</div>
        <div className="text-[10px] text-white/45">{l.entityType}</div>
      </div>
    ),
  },
  {
    key: "change",
    header: "Change",
    width: "minmax(0,0.7fr)",
    render: (l) => {
      const v = Number(l.change);
      return (
        <span
          className="font-mono font-semibold tabular-nums"
          style={{ color: v >= 0 ? "#2BBFA0" : "#F05858" }}
        >
          {v >= 0 ? "+" : ""}
          {v.toFixed(2)}
        </span>
      );
    },
  },
  {
    key: "reason",
    header: "Reason",
    width: "minmax(0,1.8fr)",
    render: (l) => (
      <span className="block truncate text-white/75">{l.reason}</span>
    ),
  },
  {
    key: "at",
    header: "When",
    width: "minmax(0,1.1fr)",
    align: "right",
    render: (l) => (
      <span className="text-[10px] text-white/45">{fmt(l.createdAt)}</span>
    ),
  },
];

// NOTE: Legacy StlStatCard removed — replaced by VerificationStatCard (§7.5 compliant).
