const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "for",
  "of",
  "in",
  "on",
  "is",
  "are",
  "with",
  "please",
  "about",
]);

function tokenize(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word));
}

function scoreMemoryItem(memoryItem, queryText) {
  const queryTokens = new Set(tokenize(queryText));
  const haystack = [
    memoryItem.key,
    memoryItem.category,
    ...(memoryItem.tags || []),
    JSON.stringify(memoryItem.value || {}),
  ].join(" ");

  const itemTokens = tokenize(haystack);
  let overlap = 0;
  for (const token of itemTokens) {
    if (queryTokens.has(token)) overlap += 1;
  }

  const importanceWeight = memoryItem.importance || 3;
  return overlap + importanceWeight;
}

function filterRelevantMemory(memoryList, queryText, limit = 12) {
  return [...memoryList]
    .map((item) => ({ ...item, _score: scoreMemoryItem(item, queryText) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, ...item }) => item);
}

function looksDuplicate(existing, incoming) {
  if (!existing) return false;
  return JSON.stringify(existing.value) === JSON.stringify(incoming.value);
}

module.exports = {
  filterRelevantMemory,
  looksDuplicate,
};
