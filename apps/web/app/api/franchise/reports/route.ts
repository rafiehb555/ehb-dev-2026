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

    const task = await prisma.inspectionTask.findUnique({
      where: { id: body.taskId },
      include: { crbApplication: true },
    });
    if (!task) return fail(404, "NOT_FOUND", "Task not found");
    if (!isAdmin(auth.user.role) && task.inspectorId !== auth.user.userId) return fail(403, "FORBIDDEN", "Forbidden");

    const report = await prisma.inspectionReport.upsert({
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

    await prisma.inspectionTask.update({
      where: { id: body.taskId },
      data: { status: "COMPLETED" },
    });

    if (task.dmoApplicationId) {
      await prisma.application.update({ where: { id: task.dmoApplicationId }, data: { status: "IN_REVIEW" } });
    }

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "FRANCHISE_REPORT_SUBMITTED",
      targetType: "OTHER",
      targetId: report.id,
      metadata: { taskId: body.taskId, score: body.score, fraudSuspected: body.fraudSuspected ?? false },
    });

    await recalcUserStl({ userId: task.crbApplication.applicantId, reason: "FRANCHISE_REPORT_SUBMITTED", actorId: auth.user.userId }).catch(() => undefined);
    return ok(report);
  } catch (err) {
    return handleRouteError(err);
  }
}

