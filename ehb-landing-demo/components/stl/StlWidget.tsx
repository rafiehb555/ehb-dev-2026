"use client";

import { useEffect, useMemo, useState } from "react";

type StlBreakdown = {
  pss: number;
  crb: number;
  performance: number;
  behavior: number;
  industries: number;
  refilling: number;
  total: number;
  level: number;
  label: string;
};

type ApiResp =
  | { success: true; data: { breakdown: StlBreakdown } }
  | { success: false; error: { message: string } };

function toneForLevel(level: number) {
  if (level >= 5) return "border-emerald-400/40 text-emerald-100";
  if (level === 4) return "border-sky-400/40 text-sky-100";
  if (level === 3) return "border-violet-400/40 text-violet-100";
  if (level === 2) return "border-amber-400/40 text-amber-100";
  return "border-rose-400/40 text-rose-100";
}

function Bar({
  label,
  value,
  min,
  max,
  tone,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  tone: string;
}) {
  const range = Math.max(1, max - min);
  const pct = Math.max(0, Math.min(100, ((value - min) / range) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>{label}</span>
        <span className="text-slate-200 font-semibold">{value}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function StlWidget() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StlBreakdown | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/stl/me", { cache: "no-store" });
        const json = (await res.json()) as ApiResp;
        if (!res.ok) throw new Error(!json.success ? json.error.message : `Request failed: ${res.status}`);
        if (!json.success) throw new Error(json.error.message);
        if (!alive) return;
        setData(json.data.breakdown);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load STL");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const tone = useMemo(() => toneForLevel(data?.level ?? 1), [data?.level]);

  return (
    <section className="glass-panel border border-white/10 rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-1">Trust</p>
          <h2 className="text-lg md:text-xl font-semibold text-white">STL Score</h2>
          <p className="text-[11px] text-slate-400 mt-1">Your live trust ranking across the marketplace.</p>
        </div>
        <div className={`rounded-2xl glass-panel border px-4 py-3 ${tone}`}>
          <div className="text-[11px] uppercase tracking-[0.22em] text-slate-300">Level</div>
          <div className="text-lg font-semibold text-white">L{data?.level ?? "—"}</div>
          <div className="text-[11px] text-slate-200">{data?.label ?? "—"}</div>
        </div>
      </div>

      {loading ? (
        <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4 text-slate-300">
          Loading STL…
        </div>
      ) : error ? (
        <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-400/30 p-4 text-rose-100">
          {error}
        </div>
      ) : data ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Total</div>
            <div className="text-3xl font-semibold text-white mt-1">{data.total}</div>
            <div className="text-[11px] text-slate-400 mt-1">0 → 100 trust power</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
            <Bar label="PSS (0–40)" value={data.pss} min={0} max={40} tone="bg-cyan-400" />
            <Bar label="CRB (0–20)" value={data.crb} min={0} max={20} tone="bg-sky-400" />
            <Bar label="Performance (0–20)" value={data.performance} min={0} max={20} tone="bg-violet-400" />
            <Bar label="Behavior (-50..20)" value={data.behavior} min={-50} max={20} tone="bg-amber-400" />
            <Bar label="Industries (0–20)" value={data.industries} min={0} max={20} tone="bg-fuchsia-400" />
            <Bar label="Refilling (-40..10)" value={data.refilling} min={-40} max={10} tone="bg-emerald-400" />
          </div>
        </div>
      ) : null}
    </section>
  );
}

