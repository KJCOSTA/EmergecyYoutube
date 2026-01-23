import { prisma } from '@/lib/db';

interface Scene {
  id: number;
  duration: number;
  narration: string;
  visualDescription: string;
  mediaType: 'video' | 'image' | 'animation';
  transition: string;
}

interface StoryboardData {
  scenes: Scene[];
}

interface RenderJobResult {
  externalJobId: string;
  status: string;
}

interface RenderStatusResult {
  completed: boolean;
  failed: boolean;
  videoUrl?: string;
  error?: string;
}

export const renderService = {
  /**
   * Submit render job to JSON2VIDEO
   */
  async submit(projectId: string, storyboard: StoryboardData): Promise<RenderJobResult> {
    // Get project data
    await prisma.project.findUnique({
      where: { id: projectId },
      include: { script: true },
    });

    // TODO: Integrate with JSON2VIDEO API using storyboard.scenes
    // For now, we create a mock job
    const sceneCount = storyboard.scenes?.length || 0;
    const externalJobId = `job_${Date.now()}_${projectId.slice(0, 8)}_scenes_${sceneCount}`;

    // Create render record
    await prisma.render.upsert({
      where: { projectId },
      create: {
        projectId,
        externalJobId,
        status: 'processing',
      },
      update: {
        externalJobId,
        status: 'processing',
      },
    });

    return {
      externalJobId,
      status: 'processing',
    };
  },

  /**
   * Check render job status
   */
  async checkStatus(projectId: string, externalJobId: string): Promise<RenderStatusResult> {
    const render = await prisma.render.findUnique({
      where: { projectId },
    });

    if (!render) {
      return { completed: false, failed: true, error: 'Render not found' };
    }

    // Verify job ID matches
    if (render.externalJobId !== externalJobId) {
      return { completed: false, failed: true, error: 'Job ID mismatch' };
    }

    // TODO: Check JSON2VIDEO API for actual status
    // For now, mock as completed after creation
    const mockVideoUrl = `https://storage.example.com/videos/${projectId}.mp4`;

    await prisma.render.update({
      where: { projectId },
      data: {
        status: 'completed',
        videoUrl: mockVideoUrl,
        thumbnailUrl: `https://storage.example.com/thumbnails/${projectId}.jpg`,
        duration: 600, // 10 minutes
      },
    });

    return {
      completed: true,
      failed: false,
      videoUrl: mockVideoUrl,
    };
  },
};
