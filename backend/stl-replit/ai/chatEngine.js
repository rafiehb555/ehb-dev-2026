import { getOpenAIClient } from "./client.js";
import { EHB_SYSTEM_PROMPT } from "./prompt.js";
import { actionFromDepartment, decideDepartmentFromText } from "./decisionEngine.js";

function fallbackResponse(message) {
  const department = decideDepartmentFromText(message);
  return {
    department,
    intent: "Fallback intent classification (no OPENAI_API_KEY configured).",
    action: actionFromDepartment(department),
  };
}

export async function askAI(message) {
  const client = getOpenAIClient();
  if (!client) return fallbackResponse(message);

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: EHB_SYSTEM_PROMPT },
      { role: "user", content: String(message || "") },
    ],
  });

  const raw = response.choices?.[0]?.message?.content || "{}";
  try {
    return JSON.parse(raw);
  } catch {
    return fallbackResponse(message);
  }
}

