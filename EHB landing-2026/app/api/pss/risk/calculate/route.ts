import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { PssRiskCalculateSchema } from "@/lib/pss/schemas";
import { calculateRiskForCase } from "@/lib/pss/intelligence";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = PssRiskCalculateSchema.parse(await req.json());
    const risk = await calculateRiskForCase(body.caseId);
    if (!risk) return fail(404, "NOT_FOUND", "PSS case not found");

    await prisma.pSSVerification.update({
      where: { id: body.caseId },
      data: {
        riskScore: risk.score,
        riskLevel: risk.level,
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "PSS_RISK_RECALCULATED",
      targetType: "PSS_VERIFICATION",
      targetId: body.caseId,
      metadata: risk as any,
    });

    return ok({ risk });
  } catch (err) {
    return handleRouteError(err);
  }
}

