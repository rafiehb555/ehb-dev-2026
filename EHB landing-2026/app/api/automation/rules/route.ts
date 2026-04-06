import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { UpsertAutomationRuleSchema } from "@/lib/automation/schemas";
import { isDmoDemoMode } from "@/lib/dmo/demoStore";

const db = prisma as any;

export async function GET() {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    if (isDmoDemoMode()) return ok({ rules: [] });
    const rules = await db.automationRule.findMany({
      orderBy: [{ eventType: "asc" }, { priority: "asc" }],
    });
    return ok({ rules });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = UpsertAutomationRuleSchema.parse(await req.json());
    if (isDmoDemoMode()) {
      return ok({ demo: true, saved: body }, { status: 201 });
    }

    const rule = await db.automationRule.upsert({
      where: { code: body.code },
      update: {
        name: body.name,
        description: body.description,
        eventType: body.event,
        isActive: body.active,
        priority: body.priority,
        conditions: body.conditions ?? undefined,
        actions: body.actions,
      },
      create: {
        code: body.code,
        name: body.name,
        description: body.description,
        eventType: body.event,
        isActive: body.active,
        priority: body.priority,
        conditions: body.conditions ?? undefined,
        actions: body.actions,
        createdById: auth.user.userId,
      },
    });

    return ok({ rule }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

