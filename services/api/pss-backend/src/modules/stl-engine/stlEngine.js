/**
 * STL Engine — canonical 10-level (L1-L10) per `ehb-info/departments/STL.md` v1.0.
 *
 * Two band sets exist for back-compat during STL_V2 migration:
 *   - STL_BANDS_V2 (canonical, 10 levels) — DEFAULT for new pss-backend
 *   - STL_BANDS_V1 (legacy, 9 levels)     — protected by 58 gold-master tests
 *                                           in services/api/stl-replit/. DO NOT
 *                                           remove until tests regenerated.
 *
 * Switch behaviour with env STL_V2_ENABLED (default: true here in pss-backend).
 *
 * Caps (per PSS.md §6 + Franchise.md + DMO.md):
 *   - PSS source   → cap L5  (PSS alone can verify identity → up to ADVANCED)
 *   - Franchise    → cap L8  (territorial review → up to VIP)
 *   - CRB          → cap L9  (physical + on-chain → up to ELITE)
 *   - DMO council  → L10     (manual SUPREME approval — only path to L10)
 */

const V2_ENABLED = process.env.STL_V2_ENABLED !== "false";

/** Canonical 10-level ladder (STL.md §2). max = exclusive upper bound except L10. */
export const STL_BANDS_V2 = [
  { max: 21, level: 1, key: "FREE", desc: "Entry — no verification, heavy restrictions" },
  { max: 41, level: 2, key: "BASIC", desc: "Phone/email verified, basic listing" },
  { max: 61, level: 3, key: "NORMAL", desc: "KYC verified, standard marketplace access" },
  { max: 76, level: 4, key: "STANDARD", desc: "CRB basic + activity streak" },
  { max: 86, level: 5, key: "ADVANCED", desc: "CRB advanced, regular refills" },
  { max: 93, level: 6, key: "HIGH", desc: "CRB professional, low complaints" },
  { max: 97, level: 7, key: "PRO", desc: "Verified professional, priority ranking" },
  { max: 99, level: 8, key: "VIP", desc: "Top-tier earnings, lower fees" },
  { max: 100, level: 9, key: "ELITE", desc: "By DMO invitation / performance" },
  { max: 101, level: 10, key: "SUPREME", desc: "Manual DMO approval + full coin lock + 0 complaints" },
];

/** Legacy 9-level ladder (kept for stl-replit gold-master compatibility). */
export const STL_BANDS_V1 = [
  { max: 20, level: 0, key: "FREE" },
  { max: 25, level: 1, key: "BASIC" },
  { max: 40, level: 2, key: "NORMAL" },
  { max: 55, level: 3, key: "HIGH" },
  { max: 70, level: 4, key: "VIP" },
  { max: 80, level: 5, key: "ULTRA" },
  { max: 88, level: 6, key: "DIAMOND" },
  { max: 95, level: 7, key: "PLATINUM" },
  { max: 101, level: 8, key: "SUPREME" },
];

export const STL_BANDS = V2_ENABLED ? STL_BANDS_V2 : STL_BANDS_V1;

/** Calculate % score from criteria met vs total. */
export function calcScore(met, total) {
  if (!total) return 0;
  return Math.round((met / total) * 100);
}

/** Map a 0-100 percentage to STL level/key per active ladder. */
export function scoreToLevel(score) {
  const s = Math.max(0, Math.min(100, score));
  for (const b of STL_BANDS) if (s < b.max) return { level: b.level, key: b.key };
  return STL_BANDS[STL_BANDS.length - 1];
}

/** Source caps — who can assign which ceiling. (V2 ladder.) */
export const SOURCE_CAPS_V2 = {
  pss: 5,         // PSS auto can reach ADVANCED
  franchise: 8,   // Sub/City/State/Country franchise reviewer
  crb: 9,         // CRB physical + on-chain certification
  dmo: 10,        // DMO council — only path to SUPREME
};

export const SOURCE_CAPS_V1 = {
  pss: 4,
  franchise: 7,
  crb: 8,
  dmo: 8,
};

const SOURCE_CAPS = V2_ENABLED ? SOURCE_CAPS_V2 : SOURCE_CAPS_V1;

/** Apply the source-of-truth cap. Default "pss". */
export function applyPssCap(level, source = "pss") {
  const cap = SOURCE_CAPS[source] ?? SOURCE_CAPS.pss;
  return Math.min(level, cap);
}

/**
 * Master MIN-chain (STL.md §4) — final EHB-STL = MIN of every entity in the chain.
 * If ANY layer is FREE → whole chain is FREE.
 *   FINAL = MIN(productSTL, sellerSTL, companySTL, ownerSTL)
 */
export function finalEhbStl({ productStl, sellerStl, companyStl, ownerStl }) {
  const layers = { productStl, sellerStl, companyStl, ownerStl };
  let min = Infinity;
  let blockingLayer = null;
  for (const [k, v] of Object.entries(layers)) {
    if (v == null) continue;
    if (v < min) {
      min = v;
      blockingLayer = k;
    }
  }
  return { finalStl: min === Infinity ? 1 : min, blockingLayer };
}
