// ═══════════════════════════════════════════════════════════════════════════
//  /api/dev-status  — reads repo-level ehb-status.json and returns it as JSON.
//
//  This is the REAL-TIME data source for the /development page. The page
//  fetches this route on mount and every 15 seconds, so changes logged via
//  `node scripts/ehb-log-change.mjs` + `node scripts/ehb-status-update.mjs`
//  show up on the page without a redeploy.
//
//  Note: Next.js App Router route handlers run on the Node runtime, so
//  node:fs is available. We explicitly opt into `dynamic = "force-dynamic"`
//  so the file is re-read on every request, not cached at build time.
// ═══════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Walk up from apps/web/app/api/dev-status/route.ts to the repo root.
function resolveStatusFile(): string {
  // process.cwd() = apps/web when running `next dev` from apps/web
  // Fall back to relative from this file's compiled output dir.
  const fromCwd = path.resolve(process.cwd(), "..", "..", "ehb-status.json");
  return fromCwd;
}

export async function GET() {
  const file = resolveStatusFile();
  try {
    const raw = await fs.readFile(file, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(
      { ok: true, source: "ehb-status.json", data },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        error: "Could not read ehb-status.json",
        detail: message,
        hint:
          "Run `node scripts/ehb-status-update.mjs` at the repo root to regenerate the file.",
      },
      { status: 500 },
    );
  }
}
