import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { ListAutomationEventsQuerySchema } from "@/lib/automation/schemas";
import { isDmoDemoMode } from "@/lib/dmo/demoStore";

const db = prisma as any;

export async function GET(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const url = new URL(req.url);
    const query = ListAutomationEventsQuerySchema.parse({
      event: url.searchParams.get("event") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
    });

    if (isDmoDemoMode()) {
      return ok({
        events: [],
        page: { take: query.take ?? 50, skip: query.skip ?? 0 },
      });
    }

    const events = await db.automationEvent.findMany({
      where: {
        ...(query.event ? { eventType: query.event } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: query.take ?? 50,
      skip: query.skip ?? 0,
    });

    return ok({ events, page: { take: query.take ?? 50, skip: query.skip ?? 0 } });
  } catch (err) {
    return handleRouteError(err);
  }
}

