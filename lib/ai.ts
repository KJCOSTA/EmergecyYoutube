import { AIProvider, AIModelOption, Diretriz } from "@/types";

export const AI_MODELS: Record<AIProvider, AIModelOption[]> = {
  openai: [
    { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "openai" },
  ],
  google: [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "google" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "google" },
    { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash", provider: "google" },
  ],
  anthropic: [
    { id: "claude-3-5-sonnet-latest", name: "Claude 3.5 Sonnet", provider: "anthropic" },
    { id: "claude-3-5-haiku-latest", name: "Claude 3.5 Haiku", provider: "anthropic" },
  ],
};

export function getModelsForProvider(provider: AIProvider): AIModelOption[] {
  return AI_MODELS[provider] || [];
}

export function getProviderName(provider: AIProvider): string {
  const names: Record<AIProvider, string> = {
    openai: "OpenAI",
    google: "Google Gemini",
    anthropic: "Anthropic Claude",
  };
  return names[provider];
}

export function buildSystemPromptWithDiretrizes(
  basePrompt: string,
  diretrizes: Diretriz[],
  scope: Diretriz["appliesTo"][number]
): string {
  const applicableDiretrizes = diretrizes.filter(
    (d) => d.active && d.appliesTo.includes(scope)
  );

  if (applicableDiretrizes.length === 0) {
    return basePrompt;
  }

  const diretrizesText = applicableDiretrizes
    .map((d) => `### ${d.title}\n${d.systemPrompt}`)
    .join("\n\n");

  return `${basePrompt}

## Diretrizes Adicionais (MUST FOLLOW):
${diretrizesText}`;
}

export interface GenerationRequest {
  provider: AIProvider;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export async function generateWithAI(request: GenerationRequest): Promise<string> {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "AI generation failed");
  }

  const data = await response.json();
  return data.text;
}

export async function streamWithAI(
  request: GenerationRequest,
  onChunk: (chunk: string) => void
): Promise<void> {
  const response = await fetch("/api/ai/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "AI streaming failed");
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    onChunk(chunk);
  }
}
