"use client";

/**
 * DMO Sidebar — Phase 1 Foundation Layout (2026-04-19).
 *
 * Features:
 *   - Collapsible sidebar (expanded/collapsed icon-only mode)
 *   - Mobile: slide-out drawer with backdrop overlay
 *   - Desktop: fixed left sidebar 260px wide (72px collapsed)
 *   - Module items: icon + label + optional badge
 *   - Active item: purple glow highlight
 *   - Group headers: colored tint labels
 *   - Bottom: user avatar + role + live indicator
 *   - Smooth expand/collapse animation
 *   - Search/filter modules input at top
 */

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
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
  onCollapsedChange?: (collapsed: boolean) => void;
};

export function DmoSidebar(props: DmoSidebarProps) {
  const pathname = usePathname() ?? "";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeModuleKey = useMemo(
    () => props.selectedSectionKey ?? getDmoSectionKeyFromPathname(pathname),
    [pathname, props.selectedSectionKey]
  );

  const grouped = useMemo(() => groupDmoSections(DMO_NAV_SECTIONS), []);

  // Filter sections based on search
  const filteredGrouped = useMemo(() => {
    if (!searchFilter.trim()) return grouped;
    const query = searchFilter.toLowerCase();
    return grouped.map((group) => ({
      ...group,
      sections: group.sections.filter(
        (section) =>
          section.label.toLowerCase().includes(query) ||
          section.items.some((item) => item.label.toLowerCase().includes(query))
      ),
    }));
  }, [grouped, searchFilter]);

  useEffect(() => {
    props.onCollapsedChange?.(isCollapsed);
  }, [isCollapsed, props]);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={[
          "fixed left-0 top-0 h-screen transition-all duration-300 z-40 lg:relative lg:z-20",
          isMobileOpen ? "w-[260px]" : "w-0 lg:w-[260px]",
          isCollapsed && "lg:w-[72px]",
          props.className ?? "",
        ].join(" ")}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-none rounded-r-2xl border-r border-white/8 bg-[#13162A]/95 p-3 shadow-2xl backdrop-blur-xl lg:rounded-2xl lg:border">
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#7B6EF6] via-[#A098F8] to-[#2BBFA0]">
                <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
                  E
                </div>
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                    EHB Workspace
                  </div>
                  <div className="truncate text-sm font-semibold text-white">
                    DMO Control
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white placeholder-white/40 transition-all focus:border-[#7B6EF6]/50 focus:outline-none focus:ring-1 focus:ring-[#7B6EF6]/30"
                />
              </div>
            )}
          </div>

          <nav
            className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-0.5 py-4"
            aria-label="DMO modules"
          >
            {filteredGrouped.map((group) => {
              if (group.sections.length === 0) return null;
              return (
                <div key={group.key} className="space-y-1">
                  {!isCollapsed && (
                    <div
                      className={`px-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${group.tint}`}
                    >
                      {group.label}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {group.sections.map((section) => (
                      <li key={section.key}>
                        <DmoSidebarLink
                          section={section}
                          isActive={section.key === activeModuleKey}
                          badge={props.badges?.[section.key] ?? 0}
                          isCollapsed={isCollapsed}
                          onMobileNav={() => setIsMobileOpen(false)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-white/8 pt-3">
            {!isCollapsed && (
              <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#7B6EF6] to-[#2BBFA0]">
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                    R
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                    Admin
                  </div>
                  <div className="truncate text-xs font-semibold text-white">
                    Rafi Khan
                  </div>
                </div>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-[#38C878]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38C878]" />
                </span>
              </div>
            )}

            {isCollapsed && (
              <div className="flex items-center justify-center">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-[#38C878]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38C878]" />
                </span>
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 transition-all hover:border-[#7B6EF6]/40 hover:bg-[#7B6EF6]/12 hover:text-[#7B6EF6]"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? "▶" : "◀"}
            </button>
          </div>
        </div>
      </aside>

      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-6 left-6 z-50 hidden rounded-lg bg-[#7B6EF6] p-3 text-white shadow-lg hover:bg-[#7B6EF6]/90 sm:hidden"
        aria-label="Toggle sidebar"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
    </>
  );
}

function DmoSidebarLink({
  section,
  isActive,
  badge,
  isCollapsed,
  onMobileNav,
}: {
  section: DmoNavSection;
  isActive: boolean;
  badge: number;
  isCollapsed: boolean;
  onMobileNav: () => void;
}) {
  return (
    <Link
      href={section.href}
      onClick={onMobileNav}
      className={[
        "group flex items-center justify-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-xs transition-all",
        isActive
          ? "border-[#7B6EF6]/45 bg-gradient-to-r from-[#7B6EF6]/18 via-[#A098F8]/12 to-transparent text-white shadow-[0_0_20px_-8px_rgba(123,110,246,0.8)]"
          : "border-transparent text-white/65 hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
        isCollapsed ? "flex-col py-3" : "",
      ].join(" ")}
      title={isCollapsed ? section.label : undefined}
    >
      <span className="text-base leading-none" aria-hidden>
        {section.icon}
      </span>
      {!isCollapsed && (
        <>
          <span className="min-w-0 flex-1 truncate font-medium leading-snug">
            {section.label}
          </span>
          {badge > 0 ? (
            <span className="shrink-0 rounded-full border border-[#F0A030]/40 bg-[#F0A030]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#F0A030]">
              {badge}
            </span>
          ) : isActive ? (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7B6EF6] shadow-[0_0_8px_rgba(123,110,246,0.9)]" />
          ) : null}
        </>
      )}
      {isCollapsed && isActive && (
        <span className="absolute right-0 h-1.5 w-1.5 rounded-full bg-[#7B6EF6]" />
      )}
    </Link>
  );
}
