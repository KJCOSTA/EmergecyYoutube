import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

/**
 * Research Agent using Gemini 2.0
 *
 * This agent performs deep research on YouTube trends,
 * channel analytics, and content opportunities.
 */

export interface ResearchAgentResult {
  summary: string;
  topPerformingTopics: string[];
  audienceInsights: string[];
  contentGaps: string[];
  trends: string[];
  competitors: string[];
}

export async function runResearchAgent(
  topic: string,
  channelContext?: string
): Promise<ResearchAgentResult> {
  const { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    system: `You are an expert YouTube content research agent for the Brazilian market.
Your job is to analyze trends, audience behavior, and content opportunities.
Always provide actionable insights based on data patterns.
Respond in valid JSON format.`,
    prompt: `Research topic: "${topic}"
${channelContext ? `Channel context: ${channelContext}` : ''}

Analyze and return JSON with:
{
  "summary": "Brief research summary",
  "topPerformingTopics": ["topic1", "topic2", ...],
  "audienceInsights": ["insight1", "insight2", ...],
  "contentGaps": ["gap1", "gap2", ...],
  "trends": ["trend1", "trend2", ...],
  "competitors": ["competitor insight 1", ...]
}`,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return {
    summary: text,
    topPerformingTopics: [],
    audienceInsights: [],
    contentGaps: [],
    trends: [],
    competitors: [],
  };
}
