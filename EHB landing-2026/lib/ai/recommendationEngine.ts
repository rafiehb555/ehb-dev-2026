import { prisma } from "@/lib/prisma";

const db = prisma as any;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type RecommendationType = "job" | "service" | "product" | "industry";

export interface RecommendationItem {
  id:          string;
  type:        RecommendationType;
  title:       string;
  description: string;
  score:       number;
  reason:      string;
  industry?:   string;
  price?:      number;
  location?:   string;
  imageUrl?:   string;
  ctaUrl?:     string;
}

export interface AIInsightCard {
  id:       string;
  icon:     string;
  message:  string;
  cta:      string;
  ctaUrl:   string;
  industry: string;
  score:    number;
}

type ServiceRecommendation = RecommendationItem;

function scoreRecommendation(args: {
  skillMatch: number;
  industryMatch: number;
  locationMatch: number;
  behaviourMatch: number;
  priceFit: number;
}) {
  const score =
    args.skillMatch * 0.35 +
    args.industryMatch * 0.25 +
    args.locationMatch * 0.2 +
    args.behaviourMatch * 0.15 +
    args.priceFit * 0.05;
  return Math.round(Math.max(0, Math.min(100, score)));
}
type UserEventRecord = {
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt?: string | Date;
};
type AIInsightRecord = {
  id: string;
  insightText?: string | null;
  trendScore?: number | null;
};

// ---------------------------------------------------------------------------
// Track a user event (page view, click, search, etc.)
// ---------------------------------------------------------------------------
export async function trackEvent(args: {
  userId:     string;
  eventType:  "PAGE_VIEW" | "SEARCH" | "CLICK" | "FAVOURITE" | "ORDER" | "APPLY" | "RECOMMENDATION_CLICK" | "RECOMMENDATION_DISMISS";
  entityId?:  string;
  entityType?: string;
  metadata?:  Record<string, unknown>;
}) {
  try {
    return await db.userEvent.create({
      data: {
        userId:     args.userId,
        eventType:  args.eventType,
        entityId:   args.entityId,
        entityType: args.entityType,
        metadata:   args.metadata ?? undefined,
      },
    });
  } catch {
    // Never fail because of tracking
    return null;
  }
}

// ---------------------------------------------------------------------------
// Get user behavior profile from events
// ---------------------------------------------------------------------------
async function getUserBehaviorProfile(userId: string) {
  const events: UserEventRecord[] = await db.userEvent.findMany({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const industryClicks: Record<string, number> = {};
  const searchTerms:    string[]               = [];
  const viewedEntities: Set<string>            = new Set();

  for (const e of events) {
    if (e.entityId) viewedEntities.add(e.entityId);
    const meta = (e.metadata as Record<string, unknown>) ?? {};
    if (typeof meta.industry === "string") {
      industryClicks[meta.industry] = (industryClicks[meta.industry] ?? 0) + 1;
    }
    if (typeof meta.query === "string") {
      searchTerms.push(meta.query);
    }
  }

  // Top 3 industries by interaction
  const topIndustries = Object.entries(industryClicks)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 3)
    .map(([slug]: [string, number]) => slug);

  return { topIndustries, searchTerms, viewedEntities };
}

// ---------------------------------------------------------------------------
// Get AI recommendations for a user
// ---------------------------------------------------------------------------
export async function getRecommendations(
  userId: string,
  type: RecommendationType = "service",
  limit = 10
): Promise<RecommendationItem[]> {
  const behavior = await getUserBehaviorProfile(userId);

  if (type === "service") {
    const services = await db.providerService.findMany({
      where: { isActive: true },
      include: { service: { select: { name: true, description: true } }, user: { select: { location: true } } },
      take: 100,
    });

    const scored: ServiceRecommendation[] = services.map((s: {
      id: string;
      price: number;
      industryId?: string | null;
      service: { name: string; description: string | null };
      user: { location: string | null } | null;
    }) => {
      const industryText = `${s.service.name} ${s.service.description ?? ""}`.toLowerCase();
      const industryMatch =
        behavior.topIndustries.length === 0
          ? 60
          : behavior.topIndustries.some((slug) => industryText.includes(slug.toLowerCase()))
            ? 92
            : 45;
      const locationMatch = s.user?.location ? 78 : 55;
      const behaviourMatch = behavior.viewedEntities.has(s.id) ? 40 : 88;
      const priceFit = s.price <= 25 ? 85 : s.price <= 100 ? 70 : 45;
      const skillMatch = behavior.searchTerms.some((term) => industryText.includes(term.toLowerCase())) ? 90 : 65;
      const score = scoreRecommendation({
        skillMatch,
        industryMatch,
        locationMatch,
        behaviourMatch,
        priceFit,
      });
      const reason =
        industryMatch >= 85
          ? "Strong match for your industry activity"
          : behaviourMatch >= 80
            ? "New service aligned with your recent behavior"
            : "Useful service to explore next";

      return {
        id:          s.id,
        type:        "service" as const,
        title:       s.service.name,
        description: s.service.description ?? "",
        score,
        reason,
        price:    s.price ?? undefined,
        location: s.user?.location ?? undefined,
        ctaUrl: `/services/${s.id}`,
      };
    });

    return scored
      .sort((a: ServiceRecommendation, b: ServiceRecommendation) => b.score - a.score)
      .slice(0, limit);
  }

  if (type === "job") {
    const items = buildFallbackInsights(behavior.topIndustries[0] ?? "general").map((card, index) => ({
      id: `job-${card.id}-${index}`,
      type: "job" as const,
      title: card.cta,
      description: card.message,
      score: Math.max(60, card.score - 5),
      reason: "Matches your recent activity",
      industry: card.industry,
      ctaUrl: card.ctaUrl,
    }));
    return items.slice(0, limit);
  }

  if (type === "product") {
    const items = buildFallbackInsights(behavior.topIndustries[0] ?? "general").map((card, index) => ({
      id: `product-${card.id}-${index}`,
      type: "product" as const,
      title: card.cta,
      description: card.message,
      score: Math.max(55, card.score - 10),
      reason: "Suggested for your marketplace profile",
      industry: card.industry,
      ctaUrl: "/gosellr",
    }));
    return items.slice(0, limit);
  }

  // Default: return empty (other types to be implemented per-phase)
  return [];
}

// ---------------------------------------------------------------------------
// AI Insight Cards — dashboard + industry home
// ---------------------------------------------------------------------------
export async function getInsightCards(args: {
  userId:   string;
  industry?: string;
  limit?:   number;
}): Promise<AIInsightCard[]> {
  const limit = args.limit ?? 5;

  // Get existing AI insights from DB if available
  const dbInsights: AIInsightRecord[] = await db.aIInsight.findMany({
    where: args.industry
      ? { industry: { slug: args.industry } }
      : undefined,
    orderBy: { trendScore: "desc" },
    take: limit,
  }).catch(() => []);

  if (dbInsights.length > 0) {
    return dbInsights.map((i: AIInsightRecord) => ({
      id:       i.id,
      icon:     "📊",
      message:  i.insightText ?? "Trending opportunity in your area",
      cta:      "View Details",
      ctaUrl:   "/marketplace",
      industry: args.industry ?? "",
      score:    i.trendScore ?? 50,
    }));
  }

  // Fallback: generate smart static cards based on industry
  const cards = buildFallbackInsights(args.industry ?? "general");
  return cards.slice(0, limit);
}

function buildFallbackInsights(industry: string): AIInsightCard[] {
  const templates: Record<string, AIInsightCard[]> = {
    it: [
      { id: "it-1", icon: "💻", message: "IT service demand increased 22% in your city this week", cta: "See IT services", ctaUrl: "/industry/it", industry: "it", score: 88 },
      { id: "it-2", icon: "🤖", message: "3 new web development jobs match your skills", cta: "Apply now", ctaUrl: "/jobs", industry: "it", score: 82 },
    ],
    health: [
      { id: "h-1", icon: "🏥", message: "Doctor consultation demand up 18% — register your clinic", cta: "Register clinic", ctaUrl: "/industry/health", industry: "health", score: 85 },
    ],
    education: [
      { id: "e-1", icon: "📚", message: "Online tutoring requests up 31% this month", cta: "Offer tutoring", ctaUrl: "/industry/education", industry: "education", score: 79 },
    ],
    logistics: [
      { id: "l-1", icon: "🚚", message: "12 new delivery orders in your area need fulfilment", cta: "Accept orders", ctaUrl: "/industry/logistics", industry: "logistics", score: 91 },
    ],
    general: [
      { id: "g-1", icon: "📈", message: "Complete your profile to unlock better opportunities", cta: "Complete profile", ctaUrl: "/profile", industry: "general", score: 70 },
      { id: "g-2", icon: "⭐", message: "Earn your first CRB badge by completing 3 jobs", cta: "Find jobs", ctaUrl: "/jobs", industry: "general", score: 65 },
    ],
  };

  return templates[industry] ?? templates["general"];
}

// ---------------------------------------------------------------------------
// Trending per industry
// ---------------------------------------------------------------------------
export async function getTrending(industry: string): Promise<{
  topServices: { title: string; count: number }[];
  trendingKeywords: string[];
  demandChange: number;
}> {
  // Aggregate recent search/click events for this industry
  const events: UserEventRecord[] = await db.userEvent.findMany({
    where: {
      metadata:  { path: ["industry"], equals: industry },
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    take: 500,
  }).catch(() => []);

  const serviceCount: Record<string, number> = {};
  const keywords: string[] = [];

  for (const e of events) {
    const meta = (e.metadata as Record<string, unknown>) ?? {};
    if (typeof meta.serviceTitle === "string") {
      serviceCount[meta.serviceTitle] = (serviceCount[meta.serviceTitle] ?? 0) + 1;
    }
    if (typeof meta.query === "string") keywords.push(meta.query);
  }

  const topServices = Object.entries(serviceCount)
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
    .slice(0, 5)
    .map(([title, count]: [string, number]) => ({ title, count }));

  // Unique top keywords
  const kw = [...new Set(keywords)].slice(0, 5);

  return {
    topServices,
    trendingKeywords: kw.length > 0 ? kw : getDefaultKeywords(industry),
    demandChange: Math.max(8, Math.min(38, 12 + topServices.length * 4 + kw.length * 3)),
  };
}

function getDefaultKeywords(industry: string): string[] {
  const defaults: Record<string, string[]> = {
    it:         ["web development", "mobile app", "UI/UX", "React", "Python"],
    health:     ["doctor", "clinic", "telemedicine", "pharmacy", "lab test"],
    education:  ["online tutor", "IELTS prep", "coding classes", "Quran teacher", "math"],
    logistics:  ["same day delivery", "courier", "freight", "warehouse", "rider"],
  };
  return defaults[industry] ?? ["services", "jobs", "providers", "marketplace"];
}
