import { NextResponse } from "next/server";

/**
 * Lightweight deploy / smoke check. Safe to call from uptime monitors.
 * `gitSha` appears when `VERCEL_GIT_COMMIT_SHA` is set (Vercel).
 */
export async function GET() {
  const fullSha = process.env.VERCEL_GIT_COMMIT_SHA;
  return NextResponse.json({
    ok: true,
    service: "ehb-landing-demo",
    ...(fullSha ? { gitSha: fullSha.slice(0, 7) } : {}),
  });
}
