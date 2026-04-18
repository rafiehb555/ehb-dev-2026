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
//  This script also chains ehb-canonical-sync.mjs to synchronize canonical
//  department files into master documentation.
//
//  Run this after editing AGENTS.md or canonical department files:
//    node scripts/sync-agent-context.mjs
// ═══════════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

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

console.log("\n[1/2] Mirroring AGENTS.md into other agent formats...\n");

const source = fs.readFileSync(SOURCE, "utf-8");
const header = `<!-- This file is auto-generated from AGENTS.md by scripts/sync-agent-context.mjs. Do not edit directly. -->\n\n`;

for (const rel of TARGETS) {
  const dest = path.join(REPO_ROOT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, header + source, "utf-8");
  console.log(`  ✓ Wrote ${rel}`);
}

console.log("\n✓ AGENTS.md mirrored successfully.\n");

// Chain canonical-sync
console.log("[2/2] Syncing canonical departments into master documentation...\n");

const canonicalScript = path.join(REPO_ROOT, "scripts", "ehb-canonical-sync.mjs");
if (!fs.existsSync(canonicalScript)) {
  console.warn(`  ⚠ Canonical sync script not found: ${canonicalScript}`);
  console.warn(`  Skipping canonical auto-sync (non-blocking).\n`);
} else {
  const proc = spawn("node", [canonicalScript], {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });

  proc.on("exit", (code) => {
    if (code === 0) {
      console.log("\n✓ Canonical sync completed successfully.\n");
      console.log("✨ Full sync pipeline complete (AGENTS.md + canonical departments)!");
      process.exit(0);
    } else {
      console.error(`\n❌ Canonical sync exited with code ${code}`);
      process.exit(code);
    }
  });

  proc.on("error", (err) => {
    console.error(`\n❌ Failed to spawn canonical-sync: ${err.message}`);
    process.exit(1);
  });
}
