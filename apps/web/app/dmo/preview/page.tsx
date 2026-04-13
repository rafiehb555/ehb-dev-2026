"use client";

import { DmoLandingPrototype } from "@/components/dmo/DmoLandingPrototype";

/**
 * /dmo/preview — Phase 9 silver-chrome landing prototype.
 *
 * This route is intentionally NON-DESTRUCTIVE. The live Phase 7 cinematic
 * landing page at `/dmo` (which uses `useSTL` live data) is untouched. This
 * preview renders `DmoLandingPrototype` with mock data only so the team can
 * compare both landings side-by-side before the backend wiring sprint.
 *
 * DESIGN-ONLY — no API wiring, no live data. See CLAUDE.md §6.1 for the
 * design system mandate and `design-system/EHB-UIUX-SYSTEM.md` for tokens.
 */
export default function DmoPreviewPage() {
  return <DmoLandingPrototype />;
}
