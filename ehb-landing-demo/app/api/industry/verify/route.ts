import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { IndustryVerifySchema } from "@/lib/industry/schemas";
import { writeAuditLog } from "@/lib/audit";
import { recalcServiceStl, recalcProductStl, recalcUserStl } from "@/lib/stl/engine";

export async function POST(req: Request) {
  try {
    const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = IndustryVerifySchema.parse(await req.json());

    // REQUEST flow: create/refresh verification request and DMO task.
    if (!("mode" in body) || body.mode !== "DECISION") {
      const expiry = body.expiryDate ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 6);
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
            source: "MANUAL",
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
              source: "INDUSTRY_VERIFY_REQUEST",
            },
          },
        });
        await tx.industryVerification.update({
          where: { id: row.id },
          data: { dmoTaskId: dmoTask.id },
        });

        await writeAuditLog({
          actorId: auth.user.userId,
          action: "INDUSTRY_VERIFY_REQUESTED",
          targetType: "OTHER",
          targetId: row.id,
          metadata: { dmoTaskId: dmoTask.id },
        });
        return { ...row, dmoTaskId: dmoTask.id };
      });
      return ok(created, { status: 201 });
    }

    // DECISION flow: admin-only decision on requested verification.
    if (auth.user.role !== "ADMIN" && auth.user.role !== "SUPER_ADMIN") {
      return fail(403, "FORBIDDEN", "Only admin can decide industry verification");
    }

    const decided = await prisma.$transaction(async (tx) => {
      const row = await tx.industryVerification.findUnique({ where: { id: body.verificationId } });
      if (!row) return null;

      const next = await tx.industryVerification.update({
        where: { id: body.verificationId },
        data: {
          status: body.status,
          score: body.score ?? null,
          issuedAt: body.status === "VERIFIED" ? new Date() : null,
          expiryDate: body.expiryDate ?? row.expiryDate,
        },
      });

      if (row.dmoTaskId) {
        await tx.application.update({
          where: { id: row.dmoTaskId },
          data: { status: body.status === "VERIFIED" ? "APPROVED" : "REJECTED" },
        });
      }

      if (body.status === "VERIFIED" && (body.expiryDate ?? row.expiryDate)) {
        const due = body.expiryDate ?? row.expiryDate!;
        await tx.industryRefill.create({
          data: { verificationId: next.id, dueDate: due, status: "PENDING" },
        });
      }

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "INDUSTRY_VERIFY_DECISION",
        targetType: "OTHER",
        targetId: next.id,
        metadata: { status: next.status, score: next.score ? Number(next.score) : null },
      });

      return next;
    });

    if (!decided) return fail(404, "NOT_FOUND", "Industry verification not found");

    if (decided.entityType === "COMPANY") {
      await recalcUserStl({
        userId: decided.entityId,
        actorId: auth.user.userId,
        reason: "INDUSTRY_VERIFY_DECISION",
      }).catch(() => undefined);
    }
    if (decided.entityType === "SERVICE") {
      await recalcServiceStl({
        serviceId: decided.entityId,
        actorId: auth.user.userId,
        reason: "INDUSTRY_VERIFY_DECISION",
      }).catch(() => undefined);
    }
    if (decided.entityType === "PRODUCT") {
      await recalcProductStl({
        productId: decided.entityId,
        actorId: auth.user.userId,
        reason: "INDUSTRY_VERIFY_DECISION",
      }).catch(() => undefined);
    }

    return ok(decided, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

