#!/usr/bin/env node
/**
 * EHB Folder Flow Validator — enforces EHB-FOLDER-FLOW-MASTER.md §7.
 *
 * Exits non-zero on drift. Run by:
 *   - pre-commit hook
 *   - CI
 *   - on demand: node scripts/folder-flow-validate.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const errors = [];
const warns = [];

function check(cond, msg) {
  if (!cond) errors.push(msg);
}

function warn(cond, msg) {
  if (!cond) warns.push(msg);
}

function exists(p) {
  return fs.existsSync(path.join(ROOT, p));
}

// 1. Required top-level folders
const required = [
  "apps/web",
  "services/api",
  "services/ai",
  "packages/ui",
  "packages/types",
  "packages/utils",
  "packages/trust-engine",
  "packages/industry-registry",
  "data/ehb-data",
  "scripts",
  "infrastructure/scripts",
  "docs",
  "ehb-info",
  "design-system",
  "backup",
];
for (const p of required) check(exists(p), `Missing required folder: ${p}`);

// 2. Required files
const requiredFiles = [
  "EHB-FOLDER-FLOW-MASTER.md",
  "CLAUDE.md",
  "AGENTS.md",
  "data/ehb-data/industries.json",
  "packages/industry-registry/src/index.ts",
  "scripts/add-industry.mjs",
];
for (const p of requiredFiles) check(exists(p), `Missing required file: ${p}`);

// 3. Industry parity: each industry needs a frontend page AND a backend module
const industriesPath = path.join(ROOT, "data/ehb-data/industries.json");
if (fs.existsSync(industriesPath)) {
  const industries = JSON.parse(fs.readFileSync(industriesPath, "utf8"));
  for (const ind of industries) {
    const fePage = `apps/web/app/(industries)/${ind.code}/page.tsx`;
    const beModule = `services/api/src/modules/industries/${ind.code}/${ind.code}.module.ts`;
    warn(exists(fePage), `Industry "${ind.code}" missing frontend page: ${fePage}`);
    warn(exists(beModule), `Industry "${ind.code}" missing backend module: ${beModule}`);
  }
}

// 4. Case-duplicate scan (Card.tsx vs card.tsx)
function scanDupes(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const lowerMap = new Map();
  for (const f of files) {
    const lower = f.name.toLowerCase();
    if (lowerMap.has(lower) && lowerMap.get(lower) !== f.name) {
      errors.push(`Case-duplicate: ${path.join(dir, lowerMap.get(lower))} vs ${path.join(dir, f.name)}`);
    }
    lowerMap.set(lower, f.name);
    if (f.isDirectory()) scanDupes(path.join(dir, f.name));
  }
}
scanDupes(path.join(ROOT, "apps/web/components"));
scanDupes(path.join(ROOT, "apps/web/app"));

// 5. No per-industry Next apps
const appsDir = path.join(ROOT, "apps");
if (fs.existsSync(appsDir)) {
  for (const entry of fs.readdirSync(appsDir)) {
    if (/^web-/.test(entry)) errors.push(`Forbidden: per-industry Next app "apps/${entry}". Use (industries)/<code>/ instead.`);
  }
}

// 6. No per-industry API services
const servicesDir = path.join(ROOT, "services");
if (fs.existsSync(servicesDir)) {
  for (const entry of fs.readdirSync(servicesDir)) {
    if (/^api-/.test(entry)) errors.push(`Forbidden: per-industry API "services/${entry}". Use modules/industries/<code>/ instead.`);
  }
}

// Report
console.log("EHB Folder Flow — Validation Report");
console.log("====================================");
if (errors.length === 0 && warns.length === 0) {
  console.log("✅ All checks passed.");
  process.exit(0);
}
if (errors.length) {
  console.log(`\n❌ ${errors.length} error(s):`);
  for (const e of errors) console.log(`   • ${e}`);
}
if (warns.length) {
  console.log(`\n⚠  ${warns.length} warning(s):`);
  for (const w of warns) console.log(`   • ${w}`);
}
console.log("");
process.exit(errors.length > 0 ? 1 : 0);
