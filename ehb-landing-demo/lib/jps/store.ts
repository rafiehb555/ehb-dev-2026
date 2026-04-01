import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { getJpsOverview, type JpsOverview } from "@/lib/jpsData";
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

export async function readJpsOverride(): Promise<JpsOverview | null> {
  try {
    const raw = await readFile(JPS_OVERRIDE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return JpsImportPayloadSchema.parse(parsed);
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

export async function writeJpsOverride(payload: JpsImportPayload): Promise<JpsOverview> {
  const validated = JpsImportPayloadSchema.parse(payload);
  await mkdir(path.dirname(JPS_OVERRIDE_PATH), { recursive: true });
  await writeFile(JPS_OVERRIDE_PATH, JSON.stringify(validated, null, 2), "utf8");
  await writeBackupFile(validated, "save");
  return validated;
}

export async function clearJpsOverride(): Promise<void> {
  const current = await readJpsOverride();
  if (current) {
    await writeBackupFile(current, "clear");
  }
  await rm(JPS_OVERRIDE_PATH, { force: true });
}

export async function getEffectiveJpsOverview(): Promise<JpsOverview> {
  return (await readJpsOverride()) ?? getJpsOverview();
}

export async function listJpsBackups(): Promise<JpsBackupSummary[]> {
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
          const parsed = JpsImportPayloadSchema.parse(JSON.parse(raw));
          return {
            fileName,
            createdAt: createdAtFromFileName(fileName),
            reason: reasonFromFileName(fileName),
            profiles: parsed.profiles.length,
            skillCategories: parsed.skillCategories.length,
            designationLadders: Object.keys(parsed.designationLadders).length,
            systemNotes: parsed.systemNotes.length,
          } satisfies JpsBackupSummary;
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

export async function restoreJpsBackup(fileName: string): Promise<JpsOverview> {
  const safeFileName = path.basename(fileName);
  const raw = await readFile(path.join(JPS_BACKUP_DIR, safeFileName), "utf8");
  const parsed = JpsImportPayloadSchema.parse(JSON.parse(raw));
  await mkdir(path.dirname(JPS_OVERRIDE_PATH), { recursive: true });
  await writeFile(JPS_OVERRIDE_PATH, JSON.stringify(parsed, null, 2), "utf8");
  await writeBackupFile(parsed, "restore");
  return parsed;
}
