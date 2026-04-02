export type OpenAIResponsePayload = {
  model: string;
  input: Array<{
    role: "system" | "user";
    content: Array<{ type: "input_text"; text: string }>;
  }>;
  max_output_tokens: number;
  temperature: number;
};

export type MemoryBrainResult = {
  answer: string;
  model: string;
  usage: unknown;
};
