"use client";

/**
 * DmoThemeProvider v4 — Complete theme override engine.
 *
 * Sets `data-ehb-theme` on <html> so ALL CSS resolves globally.
 * Generates comprehensive overrides targeting:
 *   - globals.css classes (.page-mesh, .nav-glass, .ehb-silver-bg)
 *   - Tailwind arbitrary values (bg-[#13162A], text-white/XX, etc.)
 *   - Component-level patterns (.ehb-vstat, .ehb-sidebar)
 *   - Layout critical CSS (body background)
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type EhbTheme,
  THEME_TOKENS,
  THEME_STORAGE_KEY,
} from "@/lib/dmo/theme";

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type ThemeContextValue = { theme: EhbTheme; setTheme: (t: EhbTheme) => void };
const ThemeCtx = createContext<ThemeContextValue>({ theme: "dark", setTheme: () => {} });
export function useEhbTheme() { return useContext(ThemeCtx); }

/* ------------------------------------------------------------------ */
/* CSS override generator                                              */
/* ------------------------------------------------------------------ */

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

  // Per-theme overrides (skip dark — it matches existing hardcoded values)
  for (const tk of ["white", "purple", "midnight", "dark"] as EhbTheme[]) {
    const t = THEME_TOKENS[tk];
    const S = `html[data-ehb-theme="${tk}"]`;

    css.push(`\n/* ═══ ${tk.toUpperCase()} ═══ */`);

    /* ── LEVEL 0: html, body, page-mesh (root backgrounds) ── */
    css.push(`${S} { background-color:${t.pageMeshBg}!important; }`);
    css.push(`${S} body { background-color:${t.pageMeshBg}!important; color:${t.text}!important; }`);
    css.push(`${S} .page-mesh {
  background-color:${t.pageMeshBg}!important;
  background-image:
    linear-gradient(${t.pageMeshGrid} 1px,transparent 1px),
    linear-gradient(90deg,${t.pageMeshGrid} 1px,transparent 1px),
    radial-gradient(ellipse 100% 80% at 50% 40%,${t.pageMeshGlow},transparent 55%)!important;
}`);

    /* ── LEVEL 1: nav-glass (main topbar) ── */
    css.push(`${S} .nav-glass {
  background:${t.navGlassBg}!important;
  border-color:${t.navGlassBorder}!important;
  box-shadow:0 1px 0 0 ${t.navGlassBorder}!important;
}`);

    /* ── LEVEL 2: ehb-silver-bg (DMO shell) ── */
    css.push(`${S} .ehb-silver-bg {
  background-color:${t.bg}!important;
  background-image:none!important;
  animation:none!important;
}`);

    /* ── LEVEL 3: Card backgrounds ── */
    // bg-[#13162A] at any opacity
    for (const op of ["", "/70", "/80", "/85", "/90"]) {
      css.push(`${S} .bg-\\[\\#13162A\\]${op.replace("/", "\\/")} { background-color:${t.card}!important; }`);
    }
    // bg-[#1A1D33] at any opacity
    for (const op of ["", "/70", "/80", "/85"]) {
      css.push(`${S} .bg-\\[\\#1A1D33\\]${op.replace("/", "\\/")} { background-color:${t.nested}!important; }`);
    }
    // bg-[#0C0E1A]
    css.push(`${S} .bg-\\[\\#0C0E1A\\], ${S} .bg-\\[\\#0C0E1A\\]\\/80 { background-color:${t.bg}!important; }`);
    css.push(`${S} .bg-\\[\\#0d1017\\] { background-color:${t.bg}!important; }`);

    /* ── Header gradients ── */
    css.push(`${S} .from-\\[\\#13162A\\] { --tw-gradient-from:${t.headerFrom}!important; }`);
    css.push(`${S} .via-\\[\\#1A1D33\\] { --tw-gradient-via:${t.headerVia}!important; --tw-gradient-stops:var(--tw-gradient-from),${t.headerVia},var(--tw-gradient-to)!important; }`);
    css.push(`${S} .to-\\[\\#13162A\\] { --tw-gradient-to:${t.headerTo}!important; }`);

    /* ── Stat cards ── */
    css.push(`${S} .ehb-vstat { background-color:${t.card}!important; border-color:${t.border}!important; }`);

    /* ── Sidebar ── */
    css.push(`${S} .ehb-sidebar > div { background-color:${t.sidebarBg}!important; border-color:${t.sidebarBorder}!important; }`);

    /* ── Ambient orbs ── */
    css.push(`${S} .ehb-orb-a { background:radial-gradient(circle,${t.orbA} 0%,transparent 70%)!important; }`);
    css.push(`${S} .ehb-orb-b { background:radial-gradient(circle,${t.orbB} 0%,transparent 70%)!important; }`);

    /* ── Borders (most used: border-white/10, /8, /20, /5) ── */
    css.push(`${S} .border-white\\/10 { border-color:${t.border}!important; }`);
    css.push(`${S} .border-white\\/20 { border-color:${t.borderHover}!important; }`);
    css.push(`${S} .border-white\\/5, ${S} .border-white\\/8 { border-color:${t.divider}!important; }`);
    css.push(`${S} .border-white\\/15, ${S} .border-white\\/12, ${S} .border-white\\/25 { border-color:${t.borderHover}!important; }`);

    /* ── bg-white/[0.0x] subtle fills ── */
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

    /* ── Text overrides (all text-white variants) ── */
    css.push(`${S} .text-white { color:${t.text}!important; }`);
    const inv = (alpha: number) =>
      tk === "white" ? `rgba(18,19,58,${alpha})`
      : tk === "purple" ? `rgba(240,224,255,${alpha})`
      : tk === "midnight" ? `rgba(224,244,255,${alpha})`
      : `rgba(255,255,255,${alpha})`;
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

    /* ── bg-slate-950/* (used 100+ times in codebase) ── */
    css.push(`${S} .bg-slate-950\\/10 { background-color:${t.divider}!important; }`);
    css.push(`${S} .bg-slate-950\\/4, ${S} .bg-slate-950\\/5 { background-color:${t.divider}!important; }`);
    css.push(`${S} .bg-slate-950\\/6, ${S} .bg-slate-950\\/8 { background-color:${t.divider}!important; }`);
    css.push(`${S} .bg-slate-950\\/20, ${S} .bg-slate-950\\/25, ${S} .bg-slate-950\\/30 { background-color:${t.border}!important; }`);
    css.push(`${S} .bg-slate-950\\/40, ${S} .bg-slate-950\\/50 { background-color:${t.borderHover}!important; }`);
    /* ── bg-slate-900/* (141 instances — industry icon circles etc.) ── */
    css.push(`${S} .bg-slate-900\\/60 { background-color:${t.nested}!important; }`);
    css.push(`${S} .bg-slate-900\\/40, ${S} .bg-slate-900\\/50 { background-color:${t.nested}!important; }`);
    css.push(`${S} .bg-slate-900\\/80, ${S} .bg-slate-900\\/90, ${S} .bg-slate-900 { background-color:${t.card}!important; }`);
    /* ── bg-[#020617] (deep dark, used in picker dropdown) ── */
    css.push(`${S} .bg-\\[\\#020617\\] { background-color:${t.card}!important; }`);

    /* ── text-slate-950 (64 instances — dark text that vanishes on white) ── */
    css.push(`${S} .text-slate-950 { color:${t.text}!important; }`);
    css.push(`${S} .text-slate-900, ${S} .text-slate-800 { color:${t.text}!important; }`);
    css.push(`${S} .text-slate-700, ${S} .text-slate-600 { color:${t.textSecondary}!important; }`);
    css.push(`${S} .text-slate-500, ${S} .text-slate-400 { color:${t.textMuted}!important; }`);
    css.push(`${S} .text-gray-400, ${S} .text-gray-500 { color:${t.textMuted}!important; }`);
    css.push(`${S} .text-gray-300, ${S} .text-gray-200 { color:${t.textSecondary}!important; }`);

    /* ── divide-white/* (table dividers) ── */
    css.push(`${S} .divide-white\\/5 > :not([hidden]) ~ :not([hidden]) { border-color:${t.divider}!important; }`);
    css.push(`${S} .divide-white\\/10 > :not([hidden]) ~ :not([hidden]) { border-color:${t.border}!important; }`);

    /* ── ehb-glass (globals.css: dark glassmorphism card) ── */
    css.push(`${S} .ehb-glass {
  background:linear-gradient(180deg,${t.card} 0%,${t.bg} 100%)!important;
  border-color:${t.border}!important;
  box-shadow:0 18px 44px ${t.overlay},0 1px 0 ${t.borderHover} inset!important;
}`);

    /* ── glass-panel-new (globals.css) ── */
    css.push(`${S} .glass-panel-new { background:${t.card}!important; border-color:${t.border}!important; }`);

    /* ── Arbitrary box-shadows with rgba (glow effects) ── */
    css.push(`${S} [class*="shadow-\\[0_0_"] { --tw-shadow:0 0 12px ${t.accentGlow}!important; }`);

    /* ── Theme-specific accent rebranding ── */
    if (tk === "purple") {
      // Rebrand #7B6EF6 → #C45AFF, #A098F8 → #D89CFF
      css.push(`${S} .text-\\[\\#A098F8\\] { color:#D89CFF!important; }`);
      css.push(`${S} .text-\\[\\#7B6EF6\\] { color:#C45AFF!important; }`);
      css.push(`${S} .bg-\\[\\#7B6EF6\\]\\/15 { background-color:rgba(196,90,255,0.15)!important; }`);
      css.push(`${S} .bg-\\[\\#7B6EF6\\]\\/18 { background-color:rgba(196,90,255,0.18)!important; }`);
      css.push(`${S} .border-\\[\\#7B6EF6\\]\\/45, ${S} .border-\\[\\#7B6EF6\\]\\/50 { border-color:rgba(196,90,255,0.42)!important; }`);
      css.push(`${S} [class*="shadow-neon"] { box-shadow:0 0 20px rgba(196,90,255,0.40)!important; }`);
      css.push(`${S} .ring-white\\/20 { --tw-ring-color:rgba(196,90,255,0.25)!important; }`);
    }

    if (tk === "midnight") {
      // Rebrand #7B6EF6 → #00D4FF, #A098F8 → #5CEFFF
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
      // Industries bar chips — active pill text fix
      css.push(`${S} .text-slate-950 { color:#12133A!important; }`);
      css.push(`${S} .glass-panel { background:rgba(255,255,255,0.80)!important; border-color:rgba(91,78,214,0.10)!important; }`);
      // Industries bar container
      css.push(`${S} .bg-\\[\\#020617\\] { background-color:#FFFFFF!important; border-color:rgba(91,78,214,0.12)!important; }`);
      // White theme ehb-glass — soft indigo card
      css.push(`${S} .ehb-glass {
  background:linear-gradient(180deg,#FFFFFF 0%,#F6F5FF 100%)!important;
  border-color:rgba(91,78,214,0.12)!important;
  box-shadow:0 8px 32px rgba(91,78,214,0.08),0 1px 0 rgba(91,78,214,0.06) inset!important;
}`);
      css.push(`${S} .ehb-glass::before { background:linear-gradient(90deg,transparent 0%,rgba(91,78,214,0.15) 30%,rgba(91,78,214,0.22) 50%,rgba(91,78,214,0.15) 70%,transparent 100%)!important; }`);
      // hover:text-white on White theme should keep dark text
      css.push(`${S} .hover\\:text-white:hover { color:#12133A!important; }`);
      css.push(`${S} .hover\\:bg-white\\/5:hover { background-color:rgba(91,78,214,0.06)!important; }`);
      css.push(`${S} .hover\\:bg-white\\/10:hover { background-color:rgba(91,78,214,0.10)!important; }`);
      // Shadow-2xl toned down for white
      css.push(`${S} .shadow-2xl { box-shadow:0 25px 50px -12px rgba(91,78,214,0.12)!important; }`);
      // Focus ring colors for White
      css.push(`${S} [class*="focus:ring"], ${S} [class*="focus-visible:ring"] { --tw-ring-color:rgba(91,78,214,0.30)!important; }`);
      // Coin balance cyan → indigo for readability
      css.push(`${S} .text-\\[\\#33C3FF\\] { color:#5B4ED6!important; }`);
      // text-cyan-* → darker cyan for White bg
      css.push(`${S} .text-cyan-200, ${S} .text-cyan-100 { color:#0e7490!important; }`);
      css.push(`${S} .text-cyan-400, ${S} .text-cyan-300 { color:#0891b2!important; }`);
      // text-amber-* stays visible on white (OK)
      // text-emerald/green stays OK on white
    }
  }

  return css.join("\n");
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function DmoThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeRaw] = useState<EhbTheme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as EhbTheme | null;
      if (stored && ["dark", "white", "purple", "midnight"].includes(stored)) {
        setThemeRaw(stored);
        document.documentElement.setAttribute("data-ehb-theme", stored);
      } else {
        document.documentElement.setAttribute("data-ehb-theme", "dark");
      }
    } catch {
      document.documentElement.setAttribute("data-ehb-theme", "dark");
    }
    setMounted(true);
  }, []);

  const setTheme = useCallback((t: EhbTheme) => {
    setThemeRaw(t);
    document.documentElement.setAttribute("data-ehb-theme", t);
    try { localStorage.setItem(THEME_STORAGE_KEY, t); } catch {}
  }, []);

  const ctx = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  // NOTE: CSS overrides are now injected globally by <ThemeCSSInjector /> in root layout.
  // DmoThemeProvider only manages theme state + context for DMO pages.
  return (
    <ThemeCtx.Provider value={ctx}>
      {children}
    </ThemeCtx.Provider>
  );
}
