const { getContextForMessage } = require("../../ai-system/memory/contextRetriever");
const { askOpenAI } = require("../../ai-system/openai/openaiClient");
const { buildPromptMessages } = require("../../ai-system/openai/promptBuilder");
const { listMemory, upsertMemory, Memory } = require("../../ai-system/memory/memoryStore");
const { extractStructuredMemory } = require("../../ai-system/agents/devAgent");
const { detectMissingAreas } = require("../../ai-system/agents/plannerAgent");
const { looksDuplicate } = require("../../ai-system/utils/relevanceEngine");

const ALLOWED_MODES = new Set([
  "product_manager",
  "uiux_designer",
  "backend_engineer",
  "blockchain_architect",
]);

async function postChat(req, res, next) {
  try {
    const { message, mode = "backend_engineer" } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    const safeMode = ALLOWED_MODES.has(mode) ? mode : "backend_engineer";
    const context = await getContextForMessage(message);
    const messages = buildPromptMessages({
      userMessage: message,
      memoryContext: context,
      mode: safeMode,
    });

    const aiResponse = await askOpenAI(messages);
    const plannerHints = detectMissingAreas(message, context);
    const memoryUpdates = extractStructuredMemory(message, aiResponse);

    let savedCount = 0;
    for (const item of memoryUpdates) {
      const existing = await Memory.findOne({ key: item.key, category: item.category }).lean();
      if (!looksDuplicate(existing, item)) {
        await upsertMemory(item);
        savedCount += 1;
      }
    }

    res.json({
      mode: safeMode,
      response: aiResponse,
      plannerHints,
      memorySaved: savedCount,
      memoryContextUsed: context.length,
    });
  } catch (error) {
    next(error);
  }
}

async function getMemory(req, res, next) {
  try {
    const limit = Number(req.query.limit || 100);
    const items = await listMemory(limit);
    res.json({ count: items.length, items });
  } catch (error) {
    next(error);
  }
}

async function postMemoryUpdate(req, res, next) {
  try {
    const { key, category, value, tags, importance, source } = req.body;
    if (!key || typeof key !== "string") {
      return res.status(400).json({ error: "key is required" });
    }
    if (typeof value === "undefined") {
      return res.status(400).json({ error: "value is required" });
    }

    const saved = await upsertMemory({ key, category, value, tags, importance, source });
    res.status(201).json({ message: "Memory updated", item: saved });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  postChat,
  getMemory,
  postMemoryUpdate,
};
