import Anthropic from "@anthropic-ai/sdk";

let anthropic: Anthropic | null = null;

function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  anthropic ??= new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  return anthropic;
}

export async function generateJsonAdvisory<TFallback>(
  systemPrompt: string,
  userPrompt: string,
  fallback: TFallback
): Promise<TFallback> {
  const client = getAnthropicClient();
  if (!client) {
    return fallback;
  }

  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";
  const message = await client.messages.create({
    model: model as never,
    max_tokens: 1200,
    temperature: 0.2,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }]
  });

  const text = message.content
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();

  try {
    return JSON.parse(text) as TFallback;
  } catch {
    return fallback;
  }
}
