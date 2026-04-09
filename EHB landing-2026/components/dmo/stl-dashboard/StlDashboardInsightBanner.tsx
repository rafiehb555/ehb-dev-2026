"use client";

import { AlertTriangle, Bot, CheckCircle2, Crown, Sparkles, XCircle } from "lucide-react";
import type { StlDashboardDemo } from "@/lib/dmo/stlDashboardDemo";

type Props = {
  data: StlDashboardDemo;
  upgradeBlocked: boolean;
  modelScore: number;
  supremePending?: boolean;
  complaintNearLimit?: boolean;
};

function pssRiskLabel(open: number, max: number): { label: string; tone: "emerald" | "amber" | "rose" } {
  const ratio = max > 0 ? open / max : 0;
  if (ratio >= 0.75) return { label: "Risk: High", tone: "rose" };
  if (ratio >= 0.35) return { label: "Risk: Medium", tone: "amber" };
  return { label: "Risk: Low", tone: "emerald" };
}

export function StlDashboardInsightBanner({
  data: d,
  upgradeBlocked,
  modelScore,
  supremePending,
  complaintNearLimit,
}: Props) {
  const risk = pssRiskLabel(d.pss.complaintsOpen, d.pss.complaintsMax);
  const remaining = d.pss.complaintsMax - d.pss.complaintsOpen;
  const toneRing =
    risk.tone === "rose"
      ? "border-rose-500/40 bg-rose-500/[0.08]"
      : risk.tone === "amber"
        ? "border-amber-500/40 bg-amber-500/[0.08]"
        : "border-emerald-500/35 bg-emerald-500/[0.06]";

  if (upgradeBlocked) {
    return (
      <div
        role="alert"
        className="flex flex-col gap-3 rounded-2xl border border-rose-500/45 bg-gradient-to-r from-rose-500/15 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-400/40 bg-rose-500/20 text-rose-200" aria-hidden>
            <XCircle className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-rose-100">Upgrade blocked</p>
            <p className="text-sm text-rose-200/85">Complaints exceeded safe threshold — resolve open cases in PSS first.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {supremePending ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-amber-400/45 bg-amber-500/10 p-4 lg:col-span-2"
        >
          <Crown className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-amber-100">SUPREME — Pending DMO approval</p>
            <p className="mt-0.5 text-xs text-ehb-textBody">
              Score eligibility met; L8 activates only after admin approval.
            </p>
          </div>
        </div>
      ) : null}

      {complaintNearLimit ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/[0.07] p-4 lg:col-span-2">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-amber-100">Complaint limit warning</p>
            <p className="mt-0.5 text-xs text-ehb-textBody">
              You are close to the complaint cap — upgrades may block soon ({d.pss.complaintsOpen}/{d.pss.complaintsMax}).
            </p>
          </div>
        </div>
      ) : null}

      <div className={`flex items-start gap-3 rounded-2xl border p-4 ${toneRing}`}>
        <AlertTriangle
          className={`mt-0.5 h-5 w-5 shrink-0 ${risk.tone === "rose" ? "text-rose-400" : risk.tone === "amber" ? "text-amber-400" : "text-emerald-400"}`}
          aria-hidden
        />
        <div>
          <p className="text-sm font-semibold text-white">{risk.label}</p>
          <p className="mt-0.5 text-xs text-ehb-textBody">
            {remaining} complaint slots left before automatic limit · PSS {d.pss.complaintsOpen}/{d.pss.complaintsMax}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/[0.07] p-4">
        <Bot className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-300" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-fuchsia-100">AI insight</p>
          <p className="mt-0.5 text-xs text-ehb-textBody">
            ~{d.progressToNext}% toward {d.nextLevelShort}. Model score {modelScore}% — align CRB, DMO refills, and complaints.
          </p>
        </div>
      </div>
      {modelScore >= 85 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 lg:col-span-2">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" aria-hidden />
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
              <Sparkles className="h-4 w-4 text-amber-300" aria-hidden />
              Strong trust signal
            </p>
            <p className="text-xs text-emerald-200/80">Eligible for priority visibility when marketplace rules apply.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
