"use client";

/**
 * /certification/[id] — Certificate Detail
 * Full certificate display with blockchain verification, QR code, and inspection history
 */

import Link from "next/link";
import { useState } from "react";

interface CertificateDetail {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  status: "ACTIVE" | "EXPIRING" | "EXPIRED";
  blockchainHash: string;
  crbLevel: number;
  documents: Array<{ id: string; name: string; url: string }>;
  inspectionHistory: Array<{
    id: string;
    date: string;
    inspector: string;
    score: number;
    status: "PASSED" | "CONDITIONAL" | "FAILED";
    notes: string;
  }>;
  renewalEligible: boolean;
}

const DEMO_CERT: CertificateDetail = {
  id: "CERT-2024-001",
  name: "Business Registration Certificate",
  issuer: "Ministry of Commerce",
  issuedDate: "2024-03-15",
  expiryDate: "2026-03-15",
  status: "ACTIVE",
  blockchainHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
  crbLevel: 8,
  documents: [
    { id: "D-001", name: "Original Registration Certificate", url: "#" },
    { id: "D-002", name: "Board Resolution", url: "#" },
    { id: "D-003", name: "Memorandum of Association", url: "#" },
    { id: "D-004", name: "Articles of Association", url: "#" },
  ],
  inspectionHistory: [
    {
      id: "INS-001",
      date: "2026-03-10",
      inspector: "Amir Khan",
      score: 94,
      status: "PASSED",
      notes: "Full compliance verified. All documentation complete and verified.",
    },
    {
      id: "INS-002",
      date: "2025-09-20",
      inspector: "Sarah Ahmed",
      score: 88,
      status: "CONDITIONAL",
      notes: "Minor compliance gaps noted. Updated documentation received.",
    },
    {
      id: "INS-003",
      date: "2024-03-15",
      inspector: "Muhammad Hassan",
      score: 92,
      status: "PASSED",
      notes: "Initial inspection passed. All requirements met.",
    },
  ],
  renewalEligible: false,
};

function generateQRCode(): string {
  // Simple placeholder QR code (in production, use qrcode library)
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='white' width='100' height='100'/%3E%3Crect fill='black' x='10' y='10' width='20' height='20'/%3E%3Crect fill='black' x='70' y='10' width='20' height='20'/%3E%3Crect fill='black' x='10' y='70' width='20' height='20'/%3E%3C/svg%3E";
}

export default function CertificateDetailPage({ params }: { params: { id: string } }) {
  const [showQR, setShowQR] = useState(false);

  const statusColors = {
    ACTIVE: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300" },
    EXPIRING: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300" },
    EXPIRED: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-300" },
  };

  const colors = statusColors[DEMO_CERT.status];
  const issuedDate = new Date(DEMO_CERT.issuedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const expiryDate = new Date(DEMO_CERT.expiryDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <Link href="/certification" className="text-[11px] font-semibold uppercase tracking-widest text-purple-400 hover:text-purple-300">
              ← Back to Certificates
            </Link>
            <h1 className="mt-3 text-3xl font-bold">{DEMO_CERT.name}</h1>
          </div>
          <div className={`rounded-full px-4 py-2 text-sm font-semibold ${colors.bg} border ${colors.border} ${colors.text}`}>
            {DEMO_CERT.status}
          </div>
        </div>

        <div className="space-y-6">
          {/* Blockchain Verification Card */}
          <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-teal-500/5 p-6 backdrop-blur">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-teal-300">Blockchain Verified</div>
                  <div className="mt-2 font-mono text-xs text-white/70 break-all">{DEMO_CERT.blockchainHash}</div>
                </div>
                <div className="flex items-center gap-2 text-xs text-teal-200">
                  <span className="h-2 w-2 rounded-full bg-teal-400"></span>
                  Immutable & Tamper-Proof
                </div>
              </div>
              <button
                onClick={() => setShowQR(!showQR)}
                className="rounded-lg border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-[11px] font-semibold text-teal-300 transition-all hover:bg-teal-500/20"
              >
                {showQR ? "Hide" : "Show"} QR Code
              </button>
            </div>

            {showQR && (
              <div className="mt-6 flex justify-center">
                <div className="rounded-lg border border-white/20 bg-white p-4">
                  <img src={generateQRCode()} alt="Certificate QR Code" className="h-40 w-40" />
                  <p className="mt-2 text-center text-[10px] text-gray-600">Scan to verify certificate</p>
                </div>
              </div>
            )}
          </div>

          {/* Certificate Info Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">Issuer</p>
              <p className="mt-2 text-base font-semibold text-white">{DEMO_CERT.issuer}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">CRB Level</p>
              <p className="mt-2 text-base font-semibold text-white">L{DEMO_CERT.crbLevel} - Supreme</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50">Issued Date</p>
              <p className="mt-2 text-base font-semibold text-white">{issuedDate}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
              <p className="text-[9xs] font-semibold uppercase tracking-wider text-white/50">Expiry Date</p>
              <p className="mt-2 text-base font-semibold text-white">{expiryDate}</p>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Attached Documents</h2>
            <div className="grid gap-3">
              {DEMO_CERT.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/20 hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl">📄</div>
                    <div className="text-sm font-semibold text-white">{doc.name}</div>
                  </div>
                  <div className="text-purple-400">→</div>
                </a>
              ))}
            </div>
          </div>

          {/* Inspection History */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Inspection History</h2>
            <div className="space-y-3">
              {DEMO_CERT.inspectionHistory.map((inspection, idx) => {
                const statusColor =
                  inspection.status === "PASSED"
                    ? "text-emerald-300"
                    : inspection.status === "CONDITIONAL"
                      ? "text-amber-300"
                      : "text-red-300";

                return (
                  <div key={inspection.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{inspection.date}</span>
                          <span className={`text-[10px] font-semibold uppercase ${statusColor}`}>{inspection.status}</span>
                        </div>
                        <p className="mt-2 text-xs text-white/70">Inspector: {inspection.inspector}</p>
                        <p className="mt-2 text-sm text-white/80">{inspection.notes}</p>
                      </div>
                      <div className="rounded-full bg-purple-500/20 px-3 py-1">
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-300">{inspection.score}</div>
                          <div className="text-[9px] text-purple-200">Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition-all hover:bg-white/5">
              Download Certificate
            </button>
            <button className="flex-1 rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition-all hover:bg-white/5">
              Share Certificate
            </button>
            {DEMO_CERT.renewalEligible && (
              <Link
                href={`/certification/apply?renewal=${DEMO_CERT.id}`}
                className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-teal-600 px-6 py-3 text-center font-semibold text-white transition-all hover:shadow-lg"
              >
                Renew
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
