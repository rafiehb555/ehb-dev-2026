"use client";

import { useEffect, useState } from "react";

type InspectionRow = {
  id: string;
  status: string;
  report: {
    id: string;
    score: string | number | null;
    findings: string | null;
    fraudSuspected?: boolean | null;
  } | null;
  updatedAt: string;
  franchise?: { id: string; name?: string | null; city?: string | null; level?: string | null } | null;
  escalations?: Array<{ id: string; level: string; reason: string; createdAt: string }>;
  crbApplication: {
    id: string;
    type: string;
    industry: string;
    status: string;
    createdAt: string;
    documents: Array<{ id: string; type: string; fileUrl: string }>;
  };
};

type ListResp = { success: true; data: { items: InspectionRow[]; total: number; take: number; skip: number } };

export default function FranchiseInspectionsPage() {
  const [items, setItems] = useState<InspectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [active, setActive] = useState<InspectionRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [report, setReport] = useState("");
  const [score, setScore] = useState<string>("");
  const [fraudSuspected, setFraudSuspected] = useState(false);
  const [fraudNotes, setFraudNotes] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([""]);
  const [geo, setGeo] = useState<{ lat: number; lng: number; accuracyM?: number; capturedAt?: string } | null>(null);
  const [escalationLevel, setEscalationLevel] = useState<"SUB" | "MASTER" | "CORPORATE">("MASTER");
  const [escalationReason, setEscalationReason] = useState("");

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/franchise/tasks?take=50&skip=0", { cache: "no-store" });
      const json = (await res.json()) as ListResp | { error?: { message?: string }; success?: false };
      if (!res.ok || ("success" in json && json.success === false)) {
        throw new Error((json as any)?.error?.message ?? "Failed to load inspection queue");
      }
      setItems((json as ListResp).data.items);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function open(i: InspectionRow) {
    setActive(i);
    setReport(i.report?.findings ?? "");
    setScore(i.report?.score === null || i.report?.score === undefined ? "" : String(i.report.score));
    setFraudSuspected(Boolean(i.report?.fraudSuspected));
    setFraudNotes("");
    setMediaUrls([""]);
    setGeo(null);
    setEscalationLevel("MASTER");
    setEscalationReason("");
  }

  async function captureGeo() {
    setErr(null);
    if (!navigator.geolocation) {
      setErr("Geolocation not supported in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyM: pos.coords.accuracy,
          capturedAt: new Date().toISOString(),
        });
      },
      (e) => setErr(e.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function submitReport() {
    if (!active) return;
    setSaving(true);
    setErr(null);
    try {
      const payload: any = {
        taskId: active.id,
        findings: report.trim() ? report.trim() : "(no findings provided)",
        score: Number(score || "0"),
        mediaUrls: mediaUrls.map((u) => u.trim()).filter(Boolean),
        fraudSuspected,
        fraudNotes: fraudNotes.trim() ? fraudNotes.trim() : undefined,
        geo: geo
          ? {
              lat: geo.lat,
              lng: geo.lng,
              accuracyM: geo.accuracyM,
              capturedAt: geo.capturedAt,
            }
          : undefined,
        deviceHash: typeof navigator !== "undefined" ? `${navigator.platform}-${navigator.userAgent}`.slice(0, 256) : undefined,
      };
      const res = await fetch(`/api/franchise/reports`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.success === false) throw new Error(json?.error?.message ?? "Save failed");
      setActive(null);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function escalateTask() {
    if (!active || escalationReason.trim().length < 5) {
      setErr("Escalation reason at least 5 characters honi chahiye.");
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const res = await fetch("/api/franchise/escalations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          taskId: active.id,
          level: escalationLevel,
          reason: escalationReason.trim(),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.success === false) throw new Error(json?.error?.message ?? "Escalation failed");
      setEscalationReason("");
      setActive(null);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Escalation failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen text-white">
      <div className="container-ehb py-8 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">Franchise Inspections</h1>
          <p className="text-ehb-textMuted text-sm">Assigned inspection tasks. Capture geo + media + score, then submit to DMO for decision.</p>
        </div>

        {err ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{err}</div> : null}

        <section className="glass-panel p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">My Queue</h2>
            <button
              className="text-xs rounded-full glass-panel px-3 py-1 hover:shadow-neon-blue transition-all"
              type="button"
              onClick={() => load()}
            >
              Refresh
            </button>
          </div>

          {loading ? <div className="text-sm text-ehb-textMuted">Loading...</div> : null}
          {!loading && items.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4 text-sm text-ehb-textBody">No inspections assigned.</div>
          ) : null}

          <div className="grid gap-2">
            {items.map((i) => (
              <button
                key={i.id}
                className="text-left rounded-2xl border border-white/10 bg-slate-950/30 p-4 hover:shadow-neon-blue transition-all"
                onClick={() => open(i)}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs rounded-full bg-white/10 px-2 py-1">{i.crbApplication?.type ?? "CRB"}</span>
                    <span className="text-xs rounded-full bg-white/10 px-2 py-1">{i.status}</span>
                    {i.report?.score !== null && i.report?.score !== undefined ? (
                      <span className="text-xs rounded-full bg-emerald-500/15 text-emerald-200 px-2 py-1">score {i.report.score}</span>
                    ) : null}
                  </div>
                  <div className="text-[11px] text-ehb-textMuted">#{i.crbApplication?.id?.slice(0, 8) ?? i.id.slice(0, 8)} • {new Date(i.updatedAt).toLocaleString()}</div>
                </div>
                <div className="mt-2 text-sm text-ehb-textBody">{i.crbApplication?.industry ?? "—"}</div>
                <div className="mt-1 text-[12px] text-ehb-textMuted">
                  Docs: {i.crbApplication?.documents?.length ?? 0} · Franchise: {i.franchise?.name ?? i.franchise?.city ?? "Unmapped"}
                </div>
              </button>
            ))}
          </div>
        </section>

        {active ? (
          <section className="glass-panel p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white">Inspection #{active.id.slice(0, 8)}</h3>
                <p className="text-[12px] text-ehb-textMuted">{active.crbApplication.industry} • {active.crbApplication.type}</p>
              </div>
              <button className="text-xs rounded-full glass-panel px-3 py-1" onClick={() => setActive(null)} type="button">
                Close
              </button>
            </div>

            <div className="grid gap-2">
              <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3">
                <div className="text-xs font-semibold text-ehb-textBody mb-2">Documents</div>
                <div className="grid gap-1">
                  {(active.crbApplication.documents ?? []).map((d) => (
                    <a
                      key={d.id}
                      href={d.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] text-sky-200 hover:underline"
                    >
                      {d.type}: {d.fileUrl}
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-ehb-textBody">Geo verification</div>
                  <button
                    type="button"
                    onClick={captureGeo}
                    className="text-xs rounded-full glass-panel px-3 py-1 hover:shadow-neon-blue transition-all"
                    disabled={saving}
                  >
                    Capture GPS
                  </button>
                </div>
                <div className="text-[12px] text-ehb-textMuted">
                  {geo ? `lat ${geo.lat.toFixed(6)}, lng ${geo.lng.toFixed(6)} (±${Math.round(geo.accuracyM ?? 0)}m)` : "Not captured yet"}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-ehb-textBody">Media (URLs)</div>
                  <button
                    type="button"
                    onClick={() => setMediaUrls((m) => [...m, ""])}
                    className="text-xs rounded-full glass-panel px-3 py-1 hover:shadow-neon-blue transition-all"
                    disabled={saving}
                  >
                    + Add
                  </button>
                </div>
                <div className="grid gap-2">
                  {mediaUrls.map((u, idx) => (
                    <input
                      key={idx}
                      className="rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                      value={u}
                      onChange={(e) => setMediaUrls((prev) => prev.map((x, i) => (i === idx ? e.target.value : x)))}
                      placeholder="https://photo-or-video-link"
                    />
                  ))}
                </div>
              </div>

              <label className="grid gap-1">
                <span className="text-xs text-ehb-textBody">Score (0–100)</span>
                <input
                  className="rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="e.g., 92"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs text-ehb-textBody">Report</span>
                <textarea
                  className="min-h-[140px] rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
                  placeholder="Inspection findings, photos evidence links, compliance notes..."
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-ehb-textBody">
                <input
                  type="checkbox"
                  checked={fraudSuspected}
                  onChange={(e) => setFraudSuspected(e.target.checked)}
                />
                Fraud suspected
              </label>
              {fraudSuspected ? (
                <label className="grid gap-1">
                  <span className="text-xs text-ehb-textBody">Fraud notes</span>
                  <textarea
                    className="min-h-[90px] rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                    value={fraudNotes}
                    onChange={(e) => setFraudNotes(e.target.value)}
                    placeholder="Explain the fraud signal, evidence links, etc."
                  />
                </label>
              ) : null}
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950/30 p-3 space-y-2">
              <div className="text-xs font-semibold text-ehb-textBody">Escalations</div>
              <div className="space-y-2">
                {(active.escalations ?? []).length === 0 ? (
                  <div className="text-[12px] text-ehb-textMuted">No escalations recorded yet.</div>
                ) : (
                  active.escalations?.map((item) => (
                    <div key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-2 text-[11px] text-ehb-textBody">
                      {item.level} · {item.reason} · {new Date(item.createdAt).toLocaleString()}
                    </div>
                  ))
                )}
              </div>
              <div className="grid gap-2 md:grid-cols-[180px_1fr]">
                <select
                  value={escalationLevel}
                  onChange={(e) => setEscalationLevel(e.target.value as "SUB" | "MASTER" | "CORPORATE")}
                  className="rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                >
                  <option value="SUB">SUB</option>
                  <option value="MASTER">MASTER</option>
                  <option value="CORPORATE">CORPORATE</option>
                </select>
                <input
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  className="rounded-xl bg-slate-950/40 border border-white/10 px-3 py-2 text-sm"
                  placeholder="Escalation reason..."
                />
              </div>
              <button
                disabled={saving}
                className="ehb-btn-danger ehb-press disabled:opacity-40"
                onClick={() => void escalateTask()}
              >
                Escalate Task
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                disabled={saving}
                className="rounded-full bg-gradient-to-r from-[#33C3FF] to-[#3b82f6] px-4 py-2 text-xs font-semibold text-slate-950 btn-glow disabled:opacity-40"
                onClick={() => submitReport()}
              >
                Submit report to DMO
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

