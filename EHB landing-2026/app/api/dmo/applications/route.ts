import { prisma } from "@/lib/prisma";
import { isAdmin, isFranchise, requireSession } from "@/lib/rbac";
import { handleRouteError } from "@/lib/apiErrors";
import { writeAuditLog } from "@/lib/audit";
import { fail, ok } from "@/lib/apiResponse";
import { createDemoApplication, isDmoDemoMode, listDemoApplications } from "@/lib/dmo/demoStore";
import { syncApplicationRisk } from "@/lib/fraud/orchestration";

const APPLICATION_TYPE_VALUES = [
  "PSS_VERIFICATION",
  "PSS",
  "PSS_REFILL",
  "CRB_CERTIFICATION",
  "INDUSTRY_VERIFICATION",
  "CRB",
  "SERVICE",
  "PRODUCT",
  "SELLER_ONBOARDING",
  "ORDER_REVIEW",
  "COMPLIANCE",
  "FRANCHISE",
  "OTHER",
] as const;

type ApplicationType = (typeof APPLICATION_TYPE_VALUES)[number];

const APPLICATION_TYPES = new Set<ApplicationType>(APPLICATION_TYPE_VALUES);

const APPLICATION_STATUS_VALUES = ["NEW", "IN_REVIEW", "UNDER_INSPECTION", "APPROVED", "REJECTED"] as const;

type ApplicationStatus = (typeof APPLICATION_STATUS_VALUES)[number];

const APPLICATION_STATUSES = new Set<ApplicationStatus>(APPLICATION_STATUS_VALUES);

function parsePositiveInt(value: string | null, fallback: number, min: number, max: number) {
  if (!value) return fallback;
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < min || numeric > max) {
    throw new Error(`Expected integer between ${min} and ${max}`);
  }
  return numeric;
}

function parseApplicationType(value: unknown) {
  if (typeof value !== "string" || !APPLICATION_TYPES.has(value as ApplicationType)) {
    throw new Error("Invalid application type");
  }
  return value as ApplicationType;
}

function parseOptionalApplicationStatus(value: string | null): ApplicationStatus | undefined {
  if (!value) return undefined;
  return APPLICATION_STATUSES.has(value as ApplicationStatus) ? (value as ApplicationStatus) : undefined;
}

function parseOptionalApplicationType(value: string | null): ApplicationType | undefined {
  if (!value) return undefined;
  return APPLICATION_TYPES.has(value as ApplicationType) ? (value as ApplicationType) : undefined;
}

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const payload = (await req.json()) as Record<string, unknown>;
    const body = {
      type: parseApplicationType(payload.type),
      payload: typeof payload.payload === "object" && payload.payload !== null ? payload.payload : undefined,
      assignedToId: typeof payload.assignedToId === "string" && payload.assignedToId.length > 0 ? payload.assignedToId : undefined,
    };
    if (isDmoDemoMode()) {
      const application = createDemoApplication({
        type: body.type,
        applicantId: auth.user.userId,
        assignedToId: body.assignedToId,
        payload: (body.payload as Record<string, unknown>) ?? undefined,
      });
      return ok({ application }, { status: 201 });
    }
    // applicantId is taken from session, never from request body.
    const application = await prisma.application.create({
      data: {
        type: body.type,
        applicantId: auth.user.userId,
        assignedToId: body.assignedToId,
        payload: body.payload as any,
      },
      include: {
        applicant: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "DMO_APPLICATION_CREATED",
      targetType: "APPLICATION",
      targetId: application.id,
      metadata: { type: application.type, status: application.status },
    });

    await syncApplicationRisk(application.id, auth.user.userId);

    return ok({ application }, { status: 201 });
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function GET(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const url = new URL(req.url);
    const query = {
      status: parseOptionalApplicationStatus(url.searchParams.get("status")),
      type: parseOptionalApplicationType(url.searchParams.get("type")),
      take: parsePositiveInt(url.searchParams.get("take"), 50, 1, 200),
      skip: parsePositiveInt(url.searchParams.get("skip"), 0, 0, 5000),
    };

    if (isDmoDemoMode()) {
      const allApplications = listDemoApplications({
        take: 5000,
        skip: 0,
        status: query.status,
        type: query.type,
        role: auth.user.role,
        userId: auth.user.userId,
      });
      const applications = listDemoApplications({
        take: query.take ?? 50,
        skip: query.skip ?? 0,
        status: query.status,
        type: query.type,
        role: auth.user.role,
        userId: auth.user.userId,
      });
      const take = query.take;
      const skip = query.skip;
      return ok({
        applications,
        page: { take, skip, total: allApplications.length, hasNext: skip + applications.length < allApplications.length },
      });
    }

    const where = isAdmin(auth.user.role)
      ? {
          ...(query.status ? { status: query.status } : {}),
          ...(query.type ? { type: query.type } : {}),
        }
      : isFranchise(auth.user.role)
        ? {
            ...(query.status ? { status: query.status } : {}),
            ...(query.type ? { type: query.type } : {}),
            assignedToId: auth.user.userId,
          }
        : {
            ...(query.status ? { status: query.status } : {}),
            ...(query.type ? { type: query.type } : {}),
            applicantId: auth.user.userId,
          };

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: query.take,
      skip: query.skip,
      include: {
        applicant: { select: { id: true, name: true, email: true, role: true } },
        assignedTo: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    const total = await prisma.application.count({ where });
    const take = query.take;
    const skip = query.skip;
    return ok({
      applications,
      page: { take, skip, total, hasNext: skip + applications.length < total },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

