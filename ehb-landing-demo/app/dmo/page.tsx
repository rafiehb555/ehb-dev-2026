"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Toast, type ToastState } from "@/components/dmo/Toast";
import { ApplicationsTable } from "@/components/dmo/ApplicationsTable";
import { ApplicationDrawer } from "@/components/dmo/ApplicationDrawer";
import { DmoKpiCard } from "@/components/dmo/DmoKpiCard";
import { PriorityQueueTabs, type PriorityTab } from "@/components/dmo/PriorityQueueTabs";
import { AiInsightsPanel } from "@/components/dmo/AiInsightsPanel";
import { ActionPanel } from "@/components/dmo/ActionPanel";
import { sectionFadeUp, staggerList, itemFade } from "@/components/dmo/motion";
import type {
  ApplicationDetail,
  ApplicationRow,
  ApplicationStatus,
  ApplicationType,
  ApprovalDecision,
  AuditLog,
  SessionUser,
} from "@/components/dmo/types";
import { isAdminRole } from "@/components/dmo/ui";

type ApprovalHistoryItem = {
  id: string;
  applicationId: string;
  decision: ApprovalDecision;
  notes: string | null;
  createdAt: string;
  approvedBy: { id: string; name: string; email: string; role: string };
};

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "cyan" | "amber" | "emerald" | "rose" | "slate" | "violet";
}) {
  const styles =
    tone === "cyan"
      ? "border-[#00eaff]/40 text-[#00eaff]"
      : tone === "emerald"
        ? "border-emerald-400/40 text-emerald-300"
        : tone === "rose"
          ? "border-rose-400/40 text-rose-200"
          : tone === "amber"
            ? "border-amber-400/40 text-amber-200"
            : tone === "violet"
              ? "border-violet-400/40 text-violet-200"
              : "border-white/15 text-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full glass-panel border px-2.5 py-1 text-[10px] font-semibold ${styles}`}
    >
      {children}
    </span>
  );
}

export default function DmoPage() {
  const queueRef = useRef<HTMLDivElement | null>(null);
  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [me, setMe] = useState<SessionUser | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detail, setDetail] = useState<ApplicationDetail | null>(null);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistoryItem[]>([]);
  const [auditTimeline, setAuditTimeline] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ open: false, kind: "info", title: "" });

  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "ALL">("ALL");
  const [filterType, setFilterType] = useState<ApplicationType | "ALL">("ALL");
  const [filterRisk, setFilterRisk] = useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState({ take: 20, skip: 0 });
  const [priorityTab, setPriorityTab] = useState<PriorityTab>("ALL");
  const [assigning, setAssigning] = useState(false);
  const [assignees, setAssignees] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<ApplicationType>("PSS");

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function riskLevelFor(app: ApplicationRow): "LOW" | "MEDIUM" | "HIGH" {
    const ageHrs = (Date.now() - new Date(app.updatedAt).getTime()) / (1000 * 60 * 60);
    if (app.status === "UNDER_INSPECTION" && ageHrs > 12) return "HIGH";
    if (app.type === "CRB_CERTIFICATION" || app.type === "INDUSTRY_VERIFICATION") return "HIGH";
    if (ageHrs > 6 || app.status === "IN_REVIEW") return "MEDIUM";
    return "LOW";
  }

  function isSlaBreach(app: ApplicationRow) {
    const ageHrs = (Date.now() - new Date(app.updatedAt).getTime()) / (1000 * 60 * 60);
    return app.status !== "APPROVED" && app.status !== "REJECTED" && ageHrs > 8;
  }

  function slaFor(app: ApplicationRow) {
    if (app.status === "APPROVED" || app.status === "REJECTED") return { label: "Closed", tone: "emerald" as const };
    const ageMs = Date.now() - new Date(app.updatedAt).getTime();
    const leftMs = 8 * 60 * 60 * 1000 - ageMs;
    if (leftMs <= 0) return { label: "Overdue", tone: "rose" as const };
    const leftHours = leftMs / (1000 * 60 * 60);
    if (leftHours <= 2) return { label: `${Math.ceil(leftHours)}h left`, tone: "amber" as const };
    return { label: `${Math.ceil(leftHours)}h left`, tone: "emerald" as const };
  }

  const stats = useMemo(() => {
    const total = apps.length;
    const pending = apps.filter((a) => a.status === "NEW" || a.status === "IN_REVIEW" || a.status === "UNDER_INSPECTION").length;
    const approvedToday = apps.filter((a) => a.status === "APPROVED" && a.updatedAt.slice(0, 10) === todayIso).length;
    const highRisk = apps.filter((a) => riskLevelFor(a) === "HIGH").length;
    const slaBreach = apps.filter(isSlaBreach).length;
    return { total, pending, approvedToday, highRisk, slaBreach };
  }, [apps, todayIso]);

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = apps.filter((a) => {
      const statusOk = filterStatus === "ALL" ? true : a.status === filterStatus;
      const typeOk = filterType === "ALL" ? true : a.type === filterType;
      const qOk =
        q.length === 0
          ? true
          : a.id.toLowerCase().includes(q) ||
            a.applicant.name.toLowerCase().includes(q) ||
            a.applicant.email.toLowerCase().includes(q) ||
            (a.assignedTo?.name.toLowerCase().includes(q) ?? false) ||
            (a.assignedTo?.email.toLowerCase().includes(q) ?? false);
      const risk = riskLevelFor(a);
      const riskOk = filterRisk === "ALL" ? true : risk === filterRisk;
      return statusOk && typeOk && qOk && riskOk;
    });
    if (priorityTab === "HIGH_RISK") return base.filter((a) => riskLevelFor(a) === "HIGH");
    if (priorityTab === "SLA_BREACH") return base.filter((a) => isSlaBreach(a));
    if (priorityTab === "NEW") return base.filter((a) => a.status === "NEW");
    return base;
  }, [apps, filterStatus, filterType, filterRisk, query, priorityTab]);

  const insightData = useMemo(() => {
    const riskApps = apps.filter((a) => riskLevelFor(a) === "HIGH").slice(0, 3);
    const slaApps = apps.filter((a) => isSlaBreach(a)).slice(0, 3);
    return {
      riskAlerts: riskApps.map((a) => `${a.type} · ${a.applicant.name} requires urgent review`),
      slaWarnings: slaApps.map((a) => `${a.id.slice(0, 8)} is nearing/over SLA`),
      suggestions: [
        `${stats.pending} applications are pending action`,
        `${stats.highRisk} high-risk items should be prioritized`,
        `${stats.approvedToday} approvals recorded today`,
      ],
    };
  }, [apps, stats.pending, stats.highRisk, stats.approvedToday]);

  const priorityCounts = useMemo(
    () => ({
      ALL: apps.length,
      HIGH_RISK: apps.filter((a) => riskLevelFor(a) === "HIGH").length,
      SLA_BREACH: apps.filter((a) => isSlaBreach(a)).length,
      NEW: apps.filter((a) => a.status === "NEW").length,
    }),
    [apps]
  );

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      qs.set("take", String(page.take));
      qs.set("skip", String(page.skip));
      if (filterStatus !== "ALL") qs.set("status", filterStatus);
      if (filterType !== "ALL") qs.set("type", filterType);

      const [meRes, appsRes] = await Promise.all([
        fetch("/api/auth/me", { cache: "no-store" }),
        fetch(`/api/dmo/applications?${qs.toString()}`, { cache: "no-store" }),
      ]);

      // Auth is soft — failure just means demo/unauthenticated mode
      const meJson = meRes.ok ? await meRes.json().catch(() => null) : null;
      if (meJson?.success && meJson.data?.user) setMe(meJson.data.user);

      const appsJson = await appsRes.json().catch(() => null);
      if (appsRes.status === 503 || appsJson?.error?.code === "DB_UNAVAILABLE") {
        // DB not yet set up — show demo mode with empty state
        setApps([]);
        setError("Database not connected. Configure DATABASE_URL and run prisma migrate dev to load real data.");
        return;
      }
      if (!appsRes.ok) throw new Error(`Applications load failed: ${appsRes.status}`);
      if (!appsJson?.success) throw new Error(appsJson?.error?.message ?? "Load failed");
      setApps(appsJson.data.applications ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load DMO data");
      setApps([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadAssignees() {
    try {
      const res = await fetch("/api/dmo/users", { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as
        | { success: true; data: { users: Array<{ id: string; name: string; email: string; role: string }> } }
        | { success: false };
      if (json.success) setAssignees(json.data.users ?? []);
    } catch {
      // keep silent; assignment can still work via manual ID
    }
  }

  async function loadDetail(id: string) {
    setSelectedId(id);
    setDetail(null);
    setApprovalHistory([]);
    setAuditTimeline([]);
    setDetailLoading(true);
    try {
      const [res, approvalsRes, auditRes] = await Promise.all([
        fetch(`/api/dmo/applications/${id}`, { cache: "no-store" }),
        fetch(`/api/dmo/approvals?applicationId=${id}`, { cache: "no-store" }),
        fetch(`/api/dmo/audit?applicationId=${id}&take=100`, { cache: "no-store" }),
      ]);
      if (!res.ok) throw new Error(`Application detail failed: ${res.status}`);
      if (!approvalsRes.ok) throw new Error(`Approvals load failed: ${approvalsRes.status}`);
      if (!auditRes.ok) throw new Error(`Audit timeline load failed: ${auditRes.status}`);

      const json = (await res.json()) as
        | { success: true; data: { application: ApplicationDetail } }
        | { success: false; error: { message: string } };
      const approvalsJson = (await approvalsRes.json()) as
        | { success: true; data: { approvals: ApprovalHistoryItem[] } }
        | { success: false; error: { message: string } };
      const auditJson = (await auditRes.json()) as
        | { success: true; data: { logs: AuditLog[] } }
        | { success: false; error: { message: string } };
      if (!json.success) throw new Error(json.error.message);
      if (!approvalsJson.success) throw new Error(approvalsJson.error.message);
      if (!auditJson.success) throw new Error(auditJson.error.message);
      setDetail(json.data.application);
      setApprovalHistory(approvalsJson.data.approvals);
      setAuditTimeline(auditJson.data.logs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load application detail");
    } finally {
      setDetailLoading(false);
    }
  }

  async function decide(decision: ApprovalDecision, notes: string) {
    if (!selectedId) return;
    setError(null);
    try {
      const res = await fetch("/api/dmo/approvals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ applicationId: selectedId, decision, notes: notes.trim() ? notes.trim() : undefined }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as any;
        throw new Error(j?.error?.message ? `${j.error.message}` : `Decision failed: ${res.status}`);
      }
      setToast({
        open: true,
        kind: "success",
        title: decision === "APPROVED" ? "Approved" : "Rejected",
        message: "Decision recorded and audit log updated.",
      });
      await Promise.all([load(), loadDetail(selectedId)]);
      setSelectedIds((prev) => prev.filter((id) => id !== selectedId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit decision");
      setToast({
        open: true,
        kind: "error",
        title: "Action failed",
        message: e instanceof Error ? e.message : "Request failed",
      });
    } finally {
    }
  }

  async function createApplication() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/dmo/applications", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: createType,
          payload: { source: "dmo_dashboard", createdAt: new Date().toISOString() },
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as any;
        throw new Error(j?.error?.message ? `${j.error.message}` : `Create failed: ${res.status}`);
      }
      setToast({
        open: true,
        kind: "success",
        title: "Application created",
        message: `New ${createType} application added to queue.`,
      });
      setCreateOpen(false);
      await load();
      queueRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create application");
      setToast({
        open: true,
        kind: "error",
        title: "Create failed",
        message: e instanceof Error ? e.message : "Request failed",
      });
    } finally {
      setCreating(false);
    }
  }

  function resetFilters() {
    setFilterStatus("ALL");
    setFilterType("ALL");
    setFilterRisk("ALL");
    setQuery("");
    setPriorityTab("ALL");
    setPage((p) => ({ ...p, skip: 0 }));
  }

  async function assignApplication(assigneeId: string) {
    if (!selectedId) return;
    setAssigning(true);
    setError(null);
    try {
      const res = await fetch(`/api/dmo/applications/${selectedId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assignedToId: assigneeId, status: "IN_REVIEW" }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as any;
        throw new Error(j?.error?.message ? `${j.error.message}` : `Assignment failed: ${res.status}`);
      }
      setToast({
        open: true,
        kind: "success",
        title: "Assignment saved",
        message: "Application assigned and moved to IN_REVIEW.",
      });
      await Promise.all([load(), loadDetail(selectedId)]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to assign application";
      setError(msg);
      setToast({ open: true, kind: "error", title: "Assignment failed", message: msg });
    } finally {
      setAssigning(false);
    }
  }

  async function bulkDecision(decision: ApprovalDecision) {
    if (selectedIds.length === 0) return;
    setError(null);
    try {
      const res = await fetch("/api/dmo/approvals/bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ applicationIds: selectedIds, decision, notes: "Bulk decision from DMO table" }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as any;
        throw new Error(j?.error?.message ? `${j.error.message}` : `Bulk action failed: ${res.status}`);
      }
      setToast({
        open: true,
        kind: "success",
        title: decision === "APPROVED" ? "Bulk approved" : "Bulk rejected",
        message: `${selectedIds.length} applications updated.`,
      });
      setSelectedIds([]);
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bulk action failed";
      setError(msg);
      setToast({ open: true, kind: "error", title: "Bulk action failed", message: msg });
    }
  }

  useEffect(() => {
    void load();
  }, [filterStatus, filterType, filterRisk, page.take, page.skip]);

  useEffect(() => {
    void loadAssignees();
  }, []);

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-6 sm:py-8 text-[10px] xs:text-[11px]">
        <Toast toast={toast} onClose={() => setToast((t) => ({ ...t, open: false }))} />
        <div className="space-y-4">
          {/* MAIN + RIGHT */}
          <section className="space-y-4">
            {/* TOP BAR */}
            <motion.section
              variants={sectionFadeUp}
              initial="hidden"
              animate="visible"
                className="glass-panel ehb-hover-lift p-4 border border-white/10"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="cyan">DMO · Brain of System</Badge>
                    <Badge tone={loading ? "amber" : "emerald"}>{loading ? "System Syncing" : "System Healthy"}</Badge>
                    {me ? <Badge tone="slate">Role: {me.role}</Badge> : null}
                  </div>
                  <h1 className="text-lg sm:text-xl font-semibold leading-tight gradient-text">DMO Dashboard</h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="w-full sm:w-auto rounded-full glass-panel border border-white/15 px-3 py-1.5 text-xs ehb-text-muted min-w-0 sm:min-w-[220px]">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search systems, departments, actions..."
                      className="w-full bg-transparent outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <Link href="/home" className="ehb-btn-secondary ehb-press">
                    EHB Home
                  </Link>
                  <Link href="/" className="ehb-btn-secondary ehb-press">
                    EHB Landing
                  </Link>
                  <Link href="/admin" className="ehb-btn-secondary ehb-press">
                    Super Admin Panel
                  </Link>
                  <div className="rounded-full glass-panel border border-white/15 px-3 py-1.5 text-xs text-slate-200">🔔 3</div>
                  <div className="rounded-full glass-panel border border-white/15 px-3 py-1.5 text-xs text-slate-200">
                    {me?.name ?? "DMO Admin"}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="ehb-btn-primary ehb-press"
                  >
                    + New Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriorityTab("HIGH_RISK")}
                    className="ehb-btn-danger ehb-press"
                  >
                    High Risk
                  </button>
                  <button
                    type="button"
                    onClick={() => void load()}
                    className="ehb-btn-secondary ehb-press"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {error ? (
                <div className="mt-3 rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-rose-100">
                  <div className="font-semibold mb-1">Failed to load applications</div>
                  <div className="text-xs text-rose-100/90">{error}</div>
                  <button
                    type="button"
                    onClick={() => void load()}
                    className="mt-2 rounded-full bg-rose-400 text-slate-950 px-3 py-1.5 text-xs font-semibold"
                  >
                    Retry
                  </button>
                </div>
              ) : null}
            </motion.section>

            {/* KPI STRIP */}
            <motion.section
              className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
              variants={staggerList}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemFade}><DmoKpiCard label="Total Applications" value={loading ? "…" : stats.total} detail="All application types" tone="cyan" trend="up" trendText="+12%" /></motion.div>
              <motion.div variants={itemFade}><DmoKpiCard label="Pending" value={loading ? "…" : stats.pending} detail="Needs decision" tone="amber" trend="flat" trendText="stable" /></motion.div>
              <motion.div variants={itemFade}><DmoKpiCard label="High Risk" value={loading ? "…" : stats.highRisk} detail="Urgent priority" tone="rose" trend="up" trendText="+2" /></motion.div>
              <motion.div variants={itemFade}><DmoKpiCard label="SLA Breach" value={loading ? "…" : stats.slaBreach} detail="Over threshold" tone="violet" trend="down" trendText="-1" /></motion.div>
              <motion.div variants={itemFade}><DmoKpiCard label="Approved Today" value={loading ? "…" : stats.approvedToday} detail="Completed today" tone="emerald" trend="up" trendText="+8" /></motion.div>
            </motion.section>

            {/* WORKSPACE + ACTION ZONE */}
            <section className="grid gap-3 grid-cols-1 xl:grid-cols-12 items-start">
              <div ref={queueRef} className="xl:col-span-8">
                <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-white">Priority Queue</div>
                      <div className="text-[11px] text-slate-400">Decision speed target: under 10 seconds per item.</div>
                    </div>
                    <PriorityQueueTabs value={priorityTab} counts={priorityCounts} onChange={setPriorityTab} />
                  </div>
                </div>
                <ApplicationsTable
                  loading={loading}
                  error={error}
                  rows={filteredApps}
                  selectedIds={selectedIds}
                  canApprove={isAdminRole(me?.role)}
                  selectedId={selectedId}
                  filterStatus={filterStatus}
                  filterType={filterType}
                  filterRisk={filterRisk}
                  search={query}
                  onChangeFilterStatus={(v) => {
                    setPage((p) => ({ ...p, skip: 0 }));
                    setFilterStatus(v);
                  }}
                  onChangeFilterType={(v) => {
                    setPage((p) => ({ ...p, skip: 0 }));
                    setFilterType(v);
                  }}
                  onChangeFilterRisk={setFilterRisk}
                  onChangeSearch={setQuery}
                  page={page}
                  totalShown={filteredApps.length}
                  onNextPage={() => setPage((p) => ({ ...p, skip: p.skip + p.take }))}
                  onPrevPage={() => setPage((p) => ({ ...p, skip: Math.max(0, p.skip - p.take) }))}
                  onSelect={(id) => void loadDetail(id)}
                  onToggleSelect={(id) =>
                    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
                  }
                  onToggleSelectAllOnPage={() =>
                    setSelectedIds((prev) => {
                      const pageIds = filteredApps.map((a) => a.id);
                      const allSelected = pageIds.every((id) => prev.includes(id));
                      if (allSelected) return prev.filter((id) => !pageIds.includes(id));
                      return [...new Set([...prev, ...pageIds])];
                    })
                  }
                  onBulkDecision={(decision) => void bulkDecision(decision)}
                  getRiskLevel={riskLevelFor}
                  getSla={slaFor}
                  onRefresh={() => void load()}
                  onResetFilters={resetFilters}
                />
              </div>
              <div className="xl:col-span-4 space-y-3">
                <AiInsightsPanel
                  riskAlerts={insightData.riskAlerts}
                  slaWarnings={insightData.slaWarnings}
                  suggestions={insightData.suggestions}
                />
                <ActionPanel
                  selected={detail}
                  loading={detailLoading || assigning}
                  meId={me?.id ?? null}
                  canApprove={isAdminRole(me?.role)}
                  assignees={assignees}
                  riskLevel={detail ? riskLevelFor(detail) : undefined}
                  stlImpact={detail ? { approve: riskLevelFor(detail) === "HIGH" ? 2 : 5, reject: -10 } : undefined}
                  onQuickDecision={(d) => void decide(d, "Quick action from DMO workspace")}
                  onAssign={(assigneeId) => void assignApplication(assigneeId)}
                />
              </div>
            </section>
          </section>
        </div>

        <ApplicationDrawer
          open={selectedId !== null}
          me={me}
          application={detail}
          approvals={approvalHistory}
          auditLogs={auditTimeline}
          loading={detailLoading}
          onClose={() => {
            setSelectedId(null);
            setDetail(null);
          }}
          onDecide={decide}
        />
        {createOpen ? (
          <div className="fixed inset-0 z-[80] bg-black/65 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#020c1b] p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-sm font-semibold text-white">Create DMO Application</h2>
                <button type="button" className="ehb-btn-secondary ehb-press" onClick={() => setCreateOpen(false)}>
                  Close
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Application Type</label>
                  <select
                    value={createType}
                    onChange={(e) => setCreateType(e.target.value as ApplicationType)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-100 outline-none"
                  >
                    <option value="PSS">PSS</option>
                    <option value="PSS_REFILL">PSS_REFILL</option>
                    <option value="CRB_CERTIFICATION">CRB_CERTIFICATION</option>
                    <option value="INDUSTRY_VERIFICATION">INDUSTRY_VERIFICATION</option>
                    <option value="CRB">CRB</option>
                    <option value="SERVICE">SERVICE</option>
                    <option value="PRODUCT">PRODUCT</option>
                    <option value="FRANCHISE">FRANCHISE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => void createApplication()}
                  disabled={creating}
                  className="ehb-btn-primary ehb-press disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Application"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
