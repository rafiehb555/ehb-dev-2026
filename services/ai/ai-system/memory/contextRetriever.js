const { Memory } = require("./memoryStore");
const { filterRelevantMemory } = require("../utils/relevanceEngine");

async function getContextForMessage(userMessage) {
  const latest = await Memory.find({})
    .sort({ updatedAt: -1 })
    .limit(200)
    .lean();

  return filterRelevantMemory(latest, userMessage, Number(process.env.CONTEXT_LIMIT || 12));
}

module.exports = {
  getContextForMessage,
};
