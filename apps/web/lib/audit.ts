import type { AuditTargetType, Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export async function writeAuditLog(args: {
  actorId?: string | null;
  action: string;
  targetType: AuditTargetType;
  targetId: string;
  metadata?: Prisma.InputJsonValue;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: args.actorId ?? null,
      action: args.action,
      targetType: args.targetType,
      targetId: args.targetId,
      metadata: args.metadata ?? undefined,
    },
  });
}

