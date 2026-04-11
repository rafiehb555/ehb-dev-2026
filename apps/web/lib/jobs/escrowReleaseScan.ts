import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function runEscrowReleaseScan(actorId: string) {
  const now = new Date();
  const candidates = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
    },
    orderBy: { updatedAt: "desc" },
    take: 500,
    select: { id: true, metadata: true, status: true },
  });

  let released = 0;
  for (const o of candidates) {
    const m = (o.metadata ?? {}) as Record<string, unknown>;
    if (typeof m.escrowReleasedAt === "string") continue;
    const rel = m.escrowRelease;
    if (typeof rel !== "string") continue;
    const releaseDate = new Date(rel);
    if (Number.isNaN(releaseDate.getTime()) || releaseDate > now) continue;

    await prisma.order.update({
      where: { id: o.id },
      data: {
        metadata: {
          ...m,
          escrowHeld: false,
          escrowReleasedAt: now.toISOString(),
          escrowAutoReleased: true,
        } as object,
      },
    });

    await writeAuditLog({
      actorId,
      action: "ESCROW_AUTO_RELEASED",
      targetType: "OTHER",
      targetId: o.id,
      metadata: { scannedAt: now.toISOString() },
    });
    released += 1;
  }

  return { scanned: candidates.length, released };
}

function authorizeCron(req: Request): boolean {
  if (req.headers.get("x-vercel-cron") === "1") return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") === secret) return true;
    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      return auth.slice("Bearer ".length) === secret;
    }
    return false;
  } catch {
    return false;
  }
}

export function isCronAuthorized(req: Request): boolean {
  return authorizeCron(req);
}
