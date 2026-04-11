import { getStlFullSnapshotForUser } from "@/services/stl/snapshot.service";
import { getCache, setCache } from "@/cache/redis";

const AI_SUGGESTIONS_TTL_SECONDS = 20;

export type AiSuggestionsPayload = {
  readinessPercent: number;
  guide: string;
  suggestions: string[];
  recommendations: string[];
  fraud: {
    flagged: boolean;
    reasons: string[];
    risk: "LOW" | "MEDIUM" | "HIGH";
  };
  autoDecision: {
    recommendUpgrade: boolean;
    escalateToDmo: boolean;
    reason: string;
  };
  trust: {
    stlLevel: number;
    trustScore: number;
    nextLevelName: string | null;
  };
};

function aiSuggestionsKey(userId: string) {
  return `ai:suggestions:${userId}`;
}

export async function getAiSuggestionsForUser(userId: string): Promise<AiSuggestionsPayload> {
  const key = aiSuggestionsKey(userId);
  const cached = await getCache<AiSuggestionsPayload>(key);
  if (cached) return cached;

  const snapshot = await getStlFullSnapshotForUser(userId);
  const payload: AiSuggestionsPayload = {
    readinessPercent: snapshot.ai.readinessPercent,
    guide: snapshot.ai.guide,
    suggestions: snapshot.ai.tasks,
    recommendations: snapshot.ai.recommendations,
    fraud: snapshot.ai.fraud,
    autoDecision: snapshot.ai.autoDecision,
    trust: {
      stlLevel: snapshot.stlLevel,
      trustScore: snapshot.trustScore,
      nextLevelName: snapshot.nextLevelName,
    },
  };

  await setCache(key, payload, AI_SUGGESTIONS_TTL_SECONDS);
  return payload;
}
