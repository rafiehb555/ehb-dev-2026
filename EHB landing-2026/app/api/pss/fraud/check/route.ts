import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { PssFraudCheckSchema } from "@/lib/pss/schemas";
import { detectFraudForCase } from "@/lib/pss/intelligence";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = PssFraudCheckSchema.parse(await req.json());
    const fraud = await detectFraudForCase(body.caseId);
    if (!fraud) return fail(404, "NOT_FOUND", "PSS case not found");

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "PSS_FRAUD_CHECK_EXECUTED",
      targetType: "PSS_VERIFICATION",
      targetId: body.caseId,
      metadata: fraud as any,
    });

    return ok({ fraud });
  } catch (err) {
    return handleRouteError(err);
  }
}

