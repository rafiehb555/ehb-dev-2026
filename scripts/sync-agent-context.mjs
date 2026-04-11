#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
//  sync-agent-context.mjs — mirror AGENTS.md into the other agent formats
//
//  Agent tools all pick up their own file name. This script keeps the
//  following files byte-for-byte in sync with AGENTS.md so whichever agent
//  opens the project gets the same EHB context:
//
//    AGENTS.md                          (source of truth — edit this one)
//    CLAUDE.md                          Claude Code / Claude.ai
//    .cursorrules                       Cursor
//    .github/copilot-instructions.md    GitHub Copilot Workspace
//
//  Run this after editing AGENTS.md:
//    node scripts/sync-agent-context.mjs
// ═══════════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const SOURCE = path.join(REPO_ROOT, "AGENTS.md");
const TARGETS = [
  "CLAUDE.md",
  ".cursorrules",
  path.join(".github", "copilot-instructions.md"),
];

if (!fs.existsSync(SOURCE)) {
  console.error(`[sync-agent-context] Missing source: ${SOURCE}`);
  process.exit(1);
}

const source = fs.readFileSync(SOURCE, "utf-8");
const header = `<!-- This file is auto-generated from AGENTS.md by scripts/sync-agent-context.mjs. Do not edit directly. -->\n\n`;

for (const rel of TARGETS) {
  const dest = path.join(REPO_ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, header + source, "utf-8");
  console.log(`[sync-agent-context] Wrote ${rel}`);
}

console.log("[sync-agent-context] Done.");
