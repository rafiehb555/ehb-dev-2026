import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { JpsImportPayloadSchema } from "@/lib/jps/schemas";
import {
  clearJpsOverride,
  getJpsStorageMode,
  readJpsOverride,
  writeJpsOverride,
} from "@/lib/jps/store";
import { writeAuditLog } from "@/lib/audit";
import type { Prisma } from "@prisma/client";

async function writeJpsImportAudit(args: {
  actorId: string;
  action: string;
  metadata?: Prisma.InputJsonValue;
}) {
  try {
    await writeAuditLog({
      actorId: args.actorId,
      action: args.action,
      targetType: "OTHER",
      targetId: "jps-import",
      metadata: args.metadata,
    });
  } catch {
    // Do not block JPS import flow if audit persistence is unavailable.
  }
}

export async function GET() {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const payload = await readJpsOverride();
    return ok({
      hasImportedData: Boolean(payload),
      payload,
      storageMode: getJpsStorageMode(),
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = JpsImportPayloadSchema.parse(await req.json());
    const saved = await writeJpsOverride(body, auth.user.userId);
    await writeJpsImportAudit({
      actorId: auth.user.userId,
      action: "JPS_IMPORT_SAVED",
      metadata: {
        profiles: saved.profiles.length,
        skillCategories: saved.skillCategories.length,
        designationLadders: Object.keys(saved.designationLadders).length,
        systemNotes: saved.systemNotes.length,
      },
    });

    return ok(
      {
        message: "JPS import data saved successfully.",
        counts: {
          profiles: saved.profiles.length,
          skillCategories: saved.skillCategories.length,
          designationLadders: Object.keys(saved.designationLadders).length,
          systemNotes: saved.systemNotes.length,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE() {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    await clearJpsOverride(auth.user.userId);
    await writeJpsImportAudit({
      actorId: auth.user.userId,
      action: "JPS_IMPORT_CLEARED",
      metadata: { cleared: true },
    });
    return ok({ message: "Imported JPS data cleared. Demo/doc fallback is active again." });
  } catch (err) {
    return handleRouteError(err);
  }
}
