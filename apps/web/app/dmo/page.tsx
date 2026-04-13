"use client";

/**
 * DMO landing dashboard — Phase 7 synthesis rebuild (2026-04-11).
 *
 * Goal (per Rafi): "ek nazar man dakhte he sub samj jay".
 *
 * This rebuild absorbs the dense widget vocabulary from the 23 reference
 * dashboards (EHB-STL profile cards, STL1–STL5 gem ladder, trust gauge,
 * PSS/CRB/DMO checkmark panels, blockchain hash + Moonbeam explorer card,
 * franchise verification network, AI assistant next-steps, fraud detection
 * banner, activity summary, earnings ±deltas) and maps them onto the canonical
 * Batch-2 naming + EHB design tokens.
 *
 * Anatomy (top → bottom):
 *
 *   1. §7.12 Cinematic Hero
 *      (eyebrow · gradient headline · subhead · 4-up counters · AI ribbon · CTA)
 *   2. FraudBanner           — conditional red banner (complaints ≥ limit − 2
 *                               OR AI fraud flag MED/HIGH)
 *   3. Profile + STL Ladder  — 2-column (profile w/ trust gauge · 8-tier ladder)
 *   4. VerificationTrinity   — 3-up PSS / CRB / DMO checkmark panels
 *   5. Intelligence row      — 4-up: AI Next-Steps · Blockchain · Franchise · Activity
 *   6. Earnings + Benefits   — 2-column earnings chart + STL benefits unlocks
 *   7. Module rail           — 18-module bento grouped by section
 *
 * Target level: §7 ai-behavior.md "Tesla-grade (L5)" for landing surface.
 * Every widget answers one of the four trust questions
 * (Who / Trust / Cost / Verified) within 3 seconds of scanning.
 *
 * Canonical naming (CLAUDE.md §6.2):
 *   STL = Service Trust Level              (L1 FREE → L8 SUPREME)
 *   PSS = Personal Security System         (KYC, liveness, AML, complaints)
 *   CRB = Certification & Registry Board   (documents, exams, inspections)
 */

import Link from "next/link";
import React, { useMemo } from "react";
import useSTL from "@/hooks/useSTL";
import { useEhbTheme } from "@/components/dmo/DmoThemeProvider";
import {
  DMO_NAV_SECTIONS,
  DMO_NAV_GROUPS,
  groupDmoSections,
} from "@/components/dmo/navigation";

/**
 * White-theme accent color mapping: pastel → darker readable versions.
 * On dark bg the pastels work; on white bg they need darkening.
 */
const WHITE_ACCENT_MAP: Record<string, string> = {
  "#A098F8": "#5B4ED6",
  "#7B6EF6": "#5B4ED6",
  "#C3BCFC": "#5B4ED6",
  "#2BBFA0": "#0D8A72",
  "#5FDCBF": "#0D8A72",
  "#38C878": "#1A8F54",
  "#F0A030": "#B87514",
  "#F5BB66": "#B87514",
  "#F05858": "#CC3333",
  "#67E8F9": "#0891B2",
};

/** Returns theme-safe accent color for TEXT on current theme bg. */
function useThemeAccent(color: string): string {
  try {
    const { theme } = useEhbTheme();
    if (theme === "white") return WHITE_ACCENT_MAP[color] ?? color;
    return color;
  } catch {
    return color;
  }
}

/** Hook: returns a function that maps colors to White-safe versions. */
function useSafeColor(): (color: string) => string {
  try {
    const { theme } = useEhbTheme();
    if (theme === "white") return (c: string) => WHITE_ACCENT_MAP[c] ?? c;
    return (c: string) => c;
  } catch {
    return (c: string) => c;
  }
}

/* ========================================================================
   Page
   ======================================================================== */

export default function DmoDashboardPage() {
  const { data } = useSTL();

  // ---- derive everything once ----
  const name = data?.name ?? "EHB Operator";
  const trustScore = clamp(Math.round(data?.trustScore ?? 0), 0, 100);
  const level = (data?.stlLevel ?? 1) as number;
  const levelName = data?.levelName ?? "FREE";
  const nextLevelName = data?.nextLevelName ?? "—";
  const progressPct = clamp(Math.round(data?.progress?.percent ?? 0), 0, 100);

  const kycStatus = data?.pss?.kycStatus ?? "PENDING";
  const kycVerified = kycStatus === "APPROVED" || kycStatus === "VERIFIED";
  const complaints = data?.complaints?.count ?? data?.pss?.complaintsCount ?? 0;
  const complaintLimit = data?.complaints?.limit ?? data?.pss?.complaintLimit ?? 8;

  const crbVerifications = data?.crb?.verifications ?? 0;
  const requiredVerifications = data?.crb?.requiredVerifications ?? 4;
  const examsPassed = data?.crb?.examsPassed ?? 0;
  const requiredExams = data?.crb?.requiredExams ?? 4;

  const refills = data?.dmo?.refillCount ?? data?.dmo?.refills ?? 0;
  const requiredRefills = data?.dmo?.requiredRefillCount ?? data?.dmo?.requiredRefills ?? 4;

  const franchiseVerified = data?.franchise?.verifiedLocations ?? 0;
  const franchisePending = data?.franchise?.pendingLocations ?? 0;

  const aiGuide =
    data?.ai?.guide ??
    "Trust tasks complete karen — PSS liveness, CRB documents, aur refill schedule on-time rakhen.";
  const aiTasks = (data?.ai?.tasks ?? data?.aiSuggestions ?? []).slice(0, 3);
  const fraudRisk = data?.ai?.fraud?.risk ?? "LOW";
  const fraudFlagged = Boolean(data?.ai?.fraud?.flagged);
  const fraudReasons = data?.ai?.fraud?.reasons ?? [];

  const hasCritical = !kycVerified || complaints >= complaintLimit - 2 || fraudFlagged;

  const grouped = useMemo(() => groupDmoSections(DMO_NAV_SECTIONS), []);

  return (
    <div className="relative z-10 space-y-4">
      {/* ======================================================
          §7.12 CINEMATIC HERO — v1.7 Premium / Compact
          ====================================================== */}
      <section
        className="relative isolate overflow-hidden rounded-[16px] border border-white/[0.08]"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 18% 0%, rgba(123,110,246,0.14), transparent 60%), radial-gradient(ellipse 50% 55% at 92% 10%, rgba(43,191,160,0.12), transparent 60%), linear-gradient(180deg, rgba(8,10,22,0.96) 0%, rgba(12,14,28,0.98) 55%, rgba(10,12,26,0.98) 100%)",
          boxShadow:
            "0 20px 50px rgba(10,12,24,0.45), 0 1px 0 rgba(255,255,255,0.08) inset",
          padding: "clamp(18px, 2.2vw, 28px) clamp(20px, 2.4vw, 32px)",
          paddingTop: "clamp(22px, 2.6vw, 32px)",
        }}
      >
        {/* Gradient accent bar */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #7B6EF6 20%, #2BBFA0 40%, #F0A030 60%, #67E8F9 80%, transparent 100%)" }} />
        {/* L-shape corner decorations */}
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="ehb-scan" />

        <div className="relative z-[2]">
          {/* Eyebrow row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p
              className="text-[9px] font-semibold uppercase text-[#A098F8]"
              style={{ letterSpacing: "0.22em" }}
            >
              DMO · Decentralized Management Office · EHB Technologies (Pvt.) Ltd.
            </p>
            <div
              className="inline-flex items-center gap-1.5 rounded-full border border-[#2BBFA0]/35 bg-[#2BBFA0]/10 px-2.5 py-0.5"
              style={{ letterSpacing: "0.1em" }}
            >
              <span className="ehb-live-dot h-1 w-1 rounded-full bg-[#2BBFA0]" />
              <span className="text-[9px] font-semibold uppercase text-[#2BBFA0]">
                Live · v7.0
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="ehb-headline mt-3 font-bold text-white"
            style={{
              fontSize: "clamp(22px, 2.6vw, 36px)",
              lineHeight: 1.1,
              letterSpacing: "-0.6px",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            Mission control for{" "}
            <span className="ehb-headline-gradient">EHB&apos;s 32 industries.</span>
          </h1>

          {/* Subhead */}
          <p
            className="mt-2 max-w-[620px] text-white/60"
            style={{ fontSize: "12px", lineHeight: 1.6 }}
          >
            Service Trust Level L{level} {levelName} · PSS KYC {kycStatus} · CRB{" "}
            {crbVerifications}/{requiredVerifications} verified. Anti-fraud MIN rule
            enforces truth across product, seller, company, aur owner scores.
          </p>

          {/* 4-up animated metric row */}
          <div
            className="mt-5 grid gap-y-4 gap-x-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            }}
          >
            <Metric
              delay={1}
              value={trustScore}
              suffix="/100"
              label="STL Trust Score"
              sub={`L${level} ${levelName} · next → ${nextLevelName}`}
              accent="#A098F8"
            />
            <Metric
              delay={2}
              value={kycVerified ? 100 : kycStatus === "PENDING" ? 50 : 0}
              suffix="%"
              label="PSS KYC Progress"
              sub={`Liveness · AML · ${String(kycStatus).toLowerCase()}`}
              accent="#2BBFA0"
            />
            <Metric
              delay={3}
              value={crbVerifications}
              suffix={`/${requiredVerifications}`}
              label="CRB Verifications"
              sub={`Docs · exam ${examsPassed}/${requiredExams}`}
              accent="#38C878"
            />
            <Metric
              delay={4}
              value={refills}
              suffix={`/${requiredRefills}`}
              label="DMO Refill Progress"
              sub={`${complaints} active complaints`}
              accent="#F0A030"
            />
          </div>

          {/* AI Copilot ribbon */}
          <Link
            href="/dmo/ai-assistant"
            className="mt-5 block overflow-hidden rounded-lg border transition-colors hover:border-[#A098F8]/45"
            style={{
              background:
                "linear-gradient(135deg, rgba(160,152,248,0.08), rgba(43,191,160,0.08))",
              borderColor: "rgba(160,152,248,0.22)",
            }}
          >
            <div className="flex items-center gap-3 px-4 py-2.5">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[13px]"
                style={{
                  background:
                    "linear-gradient(135deg, #A098F8 0%, #7B6EF6 50%, #2BBFA0 100%)",
                }}
              >
                AI
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="text-[9px] font-semibold uppercase text-[#A098F8]"
                  style={{ letterSpacing: "0.18em" }}
                >
                  AI Copilot · Mission Brief
                </p>
                <p className="mt-0.5 truncate text-[11px] text-white/80">{aiGuide}</p>
              </div>
              <span className="shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold text-white/75">
                Open →
              </span>
            </div>
            <div className="ehb-ai-bar" />
          </Link>

          {/* Gradient action strip */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dmo/stl"
                className="ehb-cta-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-[11px] font-semibold text-white"
              >
                Open STL Management →
              </Link>
              <Link
                href="/dmo/ehb-stl-level"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold text-white/75 transition-colors hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
              >
                STL L1–L8 reference
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9px] font-semibold uppercase ${
                  hasCritical
                    ? "border-[#F05858]/45 bg-[#F05858]/12 text-[#F05858]"
                    : "border-[#38C878]/40 bg-[#38C878]/12 text-[#38C878]"
                }`}
                style={{ letterSpacing: "0.12em" }}
              >
                <span className="h-1 w-1 rounded-full bg-current" />
                {hasCritical ? "Attention needed" : "All systems nominal"}
              </span>
              <span
                className="rounded-full border border-[#7B6EF6]/35 bg-[#7B6EF6]/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase text-[#A098F8]"
                style={{ letterSpacing: "0.12em" }}
              >
                Phase 7 · Cinematic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          FRAUD BANNER (conditional)
          ====================================================== */}
      {(fraudFlagged || complaints >= complaintLimit - 2) && (
        <FraudBanner
          risk={fraudRisk}
          reasons={fraudReasons}
          complaints={complaints}
          complaintLimit={complaintLimit}
        />
      )}

      {/* ======================================================
          PROFILE + STL LADDER (2-column)
          ====================================================== */}
      <section
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
      >
        <ProfileTrustCard
          name={name}
          level={level}
          levelName={levelName}
          trustScore={trustScore}
          progressPct={progressPct}
          nextLevelName={nextLevelName}
        />
        <StlLevelLadder currentLevel={level} trustScore={trustScore} />
      </section>

      {/* ======================================================
          VERIFICATION TRINITY (PSS / CRB / DMO)
          ====================================================== */}
      <section
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        <VerificationCard
          title="PSS · Personal Security"
          accent="#2BBFA0"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>}
          rows={[
            { label: "KYC liveness", ok: kycVerified, detail: String(kycStatus) },
            { label: "AML screening", ok: kycVerified, detail: kycVerified ? "Clear" : "Pending" },
            {
              label: "Complaint limit",
              ok: complaints < complaintLimit - 1,
              detail: `${complaints}/${complaintLimit}`,
            },
            {
              label: "Fraud flag",
              ok: !fraudFlagged,
              detail: fraudFlagged ? String(fraudRisk) : "LOW",
            },
          ]}
          href="/dmo/pss"
          cta="Open PSS →"
        />
        <VerificationCard
          title="CRB · Certification & Registry"
          accent="#38C878"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>}
          rows={[
            {
              label: "Documents verified",
              ok: crbVerifications >= requiredVerifications,
              detail: `${crbVerifications}/${requiredVerifications}`,
            },
            {
              label: "Exams passed",
              ok: examsPassed >= requiredExams,
              detail: `${examsPassed}/${requiredExams}`,
            },
            {
              label: "Inspection reports",
              ok: crbVerifications >= 2,
              detail: crbVerifications >= 2 ? "Active" : "Missing",
            },
            {
              label: "Certificate hash",
              ok: crbVerifications > 0,
              detail: crbVerifications > 0 ? "On-chain" : "Not anchored",
            },
          ]}
          href="/dmo/crb"
          cta="Open CRB →"
        />
        <VerificationCard
          title="DMO · Operations Office"
          accent="#F0A030"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>}
          rows={[
            {
              label: "Refill cycle",
              ok: refills >= requiredRefills,
              detail: `${refills}/${requiredRefills}`,
            },
            {
              label: "Complaints resolved",
              ok: complaints < 2,
              detail: `${complaints} open`,
            },
            {
              label: "Franchise network",
              ok: franchiseVerified > 0,
              detail: `${franchiseVerified} verified · ${franchisePending} pending`,
            },
            {
              label: "Approval queue",
              ok: true,
              detail: "Live",
            },
          ]}
          href="/dmo/approvals"
          cta="Open DMO →"
        />
      </section>

      {/* ======================================================
          INTELLIGENCE ROW (4-up)
          ====================================================== */}
      <section
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
      >
        <AiNextStepsCard
          tasks={aiTasks}
          guide={aiGuide}
          trustScore={trustScore}
          nextLevelName={nextLevelName}
        />
        <BlockchainProofCard trustScore={trustScore} level={level} />
        <FranchiseNetworkCard
          verified={franchiseVerified}
          pending={franchisePending}
        />
        <ActivitySummaryCard
          refills={refills}
          requiredRefills={requiredRefills}
          crbVerifications={crbVerifications}
          requiredVerifications={requiredVerifications}
          complaints={complaints}
        />
      </section>

      {/* ======================================================
          EARNINGS + BENEFITS (2-column)
          ====================================================== */}
      <section
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
      >
        <EarningsCard />
        <BenefitsLadder currentLevel={level} />
      </section>

      {/* ======================================================
          MODULE RAIL — bento grouped
          ====================================================== */}
      <section className="space-y-6 pt-2">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              className="font-bold text-white"
              style={{ fontSize: "clamp(18px, 2vw, 22px)", letterSpacing: "-0.3px" }}
            >
              DMO modules
            </h2>
            <p className="mt-1 text-[12px] text-white/55">
              18 canonical modules grouped into 4 sections. Click any card to drill in.
            </p>
          </div>
          <span
            className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase text-white/55 sm:inline-block"
            style={{ letterSpacing: "0.18em" }}
          >
            18 modules · 4 groups
          </span>
        </div>

        {DMO_NAV_GROUPS.map((group) => {
          const sections = grouped.find((g) => g.key === group.key)?.sections ?? [];
          if (sections.length === 0) return null;
          return (
            <div key={group.key} className="space-y-3">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-semibold uppercase ${group.tint}`}
                  style={{ letterSpacing: "0.22em" }}
                >
                  {group.label}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
              </div>
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                }}
              >
                {sections.map((section) => (
                  <Link
                    key={section.key}
                    href={section.href}
                    className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]/70 backdrop-blur-xl p-3 transition-all hover:-translate-y-[2px]"
                    style={{
                      transitionDuration: "220ms",
                      transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 60% at 10% 0%, rgba(123,110,246,0.22) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 100%, rgba(43,191,160,0.18) 0%, transparent 55%)",
                      }}
                    />
                    <div className="relative flex items-center gap-2.5">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[15px]"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(123,110,246,0.18), rgba(43,191,160,0.14))",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {section.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-semibold text-white">
                          {section.label}
                        </div>
                        <div className="mt-0.5 truncate text-[9px] text-white/50">
                          {section.items.length} sub-pages · open →
                        </div>
                      </div>
                      <span className="text-white/30 transition-all group-hover:translate-x-0.5 group-hover:text-[#A098F8]">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

/* ========================================================================
   Helpers
   ======================================================================== */

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/* ========================================================================
   §7.12 Hero metric (animated counter)
   ======================================================================== */

function Metric({
  delay,
  value,
  suffix,
  label,
  sub,
  accent,
}: {
  delay: 1 | 2 | 3 | 4;
  value: number;
  suffix?: string;
  label: string;
  sub: string;
  accent: string;
}) {
  const safeAccent = useThemeAccent(accent);
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={`ehb-num ehb-num-d${delay} font-bold text-white`}
        style={{
          fontSize: "clamp(22px, 2.1vw, 30px)",
          lineHeight: 1,
          letterSpacing: "-0.4px",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {value}
        {suffix ? (
          <span className="ml-0.5 text-[0.42em] font-semibold text-white/45">
            {suffix}
          </span>
        ) : null}
      </div>
      <div>
        <p
          className="text-[9px] font-semibold uppercase"
          style={{ color: safeAccent, letterSpacing: "0.14em" }}
        >
          {label}
        </p>
        <p className="mt-0.5 text-[10px] text-white/45">{sub}</p>
      </div>
    </div>
  );
}

/* ========================================================================
   FraudBanner (ref image: red bordered warning with complaint/fraud detail)
   ======================================================================== */

function FraudBanner({
  risk,
  reasons,
  complaints,
  complaintLimit,
}: {
  risk: "LOW" | "MEDIUM" | "HIGH";
  reasons: string[];
  complaints: number;
  complaintLimit: number;
}) {
  const sc = useSafeColor();
  const nearLimit = complaints >= complaintLimit - 2;
  const tone =
    risk === "HIGH" || complaints >= complaintLimit
      ? "#F05858"
      : risk === "MEDIUM" || nearLimit
        ? "#F0A030"
        : "#F05858";
  const messages =
    reasons.length > 0
      ? reasons.slice(0, 3)
      : [
          nearLimit
            ? `Complaint limit ${complaints}/${complaintLimit} — aap limit ke paas hain. Pending complaints resolve karein.`
            : "Anti-fraud AI ne suspicious pattern detect kiya. Inspector review pending.",
        ];

  return (
    <section
      className="relative overflow-hidden rounded-xl border p-4"
      style={{
        borderColor: `${tone}55`,
        background: `linear-gradient(135deg, ${tone}18, rgba(13,15,28,0.92) 55%, rgba(13,15,28,0.92))`,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[15px]"
          style={{
            background: `${tone}24`,
            border: `1px solid ${tone}55`,
          }}
        >
          !
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p
              className="text-[9px] font-semibold uppercase"
              style={{ color: sc(tone), letterSpacing: "0.16em" }}
            >
              Fraud Detection · Risk {risk}
            </p>
            <span
              className="rounded-full border px-1.5 py-0.5 text-[8px] font-semibold uppercase"
              style={{
                borderColor: `${tone}55`,
                color: tone,
                letterSpacing: "0.12em",
              }}
            >
              Action required
            </span>
          </div>
          <ul className="mt-1.5 space-y-0.5">
            {messages.map((m, i) => (
              <li key={i} className="text-[11px] text-white/85">
                • {m}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/dmo/complaints"
          className="shrink-0 self-center rounded-lg border px-3 py-1.5 text-[10px] font-semibold transition-colors"
          style={{
            borderColor: `${tone}55`,
            color: tone,
            background: `${tone}12`,
          }}
        >
          Resolve now →
        </Link>
      </div>
    </section>
  );
}

/* ========================================================================
   ProfileTrustCard (ref image: avatar + STL halo + radial gauge + upgrade CTA)
   ======================================================================== */

function ProfileTrustCard({
  name,
  level,
  levelName,
  trustScore,
  progressPct,
  nextLevelName,
}: {
  name: string;
  level: number;
  levelName: string;
  trustScore: number;
  progressPct: number;
  nextLevelName: string;
}) {
  const initials = getInitials(name);
  const tone = getLevelTone(level);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]/70 backdrop-blur-xl p-4 pt-[22px]"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(123,110,246,0.12), transparent 60%), rgba(19,22,42,0.92)",
      }}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #7B6EF6, #A098F8, transparent)" }} />
      <div className="flex items-center gap-3">
        {/* Avatar with STL halo */}
        <div className="relative">
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-full text-[13px] font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #1A1D33, #13162A)",
              border: `1.5px solid ${tone}`,
              boxShadow: `0 0 18px ${tone}35`,
            }}
          >
            {initials}
          </div>
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-[1px] text-[8px] font-black uppercase text-white"
            style={{
              background: `linear-gradient(135deg, ${tone}, rgba(123,110,246,0.9))`,
              boxShadow: `0 2px 8px ${tone}55`,
              letterSpacing: "0.08em",
            }}
          >
            L{level}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="text-[9px] font-semibold uppercase text-[#A098F8]"
            style={{ letterSpacing: "0.16em" }}
          >
            EHB Operator
          </p>
          <h3 className="truncate text-[14px] font-bold text-white">{name}</h3>
          <p className="mt-0.5 text-[10px] text-white/55">
            L{level} {levelName} · next → {nextLevelName}
          </p>
        </div>
      </div>

      {/* Radial trust gauge */}
      <div className="mt-4 flex items-center gap-4">
        <TrustGauge score={trustScore} tone={tone} />
        <div className="min-w-0 flex-1 space-y-2.5">
          <div>
            <div className="flex items-center justify-between">
              <p
                className="text-[8px] font-semibold uppercase text-white/55"
                style={{ letterSpacing: "0.14em" }}
              >
                Progress to next level
              </p>
              <p className="text-[10px] font-bold text-white">{progressPct}%</p>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPct}%`,
                  background: `linear-gradient(90deg, ${tone}, #A098F8)`,
                  boxShadow: `0 0 10px ${tone}66`,
                  transition: "width 600ms cubic-bezier(.2,.8,.2,1)",
                }}
              />
            </div>
          </div>
          <Link
            href="/dmo/stl"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/14 px-3 py-1.5 text-[10px] font-semibold text-[#C3BCFC] transition-colors hover:bg-[#7B6EF6]/22"
          >
            Upgrade to {nextLevelName} →
          </Link>
        </div>
      </div>
    </div>
  );
}

function TrustGauge({ score, tone }: { score: number; tone: string }) {
  const size = 84;
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{ height: size, width: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={6}
          fill="none"
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={tone} />
            <stop offset="100%" stopColor="#A098F8" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gaugeGrad)"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold text-white"
          style={{ fontSize: 20, lineHeight: 1, letterSpacing: "-0.3px" }}
        >
          {score}
        </span>
        <span
          className="mt-0.5 text-[7px] font-semibold uppercase text-white/55"
          style={{ letterSpacing: "0.14em" }}
        >
          Trust
        </span>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "EH";
}

function getLevelTone(level: number): string {
  if (level >= 8) return "#F0A030";
  if (level >= 6) return "#A098F8";
  if (level >= 4) return "#2BBFA0";
  if (level >= 2) return "#7B6EF6";
  return "#38C878";
}

/* ========================================================================
   StlLevelLadder (ref image: STL1→STL5 gem/shield progression)
   ======================================================================== */

const STL_LADDER = [
  { level: 1, code: "L1", name: "FREE", icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>), min: 0 },
  { level: 2, code: "L2", name: "BASIC", icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>), min: 21 },
  { level: 3, code: "L3", name: "NORMAL", icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>), min: 41 },
  { level: 4, code: "L4", name: "STANDARD", icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>), min: 56 },
  { level: 5, code: "L5", name: "ADVANCED", icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/></svg>), min: 66 },
  { level: 6, code: "L6", name: "HIGH", icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M12 9v4"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>), min: 76 },
  { level: 7, code: "L7", name: "VIP", icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>), min: 86 },
  { level: 8, code: "L8", name: "SUPREME", icon: (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/><path d="M5 19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1H5v1z"/></svg>), min: 96 },
];

function StlLevelLadder({
  currentLevel,
  trustScore,
}: {
  currentLevel: number;
  trustScore: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]/70 backdrop-blur-xl p-4 pt-[22px]">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, #38C878, #2BBFA0, #7B6EF6, #A098F8, #F0A030)" }} />
      <div className="flex items-center justify-between gap-2">
        <div>
          <p
            className="text-[9px] font-semibold uppercase text-[#A098F8]"
            style={{ letterSpacing: "0.16em" }}
          >
            STL Level Progression
          </p>
          <h3 className="mt-0.5 text-[12px] font-bold text-white">
            8-tier trust ladder · L1 → L8 SUPREME
          </h3>
        </div>
        <span className="rounded-full border border-[#A098F8]/30 bg-[#7B6EF6]/10 px-2 py-0.5 text-[9px] font-semibold text-[#C3BCFC]">
          {trustScore}/100
        </span>
      </div>

      {/* Tier chips */}
      <div className="mt-3 grid grid-cols-8 gap-1">
        {STL_LADDER.map((t) => {
          const isCurrent = t.level === currentLevel;
          const isPast = t.level < currentLevel;
          const tone = getLevelTone(t.level);
          return (
            <div
              key={t.level}
              className="flex flex-col items-center gap-0.5 rounded-lg border px-1 py-1.5 transition-all"
              style={{
                borderColor: isCurrent
                  ? `${tone}88`
                  : isPast
                    ? "rgba(56,200,120,0.28)"
                    : "rgba(255,255,255,0.06)",
                background: isCurrent
                  ? `linear-gradient(180deg, ${tone}22, rgba(19,22,42,0.6))`
                  : isPast
                    ? "rgba(56,200,120,0.06)"
                    : "rgba(255,255,255,0.02)",
                boxShadow: isCurrent
                  ? `0 0 14px ${tone}33, 0 1px 0 rgba(255,255,255,0.08) inset`
                  : "none",
              }}
            >
              <span className="flex items-center justify-center text-[13px] leading-none">{t.icon}</span>
              <span
                className="text-[8px] font-black"
                style={{
                  color: isCurrent ? tone : isPast ? "#38C878" : "rgba(255,255,255,0.45)",
                }}
              >
                {t.code}
              </span>
              <span
                className="text-[7px] font-semibold uppercase"
                style={{
                  color: isCurrent
                    ? "rgba(255,255,255,0.92)"
                    : "rgba(255,255,255,0.38)",
                  letterSpacing: "0.04em",
                }}
              >
                {t.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full"
            style={{
              width: `${trustScore}%`,
              background:
                "linear-gradient(90deg, #38C878 0%, #2BBFA0 25%, #7B6EF6 55%, #A098F8 80%, #F0A030 100%)",
              boxShadow: "0 0 12px rgba(160,152,248,0.45)",
              transition: "width 800ms cubic-bezier(.2,.8,.2,1)",
            }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[9px] text-white/45">
          <span>0</span>
          <span>Current: {trustScore}/100</span>
          <span>100 · SUPREME</span>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   VerificationCard (ref image: PSS/CRB/DMO checkmark row panels)
   ======================================================================== */

function VerificationCard({
  title,
  accent,
  icon,
  rows,
  href,
  cta,
}: {
  title: string;
  accent: string;
  icon: React.ReactNode;
  rows: { label: string; ok: boolean; detail: string }[];
  href: string;
  cta: string;
}) {
  const sc = useSafeColor();
  const okCount = rows.filter((r) => r.ok).length;
  const total = rows.length;
  const pct = Math.round((okCount / total) * 100);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]/70 backdrop-blur-xl p-4 pt-[22px] transition-all hover:-translate-y-[1px]"
      style={{
        background: `linear-gradient(180deg, ${accent}10, rgba(19,22,42,0.88))`,
        transitionDuration: "220ms",
      }}
    >
      {/* Accent bar */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px]"
          style={{
            background: `${accent}20`,
            border: `1px solid ${accent}44`,
          }}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[11px] font-bold text-white">{title}</h3>
          <p className="mt-0.5 text-[9px] text-white/50">
            {okCount}/{total} checks · {pct}%
          </p>
        </div>
        <span
          className="rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase"
          style={{
            borderColor: `${accent}55`,
            background: `${accent}15`,
            color: sc(accent),
            letterSpacing: "0.1em",
          }}
        >
          {pct === 100 ? "Ready" : "In progress"}
        </span>
      </div>

      {/* rows */}
      <ul className="mt-3 space-y-1.5">
        {rows.map((r, i) => (
          <li
            key={i}
            className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5"
          >
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black"
              style={{
                background: r.ok ? "rgba(56,200,120,0.16)" : "rgba(240,160,48,0.14)",
                border: r.ok
                  ? "1px solid rgba(56,200,120,0.5)"
                  : "1px solid rgba(240,160,48,0.45)",
                color: r.ok ? "#38C878" : "#F0A030",
              }}
            >
              {r.ok ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 8v4m0 4h.01" /></svg>}
            </span>
            <span className="flex-1 truncate text-[10px] text-white/85">
              {r.label}
            </span>
            <span className="shrink-0 text-[9px] font-semibold text-white/55">
              {r.detail}
            </span>
          </li>
        ))}
      </ul>

      {/* progress */}
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent}, #A098F8)`,
            transition: "width 600ms cubic-bezier(.2,.8,.2,1)",
          }}
        />
      </div>

      <Link
        href={href}
        className="mt-3 inline-flex w-full items-center justify-center rounded-lg border px-3 py-1.5 text-[10px] font-semibold transition-colors"
        style={{
          borderColor: `${accent}44`,
          color: sc(accent),
          background: `${accent}10`,
        }}
      >
        {cta}
      </Link>
    </div>
  );
}

/* ========================================================================
   AiNextStepsCard (ref image: "You need to…" assistant card)
   ======================================================================== */

function AiNextStepsCard({
  tasks,
  guide,
  trustScore,
  nextLevelName,
}: {
  tasks: string[];
  guide: string;
  trustScore: number;
  nextLevelName: string;
}) {
  const list = tasks.length > 0 ? tasks.slice(0, 3) : [guide];
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]/70 backdrop-blur-xl p-4 pt-[22px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(123,110,246,0.10), rgba(19,22,42,0.88))",
      }}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #A098F8, transparent)" }} />
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background:
              "linear-gradient(135deg, #A098F8, #7B6EF6 55%, #2BBFA0)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/><circle cx="9" cy="6.5" r="0.5" fill="#fff"/><circle cx="15" cy="6.5" r="0.5" fill="#fff"/></svg>
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="text-[9px] font-semibold uppercase text-[#A098F8]"
            style={{ letterSpacing: "0.16em" }}
          >
            AI Assistant
          </p>
          <h3 className="text-[11px] font-bold text-white">Next mission steps</h3>
        </div>
      </div>

      <p className="mt-2.5 text-[10px] text-white/55">
        Complete these to reach{" "}
        <span className="font-semibold text-white/80">{nextLevelName}</span>:
      </p>

      <ol className="mt-2 space-y-1.5">
        {list.map((t, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span
              className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black text-white"
              style={{
                background:
                  "linear-gradient(135deg, #7B6EF6, #A098F8)",
              }}
            >
              {i + 1}
            </span>
            <span className="text-[10px] leading-snug text-white/85">{t}</span>
          </li>
        ))}
      </ol>

      <div className="mt-3 flex items-center justify-between rounded-md border border-[#A098F8]/20 bg-[#7B6EF6]/10 px-2.5 py-1.5">
        <span
          className="text-[8px] font-semibold uppercase text-[#A098F8]"
          style={{ letterSpacing: "0.12em" }}
        >
          Current score
        </span>
        <span className="text-[12px] font-black text-white">{trustScore}/100</span>
      </div>
    </div>
  );
}

/* ========================================================================
   BlockchainProofCard (ref image: hash + Moonbeam explorer link)
   ======================================================================== */

function BlockchainProofCard({
  trustScore,
  level,
}: {
  trustScore: number;
  level: number;
}) {
  // Deterministic pseudo-hash for demo (never computed from PII).
  const hash =
    "0x" +
    (level * 7919 + trustScore * 104729)
      .toString(16)
      .padStart(6, "0") +
    "a9e42f8c7b6d01e8";

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]/70 backdrop-blur-xl p-4 pt-[22px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(43,191,160,0.10), rgba(19,22,42,0.88))",
      }}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #2BBFA0, transparent)" }} />
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "rgba(43,191,160,0.16)",
            border: "1px solid rgba(43,191,160,0.4)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2BBFA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="6" height="10" rx="1"/><rect x="16" y="7" width="6" height="10" rx="1"/><path d="M8 12h8"/><path d="M8 9h8"/><path d="M8 15h8"/></svg>
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="text-[9px] font-semibold uppercase text-[#2BBFA0]"
            style={{ letterSpacing: "0.16em" }}
          >
            Blockchain Proof
          </p>
          <h3 className="text-[11px] font-bold text-white">Confirmed on-chain</h3>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-white/5 bg-black/30 px-2.5 py-1.5">
        <p
          className="text-[8px] font-semibold uppercase text-white/45"
          style={{ letterSpacing: "0.12em" }}
        >
          STL proof hash
        </p>
        <p
          className="mt-0.5 truncate font-mono text-[10px] text-[#A098F8]"
          title={hash}
        >
          {hash}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between text-[9px] text-white/55">
        <span>Network · Moonbeam</span>
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2BBFA0]" />
          Confirmed
        </span>
      </div>

      <Link
        href="/dmo/blockchain-control"
        className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-[#2BBFA0]/40 bg-[#2BBFA0]/10 px-3 py-1.5 text-[10px] font-semibold text-[#5FDCBF] transition-colors hover:bg-[#2BBFA0]/20"
      >
        View on explorer →
      </Link>
    </div>
  );
}

/* ========================================================================
   FranchiseNetworkCard (ref image: Sub → Master verification)
   ======================================================================== */

function FranchiseNetworkCard({
  verified,
  pending,
}: {
  verified: number;
  pending: number;
}) {
  const total = verified + pending;
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]/70 backdrop-blur-xl p-4 pt-[22px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(240,160,48,0.10), rgba(19,22,42,0.88))",
      }}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #F0A030, transparent)" }} />
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "rgba(240,160,48,0.16)",
            border: "1px solid rgba(240,160,48,0.4)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F0A030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/></svg>
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="text-[9px] font-semibold uppercase text-[#F0A030]"
            style={{ letterSpacing: "0.16em" }}
          >
            Franchise Network
          </p>
          <h3 className="text-[11px] font-bold text-white">
            {total} nodes · {verified} verified
          </h3>
        </div>
      </div>

      {/* Tree rows */}
      <div className="mt-3 space-y-1.5">
        <NodeRow
          label="Sub Franchise"
          status={verified >= 1 ? "verified" : "pending"}
          detail={verified >= 1 ? "Verified" : "Awaiting inspection"}
        />
        <NodeRow
          label="Master Franchise"
          status={verified >= 2 ? "verified" : "pending"}
          detail={verified >= 2 ? "Verified" : "Pending review"}
          indent
        />
        <NodeRow
          label="Corporate"
          status={verified >= 3 ? "verified" : pending > 0 ? "pending" : "locked"}
          detail={verified >= 3 ? "Verified" : "Locked"}
          indent={2}
        />
      </div>

      <Link
        href="/dmo/franchise"
        className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-[#F0A030]/40 bg-[#F0A030]/10 px-3 py-1.5 text-[10px] font-semibold text-[#F5BB66] transition-colors hover:bg-[#F0A030]/20"
      >
        Open franchise →
      </Link>
    </div>
  );
}

function NodeRow({
  label,
  status,
  detail,
  indent = 0,
}: {
  label: string;
  status: "verified" | "pending" | "locked";
  detail: string;
  indent?: 0 | 1 | 2 | boolean;
}) {
  const sc = useSafeColor();
  const pad = typeof indent === "boolean" ? (indent ? 12 : 0) : indent * 12;
  const tone =
    status === "verified" ? "#38C878" : status === "pending" ? "#F0A030" : "#6B6F80";
  return (
    <div
      className="flex items-center gap-1.5 rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-1.5"
      style={{ marginLeft: pad }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: tone, boxShadow: `0 0 8px ${tone}aa` }}
      />
      <span className="flex-1 truncate text-[10px] text-white/85">{label}</span>
      <span className="shrink-0 text-[9px] font-semibold" style={{ color: sc(tone) }}>
        {detail}
      </span>
    </div>
  );
}

/* ========================================================================
   ActivitySummaryCard (ref image: tasks/refills/verifications + sparkline)
   ======================================================================== */

function ActivitySummaryCard({
  refills,
  requiredRefills,
  crbVerifications,
  requiredVerifications,
  complaints,
}: {
  refills: number;
  requiredRefills: number;
  crbVerifications: number;
  requiredVerifications: number;
  complaints: number;
}) {
  // Deterministic sparkline points (demo-only trend)
  const points = [4, 6, 5, 8, 7, 10, 9, 12, 11, 13, 14, 15];
  const spark = buildSparkline(points, 200, 40);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]/70 backdrop-blur-xl p-4 pt-[22px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(56,200,120,0.10), rgba(19,22,42,0.88))",
      }}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #38C878, transparent)" }} />
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "rgba(56,200,120,0.16)",
            border: "1px solid rgba(56,200,120,0.4)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#38C878" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="text-[9px] font-semibold uppercase text-[#38C878]"
            style={{ letterSpacing: "0.16em" }}
          >
            Activity Summary
          </p>
          <h3 className="text-[11px] font-bold text-white">Last 12 weeks</h3>
        </div>
      </div>

      <div className="mt-2.5">
        <svg width="100%" height="32" viewBox="0 0 200 32" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38C878" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38C878" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={spark.fill} fill="url(#sparkFill)" />
          <path d={spark.line} fill="none" stroke="#38C878" strokeWidth={1.4} />
        </svg>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
        <StatChip label="Refills" value={`${refills}/${requiredRefills}`} tone="#38C878" />
        <StatChip
          label="Verifications"
          value={`${crbVerifications}/${requiredVerifications}`}
          tone="#2BBFA0"
        />
        <StatChip
          label="Complaints"
          value={String(complaints)}
          tone={complaints > 0 ? "#F0A030" : "#38C878"}
        />
      </div>
    </div>
  );
}

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  const sc = useSafeColor();
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] px-1.5 py-1.5">
      <p className="text-[11px] font-black" style={{ color: sc(tone) }}>
        {value}
      </p>
      <p
        className="mt-0.5 text-[7px] font-semibold uppercase text-white/45"
        style={{ letterSpacing: "0.1em" }}
      >
        {label}
      </p>
    </div>
  );
}

function buildSparkline(values: number[], w: number, h: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const fill = `${line} L${w},${h} L0,${h} Z`;
  return { line, fill };
}

/* ========================================================================
   EarningsCard (ref image: +$132 today · +$50 bonus · -$23 penalty chart)
   ======================================================================== */

function EarningsCard() {
  const series = [40, 55, 48, 72, 80, 95, 110, 124, 132];
  const spark = buildSparkline(series, 320, 48);
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]/70 backdrop-blur-xl p-4 pt-[22px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(43,191,160,0.10), rgba(19,22,42,0.88))",
      }}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #2BBFA0, #38C878, transparent)" }} />
      <div className="flex items-start justify-between gap-2.5">
        <div>
          <p
            className="text-[9px] font-semibold uppercase text-[#2BBFA0]"
            style={{ letterSpacing: "0.16em" }}
          >
            Wallet · Earnings
          </p>
          <h3 className="mt-0.5 text-[12px] font-bold text-white">
            Today&apos;s trust rewards
          </h3>
        </div>
        <Link
          href="/dmo/wallet"
          className="rounded-full border border-[#2BBFA0]/40 bg-[#2BBFA0]/10 px-2.5 py-0.5 text-[9px] font-semibold text-[#5FDCBF]"
        >
          Wallet →
        </Link>
      </div>

      <div className="mt-3 flex items-end gap-4">
        <div>
          <p className="text-[8px] font-semibold uppercase text-white/55" style={{ letterSpacing: "0.12em" }}>
            Net today
          </p>
          <p className="mt-0.5 text-[22px] font-black text-white leading-none">
            +$132<span className="text-[11px] font-semibold text-white/50">.00</span>
          </p>
        </div>
        <div className="flex-1">
          <svg width="100%" height="48" viewBox="0 0 320 48" preserveAspectRatio="none">
            <defs>
              <linearGradient id="earnFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2BBFA0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#2BBFA0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={spark.fill} fill="url(#earnFill)" />
            <path d={spark.line} fill="none" stroke="#2BBFA0" strokeWidth={1.6} />
          </svg>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <DeltaChip label="Base" value="+$105" tone="#38C878" />
        <DeltaChip label="Bonus" value="+$50" tone="#A098F8" />
        <DeltaChip label="Penalty" value="−$23" tone="#F05858" />
      </div>
    </div>
  );
}

function DeltaChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  const sc = useSafeColor();
  return (
    <div
      className="rounded-md border px-2 py-1.5"
      style={{
        borderColor: `${tone}40`,
        background: `${tone}10`,
      }}
    >
      <p className="text-[11px] font-black" style={{ color: sc(tone) }}>
        {value}
      </p>
      <p
        className="mt-0.5 text-[7px] font-semibold uppercase text-white/50"
        style={{ letterSpacing: "0.1em" }}
      >
        {label}
      </p>
    </div>
  );
}

/* ========================================================================
   BenefitsLadder (ref image: EHB-STL Benefits list)
   ======================================================================== */

const STL_BENEFITS = [
  { level: 3, text: "Higher sales & marketplace visibility" },
  { level: 4, text: "Lower commission rates on transactions" },
  { level: 5, text: "Priority support + promoted listings" },
  { level: 6, text: "Multi-franchise management unlock" },
  { level: 7, text: "VIP dashboard + custom AI insights" },
  { level: 8, text: "SUPREME — ecosystem governance vote" },
];

function BenefitsLadder({ currentLevel }: { currentLevel: number }) {
  const sc = useSafeColor();
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#13162A]/70 backdrop-blur-xl p-4 pt-[22px]">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #A098F8, #7B6EF6, transparent)" }} />
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            background: "rgba(160,152,248,0.18)",
            border: "1px solid rgba(160,152,248,0.4)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A098F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17.75l-6.172 3.245 1.179-6.873-5-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-5 4.867 1.179 6.873z"/></svg>
        </span>
        <div>
          <p
            className="text-[9px] font-semibold uppercase text-[#A098F8]"
            style={{ letterSpacing: "0.16em" }}
          >
            EHB-STL Benefits
          </p>
          <h3 className="text-[11px] font-bold text-white">Unlocks per level</h3>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        {STL_BENEFITS.map((b) => {
          const unlocked = currentLevel >= b.level;
          const tone = unlocked ? "#38C878" : "rgba(255,255,255,0.35)";
          return (
            <li
              key={b.level}
              className="flex items-center gap-2 rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-1.5"
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[8px] font-black"
                style={{
                  background: unlocked ? "rgba(56,200,120,0.18)" : "rgba(255,255,255,0.05)",
                  border: unlocked
                    ? "1px solid rgba(56,200,120,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                  color: tone,
                }}
              >
                L{b.level}
              </span>
              <span
                className="flex-1 text-[10px]"
                style={{ color: unlocked ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)" }}
              >
                {b.text}
              </span>
              <span
                className="text-[8px] font-semibold uppercase"
                style={{ color: sc(tone), letterSpacing: "0.1em" }}
              >
                {unlocked ? "Unlocked" : "Locked"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
