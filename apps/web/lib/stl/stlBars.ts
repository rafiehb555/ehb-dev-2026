/**
 * Unified bar ranges for STL breakdown display (matches engine weights).
 */
export const STL_BAR_CONFIG = [
  { key: "pss" as const, label: "PSS", min: 0, max: 30 },
  { key: "crb" as const, label: "CRB", min: 0, max: 30 },
  { key: "performance" as const, label: "DMO", min: 0, max: 20 },
  { key: "industries" as const, label: "Franchise", min: 0, max: 10 },
  { key: "behavior" as const, label: "Penalty / complaints", min: -35, max: 0 },
] as const;
