/**
 * Moves listed files into archive/ with an archive banner.
 * Run from repo root: node scripts/archive-unused-to-folder.cjs
 */
const fs = require("fs");
const path = require("path");

const appRoot = path.join(__dirname, "..");
const archiveRoot = path.join(appRoot, "archive");

const files = [
  "components/ui/skeleton.tsx",
  "components/ui/DmoCard.tsx",
  "components/dmo/stl-dashboard/StlDashboardSidebar.tsx",
  "components/layout/RouteConditional.tsx",
  "components/Breadcrumb.tsx",
  "components/DmoLandingSection.tsx",
  "components/EHBHowItWorksSystem.tsx",
  "components/FranchiseIndustryMarquee.tsx",
  "components/GlobalAiStatus.tsx",
  "components/PageSwitch.tsx",
  "components/dmo/ActionPanel.tsx",
  "components/dmo/ActivityFeed.tsx",
  "components/dmo/AiInsightsPanel.tsx",
  "components/dmo/ApplicationDrawer.tsx",
  "components/dmo/ApplicationsTable.tsx",
  "components/dmo/DmoKpiCard.tsx",
  "components/dmo/PriorityQueueTabs.tsx",
  "components/dmo/Toast.tsx",
  "components/pss/PSSCasesTable.tsx",
  "components/pss/PSSVerificationDrawer.tsx",
  "components/marketplace/MarketplaceSection.tsx",
  "OPEN_DEMO.md",
];

const bannerTsx = `/** Archived - not used in production */\n\n`;
const bannerMd = `<!-- Archived - not used in production -->\n\n`;

for (const rel of files) {
  const src = path.join(appRoot, rel);
  if (!fs.existsSync(src)) {
    console.warn("Skip (missing):", rel);
    continue;
  }
  const dest = path.join(archiveRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let body = fs.readFileSync(src, "utf8");
  if (rel.endsWith(".md")) {
    if (!body.includes("Archived - not used in production")) body = bannerMd + body;
  } else {
    if (!body.includes("Archived - not used in production")) body = bannerTsx + body;
  }
  fs.writeFileSync(dest, body, "utf8");
  fs.unlinkSync(src);
  console.log("Archived:", rel);
}

console.log("Done.");
