/**
 * Maps EHB UI/UX prototype archives on D:\ehb ui ux to marketing industry slugs.
 * Source folder listing (April 2026): mostly .zip React/Vite projects, not raster exports.
 * Drop hero.webp / card.webp under public/images/industries/<slug>/ and register paths in designAssets.ts.
 */
export const ZIP_SOURCES_BY_SLUG: Record<string, string[]> = {
  health: [
    "ehb-health---global-healthcare-ecosystem (4).zip",
    "ehb-health---global-healthcare-ecosystem (5).zip",
    "ehb-health---global-healthcare-ecosystem (6).zip",
    "ehb-health---verified-healthcare-ecosystem.zip",
  ],
  finance: [
    "ehb-finance-core-(phase-1).zip",
    "ehb-finance-core-(phase-1) (1).zip",
    "ehb-finance-core-(phase-1) (2).zip",
    "trustee-wallet.zip",
    "trustee-wallet 1.zip",
    "trustee-wallet---phase-8-final11.zip",
  ],
  law: ["ehb-law---phase-1-foundation.zip"],
  retail: ["gosellr (6).zip", "goseller-franchise-ecosystem (6).zip"],
  education: ["obs---online-book-store-for-education.zip"],
  it: ["ehb-technologies-limited (4).zip", "ehb-technologies-limited (5).zip", "ehb-master-sql-dashboard-main.zip", "apis.zip"],
  freelancing: ["jps (1).zip"],
  consulting: ["emo---easy-management-office-engine.zip"],
  blockchain: ["EHB Blockchain.drawio", "ehbgc-validator-portal.zip"],
  government: ["dmo-foundation---phase-1 (1).zip"],
};

export const DRIVE_UI_UX_PATHS = [
  "D:\\ehb ui ux",
  "D:\\ehb ui ux projects",
] as const;
