/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AIInsightCard from "@/components/AIInsightCard";

const LEVELS = [
  { name: "Beginner", minPoints: 0, maxPoints: 99 },
  { name: "Active", minPoints: 100, maxPoints: 299 },
  { name: "Pro", minPoints: 300, maxPoints: 699 },
  { name: "Expert", minPoints: 700, maxPoints: 999 },
];

const WEEKLY_GOAL_USD = 100;
const TASKS_GOAL = 5;

export default function DashboardPage() {
  const [points, setPoints] = useState(160);
  const [claimedToday, setClaimedToday] = useState(false);
  const [todaysEarningsUsd, setTodaysEarningsUsd] = useState(12);

  const [weekEarningsUsd, setWeekEarningsUsd] = useState(34);
  const [tasksCompleted, setTasksCompleted] = useState(2);

  const [toast, setToast] = useState<
    null | { id: number; amountUsd: number; points: number; secondary: string }
  >(null);
  const [activity, setActivity] = useState<string[]>([
    "• Ali earned $20 this week from a verified service.",
    "• Sara completed a job in Education and got a 5★ rating.",
    "• Your service got verified successfully (PSS + DMO).",
    "• New order placed for Delivery services in your area.",
    "• Franchise opportunity: early partners are open now.",
  ]);

  const [aiStep, setAiStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setAiStep((v) => (v + 1) % 3), 6000);
    return () => window.clearInterval(id);
  }, []);

  const dailyKey = useMemo(() => {
    const d = new Date();
    return `ehb_daily_reward_claimed_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }, []);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(dailyKey);
      setClaimedToday(v === "1");
    } catch {
      // ignore
    }
  }, [dailyKey]);

  const currentLevel =
    LEVELS.find((lvl) => points >= lvl.minPoints && points <= lvl.maxPoints) ?? LEVELS[0];
  const nextLevelIndex = LEVELS.indexOf(currentLevel) + 1;
  const nextLevel = LEVELS[nextLevelIndex] ?? currentLevel;
  const pointsInLevel = points - currentLevel.minPoints;
  const levelRange = (currentLevel.maxPoints - currentLevel.minPoints) || 1;
  const progressPct = Math.min(100, Math.max(0, (pointsInLevel / levelRange) * 100));
  const pointsToNext = nextLevel.minPoints > points ? nextLevel.minPoints - points : 0;

  const weekProgressPct = Math.min(100, Math.max(0, (weekEarningsUsd / WEEKLY_GOAL_USD) * 100));
  const tasksProgressPct = Math.min(100, Math.max(0, (tasksCompleted / TASKS_GOAL) * 100));

  useEffect(() => {
    const id = window.setInterval(() => {
      setActivity((prev) => {
        const pool = [
          "• Ali earned $20 from Web Design (verified).",
          "• Sara completed a job in IT services.",
          "• Service verified successfully by EHB (PSS + DMO).",
          "• New job posted in IT: React Developer (Remote).",
          "• New order placed: delivery scheduled for tomorrow.",
          "• AI match found: best service to offer based on your profile.",
        ];
        const pick = pool[Math.floor(Math.random() * pool.length)];
        const next = [pick, ...prev].slice(0, 8);
        return next;
      });
    }, 7800);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast?.id]);

  const claimDailyReward = () => {
    if (claimedToday) return;

    const amountUsd = Math.floor(8 + Math.random() * 15); // 8..22
    const earnedPoints = Math.floor(20 + Math.random() * 60); // 20..79
    const secondaryOptions = [
      "New client received",
      "Service verified successfully",
      "Next best job matched",
      "Order queued for you",
    ];
    const secondary = secondaryOptions[Math.floor(Math.random() * secondaryOptions.length)];

    setTodaysEarningsUsd(amountUsd);
    setClaimedToday(true);
    setWeekEarningsUsd((v) => Math.min(WEEKLY_GOAL_USD, v + amountUsd));
    setTasksCompleted((v) => Math.min(TASKS_GOAL, v + 1));
    setPoints((v) => v + earnedPoints);

    setToast({
      id: Date.now(),
      amountUsd,
      points: earnedPoints,
      secondary,
    });

    setActivity((prev) => [
      `• Ali earned +$${amountUsd} from Daily Reward (verified).`,
      `• New points added: +${earnedPoints}.`,
      ...prev,
    ].slice(0, 8));

    try {
      window.localStorage.setItem(dailyKey, "1");
    } catch {
      // ignore
    }
  };

  const aiCards = useMemo(() => {
    const data = [
      {
        title: "Best job for you",
        headline: "Verified onboarding task",
        body: "3–5 tasks matched to your skills. Start small and grow confidence fast.",
        href: "/home",
        accent: "border-sky-500/40",
        cta: "View jobs",
      },
      {
        title: "Best service to offer",
        headline: "Profile setup + optimization",
        body: "Help others improve their EHB profile so they get more offers and faster hiring.",
        href: "/dashboard",
        accent: "border-emerald-500/40",
        cta: "Create service",
      },
      {
        title: "Trending in your area",
        headline: "Delivery + small business support",
        body: "High demand for delivery, small business help, and beginner-friendly tech support.",
        href: "/ai-marketplace",
        accent: "border-amber-500/40",
        cta: "Explore ideas",
      },
    ];

    // step-based rotation: shift which headline variant appears as "personal"
    const rotated = [
      data[aiStep % data.length],
      data[(aiStep + 1) % data.length],
      data[(aiStep + 2) % data.length],
    ];
    return rotated;
  }, [aiStep]);

  return (
    <main className="min-h-screen text-slate-100">
      <div className="container-ehb py-8 space-y-6">
        {/* Welcome header + today summary */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold leading-tight gradient-text">
              Welcome back, Rafi
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base">
              This is your personal control center for earnings, jobs, services, and progress on EHB.
            </p>
          </div>
          <div className="glass-panel border border-emerald-400/40 rounded-2xl px-4 py-3 text-xs md:text-sm flex flex-col gap-1 min-w-[210px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Today&apos;s earnings</span>
              <span className="font-semibold text-emerald-300">${todaysEarningsUsd}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Active goals</span>
              <span className="font-semibold text-sky-300">2</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Small, consistent actions turn into long‑term growth.
            </p>
          </div>
        </div>

        {/* Daily reward + notifications teaser */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-panel border border-amber-400/50 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-amber-300 mb-1">
                Daily Reward
              </p>
              <p className="text-sm font-semibold text-white mb-1">
                {claimedToday ? "Bonus claimed ✓ 🎁" : "Daily reward available 🎁"}
              </p>
              <p className="text-xs text-slate-400">
                Log in today and complete 1 small action to claim bonus points.
              </p>
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={claimDailyReward}
                disabled={claimedToday}
                className="min-h-touch inline-flex items-center justify-center rounded-full bg-amber-400 text-slate-900 px-4 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed hover:bg-amber-300"
              >
                {claimedToday ? "Claimed today" : "Claim bonus"}
              </button>
            </div>
          </div>
          <div className="glass-panel border border-sky-400/50 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-sky-300 mb-1">Goals</p>
              <p className="text-sm font-semibold text-white mb-1">Weekly earning goal</p>
              <p className="text-xs text-slate-400 mb-2">
                Goal: Earn ${WEEKLY_GOAL_USD} this week • Complete {TASKS_GOAL} tasks
              </p>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Earn progress</span>
                    <span className="text-sky-200 font-semibold">${weekEarningsUsd}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                      style={{ width: `${weekProgressPct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Tasks progress</span>
                    <span className="text-emerald-200 font-semibold">
                      {tasksCompleted}/{TASKS_GOAL}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-400"
                      style={{ width: `${tasksProgressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Example only – real data will come from your activity.</p>
          </div>
          <div className="glass-panel border border-violet-400/50 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-violet-300 mb-1">
                Quick Actions
              </p>
              <p className="text-sm font-semibold text-white mb-1">Start something now</p>
              <p className="text-xs text-slate-400">
                Create a service, apply for a job, or add a product to keep your account active.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 text-slate-900 px-3 py-1 font-semibold hover:bg-emerald-300 transition-colors"
              >
                Create Service
              </Link>
              <Link
                href="/home"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-3 py-1 font-semibold text-slate-100 hover:bg-white/10 transition-colors"
              >
                Apply for Jobs
              </Link>
              <Link
                href="/ai-marketplace"
                className="inline-flex items-center justify-center rounded-full border border-sky-400/60 bg-sky-500/10 px-3 py-1 font-semibold text-sky-100 hover:bg-sky-500/20 transition-colors"
              >
                Add Product
              </Link>
            </div>
          </div>
        </div>

        {/* Level / progress system */}
        <div className="glass-panel border border-white/15 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-1">
                Progress
              </p>
              <h2 className="text-lg md:text-xl font-semibold text-white">
                Level {LEVELS.indexOf(currentLevel) + 1} – {currentLevel.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {pointsToNext > 0
                  ? `Earn ${pointsToNext} more points to reach Level ${
                      LEVELS.indexOf(currentLevel) + 2
                    } – ${nextLevel.name}.`
                  : "You are at the top level in this example UI."}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Profile points (example)</p>
              <p className="text-lg font-semibold text-emerald-300">{points} pts</p>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>Next level examples: complete 3 jobs, add 1 service, and maintain 4★+ rating.</span>
            <span className="text-emerald-300 font-semibold">Main grow kar raha hoon</span>
          </div>

          <div className="mt-3 text-[11px] text-slate-500">
            Level 1 Beginner • Level 2 Active • Level 3 Pro • Level 4 Expert
          </div>
        </div>

        {/* AI recommendations (personal) */}
        <div className="glass-panel border border-white/15 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">AI recommendations</p>
              <h2 className="text-lg md:text-xl font-semibold text-white">Best next actions for your profile</h2>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400 mb-1">AI status</p>
              <p className="text-sm font-semibold text-sky-300">
                {aiStep === 0 ? "Analyzing opportunities..." : aiStep === 1 ? "Finding best match..." : "Optimizing growth..."}
              </p>
            </div>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {aiCards.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className={`rounded-2xl glass-card border p-5 transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,234,255,0.16)] ${c.accent}`}
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-2">{c.title}</p>
                <p className="text-sm font-semibold text-white mb-2">{c.headline}</p>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">{c.body}</p>
                <span className="text-[11px] font-semibold text-sky-300 hover:underline underline-offset-4">
                  {c.cta}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-5">
            <AIInsightCard limit={3} />
          </div>
        </div>

        {/* Getting started checklist – onboarding wizard (UI only) */}
        <div className="glass-panel border border-slate-500/40 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-1">
                Getting Started
              </p>
              <h2 className="text-lg md:text-xl font-semibold text-white">4 simple steps to get ready</h2>
              <p className="text-xs text-slate-400 mt-1">
                Complete these basics once. After that, EHB can send you better jobs, clients, and offers.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">Example completion</p>
              <p className="text-lg font-semibold text-sky-300">2 / 4 steps</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 text-xs md:text-sm">
            <div className="flex items-start gap-2">
              <span className="mt-[3px] h-3 w-3 rounded-full bg-emerald-400" aria-hidden />
              <div>
                <p className="font-semibold text-white">1. Complete your profile</p>
                <p className="text-slate-400">
                  Add photo, skills, and a short bio so people can trust and choose you.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-[3px] h-3 w-3 rounded-full bg-emerald-400" aria-hidden />
              <div>
                <p className="font-semibold text-white">2. Create your first service</p>
                <p className="text-slate-400">
                  List at least one thing you can do – teaching, design, delivery, tech help, anything.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-[3px] h-3 w-3 rounded-full bg-slate-500" aria-hidden />
              <div>
                <p className="font-semibold text-white">3. Apply to your first job</p>
                <p className="text-slate-400">
                  Send at least one simple application so the system can learn what you like.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-[3px] h-3 w-3 rounded-full bg-slate-500" aria-hidden />
              <div>
                <p className="font-semibold text-white">4. Turn on notifications</p>
                <p className="text-slate-400">
                  Allow alerts so you never miss new jobs, orders, or important updates.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            <Link
              href="/home"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 text-slate-900 px-4 py-1.5 font-semibold hover:bg-emerald-300 transition-colors"
            >
              Open profile &amp; services
            </Link>
            <Link
              href="/home"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-4 py-1.5 font-semibold text-slate-100 hover:bg-white/10 transition-colors"
            >
              Go to jobs &amp; activity
            </Link>
          </div>
        </div>

        {/* Activity feed + navigation shortcuts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="glass-panel border border-white/10 rounded-2xl p-5 lg:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-2">
              Activity Feed (example)
            </p>
            <ul className="space-y-2 text-xs md:text-sm text-slate-300">
              {activity.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span aria-hidden className="mt-[2px] text-slate-500">
                    •
                  </span>
                  <span className={a.includes("+$") ? "text-emerald-200" : undefined}>{a.replace(/^•\s?/, "")}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-500 mt-3">
              In the live system, this feed will update in real time based on your orders, jobs, and
              AI insights.
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/wallet" className="glass-panel card-hover p-4 block border border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Wallet</span>
              <p className="text-sm font-semibold text-white mt-1">Balance &amp; earnings</p>
            </Link>
            <Link href="/home" className="glass-panel card-hover p-4 block border border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Home</span>
              <p className="text-sm font-semibold text-white mt-1">Operations view</p>
            </Link>
            <Link
              href="/ai-marketplace"
              className="glass-panel card-hover p-4 block border border-white/10"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400">AI Market</span>
              <p className="text-sm font-semibold text-white mt-1">Tools &amp; products</p>
            </Link>
            <Link
              href="/settings"
              className="glass-panel card-hover p-4 block border border-white/10"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Settings</span>
              <p className="text-sm font-semibold text-white mt-1">Account &amp; preferences</p>
            </Link>
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="fixed right-4 bottom-4 z-[80] rounded-2xl glass-panel border border-emerald-400/30 bg-slate-950/70 px-4 py-3"
          style={{ boxShadow: "0 0 40px rgba(0,234,255,0.14)" }}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <span aria-hidden className="text-xl">+$</span>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold">
                Live earning feedback
              </p>
              <p className="text-lg font-semibold text-white">
                +${toast.amountUsd} earned
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                +{toast.points} points • {toast.secondary}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
