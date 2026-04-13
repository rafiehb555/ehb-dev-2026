"use client";

/**
 * DMO — Settings
 *   - VerificationUI primitives for stat cards + operator grid (no <table>)
 *   - Policy toggles preserved, polished with accent bars
 */

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  VerificationRowGrid,
  VerificationChip,
  SectionHeader,
  type RowColumn,
  type VerificationTone,
} from "@/components/dmo/verification/VerificationUI";

type OperatorRow = {
  id: string;
  name: string;
  role: "owner" | "admin" | "operator" | "inspector";
  status: "active" | "invited" | "suspended";
  lastSeen: string;
};

type ToggleKey =
  | "stl_autorecalc"
  | "pss_liveness_strict"
  | "crb_auto_route"
  | "wallet_pause_withdrawals"
  | "ai_suggestions"
  | "blockchain_anchors";

const OPERATORS: OperatorRow[] = [
  { id: "U-1001", name: "dmo.ayesha", role: "admin", status: "active", lastSeen: "2m ago" },
  { id: "U-1002", name: "dmo.sara", role: "operator", status: "active", lastSeen: "14m ago" },
  { id: "U-1003", name: "dmo.hamza", role: "operator", status: "active", lastSeen: "1h ago" },
  { id: "U-1004", name: "crb.inspector.khi", role: "inspector", status: "active", lastSeen: "3h ago" },
  { id: "U-1005", name: "dmo.bilal", role: "operator", status: "invited", lastSeen: "—" },
  { id: "U-1006", name: "dmo.legacy", role: "operator", status: "suspended", lastSeen: "12d ago" },
];

const ROLE_TONE: Record<OperatorRow["role"], VerificationTone> = {
  owner: "amber",
  admin: "purple",
  operator: "cyan",
  inspector: "teal",
};

const STATUS_TONE: Record<OperatorRow["status"], VerificationTone> = {
  active: "green",
  invited: "amber",
  suspended: "red",
};

const TOGGLE_META: Record<ToggleKey, { label: string; help: string }> = {
  stl_autorecalc: { label: "STL auto-recalculation", help: "Nightly 03:00 UTC job recalculates L1–L8 trust scores across 4,800+ sellers." },
  pss_liveness_strict: { label: "PSS strict liveness", help: "Threshold 0.82 — reject borderline liveness captures for AGTS & WMS flows." },
  crb_auto_route: { label: "CRB auto-routing", help: "Auto-assign inspection tasks based on inspector workload + region proximity." },
  wallet_pause_withdrawals: { label: "Wallet pause withdrawals", help: "Global kill-switch — pauses non-escrow withdrawals (emergency only)." },
  ai_suggestions: { label: "AI suggestions (DMO)", help: "Show AI guide cards across DMO surfaces (refill nudges, risk flags)." },
  blockchain_anchors: { label: "Blockchain anchors", help: "Daily Merkle root anchoring of STL & CRB to the EHB Polkadot layer." },
};

const columns: RowColumn<OperatorRow>[] = [
  {
    key: "user",
    header: "User",
    width: "minmax(0,2fr)",
    render: (r) => (
      <div className="min-w-0">
        <div className="font-mono text-[10px] text-white/45">{r.id}</div>
        <div className="text-sm font-semibold text-white">{r.name}</div>
      </div>
    ),
  },
  { key: "role", header: "Role", width: "minmax(0,0.9fr)", render: (r) => <VerificationChip tone={ROLE_TONE[r.role]}>{r.role}</VerificationChip> },
  { key: "status", header: "Status", width: "minmax(0,0.9fr)", render: (r) => <VerificationChip tone={STATUS_TONE[r.status]}>{r.status}</VerificationChip> },
  { key: "seen", header: "Last seen", width: "minmax(0,0.8fr)", align: "right", render: (r) => <span className="text-[10px] text-white/55">{r.lastSeen}</span> },
];

export default function DmoSettingsPage() {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    stl_autorecalc: true,
    pss_liveness_strict: true,
    crb_auto_route: true,
    wallet_pause_withdrawals: false,
    ai_suggestions: true,
    blockchain_anchors: true,
  });

  function flip(key: ToggleKey) {
    setToggles((t) => ({ ...t, [key]: !t[key] }));
  }

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#A098F8]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #A098F8 25%, #2BBFA0 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#A098F8]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#A098F8]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Settings</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Settings</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Users, roles, policy toggles, aur system-level config — sab yahaan se manage
              hoga. Destructive actions par explicit confirmation maangy jaate hain.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Operators" value={OPERATORS.length} sub="team members" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="teal" label="Active roles" value={4} sub="RBAC config" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>} />
        <VerificationStatCard tone="cyan" label="Policy toggles" value={Object.keys(TOGGLE_META).length} sub="system switches" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.65.77 1.09 1.45 1.12H21a2 2 0 010 4h-.09c-.68.03-1.25.47-1.45 1.12z" stroke="currentColor" strokeWidth="1.2" /></svg>} />
        <VerificationStatCard tone="green" label="Config version" value="v2.4" sub="last updated today" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
          <SectionHeader title="Operators & roles" hint="RBAC aware · click row for detail" right={
            <Link href="/dmo/settings/users" className="rounded-xl border border-[#7B6EF6]/50 bg-[#7B6EF6]/15 px-3 py-1.5 text-[11px] font-semibold text-[#A098F8] transition-colors hover:border-[#A098F8]/80 hover:bg-[#7B6EF6]/25 hover:text-white">Manage users</Link>
          } />
          <div className="mt-4">
            <VerificationRowGrid<OperatorRow>
              rows={OPERATORS}
              columns={columns}
              getRowTone={(r) => STATUS_TONE[r.status]}
              emptyTitle="No operators"
              emptyHint="Invite team members."
            />
          </div>
        </div>

        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-[#2BBFA0]/25 bg-[#13162A]/70 p-5 pt-[22px]">
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #2BBFA0, transparent)" }} />
          <SectionHeader title="Policy toggles" hint="Effective immediately" />
          <div className="mt-3 space-y-2">
            {(Object.keys(TOGGLE_META) as ToggleKey[]).map((k) => {
              const meta = TOGGLE_META[k];
              const on = toggles[k];
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => flip(k)}
                  className="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-[#1A1D33]/80 p-3 text-left transition-colors hover:border-[#2BBFA0]/45"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{meta.label}</p>
                    <p className="mt-0.5 text-[11px] text-white/55">{meta.help}</p>
                  </div>
                  <span className={`mt-1 inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors ${on ? "border-[#2BBFA0]/60 bg-[#2BBFA0]/30" : "border-white/15 bg-white/[0.06]"}`}>
                    <span className={`h-3.5 w-3.5 rounded-full transition-transform ${on ? "translate-x-[18px] bg-[#2BBFA0]" : "translate-x-[3px] bg-white/60"}`} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/dmo/settings/users", label: "Users", help: "Invite & deactivate", tone: "purple" as VerificationTone },
          { href: "/dmo/settings/roles", label: "Roles", help: "RBAC roles", tone: "teal" as VerificationTone },
          { href: "/dmo/settings/permissions", label: "Permissions", help: "Module access", tone: "cyan" as VerificationTone },
          { href: "/dmo/settings/config", label: "System config", help: "Env + thresholds", tone: "amber" as VerificationTone },
        ].map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#13162A]/80 p-4 pt-[22px] transition-all duration-200 hover:-translate-y-[2px] hover:border-white/20"
          >
            <span className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, var(--fg), transparent)`, "--fg": t.tone === "purple" ? "#A098F8" : t.tone === "teal" ? "#2BBFA0" : t.tone === "cyan" ? "#67E8F9" : "#F0A030" } as React.CSSProperties} />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">{t.label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{t.help}</p>
            <p className="mt-2 text-[11px] text-white/45 transition-colors group-hover:text-white/75">Open →</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
