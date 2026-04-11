import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { ApproveIndustryVerificationSchema } from "@/lib/industry/schemas";
import { writeAuditLog } from "@/lib/audit";
import { recalcProductStl, recalcServiceStl, recalcUserStl } from "@/lib/stl/engine";

export async function POST(req: Request) {
  try {
    const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = ApproveIndustryVerificationSchema.parse(await req.json());

    const updated = await prisma.$transaction(async (tx) => {
      const row = await tx.industryVerification.findUnique({ where: { id: body.id } });
      if (!row) return { kind: "not_found" as const };

      const next = await tx.industryVerification.update({
        where: { id: body.id },
        data: {
          status: body.status,
          score: body.score ?? null,
          issuedAt: body.status === "VERIFIED" ? new Date() : null,
          expiryDate: body.expiryDate ?? row.expiryDate,
        },
      });

      // close DMO task if present
      if (row.dmoTaskId) {
        await tx.application.update({
          where: { id: row.dmoTaskId },
          data: { status: body.status === "VERIFIED" ? "APPROVED" : body.status === "REJECTED" ? "REJECTED" : "IN_REVIEW" },
        });
      }

      // schedule refill when verified
      if (body.status === "VERIFIED" && (body.expiryDate ?? row.expiryDate)) {
        const due = body.expiryDate ?? row.expiryDate!;
        await tx.industryRefill.create({
          data: { verificationId: next.id, dueDate: due, status: "PENDING" },
        });
      }

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "INDUSTRY_VERIFICATION_DECISION",
        targetType: "OTHER",
        targetId: next.id,
        metadata: { status: next.status, score: next.score ? Number(next.score) : null },
      });

      return { kind: "ok" as const, next };
    });

    if (updated.kind === "not_found") return fail(404, "NOT_FOUND", "Industry verification not found");

    if (updated.next.entityType === "COMPANY") {
      await recalcUserStl({
        userId: updated.next.entityId,
        reason: "INDUSTRY_VERIFICATION_DECISION",
        actorId: auth.user.userId,
      }).catch(() => undefined);
    }
    if (updated.next.entityType === "SERVICE") {
      await recalcServiceStl({
        serviceId: updated.next.entityId,
        reason: "INDUSTRY_VERIFICATION_DECISION",
        actorId: auth.user.userId,
      }).catch(() => undefined);
    }
    if (updated.next.entityType === "PRODUCT") {
      await recalcProductStl({
        productId: updated.next.entityId,
        reason: "INDUSTRY_VERIFICATION_DECISION",
        actorId: auth.user.userId,
      }).catch(() => undefined);
    }
    return ok(updated.next);
  } catch (err) {
    return handleRouteError(err);
  }
}

