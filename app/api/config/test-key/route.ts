import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyType, keyValue, channelId } = body as {
      keyType: string;
      keyValue: string;
      channelId?: string;
    };

    if (!keyType || !keyValue) {
      return NextResponse.json(
        { success: false, message: "Tipo e valor da chave são obrigatórios" },
        { status: 400 }
      );
    }

    let success = false;
    let message = "";

    switch (keyType) {
      case "youtube_api_key": {
        // Testar YouTube API
        const testChannelId = channelId || "UC_x5XG1OV2P6uZZ5FSM9Ttw"; // Canal do Google Developers
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${testChannelId}&key=${keyValue}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            success = true;
            message = "YouTube API Key válida!";
          } else {
            success = true;
            message = "Key válida (canal não encontrado, mas API funciona)";
          }
        } else {
          const error = await response.json();
          message = error.error?.message || "Chave inválida";
        }
        break;
      }

      case "youtube_channel_id": {
        // Apenas validar formato do Channel ID
        if (keyValue.startsWith("UC") && keyValue.length >= 20) {
          success = true;
          message = "Formato de Channel ID válido";
        } else {
          message = "Channel ID deve começar com 'UC' e ter pelo menos 20 caracteres";
        }
        break;
      }

      case "openai_api_key": {
        const response = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${keyValue}` },
        });
        if (response.ok) {
          success = true;
          message = "OpenAI API Key válida!";
        } else {
          const error = await response.json();
          message = error.error?.message || "Chave inválida";
        }
        break;
      }

      case "google_api_key": {
        // Testar Google Gemini API
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models?key=${keyValue}`
        );
        if (response.ok) {
          success = true;
          message = "Google Gemini API Key válida!";
        } else {
          const error = await response.json();
          message = error.error?.message || "Chave inválida";
        }
        break;
      }

      case "anthropic_api_key": {
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
        // Anthropic retorna 200 mesmo para teste simples
        if (response.ok || response.status === 400) {
          // 400 pode ser por limite, mas a key é válida
          success = true;
          message = "Anthropic API Key válida!";
        } else if (response.status === 401) {
          message = "Chave inválida ou sem permissão";
        } else {
          success = true; // Outros erros podem ser por rate limit
          message = "Key parece válida (pode haver rate limit)";
        }
        break;
      }

      case "pexels_api_key": {
        const response = await fetch(
          "https://api.pexels.com/v1/search?query=test&per_page=1",
          { headers: { Authorization: keyValue } }
        );
        if (response.ok) {
          success = true;
          message = "Pexels API Key válida!";
        } else {
          message = "Chave inválida";
        }
        break;
      }

      case "pixabay_api_key": {
        const response = await fetch(
          `https://pixabay.com/api/?key=${keyValue}&q=test&per_page=3`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.hits) {
            success = true;
            message = "Pixabay API Key válida!";
          } else {
            message = "Resposta inválida da API";
          }
        } else {
          message = "Chave inválida";
        }
        break;
      }

      case "unsplash_api_key": {
        const response = await fetch(
          "https://api.unsplash.com/photos/random?count=1",
          { headers: { Authorization: `Client-ID ${keyValue}` } }
        );
        if (response.ok) {
          success = true;
          message = "Unsplash API Key válida!";
        } else {
          message = "Chave inválida";
        }
        break;
      }

      case "elevenlabs_api_key": {
        const response = await fetch("https://api.elevenlabs.io/v1/voices", {
          headers: { "xi-api-key": keyValue },
        });
        if (response.ok) {
          success = true;
          message = "ElevenLabs API Key válida!";
        } else {
          message = "Chave inválida";
        }
        break;
      }

      case "tavily_api_key": {
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
          message = "Tavily API Key válida!";
        } else {
          message = "Chave inválida";
        }
        break;
      }

      case "replicate_api_key": {
        const response = await fetch("https://api.replicate.com/v1/models", {
          headers: { Authorization: `Token ${keyValue}` },
        });
        if (response.ok) {
          success = true;
          message = "Replicate API Key válida!";
        } else {
          message = "Chave inválida";
        }
        break;
      }

      case "stability_api_key": {
        const response = await fetch(
          "https://api.stability.ai/v1/engines/list",
          { headers: { Authorization: `Bearer ${keyValue}` } }
        );
        if (response.ok) {
          success = true;
          message = "Stability AI API Key válida!";
        } else {
          message = "Chave inválida";
        }
        break;
      }

      case "json2video_api_key": {
        // JSON2Video não tem endpoint de teste fácil, apenas validar formato
        if (keyValue.length >= 10) {
          success = true;
          message = "JSON2Video Key salva (será validada no uso)";
        } else {
          message = "Chave parece muito curta";
        }
        break;
      }

      default:
        message = `Tipo de chave desconhecido: ${keyType}`;
    }

    return NextResponse.json({ success, message });
  } catch (error) {
    console.error("Erro ao testar chave:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Erro ao testar chave",
      },
      { status: 500 }
    );
  }
}
