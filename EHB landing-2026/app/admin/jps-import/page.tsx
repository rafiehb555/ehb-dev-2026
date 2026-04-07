"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { KpiCard } from "@/components/ui/KpiCard";
import { getJpsOverview } from "@/lib/jps/data";

type ImportStateResponse = {
  hasImportedData: boolean;
  payload: unknown | null;
  storageMode?: "database" | "filesystem";
};

type BackupSummary = {
  fileName: string;
  createdAt: string;
  reason: string;
  profiles: number;
  skillCategories: number;
  designationLadders: number;
  systemNotes: number;
};

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function AdminJpsImportPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [jsonText, setJsonText] = useState(prettyJson(getJpsOverview()));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [restoringFile, setRestoringFile] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasImportedData, setHasImportedData] = useState(false);
  const [storageMode, setStorageMode] = useState<"database" | "filesystem">("filesystem");
  const [backups, setBackups] = useState<BackupSummary[]>([]);

  async function loadBackups() {
    try {
      const res = await fetch("/api/jps/backups", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? "Failed to load JPS backups");
      setBackups(((json?.data ?? json)?.backups ?? []) as BackupSummary[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load JPS backups");
    }
  }

  async function loadImportState() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/jps/import", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? "Failed to load JPS import state");

      const data = (json?.data ?? json) as ImportStateResponse;
      setHasImportedData(Boolean(data?.hasImportedData));
      setStorageMode(data?.storageMode === "database" ? "database" : "filesystem");
      setJsonText(prettyJson(data?.payload ?? getJpsOverview()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load JPS import state");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadImportState();
    void loadBackups();
  }, []);

  const parsedPreview = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonText) as {
        profiles?: unknown[];
        skillCategories?: unknown[];
        designationLadders?: Record<string, unknown>;
        systemNotes?: unknown[];
      };
      return {
        valid: true,
        profiles: parsed.profiles?.length ?? 0,
        skillCategories: parsed.skillCategories?.length ?? 0,
        designationLadders: Object.keys(parsed.designationLadders ?? {}).length,
        systemNotes: parsed.systemNotes?.length ?? 0,
      };
    } catch {
      return {
        valid: false,
        profiles: 0,
        skillCategories: 0,
        designationLadders: 0,
        systemNotes: 0,
      };
    }
  }, [jsonText]);

  async function saveImport() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/jps/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonText,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? "Failed to save JPS import data");
      setHasImportedData(true);
      setMessage(json?.data?.message ?? "JPS import data saved.");
      await loadBackups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save JPS import data");
    } finally {
      setSaving(false);
    }
  }

  async function clearImport() {
    setClearing(true);
    setConfirmClear(false);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/jps/import", { method: "DELETE" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? "Failed to clear JPS import data");
      setHasImportedData(false);
      setJsonText(prettyJson(getJpsOverview()));
      setMessage(json?.data?.message ?? "Imported JPS data cleared.");
      await loadBackups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear JPS import data");
    } finally {
      setClearing(false);
    }
  }

  async function restoreBackup(fileName: string) {
    setRestoringFile(fileName);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/jps/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error?.message ?? "Failed to restore JPS backup");
      setMessage(json?.data?.message ?? `Backup restored: ${fileName}`);
      await loadImportState();
      await loadBackups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore JPS backup");
    } finally {
      setRestoringFile(null);
    }
  }

  async function importFromFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setMessage(null);
    try {
      const text = await file.text();
      JSON.parse(text);
      setJsonText(text);
      setMessage(`Loaded file: ${file.name}`);
    } catch {
      setError("Selected file does not contain valid JSON.");
    } finally {
      event.target.value = "";
    }
  }

  function downloadCurrentJson() {
    try {
      const formatted = prettyJson(JSON.parse(jsonText));
      const blob = new Blob([formatted], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "ehb-jps-import.json";
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage("Current JPS JSON downloaded.");
      setError(null);
    } catch {
      setError("Download requires valid JSON in the editor.");
    }
  }

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-6 space-y-5">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ehb-textMuted">Super Admin Â· JPS Import</p>
            <h1 className="text-xl font-semibold gradient-text">JPS Data Import Manager</h1>
            <p className="max-w-3xl text-sm text-ehb-textBody">
              Validate and save real `JPS` profiles, skills, designation ladders, and notes from this screen.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin" className="ehb-btn-secondary ehb-press">
              Back to Admin
            </Link>
            <Link href="/dmo/jps" className="ehb-btn-secondary ehb-press">
              Open DMO JPS
            </Link>
            <Link href="/api/jps" className="ehb-btn-primary ehb-press">
              View Live JPS API
            </Link>
            <Link href="/api/jps/export" className="ehb-btn-secondary ehb-press">
              Download Live Export
            </Link>
          </div>
        </header>

        <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            label="Imported Source"
            value={hasImportedData ? "Active" : "Fallback"}
            detail={storageMode === "database" ? "Shared override state" : "Local override state"}
          />
          <KpiCard
            label="Storage Mode"
            value={storageMode === "database" ? "Database" : "Local File"}
            detail={storageMode === "database" ? "Durable shared storage" : "Non-durable fallback"}
          />
          <KpiCard label="Profiles" value={String(parsedPreview.profiles)} detail="Preview count" />
          <KpiCard label="Skill Groups" value={String(parsedPreview.skillCategories)} detail="Preview count" />
          <KpiCard
            label="Designation Ladders"
            value={String(parsedPreview.designationLadders)}
            detail={parsedPreview.valid ? "JSON valid" : "JSON invalid"}
          />
        </section>

        {storageMode === "filesystem" ? (
          <section className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
            Durable parity requires `DATABASE_URL` so local and deployed JPS data share the same Mongo-backed store.
          </section>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <div className="glass-panel border border-white/10 p-4 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Import Payload</h2>
                <p className="text-xs text-ehb-textMuted">
                  Paste the same JSON payload here that you want to send to `POST /api/jps/import`.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(event) => void importFromFile(event)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="ehb-btn-secondary ehb-press"
                >
                  Upload JSON File
                </button>
                <button type="button" onClick={downloadCurrentJson} className="ehb-btn-secondary ehb-press">
                  Download JSON
                </button>
                <button
                  type="button"
                  onClick={() => window.open("/api/jps/export", "_blank", "noopener,noreferrer")}
                  className="ehb-btn-secondary ehb-press"
                >
                  Download API Export
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setJsonText(prettyJson(getJpsOverview()));
                    setMessage("Docs/demo template loaded into editor.");
                    setError(null);
                  }}
                  className="ehb-btn-secondary ehb-press"
                >
                  Load Template
                </button>
                <button type="button" onClick={() => void loadImportState()} className="ehb-btn-secondary ehb-press">
                  {loading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            <textarea
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
              spellCheck={false}
              className="min-h-[560px] w-full rounded-2xl border border-white/10 bg-[#050b14] p-4 font-mono text-xs text-white outline-none focus:border-cyan-400/50"
            />

            {message ? (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
                {message}
              </div>
            ) : null}
            {error ? (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void saveImport()}
                disabled={saving || !parsedPreview.valid}
                className="ehb-btn-primary ehb-press disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Import Data"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                disabled={clearing}
                className="ehb-btn-secondary ehb-press disabled:cursor-not-allowed disabled:opacity-60"
              >
                {clearing ? "Clearing..." : "Clear Imported Data"}
              </button>
            </div>

            {confirmClear ? (
              <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs text-amber-100">
                <div className="font-semibold text-amber-200">Confirm clear imported JPS data?</div>
                <p className="mt-1 text-amber-100/80">
                  After this action, the fallback docs/demo data will become active again.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void clearImport()}
                    className="ehb-btn-primary ehb-press"
                    disabled={clearing}
                  >
                    Yes, Clear Imported Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="ehb-btn-secondary ehb-press"
                    disabled={clearing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <section className="glass-panel border border-white/10 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-white">Validation Preview</h2>
              <div className="space-y-2 text-xs text-ehb-textBody">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  JSON status:{" "}
                  <span className={parsedPreview.valid ? "text-emerald-300" : "text-rose-300"}>
                    {parsedPreview.valid ? "Valid JSON" : "Invalid JSON"}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Profiles: {parsedPreview.profiles}</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  Skill categories: {parsedPreview.skillCategories}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  Designation ladders: {parsedPreview.designationLadders}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">System notes: {parsedPreview.systemNotes}</div>
              </div>
            </section>

            <section className="glass-panel border border-white/10 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-white">Import Rules</h2>
              <ul className="space-y-2 text-xs text-ehb-textBody">
                <li>Each profile must include `id`, `name`, `designation`, `industry`, `city`, and `status`.</li>
                <li>`skills`, `services`, and `jobs` arrays must each contain at least one item.</li>
                <li>`designationLadders` should be grouped by industry name.</li>
                <li>Each `profile.id` must be unique across the full import payload.</li>
                <li>Saving imported data immediately updates `/api/jps`, DMO JPS, jobs, and profile pages.</li>
                <li>You can upload a `.json` file or download the current editor content for backup.</li>
              </ul>
            </section>

            <section className="glass-panel border border-white/10 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-white">Suggested Flow</h2>
              <ol className="space-y-2 text-xs text-ehb-textBody">
                <li>1. Load template and replace demo values with your real JPS data.</li>
                <li>2. Save import data from this screen.</li>
                <li>3. Open DMO JPS and public JPS pages to verify rendering.</li>
                <li>4. Clear imported data anytime to restore docs/demo fallback.</li>
              </ol>
            </section>

            <section className="glass-panel border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-white">Backup History</h2>
                <button type="button" onClick={() => void loadBackups()} className="ehb-btn-secondary ehb-press">
                  Refresh Backups
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {backups.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-ehb-textMuted">
                    No JPS backups found yet.
                  </div>
                ) : (
                  backups.map((backup) => (
                    <div key={backup.fileName} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-1">
                          <div className="font-medium text-white">{backup.fileName}</div>
                          <div className="text-ehb-textMuted">
                            {backup.createdAt} Â· reason: {backup.reason}
                          </div>
                          <div className="text-ehb-textMuted">
                            profiles: {backup.profiles} Â· skills: {backup.skillCategories} Â· ladders: {backup.designationLadders}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => void restoreBackup(backup.fileName)}
                          disabled={restoringFile === backup.fileName}
                          className="ehb-btn-primary ehb-press disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {restoringFile === backup.fileName ? "Restoring..." : "Restore Backup"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
