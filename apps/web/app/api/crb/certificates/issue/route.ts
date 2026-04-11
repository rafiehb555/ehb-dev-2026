import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { IssueCertificateSchema } from "@/lib/crb/schemas";
import { writeAuditLog } from "@/lib/audit";
import { recalcUserStl } from "@/lib/stl/engine";

export async function POST(req: Request) {
  try {
    const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = IssueCertificateSchema.parse(await req.json());

    const result = await prisma.$transaction(async (tx) => {
      const app = await tx.cRBApplication.findUnique({
        where: { id: body.applicationId },
        include: { inspection: true, certificate: true },
      });
      if (!app) return { kind: "not_found" as const };

      const cert = await tx.cRBCertificate.upsert({
        where: { applicationId: body.applicationId },
        create: {
          applicationId: body.applicationId,
          entityId: app.applicantId,
          type: app.type,
          industry: app.industry,
          expiryDate: body.expiryDate,
          status: "ACTIVE",
        },
        update: {
          expiryDate: body.expiryDate,
          status: "ACTIVE",
        },
      });

      await tx.cRBApplication.update({
        where: { id: body.applicationId },
        data: { status: "APPROVED" },
      });

      // Registry record (CRB source)
      await tx.registryRecord.create({
        data: {
          entityType: "USER",
          entityId: app.applicantId,
          verificationSource: "CRB",
          status: "VERIFIED",
          issuedAt: new Date(),
          expiryDate: body.expiryDate,
        },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "CRB_CERTIFICATE_ISSUED",
        targetType: "OTHER",
        targetId: cert.id,
        metadata: { applicationId: body.applicationId, expiryDate: body.expiryDate.toISOString() },
      });

      return { kind: "ok" as const, cert, applicantId: app.applicantId };
    });

    if (result.kind === "not_found") return fail(404, "NOT_FOUND", "CRB application not found");

    await recalcUserStl({ userId: result.applicantId, reason: "CRB_CERTIFICATE_ISSUED" });
    return ok(result.cert);
  } catch (err) {
    return handleRouteError(err);
  }
}

