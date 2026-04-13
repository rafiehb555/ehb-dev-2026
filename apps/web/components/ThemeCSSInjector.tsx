"use client";

/**
 * ThemeCSSInjector — Injects theme-aware CSS overrides into the document.
 *
 * This component renders a <style> tag that targets `html[data-ehb-theme="X"]`
 * for all 4 themes. It must be placed in the ROOT layout so theme overrides
 * apply everywhere — not just on DMO pages.
 *
 * The actual theme state (data-ehb-theme attribute + localStorage) is managed
 * by either DmoThemeProvider (on DMO pages) or GlobalThemeSwitcher (everywhere).
 * This component ONLY provides the CSS — no state management.
 */

import { useMemo } from "react";
import { type EhbTheme, THEME_TOKENS } from "@/lib/dmo/theme";

function buildThemeCSS(): string {
  const css: string[] = [];

  // Custom properties (all themes)
  for (const [key, t] of Object.entries(THEME_TOKENS)) {
    css.push(`[data-ehb-theme="${key}"] {
  --ehb-bg:${t.bg}; --ehb-card:${t.card}; --ehb-nested:${t.nested};
  --ehb-text:${t.text}; --ehb-text-sec:${t.textSecondary}; --ehb-text-mut:${t.textMuted};
  --ehb-border:${t.border}; --ehb-border-h:${t.borderHover}; --ehb-div:${t.divider};
  --ehb-accent:${t.accentPrimary}; --ehb-accent2:${t.accentSecondary};
}`);
  }

  // Per-theme overrides
  for (const tk of ["white", "purple", "midnight", "dark"] as EhbTheme[]) {
    const t = THEME_TOKENS[tk];
    const S = `html[data-ehb-theme="${tk}"]`;

    css.push(`\n/* ═══ ${tk.toUpperCase()} ═══ */`);

    /* ── LEVEL 0: html, body, page-mesh ── */
    css.push(`${S} { background-color:${t.pageMeshBg}!important; }`);
    css.push(`${S} body { background-color:${t.pageMeshBg}!important; color:${t.text}!important; }`);
    css.push(`${S} .page-mesh {
  background-color:${t.pageMeshBg}!important;
  background-image:
    linear-gradient(${t.pageMeshGrid} 1px,transparent 1px),
    linear-gradient(90deg,${t.pageMeshGrid} 1px,transparent 1px),
    radial-gradient(ellipse 100% 80% at 50% 40%,${t.pageMeshGlow},transparent 55%)!important;
}`);

    /* ── LEVEL 1: nav-glass ── */
    css.push(`${S} .nav-glass {
  background:${t.navGlassBg}!important;
  border-color:${t.navGlassBorder}!important;
  box-shadow:0 1px 0 0 ${t.navGlassBorder}!important;
}`);

    /* ── LEVEL 2: ehb-silver-bg ── */
    css.push(`${S} .ehb-silver-bg {
  background-color:${t.bg}!important;
  background-image:none!important;
  animation:none!important;
}`);

    /* ── LEVEL 3: Card backgrounds — use `background` shorthand to override inline gradients ── */
    for (const op of ["", "/70", "/80", "/85", "/90", "/95"]) {
      const esc = op.replace("/", "\\/");
      css.push(`${S} .bg-\\[\\#13162A\\]${esc} { background:${t.card}!important; }`);
    }
    for (const op of ["", "/70", "/80", "/85"]) {
      const esc = op.replace("/", "\\/");
      css.push(`${S} .bg-\\[\\#1A1D33\\]${esc} { background:${t.nested}!important; }`);
    }
    css.push(`${S} .bg-\\[\\#0C0E1A\\], ${S} .bg-\\[\\#0C0E1A\\]\\/80 { background:${t.bg}!important; }`);
    css.push(`${S} .bg-\\[\\#0d1017\\] { background:${t.bg}!important; }`);

    /* ── Hero section (rounded-[16px] cards with inline dark gradients) ── */
    css.push(`${S} section.rounded-\\[16px\\] { background:${t.card}!important; box-shadow:0 8px 32px ${t.overlay}!important; }`);

    /* ── Profile / user cards with inline dark rgba ── */
    css.push(`${S} .rounded-full[style*="linear-gradient(135deg, #1A1D33"] { background:${t.nested}!important; }`);

    /* ── Header gradients ── */
    css.push(`${S} .from-\\[\\#13162A\\] { --tw-gradient-from:${t.headerFrom}!important; }`);
    css.push(`${S} .via-\\[\\#1A1D33\\] { --tw-gradient-via:${t.headerVia}!important; --tw-gradient-stops:var(--tw-gradient-from),${t.headerVia},var(--tw-gradient-to)!important; }`);
    css.push(`${S} .to-\\[\\#13162A\\] { --tw-gradient-to:${t.headerTo}!important; }`);

    /* ── Stat cards ── */
    css.push(`${S} .ehb-vstat { background-color:${t.card}!important; border-color:${t.border}!important; }`);

    /* ── Sidebar ── */
    css.push(`${S} .ehb-sidebar > div, ${S} .ehb-sidebar aside > div { background:${t.sidebarBg}!important; border-color:${t.sidebarBorder}!important; box-shadow:none!important; }`);

    /* ── Ambient orbs ── */
    css.push(`${S} .ehb-orb-a { background:radial-gradient(circle,${t.orbA} 0%,transparent 70%)!important; }`);
    css.push(`${S} .ehb-orb-b { background:radial-gradient(circle,${t.orbB} 0%,transparent 70%)!important; }`);

    /* ── Borders ── */
    css.push(`${S} .border-white\\/10 { border-color:${t.border}!important; }`);
    css.push(`${S} .border-white\\/20 { border-color:${t.borderHover}!important; }`);
    css.push(`${S} .border-white\\/5, ${S} .border-white\\/8 { border-color:${t.divider}!important; }`);
    css.push(`${S} .border-white\\/15, ${S} .border-white\\/12, ${S} .border-white\\/25 { border-color:${t.borderHover}!important; }`);

    /* ── bg-white/* subtle fills ── */
    css.push(`${S} .bg-white\\/\\[0\\.02\\], ${S} .bg-white\\/\\[0\\.03\\] { background-color:${t.divider}!important; }`);
    css.push(`${S} .bg-white\\/\\[0\\.04\\], ${S} .bg-white\\/\\[0\\.05\\] { background-color:${t.border}!important; }`);
    css.push(`${S} .bg-white\\/\\[0\\.06\\], ${S} .bg-white\\/\\[0\\.07\\], ${S} .bg-white\\/\\[0\\.08\\] { background-color:${t.borderHover}!important; }`);
    css.push(`${S} .bg-white\\/5 { background-color:${t.divider}!important; }`);
    css.push(`${S} .bg-white\\/10 { background-color:${t.border}!important; }`);
    css.push(`${S} .bg-white\\/8 { background-color:${t.divider}!important; }`);

    /* ── bg-black overrides ── */
    css.push(`${S} .bg-black\\/30, ${S} .bg-black\\/40, ${S} .bg-black\\/50 { background-color:${t.overlay}!important; }`);

    /* ── Input ── */
    css.push(`${S} input, ${S} textarea, ${S} select { background-color:${t.inputBg}!important; border-color:${t.inputBorder}!important; color:${t.text}!important; }`);

    /* ── Scrollbar ── */
    css.push(`${S} ::-webkit-scrollbar-thumb { background:${t.scrollThumb}!important; }`);

    /* ── Text overrides (text-white variants) ── */
    css.push(`${S} .text-white { color:${t.text}!important; }`);

    /**
     * For White theme: boost opacity so dark text on white bg stays readable.
     * Original alpha 25-55% → boosted to at least 60%.
     * For other themes: invert color channel but keep alpha as-is.
     */
    const inv = (origAlpha: number) => {
      if (tk === "white") {
        // Boost: anything below 0.6 gets raised; above stays
        const boosted = origAlpha < 0.6 ? Math.max(origAlpha + 0.25, 0.6) : origAlpha;
        return `rgba(18,19,58,${boosted.toFixed(2)})`;
      }
      if (tk === "purple") return `rgba(240,224,255,${origAlpha})`;
      if (tk === "midnight") return `rgba(224,244,255,${origAlpha})`;
      return `rgba(255,255,255,${origAlpha})`;
    };
    for (const a of [90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25]) {
      css.push(`${S} .text-white\\/${a} { color:${inv(a / 100)}!important; }`);
    }

    /* ── Placeholder text ── */
    css.push(`${S} .placeholder\\:text-white\\/45::placeholder { color:${inv(0.40)}!important; }`);

    /* ── Footer ── */
    css.push(`${S} footer.nav-glass { background:${t.navGlassBg}!important; }`);

    /* ── text-ehb-* utility classes ── */
    css.push(`${S} .text-ehb-textBody { color:${t.textSecondary}!important; }`);
    css.push(`${S} .text-ehb-textMuted { color:${t.textMuted}!important; }`);

    /* ── Center shine (radial glow in layout.tsx) ── */
    css.push(`${S} .page-mesh > .fixed[aria-hidden] { background:radial-gradient(ellipse 90% 70% at 50% 45%,${t.pageMeshGlow},transparent 60%)!important; }`);

    /* ── bg-slate-950/* ── */
    css.push(`${S} .bg-slate-950\\/10 { background-color:${t.divider}!important; }`);
    css.push(`${S} .bg-slate-950\\/4, ${S} .bg-slate-950\\/5 { background-color:${t.divider}!important; }`);
    css.push(`${S} .bg-slate-950\\/6, ${S} .bg-slate-950\\/8 { background-color:${t.divider}!important; }`);
    css.push(`${S} .bg-slate-950\\/20, ${S} .bg-slate-950\\/25, ${S} .bg-slate-950\\/30 { background-color:${t.border}!important; }`);
    css.push(`${S} .bg-slate-950\\/40, ${S} .bg-slate-950\\/50 { background-color:${t.borderHover}!important; }`);
    /* ── bg-slate-900/* ── */
    css.push(`${S} .bg-slate-900\\/60 { background-color:${t.nested}!important; }`);
    css.push(`${S} .bg-slate-900\\/40, ${S} .bg-slate-900\\/50 { background-color:${t.nested}!important; }`);
    css.push(`${S} .bg-slate-900\\/80, ${S} .bg-slate-900\\/90, ${S} .bg-slate-900 { background-color:${t.card}!important; }`);
    /* ── bg-[#020617] ── */
    css.push(`${S} .bg-\\[\\#020617\\] { background-color:${t.card}!important; }`);

    /* ── text-slate-* ── */
    css.push(`${S} .text-slate-950 { color:${t.text}!important; }`);
    css.push(`${S} .text-slate-900, ${S} .text-slate-800 { color:${t.text}!important; }`);
    css.push(`${S} .text-slate-700, ${S} .text-slate-600 { color:${t.textSecondary}!important; }`);
    css.push(`${S} .text-slate-500, ${S} .text-slate-400 { color:${t.textMuted}!important; }`);
    css.push(`${S} .text-gray-400, ${S} .text-gray-500 { color:${t.textMuted}!important; }`);
    css.push(`${S} .text-gray-300, ${S} .text-gray-200 { color:${t.textSecondary}!important; }`);

    /* ── divide-white/* ── */
    css.push(`${S} .divide-white\\/5 > :not([hidden]) ~ :not([hidden]) { border-color:${t.divider}!important; }`);
    css.push(`${S} .divide-white\\/10 > :not([hidden]) ~ :not([hidden]) { border-color:${t.border}!important; }`);

    /* ── ehb-glass ── */
    css.push(`${S} .ehb-glass {
  background:linear-gradient(180deg,${t.card} 0%,${t.bg} 100%)!important;
  border-color:${t.border}!important;
  box-shadow:0 18px 44px ${t.overlay},0 1px 0 ${t.borderHover} inset!important;
}`);

    /* ── glass-panel-new ── */
    css.push(`${S} .glass-panel-new { background:${t.card}!important; border-color:${t.border}!important; }`);

    /* ── Arbitrary box-shadows ── */
    css.push(`${S} [class*="shadow-\\[0_0_"] { --tw-shadow:0 0 12px ${t.accentGlow}!important; }`);

    /* ── Theme-specific accent rebranding ── */
    if (tk === "purple") {
      css.push(`${S} .text-\\[\\#A098F8\\] { color:#D89CFF!important; }`);
      css.push(`${S} .text-\\[\\#7B6EF6\\] { color:#C45AFF!important; }`);
      css.push(`${S} .bg-\\[\\#7B6EF6\\]\\/15 { background-color:rgba(196,90,255,0.15)!important; }`);
      css.push(`${S} .bg-\\[\\#7B6EF6\\]\\/18 { background-color:rgba(196,90,255,0.18)!important; }`);
      css.push(`${S} .border-\\[\\#7B6EF6\\]\\/45, ${S} .border-\\[\\#7B6EF6\\]\\/50 { border-color:rgba(196,90,255,0.42)!important; }`);
      css.push(`${S} [class*="shadow-neon"] { box-shadow:0 0 20px rgba(196,90,255,0.40)!important; }`);
      css.push(`${S} .ring-white\\/20 { --tw-ring-color:rgba(196,90,255,0.25)!important; }`);
    }

    if (tk === "midnight") {
      css.push(`${S} .text-\\[\\#A098F8\\] { color:#5CEFFF!important; }`);
      css.push(`${S} .text-\\[\\#7B6EF6\\] { color:#00D4FF!important; }`);
      css.push(`${S} .text-\\[\\#33C3FF\\] { color:#5CEFFF!important; }`);
      css.push(`${S} .bg-\\[\\#7B6EF6\\]\\/15 { background-color:rgba(0,212,255,0.12)!important; }`);
      css.push(`${S} .bg-\\[\\#7B6EF6\\]\\/18 { background-color:rgba(0,212,255,0.15)!important; }`);
      css.push(`${S} .border-\\[\\#7B6EF6\\]\\/45, ${S} .border-\\[\\#7B6EF6\\]\\/50 { border-color:rgba(0,212,255,0.35)!important; }`);
      css.push(`${S} [class*="shadow-neon"] { box-shadow:0 0 20px rgba(0,212,255,0.30)!important; }`);
      css.push(`${S} .ring-white\\/20 { --tw-ring-color:rgba(0,212,255,0.20)!important; }`);
    }

    if (tk === "white") {
      css.push(`${S} [class*="shadow-neon"] { box-shadow:0 0 12px rgba(91,78,214,0.15)!important; }`);
      css.push(`${S} .ring-white\\/20 { --tw-ring-color:rgba(91,78,214,0.15)!important; }`);
      css.push(`${S} .text-slate-950 { color:#12133A!important; }`);
      css.push(`${S} .glass-panel { background:rgba(255,255,255,0.80)!important; border-color:rgba(91,78,214,0.10)!important; }`);

      /* ── White theme: pastel accent text → darker readable versions ── */
      // Light purple → dark purple (readable on white)
      css.push(`${S} .text-\\[\\#A098F8\\] { color:#5B4ED6!important; }`);     // was light purple
      css.push(`${S} .text-\\[\\#C3BCFC\\] { color:#5B4ED6!important; }`);     // was pastel purple
      css.push(`${S} .text-\\[\\#7B6EF6\\] { color:#5B4ED6!important; }`);     // was medium purple
      // Light teal/green → dark teal (readable on white)
      css.push(`${S} .text-\\[\\#2BBFA0\\] { color:#0D8A72!important; }`);     // was teal
      css.push(`${S} .text-\\[\\#5FDCBF\\] { color:#0D8A72!important; }`);     // was light teal
      css.push(`${S} .text-\\[\\#38C878\\] { color:#1A8F54!important; }`);     // was green
      // Light amber/orange → dark amber (readable on white)
      css.push(`${S} .text-\\[\\#F0A030\\] { color:#B87514!important; }`);     // was amber
      css.push(`${S} .text-\\[\\#F5BB66\\] { color:#B87514!important; }`);     // was light amber
      // Red stays readable but darken slightly
      css.push(`${S} .text-\\[\\#F05858\\] { color:#CC3333!important; }`);     // was red

      /* ── White theme: metric numbers + hero section text ── */
      css.push(`${S} .ehb-num { color:#12133A!important; }`);

      /* ── White theme: status badges need dark text ── */
      css.push(`${S} .bg-\\[\\#2BBFA0\\]\\/10 { background-color:rgba(13,138,114,0.10)!important; }`);
      css.push(`${S} .bg-\\[\\#F0A030\\]\\/10 { background-color:rgba(184,117,20,0.10)!important; }`);
      css.push(`${S} .bg-\\[\\#7B6EF6\\]\\/10 { background-color:rgba(91,78,214,0.08)!important; }`);
      css.push(`${S} .bg-\\[\\#7B6EF6\\]\\/14 { background-color:rgba(91,78,214,0.10)!important; }`);
      css.push(`${S} .bg-\\[\\#F05858\\]\\/12 { background-color:rgba(204,51,51,0.10)!important; }`);
      css.push(`${S} .bg-\\[\\#38C878\\]\\/12 { background-color:rgba(26,143,84,0.10)!important; }`);
      css.push(`${S} .bg-\\[\\#020617\\] { background:#FFFFFF!important; border-color:rgba(91,78,214,0.12)!important; }`);
      /* ── White theme ehb-glass ── */
      css.push(`${S} .ehb-glass {
  background:linear-gradient(180deg,#FFFFFF 0%,#F6F5FF 100%)!important;
  border-color:rgba(91,78,214,0.12)!important;
  box-shadow:0 8px 32px rgba(91,78,214,0.08),0 1px 0 rgba(91,78,214,0.06) inset!important;
}`);
      css.push(`${S} .ehb-glass::before { background:linear-gradient(90deg,transparent 0%,rgba(91,78,214,0.15) 30%,rgba(91,78,214,0.22) 50%,rgba(91,78,214,0.15) 70%,transparent 100%)!important; }`);
      css.push(`${S} .hover\\:text-white:hover { color:#12133A!important; }`);
      css.push(`${S} .hover\\:bg-white\\/5:hover { background-color:rgba(91,78,214,0.06)!important; }`);
      css.push(`${S} .hover\\:bg-white\\/10:hover { background-color:rgba(91,78,214,0.10)!important; }`);
      css.push(`${S} .shadow-2xl { box-shadow:0 25px 50px -12px rgba(91,78,214,0.12)!important; }`);
      css.push(`${S} [class*="focus:ring"], ${S} [class*="focus-visible:ring"] { --tw-ring-color:rgba(91,78,214,0.30)!important; }`);
      css.push(`${S} .text-\\[\\#33C3FF\\] { color:#5B4ED6!important; }`);
      css.push(`${S} .text-cyan-200, ${S} .text-cyan-100 { color:#0e7490!important; }`);
      css.push(`${S} .text-cyan-400, ${S} .text-cyan-300 { color:#0891b2!important; }`);
      css.push(`${S} .text-cyan-300\\/90 { color:#0891b2!important; }`);
      css.push(`${S} .text-emerald-300\\/90, ${S} .text-emerald-300 { color:#059669!important; }`);
      css.push(`${S} .text-amber-300\\/90, ${S} .text-amber-300 { color:#B45309!important; }`);
      css.push(`${S} .text-emerald-400, ${S} .text-emerald-500 { color:#059669!important; }`);
      css.push(`${S} .text-amber-400, ${S} .text-amber-500 { color:#B45309!important; }`);

      /* ── White theme: Sidebar active link override ── */
      css.push(`${S} .ehb-sidebar a[class*="bg-white"] { background-color:rgba(91,78,214,0.10)!important; }`);
      css.push(`${S} .from-\\[\\#7B6EF6\\]\\/18 { --tw-gradient-from:rgba(91,78,214,0.12)!important; }`);
      css.push(`${S} .via-\\[\\#A098F8\\]\\/12 { --tw-gradient-via:rgba(91,78,214,0.08)!important; --tw-gradient-stops:var(--tw-gradient-from),rgba(91,78,214,0.08),var(--tw-gradient-to)!important; }`);

      /* ── White theme: dark avatar circles → light ── */
      css.push(`${S} .rounded-full[style*="#1A1D33"], ${S} .rounded-full[style*="#13162A"] { background:${t.nested}!important; }`);

      /* ── White theme: gradient headline text → solid dark ── */
      css.push(`${S} .ehb-headline-gradient { -webkit-text-fill-color:#12133A!important; color:#12133A!important; background:none!important; }`);

      /* ── White theme: backdrop-blur cards with dark inline gradients ── */
      css.push(`${S} .backdrop-blur-xl.rounded-xl { background:${t.card}!important; }`);
      css.push(`${S} .backdrop-blur-xl.rounded-2xl { background:${t.card}!important; }`);
      css.push(`${S} .backdrop-blur-xl.rounded-\\[16px\\] { background:${t.card}!important; }`);
    }
  }

  return css.join("\n");
}

export function ThemeCSSInjector() {
  const css = useMemo(() => buildThemeCSS(), []);
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
