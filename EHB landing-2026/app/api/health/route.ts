import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type PrismaMongo = {
  $runCommandRaw?: (cmd: Record<string, unknown>) => Promise<unknown>;
};

function isLivenessProbe(req: Request) {
  const l = new URL(req.url).searchParams.get("liveness");
  return l === "1" || l?.toLowerCase() === "true";
}

/**
 * Lightweight deploy / smoke check. Safe to call from uptime monitors.
 * `gitSha` appears when `VERCEL_GIT_COMMIT_SHA` is set (Vercel).
 *
 * `?liveness=1` — process is up only; skips DB (always 200 when the route runs).
 */
export async function GET(req: Request) {
  const fullSha = process.env.VERCEL_GIT_COMMIT_SHA;
  const timestamp = new Date().toISOString();
  const uptimeSec = Math.floor(process.uptime());
  const liveness = isLivenessProbe(req);

  if (liveness) {
    return NextResponse.json({
      ok: true,
      liveness: true,
      service: "ehb-landing-demo",
      timestamp,
      uptimeSec,
      db: { skipped: true },
      ...(fullSha ? { gitSha: fullSha.slice(0, 7) } : {}),
    });
  }

  const startedAt = Date.now();
  let db: { ok: boolean; latencyMs: number; error?: string };

  try {
    await prisma.$connect();
    const ext = prisma as unknown as PrismaMongo;
    if (typeof ext.$runCommandRaw === "function") {
      await ext.$runCommandRaw({ ping: 1 });
    } else {
      await prisma.user.count();
    }
    db = { ok: true, latencyMs: Date.now() - startedAt };
  } catch (e) {
    db = {
      ok: false,
      latencyMs: Date.now() - startedAt,
      error: e instanceof Error ? e.message : "Database check failed",
    };
  }

  return NextResponse.json(
    {
      ok: db.ok,
      service: "ehb-landing-demo",
      timestamp,
      uptimeSec,
      db,
      ...(fullSha ? { gitSha: fullSha.slice(0, 7) } : {}),
    },
    { status: db.ok ? 200 : 503 }
  );
}
