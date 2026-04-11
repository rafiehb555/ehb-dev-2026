import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { resolveEntitySignals } from "@/lib/fraud/riskEngine";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const ResolveSchema = z.object({ entityId: z.string().min(1) });

// POST /api/fraud/resolve — clear all signals for an entity
export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const { entityId } = ResolveSchema.parse(await req.json());
    const result = await resolveEntitySignals(entityId);

    await writeAuditLog({
      actorId:    auth.user.userId,
      action:     "FRAUD_SIGNALS_RESOLVED",
      targetType: "USER",
      targetId:   entityId,
      metadata:   { clearedCount: result.count } as any,
    });

    return ok({ cleared: result.count });
  } catch (err) {
    return handleRouteError(err);
  }
}
