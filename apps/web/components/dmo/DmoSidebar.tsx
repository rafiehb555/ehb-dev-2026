"use client";

/**
 * DMO sidebar — Phase 1 rebuild (2026-04-11).
 *
 * Renders the canonical 18 DMO modules in 4 grouped sections (Overview,
 * Verification, Operations, Intelligence). Uses EHB dark-glass design tokens
 * (DM Sans inherited from root, #13162A card, #7B6EF6 purple for active,
 * #2BBFA0 teal tint for verification group).
 *
 * Rationale: the old flat 15-item list didn't match CLAUDE.md canonical naming
 * and mixed operations with intelligence. The new grouped version matches the
 * DMO-DEVELOPMENT-PHASES.md plan and lets operators scan modules by purpose.
 */

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  DMO_NAV_GROUPS,
  DMO_NAV_SECTIONS,
  getDmoSectionKeyFromPathname,
  groupDmoSections,
  type DmoNavSection,
} from "./navigation";

type DmoSidebarProps = {
  badges?: Record<string, number>;
  className?: string;
  selectedSectionKey?: string | null;
};

export function DmoSidebar(props: DmoSidebarProps) {
  const pathname = usePathname() ?? "";

  const activeModuleKey = useMemo(
    () => props.selectedSectionKey ?? getDmoSectionKeyFromPathname(pathname),
    [pathname, props.selectedSectionKey]
  );

  const grouped = useMemo(() => groupDmoSections(DMO_NAV_SECTIONS), []);

  return (
    <aside className={props.className ?? ""}>
      <div className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-[#13162A]/85 p-3 shadow-[0_0_40px_-20px_rgba(123,110,246,0.45)] backdrop-blur-xl">
        {/* Brand / workspace header */}
        <div className="mb-3 flex items-center gap-2 px-1">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#7B6EF6] via-[#A098F8] to-[#2BBFA0]">
            <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
              E
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">EHB Workspace</div>
            <div className="truncate text-sm font-semibold text-white">DMO Control</div>
          </div>
        </div>

        {/* Scrollable module list, grouped */}
        <nav
          className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-0.5"
          aria-label="DMO modules"
        >
          {DMO_NAV_GROUPS.map((group) => {
            const sections = grouped.find((g) => g.key === group.key)?.sections ?? [];
            if (sections.length === 0) return null;
            return (
              <div key={group.key} className="space-y-1">
                <div className={`px-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${group.tint}`}>
                  {group.label}
                </div>
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.key}>
                      <DmoSidebarLink
                        section={section}
                        isActive={section.key === activeModuleKey}
                        badge={props.badges?.[section.key] ?? 0}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Footer pulse */}
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38C878] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38C878]" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/60">Live</span>
          <span className="ml-auto text-[10px] text-white/45">v1.0 · Phase 1</span>
        </div>
      </div>
    </aside>
  );
}

function DmoSidebarLink({
  section,
  isActive,
  badge,
}: {
  section: DmoNavSection;
  isActive: boolean;
  badge: number;
}) {
  return (
    <Link
      href={section.href}
      className={[
        "group flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left text-xs transition-all",
        isActive
          ? "border-[#7B6EF6]/45 bg-gradient-to-r from-[#7B6EF6]/18 via-[#A098F8]/12 to-transparent text-white shadow-[0_0_24px_-10px_rgba(123,110,246,0.7)]"
          : "border-transparent text-white/65 hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >
      <span className="text-base leading-none" aria-hidden>
        {section.icon}
      </span>
      <span className="min-w-0 flex-1 truncate font-medium leading-snug">{section.label}</span>
      {badge > 0 ? (
        <span className="shrink-0 rounded-full border border-[#F0A030]/40 bg-[#F0A030]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#F0A030]">
          {badge}
        </span>
      ) : isActive ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7B6EF6] shadow-[0_0_8px_rgba(123,110,246,0.9)]" />
      ) : null}
    </Link>
  );
}
