"use client";

/**
 * DMO workspace shell — Phase 8 Silver Chrome theme (2026-04-11, v1.6).
 *
 * Layout:
 *   ┌────────────────┬──────────────────────────────────────────────┐
 *   │                │  Topbar (breadcrumb + live + action buttons) │
 *   │                ├──────────────────────────────────────────────┤
 *   │   Sidebar      │  Sub-nav (current module's sub-pages pills)  │
 *   │   (grouped     ├──────────────────────────────────────────────┤
 *   │    modules)    │                                              │
 *   │                │               Module content                 │
 *   │                │                                              │
 *   └────────────────┴──────────────────────────────────────────────┘
 *
 * Theme: `.ehb-silver-bg` — procedural liquid silver chrome surface
 * rendered from `public/ehb-silver-chrome.svg` with iridescent brand
 * overlays + a dark vignette so the dark glass cards + obsidian hero
 * remain readable on top. Requested by Rafi with the reference
 * silver liquid wave image ("new theam lgain is picture ko background
 * man use krain"). Previous `.ehb-premium-bg` near-black theme is still
 * defined in globals.css for rollback.
 *
 * The drifting ambient orbs (§7.12) have been retuned to richer opacity
 * so they still register over the brighter chrome surface.
 */

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { DmoSidebar } from "@/components/dmo/DmoSidebar";
import { DmoTopbar } from "@/components/dmo/DmoTopbar";
import { DmoTopSubNav } from "@/components/dmo/DmoTopSubNav";
import { DmoThemeProvider, useEhbTheme } from "@/components/dmo/DmoThemeProvider";
import { DmoThemeSwitcher } from "@/components/dmo/DmoThemeSwitcher";
import { THEME_TOKENS } from "@/lib/dmo/theme";
import {
  DMO_NAV_GROUPS,
  DMO_NAV_SECTIONS,
  getDmoSectionKeyFromPathname,
} from "@/components/dmo/navigation";

/* ------------------------------------------------------------------ */
/* Inner shell (needs theme context to read current theme)             */
/* ------------------------------------------------------------------ */

function DmoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const { theme } = useEhbTheme();
  const tokens = THEME_TOKENS[theme];

  const activeSectionKey = useMemo(() => getDmoSectionKeyFromPathname(pathname), [pathname]);

  const selectedSection =
    DMO_NAV_SECTIONS.find((section) => section.key === activeSectionKey) ?? DMO_NAV_SECTIONS[0];

  const selectedGroup =
    DMO_NAV_GROUPS.find((g) => g.key === selectedSection?.groupKey) ?? null;

  return (
    <div
      className="ehb-silver-bg relative isolate flex min-h-screen"
      style={{ backgroundColor: tokens.bg, color: tokens.text }}
    >
      {/* Ambient cinematic background layer — fixed so every sub-page inherits it */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={{ isolation: "isolate" }}
      >
        <div className="ehb-orb ehb-orb-a" />
        <div className="ehb-orb ehb-orb-b" />
        <div className="ehb-scan" />
      </div>

      {/* Sidebar — sticky, hidden on very small screens */}
      <div className="ehb-sidebar relative z-20 sticky top-0 hidden h-screen w-[272px] shrink-0 p-3 sm:block">
        <DmoSidebar selectedSectionKey={activeSectionKey} />
      </div>

      {/* Main column */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Topbar + sub-nav — translucent, theme-aware */}
        <div
          className="sticky top-0 z-40 border-b backdrop-blur-xl"
          style={{
            background: tokens.topbarBg,
            boxShadow: tokens.topbarShadow,
            borderColor: tokens.border,
          }}
        >
          <div className="container-ehb flex items-center justify-between gap-3 py-3">
            <DmoTopbar group={selectedGroup} section={selectedSection ?? null} />
            <DmoThemeSwitcher />
          </div>
          {selectedSection ? (
            <DmoTopSubNav section={selectedSection} pathname={pathname} />
          ) : null}
        </div>

        {/* Module content */}
        <div className="container-ehb flex-1 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root layout — wraps everything with the theme provider              */
/* ------------------------------------------------------------------ */

export default function DmoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DmoThemeProvider>
      <DmoShell>{children}</DmoShell>
    </DmoThemeProvider>
  );
}
