import Anthropic from "@anthropic-ai/sdk";

let anthropicClient = null;

function getAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

function safeFallback() {
  return {
    risk: "medium",
    trustAdjustment: 0,
    reason: "AI fallback: no key or response parse issue.",
  };
}

function normalize(ai) {
  const risk = ["low", "medium", "high"].includes((ai?.risk || "").toLowerCase()) ? ai.risk.toLowerCase() : "medium";
  const trustAdjustment = Math.max(-10, Math.min(10, Number(ai?.trustAdjustment || 0)));
  const reason = String(ai?.reason || "No reason");
  return { risk, trustAdjustment, reason };
}

export async function analyzeUser(data) {
  const client = getAnthropic();
  if (!client) return safeFallback();

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are an AI risk and trust engine for EHB system.

Analyze this user:
PSS Score: ${data.pss}
CRB Score: ${data.crb}
DMO Score: ${data.dmo}
Lock: ${data.lock}

Return strict JSON only:
{
  "risk": "low|medium|high",
  "trustAdjustment": number (-10 to +10),
  "reason": "short reason"
}`,
        },
      ],
    });

    const text = response.content?.[0]?.text || "{}";
    const parsed = JSON.parse(text);
    return normalize(parsed);
  } catch {
    return safeFallback();
  }
}

