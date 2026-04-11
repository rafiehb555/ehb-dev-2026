"use client";

import { Check, Circle } from "lucide-react";
import type { StlVerificationStepDef } from "@/lib/dmo/stlDashboardDemo";

type Props = {
  steps?: StlVerificationStepDef[];
};

export function StlVerificationStepper({ steps = [] }: Props) {
  if (steps.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md sm:p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/90">Ongoing verification</p>
        <p className="mt-1 text-xs text-ehb-textBody">Waiting for live verification data...</p>
      </section>
    );
  }
  return (
    <section
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-md sm:p-4"
      aria-label="Verification pipeline"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/90">Ongoing verification</p>
      <p className="mt-1 text-xs text-ehb-textBody">Horizontal stepper — same structure as franchise & DMO approval UIs.</p>
      <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, i) => (
          <li key={step.id} className="min-w-0">
            <div className="flex h-full flex-col rounded-lg border border-white/10 bg-black/25 p-2.5">
              <div className="flex items-start gap-2">
                {step.status === "complete" ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-300">
                    <Check className="h-4 w-4" aria-hidden />
                  </span>
                ) : step.status === "current" ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-amber-400/60 bg-amber-500/15 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.25)]">
                    <Circle className="h-4 w-4 fill-current" aria-hidden />
                  </span>
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-ehb-textMuted">
                    <span className="text-[11px] font-mono">{i + 1}</span>
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-white">{step.title}</p>
                  {step.detail ? (
                    <p className="mt-0.5 text-[11px] text-ehb-textMuted leading-snug">{step.detail}</p>
                  ) : null}
                </div>
              </div>
              {step.status === "current" ? (
                <button
                  type="button"
                  className="mt-2 w-full rounded-lg border border-amber-400/35 bg-amber-500/10 py-1 text-[10px] font-medium text-amber-100 transition hover:bg-amber-500/20"
                >
                  Reveal trust score
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
