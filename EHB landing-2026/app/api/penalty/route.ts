import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiResponse";
import { requireSession } from "@/lib/rbac";

type PenaltyStatus = "ACTIVE" | "RESOLVED" | "APPEAL";

type PenaltyRow = {
  id: string;
  user: { name: string };
  type: "SLA_DELAY" | "REFILL_MISS" | "FRAUD" | "QUALITY";
  amount: number;
  reason: string;
  status: PenaltyStatus;
  createdAt: string;
  stlImpact: number;
};

function demoPenalties(): PenaltyRow[] {
  const now = Date.now();
  return [
    {
      id: "pen-1",
      user: { name: "Ali Khan" },
      type: "SLA_DELAY",
      amount: 50,
      reason: "Late response on assigned application",
      status: "ACTIVE",
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      stlImpact: -5,
    },
    {
      id: "pen-2",
      user: { name: "Sara Ahmed" },
      type: "REFILL_MISS",
      amount: 120,
      reason: "Missed verification renewal grace period",
      status: "APPEAL",
      createdAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
      stlImpact: -15,
    },
    {
      id: "pen-3",
      user: { name: "Usman Tariq" },
      type: "FRAUD",
      amount: 400,
      reason: "Repeated fraud detection signals",
      status: "RESOLVED",
      createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
      stlImpact: -40,
    },
  ];
}

function stlImpactByAmount(amount: number) {
  if (amount >= 300) return -40;
  if (amount >= 100) return -15;
  return -5;
}

function penaltyTypeByReason(reason: string): PenaltyRow["type"] {
  const r = reason.toLowerCase();
  if (r.includes("fraud")) return "FRAUD";
  if (r.includes("refill") || r.includes("renewal")) return "REFILL_MISS";
  if (r.includes("quality")) return "QUALITY";
  return "SLA_DELAY";
}

function statusByAction(action: string): PenaltyStatus {
  const a = action.toUpperCase();
  if (a.includes("RESOLVED")) return "RESOLVED";
  if (a.includes("APPEAL")) return "APPEAL";
  return "ACTIVE";
}

export async function GET() {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return ok(demoPenalties());

  if (!process.env.DATABASE_URL) return ok(demoPenalties());

  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { action: { contains: "PENALTY" } },
          { action: { contains: "REFILL_EXPIRED" } },
          { action: { contains: "FRAUD", mode: "insensitive" } },
          { action: { contains: "SLA", mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        action: true,
        createdAt: true,
        actor: { select: { name: true } },
        metadata: true,
      },
    });

    const rows: PenaltyRow[] = logs.map((l) => {
      const md = (l.metadata ?? {}) as Record<string, unknown>;
      const amount = typeof md.amount === "number" ? md.amount : typeof md.penaltyAmount === "number" ? md.penaltyAmount : 50;
      const reason =
        typeof md.reason === "string"
          ? md.reason
          : typeof md.message === "string"
            ? md.message
            : l.action.replaceAll("_", " ");
      const type = penaltyTypeByReason(reason);
      const status = statusByAction(l.action);
      const actorName = l.actor?.name ?? "System";

      return {
        id: l.id,
        user: { name: actorName },
        type,
        amount,
        reason,
        status,
        createdAt: l.createdAt.toISOString(),
        stlImpact: stlImpactByAmount(amount),
      };
    });

    return ok(rows.length > 0 ? rows : demoPenalties());
  } catch {
    return ok(demoPenalties());
  }
}

