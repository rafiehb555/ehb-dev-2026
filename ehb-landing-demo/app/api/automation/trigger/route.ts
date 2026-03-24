import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { triggerAutomationEvent } from "@/lib/automation/engine";
import { TriggerAutomationSchema } from "@/lib/automation/schemas";

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = TriggerAutomationSchema.parse(await req.json());
    const result = await triggerAutomationEvent({
      event: body.event,
      actorUserId: auth.user.userId,
      correlationId: body.correlationId,
      data: body.data ?? {},
    });
    return ok(result, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

