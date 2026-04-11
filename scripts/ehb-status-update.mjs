#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
//  ehb-status-update.mjs — regenerate ehb-status.json
//
//  1. Probes the three local services (frontend/api/ai) and Mongo.
//  2. Rolls entries from ehb-status.log into recentChanges.
//  3. Keeps existing build percentages (edit them by hand or via your own
//     tooling — this script does not try to guess what they should be).
//  4. Writes ehb-status.json back to the repo root.
//
//  Usage:
//    node scripts/ehb-status-update.mjs
//
//  No CLI args. Exits 0 even when services are down — a down service just
//  means the corresponding health entry becomes "down".
// ═══════════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import net from "node:net";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const STATUS_PATH = path.join(REPO_ROOT, "ehb-status.json");
const LOG_PATH = path.join(REPO_ROOT, "ehb-status.log");

// ── helpers ─────────────────────────────────────────────────────────────
function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return null;
  }
}

function readLog() {
  if (!fs.existsSync(LOG_PATH)) return [];
  return fs
    .readFileSync(LOG_PATH, "utf-8")
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function probeHttp(url, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      res.resume();
      resolve({ ok: res.statusCode !== undefined && res.statusCode < 500, status: "up" });
    });
    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false, status: "down" });
    });
    req.on("error", () => resolve({ ok: false, status: "down" }));
  });
}

function probeTcp(host, port, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    const finish = (status) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve({ status });
    };
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish("up"));
    socket.once("timeout", () => finish("down"));
    socket.once("error", () => finish("down"));
    socket.connect(port, host);
  });
}

// ── main ────────────────────────────────────────────────────────────────
async function main() {
  const prev = readJson(STATUS_PATH) || {};
  const nowIso = new Date().toISOString();

  // Probe health
  const [frontend, api, ai, mongo] = await Promise.all([
    probeHttp("http://127.0.0.1:3000/"),
    probeHttp("http://127.0.0.1:5000/api/health"),
    probeHttp("http://127.0.0.1:8080/health"),
    probeTcp("127.0.0.1", 27017),
  ]);

  const health = {
    frontend: { url: "http://localhost:3000",           lastProbedAt: nowIso, status: frontend.status },
    api:      { url: "http://localhost:5000/api/health", lastProbedAt: nowIso, status: api.status },
    ai:       { url: "http://localhost:8080/health",     lastProbedAt: nowIso, status: ai.status },
    mongo:    { url: "mongodb://127.0.0.1:27017",        lastProbedAt: nowIso, status: mongo.status },
  };

  // Roll log into recentChanges (keep newest 50)
  const logged = readLog();
  const previousRecent = Array.isArray(prev.recentChanges) ? prev.recentChanges : [];
  const merged = [...logged.reverse(), ...previousRecent];
  const recentChanges = merged.slice(0, 50);

  // Preserve fields that humans edit
  const build = prev.build || {
    coreSystems: {},
    phase1Industries: {},
    phases: {},
  };
  const priorities = prev.priorities || [];
  const warnings = prev.warnings || [];
  const missingFiles = prev.missingFiles || [];
  const urgentFixes = prev.urgentFixes || [];
  const bugs = prev.bugs || [];
  const duplicates = prev.duplicates || [];
  const missingInfo = prev.missingInfo || [];
  const emptyFiles = prev.emptyFiles || [];

  const next = {
    schema: "ehb-status/v2",
    generatedAt: nowIso,
    generator: "scripts/ehb-status-update.mjs",
    company: "EHB Technologies (Pvt.) Ltd.",
    repoRoot: prev.repoRoot || "D:\\EHB DEVELOPMENT 2026",
    health,
    build,
    priorities,
    warnings,
    urgentFixes,
    bugs,
    duplicates,
    missingInfo,
    emptyFiles,
    missingFiles,
    recentChanges,
    notes:
      "This file is machine-written by scripts/ehb-status-update.mjs. " +
      "To log a change, run: node scripts/ehb-log-change.mjs \"<message>\" \"<live|partial|pending>\"",
  };

  fs.writeFileSync(STATUS_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8");

  // Truncate the rolled log so entries don't get double-counted
  if (fs.existsSync(LOG_PATH)) {
    fs.writeFileSync(LOG_PATH, "", "utf-8");
  }

  console.log(`[ehb-status] Wrote ${STATUS_PATH}`);
  console.log(`[ehb-status] frontend=${health.frontend.status}  api=${health.api.status}  ai=${health.ai.status}  mongo=${health.mongo.status}`);
  console.log(`[ehb-status] Rolled ${logged.length} log entries. recentChanges=${recentChanges.length}`);
}

main().catch((err) => {
  console.error("[ehb-status] FAILED:", err);
  process.exit(1);
});
