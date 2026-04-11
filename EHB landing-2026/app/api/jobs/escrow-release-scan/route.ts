import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { isCronAuthorized, runEscrowReleaseScan } from "@/lib/jobs/escrowReleaseScan";

async function resolveCronActorId(): Promise<string | null> {
  const envId = process.env.CRON_ACTOR_ID?.trim();
  if (envId) return envId;
  const u = await prisma.user.findFirst({
    where: { role: { in: ["SUPER_ADMIN", "ADMIN"] } },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  return u?.id ?? null;
}

/**
 * Manual / operator trigger (session).
 */
export async function POST() {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const result = await runEscrowReleaseScan(auth.user.userId);
    return ok(result);
  } catch (err) {
    return handleRouteError(err);
  }
}

/**
 * Vercel Cron (GET) or `?secret=CRON_SECRET`. Uses `CRON_ACTOR_ID` or first admin for audit logs.
 */
export async function GET(req: Request) {
  try {
    if (!isCronAuthorized(req)) {
      return fail(401, "AUTH", "Unauthorized");
    }
    const actorId = await resolveCronActorId();
    if (!actorId) {
      return fail(503, "CONFIG", "Set CRON_ACTOR_ID or seed an admin user");
    }
    const result = await runEscrowReleaseScan(actorId);
    return ok(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
