"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  ShoppingCart,
  Stethoscope,
  Scale,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";

const STEPS = 5;

/** EHB_UIUX_DESIGN_PLAN Part 5 — 5-step registration flow (demo, no backend). */
export function OnboardingWizard() {
  const [step, setStep] = useState(1);

  const progress = Math.round((step / STEPS) * 100);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="border-b border-white/10 bg-[#0d1017]/90 backdrop-blur-md">
        <div className="container-ehb py-4 flex items-center justify-between gap-3">
          <Link href="/" className="text-sm text-ehb-textMuted hover:text-white transition-colors">
            ← Back to home
          </Link>
          <span className="text-ui-caption text-ehb-textMuted">
            Step {step} of {STEPS}
          </span>
        </div>
        <div className="container-ehb pb-4">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#29ABE2] to-[#22B14C] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 container-ehb py-8 md:py-12 max-w-xl mx-auto w-full">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-ui-h2 text-white font-bold">Welcome to EHB! 👋</h1>
            <p className="text-ehb-textBody">What would you like to do on EHB?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RoleCard
                icon={ShoppingCart}
                title="Shopping"
                subtitle="Buy or sell on GoSellr GSM"
                onPick={() => setStep(2)}
              />
              <RoleCard
                icon={Briefcase}
                title="Jobs & skills"
                subtitle="Find work or hire (EHB-JPS)"
                onPick={() => setStep(2)}
              />
              <RoleCard
                icon={Building2}
                title="Franchise"
                subtitle="Open or manage a franchise"
                onPick={() => setStep(2)}
              />
              <RoleCard
                icon={Stethoscope}
                title="Health"
                subtitle="Verified health services"
                onPick={() => setStep(2)}
              />
              <RoleCard
                icon={Scale}
                title="Law"
                subtitle="Legal & OLS routes"
                onPick={() => setStep(2)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-xl font-semibold text-white">Basic info</h2>
            <p className="text-ehb-textBody text-sm">
              Demo only — no data is saved. Fields match the UIUX plan structure.
            </p>
            <div className="space-y-3">
              <label className="block">
                <span className="text-ui-caption text-ehb-textMuted">Full name</span>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#252D40] px-3 py-2.5 text-sm text-white placeholder:text-ehb-textMuted focus:border-[#29ABE2]/50 focus:outline-none focus:ring-1 focus:ring-[#29ABE2]/40"
                  placeholder="Your name"
                  readOnly
                />
              </label>
              <label className="block">
                <span className="text-ui-caption text-ehb-textMuted">Phone</span>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#252D40] px-3 py-2.5 text-sm"
                  placeholder="+92 …"
                  readOnly
                />
              </label>
            </div>
            <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center gap-2 text-[#29ABE2]">
              <ShieldCheck className="h-6 w-6" />
              <h2 className="text-xl font-semibold text-white">EHB-PSS (Proof & Security System)</h2>
            </div>
            <p className="text-ehb-textBody text-sm">
              Upload CNIC or passport — encrypted demo zone (no file upload in this preview).
            </p>
            <div className="rounded-2xl border border-dashed border-[#29ABE2]/40 bg-[#181E2E]/80 px-6 py-12 text-center text-ehb-textMuted text-sm">
              Drag & drop or click to upload (demo)
            </div>
            <ul className="text-sm text-ehb-textBody space-y-2">
              <li>✔ Keeps your account safer</li>
              <li>✔ Unlocks higher EHB-STL-LEVEL</li>
              <li>✔ Others trust you more</li>
            </ul>
            <StepNav onBack={() => setStep(2)} onNext={() => setStep(4)} nextLabel="Verify & Continue" />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center animate-fade-in">
            <Sparkles className="h-10 w-10 mx-auto text-[#F59E0B]" />
            <h2 className="text-xl font-semibold text-white">Your first trust score</h2>
            <p className="text-ehb-textBody text-sm max-w-md mx-auto">
              Animated counter is a demo; real scores come from the STL engine after verification.
            </p>
            <div className="rounded-2xl glass-card border border-[#F7941D]/30 p-8 max-w-sm mx-auto">
              <p className="text-ui-caption text-ehb-textMuted mb-2">EHB-STL-LEVEL (Service Trust Level)</p>
              <p className="font-mono text-4xl font-bold text-white tabular-nums">30</p>
              <p className="text-sm text-[#F7941D] font-semibold mt-2">BASIC VERIFIED</p>
              <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-[#F7941D] to-[#29ABE2]" />
              </div>
            </div>
            <StepNav onBack={() => setStep(3)} onNext={() => setStep(5)} nextLabel="Continue" />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 text-center animate-fade-in">
            <h2 className="text-xl font-semibold text-white">You&apos;re ready 🚀</h2>
            <p className="text-ehb-textBody text-sm">
              Suggested next steps — same structure as the UIUX plan dashboard cards.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/gosellr"
                className="rounded-xl border border-white/10 bg-[#181E2E] p-4 hover:border-[#29ABE2]/40 transition-colors"
              >
                <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-[#22B14C]" />
                <span className="text-sm font-medium text-white">GoSellr</span>
              </Link>
              <Link
                href="/jobs"
                className="rounded-xl border border-white/10 bg-[#181E2E] p-4 hover:border-[#29ABE2]/40 transition-colors"
              >
                <Briefcase className="h-6 w-6 mx-auto mb-2 text-[#29ABE2]" />
                <span className="text-sm font-medium text-white">Jobs</span>
              </Link>
              <Link
                href="/verification"
                className="rounded-xl border border-white/10 bg-[#181E2E] p-4 hover:border-[#29ABE2]/40 transition-colors"
              >
                <ShieldCheck className="h-6 w-6 mx-auto mb-2 text-[#7C3AED]" />
                <span className="text-sm font-medium text-white">Verify</span>
              </Link>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex min-h-touch items-center justify-center rounded-full bg-gradient-to-r from-[#29ABE2] to-[#22B14C] px-8 py-3 text-sm font-semibold text-white"
            >
              Go to dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleCard(props: {
  icon: typeof ShoppingCart;
  title: string;
  subtitle: string;
  onPick: () => void;
}) {
  const Icon = props.icon;
  return (
    <button
      type="button"
      onClick={props.onPick}
      className="flex flex-col items-start gap-2 rounded-2xl border border-white/10 bg-[#181E2E] p-4 text-left hover:border-[#29ABE2]/40 hover:bg-[#1E2638] transition-all card-interactive"
    >
      <Icon className="h-6 w-6 text-[#29ABE2]" />
      <span className="font-semibold text-white">{props.title}</span>
      <span className="text-xs text-ehb-textMuted">{props.subtitle}</span>
    </button>
  );
}

function StepNav(props: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="flex justify-between gap-3 pt-4">
      <button
        type="button"
        onClick={props.onBack}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-ehb-textBody hover:bg-white/5"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <button
        type="button"
        onClick={props.onNext}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#29ABE2] to-[#22B14C] px-5 py-2 text-sm font-semibold text-white"
      >
        {props.nextLabel ?? "Continue"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
