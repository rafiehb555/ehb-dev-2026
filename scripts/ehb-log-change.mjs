#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
//  ehb-log-change.mjs — append a change entry to ehb-status.log
//
//  Usage:
//    node scripts/ehb-log-change.mjs "feat(wallet): added escrow POST route" "partial"
//    node scripts/ehb-log-change.mjs "fix(stl): rounding bug in formula" "live"
//
//  The log is a plain JSONL file (one JSON object per line) that gets
//  rolled into ehb-status.json on the next run of ehb-status-update.mjs.
//  Every developer and every AI agent should call this script when they
//  make a meaningful change so the /development page stays fresh.
// ═══════════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const LOG_PATH = path.join(REPO_ROOT, "ehb-status.log");

const [, , rawMsg, rawStatus] = process.argv;

if (!rawMsg) {
  console.error(
    [
      "Usage: node scripts/ehb-log-change.mjs \"<message>\" [live|partial|pending]",
      "",
      "  message  — short commit-style description",
      "  status   — live (default), partial, or pending",
      "",
      "Examples:",
      '  node scripts/ehb-log-change.mjs "feat(wallet): added escrow POST route" partial',
      '  node scripts/ehb-log-change.mjs "fix(stl): rounding bug in formula" live',
    ].join("\n"),
  );
  process.exit(1);
}

const status = (rawStatus || "live").toLowerCase();
if (!["live", "partial", "pending"].includes(status)) {
  console.error(`Invalid status "${status}". Use live, partial, or pending.`);
  process.exit(1);
}

const entry = {
  ts: new Date().toISOString(),
  msg: rawMsg,
  status,
  by: process.env.EHB_AGENT_NAME || process.env.USER || process.env.USERNAME || "dev",
  cwd: process.cwd(),
};

fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + "\n", "utf-8");

console.log(`[ehb-log] appended to ehb-status.log: ${entry.msg}`);
console.log(`[ehb-log] Run "node scripts/ehb-status-update.mjs" to refresh ehb-status.json`);
