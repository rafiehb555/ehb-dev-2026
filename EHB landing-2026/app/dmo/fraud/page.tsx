"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

type RiskTier = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface FraudEntry {
  entityId:   string;
  entityType: string;
  score:      number;
  tier:       RiskTier;
  autoBlock:  boolean;
  signals:    { type: string; weight: number; count: number }[];
}

interface FraudAnalytics {
  unresolvedCount: number;
  falsePositiveCount: number;
  penaltiesIssued: number;
  signalsPerDay: { day: string; count: number }[];
  riskDistribution: Record<RiskTier, number>;
  topFlagged: { entityId: string; entityType: string; count: number }[];
}

const TIER_STYLES: Record<RiskTier, { badge: string; row: string; icon: string }> = {
  CRITICAL: { badge: "bg-red-600/20 text-red-300 border-red-500/40",    row: "border-red-500/30 bg-red-950/10",    icon: "🚨" },
  HIGH:     { badge: "bg-orange-600/20 text-orange-300 border-orange-500/40", row: "border-orange-500/30 bg-orange-950/10", icon: "⚠️" },
  MEDIUM:   { badge: "bg-yellow-600/20 text-yellow-300 border-yellow-500/40", row: "border-yellow-500/30 bg-yellow-950/10", icon: "🔔" },
  LOW:      { badge: "bg-green-600/20 text-green-300 border-green-500/40",    row: "border-green-500/30 bg-green-950/10",   icon: "✅" },
};

const SIGNAL_LABELS: Record<string, string> = {
  FAILED_VERIFICATION:  "Failed Verification",
  RAPID_SUBMISSION:     "Rapid Submission",
  LOCATION_MISMATCH:    "Location Mismatch",
  INCOMPLETE_PROFILE:   "Incomplete Profile",
  LOW_CRB_BADGE:        "Low CRB Badge",
  MULTIPLE_ACCOUNTS:    "Multiple Accounts",
  SUSPICIOUS_ACTIVITY:  "Suspicious Activity",
  FAKE_REVIEW:          "Fake Review",
  COMPLAINT_RECEIVED:   "Complaint Received",
};

export default function DmoFraudPage() {
  const [queue, setQueue]         = useState<FraudEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filterTier, setFilter]   = useState<RiskTier | "ALL">("ALL");
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [resolving, setResolving] = useState<string | null>(null);
  const [blocking, setBlocking]   = useState<string | null>(null);
  const [stats, setStats]         = useState({ critical: 0, high: 0, medium: 0, low: 0 });
  const [analytics, setAnalytics] = useState<FraudAnalytics | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [queueRes, analyticsRes] = await Promise.all([
        fetch("/api/fraud/queue?limit=100"),
        fetch("/api/fraud/analytics"),
      ]);
      const [queueJson, analyticsJson] = await Promise.all([queueRes.json(), analyticsRes.json()]);
      if (queueJson.success) {
        const items: FraudEntry[] = queueJson.data.queue;
        setQueue(items);
        setStats({
          critical: items.filter((i) => i.tier === "CRITICAL").length,
          high:     items.filter((i) => i.tier === "HIGH").length,
          medium:   items.filter((i) => i.tier === "MEDIUM").length,
          low:      items.filter((i) => i.tier === "LOW").length,
        });
      }
      if (analyticsJson.success) setAnalytics(analyticsJson.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleResolve(entityId: string) {
    setResolving(entityId);
    await fetch("/api/fraud/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityId }),
    });
    await load();
    setResolving(null);
  }

  async function handleBlock(entry: FraudEntry) {
    setBlocking(entry.entityId);
    await fetch("/api/fraud/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityId: entry.entityId,
        entityType: entry.entityType,
        reason: `Blocked from DMO fraud queue at ${entry.score}/100`,
      }),
    });
    await load();
    setBlocking(null);
  }

  function getProfileHref(entry: FraudEntry) {
    if (entry.entityType === "APPLICATION") return `/dmo/applications?search=${entry.entityId}`;
    if (entry.entityType === "ORDER") return "/orders";
    return "/dmo/queue";
  }

  const filtered = filterTier === "ALL" ? queue : queue.filter((e) => e.tier === filterTier);

  return (
    <main className="min-h-screen bg-[#05050f] text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🛡️</span>
          <h1 className="text-2xl font-black">AI Fraud Detection Queue</h1>
        </div>
        <p className="text-white/40 text-sm">Real-time fraud signals and risk scores — AI-powered triage</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as RiskTier[]).map((tier) => {
          const s   = TIER_STYLES[tier];
          const cnt = stats[tier.toLowerCase() as keyof typeof stats];
          return (
            <button
              key={tier}
              onClick={() => setFilter(filterTier === tier ? "ALL" : tier)}
              className={`rounded-xl border p-4 text-left transition-all hover:scale-[1.02] ${s.row} ${filterTier === tier ? "ring-2 ring-white/20" : ""}`}
            >
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black text-white">{cnt}</div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded-full border inline-block mt-1 ${s.badge}`}>{tier}</div>
            </button>
          );
        })}
      </div>

      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Unresolved</p>
            <p className="text-2xl font-black text-white">{analytics.unresolvedCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">False Positives</p>
            <p className="text-2xl font-black text-white">{analytics.falsePositiveCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Penalties (7d)</p>
            <p className="text-2xl font-black text-white">{analytics.penaltiesIssued}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Top Flagged</p>
            <p className="text-sm text-white/70 line-clamp-2">
              {analytics.topFlagged[0]
                ? `${analytics.topFlagged[0].entityType} ${analytics.topFlagged[0].entityId.slice(0, 10)}...`
                : "No entities yet"}
            </p>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              filterTier === t
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-white/5 border-white/10 text-white/50 hover:text-white"
            }`}
          >
            {t === "ALL" ? `All (${queue.length})` : `${t} (${stats[t.toLowerCase() as keyof typeof stats]})`}
          </button>
        ))}
        <button
          onClick={load}
          className="ml-auto px-4 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Queue */}
      {loading ? (
        <div className="text-center py-20 text-white/30">
          <div className="text-4xl mb-3 animate-pulse">🔍</div>
          <p>Scanning fraud signals...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <div className="text-4xl mb-3">✅</div>
          <p>No fraud signals in this tier</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const s    = TIER_STYLES[entry.tier];
            const isEx = expanded === entry.entityId;
            return (
              <div key={entry.entityId} className={`rounded-2xl border ${s.row} overflow-hidden`}>
                {/* Row header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-all"
                  onClick={() => setExpanded(isEx ? null : entry.entityId)}
                >
                  <div className="text-2xl">{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-white/70 text-sm truncate">{entry.entityId}</span>
                      <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{entry.entityType}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${s.badge}`}>{entry.tier}</span>
                      <span className="text-white/40 text-xs">{entry.signals.length} signal{entry.signals.length !== 1 ? "s" : ""}</span>
                      {entry.autoBlock && (
                        <span className="text-xs text-red-400 font-bold">⛔ Auto-blocked</span>
                      )}
                    </div>
                  </div>

                  {/* Score gauge */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl font-black text-white">{entry.score}</div>
                    <div className="text-xs text-white/30">/ 100</div>
                    <div className="w-20 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          entry.tier === "CRITICAL" ? "bg-red-500" :
                          entry.tier === "HIGH" ? "bg-orange-500" :
                          entry.tier === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${entry.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-white/30 text-sm ml-2">{isEx ? "▲" : "▼"}</div>
                </div>

                {/* Expanded detail */}
                {isEx && (
                  <div className="border-t border-white/5 p-4 bg-black/20">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Signal Breakdown</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {entry.signals.map((sig) => (
                        <div key={sig.type} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                          <span className="text-sm text-white/70">{SIGNAL_LABELS[sig.type] ?? sig.type}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40">×{sig.count}</span>
                            <span className="text-xs font-bold text-white/60">+{sig.weight * sig.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleResolve(entry.entityId)}
                        disabled={resolving === entry.entityId}
                        className="px-4 py-2 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-300 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
                      >
                        {resolving === entry.entityId ? "Clearing..." : "✅ Clear Signals"}
                      </button>
                      <button
                        onClick={() => handleBlock(entry)}
                        disabled={blocking === entry.entityId}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
                      >
                        {blocking === entry.entityId ? "Blocking..." : "🚫 Block Entity"}
                      </button>
                      <Link
                        href={getProfileHref(entry)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-sm font-semibold rounded-xl transition-all"
                      >
                        📋 View Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
