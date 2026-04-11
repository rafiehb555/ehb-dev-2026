"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StlWidget } from "@/components/features/stl/StlWidget";
import STLDashboard from "@/components/dmo/STLDashboard";

type StlScoreRow = {
  id: string;
  entityId: string;
  entityType: "USER" | "SERVICE" | "PRODUCT";
  score: number | string;
  level: number;
  breakdown: any;
  lastUpdated: string;
  createdAt: string;
};

type StlLogRow = {
  id: string;
  entityId: string;
  entityType: "USER" | "SERVICE" | "PRODUCT";
  change: number | string;
  reason: string;
  metadata: any;
  createdAt: string;
};

function fmt(v: string) {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString();
}

function levelTone(level: number) {
  if (level >= 8) return "border-amber-300/50 bg-amber-500/20 text-amber-50";
  if (level >= 7) return "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-100";
  if (level >= 5) return "border-emerald-400/40 bg-emerald-500/10 text-emerald-100";
  if (level === 4) return "border-cyan-400/40 bg-cyan-500/10 text-cyan-100";
  if (level === 3) return "border-violet-400/40 bg-violet-500/10 text-violet-100";
  if (level === 2) return "border-amber-400/40 bg-amber-500/10 text-amber-100";
  return "border-rose-400/40 bg-rose-500/10 text-rose-100";
}

export default function DmoStlPage() {
  const [scores, setScores] = useState<StlScoreRow[]>([]);
  const [logs, setLogs] = useState<StlLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calcEntityType, setCalcEntityType] = useState<"USER" | "SERVICE" | "PRODUCT">("USER");
  const [calcEntityId, setCalcEntityId] = useState("");
  const [calcRunning, setCalcRunning] = useState(false);
  const [paymentType, setPaymentType] = useState<"STL_UPGRADE" | "CRB_EXAM" | "DMO_REFILL" | "FRANCHISE_FEE">("STL_UPGRADE");
  const [provider, setProvider] = useState<"EASYPAISA" | "JAZZCASH" | "STRIPE" | "PAYPAL">("STRIPE");
  const [amount, setAmount] = useState(50);
  const [paymentId, setPaymentId] = useState("");
  const [providerReference, setProviderReference] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stl/calculate?take=100&skip=0&logsTake=100", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.error?.message ?? `STL load failed: ${res.status}`);
      setScores((json?.data?.scores ?? []) as StlScoreRow[]);
      setLogs((json?.data?.logs ?? []) as StlLogRow[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load STL data");
    } finally {
      setLoading(false);
    }
  }

  async function runCalculate() {
    setCalcRunning(true);
    try {
      const res = await fetch("/api/stl/calculate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          entityType: calcEntityType,
          ...(calcEntityId.trim() ? { entityId: calcEntityId.trim() } : {}),
          reason: "DMO_STL_MANUAL_CALCULATION",
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? `Calculate failed: ${res.status}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to calculate STL");
    } finally {
      setCalcRunning(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createPayment() {
    setPaymentLoading(true);
    setPaymentMsg(null);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: paymentType, provider, amount }),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.error?.message ?? "Payment create failed");
      const data = json?.data ?? {};
      setPaymentId(data.paymentId ?? "");
      if (provider === "STRIPE" && data.checkoutUrl) {
        window.location.href = data.checkoutUrl as string;
        return;
      }
      setPaymentMsg(`Payment intent created: ${data.paymentId}`);
    } catch (e) {
      setPaymentMsg(e instanceof Error ? e.message : "Payment create failed");
    } finally {
      setPaymentLoading(false);
    }
  }

  async function verifyPayment() {
    if (!paymentId.trim()) {
      setPaymentMsg("paymentId required for verification");
      return;
    }
    setPaymentLoading(true);
    setPaymentMsg(null);
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          paymentId: paymentId.trim(),
          ...(provider === "STRIPE"
            ? { sessionId: new URLSearchParams(window.location.search).get("session_id") ?? undefined }
            : { providerReference: providerReference.trim() || undefined }),
        }),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.error?.message ?? "Payment verify failed");
      setPaymentMsg(json?.data?.message ?? "Payment successful");
      await load();
    } catch (e) {
      setPaymentMsg(e instanceof Error ? e.message : "Payment verify failed");
    } finally {
      setPaymentLoading(false);
    }
  }

  const stats = useMemo(() => {
    const total = scores.length;
    const elite = scores.filter((s) => s.level >= 7).length;
    const low = scores.filter((s) => s.level <= 2).length;
    const avg = total > 0 ? Math.round(scores.reduce((sum, s) => sum + Number(s.score), 0) / total) : 0;
    return { total, elite, low, avg };
  }, [scores]);

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6">
        <div className="space-y-4">
          <section className="space-y-4">
            <section className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-[#031222]/95 to-[#020b18]/95 p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">STL Engine</p>
                  <h1 className="mt-1 text-2xl font-semibold gradient-text">EHB-STL-LEVEL · Service Trust Level</h1>
                  <p className="mt-1 text-xs text-ehb-textBody">Trust scoring and ranking across PSS, CRB, performance, behavior, and refill lifecycle.</p>
                  <p className="mt-2 text-[11px] text-ehb-textMuted">
                    Full master-plan reference (levels, access matrix, PSS/CRB/JPS links):{" "}
                    <Link href="/dmo/ehb-stl-level" className="text-cyan-300 underline-offset-2 hover:underline">
                      EHB-STL-LEVEL page
                    </Link>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/dmo/ehb-stl-level" className="ehb-btn-secondary ehb-press">
                    Reference
                  </Link>
                  <Link href="/dmo" className="ehb-btn-secondary ehb-press">Back to DMO</Link>
                  <button type="button" onClick={() => void load()} className="ehb-btn-primary ehb-press">Refresh</button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Tracked Entities</div><div className="text-2xl font-semibold">{stats.total}</div></div>
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">VIP+ (L7-L8)</div><div className="text-2xl font-semibold text-emerald-200">{stats.elite}</div></div>
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Low Trust (L1-L2)</div><div className="text-2xl font-semibold text-rose-200">{stats.low}</div></div>
              <div className="ehb-card-elevated"><div className="text-xs ehb-text-muted">Average Score</div><div className="text-2xl font-semibold text-cyan-200">{stats.avg}</div></div>
            </section>

            <StlWidget />
            <STLDashboard />

            <section className="ehb-card-elevated space-y-3">
              <div className="text-xs font-semibold">Payment System (Real Money Flow)</div>
              <div className="grid gap-2 md:grid-cols-4">
                <select value={paymentType} onChange={(e) => setPaymentType(e.target.value as "STL_UPGRADE" | "CRB_EXAM" | "DMO_REFILL" | "FRANCHISE_FEE")} className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody">
                  <option value="STL_UPGRADE">STL Upgrade</option>
                  <option value="CRB_EXAM">CRB Exam</option>
                  <option value="DMO_REFILL">DMO Refill</option>
                  <option value="FRANCHISE_FEE">Franchise Fee</option>
                </select>
                <select value={provider} onChange={(e) => setProvider(e.target.value as "EASYPAISA" | "JAZZCASH" | "STRIPE" | "PAYPAL")} className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody">
                  <option value="EASYPAISA">Easypaisa</option>
                  <option value="JAZZCASH">JazzCash</option>
                  <option value="STRIPE">Stripe</option>
                  <option value="PAYPAL">PayPal</option>
                </select>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value || 0))} className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody" placeholder="Amount" />
                <input value={paymentId} onChange={(e) => setPaymentId(e.target.value)} className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody" placeholder="paymentId (auto after create)" />
              </div>
              {provider !== "STRIPE" ? (
                <input
                  value={providerReference}
                  onChange={(e) => setProviderReference(e.target.value)}
                  className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs w-full text-ehb-textBody"
                  placeholder="Provider reference / txn id (required for verify)"
                />
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => void createPayment()} disabled={paymentLoading} className="ehb-btn-primary ehb-press disabled:opacity-60">
                  {paymentLoading ? "Processing..." : "Create Payment"}
                </button>
                <button onClick={() => void verifyPayment()} disabled={paymentLoading} className="ehb-btn-secondary ehb-press disabled:opacity-60">
                  Verify Payment
                </button>
              </div>
              <p className="text-[11px] text-ehb-textMuted">Flow: create payment → complete with provider → verify payment → STL/DMO updates + affiliate commission if referred.</p>
              {paymentMsg ? <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-2 text-xs text-emerald-100">{paymentMsg}</div> : null}
            </section>

            <section className="ehb-card-elevated space-y-3">
              <div className="text-xs font-semibold">Manual STL Calculation</div>
              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={calcEntityType}
                  onChange={(e) => setCalcEntityType(e.target.value as "USER" | "SERVICE" | "PRODUCT")}
                  className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-ehb-textBody"
                >
                  <option value="USER">USER</option>
                  <option value="SERVICE">SERVICE</option>
                  <option value="PRODUCT">PRODUCT</option>
                </select>
                <input
                  value={calcEntityId}
                  onChange={(e) => setCalcEntityId(e.target.value)}
                  className="rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs min-w-[280px] text-ehb-textBody placeholder:text-ehb-textMuted"
                  placeholder={
                    calcEntityType === "USER"
                      ? "Optional userId (leave blank = current user)"
                      : `Required ${calcEntityType.toLowerCase()} id`
                  }
                />
                <button
                  onClick={() => void runCalculate()}
                  disabled={calcRunning || (calcEntityType !== "USER" && !calcEntityId.trim())}
                  className="ehb-btn-primary ehb-press disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {calcRunning ? "Calculating..." : "Calculate STL"}
                </button>
              </div>
              <p className="text-[11px] text-ehb-textMuted">
                The STL engine now supports `USER`, `SERVICE`, and `PRODUCT` entities.
              </p>
            </section>

            <section className="ehb-card-elevated space-y-3">
              <div className="text-xs font-semibold">STL Ranking Table</div>
              {loading ? <div className="text-xs text-ehb-textMuted">Loading STL scores...</div> : null}
              {error ? <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-xs text-rose-100">{error}</div> : null}
              <div className="overflow-auto rounded-xl border border-white/10">
                <table className="min-w-full text-xs">
                  <thead className="bg-white/5 text-ehb-textBody">
                    <tr>
                      <th className="px-3 py-2 text-left">Entity</th>
                      <th className="px-3 py-2 text-left">Score</th>
                      <th className="px-3 py-2 text-left">Level</th>
                      <th className="px-3 py-2 text-left">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((s) => (
                      <tr key={s.id} className="border-t border-white/10">
                        <td className="px-3 py-2">
                          <div className="font-semibold">{s.entityId}</div>
                          <div className="text-[11px] text-ehb-textMuted">{s.entityType}</div>
                        </td>
                        <td className="px-3 py-2">{Number(s.score).toFixed(2)}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex rounded-full border px-2 py-0.5 ${levelTone(s.level)}`}>L{s.level}</span>
                        </td>
                        <td className="px-3 py-2 text-ehb-textMuted">{fmt(s.lastUpdated)}</td>
                      </tr>
                    ))}
                    {!loading && scores.length === 0 ? (
                      <tr><td className="px-3 py-8 text-center text-ehb-textMuted" colSpan={4}>No STL scores found.</td></tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="ehb-card-elevated space-y-3">
              <div className="text-xs font-semibold">STL History</div>
              <div className="overflow-auto rounded-xl border border-white/10">
                <table className="min-w-full text-xs">
                  <thead className="bg-white/5 text-ehb-textBody">
                    <tr>
                      <th className="px-3 py-2 text-left">Entity</th>
                      <th className="px-3 py-2 text-left">Change</th>
                      <th className="px-3 py-2 text-left">Reason</th>
                      <th className="px-3 py-2 text-left">At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((l) => (
                      <tr key={l.id} className="border-t border-white/10">
                        <td className="px-3 py-2">
                          <div className="font-semibold">{l.entityId}</div>
                          <div className="text-[11px] text-ehb-textMuted">{l.entityType}</div>
                        </td>
                        <td className={`px-3 py-2 ${Number(l.change) >= 0 ? "text-emerald-200" : "text-rose-200"}`}>
                          {Number(l.change) >= 0 ? "+" : ""}
                          {Number(l.change).toFixed(2)}
                        </td>
                        <td className="px-3 py-2">{l.reason}</td>
                        <td className="px-3 py-2 text-ehb-textMuted">{fmt(l.createdAt)}</td>
                      </tr>
                    ))}
                    {!loading && logs.length === 0 ? (
                      <tr><td className="px-3 py-8 text-center text-ehb-textMuted" colSpan={4}>No STL history entries.</td></tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

