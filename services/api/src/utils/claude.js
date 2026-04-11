// This helper sends requests to the Claude API.
// It is intentionally simple so beginners can understand the integration point.
const callClaude = async ({ system = "", userPrompt = "", maxTokens = 512 }) => {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error("CLAUDE_API_KEY is missing. Add it to your environment variables.");
  }

  // We send the request to Anthropic's Messages API.
  // Replace the placeholder values later if your Claude setup changes.
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-latest",
      max_tokens: maxTokens,
      system,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API request failed: ${errorText}`);
  }

  const data = await response.json();

  return data;
};

module.exports = {
  callClaude,
};
