import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeFraudSignal, calculateRiskScore } from "@/lib/fraud/riskEngine";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const SignalSchema = z.object({
  entityId:   z.string().min(1),
  entityType: z.enum(["USER", "APPLICATION", "ORDER", "PROVIDER", "SELLER", "FRANCHISE"]),
  signalType: z.enum([
    "FAILED_VERIFICATION", "RAPID_SUBMISSION", "LOCATION_MISMATCH",
    "INCOMPLETE_PROFILE", "LOW_CRB_BADGE", "MULTIPLE_ACCOUNTS",
    "SUSPICIOUS_ACTIVITY", "FAKE_REVIEW", "COMPLAINT_RECEIVED",
  ]),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// POST /api/fraud/signal — write a fraud signal
export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = SignalSchema.parse(await req.json());
    const signal = await writeFraudSignal(body);

    // Recalculate risk after new signal
    const risk = await calculateRiskScore(body.entityId);

    await writeAuditLog({
      actorId:    auth.user.userId,
      action:     "FRAUD_SIGNAL_WRITTEN",
      targetType: "USER",
      targetId:   body.entityId,
      metadata:   { signalType: body.signalType, newScore: risk.score, tier: risk.tier } as any,
    });

    return ok({ signal, risk });
  } catch (err) {
    return handleRouteError(err);
  }
}
