import { NextRequest } from "next/server";

// Mapeamento de headers para variáveis de ambiente
const KEY_MAPPING: Record<string, string> = {
  "x-youtube-api-key": "YOUTUBE_API_KEY",
  "x-youtube-channel-id": "YOUTUBE_CHANNEL_ID",
  "x-openai-api-key": "OPENAI_API_KEY",
  "x-google-api-key": "GOOGLE_GENERATIVE_AI_API_KEY",
  "x-anthropic-api-key": "ANTHROPIC_API_KEY",
  "x-pexels-api-key": "PEXELS_API_KEY",
  "x-pixabay-api-key": "PIXABAY_API_KEY",
  "x-unsplash-api-key": "UNSPLASH_ACCESS_KEY",
  "x-json2video-api-key": "JSON2VIDEO_API_KEY",
  "x-elevenlabs-api-key": "ELEVENLABS_API_KEY",
  "x-tavily-api-key": "TAVILY_API_KEY",
  "x-replicate-api-key": "REPLICATE_API_TOKEN",
  "x-stability-api-key": "STABILITY_API_KEY",
};

/**
 * Obtém uma API key, priorizando:
 * 1. Header da requisição (chave da sessão do usuário)
 * 2. Variável de ambiente do servidor
 */
export function getAPIKey(
  request: NextRequest,
  headerName: string
): string | undefined {
  // Primeiro, tentar obter do header
  const headerValue = request.headers.get(headerName);
  if (headerValue) {
    return headerValue;
  }

  // Segundo, tentar obter da variável de ambiente
  const envVar = KEY_MAPPING[headerName];
  if (envVar) {
    return process.env[envVar];
  }

  return undefined;
}

/**
 * Obtém múltiplas API keys de uma vez
 */
export function getAPIKeys(
  request: NextRequest,
  keys: string[]
): Record<string, string | undefined> {
  const result: Record<string, string | undefined> = {};
  for (const key of keys) {
    result[key] = getAPIKey(request, key);
  }
  return result;
}

// Helpers específicos para cada serviço
export function getYouTubeKeys(request: NextRequest) {
  return {
    apiKey: getAPIKey(request, "x-youtube-api-key"),
    channelId: getAPIKey(request, "x-youtube-channel-id"),
  };
}

export function getOpenAIKey(request: NextRequest) {
  return getAPIKey(request, "x-openai-api-key");
}

export function getGoogleKey(request: NextRequest) {
  return getAPIKey(request, "x-google-api-key");
}

export function getAnthropicKey(request: NextRequest) {
  return getAPIKey(request, "x-anthropic-api-key");
}

export function getPexelsKey(request: NextRequest) {
  return getAPIKey(request, "x-pexels-api-key");
}

export function getPixabayKey(request: NextRequest) {
  return getAPIKey(request, "x-pixabay-api-key");
}

export function getUnsplashKey(request: NextRequest) {
  return getAPIKey(request, "x-unsplash-api-key");
}

export function getJSON2VideoKey(request: NextRequest) {
  return getAPIKey(request, "x-json2video-api-key");
}

export function getElevenLabsKey(request: NextRequest) {
  return getAPIKey(request, "x-elevenlabs-api-key");
}

export function getTavilyKey(request: NextRequest) {
  return getAPIKey(request, "x-tavily-api-key");
}

export function getReplicateKey(request: NextRequest) {
  return getAPIKey(request, "x-replicate-api-key");
}

export function getStabilityKey(request: NextRequest) {
  return getAPIKey(request, "x-stability-api-key");
}
