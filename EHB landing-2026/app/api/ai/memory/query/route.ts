import type { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/apiResponse";
import { handleRouteError } from "@/lib/apiErrors";
import { requireSession } from "@/lib/rbac";
import { writeAuditLog } from "@/lib/audit";
import { MemoryQuerySchema } from "@/lib/ai/schemas";
import { checkMemoryQueryAllowed, queryMemoryBrain } from "@/lib/ai/memory";

function asJsonValue<T>(value: T): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function POST(req: Request) {
  const auth = await requireSession(["USER", "FRANCHISE", "ADMIN", "SUPER_ADMIN"]);
  if (!auth.ok) return fail(auth.status, "AUTH", auth.error);

  try {
    const body = MemoryQuerySchema.parse(await req.json());

    const guard = checkMemoryQueryAllowed(body.message);
    if (!guard.ok) {
      await writeAuditLog({
        actorId: auth.user.userId,
        action: "AI_MEMORY_QUERY_BLOCKED",
        targetType: "OTHER",
        targetId: body.traceId ?? auth.user.userId,
        metadata: {
          reason: guard.reason,
          messagePreview: body.message.slice(0, 200),
        },
      }).catch(() => undefined);

      return fail(403, "MEMORY_QUERY_BLOCKED", `Only EHB read-only memory queries are allowed. ${guard.reason}`);
    }

    const result = await queryMemoryBrain({ message: body.message });

    await writeAuditLog({
      actorId: auth.user.userId,
      action: "AI_MEMORY_QUERY_OK",
      targetType: "OTHER",
      targetId: body.traceId ?? auth.user.userId,
      metadata: {
        model: result.model,
        usage: result.usage == null ? null : asJsonValue(result.usage),
      },
    }).catch(() => undefined);

    return ok({
      answer: result.answer,
      meta: {
        mode: "READ_ONLY_MEMORY",
        model: result.model,
        traceId: body.traceId ?? null,
      },
    });
  } catch (err) {
    return handleRouteError(err);
  }
}

