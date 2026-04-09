"use client";

import { useState } from "react";
import Link from "next/link";
import AIInsightCard from "@/components/AIInsightCard";
import { INDUSTRIES } from "@/lib/industry/config";

// ════════════════════════════════════════════════════════════════
//  EHB HOME PAGE — Microsoft Store Style Layout + All EHB Data
//  Data: .cursor/rules/*.md files | Updated: April 2026
// ════════════════════════════════════════════════════════════════

// ─── STATS ──────────────────────────────────────────────────────
const PLATFORM_STATS = [
  { icon: "🏭", val: "32", label: "Industries" },
  { icon: "🌍", val: "50+", label: "Countries" },
  { icon: "👥", val: "1M+", label: "Users Target" },
  { icon: "🤖", val: "100+", label: "AI Modules" },
  { icon: "💰", val: "$500M+", label: "Economy Goal" },
  { icon: "🛡️", val: "8", label: "STL Levels" },
];

// ─── INDUSTRY CHIPS ─────────────────────────────────────────────
const INDUSTRY_CHIPS = [
  { emoji: "🏥", slug: "health", name: "Health" },
  { emoji: "🎓", slug: "education", name: "Education" },
  { emoji: "💼", slug: "consulting", name: "Consulting" },
  { emoji: "🏗️", slug: "construction", name: "Construction" },
  { emoji: "🌾", slug: "agriculture", name: "Agriculture" },
  { emoji: "🚗", slug: "automotive", name: "Automotive" },
  { emoji: "✈️", slug: "travel", name: "Travel" },
  { emoji: "🍔", slug: "hospitality", name: "Hospitality" },
  { emoji: "🏦", slug: "finance", name: "Finance" },
  { emoji: "⚖️", slug: "law", name: "Law" },
  { emoji: "🏡", slug: "real-estate", name: "Real Estate" },
  { emoji: "🎭", slug: "entertainment", name: "Entertainment" },
];

// ─── PLATFORM FEATURES ──────────────────────────────────────────
const PLATFORM_FEATURES = [
  { icon: "🤖", title: "AI Marketplace", desc: "AI-powered service matching across 32 industries globally.", color: "blue" },
  { icon: "🔗", title: "Blockchain Trust", desc: "Polkadot blockchain for tamper-proof verification records.", color: "purple" },
  { icon: "🌐", title: "700+ Services", desc: "Hundreds of verified services in one unified super app.", color: "emerald" },
  { icon: "🏪", title: "Franchise Model", desc: "Sub, Master & Corporate franchise with revenue sharing.", color: "orange" },
  { icon: "📍", title: "Nearby Matching", desc: "Geo-intelligent provider matching in your local area.", color: "cyan" },
  { icon: "💳", title: "EHB Wallet", desc: "Integrated secure wallet for all platform transactions.", color: "yellow" },
];

// ─── USER BENEFITS ───────────────────────────────────────────────
const USER_BENEFITS = [
  { icon: "🔍", title: "Find Verified Providers", desc: "Access PSS/CRB certified service providers near you instantly." },
  { icon: "💼", title: "Get Hired via JPS", desc: "AI-powered job matching with employers across all industries." },
  { icon: "⬆️", title: "Build Your STL Level", desc: "Earn trust points and unlock higher earnings and priority access." },
  { icon: "🏪", title: "Open Your Own Store", desc: "Launch a GoSellr store and sell products/services globally." },
  { icon: "💸", title: "Earn via Affiliate", desc: "Refer others and earn multi-level commission on every referral." },
  { icon: "🛡️", title: "Blockchain Certificate", desc: "Get a permanent tamper-proof certificate stored on Polkadot." },
  { icon: "🌍", title: "Go Global", desc: "Sell or find services in 50+ countries with currency support." },
  { icon: "🏢", title: "Buy a Franchise", desc: "Own your city/region franchise and earn from entire network." },
];

// ─── CORE DEPARTMENTS (6) ───────────────────────────────────────
const CORE_DEPTS = [
  {
    code: "PSS",
    name: "Proof & Security System",
    desc: "KYC/KYB, liveness detection, AML screening, fraud detection, and identity verification engine.",
    icon: "🛡️",
    color: "blue",
    sub: "AI Online Verification",
  },
  {
    code: "CRB",
    name: "Certification & Registry Board",
    desc: "Physical office verification, professional certification, product/service authentication board.",
    icon: "📋",
    color: "purple",
    sub: "Physical Certification",
  },
  {
    code: "DMO",
    name: "Decentralized Management Office",
    desc: "Central governance authority — manages all 8 modules, workflow engine, approvals, operational management, service monitoring, L8 SUPREME approval, and policy enforcement.",
    icon: "🏢",
    color: "emerald",
    sub: "Central Governance & Operations",
  },
  {
    code: "JPS",
    name: "Job Profile & Skill",
    desc: "AI-powered job/skill matching, professional profiles, employer-employee connection engine.",
    icon: "💼",
    color: "orange",
    sub: "Employment Engine",
  },
  {
    code: "EDR",
    name: "Enforcement & Document Review",
    desc: "Document authenticity review, compliance enforcement, legal verification operations.",
    icon: "📁",
    color: "cyan",
    sub: "Compliance System",
  },
];

const DEPT_COLOR: Record<string, string> = {
  blue: "border-blue-500/30 bg-blue-500/8 hover:border-blue-400/50 hover:shadow-blue-500/10",
  purple: "border-purple-500/30 bg-purple-500/8 hover:border-purple-400/50 hover:shadow-purple-500/10",
  emerald: "border-emerald-500/30 bg-emerald-500/8 hover:border-emerald-400/50 hover:shadow-emerald-500/10",
  orange: "border-orange-500/30 bg-orange-500/8 hover:border-orange-400/50 hover:shadow-orange-500/10",
  cyan: "border-cyan-500/30 bg-cyan-500/8 hover:border-cyan-400/50 hover:shadow-cyan-500/10",
  yellow: "border-yellow-500/30 bg-yellow-500/8 hover:border-yellow-400/50 hover:shadow-yellow-500/10",
};
const DEPT_BADGE: Record<string, string> = {
  blue: "text-blue-300 bg-blue-500/15 border-blue-500/30",
  purple: "text-purple-300 bg-purple-500/15 border-purple-500/30",
  emerald: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
  orange: "text-orange-300 bg-orange-500/15 border-orange-500/30",
  cyan: "text-cyan-300 bg-cyan-500/15 border-cyan-500/30",
  yellow: "text-yellow-300 bg-yellow-500/15 border-yellow-500/30",
};
const DEPT_ICON: Record<string, string> = {
  blue: "bg-blue-500/20 text-blue-300",
  purple: "bg-purple-500/20 text-purple-300",
  emerald: "bg-emerald-500/20 text-emerald-300",
  orange: "bg-orange-500/20 text-orange-300",
  cyan: "bg-cyan-500/20 text-cyan-300",
  yellow: "bg-yellow-500/20 text-yellow-300",
};
const FEAT_COLOR: Record<string, string> = DEPT_COLOR;
const FEAT_ICON: Record<string, string> = DEPT_ICON;

// ─── PSS FEATURES ───────────────────────────────────────────────
const PSS_FEATURES = [
  { icon: "🪪", title: "Identity Verification", desc: "CNIC/Passport AI verification with document authenticity check" },
  { icon: "👁️", title: "Liveness Detection", desc: "Anti-spoofing & deepfake prevention using real-time face scan" },
  { icon: "🏦", title: "AML Screening", desc: "Sanctions lists, PEP checks, and global watchlist screening" },
  { icon: "📍", title: "Address Verification", desc: "Confirm physical address and geo-location of user/business" },
  { icon: "📊", title: "Ongoing Risk Monitoring", desc: "Continuous behavior & transaction anomaly detection engine" },
  { icon: "🏢", title: "KYB — Business Verify", desc: "Company identity, ownership, and registration verification" },
];

// ─── CRB BENEFITS ───────────────────────────────────────────────
const CRB_BENEFITS = [
  { icon: "🏆", title: "Professional Certificate", desc: "Official certificate for doctors, engineers, lawyers, and more" },
  { icon: "🔗", title: "Blockchain Hash", desc: "Every certificate gets a Polkadot on-chain hash — unalterable" },
  { icon: "⭐", title: "STL Boost +15", desc: "CRB certification boosts your Service Trust Level significantly" },
  { icon: "🌍", title: "Cross-Border Valid", desc: "CRB certificate recognized across all 50+ EHB countries" },
  { icon: "🔄", title: "6-Month Renewal", desc: "Regular re-verification ensures only active, trusted providers" },
  { icon: "📋", title: "Product/Service Auth", desc: "Authenticate products and services for quality assurance" },
];

// ─── DMO BENEFITS ───────────────────────────────────────────────
const DMO_BENEFITS = [
  { icon: "🏛️", title: "Central Governance", desc: "DMO manages all 8 EHB modules — PSS, CRB, STL, Wallet, JPS, Registry, Blockchain, Workflow" },
  { icon: "👑", title: "L8 SUPREME Authority", desc: "Only DMO can manually approve L8 SUPREME trust level users" },
  { icon: "🔄", title: "8-Step User Flow", desc: "Registration → JPS → STL → PSS → CRB → DMO → Score → Active" },
  { icon: "💰", title: "Revenue Distribution", desc: "DMO oversees the 40/25/20/15 franchise revenue split mechanism" },
  { icon: "📜", title: "Policy Enforcement", desc: "DMO enforces compliance and can suspend/restore any service" },
  { icon: "🌐", title: "Global Registry", desc: "Maintains the master registry of all certified users and services" },
];

// ─── EHB-STL LEVELS (8) ─────────────────────────────────────────
const STL_LEVELS = [
  { level: "L1", name: "FREE", score: "0–20", price: "$0", color: "border-white/10 bg-white/3", badge: "text-white/50", badgeBg: "bg-white/5 border-white/10", btn: "border border-white/20 text-white/60", glow: "" },
  { level: "L2", name: "BASIC", score: "21–40", price: "$5", color: "border-sky-500/30 bg-sky-500/5", badge: "text-sky-300", badgeBg: "bg-sky-500/10 border-sky-500/30", btn: "bg-sky-500/20 border border-sky-400/40 text-sky-200", glow: "hover:shadow-sky-500/15" },
  { level: "L3", name: "NORMAL", score: "41–55", price: "$10", color: "border-blue-500/30 bg-blue-500/5", badge: "text-blue-300", badgeBg: "bg-blue-500/10 border-blue-500/30", btn: "bg-blue-500/20 border border-blue-400/40 text-blue-200", glow: "hover:shadow-blue-500/15" },
  { level: "L4", name: "STANDARD", score: "56–65", price: "$25", color: "border-emerald-500/30 bg-emerald-500/5", badge: "text-emerald-300", badgeBg: "bg-emerald-500/10 border-emerald-500/30", btn: "bg-emerald-500/20 border border-emerald-400/40 text-emerald-200", glow: "hover:shadow-emerald-500/15" },
  { level: "L5", name: "ADVANCED", score: "66–75", price: "$50", color: "border-violet-500/30 bg-violet-500/5", badge: "text-violet-300", badgeBg: "bg-violet-500/10 border-violet-500/30", btn: "bg-violet-500/20 border border-violet-400/40 text-violet-200", glow: "hover:shadow-violet-500/15" },
  { level: "L6", name: "HIGH", score: "76–85", price: "$100", color: "border-orange-500/30 bg-orange-500/5", badge: "text-orange-300", badgeBg: "bg-orange-500/10 border-orange-500/30", btn: "bg-orange-500/20 border border-orange-400/40 text-orange-200", glow: "hover:shadow-orange-500/15" },
  { level: "L7", name: "VIP", score: "86–95", price: "$250", color: "border-yellow-500/30 bg-yellow-500/5", badge: "text-yellow-300", badgeBg: "bg-yellow-500/10 border-yellow-500/30", btn: "bg-yellow-500/20 border border-yellow-400/40 text-yellow-200", glow: "hover:shadow-yellow-500/15" },
  { level: "L8", name: "SUPREME 👑", score: "96–100", price: "$500+", color: "border-rose-500/40 bg-gradient-to-br from-rose-500/10 to-yellow-500/5", badge: "text-rose-300", badgeBg: "bg-rose-500/15 border-rose-500/40", btn: "bg-gradient-to-r from-rose-500/30 to-yellow-500/20 border border-rose-400/40 text-rose-200", glow: "hover:shadow-rose-500/20" },
];

// ─── FRANCHISE PLANS ─────────────────────────────────────────────
const FRANCHISE_PLANS = [
  {
    emoji: "🏙️", name: "Sub Franchise", level: "City Level",
    investment: "$20K – $50K",
    revenue: "15%",
    features: ["Local territory rights", "Network onboarding", "Training & support", "Revenue from co-franchises"],
    color: "border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5",
    btn: "bg-blue-500 hover:bg-blue-400 text-white",
    badge: "text-blue-300 bg-blue-500/10 border-blue-500/30",
  },
  {
    emoji: "🏢", name: "Master Franchise", level: "Regional Level",
    investment: "$100K – $250K",
    revenue: "20%",
    features: ["Regional rights", "Manage sub-franchises", "Full training program", "Exclusive benefits"],
    color: "border-emerald-500/40 bg-gradient-to-br from-emerald-500/15 to-emerald-600/5",
    btn: "bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30",
    badge: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    highlight: true,
  },
  {
    emoji: "🌏", name: "Corporate Franchise", level: "National Level",
    investment: "$500K – $1M",
    revenue: "25%",
    features: ["Country-wide rights", "Full autonomy", "Profit shares", "Board of directors seat"],
    color: "border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5",
    btn: "bg-purple-500 hover:bg-purple-400 text-white",
    badge: "text-purple-300 bg-purple-500/10 border-purple-500/30",
  },
];

const FRANCHISE_BUYER_BENEFITS = [
  { icon: "💰", text: "Revenue sharing from entire territory network (15–25%)" },
  { icon: "🌍", text: "Exclusive territory rights (city / region / country)" },
  { icon: "📚", text: "Complete training program and operational playbook" },
  { icon: "🤖", text: "Access to EHB AI tools and management dashboard" },
  { icon: "🏪", text: "Revenue from every service sold inside your territory" },
  { icon: "📈", text: "Sub-franchise co-franchise revenue on your network" },
  { icon: "🛡️", text: "Backed by PSS, CRB, DMO governance infrastructure" },
  { icon: "🔗", text: "Blockchain-recorded franchise ownership certificate" },
];

// ─── GOSELLR ─────────────────────────────────────────────────────
const GOSELLR_FEATURES = [
  { icon: "🤖", text: "AI product recommendations" },
  { icon: "📦", text: "Smart inventory management" },
  { icon: "🌐", text: "Multi-channel selling" },
  { icon: "📊", text: "Advanced analytics & reports" },
  { icon: "🔒", text: "Secure EHB Wallet payment" },
  { icon: "📱", text: "Mobile-first responsive design" },
];

const SELLER_TYPES = [
  { icon: "👤", name: "Basic Seller", desc: "Individual service or product listing", badge: "L1–L3" },
  { icon: "✅", name: "Verified Seller", desc: "PSS verified — higher ranking & trust", badge: "L4–L5" },
  { icon: "⭐", name: "Premium Seller", desc: "CRB certified — top search priority", badge: "L6–L7" },
  { icon: "👑", name: "GoSellr Pro", desc: "DMO approved — maximum earning access", badge: "L8" },
];

// ─── BLOCKCHAIN & EHBGC ──────────────────────────────────────────
const BLOCKCHAIN_FEATURES = [
  { icon: "🔗", title: "Polkadot Blockchain", desc: "All trust records, certificates, STL updates stored on Polkadot chain" },
  { icon: "📜", title: "Smart Contracts", desc: "5 contracts: Verification, Certificate, License, STL Score, Escrow" },
  { icon: "🔒", title: "IPFS Document Storage", desc: "Documents stored encrypted on IPFS — only hash goes on-chain" },
  { icon: "🌐", title: "Cross-Chain Bridge", desc: "Polkadot XCM bridge for cross-chain interoperability" },
];

const EHBGC_UTILITIES = [
  { icon: "💳", title: "Pay for Services", desc: "Use EHBGC to pay for any service on the platform" },
  { icon: "🏦", title: "Verification Fees", desc: "Pay STL upgrade and verification costs with EHBGC" },
  { icon: "📊", title: "Staking Rewards", desc: "Stake 100→2000 EHBGC for +5% to +30% STL boost" },
  { icon: "🗳️", title: "Governance Voting", desc: "Token holders vote on platform policies and upgrades" },
  { icon: "🎁", title: "Referral Rewards", desc: "Earn EHBGC tokens for referrals and platform activity" },
  { icon: "💰", title: "Franchise Payments", desc: "Franchise fees and revenue distribution via EHBGC" },
];

const TOKEN_ALLOCATION = [
  { label: "Ecosystem", pct: "30%", color: "bg-emerald-500" },
  { label: "Investors", pct: "20%", color: "bg-blue-500" },
  { label: "Reserve", pct: "20%", color: "bg-purple-500" },
  { label: "Team", pct: "15%", color: "bg-orange-500" },
  { label: "Community", pct: "15%", color: "bg-cyan-500" },
];

// ─── AFFILIATE PROGRAM ───────────────────────────────────────────
const AFFILIATE_STEPS = [
  { step: "01", icon: "🔗", title: "Get Your Link", desc: "Sign up and get a unique referral link from your dashboard" },
  { step: "02", icon: "📤", title: "Share & Invite", desc: "Share with friends, businesses, or post on social media" },
  { step: "03", icon: "👥", title: "They Join EHB", desc: "Your referral joins EHB and completes their profile" },
  { step: "04", icon: "💰", title: "You Earn Commission", desc: "Earn EHBGC tokens + cash on every transaction they make" },
];

const AFFILIATE_BENEFITS = [
  { icon: "💰", text: "Commission on every referral's transaction forever" },
  { icon: "📊", text: "Multi-level referral tracking — earn from your network" },
  { icon: "🔗", text: "All referral records stored transparently on blockchain" },
  { icon: "📱", text: "Real-time dashboard with click, join, and earning stats" },
  { icon: "🎁", text: "Bonus EHBGC tokens for hitting referral milestones" },
  { icon: "🌍", text: "Works globally — refer from any country" },
];

// ─── DATA SECURITY ───────────────────────────────────────────────
const SECURITY_FEATURES = [
  { icon: "🔗", title: "On-Chain Records", desc: "L6+ user records automatically stored on Polkadot blockchain" },
  { icon: "🔐", title: "End-to-End Encryption", desc: "All documents and data encrypted with AES-256 before storage" },
  { icon: "🧊", title: "IPFS Decentralized", desc: "Files stored on IPFS — no single point of failure or control" },
  { icon: "🔍", title: "Audit Trail", desc: "Every action logged immutably — full tamper-proof audit history" },
  { icon: "🤖", title: "AI Fraud Detection", desc: "Real-time fraud, anomaly, and suspicious activity detection" },
  { icon: "🛡️", title: "Zero-Trust Architecture", desc: "Every request verified at every layer — no implicit trust" },
];

// ─── ROADMAP ─────────────────────────────────────────────────────
const ROADMAP = [
  { year: "2024", title: "Platform Launch", desc: "DMO core, PSS, JPS, EHB Wallet", status: "done", color: "bg-emerald-500", card: "border-emerald-500/30 bg-emerald-500/8", label: "text-emerald-400" },
  { year: "2025", title: "AI & Global Expansion", desc: "GoSellr, AI matching, 50+ countries", status: "done", color: "bg-emerald-500", card: "border-emerald-500/30 bg-emerald-500/8", label: "text-emerald-400" },
  { year: "2026", title: "Blockchain Verification", desc: "Polkadot, CRB on-chain certificates", status: "active", color: "bg-blue-500", card: "border-blue-500/40 bg-blue-500/10", label: "text-blue-400" },
  { year: "2027", title: "Franchise Network", desc: "Global Sub/Master/Corporate expansion", status: "pending", color: "bg-white/20", card: "border-white/8 bg-white/3", label: "text-white/35" },
  { year: "2028", title: "Market Leadership", desc: "AI leadership, DAO governance, maturity", status: "pending", color: "bg-white/20", card: "border-white/8 bg-white/3", label: "text-white/35" },
];

// ─── HELPER: Section Header (MS Store style) ────────────────────
function SH({
  icon, title, sub, href, light,
}: {
  icon: string; title: string; sub?: string; href?: string; light?: boolean;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <div className={`mb-1 text-xs font-bold uppercase tracking-widest ${light ? "text-white/35" : "text-emerald-400"}`}>
          {icon} {sub ?? "EHB Platform"}
        </div>
        <h2 className="text-2xl font-black text-white md:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
          View All <span className="text-lg">›</span>
        </Link>
      )}
    </div>
  );
}

// ─── CARD SHELL ─────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${className}`}>
      {children}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("voice");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#05050f] text-white">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#061910_0%,#070e1c_100%)]" />
        <div className="pointer-events-none absolute -left-48 -top-48 h-[500px] w-[500px] rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-blue-500/6 blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4">
          {/* Top nav */}
          <div className="pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-4 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-black text-white">E</div>
                <span className="text-[11px] font-black tracking-widest text-emerald-200">EHB TECHNOLOGIES</span>
                <span className="hidden rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-300 sm:inline-flex">● LIVE</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                <Link href="/home" className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 font-semibold text-emerald-200">Home</Link>
                <Link href="/marketplace" className="rounded-full border border-white/10 px-3 py-1 text-white/55 hover:text-white hover:border-white/25 transition-colors">Marketplace</Link>
                <Link href="/gosellr" className="hidden rounded-full border border-white/10 px-3 py-1 text-white/55 hover:text-white hover:border-white/25 transition-colors sm:inline-block">GoSellr</Link>
                <Link href="/franchise" className="hidden rounded-full border border-white/10 px-3 py-1 text-white/55 hover:text-white hover:border-white/25 transition-colors md:inline-block">Franchise</Link>
                <Link href="/agts" className="hidden rounded-full border border-white/10 px-3 py-1 text-white/55 hover:text-white hover:border-white/25 transition-colors lg:inline-block">Find Jobs</Link>
              </div>
            </div>
          </div>

          {/* Industry chips */}
          <div className="py-3">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {INDUSTRY_CHIPS.map((chip) => {
                const meta = INDUSTRIES.find((i) => i.slug === chip.slug);
                return (
                  <Link key={chip.slug} href={`/landing/${chip.slug}`}
                    className="rounded-full border border-emerald-500/15 bg-emerald-950/40 px-2.5 py-1 text-[10px] font-medium text-emerald-300/70 transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-200">
                    {chip.emoji} {meta?.shortName ?? chip.name}
                  </Link>
                );
              })}
              <Link href="/industries" className="rounded-full border border-white/10 bg-white/4 px-2.5 py-1 text-[10px] text-white/40 hover:text-white transition-colors">
                +20 More →
              </Link>
            </div>
          </div>

          {/* Hero 2-col */}
          <div className="flex flex-col items-center gap-12 pb-16 pt-8 lg:flex-row lg:justify-between">
            <div className="max-w-2xl flex-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-semibold text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                World&apos;s First Verified Global Service Ecosystem
              </div>
              <h1 className="mb-5 text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block bg-gradient-to-r from-white to-white/75 bg-clip-text text-transparent">EHB AI</span>
                <span className="block bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">Marketplace</span>
                <span className="block text-2xl font-bold text-white/50 sm:text-3xl md:text-4xl">Education • Health • Business</span>
              </h1>
              <p className="mb-6 max-w-lg text-sm leading-relaxed text-white/55 md:text-base">
                EHB Technologies is a Blockchain-based global AI marketplace connecting verified service providers with users across 32 industries and 50+ countries — powered by PSS, CRB, DMO, and Polkadot blockchain.
              </p>
              <div className="mb-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  "Find PSS/CRB verified service providers",
                  "Get hired via AI-powered JPS matching",
                  "Build STL level and unlock earnings",
                  "Launch GoSellr store or buy a Franchise",
                ].map((pt) => (
                  <div key={pt} className="flex items-center gap-2.5 text-sm text-white/60">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-400">✓</span>
                    {pt}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/marketplace" className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:-translate-y-0.5">
                  🚀 Explore Marketplace
                </Link>
                <Link href="/franchise" className="rounded-xl border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:-translate-y-0.5">
                  🏪 Buy Franchise
                </Link>
                <Link href="/agts" className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 px-7 py-3.5 text-sm font-bold text-emerald-300 transition-all hover:bg-emerald-500/15 hover:-translate-y-0.5">
                  💼 Find Jobs
                </Link>
              </div>
            </div>

            {/* Right visual */}
            <div className="flex-shrink-0">
              <div className="relative h-72 w-80 overflow-hidden rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-emerald-950/80 to-[#08122a]/80 shadow-2xl shadow-emerald-900/40 backdrop-blur-sm md:h-96 md:w-[420px]">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/12 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-500/15 text-5xl shadow-lg">🌐</div>
                  <div>
                    <div className="text-lg font-black text-white">EHB Super App</div>
                    <div className="text-xs text-white/35">AI • Blockchain • Franchise</div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-[9px] font-semibold text-emerald-300">✅ Blockchain</span>
                    <span className="rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-1 text-[9px] font-semibold text-blue-300">🤖 AI Powered</span>
                    <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-2.5 py-1 text-[9px] font-semibold text-purple-300">🌍 50+ Countries</span>
                  </div>
                  <div className="grid w-full grid-cols-3 gap-1.5">
                    {[
                      { n: "GoSellr", i: "🛒" }, { n: "DMO", i: "🏢" }, { n: "JPS", i: "💼" },
                      { n: "PSS", i: "🛡️" }, { n: "CRB", i: "📋" }, { n: "EHBGC", i: "🔗" },
                    ].map((s) => (
                      <div key={s.n} className="rounded-xl border border-white/8 bg-white/5 py-2 text-center text-[9px] text-white/45">
                        <div className="text-sm">{s.i}</div>{s.n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="pb-12 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {PLATFORM_STATS.map((s) => (
              <div key={s.label} className="group rounded-2xl border border-emerald-500/15 bg-emerald-950/30 px-2 py-4 text-center transition-all hover:border-emerald-400/35 hover:bg-emerald-500/10 hover:-translate-y-0.5">
                <div className="mb-1 text-lg">{s.icon}</div>
                <div className="text-base font-black text-emerald-300 sm:text-xl">{s.val}</div>
                <div className="mt-0.5 text-[9px] uppercase tracking-widest text-white/35">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION WRAPPER for all below ══════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4">

        {/* ── INDUSTRIES ───────────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="🏭" title="All Industries" sub="32 Industries Covered" href="/industries" />
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
            {INDUSTRY_CHIPS.map((chip) => {
              const meta = INDUSTRIES.find((i) => i.slug === chip.slug);
              return (
                <Link key={chip.slug} href={`/landing/${chip.slug}`}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/8 bg-white/4 py-3.5 text-center transition-all hover:border-emerald-400/40 hover:bg-emerald-500/8 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/10">
                  <span className="text-2xl">{chip.emoji}</span>
                  <span className="text-[9px] font-semibold text-white/55">{meta?.shortName ?? chip.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── PLATFORM FEATURES ────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="✨" title="Why EHB is Unique" sub="Platform Advantages" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORM_FEATURES.map((f) => (
              <Card key={f.title} className={`${FEAT_COLOR[f.color]} hover:shadow-lg`}>
                <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${FEAT_ICON[f.color]}`}>{f.icon}</div>
                <h3 className="mb-1.5 text-base font-black text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{f.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── USER BENEFITS ────────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="👤" title="User Benefits" sub="What You Get on EHB" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {USER_BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-3 rounded-2xl border border-white/8 bg-white/4 p-4 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:-translate-y-0.5">
                <span className="text-2xl flex-shrink-0">{b.icon}</span>
                <div>
                  <div className="mb-0.5 text-sm font-black text-white">{b.title}</div>
                  <div className="text-xs leading-relaxed text-white/45">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CORE DEPARTMENTS ─────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="🏛️" title="Core Departments" sub="EHB Infrastructure" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_DEPTS.map((d) => (
              <Card key={d.code} className={`${DEPT_COLOR[d.color]} hover:shadow-lg`}>
                <div className="mb-3 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${DEPT_ICON[d.color]}`}>{d.icon}</div>
                  <div>
                    <div className={`mb-0.5 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black tracking-widest ${DEPT_BADGE[d.color]}`}>{d.code}</div>
                    <div className="text-[9px] text-white/35">{d.sub}</div>
                  </div>
                </div>
                <h3 className="mb-1.5 text-sm font-black text-white">{d.name}</h3>
                <p className="text-xs leading-relaxed text-white/50">{d.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── PSS SECURITY ─────────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="🛡️" title="PSS — Identity Verification" sub="10 AI Security Modules" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PSS_FEATURES.map((f) => (
              <div key={f.title} className="flex gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 transition-all hover:border-blue-400/40 hover:bg-blue-500/10 hover:-translate-y-0.5">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <div className="mb-0.5 text-sm font-bold text-blue-200">{f.title}</div>
                  <div className="text-xs leading-relaxed text-white/45">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="text-xs font-bold text-blue-300 mb-2">PSS Risk Score → STL Impact</div>
            <div className="flex flex-wrap gap-2">
              {[
                { a: "ID Verified", v: "+10", c: "text-emerald-400" },
                { a: "Liveness Pass", v: "+5", c: "text-emerald-400" },
                { a: "AML Clear", v: "+10", c: "text-emerald-400" },
                { a: "Address OK", v: "+5", c: "text-emerald-400" },
                { a: "High Risk", v: "−20", c: "text-red-400" },
                { a: "Sanctions Hit", v: "−50", c: "text-red-400" },
              ].map((x) => (
                <span key={x.a} className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-[10px] text-white/55">
                  {x.a}: <span className={`font-black ${x.c}`}>{x.v}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CRB CERTIFICATION ────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="📋" title="CRB — Certification & Registry Board" sub="Physical Certification System" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CRB_BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 transition-all hover:border-purple-400/40 hover:-translate-y-0.5">
                <span className="text-2xl flex-shrink-0">{b.icon}</span>
                <div>
                  <div className="mb-0.5 text-sm font-bold text-purple-200">{b.title}</div>
                  <div className="text-xs leading-relaxed text-white/45">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {["Application →", "Document Review →", "Inspection / Test →", "Certificate + On-Chain Hash"].map((step, i) => (
              <div key={step} className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-[10px] font-black text-purple-300">{i + 1}</span>
                <span className="text-[10px] text-white/55">{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── DMO ──────────────────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="🏢" title="DMO — Decentralized Management Office" sub="Central Governance Authority" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DMO_BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-all hover:border-emerald-400/40 hover:-translate-y-0.5">
                <span className="text-2xl flex-shrink-0">{b.icon}</span>
                <div>
                  <div className="mb-0.5 text-sm font-bold text-emerald-200">{b.title}</div>
                  <div className="text-xs leading-relaxed text-white/45">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── EHB-STL ──────────────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="🏆" title="EHB-STL — Service Trust Levels" sub="8-Level AI Trust Engine" />
          {/* Progress bar */}
          <div className="mb-2 h-3 overflow-hidden rounded-full border border-white/8 bg-white/5">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-white/15 via-sky-500/50 via-blue-500/50 via-emerald-500/50 via-violet-500/50 via-orange-500/50 via-yellow-500/50 to-rose-500/70" />
          </div>
          <div className="mb-6 grid grid-cols-8 gap-1 text-center">
            {STL_LEVELS.map((l) => <div key={l.level} className={`text-[9px] font-bold ${l.badge}`}>{l.level}</div>)}
          </div>
          <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
            {STL_LEVELS.map((l) => (
              <div key={l.name} className={`group flex flex-col rounded-2xl border p-3.5 transition-all hover:scale-[1.04] hover:shadow-xl ${l.color} ${l.glow}`}>
                <div className={`mb-2 self-start rounded-full border px-2 py-0.5 text-[8px] font-black ${l.badgeBg} ${l.badge}`}>{l.level}</div>
                <div className={`mb-1 text-[10px] font-black ${l.badge}`}>{l.name}</div>
                <div className="mb-1 text-base font-black text-white leading-none">{l.price}<span className="text-[8px] text-white/30">/mo</span></div>
                <div className="mb-3 text-[8px] text-white/30">Score: {l.score}</div>
                <button type="button" className={`mt-auto w-full rounded-xl py-1.5 text-[9px] font-bold ${l.btn}`}>Apply</button>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { icon: "🤖", t: "AI Auto Score", d: "Real-time EHB-STL score calculation" },
              { icon: "🔗", t: "Blockchain Verified", d: "L6+ records on Polkadot chain" },
              { icon: "👑", t: "L8 = DMO Approval", d: "SUPREME requires manual DMO sign-off" },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
                <div className="text-2xl mb-1">{x.icon}</div>
                <div className="text-sm font-black text-white mb-0.5">{x.t}</div>
                <div className="text-xs text-white/40">{x.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FRANCHISE SYSTEM ─────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="🏪" title="EHB Franchise System" sub="3-Level Business Model" href="/franchise" />

          {/* Hierarchy visual */}
          <div className="mb-6 flex items-center justify-center gap-0 overflow-x-auto py-2">
            {[
              { label: "EHB Global HQ", bg: "bg-emerald-500", icon: "🌍" },
              { label: "Corporate", bg: "bg-purple-500", icon: "🌏" },
              { label: "Master", bg: "bg-blue-500", icon: "🏢" },
              { label: "Sub", bg: "bg-sky-500", icon: "🏙️" },
              { label: "Providers", bg: "bg-white/20", icon: "👤" },
            ].map((h, i) => (
              <div key={h.label} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${h.bg}`}>{h.icon}</div>
                  <div className="text-[8px] font-bold text-white/55 whitespace-nowrap">{h.label}</div>
                </div>
                {i < 4 && <div className="mx-1 h-px w-6 bg-white/20 flex-shrink-0 mt-[-14px]" />}
              </div>
            ))}
          </div>

          {/* 3 plan cards */}
          <div className="grid gap-5 lg:grid-cols-3">
            {FRANCHISE_PLANS.map((p) => (
              <div key={p.name} className={`relative flex flex-col overflow-hidden rounded-3xl border p-6 shadow-xl transition-all hover:-translate-y-1 ${p.color} ${p.highlight ? "ring-2 ring-emerald-500/30" : ""}`}>
                {p.highlight && <div className="absolute right-4 top-4 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-300">⭐ Popular</div>}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-2xl">{p.emoji}</div>
                  <div>
                    <div className={`mb-0.5 rounded-full border px-2 py-0.5 text-[9px] font-bold inline-block ${p.badge}`}>{p.level}</div>
                    <div className="text-lg font-black text-white">{p.name}</div>
                  </div>
                </div>
                <div className="mb-1 text-xl font-black text-white">{p.investment}</div>
                <ul className="mb-5 flex-1 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                      <span className="h-4 w-4 flex-shrink-0 rounded-full bg-emerald-500/20 text-[9px] text-emerald-400 flex items-center justify-center">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                  <span className="text-xs text-white/40">Revenue Share</span>
                  <span className="text-2xl font-black text-white">{p.revenue}</span>
                </div>
                <Link href="/franchise" className={`w-full rounded-xl py-3 text-center text-sm font-black transition-all ${p.btn}`}>Apply Now →</Link>
              </div>
            ))}
          </div>

          {/* Franchise buyer benefits */}
          <div className="mt-6 rounded-3xl border border-white/8 bg-white/3 p-5">
            <div className="mb-4 text-sm font-black text-white">🎯 Why Buy an EHB Franchise?</div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {FRANCHISE_BUYER_BENEFITS.map((b) => (
                <div key={b.text} className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">{b.icon}</span>
                  <span className="text-xs leading-relaxed text-white/55">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GOSELLR ──────────────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="🛒" title="GoSellr — Smart E-Commerce" sub="AI-Powered Online Store" href="/gosellr" />
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Features */}
            <div>
              <div className="mb-4 grid gap-2 sm:grid-cols-2">
                {GOSELLR_FEATURES.map((f) => (
                  <div key={f.text} className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/4 px-3 py-2.5">
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-sm text-white/60">{f.text}</span>
                  </div>
                ))}
              </div>
              {/* Seller types */}
              <div className="space-y-2">
                {SELLER_TYPES.map((s) => (
                  <div key={s.name} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 p-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{s.name}</div>
                      <div className="text-xs text-white/40">{s.desc}</div>
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[9px] font-bold text-white/50">{s.badge}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Mock browser */}
            <div className="overflow-hidden rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-[#061820] to-[#08142a] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/6 bg-white/4 px-4 py-3">
                <div className="flex gap-1.5"><div className="h-3 w-3 rounded-full bg-red-500/70" /><div className="h-3 w-3 rounded-full bg-yellow-500/70" /><div className="h-3 w-3 rounded-full bg-emerald-500/70" /></div>
                <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-lg bg-white/6 px-3 py-1.5">
                  <span className="text-[9px] text-cyan-400">🔒</span>
                  <span className="text-[10px] text-white/30">gosellr.ehb.com</span>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-4 text-center">
                  <div className="text-2xl font-black text-cyan-300">🛒 GoSellr</div>
                  <div className="text-xs text-white/35">Connect everything. Achieve anything.</div>
                </div>
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {[{ l: "Products", v: "1.2k", i: "📦" }, { l: "Orders", v: "348", i: "✅" }, { l: "Revenue", v: "$18k", i: "💰" }].map((s) => (
                    <div key={s.l} className="rounded-xl border border-cyan-500/15 bg-cyan-500/8 py-2.5 text-center">
                      <div className="text-base">{s.i}</div>
                      <div className="text-sm font-black text-cyan-300">{s.v}</div>
                      <div className="text-[9px] text-white/35">{s.l}</div>
                    </div>
                  ))}
                </div>
                <Link href="/gosellr" className="mt-3 block w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-2.5 text-center text-sm font-black text-white">
                  Launch Your Store →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── BLOCKCHAIN & EHBGC ───────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="🔗" title="EHBGC Blockchain & Token Economy" sub="Polkadot-Based Trust System" />
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Blockchain features */}
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-white/35">Polkadot Chain Infrastructure</div>
              <div className="space-y-2.5">
                {BLOCKCHAIN_FEATURES.map((f) => (
                  <div key={f.title} className="flex gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4">
                    <span className="text-2xl flex-shrink-0">{f.icon}</span>
                    <div>
                      <div className="mb-0.5 text-sm font-bold text-purple-200">{f.title}</div>
                      <div className="text-xs text-white/45">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* On-chain records */}
              <div className="mt-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4">
                <div className="mb-2 text-xs font-bold text-purple-300">What Goes On-Chain:</div>
                <div className="flex flex-wrap gap-1.5">
                  {["STL Updates", "Certifications", "Inspections", "Licenses", "Audit Logs"].map((x) => (
                    <span key={x} className="rounded-full border border-purple-500/25 bg-purple-500/10 px-2.5 py-1 text-[10px] text-purple-300">{x}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* EHBGC Token */}
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-white/35">EHBGC Token Utilities</div>
              <div className="space-y-2">
                {EHBGC_UTILITIES.map((u) => (
                  <div key={u.title} className="flex gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3.5">
                    <span className="text-xl flex-shrink-0">{u.icon}</span>
                    <div>
                      <div className="mb-0.5 text-sm font-bold text-yellow-200">{u.title}</div>
                      <div className="text-xs text-white/45">{u.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Token allocation */}
              <div className="mt-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <div className="mb-3 text-xs font-bold text-yellow-300">Token Allocation</div>
                <div className="space-y-2">
                  {TOKEN_ALLOCATION.map((t) => (
                    <div key={t.label} className="flex items-center gap-3">
                      <div className="w-20 text-[10px] text-white/45">{t.label}</div>
                      <div className="flex-1 overflow-hidden rounded-full bg-white/8">
                        <div className={`h-2 rounded-full ${t.color}`} style={{ width: t.pct }} />
                      </div>
                      <div className="w-8 text-right text-[10px] font-black text-white/60">{t.pct}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── AFFILIATE PROGRAM ────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="👥" title="Affiliate Program" sub="Refer & Earn EHBGC" />
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Steps */}
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-white/35">How It Works</div>
              <div className="space-y-3">
                {AFFILIATE_STEPS.map((s) => (
                  <div key={s.step} className="flex gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-black text-emerald-300">{s.step}</div>
                    <div>
                      <div className="mb-0.5 flex items-center gap-2 text-sm font-bold text-white">
                        <span>{s.icon}</span> {s.title}
                      </div>
                      <div className="text-xs text-white/45">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Benefits */}
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-white/35">Affiliate Benefits</div>
              <div className="space-y-2.5">
                {AFFILIATE_BENEFITS.map((b) => (
                  <div key={b.text} className="flex items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3">
                    <span className="text-xl flex-shrink-0">{b.icon}</span>
                    <span className="text-sm text-white/60">{b.text}</span>
                  </div>
                ))}
              </div>
              <Link href="/affiliate" className="mt-4 block w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 py-3.5 text-center text-sm font-black text-white shadow-xl shadow-emerald-500/25 transition-all hover:-translate-y-0.5">
                👥 Join Affiliate Program →
              </Link>
            </div>
          </div>
        </section>

        {/* ── DATA SECURITY ON BLOCKCHAIN ──────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="🔒" title="Data Security on Blockchain" sub="Zero-Trust Architecture" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY_FEATURES.map((f) => (
              <div key={f.title} className="flex gap-3 rounded-2xl border border-slate-500/20 bg-slate-500/5 p-4 transition-all hover:border-slate-400/40 hover:-translate-y-0.5">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <div className="mb-0.5 text-sm font-bold text-slate-200">{f.title}</div>
                  <div className="text-xs leading-relaxed text-white/45">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex flex-wrap gap-6">
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-300">AES-256</div>
                <div className="text-xs text-white/40">Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-300">Polkadot</div>
                <div className="text-xs text-white/40">Blockchain</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-purple-300">IPFS</div>
                <div className="text-xs text-white/40">Decentralized</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-orange-300">Zero-Trust</div>
                <div className="text-xs text-white/40">Architecture</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ROADMAP ──────────────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <SH icon="🗺️" title="EHB Development Roadmap" sub="2024 – 2028 Vision" />
          <div className="relative flex flex-col gap-4">
            <div className="absolute left-6 top-8 hidden h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-emerald-500/50 via-blue-500/30 to-white/5 sm:block" />
            {ROADMAP.map((r) => (
              <div key={r.year} className="flex gap-5 sm:gap-8">
                <div className="relative flex-shrink-0">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#05050f] text-lg font-black shadow-lg ${r.color}`}>
                    {r.status === "done" ? "✓" : r.status === "active" ? "●" : "○"}
                  </div>
                </div>
                <div className={`flex-1 rounded-2xl border p-4 ${r.card} transition-all hover:shadow-lg`}>
                  <div className={`mb-0.5 text-[10px] font-black uppercase tracking-widest ${r.label}`}>
                    {r.status === "done" ? "✅ Completed" : r.status === "active" ? "🔵 In Progress" : "⏳ Upcoming"}
                  </div>
                  <div className="mb-0.5 text-2xl font-black text-white">{r.year}</div>
                  <div className="mb-1 text-sm font-bold text-white/90">{r.title}</div>
                  <p className="text-xs text-white/40">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI SEARCH HUB ────────────────────────────────────── */}
        <section className="py-10 border-b border-white/5">
          <div className="relative mx-auto max-w-3xl">
            <div className="pointer-events-none absolute -left-24 top-0 h-48 w-48 rounded-full bg-emerald-500/8 blur-3xl" />
            <SH icon="🔍" title="EHB AI Searching Hub" sub="Voice · Image · Video · PDF · Text" />
            <div className="relative mb-5">
              <input
                type="text"
                placeholder="Type, speak, or upload to search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 pr-16 text-sm text-white placeholder-white/25 outline-none backdrop-blur-sm focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/15"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30">🔍</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { type: "voice", icon: "🎤", label: "Voice" },
                { type: "image", icon: "🖼️", label: "Image" },
                { type: "video", icon: "🎬", label: "Video" },
                { type: "pdf", icon: "📄", label: "PDF" },
                { type: "text", icon: "📝", label: "Text" },
              ].map((s) => (
                <button key={s.type} type="button" onClick={() => setSearchType(s.type)}
                  className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${searchType === s.type ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300 shadow-lg" : "border-white/8 bg-white/4 text-white/45 hover:border-white/20"}`}>
                  <span className="text-lg">{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── LIVE AI INSIGHTS ─────────────────────────────────── */}
        <section className="py-10">
          <div className="overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#080f25] to-[#0c1535] p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-xl">🤖</div>
              <div>
                <h2 className="text-xl font-black text-white">Live AI Insights</h2>
                <p className="text-xs text-white/40">Personalized jobs, services, and marketplace suggestions</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
              </div>
            </div>
            <AIInsightCard limit={3} />
          </div>
        </section>
      </div>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer className="border-t border-white/6 bg-[#040608] px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-black text-white shadow-lg shadow-emerald-500/30">E</div>
                <div>
                  <div className="text-base font-black text-white">EHB Technologies</div>
                  <div className="text-[10px] text-white/35">Global AI Service Ecosystem</div>
                </div>
              </div>
              <p className="mb-5 text-xs leading-relaxed text-white/40">
                The world&apos;s first verified global service ecosystem powered by AI and Polkadot blockchain. Education • Health • Business united under one platform.
              </p>
              <div className="space-y-2">
                {[{ i: "✉️", t: "contact@ehb.com" }, { i: "📞", t: "+1 (555) 123-4567" }, { i: "📍", t: "Global Headquarters, USA" }].map((x) => (
                  <div key={x.t} className="flex items-center gap-2 text-xs text-white/35"><span>{x.i}</span> {x.t}</div>
                ))}
              </div>
            </div>

            {[
              { h: "Platform", links: ["Marketplace", "GoSellr", "Franchise", "Find Jobs"] },
              { h: "Systems", links: ["PSS Security", "CRB Certification", "DMO Office", "EHB-STL"] },
              { h: "Company", links: ["About Us", "Careers", "Press Kit", "Blog"] },
            ].map((col) => (
              <div key={col.h}>
                <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-white/40">{col.h}</div>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}><Link href="#" className="text-xs text-white/35 hover:text-white transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
            <div className="text-xs text-white/25">© 2026 EHB Technologies Limited. All rights reserved.</div>
            <div className="flex items-center gap-2">
              {["𝕏", "in", "fb", "yt"].map((s) => (
                <Link key={s} href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-xs text-white/35 hover:border-white/20 hover:text-white transition-all">{s}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
