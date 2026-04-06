import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";

const SubmitReportSchema = z.object({
  inspectionId: z.string().cuid(),
  score: z.coerce.number().min(0).max(100),
  report: z.string().min(3).max(20000),
  media: z.array(z.string().url()).max(30).optional(),
});

export async function POST(req: Request) {
  try {
    const auth = await requireSession(["FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = SubmitReportSchema.parse(await req.json());
    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.cRBInspection.findUnique({
        where: { id: body.inspectionId },
        include: { application: true },
      });
      if (!existing) return null;

      if (
        auth.user.role !== "ADMIN" &&
        auth.user.role !== "SUPER_ADMIN" &&
        existing.inspectorId !== auth.user.userId
      ) {
        return "FORBIDDEN" as const;
      }

      const row = await tx.cRBInspection.update({
        where: { id: body.inspectionId },
        data: {
          status: "SUBMITTED",
          score: body.score,
          report: body.report,
        },
      });

      await tx.cRBApplication.update({
        where: { id: existing.applicationId },
        data: { status: "REVIEW" },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "CRB_INSPECTION_REPORT_SUBMITTED",
        targetType: "OTHER",
        targetId: row.id,
        metadata: {
          applicationId: existing.applicationId,
          score: body.score,
          mediaCount: body.media?.length ?? 0,
        },
      });

      return row;
    });

    if (updated === "FORBIDDEN") return fail(403, "FORBIDDEN", "Forbidden");
    if (!updated) return fail(404, "NOT_FOUND", "Inspection not found");
    return ok(updated, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

