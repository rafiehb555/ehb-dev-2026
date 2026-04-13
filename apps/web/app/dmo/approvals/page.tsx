"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  FilterChipRow,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type ApprovalBucket = "pending" | "approved" | "rejected" | "history";
type ApprovalKind = "CRB" | "STL" | "PSS" | "Franchise" | "Refill";
type Priority = "low" | "normal" | "high" | "urgent";

type ApprovalRow = {
  id: string;
  subject: string;
  requester: string;
  kind: ApprovalKind;
  bucket: ApprovalBucket;
  priority: Priority;
  decidedBy?: string;
  decidedAt?: string;
  createdAt: string;
  stakeUsd?: number;
  note?: string;
};

const DEMO: ApprovalRow[] = [
  {
    id: "AP-9010",
    subject: "GoSellr seller · L6 → L7 upgrade",
    requester: "Ayesha Khan · GoSellr / Lahore",
    kind: "STL",
    bucket: "pending",
    priority: "high",
    createdAt: "2026-04-11T09:10:00Z",
    stakeUsd: 1200,
    note: "Refill cycle complete, exam score 91/100, zero complaints last 30 days.",
  },
  {
    id: "AP-9009",
    subject: "OLS Lahore · CRB certificate renewal",
    requester: "Hamza Legal Chambers · OLS / Lahore",
    kind: "CRB",
    bucket: "pending",
    priority: "normal",
    createdAt: "2026-04-11T07:42:00Z",
    stakeUsd: 600,
    note: "Bar council verification done, PSS live, awaiting CRB stamp.",
  },
  {
    id: "AP-9008",
    subject: "New franchise · Sub · Peshawar",
    requester: "Bilal Ahmed · new applicant",
    kind: "Franchise",
    bucket: "pending",
    priority: "urgent",
    createdAt: "2026-04-10T22:12:00Z",
    stakeUsd: 2500,
    note: "Corporate franchise endorsed, coin lock 2000 EHBGC verified on-chain.",
  },
  {
    id: "AP-9007",
    subject: "PSS liveness override · disputed",
    requester: "Sara N. · WMS / Karachi",
    kind: "PSS",
    bucket: "pending",
    priority: "low",
    createdAt: "2026-04-10T14:05:00Z",
    note: "Camera quality issue — user asked for manual review, CRB panel attached.",
  },
  {
    id: "AP-9006",
    subject: "AGTS travel · CRB upgrade",
    requester: "SkyWings Travel · AGTS / Multan",
    kind: "CRB",
    bucket: "approved",
    priority: "normal",
    createdAt: "2026-04-09T11:30:00Z",
    decidedBy: "dmo.ayesha",
    decidedAt: "2026-04-11T07:10:00Z",
    stakeUsd: 450,
  },
  {
    id: "AP-9005",
    subject: "Refill · L5 → L6 (WMS)",
    requester: "Dr. Faisal · WMS / Islamabad",
    kind: "Refill",
    bucket: "approved",
    priority: "normal",
    createdAt: "2026-04-10T13:00:00Z",
    decidedBy: "dmo.hamza",
    decidedAt: "2026-04-10T22:40:00Z",
  },
  {
    id: "AP-9004",
    subject: "STL dispute · counterfeit",
    requester: "Zara Boutique · GoSellr / Karachi",
    kind: "STL",
    bucket: "rejected",
    priority: "high",
    createdAt: "2026-04-09T18:05:00Z",
    decidedBy: "dmo.sara",
    decidedAt: "2026-04-10T19:05:00Z",
    stakeUsd: 800,
    note: "Evidence insufficient, CRB panel flagged mismatched brand registration.",
  },
  {
    id: "AP-9003",
    subject: "Franchise · Corporate · Multan (archived)",
    requester: "Northern Stars Group · Multan",
    kind: "Franchise",
    bucket: "history",
    priority: "normal",
    createdAt: "2026-04-01T09:00:00Z",
    decidedBy: "dmo.bilal",
    decidedAt: "2026-04-05T12:00:00Z",
  },
];

const BUCKET_META: Record<
  ApprovalBucket,
  { label: string; hint: string; tone: VerificationTone; severity: "info" | "warning" | "high" | "critical" }
> = {
  pending: { label: "Pending", hint: "In queue · awaiting decision", tone: "amber", severity: "warning" },
  approved: { label: "Approved", hint: "Signed off · last 14 days", tone: "green", severity: "info" },
  rejected: { label: "Rejected", hint: "Declined · appeal window open", tone: "red", severity: "high" },
  history: { label: "History", hint: "Archived · audit-only view", tone: "purple", severity: "info" },
};

const KIND_TONE: Record<ApprovalKind, VerificationTone> = {
  CRB: "cyan",
  STL: "purple",
  PSS: "teal",
  Franchise: "amber",
  Refill: "green",
};

const PRIORITY_TONE: Record<Priority, VerificationTone> = {
  low: "cyan",
  normal: "teal",
  high: "amber",
  urgent: "red",
};

function fmtTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function InfoCell({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function ApprovalsPage() {
  const [rows] = useState<ApprovalRow[]>(DEMO);
  const [bucket, setBucket] = useState<ApprovalBucket>("pending");
  const [active, setActive] = useState<ApprovalRow | null>(null);

  const counts = useMemo(
    () => ({
      pending: rows.filter((r) => r.bucket === "pending").length,
      approved: rows.filter((r) => r.bucket === "approved").length,
      rejected: rows.filter((r) => r.bucket === "rejected").length,
      history: rows.filter((r) => r.bucket === "history").length,
    }),
    [rows]
  );

  const totalStakePending = useMemo(
    () =>
      rows
        .filter((r) => r.bucket === "pending")
        .reduce((s, r) => s + (r.stakeUsd ?? 0), 0),
    [rows]
  );

  const visible = rows.filter((r) => r.bucket === bucket);

  const columns: RowColumn<ApprovalRow>[] = [
    {
      key: "id",
      header: "Approval",
      width: "minmax(0,1.8fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-white/45">{r.id}</div>
          <div className="truncate text-sm font-semibold text-white">{r.subject}</div>
          <div className="truncate text-[10px] text-white/50">{r.requester}</div>
        </div>
      ),
    },
    {
      key: "kind",
      header: "Kind",
      width: "minmax(0,0.9fr)",
      render: (r) => <VerificationChip tone={KIND_TONE[r.kind]}>{r.kind}</VerificationChip>,
    },
    {
      key: "priority",
      header: "Priority",
      width: "minmax(0,0.9fr)",
      render: (r) => (
        <VerificationChip tone={PRIORITY_TONE[r.priority]}>{r.priority}</VerificationChip>
      ),
    },
    {
      key: "stake",
      header: "Stake",
      width: "minmax(0,0.8fr)",
      align: "right",
      render: (r) => (
        <span className="font-mono text-sm text-white/85">
          {r.stakeUsd ? `$${r.stakeUsd.toLocaleString()}` : "—"}
        </span>
      ),
    },
    {
      key: "decided",
      header: "Decided",
      width: "minmax(0,1.1fr)",
      render: (r) => (
        <div className="text-[10px] leading-tight text-white/55">
          <div className="text-white/80">{r.decidedBy ?? "—"}</div>
          <div>{fmtTime(r.decidedAt)}</div>
        </div>
      ),
    },
    {
      key: "when",
      header: "Filed",
      width: "minmax(0,0.9fr)",
      align: "right",
      render: (r) => <span className="text-[10px] text-white/45">{fmtTime(r.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F0A030]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #F0A030 20%, #7B6EF6 50%, #2BBFA0 80%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#F0A030]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F0A030]/20 via-[#7B6EF6]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#F0A030]">Approvals</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Approvals</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Cross-module decision desk — STL, PSS, CRB, Refill, Franchise ki har approval
              yahaan sa route hoti hai. Har approval ko audit trail milta hai + on-chain
              proof hook (Phase 5).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dmo/applications"
              className="rounded-xl border border-[#2BBFA0]/50 bg-[#2BBFA0]/15 px-3 py-1.5 text-xs font-semibold text-[#2BBFA0] transition-colors hover:border-[#2BBFA0]/80 hover:bg-[#2BBFA0]/25 hover:text-white"
            >
              Full applications board
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="amber"
          label="Pending"
          value={counts.pending}
          sub="awaiting decision"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          }
          onClick={() => setBucket("pending")}
        />
        <VerificationStatCard
          tone="green"
          label="Approved"
          value={counts.approved}
          sub="last 14 days"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M5 12l4 4L19 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          onClick={() => setBucket("approved")}
        />
        <VerificationStatCard
          tone="red"
          label="Rejected"
          value={counts.rejected}
          sub="appeal window"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          }
          onClick={() => setBucket("rejected")}
        />
        <VerificationStatCard
          tone="purple"
          label="Pending stake"
          value={`$${(totalStakePending / 1000).toFixed(1)}k`}
          sub="escrow exposure"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M4 7h16M4 12h16M4 17h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          }
          onClick={() => setBucket("history")}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader
          eyebrow="Operations"
          title={`${BUCKET_META[bucket].label} queue`}
          hint={BUCKET_META[bucket].hint}
          right={<span className="text-[10px] text-white/45">{visible.length} row(s)</span>}
        />
        <div className="mt-3">
          <FilterChipRow<ApprovalBucket>
            options={[
              { value: "pending", label: `Pending · ${counts.pending}` },
              { value: "approved", label: `Approved · ${counts.approved}` },
              { value: "rejected", label: `Rejected · ${counts.rejected}` },
              { value: "history", label: `History · ${counts.history}` },
            ]}
            value={bucket}
            onChange={setBucket}
          />
        </div>
        <div className="mt-4">
          <VerificationRowGrid<ApprovalRow>
            rows={visible}
            columns={columns}
            onRowClick={(r) => setActive(r)}
            getRowTone={(r) => BUCKET_META[r.bucket].tone}
            emptyIcon={<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M2 10h20" stroke="currentColor" strokeWidth="1.4" /></svg>}
            emptyTitle="Nothing in this bucket"
            emptyHint="Queue clear — koi pending decision nahi hai."
          />
        </div>
      </section>

      <VerificationDrawer
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? active.subject : "Approval detail"}
        subtitle={active ? `${active.id} · ${active.requester}` : undefined}
        severity={active ? BUCKET_META[active.bucket].severity : "warning"}
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <VerificationChip tone={KIND_TONE[active.kind]}>{active.kind}</VerificationChip>
              <VerificationChip tone={PRIORITY_TONE[active.priority]}>
                {active.priority}
              </VerificationChip>
              <VerificationChip tone={BUCKET_META[active.bucket].tone}>
                {BUCKET_META[active.bucket].label}
              </VerificationChip>
            </div>

            {active.note ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[13px] leading-relaxed text-white/75">
                {active.note}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Approval ID" value={active.id} mono />
              <InfoCell label="Kind" value={active.kind} />
              <InfoCell label="Priority" value={active.priority} />
              <InfoCell
                label="Stake"
                value={active.stakeUsd ? `$${active.stakeUsd.toLocaleString()}` : "—"}
                mono
              />
              <InfoCell label="Filed" value={fmtTime(active.createdAt)} />
              <InfoCell
                label="Decision"
                value={
                  active.decidedAt
                    ? `${active.decidedBy ?? "—"} · ${fmtTime(active.decidedAt)}`
                    : "Awaiting"
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                className="rounded-xl border border-[#38C878]/40 bg-[#38C878]/12 px-3 py-2 text-[11px] font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/70 hover:bg-[#38C878]/20"
              >
                Approve
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F0A030]/40 bg-[#F0A030]/12 px-3 py-2 text-[11px] font-semibold text-[#F0A030] transition-colors hover:border-[#F0A030]/70 hover:bg-[#F0A030]/20"
              >
                Hold
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#F05858]/40 bg-[#F05858]/12 px-3 py-2 text-[11px] font-semibold text-[#F05858] transition-colors hover:border-[#F05858]/70 hover:bg-[#F05858]/20"
              >
                Reject
              </button>
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
