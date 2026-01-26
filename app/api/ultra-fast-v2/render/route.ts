import { NextRequest } from "next/server";
import { OpenAI } from "openai";

// Helper para streaming
function createProgressStream() {
  let controller: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
    },
  });

  const send = (data: any) => {
    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
  };

  const close = () => controller.close();

  return { stream, send, close };
}

// Gerar TTS se configurado
async function generateTTS(text: string, provider: string, voice: string): Promise<string | null> {
  if (provider === "none") return null;

  try {
    if (provider === "openai") {
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) return null;

      const openai = new OpenAI({ apiKey: openaiKey });
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice as any,
        input: text,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      const base64 = buffer.toString("base64");
      return `data:audio/mp3;base64,${base64}`;
    }

    // Outros provedores TTS podem ser implementados aqui
    // ElevenLabs, Google, etc.

    return null;
  } catch (error) {
    console.error("TTS generation failed:", error);
    return null;
  }
}

// Trilhas sonoras de exemplo (URLs públicas)
const SOUNDTRACKS: Record<string, string> = {
  upbeat: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  chill: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  corporate: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  cinematic: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
};

export async function POST(request: NextRequest) {
  const { storyboard, config } = await request.json();

  const { stream, send, close } = createProgressStream();

  // Processar em background
  (async () => {
    try {
      send({ status: "starting", progress: 5 });

      // Gerar áudio de narração se configurado
      let audioUrl: string | null = null;
      if (config.tts !== "none") {
        send({ status: "generating_audio", progress: 15 });

        const fullText = storyboard.map((scene: any) => scene.text).join(" ");
        audioUrl = await generateTTS(fullText, config.tts, config.ttsVoice);
      }

      send({ status: "building_project", progress: 30 });

      // Montar projeto JSON2Video
      const apiKey = process.env.JSON2VIDEO_API_KEY;
      if (!apiKey) {
        throw new Error("JSON2Video API key não configurada");
      }

      const resolution = config.quality === "4k" ? "4k" : "full-hd";

      const project = {
        resolution,
        quality: "high",
        scenes: storyboard.map((scene: any) => ({
          comment: scene.text.substring(0, 50),
          duration: scene.duration,
          elements: [
            // Mídia de fundo
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
            // Texto overlay
            {
              type: "text",
              text: scene.text,
              duration: scene.duration,
              style: {
                fontSize: config.quality === "4k" ? 48 : 32,
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
            duration: 0.8,
          },
        })),
        // Música de fundo
        ...(config.soundtrack && SOUNDTRACKS[config.soundtrack]
          ? {
              soundtrack: {
                src: SOUNDTRACKS[config.soundtrack],
                volume: 0.25,
              },
            }
          : {}),
        // Áudio de narração
        ...(audioUrl
          ? {
              soundtrack: {
                src: audioUrl,
                volume: 1.0,
              },
            }
          : {}),
      };

      send({ status: "rendering", progress: 40 });

      // Criar job de renderização
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
        throw new Error(error.message || "Falha ao criar job de renderização");
      }

      const jobData = await createResponse.json();
      const jobId = jobData.project;

      // Polling para aguardar conclusão
      let attempts = 0;
      const maxAttempts = 120; // 10 minutos (120 * 5s)

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const statusResponse = await fetch(
          `https://api.json2video.com/v2/movies/${jobId}`,
          { headers: { "x-api-key": apiKey } }
        );

        if (!statusResponse.ok) {
          throw new Error("Falha ao verificar status da renderização");
        }

        const statusData = await statusResponse.json();

        // Atualizar progresso (40% a 95%)
        const renderProgress = statusData.progress || 0;
        const overallProgress = 40 + Math.floor((renderProgress / 100) * 55);
        send({ status: "rendering", progress: overallProgress });

        if (statusData.status === "done" && statusData.movie) {
          send({
            status: "completed",
            progress: 100,
            videoUrl: statusData.movie,
          });
          close();
          return;
        } else if (statusData.status === "failed") {
          throw new Error(statusData.error || "Renderização falhou");
        }

        attempts++;
      }

      throw new Error("Timeout: renderização demorou mais de 10 minutos");
    } catch (error) {
      console.error("Render error:", error);
      send({
        status: "error",
        progress: 0,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
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
