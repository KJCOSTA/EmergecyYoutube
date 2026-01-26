import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

/**
 * Script Agent using Claude
 *
 * This agent creates engaging YouTube scripts with:
 * - Strong hooks
 * - Value-packed content
 * - Clear CTAs
 * - SEO-optimized titles
 */

export interface ScriptAgentResult {
  title: string;
  hook: string;
  sections: {
    title: string;
    content: string;
  }[];
  cta: string;
  fullScript: string;
  metadata: {
    wordCount: number;
    estimatedDuration: string;
    tone: string;
  };
}

export interface ResearchContext {
  summary?: string;
  topPerformingTopics?: string[];
  audienceInsights?: string[];
  trends?: string[];
}

export async function runScriptAgent(
  topic: string,
  research: ResearchContext
): Promise<ScriptAgentResult> {
  const { text } = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: `You are an expert YouTube scriptwriter for the Brazilian market.
Create engaging, retention-optimized scripts that hook viewers in the first 30 seconds.
Always respond in valid JSON format.`,
    prompt: `Create a YouTube script for: "${topic}"

Research insights:
- Top topics: ${research.topPerformingTopics?.join(', ') || 'N/A'}
- Audience insights: ${research.audienceInsights?.join(', ') || 'N/A'}
- Trends: ${research.trends?.join(', ') || 'N/A'}
- Summary: ${research.summary || 'N/A'}

Create a complete script with:
1. Attention-grabbing hook (first 30 seconds)
2. 3-5 main content sections
3. Strong call-to-action

Return JSON:
{
  "title": "SEO-optimized title",
  "hook": "Opening hook text",
  "sections": [
    {"title": "Section 1", "content": "Section content..."},
    {"title": "Section 2", "content": "Section content..."}
  ],
  "cta": "Call to action text",
  "fullScript": "Complete script text",
  "metadata": {
    "wordCount": 1500,
    "estimatedDuration": "10-12 minutes",
    "tone": "engaging and educational"
  }
}`,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return {
    title: topic,
    hook: '',
    sections: [],
    cta: '',
    fullScript: text,
    metadata: {
      wordCount: text.split(' ').length,
      estimatedDuration: 'unknown',
      tone: 'neutral',
    },
  };
}
