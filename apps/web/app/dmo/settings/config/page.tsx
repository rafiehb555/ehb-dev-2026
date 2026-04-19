"use client";

import Link from "next/link";
import { useState } from "react";
import {
  VerificationStatCard,
  SectionHeader,
} from "@/components/dmo/verification/VerificationUI";

type ConfigItem = {
  id: string;
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "secret";
  description: string;
};

const CONFIG_ITEMS: ConfigItem[] = [
  { id: "C-001", key: "STL_RECALC_HOUR", value: "03", type: "number", description: "Nightly STL recalculation UTC hour" },
  { id: "C-002", key: "PSS_LIVENESS_THRESHOLD", value: "0.82", type: "number", description: "Liveness detection confidence threshold" },
  { id: "C-003", key: "CRB_EXPIRY_WARNING_DAYS", value: "14", type: "number", description: "Days before certificate expiry to warn" },
  { id: "C-004", key: "WALLET_HOLD_MAX_DAYS", value: "90", type: "number", description: "Maximum escrow hold duration in days" },
  { id: "C-005", key: "AI_SUGGESTION_ENABLED", value: "true", type: "boolean", description: "Enable AI recommendations across DMO" },
  { id: "C-006", key: "BLOCKCHAIN_ANCHOR_DAILY", value: "true", type: "boolean", description: "Daily Polkadot merkle anchoring" },
  { id: "C-007", key: "SENDGRID_API_KEY", value: "••••••••••••••••", type: "secret", description: "SendGrid email service API key" },
  { id: "C-008", key: "WEBHOOK_SIGNING_SECRET", value: "••••••••••••••••", type: "secret", description: "Ed25519 webhook signature key" },
];

export default function ConfigPage() {
  const [editingKey, setEditingKey] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#F0A030]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6 pt-[22px]">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, #F0A030 25%, #7B6EF6 50%, #2BBFA0 75%, transparent 100%)" }} />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#F0A030]/20 via-[#7B6EF6]/15 to-transparent blur-3xl" />
        <div className="relative space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
            <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
            <span className="text-white/25">/</span>
            <Link href="/dmo/settings" className="text-white/40 hover:text-white/70 transition-colors">Settings</Link>
            <span className="text-white/25">/</span>
            <span className="text-[#F0A030]">Config</span>
          </div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">System Configuration</h1>
          <p className="max-w-2xl text-sm text-white/65">
            API keys, webhook URLs, SLA thresholds, auto-approve rules, email templates.
            Changes take effect immediately.
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard tone="purple" label="Config Keys" value={CONFIG_ITEMS.length} sub="total items" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.6" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4" stroke="currentColor" strokeWidth="1.2" /></svg>} />
        <VerificationStatCard tone="amber" label="Secrets" value="2" sub="API keys masked" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" stroke="currentColor" strokeWidth="1.2" /></svg>} />
        <VerificationStatCard tone="teal" label="Type Distribution" value="4" sub="config types" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.6" /></svg>} />
        <VerificationStatCard tone="green" label="Last Synced" value="2m ago" sub="to production" icon={<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8h-2c0-3.316-2.686-6-6-6v8m0-8V0C4.582 0 2 3.582 2 8h2zm8 16v-8h-2v8c0 1.104.896 2 2 2h8c1.104 0 2-.896 2-2v-8h-2v8h-8z" stroke="currentColor" strokeWidth="1.2" /></svg>} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Configuration Items" hint="Click to edit any value" />
        <div className="mt-4 space-y-2">
          {CONFIG_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setEditingKey(item.key)}
              className="w-full rounded-xl border border-white/8 bg-white/[0.03] p-4 text-left transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-[11px] font-semibold text-white/85">{item.key}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                      item.type === "secret" ? "bg-[#F05858]/20 text-[#F05858]" :
                      item.type === "boolean" ? "bg-[#2BBFA0]/20 text-[#2BBFA0]" :
                      item.type === "number" ? "bg-[#7B6EF6]/20 text-[#7B6EF6]" :
                      "bg-[#F0A030]/20 text-[#F0A030]"
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-white/60">{item.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <code className="font-mono text-[11px] text-white/50">{item.value}</code>
                  <span className="text-white/30">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#13162A]/70 p-5">
        <SectionHeader title="Email Templates" hint="Customize DMO notifications" />
        <div className="mt-4 space-y-2">
          {["STL Downgrade Alert", "CRB Renewal Reminder", "Wallet Hold Notice", "Complaint Escalation"].map((template, i) => (
            <div key={i} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-white">{template}</p>
                <button className="text-[10px] font-semibold text-[#7B6EF6] hover:text-[#A098F8]">Edit template</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
