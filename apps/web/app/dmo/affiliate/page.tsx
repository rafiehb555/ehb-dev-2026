"use client";

/**
 * DMO — Affiliate Dashboard
 *   - VerificationUI primitives only (no <table>, no local Card)
 *   - In-file demo data (prototype only, no fetch)
 *   - Referral link, share buttons, commission rules
 */

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationDrawer,
  VerificationChip,
  SectionHeader,
  SeverityMeter,
  STLBadge,
  getStlMeta,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type ReferralUser = {
  id: string;
  name: string;
  level: number;
  earnings: number;
  status: "active" | "inactive" | "pending";
  joinedAt: string;
};

const REFERRAL_LINK = "https://ehb.ai/ref/rafi-ehb-001";
const REFERRAL_CODE = "RAFI-EHB-001";

const USERS: ReferralUser[] = [
  { id: "RU-001", name: "Ayesha Khan", level: 6, earnings: 480, status: "active", joinedAt: "2026-03-15" },
  { id: "RU-002", name: "Bilal Ahmed", level: 5, earnings: 320, status: "active", joinedAt: "2026-03-20" },
  { id: "RU-003", name: "Sara Noor", level: 4, earnings: 180, status: "active", joinedAt: "2026-04-01" },
  { id: "RU-004", name: "Hamza Ali", level: 3, earnings: 90, status: "pending", joinedAt: "2026-04-08" },
  { id: "RU-005", name: "Zara Boutique", level: 7, earnings: 720, status: "active", joinedAt: "2026-02-28" },
  { id: "RU-006", name: "TechHub LHR", level: 2, earnings: 45, status: "inactive", joinedAt: "2026-01-15" },
];

const STATUS_TONE: Record<ReferralUser["status"], VerificationTone> = {
  active: "green",
  inactive: "red",
  pending: "amber",
};

function InfoCell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className={`mt-1 text-sm text-white/90 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function AffiliatePage() {
  const [users] = useState<ReferralUser[]>(USERS);
  const [active, setActive] = useState<ReferralUser | null>(null);
  const [copied, setCopied] = useState(false);

  const totalEarnings = users.reduce((s, u) => s + u.earnings, 0);
  const activeCount = users.filter((u) => u.status === "active").length;
  const milestone = users.length >= 25 ? "Elite Referrer" : users.length >= 10 ? "Growth Referrer" : "Starter Referrer";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* fallback */ }
  }

  const columns: RowColumn<ReferralUser>[] = [
    {
      key: "user",
      header: "User",
      width: "minmax(0,1.8fr)",
      render: (r) => (
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{r.name}</div>
          <div className="text-[10px] text-white/50">Joined {r.joinedAt}</div>
        </div>
      ),
    },
    {
      key: "level",
      header: "STL",
      width: "minmax(0,0.6fr)",
      render: (r) => (
        <span className="font-mono text-sm" style={{ color: getStlMeta(r.level).accent }}>L{r.level}</span>
      ),
    },
    {
      key: "earnings",
      header: "Earnings",
      width: "minmax(0,0.8fr)",
      align: "right",
      render: (r) => <span className="font-mono text-sm text-[#38C878]">${r.earnings}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "minmax(0,0.8fr)",
      render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip>,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#38C878]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #38C878 25%, #7B6EF6 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#38C878]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#7B6EF6]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#38C878]/18 via-[#7B6EF6]/12 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#38C878]">Affiliate</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Affiliate Dashboard</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Referral tracking, earnings, commission rules. Invite → Join → Upgrade → Earn flow.
              STL level determines commission rate.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="green" label="Total earnings" value={`$${totalEarnings}`} sub="all referrals" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="purple" label="Referrals" value={users.length} sub={milestone} icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="teal" label="Active users" value={activeCount} sub="generating earnings" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="amber" label="Commission rate" value="8–15%" sub="based on STL level" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
      </section>

      {/* Referral link section */}
      <section className="relative overflow-hidden rounded-2xl border border-[#38C878]/25 bg-[#13162A]/70 p-5 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #38C878, transparent)" }} />
        <SectionHeader title="Your referral link" hint={`Code: ${REFERRAL_CODE} · ${milestone}`} />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 font-mono text-sm text-white/80 break-all">{REFERRAL_LINK}</div>
          <button type="button" onClick={copyLink} className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-4 py-2.5 text-[12px] font-semibold text-[#A098F8] transition-colors hover:bg-[#7B6EF6]/25">{copied ? "Copied!" : "Copy link"}</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={`https://wa.me/?text=${encodeURIComponent(`Join EHB via my referral: ${REFERRAL_LINK}`)}`} target="_blank" rel="noreferrer" className="rounded-xl border border-[#2BBFA0]/40 bg-[#2BBFA0]/12 px-3 py-1.5 text-[11px] font-semibold text-[#2BBFA0] transition-colors hover:bg-[#2BBFA0]/20">WhatsApp</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(REFERRAL_LINK)}`} target="_blank" rel="noreferrer" className="rounded-xl border border-[#7B6EF6]/40 bg-[#7B6EF6]/12 px-3 py-1.5 text-[11px] font-semibold text-[#A098F8] transition-colors hover:bg-[#7B6EF6]/20">Facebook</a>
          <a href={`https://t.me/share/url?url=${encodeURIComponent(REFERRAL_LINK)}`} target="_blank" rel="noreferrer" className="rounded-xl border border-cyan-400/40 bg-cyan-400/12 px-3 py-1.5 text-[11px] font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/20">Telegram</a>
        </div>
      </section>

      {/* Commission rules */}
      <section className="relative overflow-hidden rounded-2xl border border-[#F0A030]/25 bg-[#13162A]/70 p-5 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #F0A030, transparent)" }} />
        <SectionHeader title="Commission rules" hint="Single level · STL-based tiers" />
        <div className="mt-3">
          <SeverityMeter segments={[
            { label: "Base (8%)", value: 3, tone: "amber" },
            { label: "STL-5 (10%)", value: 1, tone: "teal" },
            { label: "STL-6 (12%)", value: 1, tone: "purple" },
            { label: "STL-7+ (15%)", value: 1, tone: "green" },
          ]} />
        </div>
      </section>

      {/* Referral users grid */}
      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader eyebrow="Network" title="Referral users" hint="Click row for detail" right={<span className="text-[10px] text-white/45">{users.length} user(s)</span>} />
        <div className="mt-4">
          <VerificationRowGrid<ReferralUser> rows={users} columns={columns} onRowClick={(r) => setActive(r)} getRowTone={(r) => STATUS_TONE[r.status]} emptyTitle="No referrals yet" emptyHint="Share your link to start earning." />
        </div>
      </section>

      <VerificationDrawer open={Boolean(active)} onClose={() => setActive(null)} title={active ? active.name : "Referral detail"} subtitle={active ? `${active.id} · Joined ${active.joinedAt}` : undefined} severity="info">
        {active ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <STLBadge level={active.level as any} size="md" />
              <div>
                <p className="text-lg font-bold" style={{ color: getStlMeta(active.level).accent }}>L{active.level}</p>
                <VerificationChip tone={STATUS_TONE[active.status]}>{active.status}</VerificationChip>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCell label="Name" value={active.name} />
              <InfoCell label="STL level" value={`L${active.level}`} />
              <InfoCell label="Earnings" value={`$${active.earnings}`} mono />
              <InfoCell label="Commission rate" value={active.level >= 7 ? "15%" : active.level >= 6 ? "12%" : active.level >= 5 ? "10%" : "8%"} />
            </div>
          </div>
        ) : null}
      </VerificationDrawer>
    </div>
  );
}
