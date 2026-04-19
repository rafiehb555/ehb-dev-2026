"use client";

/**
 * STL My Trust Level Dashboard — Phase 4 UI rebuild
 *
 * Displays:
 * - Animated composite STL ring (current level + score)
 * - 3-meter breakdown: PSS, CRB, DMO (each L1-L10)
 * - Composite formula visualization
 * - MIN-cap indicator
 * - Token lock display
 * - Responsibility % bar
 * - Upgrade path recommendation
 *
 * Design: Dark glassmorphism, purple/teal gradients, premium motion
 */

import Link from "next/link";
import { useState } from "react";
import { MetricRing } from "@/components/ui/metric-ring";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";

const STL_LEVELS = [
  { level: 0, name: "PRE-VERIFIED", color: "#555A78", min: 0, max: 10 },
  { level: 1, name: "FREE", color: "#F05858", min: 10, max: 25 },
  { level: 2, name: "BASIC", color: "#F0A030", min: 25, max: 40 },
  { level: 3, name: "NORMAL", color: "#F0A030", min: 40, max: 55 },
  { level: 4, name: "STANDARD", color: "#2BBFA0", min: 55, max: 65 },
  { level: 5, name: "ADVANCED", color: "#7B6EF6", min: 65, max: 75 },
  { level: 6, name: "HIGH", color: "#7B6EF6", min: 75, max: 82 },
  { level: 7, name: "PRO", color: "#A098F8", min: 82, max: 88 },
  { level: 8, name: "VIP", color: "#A098F8", min: 88, max: 94 },
  { level: 9, name: "ELITE", color: "#2BBFA0", min: 94, max: 97 },
  { level: 10, name: "SUPREME", color: "#38C878", min: 97, max: 100 },
];

const TOKEN_LOCKS = {
  0: 0,
  1: 0,
  2: 50,
  3: 100,
  4: 250,
  5: 500,
  6: 1000,
  7: 2500,
  8: 5000,
  9: 10000,
  10: 25000,
};

const RESPONSIBILITY = {
  0: 0,
  1: 10,
  2: 20,
  3: 40,
  4: 55,
  5: 70,
  6: 80,
  7: 90,
  8: 95,
  9: 98,
  10: 100,
};

// Mock user data
const mockUser = {
  id: "usr_current_001",
  name: "Ali Hassan",
  compositeScore: 72,
  compositeLevel: 5,
  pssScore: 78,
  pssLevel: 6,
  crbScore: 68,
  crbLevel: 5,
  dmoScore: 70,
  dmoLevel: 5,
  lockedTokens: 500,
  totalTokens: 5000,
};

function getLevelMeta(level: number) {
  return STL_LEVELS[level] || STL_LEVELS[0];
}

export default function MyTrustLevelPage() {
  const [expandedMeters, setExpandedMeters] = useState<string | null>(null);

  const compositeMeta = getLevelMeta(mockUser.compositeLevel);
  const pssMeta = getLevelMeta(mockUser.pssLevel);
  const crbMeta = getLevelMeta(mockUser.crbLevel);
  const dmoMeta = getLevelMeta(mockUser.dmoLevel);

  // Calculate MIN-cap
  const minComponentLevel = Math.min(
    mockUser.pssLevel,
    mockUser.crbLevel,
    mockUser.dmoLevel
  );
  const isCapped =
    mockUser.compositeLevel >
    minComponentLevel + 1;

  // Determine next level requirements
  const nextLevel = mockUser.compositeLevel + 1;
  const nextMeta = getLevelMeta(nextLevel);

  return (
    <main className="min-h-screen bg-[#0C0E1A] px-4 py-8 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            My Trust Level
          </h1>
          <p className="text-sm md:text-base text-[#8890B0]">
            {mockUser.name} • Your EHB Service Trust Level profile
          </p>
        </div>

        {/* Primary: Composite STL Ring */}
        <GlassCard
          className="mb-12 p-8 md:p-10"
          style={{
            background: "rgba(19,22,42,0.95)",
            border: "1px solid rgba(123,110,246,0.2)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Ring */}
            <div className="flex justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <MetricRing
                  value={mockUser.compositeScore}
                  max={100}
                  label="Composite STL"
                  gradientStart="#7B6EF6"
                  gradientEnd="#2BBFA0"
                  size={220}
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="text-sm text-[#8890B0] uppercase tracking-wide mb-2">
                  Current Level
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  L{mockUser.compositeLevel}
                </div>
                <div className="text-xl font-semibold text-[#A098F8] mb-4">
                  {compositeMeta.name}
                </div>
                <div className="text-xs text-[#8890B0]">
                  Score: {mockUser.compositeScore.toFixed(1)} / 100
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-[#8890B0] uppercase tracking-wide">
                  Formula
                </div>
                <div className="text-sm font-mono text-[#C8CCDF] space-y-1 bg-[#1A1D33] p-3 rounded-lg border border-[rgba(255,255,255,0.07)]">
                  <div>
                    Composite = (PSS × 0.4) + (CRB × 0.3) + (DMO × 0.3)
                  </div>
                  <div className="text-[#8890B0]">
                    = ({mockUser.pssScore} × 0.4) + ({mockUser.crbScore} × 0.3) + (
                    {mockUser.dmoScore} × 0.3)
                  </div>
                  <div className="text-[#A098F8] font-semibold">
                    = {mockUser.compositeScore.toFixed(1)}
                  </div>
                </div>
              </div>

              {isCapped && (
                <div className="bg-[#F0A030]/10 border border-[#F0A030]/30 rounded-lg p-3">
                  <div className="text-xs text-[#F0A030] font-semibold">
                    ⚠️ Level Capped
                  </div>
                  <div className="text-xs text-[#F0A030]/80 mt-1">
                    Your level is capped at L{minComponentLevel + 1} because CRB
                    is L{mockUser.crbLevel}. Strengthen CRB to unlock higher levels.
                  </div>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Three Meters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* PSS Meter */}
          <GlassCard
            className="p-6 cursor-pointer hover:border-[rgba(255,255,255,0.12)]"
            onClick={() =>
              setExpandedMeters(expandedMeters === "pss" ? null : "pss")
            }
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#C8CCDF]">PSS</span>
                <span className="text-xs text-[#8890B0]">
                  {pssMeta.name}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                L{mockUser.pssLevel}
              </div>
              <div className="text-xs text-[#8890B0] mt-1">
                {mockUser.pssScore.toFixed(0)} pts
              </div>
            </div>
            <ProgressBar
              value={mockUser.pssScore}
              max={100}
              color="#2BBFA0"
              height="6px"
            />
            <div className="text-xs text-[#8890B0] mt-2">
              Identity & KYC verification
            </div>
          </GlassCard>

          {/* CRB Meter */}
          <GlassCard
            className="p-6 cursor-pointer hover:border-[rgba(255,255,255,0.12)]"
            onClick={() =>
              setExpandedMeters(expandedMeters === "crb" ? null : "crb")
            }
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#C8CCDF]">CRB</span>
                <span className="text-xs text-[#8890B0]">
                  {crbMeta.name}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                L{mockUser.crbLevel}
              </div>
              <div className="text-xs text-[#8890B0] mt-1">
                {mockUser.crbScore.toFixed(0)} pts
              </div>
            </div>
            <ProgressBar
              value={mockUser.crbScore}
              max={100}
              color="#7B6EF6"
              height="6px"
            />
            <div className="text-xs text-[#8890B0] mt-2">
              Certification & quality badges
            </div>
          </GlassCard>

          {/* DMO Meter */}
          <GlassCard
            className="p-6 cursor-pointer hover:border-[rgba(255,255,255,0.12)]"
            onClick={() =>
              setExpandedMeters(expandedMeters === "dmo" ? null : "dmo")
            }
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#C8CCDF]">DMO</span>
                <span className="text-xs text-[#8890B0]">
                  {dmoMeta.name}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                L{mockUser.dmoLevel}
              </div>
              <div className="text-xs text-[#8890B0] mt-1">
                {mockUser.dmoScore.toFixed(0)} pts
              </div>
            </div>
            <ProgressBar
              value={mockUser.dmoScore}
              max={100}
              color="#A098F8"
              height="6px"
            />
            <div className="text-xs text-[#8890B0] mt-2">
              Behavior & dispute history
            </div>
          </GlassCard>
        </div>

        {/* Token Lock & Responsibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Token Lock */}
          <GlassCard className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#C8CCDF] uppercase tracking-wide mb-2">
                🔒 Token Lock (EHBGC)
              </h3>
              <div className="text-2xl font-bold text-[#2BBFA0]">
                {TOKEN_LOCKS[mockUser.compositeLevel as keyof typeof TOKEN_LOCKS]?.toLocaleString() ||
                  0}{" "}
                EHBGC
              </div>
              <div className="text-xs text-[#8890B0] mt-1">
                Required lock at L{mockUser.compositeLevel}
              </div>
            </div>
            <div className="bg-[#1A1D33] rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-[#8890B0]">Your balance</span>
                <span className="text-sm font-semibold text-white">
                  {mockUser.totalTokens.toLocaleString()} EHBGC
                </span>
              </div>
              <ProgressBar
                value={mockUser.lockedTokens}
                max={mockUser.totalTokens}
                color="#2BBFA0"
                height="5px"
              />
              <div className="text-xs text-[#8890B0] mt-2">
                {mockUser.lockedTokens} locked •{" "}
                {(
                  mockUser.totalTokens - mockUser.lockedTokens
                ).toLocaleString()}{" "}
                available
              </div>
            </div>
          </GlassCard>

          {/* Responsibility % */}
          <GlassCard className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#C8CCDF] uppercase tracking-wide mb-2">
                🛡️ EHB Protection
              </h3>
              <div className="text-2xl font-bold text-[#7B6EF6]">
                {RESPONSIBILITY[
                  mockUser.compositeLevel as keyof typeof RESPONSIBILITY
                ] || 0}
                %
              </div>
              <div className="text-xs text-[#8890B0] mt-1">
                EHB covers disputes for you
              </div>
            </div>
            <div className="bg-[#1A1D33] rounded-lg p-3">
              <div className="text-xs text-[#8890B0] mb-2">
                At L{mockUser.compositeLevel}, EHB assumes responsibility for up
                to{" "}
                <span className="font-semibold text-white">
                  {RESPONSIBILITY[
                    mockUser
                      .compositeLevel as keyof typeof RESPONSIBILITY
                  ] || 0}
                  %
                </span>{" "}
                of verified disputes.
              </div>
              <div className="text-xs text-[#555A78] mt-3 border-t border-[rgba(255,255,255,0.07)] pt-3">
                L1–L3: Customer responsible. L4–L6: Shared. L7+: EHB covered.
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Upgrade Path */}
        <GlassCard className="p-6 md:p-8 mb-12">
          <h3 className="text-sm font-semibold text-[#C8CCDF] uppercase tracking-wide mb-4">
            📈 Your Upgrade Path
          </h3>

          {nextLevel <= 10 ? (
            <div>
              <div className="mb-4">
                <div className="text-lg font-bold text-white">
                  To reach L{nextLevel} {nextMeta.name}:
                </div>
              </div>

              <div className="space-y-3">
                {mockUser.pssLevel < 5 && (
                  <div className="flex items-start gap-3 p-3 bg-[#1A1D33] rounded-lg border border-[rgba(255,255,255,0.07)]">
                    <div className="text-[#2BBFA0] font-bold flex-shrink-0">
                      1.
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#C8CCDF]">
                        Strengthen PSS → L{nextLevel - 1}
                      </div>
                      <div className="text-xs text-[#8890B0] mt-1">
                        Complete advanced KYC. Get liveness verification.
                      </div>
                    </div>
                  </div>
                )}

                {mockUser.crbLevel < nextLevel - 1 && (
                  <div className="flex items-start gap-3 p-3 bg-[#1A1D33] rounded-lg border border-[rgba(255,255,255,0.07)]">
                    <div className="text-[#7B6EF6] font-bold flex-shrink-0">
                      2.
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#C8CCDF]">
                        Earn CRB → L{nextLevel - 1}
                      </div>
                      <div className="text-xs text-[#8890B0] mt-1">
                        Pass certification exam or complete service hours.
                      </div>
                    </div>
                  </div>
                )}

                {mockUser.dmoLevel < nextLevel - 1 && (
                  <div className="flex items-start gap-3 p-3 bg-[#1A1D33] rounded-lg border border-[rgba(255,255,255,0.07)]">
                    <div className="text-[#A098F8] font-bold flex-shrink-0">
                      3.
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#C8CCDF]">
                        Build DMO → L{nextLevel - 1}
                      </div>
                      <div className="text-xs text-[#8890B0] mt-1">
                        Maintain dispute-free record. Get positive ratings.
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-[#2BBFA0]/10 rounded-lg border border-[#2BBFA0]/30]">
                  <div className="text-[#2BBFA0] font-bold flex-shrink-0">
                    🎯
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#C8CCDF]">
                      Lock {TOKEN_LOCKS[nextLevel as keyof typeof TOKEN_LOCKS]?.toLocaleString() || 0} EHBGC
                    </div>
                    <div className="text-xs text-[#8890B0] mt-1">
                      Required token collateral for L{nextLevel}.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href="/stl/journey"
                  className="px-4 py-2 rounded-lg bg-[#7B6EF6]/20 border border-[#7B6EF6]/40 text-[#A098F8] text-sm font-medium hover:bg-[#7B6EF6]/30 transition-colors"
                >
                  View Journey
                </Link>
                <Link
                  href="/stl/ranking"
                  className="px-4 py-2 rounded-lg bg-[#2BBFA0]/20 border border-[#2BBFA0]/40 text-[#2BBFA0] text-sm font-medium hover:bg-[#2BBFA0]/30 transition-colors"
                >
                  See Ranking
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏆</div>
              <div className="text-lg font-bold text-[#38C878] mb-2">
                SUPREME Level Achieved!
              </div>
              <div className="text-sm text-[#8890B0]">
                You've reached the highest EHB Service Trust Level. Maintain your
                perfect record to stay elite.
              </div>
            </div>
          )}
        </GlassCard>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/stl/public/current"
            className="px-4 py-2 rounded-lg bg-[#13162A] border border-[rgba(255,255,255,0.08)] text-[#C8CCDF] text-sm font-medium hover:border-[rgba(255,255,255,0.12)] transition-colors"
          >
            View Public Profile
          </Link>
          <Link
            href="/dmo/stl/breakdown"
            className="px-4 py-2 rounded-lg bg-[#13162A] border border-[rgba(255,255,255,0.08)] text-[#C8CCDF] text-sm font-medium hover:border-[rgba(255,255,255,0.12)] transition-colors"
          >
            Detailed Breakdown
          </Link>
        </div>
      </div>
    </main>
  );
}
