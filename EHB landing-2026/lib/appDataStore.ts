import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { AppDataScope } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AppDataStorageMode = "database" | "filesystem";

type ParsePayload<T> = (value: unknown) => T;

export type StoredAppData<T> = {
  payload: T;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type AppDataRevisionEntry<T> = {
  revisionKey: string;
  reason: string;
  payload: T;
  createdAt: string;
};

function isMongoDatabaseUrl(value: string | undefined) {
  const normalized = value?.trim().toLowerCase();
  return Boolean(normalized && (normalized.startsWith("mongodb://") || normalized.startsWith("mongodb+srv://")));
}

function normalizeReason(reason: string) {
  const cleaned = reason.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-");
  return cleaned.replace(/^-|-$/g, "") || "manual-save";
}

function buildRevisionKey(reason: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${timestamp}-${normalizeReason(reason)}-${randomUUID().slice(0, 8)}`;
}

function asJsonValue<T>(value: T): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export function getAppDataStorageMode(): AppDataStorageMode {
  return isMongoDatabaseUrl(process.env.DATABASE_URL) ? "database" : "filesystem";
}

export function supportsDatabaseAppData() {
  return getAppDataStorageMode() === "database";
}

// Reusable durable storage for admin-managed JSON payloads such as JPS imports.
export async function readPersistentAppData<T>(
  scope: AppDataScope,
  parse: ParsePayload<T>
): Promise<StoredAppData<T> | null> {
  if (!supportsDatabaseAppData()) return null;

  const record = await prisma.appDataRecord.findUnique({ where: { scope } });
  if (!record) return null;

  return {
    payload: parse(record.payload),
    version: record.version,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function writePersistentAppData<T>(args: {
  scope: AppDataScope;
  payload: unknown;
  parse: ParsePayload<T>;
  reason: string;
  actorId?: string | null;
}): Promise<StoredAppData<T> & { revisionKey: string }> {
  const validated = args.parse(args.payload);

  return prisma.$transaction(async (tx) => {
    const current = await tx.appDataRecord.findUnique({ where: { scope: args.scope } });
    const revisionKey = buildRevisionKey(args.reason);

    await tx.appDataRevision.create({
      data: {
        scope: args.scope,
        revisionKey,
        reason: normalizeReason(args.reason),
        payload: asJsonValue(validated),
        createdById: args.actorId ?? null,
      },
    });

    const nextVersion = (current?.version ?? 0) + 1;
    const record = await tx.appDataRecord.upsert({
      where: { scope: args.scope },
      create: {
        scope: args.scope,
        payload: asJsonValue(validated),
        version: nextVersion,
        updatedById: args.actorId ?? null,
      },
      update: {
        payload: asJsonValue(validated),
        version: nextVersion,
        updatedById: args.actorId ?? null,
      },
    });

    return {
      payload: validated,
      version: record.version,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      revisionKey,
    };
  });
}

export async function clearPersistentAppData<T>(args: {
  scope: AppDataScope;
  parse: ParsePayload<T>;
  reason: string;
  actorId?: string | null;
}): Promise<boolean> {
  if (!supportsDatabaseAppData()) return false;

  return prisma.$transaction(async (tx) => {
    const current = await tx.appDataRecord.findUnique({ where: { scope: args.scope } });
    if (!current) return false;

    const validated = args.parse(current.payload);
    await tx.appDataRevision.create({
      data: {
        scope: args.scope,
        revisionKey: buildRevisionKey(args.reason),
        reason: normalizeReason(args.reason),
        payload: asJsonValue(validated),
        createdById: args.actorId ?? null,
      },
    });

    await tx.appDataRecord.delete({ where: { scope: args.scope } });
    return true;
  });
}

export async function listPersistentAppDataRevisions<T>(
  scope: AppDataScope,
  parse: ParsePayload<T>
): Promise<AppDataRevisionEntry<T>[]> {
  if (!supportsDatabaseAppData()) return [];

  const revisions = await prisma.appDataRevision.findMany({
    where: { scope },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return revisions.map((revision) => ({
    revisionKey: revision.revisionKey,
    reason: revision.reason,
    payload: parse(revision.payload),
    createdAt: revision.createdAt.toISOString(),
  }));
}

export async function restorePersistentAppDataRevision<T>(args: {
  scope: AppDataScope;
  revisionKey: string;
  parse: ParsePayload<T>;
  actorId?: string | null;
  reason?: string;
}): Promise<StoredAppData<T> & { revisionKey: string }> {
  const revision = await prisma.appDataRevision.findUnique({ where: { revisionKey: args.revisionKey } });

  if (!revision || revision.scope !== args.scope) {
    throw new Error(`Revision not found for scope ${args.scope}`);
  }

  return writePersistentAppData({
    scope: args.scope,
    payload: revision.payload,
    parse: args.parse,
    reason: args.reason ?? "restore",
    actorId: args.actorId,
  });
}
