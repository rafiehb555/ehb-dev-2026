"use client";

/**
 * CRB — Certificates
 * Issued CRB certificates with tiers, blockchain hashes, and STL level references.
 * DESIGN-ONLY — in-file demo data, no fetch.
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
} from "@/components/dmo/verification/VerificationUI";

/* ── types ── */
type CertStatus = "ACTIVE" | "SUSPENDED" | "REVOKED" | "EXPIRED";
type CertTier = "STANDARD" | "PREMIUM" | "ENTERPRISE";

type CertRow = {
  id: string;
  entityName: string;
  certTier: CertTier;
  stlLevel: number;
  issuedAt: string;
  expiresAt: string;
  status: CertStatus;
  blockchainHash: string;
  region: string;
  suspensionReason?: string;
  revocationReason?: string;
};

/* ── demo data ── */
const DEMO: CertRow[] = [
  { id: "CRB-001", entityName: "GoSellr Islamabad", certTier: "ENTERPRISE", stlLevel: 8, issuedAt: "2025-06-01", expiresAt: "2027-06-01", status: "ACTIVE", blockchainHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d", region: "Islamabad" },
  { id: "CRB-002", entityName: "AGTS Dubai Travel", certTier: "PREMIUM", stlLevel: 7, issuedAt: "2025-08-15", expiresAt: "2027-08-15", status: "ACTIVE", blockchainHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e", region: "Dubai" },
  { id: "CRB-003", entityName: "Ali Raza Enterprises", certTier: "STANDARD", stlLevel: 7, issuedAt: "2025-11-10", expiresAt: "2027-11-10", status: "ACTIVE", blockchainHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f", region: "Lahore" },
  { id: "CRB-004", entityName: "WMS Karachi", certTier: "PREMIUM", stlLevel: 6, issuedAt: "2025-03-20", expiresAt: "2027-03-20", status: "SUSPENDED", blockchainHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a", region: "Karachi", suspensionReason: "Compliance documentation pending re-review" },
  { id: "CRB-005", entityName: "OLS Legal Consult", certTier: "STANDARD", stlLevel: 5, issuedAt: "2024-09-05", expiresAt: "2026-09-05", status: "ACTIVE", blockchainHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b", region: "Rawalpindi" },
  { id: "CRB-006", entityName: "TechHub Lahore", certTier: "STANDARD", stlLevel: 5, issuedAt: "2025-01-12", expiresAt: "2027-01-12", status: "ACTIVE", blockchainHash: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c", region: "Lahore" },
  { id: "CRB-007", entityName: "Zara Boutique", certTier: "STANDARD", stlLevel: 4, issuedAt: "2024-06-18", expiresAt: "2026-06-18", status: "REVOKED", blockchainHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d", region: "Karachi", revocationReason: "Fraudulent activity detected in compliance audit" },
  { id: "CRB-008", entityName: "Fatima HPS Academy", certTier: "PREMIUM", stlLevel: 4, issuedAt: "2024-04-01", expiresAt: "2026-04-01", status: "EXPIRED", blockchainHash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e", region: "Faisalabad" },
  { id: "CRB-009", entityName: "Bright Futures Edu", certTier: "PREMIUM", stlLevel: 6, issuedAt: "2025-07-22", expiresAt: "2027-07-22", status: "ACTIVE", blockchainHash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", region: "Rawalpindi" },
  { id: "CRB-010", entityName: "SecurePay Finance", certTier: "ENTERPRISE", stlLevel: 3, issuedAt: "2025-05-30", expiresAt: "2027-05-30", status: "SUSPENDED", blockchainHash: "0xa0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5", region: "Islamabad", suspensionReason: "STL level below minimum threshold for tier" },
];

const STATUS_TONE: Record<CertStatus, VerificationTone> = { ACTIVE: "green", SUSPENDED: "amber", REVOKED: "red", EXPIRED: "red" };
const TIER_TONE: Record<CertTier, VerificationTone> = { ENTERPRISE: "purple", PREMIUM: "teal", STANDARD: "cyan" };

function fmt(iso: string) { const d = new Date(iso); return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3"><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p><p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}

export default function CrbCertificatesPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [active, setActive] = useState<CertRow | null>(null);

  const stats = useMemo(() => ({
    total: 156,
    active: DEMO.filter((c) => c.status === "ACTIVE").length,
    suspended: DEMO.filter((c) => c.status === "SUSPENDED").length,
    revoked: DEMO.filter((c) => c.status === "REVOKED").length,
    expired: DEMO.filter((c) => c.status === "EXPIRED").length,
  }), []);

  const visible = filter === "ALL" ? DEMO : DEMO.filter((c) => c.status === filter);

  const columns: RowColumn<CertRow>[] = [
    { key: "entity", header: "Entity", width: "minmax(0,2fr)", render: (r) => (
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white">{r.entityName}</div>
        <div className="text-[10px] text-white/40">{r.region} · {r.id}</div>
      </div>
    )},
    { key: "tier", header: "Tier", width: "minmax(0,0.9fr)", render: (r) => <VerificationChip tone={TIER_TONE[r.certTier]}>{r.certTier}</VerificationChip> },
    { key: "level", header: "STL", width: "minmax(0,0.6fr)", render: (r) => <STLBadge level={r.stlLevel as any} size="sm" /> },
    { key: "status", header: "Status", width: "minmax(0,0.9fr)", render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip> },
    { key: "expires", header: "Expires", width: "minmax(0,1fr)", render: (r) => <span className="text-[11px] text-white/55">{fmt(r.expiresAt)}</span> },
    { key: "hash", header: "Hash", width: "minmax(0,1fr)", render: (r) => <span className="font-mono text-[10px] text-white/35">{r.blockchainHash.slice(0, 12)}...</span> },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #7B6EF6 30%, #2BBFA0 60%, transparent)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/18 via-[#2BBFA0]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <Link href="/dmo/crb" className="text-white/40 hover:text-white/70 transition-colors">CRB</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#7B6EF6]">Certificates</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">CRB Certificates</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Issued certification records with tier classification, blockchain hash verification, aur STL level mapping.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dmo/crb" className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white">CRB Overview</Link>
            <Link href="/dmo/crb/inspection" className="rounded-xl border border-[#2BBFA0]/50 bg-[#2BBFA0]/15 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:bg-[#2BBFA0]/25">Inspections</Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <VerificationStatCard tone="purple" label="Total issued" value={stats.total} sub="all time" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="green" label="Active" value={stats.active} sub="compliant" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Suspended" value={stats.suspended} sub="under review" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" /><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="red" label="Revoked" value={stats.revoked} sub="permanent" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.4" /><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>} />
        <VerificationStatCard tone="red" label="Expired" value={stats.expired} sub="renewal needed" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>} />
      </section>

      {/* Distribution */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Status distribution" />
        <SeverityMeter segments={[
          { label: "Active", value: stats.active, tone: "green" },
          { label: "Suspended", value: stats.suspended, tone: "amber" },
          { label: "Revoked", value: stats.revoked, tone: "red" },
          { label: "Expired", value: stats.expired, tone: "red" },
        ]} />
      </section>

      {/* Grid */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Registry" title="All certificates" hint="Click row for full detail" right={<span className="text-[10px] text-white/45">{visible.length} cert(s)</span>} />
        <div className="mt-3">
          <FilterChipRow<string> options={[
            { value: "ALL", label: `All · ${DEMO.length}` },
            { value: "ACTIVE", label: `Active · ${stats.active}` },
            { value: "SUSPENDED", label: `Suspended · ${stats.suspended}` },
            { value: "REVOKED", label: `Revoked · ${stats.revoked}` },
            { value: "EXPIRED", label: `Expired · ${stats.expired}` },
          ]} value={filter} onChange={setFilter} />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<CertRow> rows={visible} columns={columns} onRowClick={setActive} getRowTone={(r) => r.status === "ACTIVE" ? "green" : r.status === "SUSPENDED" ? "amber" : "red"} emptyTitle="No certificates match" emptyHint="Adjust filter." />
        </div>
      </section>

      {/* Drawer */}
      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active?.entityName ?? "Certificate detail"} subtitle={active ? `${active.id} · ${active.certTier}` : undefined} severity={active?.status === "REVOKED" ? "critical" : active?.status === "SUSPENDED" ? "warning" : "info"}>
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={STATUS_TONE[active.status]}>{active.status}</VerificationChip>
              <VerificationChip tone={TIER_TONE[active.certTier]}>{active.certTier}</VerificationChip>
              <STLBadge level={active.stlLevel as any} size="md" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Issued" value={fmt(active.issuedAt)} />
              <InfoCell label="Expires" value={fmt(active.expiresAt)} />
              <InfoCell label="Region" value={active.region} />
              <InfoCell label="Certificate ID" value={active.id} mono />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Blockchain hash</p>
              <p className="mt-1 break-all font-mono text-xs text-[#67E8F9]">{active.blockchainHash}</p>
            </div>

            {active.suspensionReason && (
              <div className="rounded-xl border border-[#F0A030]/30 bg-[#F0A030]/10 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F0A030]/70">Suspension reason</p>
                <p className="mt-1 text-sm text-[#F0A030]">{active.suspensionReason}</p>
              </div>
            )}

            {active.revocationReason && (
              <div className="rounded-xl border border-[#F05858]/30 bg-[#F05858]/10 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#F05858]/70">Revocation reason</p>
                <p className="mt-1 text-sm text-[#F05858]">{active.revocationReason}</p>
              </div>
            )}
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
