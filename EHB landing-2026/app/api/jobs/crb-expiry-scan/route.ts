import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { writeAuditLog } from "@/lib/audit";
import { recalcUserStl } from "@/lib/stl/engine";

export async function POST() {
  try {
    const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const now = new Date();

    const expired = await prisma.cRBCertificate.findMany({
      where: { status: "ACTIVE", expiryDate: { lt: now } },
      select: { id: true, applicationId: true, entityId: true, type: true, industry: true, expiryDate: true },
      take: 500,
    });

    if (expired.length === 0) return ok({ expired: 0 });

    await prisma.$transaction(async (tx) => {
      for (const cert of expired) {
        await tx.cRBCertificate.update({ where: { id: cert.id }, data: { status: "EXPIRED" } });

        // Create a DMO task to renew certification (refilling law).
        await tx.application.create({
          data: {
            type: "CRB_CERTIFICATION",
            status: "NEW",
            applicantId: cert.entityId,
            payload: {
              crbRenewal: true,
              certificateId: cert.id,
              previousApplicationId: cert.applicationId,
              crbType: cert.type,
              industry: cert.industry,
              expiredAt: cert.expiryDate.toISOString(),
            },
          },
        });

        await writeAuditLog({
          actorId: auth.user.userId,
          action: "CRB_CERTIFICATE_EXPIRED",
          targetType: "OTHER",
          targetId: cert.id,
          metadata: { entityId: cert.entityId, expiryDate: cert.expiryDate.toISOString() },
        });
      }
    });

    // Recalc STL for impacted users (outside transaction to keep it fast).
    const uniqueUsers = Array.from(new Set(expired.map((e) => e.entityId)));
    for (const userId of uniqueUsers) {
      await recalcUserStl({ userId, reason: "CRB_CERTIFICATE_EXPIRED" });
    }

    return ok({ expired: expired.length, users: uniqueUsers.length });
  } catch (err) {
    return handleRouteError(err);
  }
}

