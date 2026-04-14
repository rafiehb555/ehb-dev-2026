/**
 * ═══════════════════════════════════════════════════════════════════════
 *  GoSellr — Manual Franchise Assignment
 *  POST /api/gosellr/franchise/assign
 *
 *  Admin / DMO officer manually assigns a seller to a specific franchise
 *  (e.g., when auto-assignment by country didn't find a match, or when a
 *  regional Country-Franchise owner redirects the seller to a Sub unit).
 * ═══════════════════════════════════════════════════════════════════════
 */

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";

const AssignSchema = z.object({
  userId: z.string().min(1),
  franchiseId: z.string().min(1),
  role: z.enum(["SELLER", "INSPECTOR", "OPS"]).optional(),
  applicationId: z.string().optional(),
});

export async function POST(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = AssignSchema.parse(await req.json());

    const [user, franchise] = await Promise.all([
      prisma.user.findUnique({ where: { id: body.userId }, select: { id: true, email: true } }),
      prisma.franchise.findUnique({
        where: { id: body.franchiseId },
        select: { id: true, name: true, country: true, level: true, status: true },
      }),
    ]);
    if (!user) return fail(404, "USER_NOT_FOUND", "User not found");
    if (!franchise) return fail(404, "FRANCHISE_NOT_FOUND", "Franchise not found");
    if (franchise.status !== "active") {
      return fail(400, "FRANCHISE_INACTIVE", "Franchise is not active");
    }

    const link = await prisma.franchiseUser.upsert({
      where: { userId_franchiseId: { userId: user.id, franchiseId: franchise.id } },
      update: { role: body.role ?? "SELLER" },
      create: { userId: user.id, franchiseId: franchise.id, role: body.role ?? "SELLER" },
      select: { id: true, franchiseId: true, role: true, createdAt: true },
    });

    // If an application id was provided, stamp the onboardingState
    if (body.applicationId) {
      const app = await prisma.application.findUnique({
        where: { id: body.applicationId },
        select: { payload: true },
      });
      const payload = (app?.payload ?? {}) as Record<string, unknown>;
      await prisma.application
        .update({
          where: { id: body.applicationId },
          data: {
            payload: {
              ...payload,
              franchiseId: franchise.id,
              franchiseName: franchise.name,
              onboardingState: "FRANCHISE_ASSIGNED",
              franchiseAssignedAt: new Date().toISOString(),
              franchiseAssignedBy: auth.user.userId,
            },
          },
        })
        .catch(() => null);
    }

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "GOSELLR_FRANCHISE_ASSIGNED",
      targetType: "USER",
      targetId: user.id,
      metadata: {
        franchiseId: franchise.id,
        franchiseName: franchise.name,
        country: franchise.country,
        level: franchise.level,
        role: body.role ?? "SELLER",
        applicationId: body.applicationId ?? null,
      },
    });

    return ok({
      link,
      franchise: {
        id: franchise.id,
        name: franchise.name,
        country: franchise.country,
        level: franchise.level,
      },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
