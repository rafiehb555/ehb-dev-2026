"use client";

import Link from "next/link";
import {
  VerificationStatCard,
  VerificationChip,
} from "@/components/dmo/verification/VerificationUI";

type FranchiseTier = {
  key: "country" | "corporate" | "master" | "sub";
  title: string;
  href: string;
  sharePct: number;
  tone: "purple" | "teal" | "amber" | "cyan";
  tagline: string;
  count: number;
  trust: number;
  coinLock: string;
};

const TIERS: FranchiseTier[] = [
  {
    key: "country",
    title: "Country Franchise",
    href: "/dmo/franchise/country",
    sharePct: 25,
    tone: "purple",
    tagline: "National licensee — compliance, regulations, market strategy",
    count: 14,
    trust: 7.8,
    coinLock: "10,000 EHBGC",
  },
  {
    key: "corporate",
    title: "Corporate Franchise",
    href: "/dmo/franchise/corporate",
    sharePct: 20,
    tone: "teal",
    tagline: "Regional business clusters — multi-city operations",
    count: 42,
    trust: 6.9,
    coinLock: "4,000 EHBGC",
  },
  {
    key: "master",
    title: "Master Franchise",
    href: "/dmo/franchise/master",
    sharePct: 0,
    tone: "amber",
    tagline: "Specialised operators — industry vertical leads",
    count: 86,
    trust: 5.8,
    coinLock: "2,000 EHBGC",
  },
  {
    key: "sub",
    title: "Sub Franchise",
    href: "/dmo/franchise/sub",
    sharePct: 15,
    tone: "cyan",
    tagline: "City / branch frontline — direct seller onboarding",
    count: 318,
    trust: 5.4,
    coinLock: "200 EHBGC",
  },
];

const TIER_TONE_HEX: Record<FranchiseTier["tone"], string> = {
  purple: "#A098F8",
  teal: "#2BBFA0",
  amber: "#F0A030",
  cyan: "#67E8F9",
};

export default function DmoFranchiseMenuPage() {
  const totalCount = TIERS.reduce((s, t) => s + t.count, 0);

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-[#7B6EF6]/30 bg-gradient-to-br from-[#13162A] via-[#1A1D33] to-[#13162A] p-6">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #7B6EF6 20%, #2BBFA0 50%, #F0A030 80%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-[#7B6EF6]/50" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-[1.5px] border-r-[1.5px] border-[#2BBFA0]/45" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#7B6EF6]/20 via-[#2BBFA0]/15 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-52 w-52 rounded-full bg-gradient-to-tr from-[#F0A030]/15 via-transparent to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]">
              <Link href="/dmo" className="text-white/40 hover:text-white/70 transition-colors">DMO</Link>
              <span className="text-white/25">/</span>
              <span className="text-[#A098F8]">Franchise</span>
            </div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Franchise Dashboards</h1>
            <p className="max-w-2xl text-sm text-white/65">
              Country → Corporate → Master → Sub franchise ladder. Har tier apnay
              industry-aware KPIs, queue routing, aur trust signals ke saath aata hai.
              Revenue split: 25 / 20 / 15 across the ladder (platform keeps 40).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dmo/earnings-engine"
              className="rounded-xl border border-[#38C878]/50 bg-[#38C878]/15 px-3 py-1.5 text-xs font-semibold text-[#38C878] transition-colors hover:border-[#38C878]/80 hover:bg-[#38C878]/25 hover:text-white"
            >
              Earnings engine
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <VerificationStatCard
          tone="purple"
          label="Franchises (total)"
          value={totalCount}
          sub="across the ladder"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="teal"
          label="Countries live"
          value={14}
          sub="phase 1 rollout"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="amber"
          label="Open onboardings"
          value={9}
          sub="awaiting CRB"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M12 5v14m-7-7h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          }
        />
        <VerificationStatCard
          tone="cyan"
          label="Avg trust (weighted)"
          value="6.4"
          sub="across all tiers"
          icon={
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.5l-5.3 2.8 1-5.9L3.5 9.2l5.9-.9L12 3z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TIERS.map((t) => {
          const hex = TIER_TONE_HEX[t.tone];
          return (
            <Link
              key={t.key}
              href={t.href}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-[#13162A]/85 p-5 transition-all duration-300 ease-out hover:-translate-y-[3px] backdrop-blur-xl"
              style={{
                borderColor: `${hex}44`,
              }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 top-0 h-[3px]"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${hex} 50%, transparent 100%)`,
                  boxShadow: `0 0 12px ${hex}`,
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 opacity-55 transition-opacity group-hover:opacity-90"
                style={{
                  borderLeft: `1.5px solid ${hex}`,
                  borderTop: `1.5px solid ${hex}`,
                  borderTopLeftRadius: "3px",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 opacity-55 transition-opacity group-hover:opacity-90"
                style={{
                  borderRight: `1.5px solid ${hex}`,
                  borderBottom: `1.5px solid ${hex}`,
                  borderBottomRightRadius: "3px",
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
                style={{ background: hex }}
              />

              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    {t.key}
                  </span>
                  {t.sharePct > 0 ? (
                    <VerificationChip tone={t.tone}>{t.sharePct}% split</VerificationChip>
                  ) : (
                    <span className="rounded-full border border-white/15 bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold text-white/50">
                      platform lead
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{t.title}</h3>
                <p className="text-[11px] leading-relaxed text-white/55">{t.tagline}</p>

                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg border border-white/8 bg-white/[0.03] px-2 py-1.5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      Trust
                    </p>
                    <p className="font-mono text-[13px] text-white/85">{t.trust.toFixed(1)}</p>
                  </div>
                  <div className="rounded-lg border border-white/8 bg-white/[0.03] px-2 py-1.5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      Coin lock
                    </p>
                    <p className="font-mono text-[11px] text-white/85">{t.coinLock}</p>
                  </div>
                </div>
              </div>

              <div className="relative mt-4 flex items-end justify-between">
                <span
                  className="text-3xl font-black tabular-nums"
                  style={{ color: hex, textShadow: `0 0 18px ${hex}55` }}
                >
                  {t.count}
                </span>
                <span
                  className="text-[11px] font-semibold transition-transform group-hover:translate-x-0.5"
                  style={{ color: hex }}
                >
                  Open →
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
