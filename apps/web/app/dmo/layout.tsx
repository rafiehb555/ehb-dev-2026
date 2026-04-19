"use client";

/**
 * DMO Workspace Layout — Phase 1 Foundation (2026-04-19).
 *
 * Responsive layout structure:
 *   Desktop (lg+):
 *     ┌─────────────┬─────────────────────────────┐
 *     │             │  Topbar (sticky)            │
 *     │  Sidebar    ├─────────────────────────────┤
 *     │  (fixed)    │  Sub-nav (modules pills)    │
 *     │             ├─────────────────────────────┤
 *     │             │  Content (scrollable)       │
 *     └─────────────┴─────────────────────────────┘
 *
 *   Mobile (sm):
 *     ┌───────────────────────────┐
 *     │  Topbar (sticky)          │
 *     ├───────────────────────────┤
 *     │  Content (scrollable)     │
 *     ├───────────────────────────┤
 *     │  Mobile Bottom Nav        │
 *     │  (5 tabs)                 │
 *     └───────────────────────────┘
 *
 * Features:
 *   - DmoThemeProvider: theme context for light/dark mode
 *   - Sidebar: left fixed navigation (collapsible on desktop)
 *   - Topbar: sticky top with breadcrumb + search + actions
 *   - DmoTopSubNav: module-specific sub-navigation pills
 *   - DmoMobileNav: bottom navigation for mobile
 *   - CSS Grid responsive layout
 *   - Page mesh background
 */

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { DmoSidebar } from "@/components/dmo/DmoSidebar";
import { DmoTopbar } from "@/components/dmo/DmoTopbar";
import { DmoMobileNav } from "@/components/dmo/DmoMobileNav";
import { DmoTopSubNav } from "@/components/dmo/DmoTopSubNav";
import { DmoThemeProvider, useEhbTheme } from "@/components/dmo/DmoThemeProvider";
import { DmoThemeSwitcher } from "@/components/dmo/DmoThemeSwitcher";
import { THEME_TOKENS } from "@/lib/dmo/theme";
import {
  DMO_NAV_GROUPS,
  DMO_NAV_SECTIONS,
  getDmoSectionKeyFromPathname,
} from "@/components/dmo/navigation";

/**
 * Inner shell — requires theme context
 */
function DmoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const { theme } = useEhbTheme();
  const tokens = THEME_TOKENS[theme];
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const activeSectionKey = useMemo(
    () => getDmoSectionKeyFromPathname(pathname),
    [pathname]
  );

  const selectedSection =
    DMO_NAV_SECTIONS.find((section) => section.key === activeSectionKey) ??
    DMO_NAV_SECTIONS[0];

  const selectedGroup =
    DMO_NAV_GROUPS.find((g) => g.key === selectedSection?.groupKey) ?? null;

  return (
    <div
      className="ehb-silver-bg relative isolate min-h-screen bg-[#0C0E1A]"
      style={{ backgroundColor: tokens.bg, color: tokens.text }}
    >
      {/* Ambient background layer — fixed */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={{ isolation: "isolate" }}
      >
        <div className="ehb-orb ehb-orb-a" />
        <div className="ehb-orb ehb-orb-b" />
        <div className="ehb-scan" />
      </div>

      {/* Main layout grid: sidebar + main column */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar (desktop only) */}
        <div className="hidden lg:block">
          <div
            className={[
              "sticky top-0 h-screen transition-all duration-300",
              isSidebarCollapsed ? "w-[72px]" : "w-[260px]",
            ].join(" ")}
          >
            <DmoSidebar
              selectedSectionKey={activeSectionKey}
              onCollapsedChange={setIsSidebarCollapsed}
            />
          </div>
        </div>

        {/* Mobile sidebar (overlay) */}
        <div className="lg:hidden">
          <DmoSidebar selectedSectionKey={activeSectionKey} />
        </div>

        {/* Main content column */}
        <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
          {/* Sticky topbar */}
          <div
            className="sticky top-0 z-40 border-b backdrop-blur-xl"
            style={{
              background: tokens.topbarBg,
              boxShadow: tokens.topbarShadow,
              borderColor: tokens.border,
            }}
          >
            <div className="container-ehb flex items-center justify-between gap-3 py-3">
              <DmoTopbar
                group={selectedGroup}
                section={selectedSection ?? null}
              />
              <DmoThemeSwitcher />
            </div>

            {/* Sub-navigation pills (module-specific) */}
            {selectedSection ? (
              <DmoTopSubNav section={selectedSection} pathname={pathname} />
            ) : null}
          </div>

          {/* Page mesh background + content */}
          <div className="page-mesh relative flex-1 overflow-y-auto">
            <div className="container-ehb py-5">{children}</div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <DmoMobileNav />
    </div>
  );
}

/**
 * Root layout — wraps everything with the theme provider
 */
export default function DmoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DmoThemeProvider>
      <DmoShell>{children}</DmoShell>
    </DmoThemeProvider>
  );
}
