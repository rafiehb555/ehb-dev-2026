"use client";

/**
 * DMO — CRB (Central Record Blockchain)
 *   - VerificationUI primitives (no framer-motion, no emojis, no legacy classes)
 *   - In-file demo data (prototype only, no fetch)
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  SeverityMeter,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type CrbType = "SKILL" | "SERVICE" | "PRODUCT" | "COMPANY";
type CrbStatus = "SUBMITTED" | "REVIEW" | "INSPECTION" | "APPROVED" | "REJECTED";

type CrbRow = {
  id: string;
  type: CrbType;
  industry: string;
  status: CrbStatus;
  notes: string | null;
  dmoTaskId: string | null;
  createdAt: string;
  applicant: { name: string; email: string; role: string };
  documents: Array<{ id: string; type: string; fileUrl: string }>;
  inspection: { id: string; status: string; score: number | null; report: string | null; inspectorId: string } | null;
  certificate: { id: string; status: string; issuedAt: string; expiryDate: string } | null;
};

/* ── Demo data ── */
const DEMO: CrbRow[] = [
  {
    id: "CRB-001", type: "SERVICE", industry: "E-commerce", status: "INSPECTION",
    notes: "GoSellr PK marketplace service — on-site inspection scheduled Karachi.",
    dmoTaskId: "T-8801", createdAt: "2026-04-10T09:00:00Z",
    applicant: { name: "Ali Hussain", email: "ali@gosellr.pk", role: "Seller" },
    documents: [{ id: "D-01", type: "Trade License", fileUrl: "#" }, { id: "D-02", type: "NTN Certificate", fileUrl: "#" }],
    inspection: { id: "INS-101", status: "SCHEDULED", score: null, report: null, inspectorId: "INS-KHI-04" },
    certificate: null,
  },
  {
    id: "CRB-002", type: "COMPANY", industry: "Medical", status: "APPROVED",
    notes: "WMS Islamabad — full compliance verified.",
    dmoTaskId: "T-8734", createdAt: "2026-04-08T14:30:00Z",
    applicant: { name: "Dr. Sara Malik", email: "sara@wms.pk", role: "Provider" },
    documents: [{ id: "D-03", type: "PMDC Registration", fileUrl: "#" }, { id: "D-04", type: "Clinic License", fileUrl: "#" }],
    inspection: { id: "INS-102", status: "COMPLETED", score: 94, report: "All standards met. Minor signage update needed.", inspectorId: "INS-ISB-02" },
    certificate: { id: "CERT-201", status: "ACTIVE", issuedAt: "2026-04-09T00:00:00Z", expiryDate: "2027-04-09T00:00:00Z" },
  },
  {
    id: "CRB-003", type: "SKILL", industry: "Legal", status: "REVIEW",
    notes: "OLS Lahore — skill certification for corporate law advisory.",
    dmoTaskId: null, createdAt: "2026-04-11T11:00:00Z",
    applicant: { name: "Barrister Usman Qazi", email: "usman@ols.pk", role: "Lawyer" },
    documents: [{ id: "D-05", type: "Bar Council License", fileUrl: "#" }],
    inspection: null, certificate: null,
  },
  {
    id: "CRB-004", type: "SERVICE", industry: "Education", status: "SUBMITTED",
    notes: "HPS Faisalabad — tutor certification application.",
    dmoTaskId: null, createdAt: "2026-04-12T08:00:00Z",
    applicant: { name: "Fatima Noor", email: "fatima@hps.pk", role: "Tutor" },
    documents: [{ id: "D-06", type: "Degree Certificate", fileUrl: "#" }],
    inspection: null, certificate: null,
  },
  {
    id: "CRB-005", type: "PRODUCT", industry: "E-commerce", status: "REJECTED",
    notes: "GoSellr counterfeit concern — product authenticity failed.",
    dmoTaskId: "T-8790", createdAt: "2026-04-07T16:00:00Z",
    applicant: { name: "Zain Electronics", email: "zain@gosellr.pk", role: "Seller" },
    documents: [{ id: "D-07", type: "Product Invoice", fileUrl: "#" }, { id: "D-08", type: "Import Certificate", fileUrl: "#" }],
    inspection: { id: "INS-103", status: "COMPLETED", score: 28, report: "Product labeling mismatch. Invoice origin disputed.", inspectorId: "INS-LHR-01" },
    certificate: null,
  },
  {
    id: "CRB-006", type: "COMPANY", industry: "Travel", status: "INSPECTION",
    notes: "AGTS Dubai — franchise-level company certification.",
    dmoTaskId: "T-8812", createdAt: "2026-04-09T13:00:00Z",
    applicant: { name: "AGTS Dubai LLC", email: "ops@agts.ae", role: "Franchise" },
    documents: [{ id: "D-09", type: "Trade License UAE", fileUrl: "#" }, { id: "D-10", type: "Tax Registration", fileUrl: "#" }],
    inspection: { id: "INS-104", status: "IN_PROGRESS", score: null, report: null, inspectorId: "INS-DXB-01" },
    certificate: null,
  },
];

const STATUS_TONE: Record<CrbStatus, VerificationTone> = {
  SUBMITTED: "purple",
  REVIEW: "cyan",
  INSPECTION: "amber",
  APPROVED: "green",
  REJECTED: "red",
};

const TYPE_TONE: Record<CrbType, VerificationTone> = {
  SKILL: "teal",
  SERVICE: "cyan",
  PRODUCT: "amber",
  COMPANY: "purple",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function DmoCrbPage() {
  const [rows] = useState<CrbRow[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | CrbStatus>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | CrbType>("ALL");
  const [selected, setSelected] = useState<CrbRow | null>(null);
  const [toast, setToast] = useState<{ open: boolean; kind: "ok" | "err"; text: string }>({ open: false, kind: "ok", text: "" });

  /* Form state for prototype actions */
  const [assignInspectorId, setAssignInspectorId] = useState("");
  const [reportScore, setReportScore] = useState("");
  const [reportText, setReportText] = useState("");
  const [decisionNotes, setDecisionNotes] = useState("");

  const stats = useMemo(() => ({
    total: rows.length,
    submitted: rows.filter((r) => r.status === "SUBMITTED").length,
    review: rows.filter((r) => r.status === "REVIEW").length,
    inspection: rows.filter((r) => r.status === "INSPECTION").length,
    approved: rows.filter((r) => r.status === "APPROVED").length,
    rejected: rows.filter((r) => r.status === "REJECTED").length,
  }), [rows]);

  const visible = rows.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (typeFilter !== "ALL" && r.type !== typeFilter) return false;
    return true;
  });

  function showToast(kind: "ok" | "err", text: string) {
    setToast({ open: true, kind, text });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 3500);
  }

  function handleAssign() {
    if (!selected || !assignInspectorId.trim()) return;
    showToast("ok", `Inspection assigned to ${assignInspectorId.trim()} for ${selected.id}.`);
    setAssignInspectorId("");
  }

  function handleReport() {
    if (!selected?.inspection?.id || !reportScore.trim() || !reportText.trim()) return;
    showToast("ok", `Report submitted — score ${reportScore}/100 for ${selected.id}.`);
    setReportScore("");
    setReportText("");
  }

  function handleDecision(decision: "APPROVED" | "REJECTED") {
    if (!selected) return;
    showToast("ok", decision === "APPROVED" ? `${selected.id} approved — certificate issued.` : `${selected.id} rejected.`);
    setDecisionNotes("");
  }

  const columns: RowColumn<CrbRow>[] = [
    {
      key: "applicant", header: "Applicant", width: "minmax(0,1.8fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{r.applicant.name}</div>
          <div className="truncate text-[10px] text-white/45">{r.applicant.email}</div>
        </div>
      ),
    },
    { key: "type", header: "Type", width: "minmax(0,0.7fr)", render: (r) => <VerificationChip tone={TYPE_TONE[r.type]} size="xs">{r.type}</VerificationChip> },
    { key: "industry", header: "Industry", width: "minmax(0,1fr)", render: (r) => <span className="text-[11px] text-white/70">{r.industry}</span> },
    { key: "status", header: "Status", width: "minmax(0,0.9fr)", render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip> },
    { key: "created", header: "Created", width: "minmax(0,1.1fr)", align: "right", render: (r) => <span className="text-[10px] text-white/45">{fmtTime(r.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #67E8F9 20%, #2BBFA0 40%, #7B6EF6 60%, #F0A030 80%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-cyan-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-400/18 via-[#2BBFA0]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-cyan-300">CRB</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Central Record Blockchain</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Physical + legal verification workflow — apply, document review, inspection,
              decision, certificate. DMO tasks aur franchise inspectors sa tightly integrated.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/queue" className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-xs font-semibold text-[#A098F8] transition-colors hover:bg-[#7B6EF6]/25">Operations Queue</Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total applications" value={stats.total} sub="All CRB submissions" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.4" /><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.4" /></svg>} />
        <VerificationStatCard tone="amber" label="In inspection" value={stats.inspection} sub="Awaiting inspector report" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Approved" value={stats.approved} sub="Certificate issued" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="red" label="Rejected" value={stats.rejected} sub="Needs re-submission" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" /><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>} />
      </section>

      {/* Pipeline distribution */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="CRB pipeline" hint="Application lifecycle distribution" />
        <SeverityMeter segments={[
          { label: "Submitted", value: stats.submitted, tone: "purple" },
          { label: "Review", value: stats.review, tone: "cyan" },
          { label: "Inspection", value: stats.inspection, tone: "amber" },
          { label: "Approved", value: stats.approved, tone: "green" },
          { label: "Rejected", value: stats.rejected, tone: "red" },
        ]} />
      </section>

      {/* Application queue */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Verification · Applications" title="CRB application queue" hint="Click any row for full review" right={<span className="text-[10px] text-white/45">{visible.length} item(s)</span>} />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <FilterChipRow<"ALL" | CrbStatus>
            options={[
              { value: "ALL" as const, label: `All · ${rows.length}` },
              { value: "SUBMITTED" as const, label: `Submitted · ${stats.submitted}` },
              { value: "REVIEW" as const, label: `Review · ${stats.review}` },
              { value: "INSPECTION" as const, label: `Inspection · ${stats.inspection}` },
              { value: "APPROVED" as const, label: `Approved · ${stats.approved}` },
              { value: "REJECTED" as const, label: `Rejected · ${stats.rejected}` },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterChipRow<"ALL" | CrbType>
            options={[
              { value: "ALL" as const, label: "All types" },
              { value: "SKILL" as const, label: "Skill" },
              { value: "SERVICE" as const, label: "Service" },
              { value: "PRODUCT" as const, label: "Product" },
              { value: "COMPANY" as const, label: "Company" },
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
          />
        </div>

        <div className="mt-4">
          <VerificationRowGrid<CrbRow>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setSelected(r)}
            getRowTone={(r) => STATUS_TONE[r.status]}
            emptyTitle="No CRB applications"
            emptyHint="Adjust filters or submit a new application."
          />
        </div>
      </section>

      {/* Detail drawer */}
      <VerificationDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="CRB Application Review"
        subtitle={selected ? `${selected.id} · ${selected.type} · ${selected.industry}` : undefined}
        severity={selected?.status === "REJECTED" ? "critical" : selected?.status === "INSPECTION" ? "high" : selected?.status === "APPROVED" ? "info" : "warning"}
      >
        {selected ? (
          <div className="space-y-4">
            {/* Status + type chips */}
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={STATUS_TONE[selected.status]}>{selected.status}</VerificationChip>
              <VerificationChip tone={TYPE_TONE[selected.type]}>{selected.type}</VerificationChip>
            </div>

            {/* Applicant details */}
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Applicant" value={selected.applicant.name} />
              <InfoCell label="Email" value={selected.applicant.email} mono />
              <InfoCell label="Role" value={selected.applicant.role} />
              <InfoCell label="Industry" value={selected.industry} />
              <InfoCell label="Created" value={fmtTime(selected.createdAt)} />
              <InfoCell label="DMO Task" value={selected.dmoTaskId ?? "Not linked"} mono />
            </div>

            {/* Notes */}
            {selected.notes ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[13px] leading-relaxed text-white/75">
                {selected.notes}
              </div>
            ) : null}

            {/* Documents */}
            <div className="rounded-xl border border-white/10 bg-[#1A1D33]/80 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Documents ({selected.documents.length})</p>
              {selected.documents.length === 0 ? (
                <p className="mt-2 text-[11px] text-white/40">No documents uploaded.</p>
              ) : (
                <div className="mt-2 grid gap-2">
                  {selected.documents.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                      <span className="text-[11px] font-semibold text-white/75">{d.type}</span>
                      <span className="text-[10px] font-semibold text-cyan-300 hover:text-white cursor-pointer">View</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inspection info */}
            <div className="rounded-xl border border-white/10 bg-[#1A1D33]/80 p-4 space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Inspection</p>
              {selected.inspection ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <InfoCell label="Inspection ID" value={selected.inspection.id} mono />
                  <InfoCell label="Status" value={selected.inspection.status} />
                  <InfoCell label="Inspector" value={selected.inspection.inspectorId} mono />
                  <InfoCell label="Score" value={selected.inspection.score !== null ? `${selected.inspection.score}/100` : "Pending"} />
                </div>
              ) : (
                <p className="text-[11px] text-white/40">No inspection assigned yet.</p>
              )}

              {/* Score gauge bar */}
              {selected.inspection?.score !== null && selected.inspection?.score !== undefined ? (
                <div className="mt-1">
                  <div className="flex items-center justify-between text-[10px] text-white/50">
                    <span>Score</span>
                    <span className={selected.inspection.score >= 70 ? "text-[#38C878]" : selected.inspection.score >= 40 ? "text-[#F0A030]" : "text-[#F05858]"}>{selected.inspection.score}/100</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${selected.inspection.score}%`,
                        background: selected.inspection.score >= 70 ? "#38C878" : selected.inspection.score >= 40 ? "#F0A030" : "#F05858",
                      }}
                    />
                  </div>
                </div>
              ) : null}

              {/* Report text */}
              {selected.inspection?.report ? (
                <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 text-[11px] text-white/60 italic">
                  {selected.inspection.report}
                </div>
              ) : null}
            </div>

            {/* Certificate */}
            {selected.certificate ? (
              <div className="rounded-xl border border-[#38C878]/30 bg-[#38C878]/8 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#38C878]/80">Certificate Active</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <InfoCell label="Certificate ID" value={selected.certificate.id} mono />
                  <InfoCell label="Status" value={selected.certificate.status} />
                  <InfoCell label="Issued" value={fmtTime(selected.certificate.issuedAt)} />
                  <InfoCell label="Expires" value={fmtTime(selected.certificate.expiryDate)} />
                </div>
              </div>
            ) : null}

            {/* Action forms — prototype */}
            <div className="space-y-3 border-t border-white/10 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Actions (Prototype)</p>

              {/* Assign inspection */}
              <div className="rounded-xl border border-white/10 bg-[#1A1D33]/80 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-white/70">Assign Inspection</p>
                <input
                  value={assignInspectorId}
                  onChange={(e) => setAssignInspectorId(e.target.value)}
                  placeholder="Inspector ID (e.g. INS-KHI-04)"
                  className="w-full rounded-xl border border-white/10 bg-[#0C0E1A]/80 px-3 py-2 text-xs text-white placeholder:text-white/35 outline-none focus:border-[#7B6EF6]/55"
                />
                <button
                  type="button"
                  onClick={handleAssign}
                  className="rounded-xl border border-[#2BBFA0]/50 bg-[#2BBFA0]/15 px-4 py-2 text-[11px] font-semibold text-[#2BBFA0] transition-colors hover:bg-[#2BBFA0]/25 hover:text-white"
                >
                  Assign
                </button>
              </div>

              {/* Submit report */}
              <div className="rounded-xl border border-white/10 bg-[#1A1D33]/80 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-white/70">Submit Inspection Report</p>
                <input
                  value={reportScore}
                  onChange={(e) => setReportScore(e.target.value)}
                  placeholder="Score (0-100)"
                  className="w-full rounded-xl border border-white/10 bg-[#0C0E1A]/80 px-3 py-2 text-xs text-white placeholder:text-white/35 outline-none focus:border-[#7B6EF6]/55"
                />
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Inspection findings..."
                  className="h-20 w-full rounded-xl border border-white/10 bg-[#0C0E1A]/80 px-3 py-2 text-xs text-white placeholder:text-white/35 outline-none focus:border-[#7B6EF6]/55 resize-none"
                />
                <button
                  type="button"
                  onClick={handleReport}
                  className="rounded-xl border border-cyan-400/50 bg-cyan-400/15 px-4 py-2 text-[11px] font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/25 hover:text-white"
                >
                  Submit Report
                </button>
              </div>

              {/* Final decision */}
              <div className="rounded-xl border border-white/10 bg-[#1A1D33]/80 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-white/70">Final Decision</p>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Decision notes (optional)..."
                  className="h-16 w-full rounded-xl border border-white/10 bg-[#0C0E1A]/80 px-3 py-2 text-xs text-white placeholder:text-white/35 outline-none focus:border-[#7B6EF6]/55 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecision("APPROVED")}
                    className="flex-1 rounded-xl border border-[#38C878]/50 bg-[#38C878]/15 px-4 py-2.5 text-[11px] font-semibold text-[#38C878] transition-colors hover:bg-[#38C878]/25 hover:text-white"
                  >
                    Approve + Issue Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision("REJECTED")}
                    className="flex-1 rounded-xl border border-[#F05858]/50 bg-[#F05858]/15 px-4 py-2.5 text-[11px] font-semibold text-[#F05858] transition-colors hover:bg-[#F05858]/25 hover:text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* CSS-animated toast */}
      <div
        className={`fixed bottom-6 right-6 z-[80] rounded-xl border px-4 py-3 text-xs transition-all duration-300 ${
          toast.open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 pointer-events-none"
        } ${
          toast.kind === "ok"
            ? "border-[#38C878]/40 bg-[#38C878]/15 text-[#38C878]"
            : "border-[#F05858]/40 bg-[#F05858]/15 text-[#F05858]"
        }`}
      >
        <p className="font-semibold">{toast.kind === "ok" ? "Success" : "Error"}</p>
        <p className="mt-0.5 text-white/70">{toast.text}</p>
      </div>
    </div>
  );
}
