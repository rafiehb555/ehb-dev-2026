"use client";

/**
 * DMO — AI Suggestions
 *   - Auto-generated action items from AI engine
 *   - Each suggestion: accept/dismiss/details with action CTA
 *   - Ranked by priority
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type SuggestionPriority = "critical" | "high" | "medium";

type AISuggestion = {
  id: string;
  title: string;
  description: string;
  impact: string;
  priority: SuggestionPriority;
  action: { href: string; label: string };
  timestamp: string;
  status: "pending" | "accepted" | "dismissed";
};

const DEMO: AISuggestion[] = [
  {
    id: "SUG-8821",
    title: "Auto-approve 12 CRB applications",
    description: "L3+ sellers with clean audit history past SLA — auto-approval saves 2h operator time.",
    impact: "Save 2h operator time · 12 approvals processed",
    priority: "critical",
    action: { href: "/dmo/crb/applications", label: "Review & auto-approve" },
    timestamp: "2026-04-11T10:40:00Z",
    status: "pending",
  },
  {
    id: "SUG-8820",
    title: "Flag 3 refills for escalation",
    description: "WMS, OLS, AGTS refills < 24h to expiry — escalate to franchise managers now.",
    impact: "Prevent 3 L-downgrades · proactive urgency",
    priority: "critical",
    action: { href: "/dmo/refill-management", label: "Open refill queue" },
    timestamp: "2026-04-11T10:35:00Z",
    status: "pending",
  },
  {
    id: "SUG-8819",
    title: "Investigate AGTS Dubai revenue anomaly",
    description: "+19.3% MoM growth suggests potential fraud or system miscounting. Cross-check escrow.",
    impact: "Risk mitigation · verify $180K transaction batch",
    priority: "high",
    action: { href: "/dmo/wallet-control/escrow", label: "Audit escrow ledger" },
    timestamp: "2026-04-11T10:30:00Z",
    status: "pending",
  },
  {
    id: "SUG-8818",
    title: "Optimize STL L7 threshold floor",
    description: "Current 4.0 floor is suboptimal — recommend 3.8 to balance quality + onboarding.",
    impact: "Unlock 47 qualified sellers for Phase-2",
    priority: "high",
    action: { href: "/dmo/stl/scores", label: "Adjust threshold" },
    timestamp: "2026-04-11T10:20:00Z",
    status: "pending",
  },
  {
    id: "SUG-8817",
    title: "Rotate PSS liveness threshold",
    description: "AGTS false-positive spike at 0.80 threshold — raise to 0.82 for 24h cooldown.",
    impact: "Reduce false-positive rate by 18%",
    priority: "medium",
    action: { href: "/dmo/pss/refilling", label: "Update PSS config" },
    timestamp: "2026-04-11T10:15:00Z",
    status: "pending",
  },
];

const PRIORITY_TONE: Record<SuggestionPriority, VerificationTone> = {
  critical: "red",
  high: "amber",
  medium: "purple",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AiSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(DEMO);

  const stats = useMemo(
    () => ({
      total: suggestions.length,
      pending: suggestions.filter((s) => s.status === "pending").length,
      accepted: suggestions.filter((s) => s.status === "accepted").length,
      dismissed: suggestions.filter((s) => s.status === "dismissed").length,
    }),
    [suggestions]
  );

  function accept(id: string) {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "accepted" as const } : s))
    );
  }

  function dismiss(id: string) {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "dismissed" as const } : s))
    );
  }

  const pending = suggestions.filter((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#A098F8]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #A098F8 25%, #7B6EF6 50%, #2BBFA0 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#A098F8]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#A098F8]/20 via-[#7B6EF6]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">AI Suggestions</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">AI Suggestions</h1>
            <p className="max-w-2xl text-sm text-white/65">
              System-generated action items ranked by urgency. Accept to act, dismiss to archive.
              Each suggestion includes impact estimate aur next step.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total pending" value={stats.pending} sub="action items" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20m-7-7h14M8 9h8M6 5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Accepted" value={stats.accepted} sub="acting on suggestions" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="red" label="Dismissed" value={stats.dismissed} sub="archived" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Avg impact" value="2.4h" sub="estimated time saved" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
      </section>

      <section className="space-y-3">
        <SectionHeader title="Pending suggestions" hint={`${pending.length} action item(s) await your decision`} />
        {pending.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-12 text-center">
            <p className="text-white/65">No pending suggestions — you're all caught up!</p>
          </div>
        ) : (
          pending.map((sug) => (
            <div key={sug.id} className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5 transition-colors hover:border-white/20">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <VerificationChip tone={PRIORITY_TONE[sug.priority]}>
                      {sug.priority.toUpperCase()}
                    </VerificationChip>
                    <span className="font-mono text-[10px] text-white/45">{sug.id}</span>
                    <span className="text-[10px] text-white/40">{fmtTime(sug.timestamp)}</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-white">{sug.title}</h3>
                  <p className="mt-1 text-sm text-white/65">{sug.description}</p>
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-white/45">Impact</p>
                    <p className="mt-1 text-[13px] text-white/85">{sug.impact}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:min-w-max">
                  <Link
                    href={sug.action.href}
                    className="rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/12 px-4 py-2 text-center text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/80 hover:bg-[#2BBFA0]/25 hover:text-white"
                  >
                    {sug.action.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => accept(sug.id)}
                    className="rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-4 py-2 text-xs font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/70 hover:bg-[#7B6EF6]/20"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => dismiss(sug.id)}
                    className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white/65 transition-colors hover:border-white/35 hover:bg-white/10"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
