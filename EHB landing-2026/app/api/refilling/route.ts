import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiResponse";

type RefillRow = {
  id: string;
  user: { name: string };
  type: "PSS" | "INDUSTRY";
  dueDate: string;
  status: "ACTIVE" | "WARNING" | "EXPIRED" | "COMPLETED";
  stlImpact: string;
};

function statusFromDueDate(args: { dueDate: Date; rawStatus: "PENDING" | "COMPLETED" | "EXPIRED" }) {
  if (args.rawStatus === "COMPLETED") return "COMPLETED" as const;
  if (args.rawStatus === "EXPIRED") return "EXPIRED" as const;
  const now = Date.now();
  const due = args.dueDate.getTime();
  if (due < now) return "EXPIRED" as const;
  const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 7) return "WARNING" as const;
  return "ACTIVE" as const;
}

function stlImpactForStatus(status: RefillRow["status"]) {
  if (status === "EXPIRED") return "-10 STL if unresolved";
  if (status === "WARNING") return "No impact yet";
  if (status === "COMPLETED") return "Trust maintained";
  return "Stable";
}

function fallbackDemoRows(): RefillRow[] {
  return [
    {
      id: "demo-pss-1",
      user: { name: "Ali Khan" },
      type: "PSS",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: "WARNING",
      stlImpact: "No impact yet",
    },
    {
      id: "demo-industry-1",
      user: { name: "Sara Ahmed" },
      type: "INDUSTRY",
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "EXPIRED",
      stlImpact: "-10 STL if unresolved",
    },
  ];
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return ok(fallbackDemoRows());
  }

  try {
    const [pssRefills, industryRefills] = await Promise.all([
      prisma.pSSRefill.findMany({
        take: 250,
        orderBy: { dueDate: "asc" },
        include: {
          verification: {
            select: {
              user: { select: { name: true } },
            },
          },
        },
      }),
      prisma.industryRefill.findMany({
        take: 250,
        orderBy: { dueDate: "asc" },
        include: {
          verification: {
            select: {
              entityId: true,
            },
          },
        },
      }),
    ]);

    const entityIds = Array.from(new Set(industryRefills.map((r) => r.verification.entityId)));
    const users = entityIds.length
      ? await prisma.user.findMany({
          where: { id: { in: entityIds } },
          select: { id: true, name: true },
        })
      : [];
    const userMap = new Map(users.map((u) => [u.id, u.name]));

    const pssRows: RefillRow[] = pssRefills.map((r) => {
      const status = statusFromDueDate({ dueDate: r.dueDate, rawStatus: r.status });
      return {
        id: r.id,
        user: { name: r.verification.user.name },
        type: "PSS",
        dueDate: r.dueDate.toISOString(),
        status,
        stlImpact: stlImpactForStatus(status),
      };
    });

    const industryRows: RefillRow[] = industryRefills.map((r) => {
      const status = statusFromDueDate({ dueDate: r.dueDate, rawStatus: r.status });
      const ownerName = userMap.get(r.verification.entityId) ?? `Entity ${r.verification.entityId.slice(0, 8)}`;
      return {
        id: r.id,
        user: { name: ownerName },
        type: "INDUSTRY",
        dueDate: r.dueDate.toISOString(),
        status,
        stlImpact: stlImpactForStatus(status),
      };
    });

    const items = [...pssRows, ...industryRows].sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
    return ok(items);
  } catch {
    return ok(fallbackDemoRows());
  }
}

