import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { SubmitInspectionReportSchema } from "@/lib/franchise/schemas";
import { writeAuditLog } from "@/lib/audit";
import { recalcUserStl } from "@/lib/stl/engine";

export async function POST(req: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = SubmitInspectionReportSchema.parse(await req.json());

    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.inspectionTask.findUnique({
        where: { id: body.taskId },
        include: { crbApplication: true },
      });
      if (!task) return { kind: "not_found" as const };

      if (!isAdmin(auth.user.role) && task.inspectorId !== auth.user.userId) return { kind: "forbidden" as const };

      const report = await tx.inspectionReport.upsert({
        where: { taskId: body.taskId },
        create: {
          taskId: body.taskId,
          inspectorId: auth.user.userId,
          findings: body.findings,
          score: body.score,
          mediaUrls: body.mediaUrls ?? [],
          fraudSuspected: body.fraudSuspected ?? false,
          fraudNotes: body.fraudNotes,
          geoLat: body.geo ? body.geo.lat : undefined,
          geoLng: body.geo ? body.geo.lng : undefined,
          geoAccuracyM: body.geo?.accuracyM,
          capturedAt: body.geo?.capturedAt,
          deviceHash: body.deviceHash,
        },
        update: {
          findings: body.findings,
          score: body.score,
          mediaUrls: body.mediaUrls ?? [],
          fraudSuspected: body.fraudSuspected ?? false,
          fraudNotes: body.fraudNotes,
          geoLat: body.geo ? body.geo.lat : undefined,
          geoLng: body.geo ? body.geo.lng : undefined,
          geoAccuracyM: body.geo?.accuracyM,
          capturedAt: body.geo?.capturedAt,
          deviceHash: body.deviceHash,
        },
      });

      await tx.inspectionTask.update({
        where: { id: body.taskId },
        data: { status: "COMPLETED" },
      });

      // Move DMO task back to review for decision.
      if (task.dmoApplicationId) {
        await tx.application.update({ where: { id: task.dmoApplicationId }, data: { status: "IN_REVIEW" } });
      }

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "FRANCHISE_REPORT_SUBMITTED",
        targetType: "OTHER",
        targetId: report.id,
        metadata: { taskId: body.taskId, score: body.score, fraudSuspected: body.fraudSuspected ?? false },
      });

      return { kind: "ok" as const, report, applicantId: task.crbApplication.applicantId };
    });

    if (result.kind === "not_found") return fail(404, "NOT_FOUND", "Task not found");
    if (result.kind === "forbidden") return fail(403, "FORBIDDEN", "Forbidden");

    await recalcUserStl({ userId: result.applicantId, reason: "FRANCHISE_REPORT_SUBMITTED", actorId: auth.user.userId });
    return ok(result.report);
  } catch (err) {
    return handleRouteError(err);
  }
}

