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
        model: anthropic('claude-3-sonnet-20240229'),
        system: `Você é um roteirista especialista em vídeos para o YouTube, focado no mercado brasileiro.
Crie roteiros que sejam envolventes, repletos de valor e otimizados para retenção de audiência.
Responda SEMPRE em Português do Brasil e utilize um formato JSON válido.`,
        prompt: `Crie um roteiro de vídeo para o YouTube sobre o tema: "${topic}"

Utilize os seguintes insights da pesquisa:
- Tópicos populares: ${research.internalAnalysis?.topPerformingTopics?.join(', ') || 'N/A'}
- Insights da audiência: ${research.internalAnalysis?.audienceInsights?.join(', ') || 'N/A'}
- Tendências: ${research.externalAnalysis?.trends?.join(', ') || 'N/A'}

Requisitos:
1. Gancho (primeiros 30s): Prenda a atenção imediatamente.
2. Corpo: 3 a 5 pontos principais, entregando valor e entretenimento.
3. CTA: Uma chamada para ação clara e direta.

Retorne um objeto JSON com a seguinte estrutura:
{
  "title": "Título do vídeo (otimizado para SEO)",
  "content": "Texto completo do roteiro...",
  "sections": {
    "hook": "Texto do gancho inicial para prender a atenção.",
    "body": ["Texto do ponto 1", "Texto do ponto 2", ...],
    "cta": "Texto da chamada para ação."
  },
  "metadata": {
    "wordCount": 1500,
    "estimatedDuration": "10-12 minutos",
    "tone": "envolvente e educacional"
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
