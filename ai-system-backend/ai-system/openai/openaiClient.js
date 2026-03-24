const OpenAI = require("openai");

let client = null;

async function askOpenAI(messages) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing in .env");
  }
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.4,
    messages,
  });

  return completion.choices?.[0]?.message?.content || "";
}

module.exports = {
  askOpenAI,
};
