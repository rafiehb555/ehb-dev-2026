import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { CreateInspectionTaskSchema, ListInspectionTasksQuerySchema } from "@/lib/franchise/schemas";
import { writeAuditLog } from "@/lib/audit";
import { isMongoObjectId } from "@/lib/mongoId";

function demoInspectionTasks() {
  const now = Date.now();
  return [
    {
      id: "task-demo-1",
      status: "ASSIGNED",
      dueDate: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 60 * 60 * 1000).toISOString(),
      franchise: { id: "fr-1", name: "Lahore East", city: "Lahore" },
      report: null,
      escalations: [],
      crbApplication: { id: "crb-demo-2", industry: "Healthcare", documents: [{ id: "doc-1" }] },
    },
    {
      id: "task-demo-2",
      status: "IN_PROGRESS",
      dueDate: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      franchise: { id: "fr-2", name: "Karachi Core", city: "Karachi" },
      report: { id: "report-1", score: 84, fraudSuspected: false },
      escalations: [],
      crbApplication: { id: "crb-demo-1", industry: "Construction", documents: [{ id: "doc-2" }] },
    },
    {
      id: "task-demo-3",
      status: "ESCALATED",
      dueDate: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 30 * 60 * 1000).toISOString(),
      franchise: { id: "fr-3", name: "Islamabad Central", city: "Islamabad" },
      report: { id: "report-2", score: 42, fraudSuspected: true },
      escalations: [{ id: "esc-1", level: "CORPORATE" }],
      crbApplication: { id: "crb-demo-3", industry: "Education", documents: [] },
    },
  ];
}

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

    if (!process.env.DATABASE_URL || !isMongoObjectId(auth.user.userId)) {
      const filtered = demoInspectionTasks().filter((item) => (q.status ? item.status === q.status : true));
      return ok({ items: filtered.slice(skip, skip + take), total: filtered.length, take, skip });
    }

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

