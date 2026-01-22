import { APIKeyStatus } from "@/types";

export async function checkAPIKeys(): Promise<APIKeyStatus> {
  try {
    const response = await fetch("/api/config/keys");
    if (!response.ok) {
      throw new Error("Failed to fetch API key status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error checking API keys:", error);
    return {
      youtube: false,
      openai: false,
      google: false,
      anthropic: false,
      pexels: false,
      pixabay: false,
      unsplash: false,
      json2video: false,
      elevenlabs: false,
      tavily: false,
      replicate: false,
      stability: false,
    };
  }
}

export function getRequiredKeysForStep(step: number): (keyof APIKeyStatus)[] {
  switch (step) {
    case 1:
      return ["youtube"];
    case 2:
      return ["openai", "google", "anthropic"]; // At least one AI provider
    case 4:
      return ["openai", "google", "anthropic"]; // AI for generation
    case 5:
      return ["pexels", "pixabay", "unsplash", "json2video"];
    case 6:
      return ["youtube"];
    default:
      return [];
  }
}

export function hasRequiredKeys(
  status: APIKeyStatus,
  step: number
): { hasAll: boolean; missing: string[] } {
  const required = getRequiredKeysForStep(step);
  const missing: string[] = [];

  // For AI providers, we need at least one
  if (step === 2 || step === 4) {
    const aiProviders = ["openai", "google", "anthropic"] as const;
    const hasAnyAI = aiProviders.some((provider) => status[provider]);
    if (!hasAnyAI) {
      missing.push("At least one AI provider (OpenAI, Google, or Anthropic)");
    }
  }

  // For media, we need at least one
  if (step === 5) {
    const mediaProviders = ["pexels", "pixabay", "unsplash"] as const;
    const hasAnyMedia = mediaProviders.some((provider) => status[provider]);
    if (!hasAnyMedia) {
      missing.push("At least one media provider (Pexels, Pixabay, or Unsplash)");
    }
    if (!status.json2video) {
      missing.push("JSON2Video");
    }
  }

  // YouTube is always required for steps 1 and 6
  if ((step === 1 || step === 6) && !status.youtube) {
    missing.push("YouTube API");
  }

  return {
    hasAll: missing.length === 0,
    missing,
  };
}
