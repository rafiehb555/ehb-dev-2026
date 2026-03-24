import { z } from "zod";
import { requireSession } from "@/lib/rbac";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { completeVerificationPhase } from "@/lib/pss/refillEngine";

const BodySchema = z.object({
  userId: z.string().cuid().optional(), // optional; defaults to session user
  phase: z.number().int().min(1).max(6),
  riskLevel: z.enum(["low", "medium", "high"]).optional(),
});

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = BodySchema.parse(await req.json());
    const userId = body.userId ?? auth.user.userId;

    // Only admins can complete for someone else.
    if (body.userId && body.userId !== auth.user.userId && auth.user.role !== "ADMIN" && auth.user.role !== "SUPER_ADMIN") {
      return fail(403, "FORBIDDEN", "Forbidden");
    }

    const phase = body.phase as 1 | 2 | 3 | 4 | 5 | 6;
    const result = await completeVerificationPhase({
      actorUserId: auth.user.userId,
      userId,
      phase,
      riskLevel: body.riskLevel,
    });

    return ok({ verification: result.verification, refill: result.refill });
  } catch (err) {
    return handleRouteError(err);
  }
}

