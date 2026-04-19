"use client";

/**
 * Public STL Trust Profile Preview — Phase 4 UI rebuild
 *
 * Displays:
 * - How other users see this profile
 * - STL badge, rating, verified badges
 * - Trust indicators: Rating + Badge + STL Level + Safety %
 * - Verification stamps
 * - Quick stats
 *
 * Design: Bold trust signals, premium glassmorphism
 */

import { useParams } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface PublicProfile {
  id: string;
  name: string;
  category: string;
  stlLevel: number;
  stlScore: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  verifiedDate: string;
  completedOrders: number;
  responseTime: number;
  onTimeDelivery: number;
  badges: string[];
  certifications: string[];
}

// Mock profile data - in production this would be fetched by ID
const MOCK_PROFILES: Record<string, PublicProfile> = {
  current: {
    id: "usr_current_001",
    name: "Ali Hassan",
    category: "E-commerce Seller",
    stlLevel: 5,
    stlScore: 72,
    rating: 4.8,
    reviewCount: 247,
    verified: true,
    verifiedDate: "2026-02-15",
    completedOrders: 412,
    responseTime: 2,
    onTimeDelivery: 98,
    badges: ["Trusted Seller", "Fast Responder", "Quality Certified"],
    certifications: ["CRB L5", "PSS L6", "DMO L5"],
  },
  example1: {
    id: "usr_example_001",
    name: "Fatima Khan",
    category: "Premium E-commerce",
    stlLevel: 10,
    stlScore: 98,
    rating: 4.95,
    reviewCount: 1250,
    verified: true,
    verifiedDate: "2025-01-10",
    completedOrders: 5412,
    responseTime: 0.5,
    onTimeDelivery: 99.8,
    badges: ["Supreme Seller", "Industry Leader", "Certified Expert"],
    certifications: ["CRB L10", "PSS L10", "DMO L10"],
  },
};

function getTrustColor(level: number) {
  if (level >= 8) return { bg: "bg-[#A098F8]/20", border: "border-[#A098F8]/40", text: "text-[#A098F8]" };
  if (level >= 6) return { bg: "bg-[#7B6EF6]/20", border: "border-[#7B6EF6]/40", text: "text-[#7B6EF6]" };
  if (level >= 4) return { bg: "bg-[#2BBFA0]/20", border: "border-[#2BBFA0]/40", text: "text-[#2BBFA0]" };
  return { bg: "bg-[#F0A030]/20", border: "border-[#F0A030]/40", text: "text-[#F0A030]" };
}

function calculateSafetyPercentage(level: number): number {
  const safety: Record<number, number> = {
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
  return safety[level] || 0;
}

export default function PublicProfilePage() {
  const params = useParams();
  const id = (params.id as string) || "current";
  const profile = MOCK_PROFILES[id] || MOCK_PROFILES.current;
  const colors = getTrustColor(profile.stlLevel);
  const safetyPct = calculateSafetyPercentage(profile.stlLevel);

  return (
    <main className="min-h-screen bg-[#0C0E1A] px-4 py-8 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/stl"
          className="inline-flex items-center gap-2 text-[#8890B0] hover:text-[#A098F8] transition-colors text-sm mb-8"
        >
          ← Back to Dashboard
        </Link>

        {/* Hero Card */}
        <GlassCard
          className={`mb-12 p-8 md:p-12 border ${colors.border}`}
          style={{
            background: "rgba(19,22,42,0.95)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Profile Info */}
            <div>
              <div className="mb-4">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {profile.name}
                </div>
                <div className="text-lg text-[#8890B0]">{profile.category}</div>
              </div>

              {/* Trust Badges Row */}
              <div className="flex flex-wrap gap-2 mb-6">
                {profile.verified && (
                  <Badge className="bg-[#2BBFA0]/30 text-[#2BBFA0] text-xs">
                    ✓ ID Verified
                  </Badge>
                )}
                {profile.stlLevel >= 7 && (
                  <Badge className="bg-[#F0A030]/30 text-[#F0A030] text-xs">
                    ★ Top Ranking
                  </Badge>
                )}
                {profile.stlLevel >= 6 && (
                  <Badge className="bg-[#7B6EF6]/30 text-[#7B6EF6] text-xs">
                    🏅 Elite
                  </Badge>
                )}
              </div>

              {/* Verification */}
              {profile.verified && (
                <div className="bg-[#2BBFA0]/10 border border-[#2BBFA0]/30 rounded-lg p-3 text-xs">
                  <div className="text-[#2BBFA0] font-semibold mb-1">
                    Identity Verified
                  </div>
                  <div className="text-[#8890B0]">
                    Verified on {new Date(profile.verifiedDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Trust Meter */}
            <div className={`${colors.bg} border ${colors.border} rounded-lg p-6 text-center`}>
              <div className="text-sm text-[#8890B0] uppercase tracking-wide mb-2">
                Trust Score
              </div>
              <div className="text-5xl font-bold text-white mb-2">
                L{profile.stlLevel}
              </div>
              <div className={`text-lg font-semibold ${colors.text} mb-4`}>
                ADVANCED
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-[#8890B0]">Rating</div>
                  <div className="text-white font-bold">
                    {profile.rating} ⭐ ({profile.reviewCount.toLocaleString()} reviews)
                  </div>
                </div>
                <div>
                  <div className="text-[#8890B0]">On-Time Delivery</div>
                  <div className="text-[#2BBFA0] font-bold">
                    {profile.onTimeDelivery}%
                  </div>
                </div>
                <div>
                  <div className="text-[#8890B0]">EHB Protection</div>
                  <div className="text-[#7B6EF6] font-bold">
                    {safetyPct}% covered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-[#2BBFA0] mb-2">
              {profile.completedOrders.toLocaleString()}
            </div>
            <div className="text-xs text-[#8890B0]">Completed Orders</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-[#7B6EF6] mb-2">
              {profile.responseTime}h
            </div>
            <div className="text-xs text-[#8890B0]">Avg Response</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="text-3xl font-bold text-[#A098F8] mb-2">
              {profile.onTimeDelivery}%
            </div>
            <div className="text-xs text-[#8890B0]">On-Time Rate</div>
          </GlassCard>
        </div>

        {/* Badges & Certs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Badges */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
              🏅 Earned Badges
            </h3>
            <div className="space-y-2">
              {profile.badges.map((badge) => (
                <GlassCard key={badge} className="p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2BBFA0]" />
                    <span className="text-[#C8CCDF]">{badge}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
              📜 Certifications
            </h3>
            <div className="space-y-2">
              {profile.certifications.map((cert) => (
                <GlassCard key={cert} className="p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#7B6EF6]" />
                    <span className="text-[#C8CCDF]">{cert}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators Summary */}
        <GlassCard className="p-6 md:p-8 mb-12">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6">
            Trust Indicators Summary
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="text-[#8890B0]">STL Level</span>
                <span className="text-white font-bold">L{profile.stlLevel}/L10</span>
              </div>
              <div className="h-2 bg-[#1A1D33] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7B6EF6] to-[#2BBFA0]"
                  style={{ width: `${(profile.stlLevel / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="text-[#8890B0]">Rating Score</span>
                <span className="text-white font-bold">{profile.rating}/5.0</span>
              </div>
              <div className="h-2 bg-[#1A1D33] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F0A030] to-[#2BBFA0]"
                  style={{ width: `${(profile.rating / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 text-xs">
                <span className="text-[#8890B0]">EHB Protection</span>
                <span className="text-white font-bold">{safetyPct}%</span>
              </div>
              <div className="h-2 bg-[#1A1D33] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#38C878] to-[#2BBFA0]"
                  style={{ width: `${safetyPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#1A1D33] rounded-lg border border-[rgba(255,255,255,0.07)] text-xs text-[#8890B0]">
            <span className="font-semibold text-[#C8CCDF]">What this means:</span>{" "}
            This seller is verified and maintains a strong service trust level. EHB covers {safetyPct}% of
            verified disputes, giving you extra peace of mind.
          </div>
        </GlassCard>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/stl"
            className="px-4 py-2 rounded-lg bg-[#13162A] border border-[rgba(255,255,255,0.08)] text-[#C8CCDF] text-sm font-medium hover:border-[rgba(255,255,255,0.12)] transition-colors"
          >
            ← Back
          </Link>
        </div>
      </div>
    </main>
  );
}
