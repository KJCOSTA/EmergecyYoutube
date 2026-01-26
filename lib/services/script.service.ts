import { prisma } from '@/lib/db';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

interface ScriptResult {
  title: string;
  content: string;
  sections: {
    hook: string;
    body: string[];
    cta: string;
  };
}

interface ResearchData {
  internalAnalysis?: {
    topPerformingTopics: string[];
    audienceInsights: string[];
    contentGaps: string[];
  };
  externalAnalysis?: {
    trends: string[];
    competitors: string[];
  };
}

export const scriptService = {
  /**
   * Generate script using Claude
   */
  async generate(projectId: string, topic: string, research: ResearchData): Promise<ScriptResult> {
    // Update script status
    await prisma.script.upsert({
      where: { projectId },
      create: { projectId, status: 'in_progress' },
      update: { status: 'in_progress' },
    });

    try {
      const { text } = await generateText({
        model: anthropic('claude-sonnet-4-20250514'),
        system: `You are an expert YouTube scriptwriter for the Brazilian market.
Create engaging, value-packed scripts optimized for retention.
Always respond in valid JSON format.`,
        prompt: `Create a YouTube script for: "${topic}"

Research insights:
- Top topics: ${research.internalAnalysis?.topPerformingTopics?.join(', ') || 'N/A'}
- Audience insights: ${research.internalAnalysis?.audienceInsights?.join(', ') || 'N/A'}
- Trends: ${research.externalAnalysis?.trends?.join(', ') || 'N/A'}

Requirements:
1. Hook (first 30 seconds): Grab attention immediately
2. Body: 3-5 main points with value and entertainment
3. CTA: Clear call-to-action

Return JSON:
{
  "title": "Video title (SEO optimized)",
  "content": "Full script text",
  "sections": {
    "hook": "Opening hook text",
    "body": ["Point 1 text", "Point 2 text", ...],
    "cta": "Call to action text"
  },
  "metadata": {
    "wordCount": 1500,
    "estimatedDuration": "10-12 minutes",
    "tone": "engaging and educational"
  }
}`,
      });

      // Parse the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        title: topic,
        content: text,
        sections: { hook: '', body: [], cta: '' },
      };

      // Save script
      await prisma.script.update({
        where: { projectId },
        data: {
          title: result.title,
          content: result.content,
          sections: result.sections,
          metadata: result.metadata,
          status: 'completed',
        },
      });

      return result;
    } catch (error) {
      await prisma.script.update({
        where: { projectId },
        data: { status: 'failed' },
      });
      throw error;
    }
  },
};
