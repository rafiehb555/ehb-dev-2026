import { z } from "zod";
import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

const ExtendSchema = z.object({
  orderId: z.string().min(1),
  extraDays: z.number().int().min(1).max(14).default(3),
  reason: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = ExtendSchema.parse(await req.json());
    const order = await prisma.order.findUnique({ where: { id: body.orderId } });
    if (!order) return fail(404, "NOT_FOUND", "Order not found");

    const metadata = ((order.metadata ?? {}) as Record<string, unknown>) ?? {};
    const currentRelease = typeof metadata.escrowRelease === "string" ? new Date(metadata.escrowRelease) : new Date();
    const nextRelease = new Date(currentRelease.getTime() + body.extraDays * 24 * 60 * 60 * 1000);

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        metadata: {
          ...metadata,
          escrowHeld: true,
          escrowExtendedAt: new Date().toISOString(),
          escrowRelease: nextRelease.toISOString(),
          escrowExtensionReason: body.reason ?? "Dispute review",
          extendedBy: auth.user.userId,
        } as any,
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "ESCROW_EXTENDED",
      targetType: "OTHER",
      targetId: order.id,
      metadata: {
        extraDays: body.extraDays,
        nextRelease: nextRelease.toISOString(),
        reason: body.reason ?? null,
      },
    });

    return ok({ order: updated, nextRelease });
  } catch (err) {
    return handleRouteError(err);
  }
}
