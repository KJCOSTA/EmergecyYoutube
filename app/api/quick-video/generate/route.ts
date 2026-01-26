import { NextRequest } from "next/server";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

// Tipos
interface ScriptSection {
  text: string;
  duration: number;
}

interface StoryboardScene {
  id: string;
  text: string;
  duration: number;
  media: { url: string; type: "image" | "video" } | null;
  searchQuery: string;
}

// Helper para streaming de progresso
function createProgressStream() {
  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
    },
  });

  const sendProgress = (data: {
    step: string;
    progress: number;
    message: string;
    videoUrl?: string;
    error?: string;
  }) => {
    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
  };

  const close = () => controller.close();

  return { stream, sendProgress, close };
}

// Gerar roteiro com IA
async function generateScript(
  theme: string,
  duration: number
): Promise<ScriptSection[]> {
  const prompt = `Crie um roteiro de vídeo profissional e envolvente sobre: "${theme}"

REQUISITOS:
- Duração total: ${duration} segundos
- Divida em 4-6 seções curtas e impactantes
- Cada seção deve ter texto claro e direto
- Inclua: gancho inicial, desenvolvimento e call-to-action final
- Linguagem acessível e engajadora
- Estimativa de tempo para cada seção

FORMATO DE RESPOSTA (apenas JSON):
{
  "sections": [
    {
      "text": "Texto da seção aqui (1-2 frases curtas)",
      "duration": 10
    }
  ]
}`;

  // Tentar OpenAI primeiro
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const openai = new OpenAI({ apiKey: openaiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const result = JSON.parse(content);
        return result.sections;
      }
    } catch (error) {
      console.error("OpenAI failed:", error);
    }
  }

  // Tentar Google Gemini
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (googleKey) {
    try {
      const genAI = new GoogleGenerativeAI(googleKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Extrair JSON da resposta
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.sections;
      }
    } catch (error) {
      console.error("Google failed:", error);
    }
  }

  // Tentar Anthropic Claude
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      const response = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.content[0];
      if (content.type === "text") {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed.sections;
        }
      }
    } catch (error) {
      console.error("Anthropic failed:", error);
    }
  }

  // Fallback: roteiro básico manual
  console.warn("All AI providers failed, using fallback script");
  const sectionDuration = Math.floor(duration / 5);
  return [
    { text: `Você sabia sobre ${theme}? Vou te mostrar algo incrível!`, duration: sectionDuration },
    { text: `Esse assunto é muito importante e pode mudar sua perspectiva.`, duration: sectionDuration },
    { text: `Veja como isso funciona na prática e os benefícios.`, duration: sectionDuration },
    { text: `Milhares de pessoas já estão aproveitando essas dicas.`, duration: sectionDuration },
    { text: `Não esqueça de curtir e se inscrever para mais conteúdo!`, duration: sectionDuration },
  ];
}

// Criar storyboard a partir do roteiro
function createStoryboard(sections: ScriptSection[]): StoryboardScene[] {
  return sections.map((section, index) => {
    // Gerar query de busca baseada no texto
    const searchQuery = generateSearchQuery(section.text);

    return {
      id: `scene-${index}`,
      text: section.text,
      duration: section.duration,
      media: null,
      searchQuery,
    };
  });
}

// Gerar query de busca inteligente
function generateSearchQuery(text: string): string {
  // Remover pontuação e palavras comuns
  const stopWords = ["o", "a", "os", "as", "de", "da", "do", "em", "para", "com", "por", "e", "que", "você", "seu", "sua"];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter((w) => w.length > 3 && !stopWords.includes(w));

  // Pegar 2-3 palavras principais
  const mainWords = words.slice(0, 3).join(" ");
  return mainWords || "business professional";
}

// Buscar mídia no Pexels
async function searchPexels(query: string): Promise<{ url: string; type: "image" | "video" } | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;

  try {
    // Tentar vídeos primeiro
    const videoRes = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=5`,
      { headers: { Authorization: apiKey } }
    );

    if (videoRes.ok) {
      const data = await videoRes.json();
      if (data.videos && data.videos.length > 0) {
        const video = data.videos[0];
        const hdFile = video.video_files.find((f: any) => f.quality === "hd");
        if (hdFile) {
          return { url: hdFile.link, type: "video" };
        }
      }
    }

    // Fallback para imagens
    const imageRes = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`,
      { headers: { Authorization: apiKey } }
    );

    if (imageRes.ok) {
      const data = await imageRes.json();
      if (data.photos && data.photos.length > 0) {
        return { url: data.photos[0].src.large, type: "image" };
      }
    }
  } catch (error) {
    console.error("Pexels search failed:", error);
  }

  return null;
}

// Buscar mídia no Pixabay
async function searchPixabay(query: string): Promise<{ url: string; type: "image" | "video" } | null> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return null;

  try {
    // Tentar vídeos
    const videoRes = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=5`
    );

    if (videoRes.ok) {
      const data = await videoRes.json();
      if (data.hits && data.hits.length > 0) {
        const video = data.hits[0].videos.medium;
        if (video) {
          return { url: video.url, type: "video" };
        }
      }
    }

    // Fallback para imagens
    const imageRes = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=5&image_type=photo`
    );

    if (imageRes.ok) {
      const data = await imageRes.json();
      if (data.hits && data.hits.length > 0) {
        return { url: data.hits[0].largeImageURL, type: "image" };
      }
    }
  } catch (error) {
    console.error("Pixabay search failed:", error);
  }

  return null;
}

// Buscar mídia (tenta múltiplas fontes)
async function searchMedia(query: string): Promise<{ url: string; type: "image" | "video" } | null> {
  // Tentar Pexels primeiro
  let media = await searchPexels(query);
  if (media) return media;

  // Fallback para Pixabay
  media = await searchPixabay(query);
  if (media) return media;

  // Se tudo falhar, usar placeholder
  return {
    url: `https://placehold.co/1920x1080/1a1a1a/ffffff?text=${encodeURIComponent(query)}`,
    type: "image",
  };
}

// Renderizar vídeo com JSON2Video
async function renderVideo(storyboard: StoryboardScene[]): Promise<string> {
  const apiKey = process.env.JSON2VIDEO_API_KEY;
  if (!apiKey) {
    throw new Error("JSON2Video API key não configurada");
  }

  const project = {
    resolution: "full-hd",
    quality: "high",
    scenes: storyboard.map((scene) => ({
      comment: scene.text.substring(0, 50),
      duration: scene.duration,
      elements: [
        // Background media
        scene.media
          ? {
              type: scene.media.type === "video" ? "video" : "image",
              src: scene.media.url,
              duration: scene.duration,
            }
          : {
              type: "color",
              color: "#1a1a1a",
              duration: scene.duration,
            },
        // Text overlay
        {
          type: "text",
          text: scene.text,
          duration: scene.duration,
          style: {
            fontSize: 32,
            fontFamily: "Arial Bold",
            color: "#ffffff",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: 20,
          },
          position: {
            x: "center",
            y: "bottom",
          },
        },
      ],
      transition: {
        type: "fade",
        duration: 0.5,
      },
    })),
  };

  // Criar render job
  const createResponse = await fetch("https://api.json2video.com/v2/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ project }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(error.message || "Falha ao criar render job");
  }

  const jobData = await createResponse.json();
  const jobId = jobData.project;

  // Polling para aguardar conclusão
  let attempts = 0;
  const maxAttempts = 60; // 5 minutos (60 * 5s)

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Aguardar 5s

    const statusResponse = await fetch(`https://api.json2video.com/v2/movies/${jobId}`, {
      headers: { "x-api-key": apiKey },
    });

    if (!statusResponse.ok) {
      throw new Error("Falha ao verificar status da renderização");
    }

    const statusData = await statusResponse.json();

    if (statusData.status === "done" && statusData.movie) {
      return statusData.movie;
    } else if (statusData.status === "failed") {
      throw new Error(statusData.error || "Renderização falhou");
    }

    attempts++;
  }

  throw new Error("Timeout: renderização demorou mais de 5 minutos");
}

export async function POST(request: NextRequest) {
  const { theme, duration = 60 } = await request.json();

  if (!theme) {
    return new Response(JSON.stringify({ error: "Tema é obrigatório" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { stream, sendProgress, close } = createProgressStream();

  // Processar em background
  (async () => {
    try {
      // Passo 1: Gerar roteiro
      sendProgress({
        step: "generating_script",
        progress: 10,
        message: "Gerando roteiro com IA...",
      });

      const scriptSections = await generateScript(theme, duration);

      sendProgress({
        step: "creating_storyboard",
        progress: 30,
        message: "Criando storyboard...",
      });

      // Passo 2: Criar storyboard
      const storyboard = createStoryboard(scriptSections);

      sendProgress({
        step: "searching_media",
        progress: 40,
        message: `Buscando mídia para ${storyboard.length} cenas...`,
      });

      // Passo 3: Buscar mídia para cada cena
      for (let i = 0; i < storyboard.length; i++) {
        const scene = storyboard[i];
        const media = await searchMedia(scene.searchQuery);
        scene.media = media;

        const progress = 40 + Math.floor((i / storyboard.length) * 30);
        sendProgress({
          step: "searching_media",
          progress,
          message: `Mídia encontrada para cena ${i + 1}/${storyboard.length}`,
        });
      }

      sendProgress({
        step: "rendering",
        progress: 70,
        message: "Renderizando vídeo final (isso pode levar alguns minutos)...",
      });

      // Passo 4: Renderizar vídeo
      const videoUrl = await renderVideo(storyboard);

      sendProgress({
        step: "completed",
        progress: 100,
        message: "Vídeo gerado com sucesso!",
        videoUrl,
      });
    } catch (error) {
      console.error("Quick video generation error:", error);
      sendProgress({
        step: "error",
        progress: 0,
        message: "Erro ao gerar vídeo",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    } finally {
      close();
    }
  })();

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
