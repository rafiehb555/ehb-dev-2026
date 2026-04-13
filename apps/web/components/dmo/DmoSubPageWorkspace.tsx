"use client";

/**
 * DMO — Nested Sub-page Catch-All
 *
 * Handles ALL /dmo/{module}/{sub-path} routes referenced in navigation.tsx
 * that don't have dedicated page files. Renders a contextual workspace
 * with module-aware breadcrumbs, section info, and coming-soon state.
 *
 * DESIGN-ONLY — VerificationUI primitives, no fetch, no backend wiring.
 */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  VerificationChip,
  SectionHeader,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";
import {
  DMO_NAV_SECTIONS,
  type DmoNavSection,
} from "@/components/dmo/navigation";

/* ── Module accent map ── */
const MODULE_TONE: Record<string, { tone: VerificationTone; accent: string; border: string }> = {
  stl:               { tone: "teal",   accent: "#2BBFA0", border: "border-[#2BBFA0]/30" },
  pss:               { tone: "cyan",   accent: "#67E8F9", border: "border-cyan-400/30" },
  crb:               { tone: "purple", accent: "#A098F8", border: "border-[#A098F8]/30" },
  "up-guard":        { tone: "amber",  accent: "#F0A030", border: "border-[#F0A030]/30" },
  applications:      { tone: "teal",   accent: "#2BBFA0", border: "border-[#2BBFA0]/30" },
  approvals:         { tone: "green",  accent: "#38C878", border: "border-[#38C878]/30" },
  "wallet-control":  { tone: "amber",  accent: "#F0A030", border: "border-[#F0A030]/30" },
  "earnings-engine": { tone: "green",  accent: "#38C878", border: "border-[#38C878]/30" },
  "refill-management": { tone: "cyan", accent: "#67E8F9", border: "border-cyan-400/30" },
  complaints:        { tone: "red",    accent: "#F05858", border: "border-[#F05858]/30" },
  franchise:         { tone: "amber",  accent: "#F0A030", border: "border-[#F0A030]/30" },
  "activity-engine": { tone: "teal",   accent: "#2BBFA0", border: "border-[#2BBFA0]/30" },
  "task-system":     { tone: "purple", accent: "#A098F8", border: "border-[#A098F8]/30" },
  "ai-assistant":    { tone: "teal",   accent: "#2BBFA0", border: "border-[#2BBFA0]/30" },
  analytics:         { tone: "purple", accent: "#A098F8", border: "border-[#A098F8]/30" },
  "blockchain-control": { tone: "teal", accent: "#2BBFA0", border: "border-[#2BBFA0]/30" },
  notifications:     { tone: "red",    accent: "#F05858", border: "border-[#F05858]/30" },
  settings:          { tone: "purple", accent: "#A098F8", border: "border-[#A098F8]/30" },
};

const DEFAULT_THEME = { tone: "cyan" as VerificationTone, accent: "#67E8F9", border: "border-cyan-400/30" };

function humanize(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ── Sibling link item ── */
function SiblingCard({
  label,
  href,
  active,
  accent,
}: {
  label: string;
  href: string;
  active: boolean;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "group relative overflow-hidden rounded-xl border px-4 py-3 transition-all duration-200",
        active
          ? "border-white/20 bg-white/[0.06]"
          : "border-white/10 bg-[#1A1D33]/80 hover:-translate-y-[1px] hover:border-white/20",
      ].join(" ")}
    >
      {active && (
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      )}
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-[10px] text-white/40 transition-colors group-hover:text-white/60">
        {active ? "Current view" : "Open view"}
      </p>
    </Link>
  );
}

export default function DmoSubPageWorkspace() {
  const params = useParams<{ section: string; sub: string[] }>();
  const section = params.section;
  const subPath = params.sub?.join("/") ?? "";

  const { navSection, theme, subLabel, currentHref, siblings } = useMemo(() => {
    const mod = MODULE_TONE[section] ?? DEFAULT_THEME;
    const nav: DmoNavSection | undefined = DMO_NAV_SECTIONS.find((s) => s.key === section);
    const fullHref = `/dmo/${section}/${subPath}`;
    const matchedItem = nav?.items.find((i) => i.href === fullHref);
    const label = matchedItem?.label ?? humanize(subPath.split("/").pop() ?? section);
    const sibs = nav?.items ?? [];
    return { navSection: nav, theme: mod, subLabel: label, currentHref: fullHref, siblings: sibs };
  }, [section, subPath]);

  const moduleLabel = navSection?.label ?? humanize(section);

  return (
    <div className="space-y-6">
      {/* ── Hero header ── */}
      <header
        className={`relative overflow-hidden rounded-2xl ${theme.border} bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]`}
      >
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${theme.accent} 30%, #7B6EF6 60%, transparent 100%)`,
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px]" style={{ borderColor: `${theme.accent}50` }} />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${theme.accent}20, transparent 70%)` }}
        />

        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 transition-colors hover:text-white/70">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href={navSection?.href ?? `/dmo/${section}`} className="text-white/40 transition-colors hover:text-white/70">{moduleLabel}</Link>
              <span className="text-white/25">/</span>
              <span style={{ color: theme.accent }}>{subLabel}</span>
            </div>

            <h1 className="text-2xl font-bold text-white md:text-3xl">{subLabel}</h1>
            <p className="max-w-2xl text-sm text-white/65">
              {moduleLabel} — {subLabel} view. Backend wiring pending — layout aur structure
              ready hai, API connect hone ke baad live data show hoga.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={navSection?.href ?? `/dmo/${section}`}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              Back to {moduleLabel}
            </Link>
            <Link
              href="/dmo"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ── Sibling navigation ── */}
      {siblings.length > 0 && (
        <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
          <SectionHeader
            eyebrow={moduleLabel}
            title="Module views"
            hint={`${siblings.length} view${siblings.length !== 1 ? "s" : ""} available`}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {siblings.map((s) => (
              <SiblingCard
                key={s.key}
                label={s.label}
                href={s.href}
                active={s.href === currentHref}
                accent={theme.accent}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Workspace placeholder ── */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/70 p-8 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
        />

        <div className="flex flex-col items-center justify-center py-12 text-center">
          {/* Module icon */}
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl border"
            style={{
              borderColor: `${theme.accent}40`,
              background: `${theme.accent}12`,
              color: theme.accent,
            }}
          >
            {navSection?.icon ?? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            )}
          </div>

          <h2 className="mt-4 text-lg font-semibold text-white">{subLabel}</h2>
          <p className="mt-2 max-w-md text-sm text-white/55">
            Ye view backend API connect hone ke baad populate hogi. Layout structure ready hai —
            data endpoints wire karne se live content dikhay ga.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <VerificationChip tone={theme.tone}>UI Ready</VerificationChip>
            <VerificationChip tone="amber">Backend Pending</VerificationChip>
          </div>

          {/* Quick info grid */}
          <div className="mt-8 grid w-full max-w-lg gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-left">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Module</p>
              <p className="mt-1 text-sm text-white/80">{moduleLabel}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-left">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">View</p>
              <p className="mt-1 text-sm text-white/80">{subLabel}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-left">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Route</p>
              <p className="mt-1 font-mono text-[11px] text-white/60">{currentHref}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-left">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Status</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: theme.accent }}>Prototype</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
