"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { stlLevelChipClasses } from "@/lib/stl/chipTone";

type StlBreakdown = {
  total: number;
  level: number;
  label: string;
};

type ApiOk = { success: true; data: { breakdown: StlBreakdown } };
type ApiErr = { success: false; error: { message: string } };

/** Compact EHB-STL-LEVEL chip for profile surfaces; uses `GET /api/stl/me`. */
export function ProfileStlBadge() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<StlBreakdown | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/stl/me", { cache: "no-store" });
        const json = (await res.json()) as ApiOk | ApiErr;
        if (!res.ok) {
          if (res.status === 401) {
            setError("auth");
            return;
          }
          throw new Error(!json.success ? json.error.message : `HTTP ${res.status}`);
        }
        if (!json.success) throw new Error(json.error.message);
        if (!alive) return;
        setBreakdown(json.data.breakdown);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "STL load failed");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-ehb-textMuted animate-pulse"
        aria-busy="true"
      >
        EHB-STL-LEVEL…
      </div>
    );
  }

  if (error === "auth") {
    return (
      <p className="text-[11px] text-ehb-textMuted">
        <span className="text-ehb-textBody">EHB-STL-LEVEL:</span> sign in to load your trust score.{" "}
        <Link href="/dashboard" className="text-cyan-300 underline-offset-2 hover:underline">
          Dashboard
        </Link>
      </p>
    );
  }

  if (error || !breakdown) {
    return (
      <p className="text-[11px] text-rose-200/90" title={error ?? undefined}>
        EHB-STL-LEVEL unavailable{error ? ` (${error})` : ""}.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${stlLevelChipClasses(breakdown.level)}`}
        title={`${breakdown.label} — ${breakdown.total.toFixed(1)} / 100`}
      >
        <span className="uppercase tracking-wide text-[10px] text-ehb-textMuted">EHB-STL-LEVEL</span>
        <span className="text-white">L{breakdown.level}</span>
        <span className="text-ehb-textBody">{breakdown.total.toFixed(1)}</span>
      </span>
      <Link href="/dmo/ehb-stl-level" className="text-[11px] text-cyan-300/90 underline-offset-2 hover:underline">
        What is this?
      </Link>
    </div>
  );
}
