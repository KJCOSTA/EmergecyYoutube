import { prisma } from '@/lib/db';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

interface Scene {
  id: number;
  duration: number;
  narration: string;
  visualDescription: string;
  mediaType: 'video' | 'image' | 'animation';
  transition: string;
}

interface StoryboardResult {
  scenes: Scene[];
}

interface ScriptData {
  title: string;
  content: string;
  sections?: {
    hook: string;
    body: string[];
    cta: string;
  };
}

export const storyboardService = {
  /**
   * Generate storyboard from script
   */
  async generate(projectId: string, script: ScriptData): Promise<StoryboardResult> {
    // Update storyboard status
    await prisma.storyboard.upsert({
      where: { projectId },
      create: { projectId, status: 'in_progress' },
      update: { status: 'in_progress' },
    });

    try {
      const { text } = await generateText({
        model: anthropic('claude-sonnet-4-20250514'),
        system: `You are a video storyboard specialist.
Create detailed scene-by-scene breakdowns for video production.
Always respond in valid JSON format.`,
        prompt: `Create a storyboard for this script:

Title: ${script.title}
Content: ${script.content}

For each scene, specify:
1. Duration (seconds)
2. Narration text
3. Visual description (what should be on screen)
4. Media type (video, image, animation)
5. Transition to next scene

Return JSON:
{
  "scenes": [
    {
      "id": 1,
      "duration": 5,
      "narration": "Text to speak",
      "visualDescription": "What appears on screen",
      "mediaType": "video",
      "transition": "fade"
    }
  ]
}`,
      });

      // Parse the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const result: StoryboardResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { scenes: [] };

      // Save storyboard
      await prisma.storyboard.update({
        where: { projectId },
        data: {
          scenes: JSON.parse(JSON.stringify(result.scenes)),
          status: 'completed',
        },
      });

      return result;
    } catch (error) {
      await prisma.storyboard.update({
        where: { projectId },
        data: { status: 'failed' },
      });
      throw error;
    }
  },
};
