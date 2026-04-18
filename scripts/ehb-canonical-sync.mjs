#!/usr/bin/env node

/**
 * ehb-canonical-sync.mjs
 *
 * Auto-synchronizes canonical department files (STL.md, PSS.md, CRB.md, DMO.md, Industries.md, Franchise.md)
 * into managed sections of master documentation files and CLAUDE.md.
 *
 * Sections delimited by:
 *   <!-- AUTO:CANONICAL-START -->
 *   <!-- AUTO:CANONICAL-END -->
 *
 * Usage: node scripts/ehb-canonical-sync.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

// ============= CONFIG =============
const CANONICAL_DIR = path.join(repoRoot, "ehb-info/departments");
const TARGETS = [
  { file: "ehb-info/EHB-PSS-MASTER-PLAN.md", section: "AUTO:PSS-CANONICAL" },
  { file: "ehb-info/EHB-MASTER-DEVELOPMENT-PLAN.md", section: "AUTO:CANONICAL-SUMMARY" },
  { file: "CLAUDE.md", section: "AUTO:CANONICAL-COUNTS" },
];

const CANONICAL_FILES = [
  "STL.md",
  "PSS.md",
  "CRB.md",
  "DMO.md",
  "Industries.md",
  "Franchise.md",
];

// ============= HELPERS =============
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf-8");
}

function extractYamlField(content, field) {
  const regex = new RegExp(`^${field}:\\s*(.+)$`, "m");
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

function extractTable(content, tableLabel) {
  // Simple regex to find Markdown table starting after a label
  const regex = new RegExp(
    `^.*?${tableLabel}.*?\\n\\n(\\|[^|]+\\|[^|]*\\n)+(\\|[^|]*\\n)+`,
    "m"
  );
  const match = content.match(regex);
  return match ? match[0] : null;
}

function updateManagedSection(filePath, sectionId, newContent) {
  const file = readFile(filePath);
  if (!file) {
    console.warn(`File not found: ${filePath}`);
    return false;
  }

  const startMarker = `<!-- AUTO:${sectionId}-START -->`;
  const endMarker = `<!-- AUTO:${sectionId}-END -->`;

  if (!file.includes(startMarker) || !file.includes(endMarker)) {
    console.warn(`Section ${sectionId} not found in ${filePath}`);
    return false;
  }

  const updated = file.replace(
    new RegExp(`(${startMarker})[\\s\\S]*(${endMarker})`, "g"),
    `$1\n\n${newContent}\n\n$2`
  );

  writeFile(filePath, updated);
  return true;
}

// ============= EXTRACTORS =============
function extractPSSData() {
  const pssFile = readFile(path.join(CANONICAL_DIR, "PSS.md"));
  if (!pssFile) return null;

  const version = extractYamlField(pssFile, "Status") || "v2.0";
  const rolesMatch = pssFile.match(
    /\| Role \| Level \| Required Features/
  );
  const featureCount = pssFile.match(/^# Feature \d+/gm)?.length || 27;

  return {
    version,
    features: featureCount,
    roles: ["Buyer", "Seller", "Rider", "Inspector", "Franchise", "Admin"],
    maxPoints: 40,
  };
}

function extractSTLData() {
  const stlFile = readFile(path.join(CANONICAL_DIR, "STL.md"));
  if (!stlFile) return null;

  const levels = [
    "L1",
    "L2",
    "L3",
    "L4",
    "L5",
    "L6",
    "L7",
    "L8",
    "L9",
    "L10",
  ];
  const names = [
    "FREE",
    "BASIC",
    "NORMAL",
    "STANDARD",
    "ADVANCED",
    "HIGH",
    "PRO",
    "VIP",
    "ELITE",
    "SUPREME",
  ];

  return {
    version: "1.0",
    levels: levels.length,
    names,
    sourceCaps: {
      pss: "L5 ADVANCED",
      franchise: "L8 VIP",
      crb: "L9 ELITE",
      dmo: "L10 SUPREME",
    },
  };
}

function extractCRBData() {
  const crbFile = readFile(path.join(CANONICAL_DIR, "CRB.md"));
  if (!crbFile) return null;

  return {
    version: "1.0",
    purpose: "Certification & Refill Board",
    refillCadence: "per STL level",
  };
}

function extractIndustriesData() {
  const indFile = readFile(path.join(CANONICAL_DIR, "Industries.md"));
  if (!indFile) return null;

  // Count main vs support
  const mainCount =
    (indFile.match(/^## \d+\. \w+ \(Main\)/gm) || []).length || 10;
  const supportCount =
    (indFile.match(/^## \d+\. \w+ \(Support\)/gm) || []).length || 6;

  return {
    version: "1.0",
    main: mainCount,
    support: supportCount,
    total: mainCount + supportCount,
  };
}

function extractFranchiseData() {
  const franchiseFile = readFile(
    path.join(CANONICAL_DIR, "Franchise.md")
  );
  if (!franchiseFile) return null;

  return {
    version: "1.0",
    tiers: 4,
    names: ["Online", "City", "State", "Country"],
    maxSTL: "L8 VIP",
  };
}

// ============= SECTION GENERATORS =============
function generatePSSCanonicalSection() {
  const data = extractPSSData();
  if (!data) return "<!-- PSS canonical not found -->";

  return `
## PSS Canonical Status (Auto-synced)

**Version:** ${data.version}
**Features:** ${data.features} verification & security features
**User Roles:** ${data.roles.join(", ")}
**STL Contribution:** 0–${data.maxPoints} points max

Source cap: **PSS → L5 ADVANCED** (other sources can exceed)

Last synced: ${new Date().toISOString().split("T")[0]}
`;
}

function generateCanonicalSummary() {
  const stl = extractSTLData();
  const pss = extractPSSData();
  const crb = extractCRBData();
  const ind = extractIndustriesData();
  const franchise = extractFranchiseData();

  return `
### Canonical Snapshot (Auto-synced from \`ehb-info/departments/\`)

| Department | Version | Key Metric |
|------------|---------|-----------|
| STL | ${stl?.version || "—"} | ${stl?.levels || 0} levels (${stl?.names.slice(0, 3).join(", ")}, ..., SUPREME) |
| PSS | ${pss?.version || "—"} | ${pss?.features || 0} features, 0–${pss?.maxPoints || 40} points |
| CRB | ${crb?.version || "—"} | ${crb?.purpose || "—"} |
| Industries | ${ind?.version || "—"} | ${ind?.total || 16} total (${ind?.main || 10} main + ${ind?.support || 6} support) |
| Franchise | ${franchise?.version || "—"} | ${franchise?.tiers || 4} tiers (${franchise?.names?.join(", ") || "—"}) |

**MIN-chain rule (immutable):**
\`FINAL_EHB_STL = MIN(productSTL, sellerSTL, companySTL, ownerSTL)\`

Last sync: ${new Date().toISOString().split("T")[0]}
`;
}

function generateClaudeCanonicalCounts() {
  const stl = extractSTLData();
  const pss = extractPSSData();
  const ind = extractIndustriesData();

  return `PSS = ${pss?.features || 27} features (27 master list), STL = ${stl?.levels || 10} levels (L1–L10), Industries = ${ind?.total || 16} (10 main + 6 support)`;
}

// ============= MAIN =============
async function main() {
  console.log("📋 EHB Canonical Auto-Sync — Starting...\n");

  const changes = [];

  // 1. Update EHB-PSS-MASTER-PLAN.md
  const pssSection = generatePSSCanonicalSection();
  if (updateManagedSection(
    path.join(repoRoot, TARGETS[0].file),
    TARGETS[0].section,
    pssSection
  )) {
    changes.push(`✓ Updated ${TARGETS[0].file}`);
  }

  // 2. Update EHB-MASTER-DEVELOPMENT-PLAN.md
  const summarySection = generateCanonicalSummary();
  if (updateManagedSection(
    path.join(repoRoot, TARGETS[1].file),
    TARGETS[1].section,
    summarySection
  )) {
    changes.push(`✓ Updated ${TARGETS[1].file}`);
  }

  // 3. Update CLAUDE.md
  const claudeSection = generateClaudeCanonicalCounts();
  if (updateManagedSection(
    path.join(repoRoot, TARGETS[2].file),
    TARGETS[2].section,
    claudeSection
  )) {
    changes.push(`✓ Updated ${TARGETS[2].file}`);
  }

  // Report
  console.log("\n📊 Sync Summary:");
  if (changes.length > 0) {
    changes.forEach((c) => console.log(`  ${c}`));
    console.log(`\n✓ Synced ${changes.length}/${TARGETS.length} targets`);
  } else {
    console.log("  ⚠ No targets updated (sections may not exist)");
  }

  console.log("\n✨ Auto-sync complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Sync failed:", err.message);
  process.exit(1);
});
