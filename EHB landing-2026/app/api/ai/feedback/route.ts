import { z } from "zod";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { getSessionUser } from "@/lib/auth";
import { trackEvent } from "@/lib/ai/recommendationEngine";

const FeedbackSchema = z.object({
  cardId: z.string().min(1),
  helpful: z.boolean(),
  industry: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return fail(401, "AUTH", "Login required");

    const body = FeedbackSchema.parse(await req.json());
    await trackEvent({
      userId: user.userId,
      eventType: body.helpful ? "RECOMMENDATION_CLICK" : "RECOMMENDATION_DISMISS",
      entityId: body.cardId,
      entityType: "ai_insight_feedback",
      metadata: {
        industry: body.industry ?? null,
        helpful: body.helpful,
      },
    });

    return ok({ saved: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
