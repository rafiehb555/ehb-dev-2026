/**
 * Shared silver-chrome / neumorphism 3D design tokens for the DMO prototype.
 *
 * History
 *   Born 2026-04-11 (v1.13 of `design-system/EHB-UIUX-SYSTEM.md`) by
 *   extracting the inline tokens that previously lived duplicated in
 *   `DmoPrototypeWorkspace.tsx` and `DmoLandingPrototype.tsx`. The QA pass
 *   at v1.12 caught a real drift in `NEU_SMALL` (heavier shadows on the
 *   landing), so this module is now the single source of truth. Any
 *   future silver-chrome prototype or migrated live module **must** import
 *   from here instead of redeclaring locally.
 *
 * Scope
 *   Prototype-only for now. Once live pages start migrating from the
 *   Phase 7 cinematic theme to silver-chrome, this module will be
 *   promoted into `packages/ui/` or `@/components/ui/theme.ts` as the
 *   canonical theme layer. Until then, keeping it inside
 *   `components/dmo/_shared/` scopes the blast radius.
 *
 * Design reference
 *   CLAUDE.md §6 (EHB palette), `design-system/EHB-UIUX-SYSTEM.md`
 *   §Neumorphism + §Tone palette, StlWidget v1.8 (canonical neumorphism).
 *
 * Rules
 *   - DO NOT duplicate these tokens in a component file. Import.
 *   - DO NOT tweak a boxShadow / gradient without appending to the
 *     design system changelog.
 *   - The `Tone` union must stay in lockstep with the chip/accent
 *     tables in the design system doc.
 */

import type { CSSProperties } from "react";

// ───────────────────────────────────────────────────────────────────────
//  Tone palette — canonical 7-tone system (CLAUDE.md §6)
// ───────────────────────────────────────────────────────────────────────

export type Tone =
  | "purple"
  | "teal"
  | "amber"
  | "red"
  | "green"
  | "cyan"
  | "slate";

/** Tailwind classnames mapping tone → foreground text color. */
export const TONE_FG: Record<Tone, string> = {
  purple: "text-[#A098F8]",
  teal: "text-[#2BBFA0]",
  amber: "text-[#F0A030]",
  red: "text-[#F05858]",
  green: "text-[#38C878]",
  cyan: "text-[#67E8F9]",
  slate: "text-white/75",
};

/** Tailwind classnames mapping tone → translucent background fill. */
export const TONE_BG: Record<Tone, string> = {
  purple: "bg-[#7B6EF6]/14",
  teal: "bg-[#2BBFA0]/14",
  amber: "bg-[#F0A030]/14",
  red: "bg-[#F05858]/14",
  green: "bg-[#38C878]/14",
  cyan: "bg-[#67E8F9]/14",
  slate: "bg-white/8",
};

/** Tailwind classnames mapping tone → translucent border. */
export const TONE_BORDER: Record<Tone, string> = {
  purple: "border-[#7B6EF6]/30",
  teal: "border-[#2BBFA0]/30",
  amber: "border-[#F0A030]/30",
  red: "border-[#F05858]/30",
  green: "border-[#38C878]/30",
  cyan: "border-[#67E8F9]/30",
  slate: "border-white/15",
};

/** Raw hex per tone, for inline `style={{ ... }}` glows / gradients. */
export const TONE_GLOW_HEX: Record<Tone, string> = {
  purple: "#7B6EF6",
  teal: "#2BBFA0",
  amber: "#F0A030",
  red: "#F05858",
  green: "#38C878",
  cyan: "#67E8F9",
  slate: "#9CA3AF",
};

// ───────────────────────────────────────────────────────────────────────
//  Neumorphism 3D inline styles (match StlWidget v1.8 — canonical)
// ───────────────────────────────────────────────────────────────────────

/** Hero / section-level card. Silver-chrome base with dual-layer shadow. */
export const NEU_CARD: CSSProperties = {
  background:
    "linear-gradient(145deg, rgba(30, 33, 49, 0.92) 0%, rgba(20, 22, 42, 0.94) 55%, rgba(13, 15, 28, 0.96) 100%)",
  boxShadow:
    "18px 18px 48px rgba(0, 0, 0, 0.5), " +
    "-8px -8px 30px rgba(255, 255, 255, 0.03), " +
    "inset 2px 2px 4px rgba(255, 255, 255, 0.07), " +
    "inset -2px -2px 6px rgba(0, 0, 0, 0.55)",
};

/** Inset well / nested KPI tile. Used inside `NEU_CARD` containers. */
export const NEU_INSET: CSSProperties = {
  background: "linear-gradient(145deg, #0d0f1c 0%, #15182a 100%)",
  boxShadow:
    "inset 5px 5px 12px rgba(0, 0, 0, 0.65), " +
    "inset -3px -3px 10px rgba(255, 255, 255, 0.035)",
};

/** Small floating card (stat tile / chip row). Lighter shadow weight. */
export const NEU_SMALL: CSSProperties = {
  background:
    "linear-gradient(145deg, rgba(26, 29, 48, 0.85) 0%, rgba(14, 16, 32, 0.9) 100%)",
  boxShadow:
    "6px 6px 16px rgba(0, 0, 0, 0.45), " +
    "-3px -3px 10px rgba(255, 255, 255, 0.025), " +
    "inset 1px 1px 2px rgba(255, 255, 255, 0.06), " +
    "inset -1px -1px 3px rgba(0, 0, 0, 0.45)",
};
