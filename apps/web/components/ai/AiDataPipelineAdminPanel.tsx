"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KpiCard } from "@/components/ui/KpiCard";

type StageStatus = "Idle" | "Running" | "Completed" | "Error";

type PipelineStage = {
  key: string;
  title: string;
  description: string;
  status: StageStatus;
  lastRun: string;
  nextRun: string;
};

function nowLabel() {
  return new Date().toLocaleString();
}

export function AiDataPipelineAdminPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState("");
  const timerRef = useRef<number | null>(null);

  const [stages, setStages] = useState<PipelineStage[]>([
    {
      key: "ingestion",
      title: "Ingestion",
      description: "Collect users, orders, services, products, jobs, locations (mock).",
      status: "Idle",
      lastRun: "2026-03-19 08:12",
      nextRun: "Hourly",
    },
    {
      key: "storage",
      title: "Storage",
      description: "Persist normalized events to DB (mock).",
      status: "Idle",
      lastRun: "2026-03-19 08:12",
      nextRun: "Hourly",
    },
    {
      key: "scoring",
      title: "AI Scoring",
      description: "Batch compute recommendations/risk/location insights (mock).",
      status: "Idle",
      lastRun: "2026-03-19 08:12",
      nextRun: "Hourly",
    },
    {
      key: "publish",
      title: "Insights Publish",
      description: "Write ai_insights + caches for fast frontend reads (mock).",
      status: "Idle",
      lastRun: "2026-03-19 08:12",
      nextRun: "Hourly",
    },
  ]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const kpis = useMemo(() => {
    const total = stages.length;
    const running = stages.filter((s) => s.status === "Running").length;
    const completed = stages.filter((s) => s.status === "Completed").length;
    return { total, running, completed };
  }, [stages]);

  const runNow = () => {
    if (isRunning) return;
    setIsRunning(true);
    setMessage("");

    setStages((prev) =>
      prev.map((s) => ({
        ...s,
        status: "Running" as StageStatus,
      })),
    );

    timerRef.current = window.setTimeout(() => {
      setStages((prev) =>
        prev.map((s) => ({
          ...s,
          status: "Completed" as StageStatus,
          lastRun: nowLabel(),
        })),
      );
      setIsRunning(false);
      setMessage(`Pipeline run completed at ${nowLabel()} (mock).`);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Pipeline Health" value={isRunning ? "Running" : "Healthy"} detail="Batch job simulation (mock)" />
        <KpiCard label="Stages" value={kpis.total} detail={`Running: ${kpis.running}`} />
        <KpiCard label="Last Completion" value={stages[stages.length - 1]?.lastRun ?? "—"} detail="Insights publish timestamp" />
        <KpiCard label="Next Run" value="Hourly" detail="Later: schedule via queue/worker (mock)" />
      </section>

      <section className="glass-panel card-hover p-4 space-y-3 border border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-white">AI Data Pipeline (Phase 85)</h2>
            <p className="text-[10px] text-ehb-textMuted">
              Continuous clean data for AI: ingestion → storage → scoring → insights publish. (UI mock)
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="min-h-touch inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#33C3FF] to-[#6366f1] px-4 py-2 text-[11px] font-semibold text-slate-950 btn-glow hover:opacity-95 transition-all"
              onClick={runNow}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Run pipeline now"}
            </button>
          </div>
        </div>

        {message ? (
          <div className="rounded-xl glass-panel border border-white/10 p-3 text-[10px] text-ehb-textBody">{message}</div>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {stages.map((s) => (
          <div key={s.key} className="rounded-2xl glass-card border p-5 card-hover">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{s.title}</p>
                <p className="text-[11px] text-ehb-textMuted mt-1 leading-relaxed">{s.description}</p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] border ${
                  s.status === "Running"
                    ? "bg-blue-500/15 border-blue-500/30 text-blue-200"
                    : s.status === "Completed"
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-200"
                      : s.status === "Error"
                        ? "bg-rose-500/15 border-rose-500/30 text-rose-200"
                        : "bg-white/5 border-white/10 text-ehb-textBody"
                }`}
              >
                {s.status}
              </span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="glass-panel rounded-xl border border-white/10 p-2">
                <div className="text-[10px] text-ehb-textMuted">Last run</div>
                <div className="text-[11px] text-white font-semibold truncate">{s.lastRun}</div>
              </div>
              <div className="glass-panel rounded-xl border border-white/10 p-2">
                <div className="text-[10px] text-ehb-textMuted">Next run</div>
                <div className="text-[11px] text-white font-semibold truncate">{s.nextRun}</div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

