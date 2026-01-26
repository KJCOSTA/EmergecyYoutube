import { prisma } from '@/lib/db';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

interface ResearchResult {
  internalAnalysis: {
    topPerformingTopics: string[];
    audienceInsights: string[];
    contentGaps: string[];
  };
  externalAnalysis: {
    trends: string[];
    competitors: string[];
  };
}

export const researchService = {
  /**
   * Execute deep research using Gemini 2.0
   */
  async execute(projectId: string, topic: string): Promise<ResearchResult> {
    // Update research status
    await prisma.research.upsert({
      where: { projectId },
      create: { projectId, status: 'in_progress' },
      update: { status: 'in_progress' },
    });

    try {
      // Use Gemini 2.0 for deep research
      const { text } = await generateText({
        model: google('gemini-2.0-flash-exp'),
        system: `You are a YouTube content research specialist for the Brazilian market.
Your task is to analyze trends, audience behavior, and content opportunities.
Always respond in valid JSON format.`,
        prompt: `Conduct deep research on the topic: "${topic}"

Analyze:
1. Internal factors: What topics perform well in this niche? What does the audience want?
2. External factors: Current trends, competitor analysis, content gaps

Return a JSON object with this structure:
{
  "internalAnalysis": {
    "topPerformingTopics": ["topic1", "topic2", ...],
    "audienceInsights": ["insight1", "insight2", ...],
    "contentGaps": ["gap1", "gap2", ...]
  },
  "externalAnalysis": {
    "trends": ["trend1", "trend2", ...],
    "competitors": ["competitor insight 1", ...]
  },
  "summary": "Brief summary of findings"
}`,
      });

      // Parse the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        internalAnalysis: { topPerformingTopics: [], audienceInsights: [], contentGaps: [] },
        externalAnalysis: { trends: [], competitors: [] },
      };

      // Save research results
      await prisma.research.update({
        where: { projectId },
        data: {
          internalAnalysis: result.internalAnalysis,
          externalAnalysis: result.externalAnalysis,
          summary: result.summary || text,
          status: 'completed',
        },
      });

      return result;
    } catch (error) {
      await prisma.research.update({
        where: { projectId },
        data: { status: 'failed' },
      });
      throw error;
    }
  },
};
