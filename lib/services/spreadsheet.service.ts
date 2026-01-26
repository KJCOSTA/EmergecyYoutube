/**
 * ============================================
 * ORION - Serviço de Processamento de Planilhas
 * ============================================
 *
 * Processa planilhas exportadas do YouTube Studio para
 * extrair métricas e insights de performance.
 */

import * as XLSX from 'xlsx';
import { ChannelMetrics, YouTubeStudioData } from '@/types';

interface SpreadsheetRow {
  [key: string]: string | number | undefined;
}

/**
 * Processa um arquivo de planilha (CSV ou XLSX) do YouTube Studio
 */
export async function parseYouTubeStudioSpreadsheet(
  fileBuffer: ArrayBuffer
): Promise<YouTubeStudioData> {
  try {
    // Ler o arquivo com SheetJS
    const workbook = XLSX.read(fileBuffer, { type: 'array' });

    // Pegar a primeira planilha
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Converter para JSON
    const rawData = XLSX.utils.sheet_to_json<SpreadsheetRow>(worksheet);

    // Processar os dados
    const metrics = parseMetricsFromSpreadsheet(rawData);

    // Calcular estatísticas agregadas
    const avgCTR = calculateAverageCTR(metrics);
    const avgWatchTime = calculateAverageWatchTime(metrics);
    const topPerformingVideos = getTopPerformingVideos(metrics, 10);

    return {
      id: `yt-studio-${Date.now()}`,
      rawData: rawData as unknown as Record<string, unknown>,
      totalVideos: metrics.length,
      analyzedAt: new Date().toISOString(),
      topPerformingVideos,
      avgCTR,
      avgWatchTime
    };
  } catch (error) {
    console.error('Erro ao processar planilha do YouTube Studio:', error);
    throw new Error(`Falha ao processar planilha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

/**
 * Converte dados brutos da planilha em objetos ChannelMetrics
 */
function parseMetricsFromSpreadsheet(data: SpreadsheetRow[]): ChannelMetrics[] {
  return data.map((row, index) => {
    // Tentar mapear colunas comuns do YouTube Studio
    // As colunas podem variar dependendo do idioma/formato da exportação
    const videoId = String(row['Video ID'] || row['ID do vídeo'] || `video-${index}`);
    const title = String(row['Video title'] || row['Título do vídeo'] || row['Title'] || row['Título'] || 'Sem título');
    const views = Number(row['Views'] || row['Visualizações'] || row['Visualizacoes'] || 0);
    const likes = Number(row['Likes'] || row['Curtidas'] || 0);
    const comments = Number(row['Comments'] || row['Comentários'] || row['Comentarios'] || 0);
    const watchTime = Number(row['Watch time (hours)'] || row['Tempo de exibição'] || row['Watch time'] || 0);
    const avgViewDuration = Number(row['Average view duration'] || row['Duração média da visualização'] || row['Avg view duration'] || 0);
    const ctr = Number(row['CTR'] || row['Impressions click-through rate'] || row['Taxa de cliques das impressões'] || 0);
    const impressions = Number(row['Impressions'] || row['Impressões'] || row['Impressoes'] || 0);
    const publishedAt = String(row['Published'] || row['Publicado em'] || row['Date'] || new Date().toISOString());

    return {
      videoId,
      title,
      views,
      likes,
      comments,
      watchTime: watchTime * 3600, // Converter horas para segundos
      averageViewDuration: avgViewDuration,
      ctr,
      impressions,
      publishedAt
    };
  }).filter(metric => metric.views > 0); // Filtrar vídeos sem visualizações
}

/**
 * Calcula CTR médio
 */
function calculateAverageCTR(metrics: ChannelMetrics[]): number {
  if (metrics.length === 0) return 0;

  const totalCTR = metrics.reduce((sum, m) => sum + m.ctr, 0);
  return Number((totalCTR / metrics.length).toFixed(2));
}

/**
 * Calcula tempo de exibição médio
 */
function calculateAverageWatchTime(metrics: ChannelMetrics[]): number {
  if (metrics.length === 0) return 0;

  const totalWatchTime = metrics.reduce((sum, m) => sum + m.watchTime, 0);
  return Number((totalWatchTime / metrics.length).toFixed(0));
}

/**
 * Retorna os vídeos com melhor performance
 */
function getTopPerformingVideos(metrics: ChannelMetrics[], limit: number): ChannelMetrics[] {
  // Ordenar por uma combinação de visualizações e CTR
  return [...metrics]
    .sort((a, b) => {
      const scoreA = a.views * (1 + a.ctr / 100);
      const scoreB = b.views * (1 + b.ctr / 100);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Valida se um arquivo parece ser uma planilha do YouTube Studio
 */
export function validateYouTubeStudioSpreadsheet(fileBuffer: ArrayBuffer): {
  valid: boolean;
  error?: string;
} {
  try {
    const workbook = XLSX.read(fileBuffer, { type: 'array' });

    if (workbook.SheetNames.length === 0) {
      return { valid: false, error: 'Planilha vazia' };
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<SpreadsheetRow>(worksheet);

    if (data.length === 0) {
      return { valid: false, error: 'Nenhum dado encontrado na planilha' };
    }

    // Verificar se tem pelo menos algumas colunas esperadas
    const firstRow = data[0];
    const hasExpectedColumns =
      Object.keys(firstRow).some(key =>
        key.toLowerCase().includes('video') ||
        key.toLowerCase().includes('vídeo') ||
        key.toLowerCase().includes('title') ||
        key.toLowerCase().includes('título')
      );

    if (!hasExpectedColumns) {
      return {
        valid: false,
        error: 'Formato de planilha não reconhecido. Certifique-se de exportar do YouTube Studio.'
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Erro ao validar planilha: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}

/**
 * Extrai insights principais dos dados da planilha
 */
export function extractInsightsFromSpreadsheet(data: YouTubeStudioData): string[] {
  const insights: string[] = [];

  if (!data.topPerformingVideos || data.topPerformingVideos.length === 0) {
    return ['Não foram encontrados dados suficientes para gerar insights'];
  }

  // Insight sobre CTR
  if (data.avgCTR && data.avgCTR > 0) {
    if (data.avgCTR > 10) {
      insights.push(`CTR médio excelente de ${data.avgCTR}% - suas thumbnails e títulos são muito eficazes`);
    } else if (data.avgCTR > 5) {
      insights.push(`CTR médio bom de ${data.avgCTR}% - há espaço para melhorar thumbnails e títulos`);
    } else {
      insights.push(`CTR médio de ${data.avgCTR}% - foque em melhorar suas thumbnails e títulos para aumentar cliques`);
    }
  }

  // Insight sobre tempo de exibição
  if (data.avgWatchTime && data.avgWatchTime > 0) {
    const avgMinutes = Math.floor(data.avgWatchTime / 60);
    insights.push(`Tempo médio de exibição de ${avgMinutes} minutos - ${avgMinutes > 3 ? 'ótima retenção' : 'trabalhe em ganchos mais fortes'}`);
  }

  // Insight sobre vídeos de sucesso
  if (data.topPerformingVideos && data.topPerformingVideos.length > 0) {
    const topVideo = data.topPerformingVideos[0];
    insights.push(`Seu vídeo de maior sucesso "${topVideo.title}" tem ${topVideo.views.toLocaleString()} visualizações`);
  }

  return insights;
}
