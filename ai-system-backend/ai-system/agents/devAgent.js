function extractStructuredMemory(userMessage, aiResponse) {
  const updates = [];
  const lower = String(userMessage).toLowerCase();

  if (lower.includes("vision") || lower.includes("ecosystem")) {
    updates.push({
      key: "ehb_project_vision",
      category: "vision",
      value: {
        note: userMessage,
        lastAssistantAdvice: aiResponse.slice(0, 500),
      },
      tags: ["ehb", "vision", "ecosystem"],
      importance: 5,
      source: "ai_chat",
    });
  }

  if (lower.includes("pss") || lower.includes("edr") || lower.includes("franchise")) {
    updates.push({
      key: `dept_${Date.now()}`,
      category: "department",
      value: { note: userMessage },
      tags: ["ehb", "department"],
      importance: 4,
      source: "ai_chat",
    });
  }

  updates.push({
    key: `chat_${Date.now()}`,
    category: "chat",
    value: {
      userMessage,
      aiResponse: aiResponse.slice(0, 1200),
    },
    tags: ["chat"],
    importance: 2,
    source: "ai_chat",
  });

  return updates;
}

module.exports = {
  extractStructuredMemory,
};
