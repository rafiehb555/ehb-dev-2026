"use client";

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  GoSellr — Seller Journey Tracker
 *  Premium 7-step visual flow, powered by GET /api/gosellr/flow.
 *
 *    1. Register        → account created
 *    2. PSS             → identity verified (4 phases)
 *    3. CRB             → certification cleared
 *    4. DMO Approval    → store onboarding reviewed
 *    5. Franchise       → territory assigned
 *    6. STL             → trust level computed
 *    7. Live on GoSellr → can publish products
 * ═══════════════════════════════════════════════════════════════════════
 */

import { useEffect, useState } from "react";
import Link from "next/link";

type StepStatus = "not_started" | "in_progress" | "approved" | "rejected";
interface Step {
  key: string;
  title: string;
  status: StepStatus;
  detail: string;
  link?: string;
}
interface FlowResponse {
  userId: string;
  progress: number;
  completed: number;
  total: number;
  steps: Step[];
  summary: Record<string, boolean>;
}

const STEP_ICONS: Record<string, string> = {
  REGISTER: "👤",
  PSS: "🛡️",
  CRB: "📜",
  DMO_APPROVAL: "🏛️",
  FRANCHISE: "🌐",
  STL: "⭐",
  ACTIVE: "🚀",
};

const STATUS_TOKENS: Record<StepStatus, { color: string; label: string; bg: string }> = {
  approved:    { color: "#22B14C", label: "Approved",    bg: "rgba(34,177,76,0.15)" },
  in_progress: { color: "#F59E0B", label: "In Progress", bg: "rgba(245,158,11,0.15)" },
  rejected:    { color: "#E53935", label: "Rejected",    bg: "rgba(229,57,53,0.15)" },
  not_started: { color: "rgba(255,255,255,0.5)", label: "Pending", bg: "rgba(255,255,255,0.04)" },
};

export function GoSellrUserFlow() {
  const [data, setData] = useState<FlowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gosellr/flow", { cache: "no-store" });
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json?.error?.message ?? "Failed to load");
    } catch (e: any) {
      setError(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  if (loading && !data) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#13162A] p-10 text-center text-white/50">
        Loading your GoSellr journey…
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
        {error ?? "No data"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(41,171,226,0.1) 0%, rgba(19,22,42,0.95) 50%, rgba(123,110,246,0.1) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-30 blur-3xl"
          style={{ background: "#29ABE2" }}
        />
        <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
              GoSellr Seller Journey
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white">
              {data.completed === data.total ? "You're live on GoSellr 🚀" : `Step ${data.completed + 1} of ${data.total}`}
            </h2>
            <p className="mt-1 text-sm text-white/55">
              {data.completed === data.total
                ? "All gates passed — you can publish products across 32 industries."
                : "Complete each gate below to activate your seller account."}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-4xl font-bold" style={{ color: data.progress === 100 ? "#22B14C" : "#29ABE2" }}>
              {data.progress}%
            </div>
            <div className="text-[11px] uppercase tracking-wider text-white/40">
              {data.completed}/{data.total} completed
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${data.progress}%`,
              background: "linear-gradient(90deg, #29ABE2 0%, #7B6EF6 50%, #22B14C 100%)",
              boxShadow: "0 0 14px rgba(41,171,226,0.5)",
            }}
          />
        </div>
      </div>

      {/* ── STEPS ────────────────────────────────────────────────── */}
      <div className="grid gap-3">
        {data.steps.map((s, i) => {
          const tok = STATUS_TOKENS[s.status];
          const isActive = s.status === "in_progress";
          const isLast = i === data.steps.length - 1;
          return (
            <div key={s.key} className="relative">
              {/* vertical connector */}
              {!isLast && (
                <div
                  aria-hidden
                  className="absolute left-7 top-[58px] h-[calc(100%+12px)] w-px"
                  style={{ background: s.status === "approved" ? "#22B14C" : "rgba(255,255,255,0.08)" }}
                />
              )}
              <div
                className="relative flex items-center gap-4 overflow-hidden rounded-xl p-4 transition-all hover:-translate-y-0.5"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(19,22,42,0.9) 100%)"
                    : "rgba(19,22,42,0.85)",
                  border: `1px solid ${
                    s.status === "approved" ? "rgba(34,177,76,0.3)" :
                    isActive ? "rgba(245,158,11,0.4)" :
                    s.status === "rejected" ? "rgba(229,57,53,0.4)" :
                    "rgba(255,255,255,0.06)"
                  }`,
                  boxShadow: isActive ? "0 0 20px rgba(245,158,11,0.15)" : "none",
                }}
              >
                {/* Icon badge */}
                <div
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl"
                  style={{
                    background: tok.bg,
                    border: `2px solid ${tok.color}`,
                    boxShadow: s.status === "approved" ? `0 0 12px ${tok.color}55` : "none",
                  }}
                >
                  {s.status === "approved" ? "✓" : STEP_ICONS[s.key] ?? "•"}
                </div>
                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/35">
                      Step {i + 1}
                    </span>
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ background: tok.bg, color: tok.color, border: `1px solid ${tok.color}55` }}
                    >
                      {tok.label}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[15px] font-semibold text-white">{s.title}</div>
                  <div className="mt-0.5 truncate text-[12px] text-white/50">{s.detail}</div>
                </div>
                {/* Action */}
                {s.link && s.status !== "approved" && (
                  <Link
                    href={s.link}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg, #29ABE2 0%, #7B6EF6 100%)",
                      boxShadow: "0 4px 12px rgba(41,171,226,0.3)",
                    }}
                  >
                    {s.status === "in_progress" ? "Continue →" : "Start →"}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SUMMARY ──────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(19,22,42,0.85)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/45">
          Quick Summary
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <SummaryChip label="PSS"        ok={data.summary.pssVerified} />
          <SummaryChip label="CRB"        ok={data.summary.crbCertified} />
          <SummaryChip label="DMO"        ok={data.summary.dmoApproved} />
          <SummaryChip label="Franchise"  ok={data.summary.franchiseAssigned} />
          <SummaryChip label="STL"        ok={data.summary.stlActive} />
          <SummaryChip label="Live"       ok={data.summary.sellerLive} />
        </div>
      </div>
    </div>
  );
}

function SummaryChip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-3 py-2"
      style={{
        background: ok ? "rgba(34,177,76,0.1)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${ok ? "rgba(34,177,76,0.3)" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <span className="text-[12px] font-semibold text-white/80">{label}</span>
      <span className="text-sm font-bold" style={{ color: ok ? "#22B14C" : "rgba(255,255,255,0.3)" }}>
        {ok ? "✓" : "○"}
      </span>
    </div>
  );
}

export default GoSellrUserFlow;
