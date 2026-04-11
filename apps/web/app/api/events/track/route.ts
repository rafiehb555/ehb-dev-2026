import { ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { trackEvent } from "@/lib/ai/recommendationEngine";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const TrackSchema = z.object({
  eventType:   z.enum(["PAGE_VIEW","SEARCH","CLICK","FAVOURITE","ORDER","APPLY","RECOMMENDATION_CLICK","RECOMMENDATION_DISMISS"]),
  entityId:    z.string().optional(),
  entityType:  z.string().optional(),
  metadata:    z.record(z.string(), z.unknown()).optional(),
});

// POST /api/events/track — silent background tracking
export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const userId = user?.userId ?? "anonymous";
    const body = TrackSchema.parse(await req.json());

    await trackEvent({ userId, ...body });
    return ok({ tracked: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
