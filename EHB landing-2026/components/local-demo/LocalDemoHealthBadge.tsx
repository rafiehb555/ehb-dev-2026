"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Loader2 } from "lucide-react";

type HealthJson = {
  ok: boolean;
  service: string;
  liveness?: boolean;
  timestamp?: string;
  uptimeSec?: number;
  db?: { ok: boolean; latencyMs: number; error?: string } | { skipped: boolean };
  gitSha?: string;
};

export function LocalDemoHealthBadge() {
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ok"; res: Response; json: HealthJson }
  >({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        const json = (await res.json().catch(() => null)) as HealthJson | null;
        if (cancelled) return;
        if (!json || typeof json.ok !== "boolean") {
          setState({ status: "error", message: "Invalid health response" });
          return;
        }
        setState({ status: "ok", res, json });
      } catch (e) {
        if (cancelled) return;
        setState({ status: "error", message: e instanceof Error ? e.message : "Request failed" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-ehb-textMuted">
        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden />
        <span>Checking /api/health…</span>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-xl border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
        <span className="font-medium">Health check failed:</span> {state.message}
        <div className="mt-1">
          <Link href="/api/health" className="text-cyan-200/90 underline-offset-2 hover:underline">
            Open /api/health
          </Link>
        </div>
      </div>
    );
  }

  const { res, json } = state;
  const db = json.db;
  const dbSkipped = db && "skipped" in db && db.skipped === true;
  const apiOk = res.ok && json.ok;
  const dbOk = dbSkipped ? true : Boolean(db && "ok" in db && db.ok);

  return (
    <div
      className={`rounded-xl border px-3 py-2 text-xs ${
        apiOk && dbOk
          ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
          : "border-amber-400/35 bg-amber-500/10 text-amber-100"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Activity className="h-3.5 w-3.5 shrink-0" aria-hidden />
          API {apiOk ? "up" : "degraded"} ({res.status})
        </span>
        {dbSkipped ? (
          <span>DB probe skipped (use full /api/health for DB)</span>
        ) : db ? (
          <span>
            DB {dbOk ? "ok" : "down"}
            {"latencyMs" in db && typeof db.latencyMs === "number" ? ` · ${db.latencyMs}ms` : ""}
          </span>
        ) : (
          <span>DB: unknown</span>
        )}
        {json.gitSha ? <span className="text-white/70">sha {json.gitSha}</span> : null}
        {json.timestamp ? (
          <span className="text-white/60" title={json.timestamp}>
            {new Date(json.timestamp).toLocaleString()} · up {json.uptimeSec ?? "—"}s
          </span>
        ) : null}
      </div>
      {!dbSkipped && !dbOk && db && "error" in db && db.error ? (
        <p className="mt-1 text-[11px] text-white/80">{db.error}</p>
      ) : null}
      <div className="mt-1.5">
        <Link href="/api/health" className="text-cyan-200/90 underline-offset-2 hover:underline">
          Raw JSON
        </Link>
      </div>
    </div>
  );
}
