import { APIKeyStatus } from "@/types";
import { StoredAPIKeys } from "./api-keys-store";

// Check API keys from server (env vars)
export async function checkServerAPIKeys(): Promise<APIKeyStatus> {
  try {
    const response = await fetch("/api/config/keys");
    if (!response.ok) {
      throw new Error("Failed to fetch API key status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error checking API keys:", error);
    return getEmptyStatus();
  }
}

// Get empty status
function getEmptyStatus(): APIKeyStatus {
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

// Check API keys from client storage
export function checkClientAPIKeys(keys: StoredAPIKeys): APIKeyStatus {
  return {
    youtube: !!(keys.youtube_api_key && keys.youtube_channel_id),
    openai: !!keys.openai_api_key,
    google: !!keys.google_api_key,
    anthropic: !!keys.anthropic_api_key,
    pexels: !!keys.pexels_api_key,
    pixabay: !!keys.pixabay_api_key,
    unsplash: !!keys.unsplash_api_key,
    json2video: !!keys.json2video_api_key,
    elevenlabs: !!keys.elevenlabs_api_key,
    tavily: !!keys.tavily_api_key,
    replicate: !!keys.replicate_api_key,
    stability: !!keys.stability_api_key,
  };
}

// Merge server and client status (client takes precedence if key exists)
export function mergeAPIKeyStatus(server: APIKeyStatus, client: APIKeyStatus): APIKeyStatus {
  return {
    youtube: server.youtube || client.youtube,
    openai: server.openai || client.openai,
    google: server.google || client.google,
    anthropic: server.anthropic || client.anthropic,
    pexels: server.pexels || client.pexels,
    pixabay: server.pixabay || client.pixabay,
    unsplash: server.unsplash || client.unsplash,
    json2video: server.json2video || client.json2video,
    elevenlabs: server.elevenlabs || client.elevenlabs,
    tavily: server.tavily || client.tavily,
    replicate: server.replicate || client.replicate,
    stability: server.stability || client.stability,
  };
}

// Combined check - gets status from both server and client
export async function checkAPIKeys(): Promise<APIKeyStatus> {
  // Get server status
  const serverStatus = await checkServerAPIKeys();

  // Get client keys from store (need to access outside React)
  let clientStatus = getEmptyStatus();

  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("orion-api-keys");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.state?.keys) {
          clientStatus = checkClientAPIKeys(parsed.state.keys);
        }
      }
    } catch (e) {
      console.error("Error reading client keys:", e);
    }
  }

  // Merge both
  return mergeAPIKeyStatus(serverStatus, clientStatus);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _required = getRequiredKeysForStep(step);
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
