import Link from "next/link";
import { StlWidget } from "@/components/stl/StlWidget";

const LEVELS = [
  { name: "Beginner", minPoints: 0, maxPoints: 99 },
  { name: "Active", minPoints: 100, maxPoints: 299 },
  { name: "Pro", minPoints: 300, maxPoints: 699 },
  { name: "Expert", minPoints: 700, maxPoints: 999 },
];

// Simple placeholder values – real product will use user data
const MOCK_POINTS = 160;
const TODAY_EARNINGS = 12;

export default function DashboardPage() {
  const currentLevel =
    LEVELS.find((lvl) => MOCK_POINTS >= lvl.minPoints && MOCK_POINTS <= lvl.maxPoints) ?? LEVELS[0];
  const nextLevelIndex = LEVELS.indexOf(currentLevel) + 1;
  const nextLevel = LEVELS[nextLevelIndex] ?? currentLevel;
  const pointsInLevel = MOCK_POINTS - currentLevel.minPoints;
  const levelRange = (currentLevel.maxPoints - currentLevel.minPoints) || 1;
  const progressPct = Math.min(100, Math.max(0, (pointsInLevel / levelRange) * 100));
  const pointsToNext = nextLevel.minPoints > MOCK_POINTS ? nextLevel.minPoints - MOCK_POINTS : 0;

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
              <span className="font-semibold text-emerald-300">${TODAY_EARNINGS}</span>
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

        <StlWidget />

        {/* Daily reward + notifications teaser */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-panel border border-amber-400/50 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-amber-300 mb-1">
                Daily Reward
              </p>
              <p className="text-sm font-semibold text-white mb-1">Daily reward available 🎁</p>
              <p className="text-xs text-slate-400">
                Log in today and complete 1 small action to claim bonus points.
              </p>
            </div>
            <div className="mt-3">
              <Link
                href="/wallet"
                className="min-h-touch inline-flex items-center justify-center rounded-full bg-amber-400 text-slate-900 px-4 py-1.5 text-[11px] font-semibold hover:bg-amber-300 transition-colors"
              >
                Claim in Wallet
              </Link>
            </div>
          </div>
          <div className="glass-panel border border-sky-400/50 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-sky-300 mb-1">Goals</p>
              <p className="text-sm font-semibold text-white mb-1">Weekly earning goal</p>
              <p className="text-xs text-slate-400 mb-2">Goal: Earn $100 this week.</p>
              <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                  style={{ width: "35%" }}
                />
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
                href="/profile"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 text-slate-900 px-3 py-1 font-semibold hover:bg-emerald-300 transition-colors"
              >
                Create Service
              </Link>
              <Link
                href="/jobs"
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
              <p className="text-lg font-semibold text-emerald-300">{MOCK_POINTS} pts</p>
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
            <span className="text-emerald-300 font-semibold">You are improving.</span>
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
              href="/profile"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 text-slate-900 px-4 py-1.5 font-semibold hover:bg-emerald-300 transition-colors"
            >
              Open profile &amp; services
            </Link>
            <Link
              href="/jobs"
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
              <li>• You completed 1 job in IT services.</li>
              <li>• Your profile views increased by 12% this week.</li>
              <li>• Someone saved your service to favourites.</li>
              <li>• A new job matching your skills was posted in Web Development.</li>
              <li>• Franchise program in your city is currently accepting early partners.</li>
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
    </main>
  );
}
