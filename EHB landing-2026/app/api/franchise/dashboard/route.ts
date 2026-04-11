import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { isMongoObjectId } from "@/lib/mongoId";

function demoDashboard() {
  return {
    stats: {
      openTasks: 4,
      inProgress: 2,
      completed: 12,
      escalated: 1,
      pendingBookings: 6,
      activeBookings: 3,
    },
    profile: {
      roleScope: "Demo Franchise Control",
      operatorId: "ehb-demo-admin",
      assignedFranchises: [
        { id: "demo-franchise-lahore", name: "Lahore East", city: "Lahore", level: "SUB", status: "active" },
        { id: "demo-franchise-karachi", name: "Karachi Core", city: "Karachi", level: "CORPORATE", status: "active" },
      ],
      nextDueTask: {
        id: "demo-task-1",
        industry: "Construction",
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        status: "ASSIGNED",
      },
    },
    suggestions: [
      "Review pending service bookings and assign local operators.",
      "Submit overdue inspection reports before SLA breach.",
      "Escalate any fraud-flagged inspection to corporate level.",
    ],
  };
}

export async function GET() {
  const auth = await requireSession(["FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  if (!process.env.DATABASE_URL || !isMongoObjectId(auth.user.userId)) {
    return ok(demoDashboard());
  }

  try {
    const memberships = await prisma.franchiseUser.findMany({
      where: isAdmin(auth.user.role) ? {} : { userId: auth.user.userId },
      include: {
        franchise: {
          select: { id: true, name: true, city: true, level: true, status: true },
        },
      },
      take: 20,
    });

    const franchiseIds = memberships.map((item) => item.franchiseId);
    const taskWhere = isAdmin(auth.user.role)
      ? {}
      : {
          OR: [
            { inspectorId: auth.user.userId },
            ...(franchiseIds.length > 0 ? [{ franchiseId: { in: franchiseIds } }] : []),
          ],
        };
    const bookingWhere = isAdmin(auth.user.role)
      ? { type: "SERVICE", status: { in: ["NEW", "IN_REVIEW", "UNDER_INSPECTION"] as const } }
      : {
          type: "SERVICE",
          status: { in: ["NEW", "IN_REVIEW", "UNDER_INSPECTION"] as const },
          OR: [{ assignedToId: auth.user.userId }, { assignedToId: null }],
        };

    const [taskStats, bookingCount, nextDueTask] = await Promise.all([
      prisma.inspectionTask.groupBy({
        by: ["status"],
        where: taskWhere,
        _count: { _all: true },
      }),
      prisma.application.count({
        where: bookingWhere as any,
      }),
      prisma.inspectionTask.findFirst({
        where: taskWhere,
        orderBy: { dueDate: "asc" },
        include: {
          crbApplication: { select: { industry: true } },
        },
      }),
    ]);

    const countByStatus = Object.fromEntries(taskStats.map((row) => [row.status, row._count._all]));
    return ok({
      stats: {
        openTasks: Number(countByStatus.ASSIGNED ?? 0),
        inProgress: Number(countByStatus.IN_PROGRESS ?? 0),
        completed: Number(countByStatus.COMPLETED ?? 0),
        escalated: Number(countByStatus.ESCALATED ?? 0),
        pendingBookings: bookingCount,
        activeBookings: Number(countByStatus.ASSIGNED ?? 0) + Number(countByStatus.IN_PROGRESS ?? 0),
      },
      profile: {
        roleScope: isAdmin(auth.user.role) ? "Global Franchise Operations" : "Assigned Franchise Operations",
        operatorId: auth.user.userId,
        assignedFranchises: memberships.map((item) => ({
          id: item.franchise.id,
          name: item.franchise.name ?? "Franchise Unit",
          city: item.franchise.city,
          level: item.franchise.level,
          status: item.franchise.status,
        })),
        nextDueTask: nextDueTask
          ? {
              id: nextDueTask.id,
              industry: nextDueTask.crbApplication.industry,
              dueDate: nextDueTask.dueDate.toISOString(),
              status: nextDueTask.status,
            }
          : null,
      },
      suggestions: [
        "Use bookings page to claim or update service booking requests.",
        "Use inspections page for geo-tagged reports and escalations.",
        "Keep overdue tasks low to maintain franchise trust and SLA health.",
      ],
    });
  } catch (err) {
    return handleRouteError(err);
  }
}
