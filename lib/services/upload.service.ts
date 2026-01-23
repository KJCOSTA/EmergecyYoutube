import { prisma } from '@/lib/db';

interface VideoData {
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
}

interface UploadResult {
  youtubeVideoId: string;
  youtubeUrl: string;
}

export const uploadService = {
  /**
   * Upload video to YouTube
   */
  async upload(projectId: string, video: VideoData): Promise<UploadResult> {
    // Get project with script for title/description
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { script: true },
    });

    if (!project?.script) {
      throw new Error('Script not found');
    }

    // Get or create upload record
    let upload = await prisma.upload.findUnique({
      where: { projectId },
    });

    if (!upload) {
      upload = await prisma.upload.create({
        data: {
          projectId,
          title: project.script.title || project.name,
          status: 'pending',
        },
      });
    }

    // TODO: Integrate with YouTube Data API
    // For now, mock the upload
    const mockVideoId = `YT_${Date.now()}_${projectId.slice(0, 8)}`;
    const mockYoutubeUrl = `https://youtube.com/watch?v=${mockVideoId}`;

    // Log video data for future integration
    console.log('[Upload Service] Video data:', {
      projectId,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
    });

    await prisma.upload.update({
      where: { projectId },
      data: {
        youtubeVideoId: mockVideoId,
        youtubeUrl: mockYoutubeUrl,
        title: project.script.title || project.name,
        description: project.script.content?.slice(0, 500) || '',
        publishedAt: new Date(),
        status: 'completed',
      },
    });

    return {
      youtubeVideoId: mockVideoId,
      youtubeUrl: mockYoutubeUrl,
    };
  },
};
