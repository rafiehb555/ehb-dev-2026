import { prisma } from "@/lib/prisma";
import { isAdmin, isFranchise, requireSession } from "@/lib/rbac";
import { handleRouteError } from "@/lib/apiErrors";
import { fail, ok } from "@/lib/apiResponse";
import { ListAuditQuerySchema } from "@/lib/dmo/schemas";
import { isDmoDemoMode, listDemoAudit } from "@/lib/dmo/demoStore";

export async function GET(req: Request) {
  const auth = await requireSession(["FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const url = new URL(req.url);
    const query = ListAuditQuerySchema.parse({
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
      targetType: url.searchParams.get("targetType") ?? undefined,
      targetId: url.searchParams.get("targetId") ?? undefined,
      applicationId: url.searchParams.get("applicationId") ?? undefined,
    });

    if (isDmoDemoMode()) {
      const logs = listDemoAudit({
        take: query.take ?? 50,
        skip: query.skip ?? 0,
        targetType: query.targetType ?? undefined,
        targetId: query.targetId ?? undefined,
      });
      return ok({ logs, page: { take: query.take ?? 50, skip: query.skip ?? 0 } });
    }

    const roleWhere = isAdmin(auth.user.role)
      ? {}
      : isFranchise(auth.user.role)
        ? {
            // Franchise can only view audit events related to their assigned applications.
            targetType: "APPLICATION" as const,
            targetId: {
              in: (
                await prisma.application.findMany({
                  where: { assignedToId: auth.user.userId },
                  select: { id: true },
                  take: 500,
                })
              ).map((a: { id: string }) => a.id),
            },
          }
        : null;

    if (roleWhere === null) return fail(403, "FORBIDDEN", "Forbidden");

    const appScopedWhere = query.applicationId
      ? {
          OR: [
            { targetType: "APPLICATION" as const, targetId: query.applicationId },
            {
              targetType: "APPROVAL" as const,
              targetId: {
                in: (
                  await prisma.approval.findMany({
                    where: { applicationId: query.applicationId },
                    select: { id: true },
                    take: 200,
                  })
                ).map((a) => a.id),
              },
            },
          ],
        }
      : {};

    const logs = await prisma.auditLog.findMany({
      where: {
        ...roleWhere,
        ...(query.targetType ? { targetType: query.targetType } : {}),
        ...(query.targetId ? { targetId: query.targetId } : {}),
        ...appScopedWhere,
      },
      orderBy: { createdAt: "desc" },
      take: query.take ?? 50,
      skip: query.skip ?? 0,
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return ok({ logs, page: { take: query.take ?? 50, skip: query.skip ?? 0 } });
  } catch (err) {
    return handleRouteError(err);
  }
}

