import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { restoreJpsBackup, listJpsBackups } from "@/lib/jps/store";
import { writeAuditLog } from "@/lib/audit";
import type { Prisma } from "@prisma/client";

async function writeJpsBackupAudit(args: {
  actorId: string;
  action: string;
  metadata?: Prisma.InputJsonValue;
}) {
  try {
    await writeAuditLog({
      actorId: args.actorId,
      action: args.action,
      targetType: "OTHER",
      targetId: "jps-backups",
      metadata: args.metadata,
    });
  } catch {
    // Backup restore should not fail if audit persistence is unavailable.
  }
}

export async function GET() {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const backups = await listJpsBackups();
    return ok({ backups });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = (await req.json()) as { fileName?: string };
    const fileName = body?.fileName?.trim();
    if (!fileName) return fail(400, "VALIDATION_ERROR", "Backup fileName is required");

    const restored = await restoreJpsBackup(fileName, auth.user.userId);
    await writeJpsBackupAudit({
      actorId: auth.user.userId,
      action: "JPS_BACKUP_RESTORED",
      metadata: {
        fileName,
        profiles: restored.profiles.length,
        skillCategories: restored.skillCategories.length,
        designationLadders: Object.keys(restored.designationLadders).length,
      },
    });

    return ok({
      message: "JPS backup restored successfully.",
      fileName,
      counts: {
        profiles: restored.profiles.length,
        skillCategories: restored.skillCategories.length,
        designationLadders: Object.keys(restored.designationLadders).length,
        systemNotes: restored.systemNotes.length,
      },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
