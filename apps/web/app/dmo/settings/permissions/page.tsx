"use client";

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type RolePermissionMatrix = {
  role: string;
  stl: boolean;
  pss: boolean;
  crb: boolean;
  wallet: boolean;
  complaints: boolean;
  ai: boolean;
  analytics: boolean;
  blockchain: boolean;
};

const PERMISSION_MATRIX: RolePermissionMatrix[] = [
  { role: "Decision Maker", stl: true, pss: true, crb: true, wallet: true, complaints: true, ai: true, analytics: true, blockchain: true },
  { role: "Risk Analyst", stl: true, pss: true, crb: true, wallet: false, complaints: true, ai: true, analytics: true, blockchain: false },
  { role: "Trust Officer", stl: true, pss: true, crb: true, wallet: false, complaints: false, ai: false, analytics: true, blockchain: true },
  { role: "Finance Manager", stl: false, pss: false, crb: false, wallet: true, complaints: false, ai: false, analytics: true, blockchain: false },
  { role: "Operations Lead", stl: true, pss: false, crb: false, wallet: false, complaints: true, ai: false, analytics: true, blockchain: false },
  { role: "Analytics Expert", stl: false, pss: false, crb: false, wallet: false, complaints: false, ai: false, analytics: true, blockchain: false },
  { role: "AI Supervisor", stl: true, pss: true, crb: false, wallet: false, complaints: false, ai: true, analytics: true, blockchain: false },
];

const MODULES = ["STL", "PSS", "CRB", "Wallet", "Complaints", "AI", "Analytics", "Blockchain"];

export default function PermissionsPage() {
  const [editingRole, setEditingRole] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#06B6D4]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #06B6D4 25%, #7B6EF6 50%, #F0A030 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#06B6D4]/20 via-[#7B6EF6]/15 to-transparent blur-3xl" />
        <div className="relative space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
            <span className="text-white/25">/</span>
            <Link href="/dmo/settings" className="text-white/40 hover:text-white/70 transition-colors">Settings</Link>
            <span className="text-white/25">/</span>
            <span className="text-[#06B6D4]">Permissions</span>
          </div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Permission Matrix</h1>
          <p className="max-w-2xl text-sm text-white/65">
            Role-based access control — which role can access which DMO module.
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Total Roles" value={PERMISSION_MATRIX.length} sub="configured" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2v20m-9-9h18" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="teal" label="Modules" value={MODULES.length} sub="domains" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="cyan" label="Total Assignments" value={PERMISSION_MATRIX.reduce((s, r) => s + Object.values(r).filter((v) => v === true).length, 0)} sub="access grants" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="green" label="Avg Access/Role" value="5.4" sub="modules per role" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.6" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Permission Matrix" hint="Green = access granted" />
        <div className="mt-4 overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid gap-2">
              {PERMISSION_MATRIX.map((row) => (
                <div key={row.role} className="flex gap-2">
                  <div className="w-32 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
                    <p className="text-[11px] font-semibold text-white truncate">{row.role}</p>
                  </div>
                  {MODULES.map((mod) => {
                    const key = mod.toLowerCase().replace("-", "_") as keyof RolePermissionMatrix;
                    const hasAccess = row[key];
                    return (
                      <div key={`${row.role}-${mod}`} className="w-16">
                        <button
                          className={`w-full rounded-lg border py-2 text-center text-[11px] font-semibold transition-colors ${
                            hasAccess
                              ? "border-[#38C878]/60 bg-[#38C878]/20 text-[#38C878]"
                              : "border-white/15 bg-white/5 text-white/40"
                          }`}
                        >
                          {hasAccess ? "✓" : "—"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
