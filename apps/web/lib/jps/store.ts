import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { AppDataScope } from "@prisma/client";
import {
  clearPersistentAppData,
  getAppDataStorageMode,
  listPersistentAppDataRevisions,
  readPersistentAppData,
  restorePersistentAppDataRevision,
  writePersistentAppData,
  type AppDataStorageMode,
} from "@/lib/appDataStore";
import { getJpsOverview, type JpsOverview } from "@/lib/jps/data";
import { JpsImportPayloadSchema, type JpsImportPayload } from "@/lib/jps/schemas";

const JPS_OVERRIDE_PATH = path.join(process.cwd(), "data", "jps", "overview.json");
const JPS_BACKUP_DIR = path.join(process.cwd(), "data", "jps", "backups");

export type JpsBackupSummary = {
  fileName: string;
  createdAt: string;
  reason: string;
  profiles: number;
  skillCategories: number;
  designationLadders: number;
  systemNotes: number;
};

function parseJpsOverview(payload: unknown): JpsOverview {
  return JpsImportPayloadSchema.parse(payload);
}

function backupFileName(reason: string) {
  const safeReason = reason.replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-").toLowerCase();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${timestamp}-${safeReason}.json`;
}

function reasonFromFileName(fileName: string) {
  return fileName.replace(/\.json$/i, "").split("-").slice(7).join("-") || "manual-save";
}

function createdAtFromFileName(fileName: string) {
  const match = fileName.match(
    /^(\d{4}-\d{2}-\d{2}T\d{2})-(\d{2})-(\d{2})-(\d{3})Z/i
  );
  if (!match) return fileName;
  const [, prefix, minutes, seconds, millis] = match;
  return `${prefix}:${minutes}:${seconds}.${millis}Z`;
}

function summaryFromPayload(fileName: string, createdAt: string, reason: string, payload: JpsImportPayload) {
  return {
    fileName,
    createdAt,
    reason,
    profiles: payload.profiles.length,
    skillCategories: payload.skillCategories.length,
    designationLadders: Object.keys(payload.designationLadders).length,
    systemNotes: payload.systemNotes.length,
  } satisfies JpsBackupSummary;
}

async function readJpsOverrideFromFile(): Promise<JpsOverview | null> {
  try {
    const raw = await readFile(JPS_OVERRIDE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parseJpsOverview(parsed);
  } catch {
    return null;
  }
}

async function writeBackupFile(payload: JpsImportPayload, reason: string): Promise<string> {
  const validated = JpsImportPayloadSchema.parse(payload);
  await mkdir(JPS_BACKUP_DIR, { recursive: true });
  const fileName = backupFileName(reason);
  await writeFile(path.join(JPS_BACKUP_DIR, fileName), JSON.stringify(validated, null, 2), "utf8");
  return fileName;
}

async function writeJpsOverrideToFile(payload: JpsImportPayload): Promise<JpsOverview> {
  const validated = JpsImportPayloadSchema.parse(payload);
  await mkdir(path.dirname(JPS_OVERRIDE_PATH), { recursive: true });
  await writeFile(JPS_OVERRIDE_PATH, JSON.stringify(validated, null, 2), "utf8");
  await writeBackupFile(validated, "save");
  return validated;
}

async function clearJpsOverrideFromFile(): Promise<void> {
  const current = await readJpsOverrideFromFile();
  if (current) {
    await writeBackupFile(current, "clear");
  }
  await rm(JPS_OVERRIDE_PATH, { force: true });
}

async function listJpsBackupsFromFile(): Promise<JpsBackupSummary[]> {
  try {
    const entries = await readdir(JPS_BACKUP_DIR, { withFileTypes: true });
    const fileNames = entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json"))
      .map((entry) => entry.name)
      .sort((a, b) => b.localeCompare(a));

    const backups = await Promise.all(
      fileNames.map(async (fileName) => {
        try {
          const raw = await readFile(path.join(JPS_BACKUP_DIR, fileName), "utf8");
          const parsed = parseJpsOverview(JSON.parse(raw));
          return summaryFromPayload(fileName, createdAtFromFileName(fileName), reasonFromFileName(fileName), parsed);
        } catch {
          return null;
        }
      })
    );

    return backups.filter((entry): entry is JpsBackupSummary => Boolean(entry)).slice(0, 25);
  } catch {
    return [];
  }
}

async function restoreJpsBackupFromFile(fileName: string): Promise<JpsOverview> {
  const safeFileName = path.basename(fileName);
  const raw = await readFile(path.join(JPS_BACKUP_DIR, safeFileName), "utf8");
  const parsed = parseJpsOverview(JSON.parse(raw));
  await mkdir(path.dirname(JPS_OVERRIDE_PATH), { recursive: true });
  await writeFile(JPS_OVERRIDE_PATH, JSON.stringify(parsed, null, 2), "utf8");
  await writeBackupFile(parsed, "restore");
  return parsed;
}

export function getJpsStorageMode(): AppDataStorageMode {
  return getAppDataStorageMode();
}

export async function readJpsOverride(): Promise<JpsOverview | null> {
  if (getJpsStorageMode() === "database") {
    const stored = await readPersistentAppData(AppDataScope.JPS, parseJpsOverview);
    return stored?.payload ?? null;
  }

  return readJpsOverrideFromFile();
}

export async function writeJpsOverride(
  payload: JpsImportPayload,
  actorId?: string | null
): Promise<JpsOverview> {
  if (getJpsStorageMode() === "database") {
    const stored = await writePersistentAppData({
      scope: AppDataScope.JPS,
      payload,
      parse: parseJpsOverview,
      reason: "save",
      actorId,
    });

    return stored.payload;
  }

  return writeJpsOverrideToFile(payload);
}

export async function clearJpsOverride(actorId?: string | null): Promise<void> {
  if (getJpsStorageMode() === "database") {
    await clearPersistentAppData({
      scope: AppDataScope.JPS,
      parse: parseJpsOverview,
      reason: "clear",
      actorId,
    });
    return;
  }

  await clearJpsOverrideFromFile();
}

export async function getEffectiveJpsOverview(): Promise<JpsOverview> {
  return (await readJpsOverride()) ?? getJpsOverview();
}

export async function listJpsBackups(): Promise<JpsBackupSummary[]> {
  if (getJpsStorageMode() === "database") {
    const revisions = await listPersistentAppDataRevisions(AppDataScope.JPS, parseJpsOverview);
    return revisions.map((revision) =>
      summaryFromPayload(revision.revisionKey, revision.createdAt, revision.reason, revision.payload)
    );
  }

  return listJpsBackupsFromFile();
}

export async function restoreJpsBackup(
  fileName: string,
  actorId?: string | null
): Promise<JpsOverview> {
  if (getJpsStorageMode() === "database") {
    const restored = await restorePersistentAppDataRevision({
      scope: AppDataScope.JPS,
      revisionKey: fileName,
      parse: parseJpsOverview,
      actorId,
      reason: "restore",
    });

    return restored.payload;
  }

  return restoreJpsBackupFromFile(fileName);
}
