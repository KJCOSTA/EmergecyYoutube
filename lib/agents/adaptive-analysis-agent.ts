/**
 * ============================================
 * ORION - Agente de Análise Adaptativa
 * ============================================
 *
 * Agente de IA que se adapta aos inputs disponíveis para
 * gerar análises e insights relevantes.
 */

import { ContextData, YouTubeStudioData, CompetitorData } from '@/types';
import { extractInsightsFromSpreadsheet } from '@/lib/services/spreadsheet.service';

export interface AdaptiveAnalysisResult {
  summary: string;
  insights: string[];
  suggestions: string[];
  topics: string[];
  hooks: string[];
  structure: {
    intro: string;
    mainPoints: string[];
    cta: string;
  } | null;
}

/**
 * Analisa o contexto de forma adaptativa baseado nos inputs disponíveis
 */
export async function analyzeContext(context: ContextData): Promise<AdaptiveAnalysisResult> {
  const insights: string[] = [];
  const suggestions: string[] = [];
  const topics: string[] = [];
  const hooks: string[] = [];
  let structure = null;

  // Análise da planilha do YouTube Studio
  if (context.planilhaYouTubeStudio) {
    const spreadsheetInsights = analyzeSpreadsheetData(context.planilhaYouTubeStudio);
    insights.push(...spreadsheetInsights.insights);
    suggestions.push(...spreadsheetInsights.suggestions);
  }

  // Análise do tema fornecido
  if (context.theme) {
    const themeAnalysis = analyzeTheme(context.theme, context.tagsFoco);
    insights.push(...themeAnalysis.insights);
    topics.push(...themeAnalysis.topics);
    suggestions.push(...themeAnalysis.suggestions);
  }

  // Análise do concorrente
  if (context.dadosConcorrente) {
    const competitorAnalysis = analyzeCompetitor(context.dadosConcorrente);
    insights.push(...competitorAnalysis.insights);
    hooks.push(...competitorAnalysis.hooks);
    structure = competitorAnalysis.structure;
  }

  // Análise de transcrição
  if (context.transcricao) {
    const transcriptAnalysis = analyzeTranscript(context.transcricao);
    insights.push(...transcriptAnalysis.insights);
    hooks.push(...transcriptAnalysis.hooks);
    if (!structure) {
      structure = transcriptAnalysis.structure;
    }
  }

  // Cruzamento de dados
  const crossAnalysis = performCrossAnalysis(context);
  suggestions.push(...crossAnalysis);

  // Gerar resumo
  const summary = generateSummary(context, insights);

  return {
    summary,
    insights: [...new Set(insights)], // Remover duplicatas
    suggestions: [...new Set(suggestions)],
    topics: [...new Set(topics)],
    hooks: [...new Set(hooks)],
    structure
  };
}

/**
 * Analisa dados da planilha do YouTube Studio
 */
function analyzeSpreadsheetData(data: YouTubeStudioData): {
  insights: string[];
  suggestions: string[];
} {
  const insights = extractInsightsFromSpreadsheet(data);
  const suggestions: string[] = [];

  // Sugestões baseadas em performance
  if (data.avgCTR && data.avgCTR < 5) {
    suggestions.push('Teste thumbnails mais chamativas com cores vibrantes e rostos expressivos');
    suggestions.push('Use títulos que despertem curiosidade sem revelar tudo');
  }

  if (data.avgWatchTime && data.avgWatchTime < 180) {
    suggestions.push('Comece com um gancho forte nos primeiros 5 segundos');
    suggestions.push('Mantenha o ritmo dinâmico com cortes rápidos');
  }

  // Identificar padrões de sucesso
  if (data.topPerformingVideos && data.topPerformingVideos.length > 0) {
    const topTitles = data.topPerformingVideos.slice(0, 3).map(v => v.title);
    suggestions.push(`Padrões de sucesso identificados nos seus melhores vídeos: ${topTitles.join(', ')}`);
  }

  return { insights, suggestions };
}

/**
 * Analisa tema e tags de foco
 */
function analyzeTheme(theme: string, tagsFoco: string[]): {
  insights: string[];
  topics: string[];
  suggestions: string[];
} {
  const insights: string[] = [];
  const topics: string[] = [];
  const suggestions: string[] = [];

  // Expandir tema em subtópicos
  insights.push(`Tema principal: ${theme}`);

  // Processar tema para identificar subtópicos
  const themeWords = theme.toLowerCase().split(/\s+/);
  if (themeWords.length > 2) {
    topics.push(theme);
    // Sugerir variações
    suggestions.push(`Considere abordar diferentes ângulos: "Como", "Por que", "O que"`);
  }

  // Análise de tags de foco
  if (tagsFoco.length > 0) {
    insights.push(`Tags de foco: ${tagsFoco.join(', ')}`);
    topics.push(...tagsFoco);
    suggestions.push('Use as tags de foco como palavras-chave no título e descrição');
  }

  return { insights, topics, suggestions };
}

/**
 * Analisa vídeo concorrente
 */
function analyzeCompetitor(competitor: CompetitorData): {
  insights: string[];
  hooks: string[];
  structure: {
    intro: string;
    mainPoints: string[];
    cta: string;
  };
} {
  const insights: string[] = [];
  const hooks: string[] = [];

  insights.push(`Vídeo de referência: "${competitor.videoTitle || 'Título não disponível'}"`);

  if (competitor.viewCount) {
    insights.push(`Performance: ${competitor.viewCount.toLocaleString()} visualizações`);
  }

  // Analisar tags do concorrente
  if (competitor.videoTags && competitor.videoTags.length > 0) {
    insights.push(`Tags usadas: ${competitor.videoTags.slice(0, 5).join(', ')}`);
  }

  // Extrair possíveis ganchos do título
  if (competitor.videoTitle) {
    const title = competitor.videoTitle;
    if (title.includes('?')) {
      hooks.push('Usar formato de pergunta no gancho');
    }
    if (/\d+/.test(title)) {
      hooks.push('Incluir números específicos para gerar curiosidade');
    }
    if (title.includes('!')) {
      hooks.push('Usar tom exclamativo para criar urgência');
    }
  }

  // Estrutura básica inferida
  const structure = {
    intro: competitor.videoTitle || 'Título chamativo',
    mainPoints: competitor.videoTags.slice(0, 3) || ['Ponto principal 1', 'Ponto principal 2', 'Ponto principal 3'],
    cta: 'Call-to-action forte'
  };

  return { insights, hooks, structure };
}

/**
 * Analisa transcrição de vídeo
 */
function analyzeTranscript(transcript: string): {
  insights: string[];
  hooks: string[];
  structure: {
    intro: string;
    mainPoints: string[];
    cta: string;
  };
} {
  const insights: string[] = [];
  const hooks: string[] = [];

  // Analisar comprimento
  const wordCount = transcript.split(/\s+/).length;
  insights.push(`Transcrição com aproximadamente ${wordCount} palavras`);

  // Identificar possíveis ganchos (primeiras frases)
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 0) {
    const firstSentence = sentences[0].trim();
    hooks.push(`Possível gancho: "${firstSentence}"`);
  }

  // Identificar CTAs
  const lowerTranscript = transcript.toLowerCase();
  if (lowerTranscript.includes('inscreva') || lowerTranscript.includes('subscribe')) {
    insights.push('CTA de inscrição identificado no vídeo');
  }
  if (lowerTranscript.includes('like') || lowerTranscript.includes('curtir')) {
    insights.push('CTA de curtida identificado no vídeo');
  }
  if (lowerTranscript.includes('comentário') || lowerTranscript.includes('comment')) {
    insights.push('CTA de comentário identificado no vídeo');
  }

  // Estrutura básica
  const structure = {
    intro: sentences[0] || 'Introdução forte',
    mainPoints: sentences.slice(1, 4).filter(s => s.length > 20) || ['Ponto 1', 'Ponto 2', 'Ponto 3'],
    cta: 'Inscreva-se para mais conteúdo'
  };

  return { insights, hooks, structure };
}

/**
 * Realiza análise cruzada de múltiplas fontes
 */
function performCrossAnalysis(context: ContextData): string[] {
  const suggestions: string[] = [];

  // Cruzar dados de planilha com tema
  if (context.planilhaYouTubeStudio && context.theme) {
    suggestions.push(
      'Cruzando dados: Use insights de performance dos seus vídeos anteriores para guiar o novo conteúdo sobre este tema'
    );
  }

  // Cruzar concorrente com suas métricas
  if (context.dadosConcorrente && context.planilhaYouTubeStudio) {
    suggestions.push(
      'Análise competitiva: Compare as estratégias do concorrente com o que funciona no seu canal'
    );
  }

  // Cruzar transcrição com tema
  if (context.transcricao && context.theme) {
    suggestions.push(
      'Adapte a estrutura da transcrição fornecida para se adequar ao tema escolhido'
    );
  }

  return suggestions;
}

/**
 * Gera resumo da análise
 */
function generateSummary(context: ContextData, insights: string[]): string {
  const sources: string[] = [];

  if (context.planilhaYouTubeStudio) sources.push('análise de performance histórica');
  if (context.theme) sources.push('tema definido');
  if (context.dadosConcorrente) sources.push('análise de concorrente');
  if (context.transcricao) sources.push('transcrição de referência');

  const summary = `Análise completa realizada com base em: ${sources.join(', ')}.
    ${insights.length} insights identificados.
    ${context.tagsFoco.length > 0 ? `Foco em: ${context.tagsFoco.join(', ')}.` : ''}
    Modo de operação: ${context.mode}.`;

  return summary;
}
