import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { AttachIndustriesSchema } from "@/lib/industry/schemas";
import { writeAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = AttachIndustriesSchema.parse(await req.json());

    // v1: authenticated users can attach industries to their entities; enforcement of ownership
    // can be added once entity ownership relations are formalized for all entity types.
    const created = await prisma.$transaction(async (tx) => {
      await tx.entityIndustry.deleteMany({
        where: { entityType: body.entityType, entityId: body.entityId },
      });
      const rows = await tx.entityIndustry.createMany({
        data: Array.from(new Set(body.industryIds)).map((industryId) => ({
          entityType: body.entityType,
          entityId: body.entityId,
          industryId,
        })),
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "INDUSTRY_ATTACHED",
        targetType: "OTHER",
        targetId: body.entityId,
        metadata: { entityType: body.entityType, industryIds: body.industryIds },
      });

      return rows;
    });

    return ok(created);
  } catch (err) {
    return handleRouteError(err);
  }
}

