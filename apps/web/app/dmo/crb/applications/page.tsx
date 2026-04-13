"use client";

/**
 * DMO — CRB Applications Sub-page
 *   - Shows CRB certification applications (businesses applying for EHB certification)
 *   - Statuses: SUBMITTED, DOCUMENT_REVIEW, INSPECTION, APPROVED, REJECTED
 *   - VerificationUI primitives (no framer-motion, no emojis, no legacy classes)
 *   - In-file demo data (prototype only, no fetch)
 *   - Drawer with full application detail + timeline + action buttons
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
  STLBadge,
  getStlMeta,
  type RowColumn,
  type VerificationTone,
  type StlLevelMeta,
} from "@/components/dmo/verification/VerificationUI";

type ApplicationType = "NEW" | "RENEWAL" | "UPGRADE";
type ApplicationStatus = "SUBMITTED" | "DOCUMENT_REVIEW" | "INSPECTION" | "APPROVED" | "REJECTED";

type CrbApplication = {
  id: string;
  businessName: string;
  industry: string;
  applicationType: ApplicationType;
  status: ApplicationStatus;
  inspectorAssigned: string | null;
  stlLevel: number; // 1-10
  submittedAt: string;
  region: string;
  // Additional details for drawer
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessRegistration: string;
  documentsRequired: string[];
  submittedDocuments: string[];
  inspectionDate: string | null;
  inspectionNotes: string | null;
  inspectionScore: number | null;
  statusHistory: Array<{ status: ApplicationStatus; timestamp: string; note: string }>;
};

/* ── Demo data: 10 realistic Pakistani business applications ── */
const DEMO: CrbApplication[] = [
  {
    id: "APP-001",
    businessName: "GoSellr Marketplace Lahore",
    industry: "E-commerce",
    applicationType: "NEW",
    status: "DOCUMENT_REVIEW",
    inspectorAssigned: null,
    stlLevel: 3,
    submittedAt: "2026-04-10T09:30:00Z",
    region: "Punjab",
    businessEmail: "admin@gosellr.pk",
    businessPhone: "+92-42-1234-5678",
    businessAddress: "123 Mall Road, Lahore, Punjab, Pakistan",
    businessRegistration: "PK-SECP-2024-001234",
    documentsRequired: ["Trade License", "NTN Certificate", "SECP Registration"],
    submittedDocuments: ["Trade License", "NTN Certificate"],
    inspectionDate: "2026-04-20T10:00:00Z",
    inspectionNotes: null,
    inspectionScore: null,
    statusHistory: [
      { status: "SUBMITTED", timestamp: "2026-04-10T09:30:00Z", note: "Application received" },
      { status: "DOCUMENT_REVIEW", timestamp: "2026-04-11T14:00:00Z", note: "Initial document review started" },
    ],
  },
  {
    id: "APP-002",
    businessName: "WMS Health Clinics Islamabad",
    industry: "Medical",
    applicationType: "RENEWAL",
    status: "APPROVED",
    inspectorAssigned: "INS-ISB-001",
    stlLevel: 7,
    submittedAt: "2026-04-08T11:00:00Z",
    region: "Federal Capital",
    businessEmail: "compliance@wms.pk",
    businessPhone: "+92-51-2345-6789",
    businessAddress: "Medical Plaza, G-6, Islamabad, Pakistan",
    businessRegistration: "PK-PMDC-2020-005678",
    documentsRequired: ["PMDC License", "Clinic License", "Insurance Proof"],
    submittedDocuments: ["PMDC License", "Clinic License", "Insurance Proof"],
    inspectionDate: "2026-04-09T14:30:00Z",
    inspectionNotes: "All standards met. Excellent facility management.",
    inspectionScore: 94,
    statusHistory: [
      { status: "SUBMITTED", timestamp: "2026-04-08T11:00:00Z", note: "Renewal application submitted" },
      { status: "DOCUMENT_REVIEW", timestamp: "2026-04-08T15:30:00Z", note: "Documents verified" },
      { status: "INSPECTION", timestamp: "2026-04-09T10:00:00Z", note: "Inspection completed" },
      { status: "APPROVED", timestamp: "2026-04-10T16:00:00Z", note: "Approved for L7 renewal" },
    ],
  },
  {
    id: "APP-003",
    businessName: "Online Legal Solutions Karachi",
    industry: "Legal",
    applicationType: "UPGRADE",
    status: "INSPECTION",
    inspectorAssigned: "INS-KHI-002",
    stlLevel: 5,
    submittedAt: "2026-04-07T08:00:00Z",
    region: "Sindh",
    businessEmail: "legal@ols.pk",
    businessPhone: "+92-21-3456-7890",
    businessAddress: "Legal Plaza, DHA Phase 5, Karachi, Pakistan",
    businessRegistration: "PK-BAR-2019-009876",
    documentsRequired: ["Bar Council License", "Office Lease", "Insurance"],
    submittedDocuments: ["Bar Council License", "Office Lease", "Insurance"],
    inspectionDate: "2026-04-15T09:00:00Z",
    inspectionNotes: "Inspection in progress — staff interviews pending.",
    inspectionScore: null,
    statusHistory: [
      { status: "SUBMITTED", timestamp: "2026-04-07T08:00:00Z", note: "Upgrade application submitted" },
      { status: "DOCUMENT_REVIEW", timestamp: "2026-04-07T16:00:00Z", note: "Documents approved" },
      { status: "INSPECTION", timestamp: "2026-04-12T10:00:00Z", note: "Inspector assigned: INS-KHI-002" },
    ],
  },
  {
    id: "APP-004",
    businessName: "HPS Faisalabad Tutor Network",
    industry: "Education",
    applicationType: "NEW",
    status: "SUBMITTED",
    inspectorAssigned: null,
    stlLevel: 1,
    submittedAt: "2026-04-12T07:45:00Z",
    region: "Punjab",
    businessEmail: "enrollment@hps.pk",
    businessPhone: "+92-41-5678-9012",
    businessAddress: "Education Hub, Civil Lines, Faisalabad, Pakistan",
    businessRegistration: "PK-EDU-2025-000234",
    documentsRequired: ["Degree Certificate", "Teaching License", "Curriculum"],
    submittedDocuments: ["Degree Certificate"],
    inspectionDate: null,
    inspectionNotes: null,
    inspectionScore: null,
    statusHistory: [
      { status: "SUBMITTED", timestamp: "2026-04-12T07:45:00Z", note: "New application received" },
    ],
  },
  {
    id: "APP-005",
    businessName: "GoSellr Quetta Electronics Seller",
    industry: "E-commerce",
    applicationType: "NEW",
    status: "REJECTED",
    inspectorAssigned: "INS-QTA-001",
    stlLevel: 2,
    submittedAt: "2026-04-05T13:20:00Z",
    region: "Balochistan",
    businessEmail: "seller@gosellr.pk",
    businessPhone: "+92-81-9012-3456",
    businessAddress: "Market Square, Quetta, Balochistan, Pakistan",
    businessRegistration: "PK-SECP-2025-003456",
    documentsRequired: ["Trade License", "NTN", "Product Authenticity Cert"],
    submittedDocuments: ["Trade License"],
    inspectionDate: "2026-04-06T10:00:00Z",
    inspectionNotes: "Product authenticity verification failed. Counterfeit components detected.",
    inspectionScore: 18,
    statusHistory: [
      { status: "SUBMITTED", timestamp: "2026-04-05T13:20:00Z", note: "Application received" },
      { status: "DOCUMENT_REVIEW", timestamp: "2026-04-05T16:00:00Z", note: "Documents incomplete" },
      { status: "INSPECTION", timestamp: "2026-04-06T10:00:00Z", note: "Inspection completed" },
      { status: "REJECTED", timestamp: "2026-04-07T11:30:00Z", note: "Failed authenticity check" },
    ],
  },
  {
    id: "APP-006",
    businessName: "Al-Ghanim Travel Services Lahore",
    industry: "Travel",
    applicationType: "NEW",
    status: "INSPECTION",
    inspectorAssigned: "INS-LHR-003",
    stlLevel: 4,
    submittedAt: "2026-04-09T10:15:00Z",
    region: "Punjab",
    businessEmail: "compliance@ats.pk",
    businessPhone: "+92-42-4567-8901",
    businessAddress: "Travel Tower, Boulevard, Lahore, Pakistan",
    businessRegistration: "PK-STZA-2024-006789",
    documentsRequired: ["Travel License", "STZA Approval", "Visa Bond"],
    submittedDocuments: ["Travel License", "STZA Approval", "Visa Bond"],
    inspectionDate: "2026-04-18T14:00:00Z",
    inspectionNotes: "Visa bond verification pending with STZA.",
    inspectionScore: null,
    statusHistory: [
      { status: "SUBMITTED", timestamp: "2026-04-09T10:15:00Z", note: "Travel service application submitted" },
      { status: "DOCUMENT_REVIEW", timestamp: "2026-04-09T15:00:00Z", note: "Initial review passed" },
      { status: "INSPECTION", timestamp: "2026-04-12T09:00:00Z", note: "On-site inspection scheduled" },
    ],
  },
  {
    id: "APP-007",
    businessName: "Pakistan IT Solutions Peshawar",
    industry: "Technology",
    applicationType: "NEW",
    status: "DOCUMENT_REVIEW",
    inspectorAssigned: null,
    stlLevel: 2,
    submittedAt: "2026-04-11T09:00:00Z",
    region: "KP",
    businessEmail: "business@pitss.pk",
    businessPhone: "+92-91-1234-5678",
    businessAddress: "IT Park, Peshawar, KP, Pakistan",
    businessRegistration: "PK-SECP-2024-007890",
    documentsRequired: ["Software License", "Team Credentials", "Office Verification"],
    submittedDocuments: ["Software License", "Team Credentials"],
    inspectionDate: null,
    inspectionNotes: null,
    inspectionScore: null,
    statusHistory: [
      { status: "SUBMITTED", timestamp: "2026-04-11T09:00:00Z", note: "IT services application submitted" },
      { status: "DOCUMENT_REVIEW", timestamp: "2026-04-11T13:00:00Z", note: "Document review in progress" },
    ],
  },
  {
    id: "APP-008",
    businessName: "Prime Logistics Multan",
    industry: "Logistics",
    applicationType: "RENEWAL",
    status: "APPROVED",
    inspectorAssigned: "INS-MLT-001",
    stlLevel: 6,
    submittedAt: "2026-04-06T12:30:00Z",
    region: "Punjab",
    businessEmail: "ops@primelogistics.pk",
    businessPhone: "+92-61-2345-6789",
    businessAddress: "Logistics Hub, Old Shujabad Road, Multan, Pakistan",
    businessRegistration: "PK-LOG-2020-008901",
    documentsRequired: ["Vehicle License", "Insurance", "Safety Cert"],
    submittedDocuments: ["Vehicle License", "Insurance", "Safety Cert"],
    inspectionDate: "2026-04-08T11:00:00Z",
    inspectionNotes: "Fleet is well-maintained. Safety protocols excellent.",
    inspectionScore: 88,
    statusHistory: [
      { status: "SUBMITTED", timestamp: "2026-04-06T12:30:00Z", note: "Renewal submitted" },
      { status: "DOCUMENT_REVIEW", timestamp: "2026-04-06T16:00:00Z", note: "Documents verified" },
      { status: "INSPECTION", timestamp: "2026-04-08T11:00:00Z", note: "Inspection passed" },
      { status: "APPROVED", timestamp: "2026-04-09T14:00:00Z", note: "Approved for L6 renewal" },
    ],
  },
  {
    id: "APP-009",
    businessName: "Fashion House Karachi",
    industry: "Fashion",
    applicationType: "NEW",
    status: "SUBMITTED",
    inspectorAssigned: null,
    stlLevel: 1,
    submittedAt: "2026-04-12T06:00:00Z",
    region: "Sindh",
    businessEmail: "info@fashionhouse.pk",
    businessPhone: "+92-21-5678-9012",
    businessAddress: "Fashion Arcade, Zamzama, Karachi, Pakistan",
    businessRegistration: "PK-FAS-2025-009012",
    documentsRequired: ["Trade License", "Import License", "Quality Cert"],
    submittedDocuments: ["Trade License"],
    inspectionDate: null,
    inspectionNotes: null,
    inspectionScore: null,
    statusHistory: [
      { status: "SUBMITTED", timestamp: "2026-04-12T06:00:00Z", note: "Fashion business application submitted" },
    ],
  },
  {
    id: "APP-010",
    businessName: "Delta Real Estate Hyderabad",
    industry: "Real Estate",
    applicationType: "UPGRADE",
    status: "DOCUMENT_REVIEW",
    inspectorAssigned: null,
    stlLevel: 3,
    submittedAt: "2026-04-10T14:45:00Z",
    region: "Sindh",
    businessEmail: "licensing@deltare.pk",
    businessPhone: "+92-222-3456-7890",
    businessAddress: "Realty Tower, Saddar, Hyderabad, Pakistan",
    businessRegistration: "PK-REAL-2020-001234",
    documentsRequired: ["RE License", "Project Approval", "Audit Report"],
    submittedDocuments: ["RE License", "Project Approval"],
    inspectionDate: null,
    inspectionNotes: null,
    inspectionScore: null,
    statusHistory: [
      { status: "SUBMITTED", timestamp: "2026-04-10T14:45:00Z", note: "Upgrade application submitted" },
      { status: "DOCUMENT_REVIEW", timestamp: "2026-04-10T17:00:00Z", note: "Review started" },
    ],
  },
];

const STATUS_TONE: Record<ApplicationStatus, VerificationTone> = {
  SUBMITTED: "purple",
  DOCUMENT_REVIEW: "cyan",
  INSPECTION: "amber",
  APPROVED: "green",
  REJECTED: "red",
};

const TYPE_TONE: Record<ApplicationType, VerificationTone> = {
  NEW: "teal",
  RENEWAL: "green",
  UPGRADE: "amber",
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function InfoCell({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function CrbApplicationsPage() {
  const [rows] = useState<CrbApplication[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<"ALL" | ApplicationStatus>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | ApplicationType>("ALL");
  const [selected, setSelected] = useState<CrbApplication | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    kind: "ok" | "err";
    text: string;
  }>({ open: false, kind: "ok", text: "" });

  /* Form state for prototype actions */
  const [assignInspectorId, setAssignInspectorId] = useState("");
  const [inspectionScore, setInspectionScore] = useState("");
  const [inspectionNotes, setInspectionNotes] = useState("");

  const stats = useMemo(
    () => ({
      total: rows.length,
      submitted: rows.filter((r) => r.status === "SUBMITTED").length,
      documentReview: rows.filter((r) => r.status === "DOCUMENT_REVIEW").length,
      inspection: rows.filter((r) => r.status === "INSPECTION").length,
      approved: rows.filter((r) => r.status === "APPROVED").length,
      rejected: rows.filter((r) => r.status === "REJECTED").length,
    }),
    [rows]
  );

  const visible = rows.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (typeFilter !== "ALL" && r.applicationType !== typeFilter) return false;
    return true;
  });

  function showToast(kind: "ok" | "err", text: string) {
    setToast({ open: true, kind, text });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 3500);
  }

  function handleAssignInspector() {
    if (!selected || !assignInspectorId.trim()) return;
    showToast(
      "ok",
      `Inspector ${assignInspectorId.trim()} assigned to ${selected.id}.`
    );
    setAssignInspectorId("");
  }

  function handleSubmitInspectionReport() {
    if (!selected || !inspectionScore.trim() || !inspectionNotes.trim()) return;
    const score = parseInt(inspectionScore);
    if (isNaN(score) || score < 0 || score > 100) {
      showToast("err", "Score must be 0-100.");
      return;
    }
    showToast(
      "ok",
      `Inspection report submitted — score ${score}/100 for ${selected.id}.`
    );
    setInspectionScore("");
    setInspectionNotes("");
  }

  function handleApprove() {
    if (!selected) return;
    showToast(
      "ok",
      `${selected.id} approved — certificate issued for ${selected.businessName}.`
    );
  }

  function handleReject() {
    if (!selected) return;
    showToast("ok", `${selected.id} rejected.`);
  }

  const columns: RowColumn<CrbApplication>[] = [
    {
      key: "businessName",
      header: "Business Name",
      width: "minmax(0,1.8fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">
            {r.businessName}
          </div>
          <div className="truncate text-[10px] text-white/45">{r.region}</div>
        </div>
      ),
    },
    {
      key: "industry",
      header: "Industry",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <span className="text-[11px] text-white/70">{r.industry}</span>
      ),
    },
    {
      key: "applicationType",
      header: "Type",
      width: "minmax(0,0.7fr)",
      render: (r) => (
        <VerificationChip tone={TYPE_TONE[r.applicationType]} size="xs">
          {r.applicationType}
        </VerificationChip>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,1fr)",
      render: (r) => (
        <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip>
      ),
    },
    {
      key: "stlLevel",
      header: "STL",
      width: "minmax(0,0.5fr)",
      align: "center",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white">
          L{r.stlLevel}
        </span>
      ),
    },
    {
      key: "submitted",
      header: "Submitted",
      width: "minmax(0,1.1fr)",
      align: "right",
      render: (r) => (
        <span className="text-[10px] text-white/45">{fmtTime(r.submittedAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <header className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #67E8F9 20%, #2BBFA0 40%, #7B6EF6 60%, #F0A030 80%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-cyan-400/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-400/18 via-[#2BBFA0]/12 to-transparent blur-3xl" />

        <div className="relative space-y-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/dmo" className="hover:text-white/75 transition-colors">
              DMO
            </Link>
            <span>/</span>
            <Link href="/dmo/crb" className="hover:text-white/75 transition-colors">
              CRB
            </Link>
            <span>/</span>
            <span className="text-white/75 font-semibold">Applications</span>
          </nav>

          {/* Title & Description */}
          <div>
            <h1 className="text-2xl font-black text-white">
              CRB Certification Applications
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Manage business certification requests across EHB partner industries.
              Track application status, assign inspectors, and issue certifications.
            </p>
          </div>
        </div>
      </header>

      {/* Stat cards row */}
      <div className="grid gap-3 md:grid-cols-5 lg:grid-cols-6">
        <VerificationStatCard
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
              <path d="M9 3v18" />
            </svg>
          }
          label="Total"
          value={stats.total}
          tone="purple"
        />
        <VerificationStatCard
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6v6l4 2.4" />
            </svg>
          }
          label="Submitted"
          value={stats.submitted}
          sub={`${((stats.submitted / stats.total) * 100).toFixed(0)}%`}
          tone="purple"
        />
        <VerificationStatCard
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2-2 2 2 0 0 0 2 2m0 0h4" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          }
          label="In Review"
          value={stats.documentReview}
          tone="cyan"
        />
        <VerificationStatCard
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path d="M19.071 19.071A9 9 0 1 1 5 12a4 4 0 0 0 7.072 .929Z" />
            </svg>
          }
          label="Inspections"
          value={stats.inspection}
          tone="amber"
        />
        <VerificationStatCard
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
          label="Approved"
          value={stats.approved}
          sub={`${((stats.approved / stats.total) * 100).toFixed(0)}%`}
          tone="green"
        />
        <VerificationStatCard
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          }
          label="Rejected"
          value={stats.rejected}
          tone="red"
        />
      </div>

      {/* Filter chips */}
      <div className="space-y-3">
        <SectionHeader
          eyebrow="Filter"
          title="Applications"
          hint="Narrow by status or application type"
        />
        <div className="space-y-2">
          <FilterChipRow
            value={statusFilter}
            options={[
              { value: "ALL", label: "All Statuses" },
              { value: "SUBMITTED", label: "Submitted" },
              { value: "DOCUMENT_REVIEW", label: "Document Review" },
              { value: "INSPECTION", label: "Inspection" },
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
            ]}
            onChange={(v) => setStatusFilter(v)}
          />
          <FilterChipRow
            value={typeFilter}
            options={[
              { value: "ALL", label: "All Types" },
              { value: "NEW", label: "New" },
              { value: "RENEWAL", label: "Renewal" },
              { value: "UPGRADE", label: "Upgrade" },
            ]}
            onChange={(v) => setTypeFilter(v)}
          />
        </div>
      </div>

      {/* Row grid */}
      <div>
        <VerificationRowGrid
          columns={columns}
          rows={visible}
          onRowClick={(row) => setSelected(row)}
          getRowTone={(row) => STATUS_TONE[row.status]}
          emptyTitle="No applications match filters"
          emptyHint="Try adjusting status or type filters."
          emptyIcon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2-2 2 2 0 0 0 2 2m0 0h4" />
            </svg>
          }
        />
      </div>

      {/* Drawer — application detail */}
      <VerificationDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.businessName || ""}
        subtitle={`ID: ${selected?.id} · Region: ${selected?.region}`}
        severity={
          selected?.status === "REJECTED"
            ? "critical"
            : selected?.status === "INSPECTION"
            ? "warning"
            : "info"
        }
        footer={
          selected ? (
            <div className="space-y-3">
              {/* Action buttons */}
              {selected.status === "APPROVED" || selected.status === "REJECTED" ? (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-center text-xs text-white/60">
                  Application {selected.status.toLowerCase()}
                </div>
              ) : (
                <div className="grid gap-2">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
                      Action
                    </label>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={handleApprove}
                        className="flex-1 rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-400 transition-all hover:border-green-500/70 hover:bg-green-500/20"
                      >
                        Approve
                      </button>
                      <button
                        onClick={handleReject}
                        className="flex-1 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition-all hover:border-red-500/70 hover:bg-red-500/20"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-6 pb-4">
            {/* STL Badge + Score */}
            <div className="flex flex-col items-center gap-4">
              <STLBadge level={selected.stlLevel} size="md" />
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Service Trust Level
                </p>
                <p className="mt-1 text-sm text-white/75">
                  {getStlMeta(selected.stlLevel).label}
                </p>
              </div>
            </div>

            {/* Business Info Grid */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                Business Details
              </h3>
              <div className="grid gap-2 md:grid-cols-2">
                <InfoCell
                  label="Business Email"
                  value={selected.businessEmail}
                  mono
                />
                <InfoCell
                  label="Business Phone"
                  value={selected.businessPhone}
                  mono
                />
                <InfoCell
                  label="Business Address"
                  value={selected.businessAddress}
                />
                <InfoCell
                  label="Registration"
                  value={selected.businessRegistration}
                  mono
                />
              </div>
            </div>

            {/* Application Details */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                Application Details
              </h3>
              <div className="grid gap-2 md:grid-cols-2">
                <InfoCell label="Type" value={selected.applicationType} />
                <InfoCell label="Status" value={selected.status} />
                <InfoCell
                  label="Submitted"
                  value={fmtTime(selected.submittedAt)}
                />
                <InfoCell
                  label="Industry"
                  value={selected.industry}
                />
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                Documents
              </h3>
              <div className="space-y-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    Required
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.documentsRequired.map((doc) => (
                      <span
                        key={doc}
                        className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[9px] font-semibold text-cyan-300"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                    Submitted
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.submittedDocuments.length > 0 ? (
                      selected.submittedDocuments.map((doc) => (
                        <span
                          key={doc}
                          className="rounded-full border border-green-400/30 bg-green-400/10 px-2.5 py-1 text-[9px] font-semibold text-green-300"
                        >
                          {doc}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-white/40">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Inspector Assignment */}
            {selected.status !== "APPROVED" && selected.status !== "REJECTED" && (
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Inspector Assignment
                </h3>
                <div className="space-y-2">
                  {selected.inspectorAssigned ? (
                    <div className="rounded-lg border border-teal-400/40 bg-teal-400/10 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-400">
                        Assigned Inspector
                      </p>
                      <p className="mt-1 font-mono text-sm text-white/80">
                        {selected.inspectorAssigned}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="INS-CITY-001"
                        value={assignInspectorId}
                        onChange={(e) => setAssignInspectorId(e.target.value)}
                        className="w-full rounded-lg border border-white/12 bg-white/[0.05] px-3 py-2 text-sm placeholder-white/35 text-white outline-none transition-all focus:border-[#7B6EF6]/60 focus:ring-2 focus:ring-[#7B6EF6]/20"
                      />
                      <button
                        onClick={handleAssignInspector}
                        className="w-full rounded-lg border border-[#7B6EF6]/40 bg-[#7B6EF6]/10 px-3 py-2 text-xs font-semibold text-[#A098F8] transition-all hover:border-[#7B6EF6]/70 hover:bg-[#7B6EF6]/20"
                      >
                        Assign Inspector
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inspection Report */}
            {selected.status === "INSPECTION" && !selected.inspectionScore && (
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Inspection Report
                </h3>
                <div className="space-y-2">
                  {selected.inspectionNotes && (
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                        Inspector Notes
                      </p>
                      <p className="mt-2 text-sm text-white/70">
                        {selected.inspectionNotes}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Score (0-100)"
                      min="0"
                      max="100"
                      value={inspectionScore}
                      onChange={(e) => setInspectionScore(e.target.value)}
                      className="w-full rounded-lg border border-white/12 bg-white/[0.05] px-3 py-2 text-sm placeholder-white/35 text-white outline-none transition-all focus:border-[#F0A030]/60 focus:ring-2 focus:ring-[#F0A030]/20"
                    />
                    <textarea
                      placeholder="Inspection notes..."
                      value={inspectionNotes}
                      onChange={(e) => setInspectionNotes(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-white/12 bg-white/[0.05] px-3 py-2 text-sm placeholder-white/35 text-white outline-none transition-all focus:border-[#F0A030]/60 focus:ring-2 focus:ring-[#F0A030]/20"
                    />
                    <button
                      onClick={handleSubmitInspectionReport}
                      className="w-full rounded-lg border border-[#F0A030]/40 bg-[#F0A030]/10 px-3 py-2 text-xs font-semibold text-[#F0A030] transition-all hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20"
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                Status History
              </h3>
              <div className="space-y-2">
                {selected.statusHistory.map((entry, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-white/90">
                          {entry.status}
                        </p>
                        <p className="mt-1 text-[10px] text-white/50">
                          {fmtTime(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                    {entry.note && (
                      <p className="mt-2 text-[11px] text-white/70">{entry.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>

      {/* Toast notification */}
      {toast.open && (
        <div className="fixed bottom-6 left-6 right-6 z-[10000] flex max-w-sm items-center gap-3 rounded-lg border border-white/15 bg-[#13162A]/95 px-4 py-3 backdrop-blur-xl md:right-auto">
          {toast.kind === "ok" ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#38C878"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F05858"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
          <span className="text-sm text-white/85">{toast.text}</span>
        </div>
      )}
    </div>
  );
}
