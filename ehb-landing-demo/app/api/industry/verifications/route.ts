import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { CreateIndustryVerificationSchema } from "@/lib/industry/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = CreateIndustryVerificationSchema.parse(await req.json());

    const expiry = body.expiryDate ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6); // default 6 months

    const created = await prisma.$transaction(async (tx) => {
      const row = await tx.industryVerification.upsert({
        where: {
          entityType_entityId_industryId: {
            entityType: body.entityType,
            entityId: body.entityId,
            industryId: body.industryId,
          },
        },
        create: {
          entityType: body.entityType,
          entityId: body.entityId,
          industryId: body.industryId,
          status: "PENDING",
          weight: body.weight ?? 1.0,
          expiryDate: expiry,
          issuedAt: null,
          source: "CRB",
        },
        update: {
          status: "PENDING",
          weight: body.weight ?? 1.0,
          expiryDate: expiry,
          issuedAt: null,
        },
      });

      const dmoTask = await tx.application.create({
        data: {
          type: "INDUSTRY_VERIFICATION",
          status: "NEW",
          applicantId: auth.user.userId,
          payload: {
            industryVerificationId: row.id,
            entityType: row.entityType,
            entityId: row.entityId,
            industryId: row.industryId,
            expiryDate: expiry.toISOString(),
          },
        },
      });

      await tx.industryVerification.update({ where: { id: row.id }, data: { dmoTaskId: dmoTask.id } });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "INDUSTRY_VERIFICATION_REQUESTED",
        targetType: "OTHER",
        targetId: row.id,
        metadata: { dmoTaskId: dmoTask.id },
      });

      return { ...row, dmoTaskId: dmoTask.id };
    });

    return ok(created);
  } catch (err) {
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
    const entityType = url.searchParams.get("entityType");
    const entityId = url.searchParams.get("entityId");
    const status = url.searchParams.get("status");
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (status) where.status = status;

    // v1: admins can list all; non-admin list their own by applicantId via DMO payload linkage isn't trivial here.
    // So we allow filtered listing; UI can pass entityId they own.
    if (!isAdmin(auth.user.role) && !entityId) return fail(400, "MISSING_FILTER", "Provide entityId");

    const [items, total] = await prisma.$transaction([
      prisma.industryVerification.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take,
        skip,
        include: { industry: true },
      }),
      prisma.industryVerification.count({ where }),
    ]);

    return ok({ items, total, take, skip });
  } catch (err) {
    return handleRouteError(err);
  }
}

