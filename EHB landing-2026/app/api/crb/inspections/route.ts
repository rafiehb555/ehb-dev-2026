import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { AssignInspectionSchema } from "@/lib/crb/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = AssignInspectionSchema.parse(await req.json());

    const created = await prisma.$transaction(async (tx) => {
      const app = await tx.cRBApplication.findUnique({ where: { id: body.applicationId } });
      if (!app) throw Object.assign(new Error("CRB application not found"), { statusCode: 404 });

      const inspection = await tx.cRBInspection.upsert({
        where: { applicationId: body.applicationId },
        create: {
          applicationId: body.applicationId,
          inspectorId: body.inspectorId,
          status: "ASSIGNED",
        },
        update: {
          inspectorId: body.inspectorId,
          status: "ASSIGNED",
          report: null,
          score: null,
        },
        include: { application: true },
      });

      await tx.cRBApplication.update({
        where: { id: body.applicationId },
        data: { status: "INSPECTION" },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "CRB_INSPECTION_ASSIGNED",
        targetType: "OTHER",
        targetId: inspection.id,
        metadata: { applicationId: body.applicationId, inspectorId: body.inspectorId },
      });

      return inspection;
    });

    return ok(created);
  } catch (err: any) {
    if (err?.statusCode === 404) return fail(404, "NOT_FOUND", "CRB application not found");
    return handleRouteError(err);
  }
}

export async function GET(req: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const url = new URL(req.url);
    const take = Math.min(200, Math.max(1, Number(url.searchParams.get("take") ?? 50)));
    const skip = Math.max(0, Number(url.searchParams.get("skip") ?? 0));

    const where: any = {};
    if (!isAdmin(auth.user.role)) {
      // Franchise inspectors see only their assigned inspections.
      where.inspectorId = auth.user.userId;
    }

    const [items, total] = await prisma.$transaction([
      prisma.cRBInspection.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take,
        skip,
        include: { application: { include: { documents: true, certificate: true } } },
      }),
      prisma.cRBInspection.count({ where }),
    ]);

    return ok({ items, total, take, skip });
  } catch (err) {
    return handleRouteError(err);
  }
}

