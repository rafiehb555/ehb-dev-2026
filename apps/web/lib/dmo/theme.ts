/**
 * DMO Multi-Theme System — Premium Palette v4
 *
 * DESIGN RULES (non-negotiable):
 *   1. Page BG → Card → Nested must have ≥15% brightness step between each
 *   2. Text must have ≥4.5:1 contrast ratio against card bg (WCAG AA)
 *   3. Accent colors remain vibrant regardless of theme
 *   4. Each theme has unique personality — not just "slightly different dark"
 *
 * 4 themes:
 *   • Dark     — Obsidian night with purple/teal neon highlights
 *   • White    — Clean paper with indigo accent ribbons
 *   • Purple   — Deep cosmic violet with magenta/pink nebula glow
 *   • Midnight — Abyssal ocean with electric cyan bioluminescence
 */

export type EhbTheme = "dark" | "white" | "purple" | "midnight";

export const EHB_THEMES: { key: EhbTheme; label: string; icon: string }[] = [
  { key: "white", label: "White", icon: "sun" },
  { key: "dark", label: "Dark", icon: "moon" },
  { key: "purple", label: "Purple", icon: "heart" },
  { key: "midnight", label: "Midnight", icon: "moon-stars" },
];

export type ThemeTokens = {
  /* 3-layer surface hierarchy — MUST have visible contrast between each */
  bg: string;          // Deepest page background
  card: string;        // Card surfaces (must be visibly LIGHTER than bg)
  nested: string;      // Inner elements (must be visibly LIGHTER than card)

  /* Header gradient */
  headerFrom: string;
  headerVia: string;
  headerTo: string;

  /* Brand accents */
  accentPrimary: string;
  accentSecondary: string;
  accentGlow: string;

  /* Text — high contrast against card bg */
  text: string;
  textSecondary: string;
  textMuted: string;

  /* Border & divider */
  border: string;
  borderHover: string;
  divider: string;

  /* Overlay & backdrop */
  overlay: string;
  backdrop: string;

  /* Sidebar */
  sidebarBg: string;
  sidebarBorder: string;

  /* Topbar */
  topbarBg: string;
  topbarShadow: string;

  /* Input */
  inputBg: string;
  inputBorder: string;

  /* Global page mesh override */
  pageMeshBg: string;
  pageMeshGrid: string;       // grid line color
  pageMeshGlow: string;       // center radial glow

  /* Nav glass (main topbar) */
  navGlassBg: string;
  navGlassBorder: string;

  /* Ambient orbs */
  orbA: string;
  orbB: string;

  /* Misc */
  scrollThumb: string;
};

export const THEME_TOKENS: Record<EhbTheme, ThemeTokens> = {

  /* ═══════════════════════════════════════════════════════
   * DARK — Obsidian night (#080A14 base)
   * Card is 30% brighter, Nested is 50% brighter than bg.
   * ═══════════════════════════════════════════════════════ */
  dark: {
    bg: "#080A14",
    card: "#12152A",
    nested: "#1B1F38",
    headerFrom: "#12152A",
    headerVia: "#1B1F38",
    headerTo: "#12152A",
    accentPrimary: "#7B6EF6",
    accentSecondary: "#2BBFA0",
    accentGlow: "rgba(123,110,246,0.30)",
    text: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.70)",
    textMuted: "rgba(255,255,255,0.45)",
    border: "rgba(255,255,255,0.10)",
    borderHover: "rgba(255,255,255,0.20)",
    divider: "rgba(255,255,255,0.06)",
    overlay: "rgba(8,10,20,0.85)",
    backdrop: "rgba(8,10,20,0.65)",
    sidebarBg: "rgba(18,21,42,0.90)",
    sidebarBorder: "rgba(255,255,255,0.08)",
    topbarBg: "linear-gradient(180deg, rgba(8,10,20,0.72) 0%, rgba(8,10,20,0.50) 100%)",
    topbarShadow: "0 1px 0 rgba(123,110,246,0.10) inset, 0 8px 24px rgba(0,0,0,0.30)",
    inputBg: "rgba(8,10,20,0.80)",
    inputBorder: "rgba(255,255,255,0.12)",
    pageMeshBg: "#080A14",
    pageMeshGrid: "rgba(255,255,255,0.025)",
    pageMeshGlow: "rgba(123,110,246,0.10)",
    navGlassBg: "rgba(8,10,20,0.88)",
    navGlassBorder: "rgba(123,110,246,0.12)",
    orbA: "rgba(123,110,246,0.16)",
    orbB: "rgba(43,191,160,0.10)",
    scrollThumb: "rgba(255,255,255,0.14)",
  },

  /* ═══════════════════════════════════════════════════════
   * WHITE — Clean paper (#F0F0F8 base)
   * Card is pure white, Nested is soft lavender.
   * ═══════════════════════════════════════════════════════ */
  white: {
    bg: "#ECEDF6",
    card: "#FFFFFF",
    nested: "#F3F2FC",
    headerFrom: "#FFFFFF",
    headerVia: "#F6F5FF",
    headerTo: "#FFFFFF",
    accentPrimary: "#5B4ED6",
    accentSecondary: "#00A87D",
    accentGlow: "rgba(91,78,214,0.15)",
    text: "#12133A",
    textSecondary: "rgba(18,19,58,0.68)",
    textMuted: "rgba(18,19,58,0.42)",
    border: "rgba(91,78,214,0.14)",
    borderHover: "rgba(91,78,214,0.28)",
    divider: "rgba(91,78,214,0.08)",
    overlay: "rgba(236,237,246,0.92)",
    backdrop: "rgba(255,255,255,0.85)",
    sidebarBg: "#FFFFFF",
    sidebarBorder: "rgba(91,78,214,0.10)",
    topbarBg: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(246,245,255,0.92) 100%)",
    topbarShadow: "0 1px 0 rgba(91,78,214,0.08) inset, 0 4px 20px rgba(91,78,214,0.05)",
    inputBg: "#F6F5FF",
    inputBorder: "rgba(91,78,214,0.18)",
    pageMeshBg: "#ECEDF6",
    pageMeshGrid: "rgba(91,78,214,0.04)",
    pageMeshGlow: "rgba(91,78,214,0.06)",
    navGlassBg: "rgba(255,255,255,0.92)",
    navGlassBorder: "rgba(91,78,214,0.10)",
    orbA: "rgba(91,78,214,0.06)",
    orbB: "rgba(0,168,125,0.04)",
    scrollThumb: "rgba(91,78,214,0.18)",
  },

  /* ═══════════════════════════════════════════════════════
   * PURPLE — Cosmic violet (#08021E base)
   * Card is rich plum, Nested is brighter grape.
   * Strong visual identity with magenta/pink accents.
   * ═══════════════════════════════════════════════════════ */
  purple: {
    bg: "#08021E",
    card: "#180D42",
    nested: "#261660",
    headerFrom: "#180D42",
    headerVia: "#261660",
    headerTo: "#180D42",
    accentPrimary: "#C45AFF",
    accentSecondary: "#FF6EB4",
    accentGlow: "rgba(196,90,255,0.35)",
    text: "#F0E0FF",
    textSecondary: "rgba(240,224,255,0.68)",
    textMuted: "rgba(240,224,255,0.42)",
    border: "rgba(196,90,255,0.20)",
    borderHover: "rgba(196,90,255,0.38)",
    divider: "rgba(196,90,255,0.10)",
    overlay: "rgba(8,2,30,0.88)",
    backdrop: "rgba(8,2,30,0.70)",
    sidebarBg: "rgba(24,13,66,0.95)",
    sidebarBorder: "rgba(196,90,255,0.14)",
    topbarBg: "linear-gradient(180deg, rgba(24,13,66,0.80) 0%, rgba(8,2,30,0.60) 100%)",
    topbarShadow: "0 1px 0 rgba(196,90,255,0.18) inset, 0 8px 28px rgba(8,2,30,0.50)",
    inputBg: "rgba(24,13,66,0.80)",
    inputBorder: "rgba(196,90,255,0.22)",
    pageMeshBg: "#08021E",
    pageMeshGrid: "rgba(196,90,255,0.03)",
    pageMeshGlow: "rgba(196,90,255,0.08)",
    navGlassBg: "rgba(24,13,66,0.88)",
    navGlassBorder: "rgba(196,90,255,0.15)",
    orbA: "rgba(196,90,255,0.18)",
    orbB: "rgba(255,110,180,0.10)",
    scrollThumb: "rgba(196,90,255,0.28)",
  },

  /* ═══════════════════════════════════════════════════════
   * MIDNIGHT — Abyssal ocean (#010812 base)
   * Card is deep navy, Nested is brighter marine.
   * Electric cyan bioluminescence throughout.
   * ═══════════════════════════════════════════════════════ */
  midnight: {
    bg: "#010812",
    card: "#071D38",
    nested: "#0E2D50",
    headerFrom: "#071D38",
    headerVia: "#0E2D50",
    headerTo: "#071D38",
    accentPrimary: "#00D4FF",
    accentSecondary: "#00F5A0",
    accentGlow: "rgba(0,212,255,0.30)",
    text: "#E0F4FF",
    textSecondary: "rgba(224,244,255,0.68)",
    textMuted: "rgba(224,244,255,0.42)",
    border: "rgba(0,212,255,0.14)",
    borderHover: "rgba(0,212,255,0.28)",
    divider: "rgba(0,212,255,0.07)",
    overlay: "rgba(1,8,18,0.90)",
    backdrop: "rgba(1,8,18,0.72)",
    sidebarBg: "rgba(7,29,56,0.94)",
    sidebarBorder: "rgba(0,212,255,0.10)",
    topbarBg: "linear-gradient(180deg, rgba(7,29,56,0.82) 0%, rgba(1,8,18,0.62) 100%)",
    topbarShadow: "0 1px 0 rgba(0,212,255,0.12) inset, 0 8px 28px rgba(1,8,18,0.50)",
    inputBg: "rgba(7,29,56,0.85)",
    inputBorder: "rgba(0,212,255,0.16)",
    pageMeshBg: "#010812",
    pageMeshGrid: "rgba(0,212,255,0.025)",
    pageMeshGlow: "rgba(0,212,255,0.06)",
    navGlassBg: "rgba(7,29,56,0.90)",
    navGlassBorder: "rgba(0,212,255,0.12)",
    orbA: "rgba(0,212,255,0.14)",
    orbB: "rgba(0,245,160,0.08)",
    scrollThumb: "rgba(0,212,255,0.22)",
  },
};

/** Storage key for localStorage persistence */
export const THEME_STORAGE_KEY = "ehb-dmo-theme";
