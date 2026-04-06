import { requireSession } from "@/lib/rbac";
import { ok, fail } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { prisma } from "@/lib/prisma";
import { writeFraudSignal } from "@/lib/fraud/riskEngine";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const db = prisma as any;

const ComplaintSchema = z.object({
  targetId:    z.string().min(1),
  targetType:  z.string().min(1),
  type:        z.enum(["FAKE_PRODUCT","NOT_DELIVERED","FRAUD","QUALITY_ISSUE","FAKE_REVIEW","HARASSMENT","OTHER"]),
  description: z.string().min(10).max(1000),
});

// POST /api/gosellr/complaint — submit a complaint
export async function POST(req: Request) {
  const auth = await requireSession();
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = ComplaintSchema.parse(await req.json());

    // Create complaint record
    const complaint = await db.complaint.create({
      data: {
        complainantId: auth.user.userId,
        targetId:      body.targetId,
        targetType:    body.targetType,
        type:          body.type,
        description:   body.description,
        status:        "PENDING",
      },
    });

    // Auto-write a fraud signal for the target
    await writeFraudSignal({
      entityId:   body.targetId,
      entityType: "SELLER",
      signalType: "COMPLAINT_RECEIVED",
      metadata:   { complaintId: complaint.id, type: body.type },
    });

    // AI auto-review: flag FRAUD and FAKE_PRODUCT immediately
    if (body.type === "FRAUD" || body.type === "FAKE_PRODUCT") {
      await db.complaint.update({
        where: { id: complaint.id },
        data:  { status: "AI_REVIEW", aiReviewNote: "Auto-flagged: high-severity complaint type" },
      });
    }

    await writeAuditLog({
      actorId:    auth.user.userId,
      action:     "COMPLAINT_SUBMITTED",
      targetType: "OTHER",
      targetId:   complaint.id,
      metadata:   { targetId: body.targetId, type: body.type } as any,
    });

    return ok({ complaint, message: "Complaint submitted. Review within 72 hours." });
  } catch (err) {
    return handleRouteError(err);
  }
}

// GET /api/gosellr/complaint?targetId=xxx  — get complaints for an entity
export async function GET(req: Request) {
  const auth = await requireSession(["ADMIN", "SUPER_ADMIN", "FRANCHISE"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");
    const status   = searchParams.get("status");

    const complaints = await db.complaint.findMany({
      where: {
        ...(targetId ? { targetId } : {}),
        ...(status   ? { status: status as any } : {}),
      },
      orderBy: { createdAt: "desc" },
      take:    50,
    });

    return ok({ complaints, total: complaints.length });
  } catch (err) {
    return handleRouteError(err);
  }
}
