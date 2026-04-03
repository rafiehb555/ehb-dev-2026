import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession, isAdmin } from "@/lib/rbac";
import { CreateCRBApplicationSchema, ListCRBApplicationsQuerySchema } from "@/lib/crb/schemas";
import { writeAuditLog } from "@/lib/audit";
import { isMongoObjectId } from "@/lib/mongoId";

function demoCrbApplications() {
  const now = Date.now();
  return [
    {
      id: "crb-demo-1",
      type: "SERVICE",
      industry: "Construction",
      status: "REVIEW",
      applicantId: "ehb-demo-user-1",
      applicant: { id: "ehb-demo-user-1", name: "Ali Khan", email: "ali@test.com", role: "USER" },
      documents: [{ id: "doc-1", type: "LICENSE", fileUrl: "https://example.com/license.pdf" }],
      inspection: null,
      certificate: null,
      notes: "Initial review in progress",
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "crb-demo-2",
      type: "COMPANY",
      industry: "Healthcare",
      status: "INSPECTION",
      applicantId: "ehb-demo-user-2",
      applicant: { id: "ehb-demo-user-2", name: "Sara Noor", email: "sara@test.com", role: "USER" },
      documents: [
        { id: "doc-2", type: "ID", fileUrl: "https://example.com/id.pdf" },
        { id: "doc-3", type: "PORTFOLIO", fileUrl: "https://example.com/portfolio.pdf" },
      ],
      inspection: { id: "inspection-1", score: 88, status: "IN_PROGRESS" },
      certificate: null,
      notes: "Site visit booked",
      createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "crb-demo-3",
      type: "SKILL",
      industry: "Education",
      status: "APPROVED",
      applicantId: "ehb-demo-user-3",
      applicant: { id: "ehb-demo-user-3", name: "Usman Raza", email: "usman@test.com", role: "USER" },
      documents: [{ id: "doc-4", type: "EXPERIENCE", fileUrl: "https://example.com/experience.pdf" }],
      inspection: { id: "inspection-2", score: 93, status: "APPROVED" },
      certificate: { id: "cert-1", status: "ACTIVE", expiryDate: new Date(now + 180 * 24 * 60 * 60 * 1000).toISOString() },
      notes: "Certificate issued",
      createdAt: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export async function POST(req: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const body = CreateCRBApplicationSchema.parse(await req.json());

    const created = await prisma.$transaction(async (tx) => {
      const crbApp = await tx.cRBApplication.create({
        data: {
          applicantId: auth.user.userId,
          type: body.type,
          industry: body.industry,
          notes: body.notes,
          documents: {
            create: body.documents.map((d) => ({ fileUrl: d.fileUrl, type: d.type })),
          },
        },
        include: { documents: true },
      });

      // Mirror into DMO queue as a governance task (real workflow control).
      const dmoTask = await tx.application.create({
        data: {
          type: "CRB_CERTIFICATION",
          status: "NEW",
          applicantId: auth.user.userId,
          payload: {
            crbApplicationId: crbApp.id,
            crbType: crbApp.type,
            industry: crbApp.industry,
          },
        },
      });

      await tx.cRBApplication.update({
        where: { id: crbApp.id },
        data: { dmoTaskId: dmoTask.id },
      });

      await writeAuditLog({
        actorId: auth.user.userId,
        action: "CRB_APPLICATION_SUBMITTED",
        targetType: "OTHER",
        targetId: crbApp.id,
        metadata: { dmoTaskId: dmoTask.id, type: crbApp.type, industry: crbApp.industry },
      });

      return { ...crbApp, dmoTaskId: dmoTask.id };
    });

    return ok(created);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function GET(req: Request) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

    const url = new URL(req.url);
    const q = ListCRBApplicationsQuerySchema.parse({
      status: url.searchParams.get("status") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
      query: url.searchParams.get("query") ?? undefined,
      take: url.searchParams.get("take") ?? undefined,
      skip: url.searchParams.get("skip") ?? undefined,
    });

    const where: any = {};
    if (q.status) where.status = q.status;
    if (q.type) where.type = q.type;
    if (q.query) {
      where.OR = [
        { industry: { contains: q.query, mode: "insensitive" } },
        { applicant: { name: { contains: q.query, mode: "insensitive" } } },
        { applicant: { email: { contains: q.query, mode: "insensitive" } } },
      ];
    }

    // USER: own applications only. ADMIN: all.
    if (!isAdmin(auth.user.role)) where.applicantId = auth.user.userId;

    const take = q.take ?? 50;
    const skip = q.skip ?? 0;

    if (!process.env.DATABASE_URL || !isMongoObjectId(auth.user.userId)) {
      const filtered = demoCrbApplications()
        .filter((item) => (q.status ? item.status === q.status : true))
        .filter((item) => (q.type ? item.type === q.type : true))
        .filter((item) =>
          q.query
            ? [item.industry, item.applicant.name, item.applicant.email].some((value) => value.toLowerCase().includes(q.query!.toLowerCase()))
            : true
        )
        .filter((item) => (isAdmin(auth.user.role) ? true : item.applicantId === auth.user.userId));
      return ok({ items: filtered.slice(skip, skip + take), total: filtered.length, take, skip });
    }

    const [items, total] = await prisma.$transaction([
      prisma.cRBApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
        include: {
          applicant: { select: { id: true, name: true, email: true, role: true } },
          documents: true,
          inspection: true,
          certificate: true,
        },
      }),
      prisma.cRBApplication.count({ where }),
    ]);

    return ok({ items, total, take, skip });
  } catch (err) {
    return handleRouteError(err);
  }
}

