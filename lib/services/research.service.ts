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
   * Execute deep research using Gemini
   */
  async execute(projectId: string, topic: string): Promise<ResearchResult> {
    // Update research status
    await prisma.research.upsert({
      where: { projectId },
      create: { projectId, status: 'in_progress' },
      update: { status: 'in_progress' },
    });

    try {
      // Use Gemini for deep research
      const { text } = await generateText({
        model: google('gemini-pro'),
        system: `Você é um especialista em pesquisa de conteúdo para o YouTube, focado no mercado brasileiro.
Sua tarefa é analisar tendências, comportamento da audiência e oportunidades de conteúdo.
Responda SEMPRE em Português do Brasil.
Sua resposta DEVE ser um objeto JSON válido, sem nenhum texto ou formatação adicional.`,
        prompt: `Realize uma pesquisa aprofundada sobre o tópico: "${topic}"

Analise:
1.  Fatores internos: Quais tópicos relacionados performam bem neste nicho? O que a audiência busca?
2.  Fatores externos: Tendências atuais, análise de concorrência e lacunas de conteúdo.

Retorne um objeto JSON com a seguinte estrutura:
{
  "internalAnalysis": {
    "topPerformingTopics": ["tópico1", "tópico2", ...],
    "audienceInsights": ["insight1", "insight2", ...],
    "contentGaps": ["lacuna1", "lacuna2", ...]
  },
  "externalAnalysis": {
    "trends": ["tendência1", "tendência2", ...],
    "competitors": ["análise de concorrente 1", ...]
  },
  "summary": "Breve resumo dos achados"
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
