"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SectionHeader,
  VerificationStatCard,
  VerificationChip,
  FilterChipRow,
  VerificationRowGrid,
  VerificationDrawer,
} from "@/components/dmo/verification/VerificationUI";

type DocStatus = "VERIFIED" | "PENDING" | "REJECTED" | "EXPIRED";
type DocType =
  | "TRADE_LICENSE"
  | "TAX_CERT"
  | "IDENTITY_PROOF"
  | "INSURANCE"
  | "COMPLIANCE_CERT"
  | "REGISTRATION";

interface Document {
  id: string;
  entityName: string;
  docType: DocType;
  fileName: string;
  uploadedAt: string;
  status: DocStatus;
  verifiedBy: string;
  fileSize: string;
  expiryDate?: string;
  rejectionReason?: string;
}

const DEMO_DOCUMENTS: Document[] = [
  {
    id: "doc-001",
    entityName: "TechVision Industries Ltd.",
    docType: "TRADE_LICENSE",
    fileName: "trade_license_2026.pdf",
    uploadedAt: "2026-03-15",
    status: "VERIFIED",
    verifiedBy: "Alina Farah",
    fileSize: "2.4 MB",
    expiryDate: "2027-03-15",
  },
  {
    id: "doc-002",
    entityName: "Green Solutions Co.",
    docType: "TAX_CERT",
    fileName: "tax_cert_2025.pdf",
    uploadedAt: "2026-03-14",
    status: "VERIFIED",
    verifiedBy: "Karim Hassan",
    fileSize: "1.8 MB",
    expiryDate: "2026-12-31",
  },
  {
    id: "doc-003",
    entityName: "Ahmed Abdullah Trading",
    docType: "IDENTITY_PROOF",
    fileName: "passport_scan.pdf",
    uploadedAt: "2026-03-12",
    status: "PENDING",
    verifiedBy: "—",
    fileSize: "3.2 MB",
  },
  {
    id: "doc-004",
    entityName: "SafeGuard Insurance LLC",
    docType: "INSURANCE",
    fileName: "insurance_policy_2026.pdf",
    uploadedAt: "2026-03-10",
    status: "VERIFIED",
    verifiedBy: "Lena Kowalski",
    fileSize: "4.1 MB",
    expiryDate: "2027-03-10",
  },
  {
    id: "doc-005",
    entityName: "Nexus Financial Services",
    docType: "COMPLIANCE_CERT",
    fileName: "compliance_audit_2026.pdf",
    uploadedAt: "2026-03-08",
    status: "REJECTED",
    verifiedBy: "Dr. Priya Sharma",
    fileSize: "5.6 MB",
    rejectionReason: "Document quality below standard; re-upload required",
  },
  {
    id: "doc-006",
    entityName: "BuildRight Construction",
    docType: "REGISTRATION",
    fileName: "company_registration_2023.pdf",
    uploadedAt: "2026-03-05",
    status: "EXPIRED",
    verifiedBy: "Ahmed Hassan",
    fileSize: "2.9 MB",
    expiryDate: "2025-12-31",
  },
  {
    id: "doc-007",
    entityName: "Digital Minds Academy",
    docType: "TRADE_LICENSE",
    fileName: "trade_license_education.pdf",
    uploadedAt: "2026-02-28",
    status: "VERIFIED",
    verifiedBy: "Noura Al-Mansouri",
    fileSize: "1.5 MB",
    expiryDate: "2027-02-28",
  },
  {
    id: "doc-008",
    entityName: "Rural Agricultural Group",
    docType: "TAX_CERT",
    fileName: "tax_cert_agricultural.pdf",
    uploadedAt: "2026-02-25",
    status: "PENDING",
    verifiedBy: "—",
    fileSize: "2.2 MB",
  },
  {
    id: "doc-009",
    entityName: "Premium Health Clinic",
    docType: "INSURANCE",
    fileName: "malpractice_insurance.pdf",
    uploadedAt: "2026-02-20",
    status: "VERIFIED",
    verifiedBy: "Dr. Hassan Al-Rashid",
    fileSize: "3.7 MB",
    expiryDate: "2027-02-20",
  },
  {
    id: "doc-010",
    entityName: "EcoTech Solutions",
    docType: "COMPLIANCE_CERT",
    fileName: "environmental_compliance.pdf",
    uploadedAt: "2026-02-15",
    status: "PENDING",
    verifiedBy: "—",
    fileSize: "4.3 MB",
  },
];

const STATUS_LABELS: Record<DocStatus, string> = {
  VERIFIED: "Verified",
  PENDING: "Pending Review",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

const STATUS_TONES: Record<DocStatus, "green" | "amber" | "red"> = {
  VERIFIED: "green",
  PENDING: "amber",
  REJECTED: "red",
  EXPIRED: "red",
};

const DOC_TYPE_LABELS: Record<DocType, string> = {
  TRADE_LICENSE: "Trade License",
  TAX_CERT: "Tax Certificate",
  IDENTITY_PROOF: "Identity Proof",
  INSURANCE: "Insurance Policy",
  COMPLIANCE_CERT: "Compliance Certificate",
  REGISTRATION: "Registration",
};

export default function CRBDocumentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<DocStatus | "ALL">("ALL");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredDocs =
    selectedStatus === "ALL"
      ? DEMO_DOCUMENTS
      : DEMO_DOCUMENTS.filter((d) => d.status === selectedStatus);

  const stats = {
    total: DEMO_DOCUMENTS.length,
    verified: DEMO_DOCUMENTS.filter((d) => d.status === "VERIFIED").length,
    pending: DEMO_DOCUMENTS.filter((d) => d.status === "PENDING").length,
    expired: DEMO_DOCUMENTS.filter((d) => d.status === "EXPIRED").length,
  };

  const handleRowClick = (doc: Document) => {
    setSelectedDoc(doc);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0C0E1A] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#A098F8]">
            <span>DMO</span>
            <span className="opacity-40">/</span>
            <span>CRB</span>
            <span className="opacity-40">/</span>
            <span>Documents</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Document Repository</h1>
          <p className="text-[#A098F8] text-lg">
            Manage and verify certification documents from entities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <VerificationStatCard
            tone="purple"
            label="Total Documents"
            value={stats.total}
            sub="All uploaded documents"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12h6m-6 4h6M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <VerificationStatCard
            tone="green"
            label="Verified"
            value={stats.verified}
            sub="Approved & active"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <VerificationStatCard
            tone="amber"
            label="Pending Review"
            value={stats.pending}
            sub="Awaiting verification"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <VerificationStatCard
            tone="red"
            label="Expired/Rejected"
            value={stats.expired}
            sub="Action required"
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 9v2m0 4v2m-6-4a9 9 0 1118 0 9 9 0 01-18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
        </div>

        {/* Filter */}
        <SectionHeader
          hint="Filter documents by verification status"
          title="Document Status"
        />
        <FilterChipRow
          value={selectedStatus}
          options={[
            { value: "ALL", label: "All Documents" },
            { value: "VERIFIED", label: "Verified" },
            { value: "PENDING", label: "Pending Review" },
            { value: "REJECTED", label: "Rejected" },
            { value: "EXPIRED", label: "Expired" },
          ]}
          onChange={(val) => setSelectedStatus(val as DocStatus | "ALL")}
        />

        {/* Documents Grid */}
        <SectionHeader
          hint={`${filteredDocs.length} document${filteredDocs.length !== 1 ? "s" : ""} found`}
          title="Uploaded Documents"
        />
        <VerificationRowGrid<Document>
          rows={filteredDocs}
          columns={[
            {
              key: "entityName",
              header: "Entity Name",
              width: "minmax(0,2fr)",
              render: (doc) => (
                <div>
                  <div className="font-medium text-white">{doc.entityName}</div>
                  <div className="text-sm text-[#A098F8]">
                    {DOC_TYPE_LABELS[doc.docType]}
                  </div>
                </div>
              ),
            },
            {
              key: "fileName",
              header: "File Name",
              width: "minmax(0,1.5fr)",
              render: (doc) => (
                <div className="text-white truncate font-mono text-sm">
                  {doc.fileName}
                </div>
              ),
            },
            {
              key: "uploadedAt",
              header: "Uploaded",
              width: "minmax(0,1fr)",
              render: (doc) => (
                <div className="text-[#A098F8] text-sm">{doc.uploadedAt}</div>
              ),
            },
            {
              key: "status",
              header: "Status",
              width: "minmax(0,1fr)",
              render: (doc) => (
                <VerificationChip tone={STATUS_TONES[doc.status]}>
                  {STATUS_LABELS[doc.status]}
                </VerificationChip>
              ),
            },
            {
              key: "verifiedBy",
              header: "Verified By",
              width: "minmax(0,1.5fr)",
              render: (doc) => (
                <div className="text-[#A098F8] text-sm">{doc.verifiedBy}</div>
              ),
            },
          ]}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Document Details Drawer */}
      <VerificationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedDoc?.entityName || "Document Details"}
        subtitle={selectedDoc ? DOC_TYPE_LABELS[selectedDoc.docType] : ""}
        severity={
          selectedDoc?.status === "REJECTED"
            ? "critical"
            : selectedDoc?.status === "EXPIRED"
              ? "high"
              : selectedDoc?.status === "PENDING"
                ? "warning"
                : "info"
        }
      >
        {selectedDoc && (
          <div className="space-y-6">
            {/* Metadata */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#A098F8] uppercase">
                    File Name
                  </div>
                  <div className="text-white font-mono text-sm break-all">
                    {selectedDoc.fileName}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#A098F8] uppercase">
                    File Size
                  </div>
                  <div className="text-white">{selectedDoc.fileSize}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#A098F8] uppercase">
                    Uploaded
                  </div>
                  <div className="text-white">{selectedDoc.uploadedAt}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#A098F8] uppercase">
                    Verified By
                  </div>
                  <div className="text-white">{selectedDoc.verifiedBy}</div>
                </div>
              </div>

              {selectedDoc.expiryDate && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#A098F8] uppercase">
                    Expiry Date
                  </div>
                  <div className="text-white">{selectedDoc.expiryDate}</div>
                </div>
              )}

              {selectedDoc.rejectionReason && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#F05858] uppercase">
                    Rejection Reason
                  </div>
                  <div className="text-[#F05858]">
                    {selectedDoc.rejectionReason}
                  </div>
                </div>
              )}
            </div>

            {/* Status Chip */}
            <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
              <VerificationChip tone={STATUS_TONES[selectedDoc.status]}>
                {STATUS_LABELS[selectedDoc.status]}
              </VerificationChip>
            </div>
          </div>
        )}
      </VerificationDrawer>
    </div>
  );
}
