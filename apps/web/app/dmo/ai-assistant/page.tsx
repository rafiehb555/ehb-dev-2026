"use client";

/**
 * DMO — AI Assistant
 *   - VerificationUI primitives (no local Kpi)
 *   - In-file demo data + workspace-scoped chat
 *   - AI suggestions ranked by urgency
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationChip,
  SectionHeader,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type ChatRole = "user" | "ai";
type ChatMessage = { id: string; role: ChatRole; text: string; at: string };

type Suggestion = {
  id: string;
  kind: "action" | "risk" | "insight";
  title: string;
  detail: string;
  link?: { href: string; label: string };
};

const SUGGESTIONS: Suggestion[] = [
  { id: "S-1", kind: "risk", title: "3 refills expire in < 48h", detail: "WMS, OLS, AGTS — seller level L5+ at risk of auto-downgrade. Send expiry reminders now.", link: { href: "/dmo/refill-management", label: "Open Refill Management" } },
  { id: "S-2", kind: "action", title: "Unclaimed SLA breach · T-4420", detail: "Complaint CX-7740 has a 23-minute SLA breach — assign to a senior operator.", link: { href: "/dmo/task-system", label: "Open Task System" } },
  { id: "S-3", kind: "insight", title: "AGTS Dubai revenue +19.3% MoM", detail: "Consider promoting their franchise tier or increasing their STL weight floor for Phase-2 focus.", link: { href: "/dmo/earnings-engine", label: "Open Earnings Engine" } },
];

const KIND_TONE: Record<Suggestion["kind"], VerificationTone> = {
  action: "purple",
  risk: "red",
  insight: "teal",
};

const SEED_CHAT: ChatMessage[] = [
  { id: "m1", role: "ai", text: "Salam! Main DMO AI Assistant hoon. STL, PSS, CRB, Complaints, Refill — kisi bhi module ke baare me pooch sakte hain. Abhi workspace-scoped mode me hoon.", at: "10:00" },
];

function nowHHMM() {
  const d = new Date();
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function fakeAiReply(q: string): string {
  const t = q.toLowerCase();
  if (t.includes("stl")) return "Aaj 4,812 active sellers STL-tracked hain. L7+ count 247 hai, ye number last hafte se +5.8% upar aya. MIN rule ke under koi bhi dimension 4.0 se kam ho to seller ka weighted STL floor usi pa set hota hai.";
  if (t.includes("pss") || t.includes("kyc") || t.includes("liveness")) return "PSS engine abhi live mode me hai — 12,480 verifications today. AGTS onboarding flow par liveness false-positive spike detect hui hai (Up-Guard incident UG-8820). Recommend: temporarily raise threshold to 0.82 for 24h.";
  if (t.includes("crb")) return "CRB queue me 18 applications hain — 4 INSPECTION, 2 REVIEW, 1 REJECTED (appeal pending), baaki SUBMITTED. Karachi franchise inspector workload 72h SLA ke qareeb hai — reroute 2 tasks?";
  if (t.includes("complaint")) return "Open complaints: 12 total, 2 critical severity. CX-7741 (GoSellr counterfeit) aur CX-7738 (WMS wrong dosage). Dono par penalty ladder step 3 (temporary lock) recommend karta hoon.";
  return "Main ye query workspace-scoped mode me offline handle kar raha hoon. Full AI backend (/api/ai) connect hone ke baad real answers mil jaainge.";
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_CHAT);
  const [draft, setDraft] = useState("");

  const stats = useMemo(() => ({
    conversations: 126,
    suggestionsAccepted: 38,
    messagesToday: 412,
    backendStatus: "cold",
  }), []);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: "user", text, at: nowHHMM() };
    const aiMsg: ChatMessage = { id: `a${Date.now() + 1}`, role: "ai", text: fakeAiReply(text), at: nowHHMM() };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setDraft("");
  }

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#2BBFA0]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #2BBFA0 25%, #7B6EF6 50%, #67E8F9 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#2BBFA0]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#2BBFA0]/20 via-[#7B6EF6]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#2BBFA0]">AI Assistant</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">AI Assistant</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Workspace-scoped chat — STL, PSS, CRB, Complaints context ke saath. Backend
              cold ho to graceful offline fallback active rehta hai.
            </p>
          </div>
          <span className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-3 py-1.5 text-xs font-semibold text-[#F0A030]">Backend: {stats.backendStatus}</span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="teal" label="Conversations" value={stats.conversations} sub="total threads" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Accepted" value={stats.suggestionsAccepted} sub="suggestions acted on" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Messages today" value={stats.messagesToday} sub="across operators" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="green" label="Avg response" value="0.9s" sub="latency" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        {/* Chat panel */}
        <div className="lg:col-span-3 flex flex-col rounded-2xl border border-white/10 bg-[#13162A]/70">
          <div className="border-b border-white/10 p-4">
            <SectionHeader title="Workspace chat" hint="Context: DMO operator workspace" />
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-4" style={{ maxHeight: 420 }}>
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl border p-3 text-sm ${m.role === "user" ? "border-[#7B6EF6]/45 bg-[#7B6EF6]/15 text-white" : "border-white/10 bg-[#1A1D33]/80 text-white/80"}`}>
                  <p>{m.text}</p>
                  <p className="mt-1 text-[10px] text-white/40">{m.at}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                placeholder="Pooch lo — STL, PSS, CRB, complaints, refills..."
                className="flex-1 rounded-xl border border-white/10 bg-[#0C0E1A]/80 px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none focus:border-[#7B6EF6]/55"
              />
              <button type="button" onClick={send} className="rounded-xl border border-[#2BBFA0]/50 bg-[#2BBFA0]/15 px-4 py-2 text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/80 hover:bg-[#2BBFA0]/25 hover:text-white">Send</button>
            </div>
          </div>
        </div>

        {/* Suggestions panel */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-[#7B6EF6]/25 bg-[#13162A]/70 p-5 pt-[22px]">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #7B6EF6, transparent)" }} />
          <SectionHeader title="AI suggestions" hint="Ranked by urgency + business impact" />
          <div className="mt-3 space-y-2">
            {SUGGESTIONS.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/10 bg-[#1A1D33]/80 p-3 transition-colors hover:border-white/20">
                <VerificationChip tone={KIND_TONE[s.kind]}>{s.kind.toUpperCase()}</VerificationChip>
                <p className="mt-1.5 text-sm font-semibold text-white">{s.title}</p>
                <p className="mt-1 text-[11px] text-white/55">{s.detail}</p>
                {s.link ? (
                  <Link href={s.link.href} className="mt-2 inline-block text-[11px] font-semibold text-[#A098F8] hover:text-white hover:underline">
                    {s.link.label} →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
