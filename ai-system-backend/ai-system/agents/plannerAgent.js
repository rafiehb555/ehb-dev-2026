function detectMissingAreas(userMessage = "", contextItems = []) {
  const text = `${userMessage} ${JSON.stringify(contextItems)}`.toLowerCase();
  const ideas = [];

  if (!text.includes("security")) ideas.push("Add security checklist for auth, validation, and secrets.");
  if (!text.includes("testing")) ideas.push("Add unit + API integration tests before production rollout.");
  if (!text.includes("monitor")) ideas.push("Define monitoring and alerting for AI/API failures.");
  if (!text.includes("cost")) ideas.push("Add token and API cost tracking dashboard.");

  return ideas.slice(0, 4);
}

module.exports = {
  detectMissingAreas,
};
