import { NextRequest, NextResponse } from "next/server";

// Map service IDs to environment variable names
const ENV_MAP: Record<string, { key: string; secondary?: string }> = {
  youtube: { key: "YOUTUBE_API_KEY", secondary: "YOUTUBE_CHANNEL_ID" },
  openai: { key: "OPENAI_API_KEY" },
  google: { key: "GOOGLE_GENERATIVE_AI_API_KEY" },
  anthropic: { key: "ANTHROPIC_API_KEY" },
  pexels: { key: "PEXELS_API_KEY" },
  pixabay: { key: "PIXABAY_API_KEY" },
  unsplash: { key: "UNSPLASH_ACCESS_KEY" },
  elevenlabs: { key: "ELEVENLABS_API_KEY" },
  tavily: { key: "TAVILY_API_KEY" },
  replicate: { key: "REPLICATE_API_TOKEN" },
  stability: { key: "STABILITY_API_KEY" },
  json2video: { key: "JSON2VIDEO_API_KEY" },
};

// Map key types to service IDs
const KEY_TYPE_TO_SERVICE: Record<string, string> = {
  youtube_api_key: "youtube",
  openai_api_key: "openai",
  google_api_key: "google",
  anthropic_api_key: "anthropic",
  pexels_api_key: "pexels",
  pixabay_api_key: "pixabay",
  unsplash_api_key: "unsplash",
  elevenlabs_api_key: "elevenlabs",
  tavily_api_key: "tavily",
  replicate_api_key: "replicate",
  stability_api_key: "stability",
  json2video_api_key: "json2video",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both old interface (keyType, keyValue) and new interface (service)
    let service = body.service;
    let keyValue = body.keyValue;
    let channelId = body.channelId;

    // If old interface with keyType
    if (body.keyType && !service) {
      service = KEY_TYPE_TO_SERVICE[body.keyType] || body.keyType.replace("_api_key", "");
    }

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service or keyType is required" },
        { status: 400 }
      );
    }

    // Get key from headers if not in body
    const headerKey = `x-${service.replace(/_/g, "-")}-api-key`;
    const headerKeyAlt = `x-${service}-api-key`;
    if (!keyValue) {
      keyValue = request.headers.get(headerKey) ||
                 request.headers.get(headerKeyAlt) ||
                 request.headers.get(`x-${service}_api_key`.replace(/_/g, "-"));
    }

    // Fall back to environment variable
    const envConfig = ENV_MAP[service];
    if (!keyValue && envConfig) {
      keyValue = process.env[envConfig.key];
      if (envConfig.secondary && !channelId) {
        channelId = process.env[envConfig.secondary];
      }
    }

    if (!keyValue) {
      return NextResponse.json({
        success: false,
        error: "Chave não configurada",
        details: `Nenhuma chave encontrada para ${service}. Configure via Vercel Environment Variables ou insira manualmente.`,
      });
    }

    let success = false;
    let message = "";
    let details = "";

    switch (service) {
      case "youtube": {
        const testChannelId = channelId || process.env.YOUTUBE_CHANNEL_ID || "UC_x5XG1OV2P6uZZ5FSM9Ttw";
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${testChannelId}&key=${keyValue}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            success = true;
            message = "YouTube API conectado!";
            details = `Canal: ${data.items[0].snippet.title}`;
          } else {
            success = true;
            message = "YouTube API válida (canal não encontrado)";
          }
        } else {
          const error = await response.json();
          message = "Falha na conexão";
          details = error.error?.message || "Chave inválida ou quota excedida";
        }
        break;
      }

      case "openai": {
        const response = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${keyValue}` },
        });
        if (response.ok) {
          success = true;
          message = "OpenAI conectado!";
          details = "GPT-4, DALL-E disponíveis";
        } else {
          const error = await response.json();
          message = "Falha na conexão";
          details = error.error?.message || "Chave inválida";
        }
        break;
      }

      case "google": {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models?key=${keyValue}`
        );
        if (response.ok) {
          success = true;
          message = "Google Gemini conectado!";
          details = "Gemini Pro, Vision disponíveis";
        } else {
          const error = await response.json();
          message = "Falha na conexão";
          details = error.error?.message || "Chave inválida";
        }
        break;
      }

      case "anthropic": {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": keyValue,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 1,
            messages: [{ role: "user", content: "Hi" }],
          }),
        });
        if (response.ok || response.status === 400 || response.status === 429) {
          success = true;
          message = "Anthropic conectado!";
          details = "Claude 3.5 disponível";
        } else if (response.status === 401) {
          message = "Falha na conexão";
          details = "Chave inválida ou sem permissão";
        } else {
          success = true;
          message = "Anthropic conectado (com limitações)";
          details = "Pode haver rate limit ativo";
        }
        break;
      }

      case "pexels": {
        const response = await fetch(
          "https://api.pexels.com/v1/search?query=test&per_page=1",
          { headers: { Authorization: keyValue } }
        );
        if (response.ok) {
          success = true;
          message = "Pexels conectado!";
          details = "Biblioteca de mídia disponível";
        } else {
          message = "Falha na conexão";
          details = "Chave inválida";
        }
        break;
      }

      case "pixabay": {
        const response = await fetch(
          `https://pixabay.com/api/?key=${keyValue}&q=test&per_page=3`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.hits) {
            success = true;
            message = "Pixabay conectado!";
            details = "Biblioteca de mídia disponível";
          } else {
            message = "Falha na conexão";
            details = "Resposta inválida da API";
          }
        } else {
          message = "Falha na conexão";
          details = "Chave inválida";
        }
        break;
      }

      case "unsplash": {
        const response = await fetch(
          "https://api.unsplash.com/photos/random?count=1",
          { headers: { Authorization: `Client-ID ${keyValue}` } }
        );
        if (response.ok) {
          success = true;
          message = "Unsplash conectado!";
          details = "Biblioteca de imagens disponível";
        } else {
          message = "Falha na conexão";
          details = "Chave inválida";
        }
        break;
      }

      case "elevenlabs": {
        const response = await fetch("https://api.elevenlabs.io/v1/voices", {
          headers: { "xi-api-key": keyValue },
        });
        if (response.ok) {
          const data = await response.json();
          success = true;
          message = "ElevenLabs conectado!";
          details = `${data.voices?.length || 0} vozes disponíveis`;
        } else {
          message = "Falha na conexão";
          details = "Chave inválida";
        }
        break;
      }

      case "tavily": {
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: keyValue,
            query: "test",
            max_results: 1,
          }),
        });
        if (response.ok) {
          success = true;
          message = "Tavily conectado!";
          details = "Deep research disponível";
        } else {
          const error = await response.json().catch(() => ({}));
          message = "Falha na conexão";
          details = error.message || "Chave inválida";
        }
        break;
      }

      case "replicate": {
        const response = await fetch("https://api.replicate.com/v1/models", {
          headers: { Authorization: `Token ${keyValue}` },
        });
        if (response.ok) {
          success = true;
          message = "Replicate conectado!";
          details = "Modelos de IA disponíveis";
        } else {
          message = "Falha na conexão";
          details = "Chave inválida";
        }
        break;
      }

      case "stability": {
        const response = await fetch(
          "https://api.stability.ai/v1/engines/list",
          { headers: { Authorization: `Bearer ${keyValue}` } }
        );
        if (response.ok) {
          success = true;
          message = "Stability AI conectado!";
          details = "Geração de imagens disponível";
        } else {
          message = "Falha na conexão";
          details = "Chave inválida";
        }
        break;
      }

      case "json2video": {
        if (keyValue.length >= 10) {
          success = true;
          message = "JSON2Video configurado";
          details = "Será validada no primeiro uso";
        } else {
          message = "Falha na validação";
          details = "Chave parece muito curta";
        }
        break;
      }

      default:
        message = "Serviço desconhecido";
        details = `Tipo: ${service}`;
    }

    return NextResponse.json({ success, message, details });
  } catch (error) {
    console.error("Erro ao testar chave:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno",
        details: error instanceof Error ? error.message : "Erro ao testar conexão",
      },
      { status: 500 }
    );
  }
}
