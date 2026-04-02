import type { MemoryBrainResult, OpenAIResponsePayload } from "@/lib/ai/types";

const BLOCKED_KEYWORDS = [
  "code",
  "function",
  "api bana",
  "build",
  "develop",
  "script",
  "exploit",
  "hack",
  "payload",
  "bypass",
  "sql injection",
  "xss",
  "rce",
];

const EHB_DOMAIN_KEYWORDS = [
  "ehb",
  "dmo",
  "pss",
  "crb",
  "stl",
  "industry",
  "franchise",
  "marketplace",
  "refilling",
  "affiliate",
  "penalty",
  "jps",
  "verification",
  "certification",
  "trust",
];

const DEFAULT_SYSTEM_PROMPT = `
You are EHB Memory AI.

Rules:
- Answer only from EHB domain context and planning knowledge.
- Do not generate source code, scripts, payloads, or implementation steps.
- If user asks coding/development/security-exploit content, refuse briefly.
- Keep responses structured, concise, and factual.
`.trim();

export function getMemorySystemPrompt() {
  return (process.env.EHB_MEMORY_SYSTEM_PROMPT ?? DEFAULT_SYSTEM_PROMPT).trim();
}

export function getMemoryContext() {
  return (process.env.EHB_MEMORY_CONTEXT ?? "").trim();
}

export function checkMemoryQueryAllowed(message: string) {
  const text = message.toLowerCase();
  const blocked = BLOCKED_KEYWORDS.find((k) => text.includes(k));
  if (blocked) {
    return { ok: false as const, reason: `Blocked keyword detected: "${blocked}"` };
  }

  const hasDomain = EHB_DOMAIN_KEYWORDS.some((k) => text.includes(k));
  if (!hasDomain) {
    return {
      ok: false as const,
      reason: "Only EHB memory/domain queries are allowed.",
    };
  }

  return { ok: true as const };
}

function extractTextFromResponsesApi(json: any) {
  if (typeof json?.output_text === "string" && json.output_text.trim().length > 0) {
    return json.output_text.trim();
  }

  const output = Array.isArray(json?.output) ? json.output : [];
  const chunks: string[] = [];
  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (part?.type === "output_text" && typeof part?.text === "string") {
        chunks.push(part.text);
      }
    }
  }
  return chunks.join("\n").trim();
}

export async function queryMemoryBrain(args: { message: string }): Promise<MemoryBrainResult> {
  const apiKey = process.env.EHB_MEMORY_OPENAI_KEY;
  if (!apiKey) {
    throw new Error("EHB_MEMORY_OPENAI_KEY is not configured.");
  }

  const model = process.env.EHB_MEMORY_MODEL ?? "gpt-4.1-mini";
  const payload: OpenAIResponsePayload = {
    model,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: getMemorySystemPrompt() }],
      },
      ...(getMemoryContext()
        ? [
            {
              role: "system" as const,
              content: [{ type: "input_text" as const, text: `EHB Context:\n${getMemoryContext()}` }],
            },
          ]
        : []),
      {
        role: "user",
        content: [{ type: "input_text", text: args.message }],
      },
    ],
    max_output_tokens: 600,
    temperature: 0.2,
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json?.error?.message ?? `OpenAI request failed with status ${response.status}`;
    throw new Error(message);
  }

  const text = extractTextFromResponsesApi(json);
  if (!text) {
    throw new Error("Memory brain returned empty response.");
  }

  return {
    answer: text,
    model,
    usage: json?.usage ?? null,
  };
}

