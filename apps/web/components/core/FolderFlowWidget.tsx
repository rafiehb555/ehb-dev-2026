"use client";

import { useEffect, useState } from "react";

type Metric = {
  key: string;
  label: string;
  percent: number;
  status: "ok" | "warn" | "critical";
  detail: string;
};

type FlowData = {
  overall: number;
  generatedAt: string;
  metrics: Metric[];
};

const STATUS_COLOR: Record<Metric["status"], string> = {
  ok: "#22B14C",
  warn: "#F0A030",
  critical: "#F05858",
};

const STATUS_BG: Record<Metric["status"], string> = {
  ok: "rgba(34,177,76,0.14)",
  warn: "rgba(240,160,48,0.14)",
  critical: "rgba(240,88,88,0.14)",
};

/**
 * Real-time folder-flow dashboard widget. Polls /api/folder-flow every 15s.
 * Renders 9 project-health metrics + overall score.
 */
export function FolderFlowWidget() {
  const [data, setData] = useState<FlowData | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/folder-flow", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled && json.success) setData(json.data);
      } catch (e) {
        if (!cancelled) setErr(String(e));
      }
    };
    load();
    const id = setInterval(load, 15_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (err) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        Folder-flow widget error: {err}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
        Loading folder-flow metrics…
      </div>
    );
  }

  const overallColor =
    data.overall >= 80 ? "#22B14C" : data.overall >= 50 ? "#F0A030" : "#F05858";

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#13162A] to-[#0C0E1A] p-5 space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">
            Project Folder Flow — Live
          </p>
          <h2 className="text-xl font-semibold text-white">Hybrid Architecture Health</h2>
          <p className="text-[11px] text-white/40 mt-1">
            Auto-refresh every 15s · Updated {new Date(data.generatedAt).toLocaleTimeString()}
          </p>
        </div>
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 border"
          style={{
            borderColor: `${overallColor}55`,
            background: `${overallColor}15`,
            boxShadow: `0 0 32px ${overallColor}22`,
          }}
        >
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-white/50">Overall</p>
            <p
              className="text-3xl font-bold tabular-nums"
              style={{ color: overallColor }}
            >
              {data.overall}%
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.metrics.map((m) => {
          const color = STATUS_COLOR[m.status];
          const bg = STATUS_BG[m.status];
          return (
            <div
              key={m.key}
              className="rounded-2xl p-3 space-y-2 border"
              style={{ borderColor: `${color}33`, background: bg }}
            >
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-white">{m.label}</p>
                <span
                  className="text-[11px] font-bold tabular-nums"
                  style={{ color }}
                >
                  {m.percent}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${m.percent}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                    boxShadow: `0 0 10px ${color}88`,
                  }}
                />
              </div>
              <p className="text-[10px] text-white/50">{m.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
