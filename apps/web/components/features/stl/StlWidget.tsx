"use client";

import { useEffect, useState } from "react";
import { stlLevelChipClasses } from "@/lib/stl/chipTone";
import { StlLiveDataBadge } from "@/components/features/stl/StlLiveDataBadge";
import { STL_BAR_CONFIG } from "@/lib/stl/stlBars";
import type { StlBreakdown } from "@/lib/stl/engine";
import type { StlFullSnapshot } from "@/lib/stl/fullSnapshot";

type ApiOk = { success: true; data: StlFullSnapshot };

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
      <div className="flex items-center justify-between text-[11px] text-ehb-textMuted">
        <span>{label}</span>
        <span className="text-ehb-textBody font-semibold">{value}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const TONES = ["bg-cyan-400", "bg-sky-400", "bg-violet-400", "bg-fuchsia-400", "bg-amber-400"];

export function StlWidget() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<StlFullSnapshot | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/stl/full-snapshot", { cache: "no-store" });
        const json = (await res.json()) as ApiOk | { success: false; error: { message: string } };
        if (!res.ok || !("success" in json) || json.success === false) {
          throw new Error("success" in json && !json.success ? json.error.message : `HTTP ${res.status}`);
        }
        if (!alive) return;
        setSnapshot(json.data);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load STL");
        setSnapshot(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const breakdown = snapshot?.breakdown as StlBreakdown | null | undefined;
  const live = snapshot?.dataSource === "live";

  return (
    <section className="glass-panel border border-white/10 rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90 mb-1">EHB-STL-LEVEL</p>
          <h2 className="text-lg md:text-xl font-semibold text-white">Service Trust Level</h2>
          <p className="text-[11px] text-ehb-textMuted mt-1">Unified snapshot — same engine as DMO dashboard.</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StlLiveDataBadge mode={live ? "live" : "demo"} />
          <div className={`rounded-2xl glass-panel border px-4 py-3 ${stlLevelChipClasses(snapshot?.stlLevel ?? 1)}`}>
            <div className="text-[11px] uppercase tracking-[0.22em] text-ehb-textBody">Level</div>
            <div className="text-lg font-semibold text-white">L{snapshot?.stlLevel ?? "—"}</div>
            <div className="text-[11px] text-ehb-textBody">{snapshot?.levelName ?? "—"}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4 text-ehb-textBody">Loading STL…</div>
      ) : error ? (
        <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-400/30 p-4 text-rose-100">{error}</div>
      ) : snapshot && breakdown ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-ehb-textMuted">Total</div>
            <div className="text-3xl font-semibold text-white mt-1">{snapshot.trustScore}</div>
            <div className="text-[11px] text-ehb-textMuted mt-1">0 → 100 · Next: {snapshot.nextLevelName ?? "—"}</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
            {STL_BAR_CONFIG.map((row, i) => (
              <Bar
                key={row.key}
                label={`${row.label} (${row.min}–${row.max})`}
                value={breakdown[row.key]}
                min={row.min}
                max={row.max}
                tone={TONES[i] ?? "bg-slate-400"}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
