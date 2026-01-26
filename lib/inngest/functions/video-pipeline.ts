import { inngest } from "@/lib/inngest/client";

/**
 * Video Pipeline (AUTOMÁTICO)
 * Responsabilidade: apenas ORQUESTRAR o workflow
 * Research -> Script -> Storyboard -> Render -> Upload
 *
 * Stubs controlados onde não há implementação real.
 */
export const videoWorkflow = inngest.createFunction(
  {
    id: "video-pipeline",
    name: "Video Production Pipeline",
  },
  {
    event: "video/start",
  },
  async ({ event, step, logger }) => {
    const { projectId, topic, autoMode = true } = event.data;

    logger.info("🎬 Pipeline iniciado", { projectId, topic, autoMode });

    const research = await step.run("research", async () => {
      logger.info("🔍 Research");
      return {
        summary: `Pesquisa inicial sobre: ${topic}`,
        sources: [],
      };
    });

    const script = await step.run("script", async () => {
      logger.info("📝 Script");
      return {
        text: `Roteiro baseado na pesquisa: ${research.summary}`,
      };
    });

    const storyboard = await step.run("storyboard", async () => {
      logger.info("🎨 Storyboard");
      return { frames: [] };
    });

    const render = await step.run("render", async () => {
      logger.info("🎞️ Render");
      return { videoUrl: "placeholder-video.mp4" };
    });

    const upload = await step.run("upload", async () => {
      logger.info("🚀 Upload (stub)");
      return {
        provider: "youtube",
        videoId: "stub-video-id",
        status: "simulated",
      };
    });

    logger.info("✅ Pipeline finalizado", { projectId, upload });

    return {
      success: true,
      projectId,
      research,
      script,
      storyboard,
      render,
      upload,
    };
  }
);


// Export esperado pelo handler do Inngest
export const functions = [videoWorkflow];
