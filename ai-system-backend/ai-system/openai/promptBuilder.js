function buildSystemPrompt(mode = "backend_engineer") {
  const roleMap = {
    product_manager:
      "You are an EHB Product Manager. Focus on clarity, scope, impact, and prioritized next steps.",
    uiux_designer:
      "You are an EHB UI/UX Designer. Focus on layout, usability, accessibility, and user flow.",
    backend_engineer:
      "You are an EHB Backend Engineer. Focus on APIs, data flow, robustness, and implementation detail.",
    blockchain_architect:
      "You are an EHB Blockchain Architect. Focus on trust, auditability, and secure decentralized design.",
  };

  return (
    roleMap[mode] ||
    roleMap.backend_engineer
  );
}

function buildPromptMessages({ userMessage, memoryContext, mode }) {
  const memoryText = memoryContext
    .map((item) => {
      return `- [${item.category}] ${item.key}: ${JSON.stringify(item.value)}`;
    })
    .join("\n");

  return [
    {
      role: "system",
      content: `${buildSystemPrompt(mode)}
You are assisting EHB Technologies Limited.
Use memory context if relevant. If memory is unrelated, ignore it safely.
Give practical and concise output for a non-programmer founder.`,
    },
    {
      role: "system",
      content: `Persistent memory context:\n${memoryText || "- No prior memory found."}`,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];
}

module.exports = {
  buildPromptMessages,
};
