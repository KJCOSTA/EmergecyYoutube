import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

// Configuração segura dos provedores
const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const maxDuration = 60; // Permite gerações longas (Deep Research)

export async function POST(req: Request) {
  try {
    const { model, inputData, stepsData } = await req.json();

    // 1. Validação de Chaves (Para você ver o erro real se houver)
    if (model.includes('claude') && !process.env.ANTHROPIC_API_KEY) {
      throw new Error('ERRO CRÍTICO: Chave da Anthropic (ANTHROPIC_API_KEY) não encontrada no servidor.');
    }

    // 2. Seleção do Modelo Inteligente
    let selectedModel;
    if (model === 'gemini-2.0-flash') selectedModel = google('models/gemini-2.0-flash-exp');
    else if (model === 'gpt-4o') selectedModel = openai('gpt-4o');
    else if (model === 'claude-3-5-sonnet') selectedModel = anthropic('claude-3-5-sonnet-20240620');
    else selectedModel = google('models/gemini-1.5-flash'); // Fallback

    // 3. Montagem do Contexto "Deep Research" (Cruza Dados)
    const contextPrompt = `
      VOCÊ É UM ESTRATEGISTA DE YOUTUBE SÊNIOR E ESPECIALISTA EM DADOS.
      
      *** REGRA SUPREMA: A RESPOSTA DEVE SER 100% EM PORTUGUÊS DO BRASIL (PT-BR) ***
      
      SEU OBJETIVO:
      Realizar uma análise profunda, baseada em evidências, cruzando os dados internos do canal com tendências de mercado.
      
      DADOS DE ENTRADA (Analise tudo):
      - Métricas do Canal (CSV/JSON): ${JSON.stringify(inputData)}
      - Histórico/Steps Anteriores: ${JSON.stringify(stepsData)}
      
      DIRETRIZES DE ANÁLISE (Deep Research):
      1. NÃO seja genérico. Use números exatos dos dados fornecidos.
      2. Cruze a taxa de clique (CTR) com os títulos atuais e sugira melhorias específicas.
      3. Identifique padrões de retenção se houver dados de watchtime.
      4. Compare o desempenho do tema atual com a média do canal.
      
      ESTRUTURA DA RESPOSTA (JSON):
      Retorne um objeto JSON estrito com:
      - analise_interna: { pontos_fortes, pontos_fracos, padroes_ocultos }
      - analise_externa: { oportunidades_mercado, concorrencia, trends_atuais }
      - estrategia_sugerida: { titulo_matador, ideia_thumbnail, gancho_roteiro }
      - justificativa_baseada_em_dados: "Por que escolhi isso?"
    `;

    // 4. Geração com Estrutura Garantida (Zod)
    const result = await streamObject({
      model: selectedModel,
      system: "Você é um consultor expert de YouTube. Fale Português.",
      prompt: contextPrompt,
      schema: z.object({
        analise_interna: z.object({
          pontos_fortes: z.array(z.string()),
          pontos_fracos: z.array(z.string()),
          padroes_ocultos: z.string(),
        }),
        analise_externa: z.object({
          oportunidades_mercado: z.array(z.string()),
          trends_atuais: z.array(z.string()),
        }),
        estrategia: z.object({
          titulo_sugerido: z.string(),
          ideia_thumbnail: z.string(),
          explicacao_tecnica: z.string(),
        }),
      }),
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error("ERRO NA GERAÇÃO:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}