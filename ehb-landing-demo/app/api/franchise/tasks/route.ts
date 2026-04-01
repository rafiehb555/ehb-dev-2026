import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { CreateInspectionTaskSchema, ListInspectionTasksQuerySchema } from "@/lib/franchise/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = CreateInspectionTaskSchema.parse(await req.json());

    const crb = await prisma.cRBApplication.findUnique({ where: { id: body.crbApplicationId } });
    if (!crb) return fail(404, "NOT_FOUND", "CRB application not found");

    const task = await prisma.inspectionTask.create({
      data: {
        crbApplicationId: body.crbApplicationId,
        dmoApplicationId: body.dmoApplicationId ?? crb.dmoTaskId ?? null,
        franchiseId: body.franchiseId,
        inspectorId: body.inspectorId ?? null,
        dueDate: body.dueDate,
        status: "ASSIGNED",
      },
      include: {
        franchise: true,
        crbApplication: { include: { documents: true } },
        inspector: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    await prisma.cRBApplication.update({ where: { id: crb.id }, data: { status: "INSPECTION" } });
    if (task.dmoApplicationId) {
      await prisma.application.update({ where: { id: task.dmoApplicationId }, data: { status: "UNDER_INSPECTION" } });
    }

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "FRANCHISE_TASK_ASSIGNED",
      targetType: "OTHER",
      targetId: task.id,
      metadata: {
        crbApplicationId: crb.id,
        franchiseId: body.franchiseId,
        inspectorId: body.inspectorId ?? null,
        dmoId: task.dmoApplicationId ?? null,
      },
    });

    return ok(task);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function GET(req: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const url = new URL(req.url);
    const q = ListInspectionTasksQuerySchema.parse({
      status: url.searchParams.get("status") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
    });

    const take = q.take ?? 50;
    const skip = q.skip ?? 0;

    const where: any = {};
    if (q.status) where.status = q.status;

    // Non-admin: only tasks assigned to them (inspectorId).
    if (!isAdmin(auth.user.role)) where.inspectorId = auth.user.userId;

    const [items, total] = await Promise.all([
      prisma.inspectionTask.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take,
        skip,
        include: {
          franchise: true,
          report: true,
          escalations: { orderBy: { createdAt: "desc" } },
          crbApplication: { include: { documents: true } },
        },
      }),
      prisma.inspectionTask.count({ where }),
    ]);

    return ok({ items, total, take, skip });
  } catch (err) {
    return handleRouteError(err);
  }
}

