"use client";

/**
 * /certification — My Certificates Dashboard
 * User-facing CRB dashboard showing active certificates, renewal schedule, and STL quality meter.
 */

import Link from "next/link";
import { useState, useMemo } from "react";

type CertificateStatus = "ACTIVE" | "EXPIRING" | "EXPIRED";
type CertificateType = "BUSINESS_REGISTRATION" | "TAX_ID" | "TRADE_LICENSE" | "PROFESSIONAL_LICENSE" | "INSPECTION_REPORT" | "PRODUCT_CERT" | "SERVICE_CERT" | "COMPLIANCE";

interface Certificate {
  id: string;
  type: CertificateType;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  status: CertificateStatus;
  blockchainHash: string;
  crbLevel: number;
  renewalEligible: boolean;
}

interface UserProfile {
  crbLevel: number;
  totalCertificates: number;
  activeCertificates: number;
  expiringCertificates: number;
  qualityScore: number;
}

/* ── Demo data ── */
const DEMO_PROFILE: UserProfile = {
  crbLevel: 7,
  totalCertificates: 5,
  activeCertificates: 4,
  expiringCertificates: 1,
  qualityScore: 87,
};

const DEMO_CERTIFICATES: Certificate[] = [
  {
    id: "CERT-2024-001",
    type: "BUSINESS_REGISTRATION",
    name: "Business Registration Certificate",
    issuer: "Ministry of Commerce",
    issuedDate: "2024-03-15",
    expiryDate: "2026-03-15",
    status: "ACTIVE",
    blockchainHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    crbLevel: 8,
    renewalEligible: false,
  },
  {
    id: "CERT-2024-002",
    type: "TAX_ID",
    name: "Tax Identification Number",
    issuer: "FBR",
    issuedDate: "2023-06-01",
    expiryDate: "2026-06-01",
    status: "ACTIVE",
    blockchainHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
    crbLevel: 7,
    renewalEligible: false,
  },
  {
    id: "CERT-2024-003",
    type: "TRADE_LICENSE",
    name: "Trade License",
    issuer: "City Municipal Authority",
    issuedDate: "2024-01-10",
    expiryDate: "2025-05-10",
    status: "EXPIRING",
    blockchainHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
    crbLevel: 6,
    renewalEligible: true,
  },
  {
    id: "CERT-2024-004",
    type: "PROFESSIONAL_LICENSE",
    name: "Professional Services License",
    issuer: "Professional Standards Board",
    issuedDate: "2024-07-20",
    expiryDate: "2027-07-20",
    status: "ACTIVE",
    blockchainHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    crbLevel: 7,
    renewalEligible: false,
  },
  {
    id: "CERT-2024-005",
    type: "INSPECTION_REPORT",
    name: "Quality Inspection Report",
    issuer: "CRB Verification Team",
    issuedDate: "2024-09-01",
    expiryDate: "2026-09-01",
    status: "ACTIVE",
    blockchainHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    crbLevel: 8,
    renewalEligible: false,
  },
];

const CERT_TYPE_ICONS: Record<CertificateType, string> = {
  BUSINESS_REGISTRATION: "📋",
  TAX_ID: "💰",
  TRADE_LICENSE: "🏪",
  PROFESSIONAL_LICENSE: "📜",
  INSPECTION_REPORT: "✅",
  PRODUCT_CERT: "📦",
  SERVICE_CERT: "🛠",
  COMPLIANCE: "🔒",
};

const CRB_LEVELS = [
  { level: 1, name: "Registered", color: "#8890B0" },
  { level: 2, name: "Verified", color: "#7B6EF6" },
  { level: 3, name: "Certified", color: "#A098F8" },
  { level: 4, name: "Trusted", color: "#2BBFA0" },
  { level: 5, name: "Advanced", color: "#38C878" },
  { level: 6, name: "Premium", color: "#F0A030" },
  { level: 7, name: "Elite", color: "#7B6EF6" },
  { level: 8, name: "Supreme", color: "#E91E63" },
];

function CrbLevelMeter({ level, score }: { level: number; score: number }) {
  const levelMeta = CRB_LEVELS[Math.min(level - 1, 7)];
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="64" cy="64" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke={levelMeta.color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold" style={{ color: levelMeta.color }}>
            L{level}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{score}%</div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-white">{levelMeta.name}</div>
        <div className="text-[11px] text-white/50">Quality Rating</div>
      </div>
    </div>
  );
}

function CertificateCard({ cert }: { cert: Certificate }) {
  const statusColors = {
    ACTIVE: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", label: "Active" },
    EXPIRING: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300", label: "Expiring Soon" },
    EXPIRED: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-300", label: "Expired" },
  };

  const colors = statusColors[cert.status];
  const icon = CERT_TYPE_ICONS[cert.type];

  const issuedDate = new Date(cert.issuedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const expiryDate = new Date(cert.expiryDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-[#13162A] to-[#1A1D33] p-5 transition-all hover:border-white/16 hover:shadow-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{icon}</div>
            <div>
              <h3 className="text-sm font-semibold text-white">{cert.name}</h3>
              <p className="text-[11px] text-white/50">{cert.issuer}</p>
            </div>
          </div>
          <div className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${colors.bg} border ${colors.border} ${colors.text}`}>
            {colors.label}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-white/40">Issued</div>
            <div className="mt-1 text-xs font-semibold text-white">{issuedDate}</div>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/[0.03] p-2.5">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-white/40">Expires</div>
            <div className="mt-1 text-xs font-semibold text-white">{expiryDate}</div>
          </div>
        </div>

        {/* CRB Level & Hash */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-purple-500/20 px-2.5 py-1 text-[10px] font-semibold text-purple-200">CRB L{cert.crbLevel}</div>
          </div>
          <div className="font-mono text-[9px] text-white/30 hover:text-white/50" title={cert.blockchainHash}>
            {cert.blockchainHash.slice(0, 10)}...
          </div>
        </div>

        {/* Action */}
        {cert.renewalEligible && (
          <Link
            href={`/certification/apply?renewal=${cert.id}`}
            className="inline-block w-full rounded-lg bg-gradient-to-r from-purple-600 to-teal-600 px-3 py-2 text-center text-[11px] font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/20"
          >
            Renew Certificate
          </Link>
        )}

        {!cert.renewalEligible && (
          <Link
            href={`/certification/${cert.id}`}
            className="inline-block w-full rounded-lg border border-white/10 px-3 py-2 text-center text-[11px] font-semibold text-white transition-colors hover:bg-white/5"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}

export default function CertificationPage() {
  const [selectedLevel, setSelectedLevel] = useState(DEMO_PROFILE.crbLevel);

  const stats = useMemo(
    () => [
      { label: "Total Certificates", value: DEMO_PROFILE.totalCertificates, icon: "📑" },
      { label: "Active", value: DEMO_PROFILE.activeCertificates, icon: "✅" },
      { label: "Expiring Soon", value: DEMO_PROFILE.expiringCertificates, icon: "⚠️" },
      { label: "Quality Score", value: `${DEMO_PROFILE.qualityScore}%`, icon: "⭐" },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-[#0C0E1A] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/45">Verification</div>
          <h1 className="text-3xl font-bold">My Certificates</h1>
          <p className="text-sm text-white/60">
            Manage your CRB certifications and keep your service quality level (STL) elevated. Renew expiring certificates to maintain trust.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: CRB Level Meter */}
          <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-[#13162A] to-[#1A1D33] p-8">
            <CrbLevelMeter level={selectedLevel} score={DEMO_PROFILE.qualityScore} />
          </div>

          {/* Right: Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center backdrop-blur">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className="mt-2 text-lg font-bold text-white">{stat.value}</div>
                  <div className="mt-1 text-[10px] text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/certification/apply"
              className="block rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-teal-600/20 px-6 py-4 text-center transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="font-semibold text-white">Apply for New Certificate</div>
              <div className="mt-1 text-sm text-white/60">Expand your service offerings and boost your STL level</div>
            </Link>
          </div>
        </div>

        {/* Certificate cards */}
        <div className="mt-12 space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Certificates</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DEMO_CERTIFICATES.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} />
            ))}
          </div>
        </div>

        {/* Empty state if no certs */}
        {DEMO_CERTIFICATES.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/8 bg-white/[0.02] p-12 text-center">
            <div className="text-4xl">📋</div>
            <h3 className="mt-4 text-lg font-semibold text-white">No Certificates Yet</h3>
            <p className="mt-2 text-sm text-white/60">Start by applying for your first CRB certificate to build trust.</p>
            <Link
              href="/certification/apply"
              className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white transition-all hover:bg-purple-700"
            >
              Apply Now
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
