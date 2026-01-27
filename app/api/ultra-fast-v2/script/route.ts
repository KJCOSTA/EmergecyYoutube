import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const { theme, targetDuration = 540 } = await request.json();

    if (!theme) {
      return NextResponse.json({ error: "Tema é obrigatório" }, { status: 400 });
    }

    // Calcular número de seções (média de 30-35s por seção)
    const avgSectionDuration = 33;
    const numSections = Math.round(targetDuration / avgSectionDuration);

    const prompt = `Você é um especialista em copywriting para YouTube com foco em RETENÇÃO e ENGAJAMENTO.

Crie um roteiro de vídeo sobre: "${theme}"

📊 ESPECIFICAÇÕES TÉCNICAS:
- DURAÇÃO TOTAL: ${targetDuration} segundos (~${Math.floor(targetDuration / 60)} minutos)
- APROXIMADAMENTE ${Math.floor((targetDuration / 60) * 180)} PALAVRAS (~180 palavras por minuto de narração)
- ${numSections} SEÇÕES com timing estratégico
- Cada seção: 25-40 segundos de narração

🎯 ESTRUTURA OBRIGATÓRIA:

**SEÇÃO 1 - ABERTURA MAGNÉTICA (0-30s):**
- Promessa CLARA do que o espectador vai receber
- Palavras-chave do tema logo no INÍCIO (para algoritmo do YouTube)
- Loop aberto: "E ao final, vou deixar [algo especial] para você"
- CTA RÁPIDO: "Se ainda não é inscrito, se inscreva" OU "Torne-se membro e receba conteúdos exclusivos"
- SEM introdução longa

**SEÇÕES 2-${numSections - 2} - DESENVOLVIMENTO (Corpo Principal):**
- Storytelling emocional conectado ao tema
- Narrativa envolvente que mantém atenção
- Cada seção flui naturalmente para a próxima
- Linguagem acessível e profissional

**SEÇÃO ${numSections - 1} - PONTO DE REENGAJAMENTO (4-6 min):**
- Pedir compartilhamento: "Compartilhe com pelo menos 3 pessoas que você ama, assim você se torna um canal de luz"
- NUNCA fazer isso no meio de uma oração/leitura, sempre DEPOIS

**SEÇÃO ${numSections} - CLÍMAX E RESOLUÇÃO (Últimos 2 min):**
- Conclusão poderosa que cumpre o prometido
- Afirmação memorável
- ENTREGA DO LOOP: Mencionar grupo VIP WhatsApp + Ebook "Orações da Família Brasileira"
- CTA final: "Clique no primeiro link fixado ou na descrição para entrar na lista VIP do WhatsApp"

❌ PALAVRAS E FRASES PROIBIDAS (NUNCA USAR):
- blindar / blindagem
- escudo
- chave
- muralha
- "se você sente"
- "você não chegou aqui por acaso"
- "respire fundo"

✅ REGRAS OBRIGATÓRIAS:
- Linguagem clara, direta e emocional
- NUNCA promessas de ganhos materiais
- NUNCA linguagem teológica complexa
- CTAs estratégicos sem ser invasivo
- Foco em RETENÇÃO do primeiro ao último segundo

🎨 FLEXIBILIDADE CRIATIVA:
Você tem TOTAL autonomia para quebrar padrões quando isso:
- Maximizar performance algorítmica
- Aumentar potencial de viralização
- Surfar tendências do nicho
- A estratégia sempre prevalece sobre o padrão

FORMATO DA RESPOSTA (APENAS JSON):
{
  "sections": [
    {
      "text": "Texto completo da seção aqui (rico, emotivo, estratégico)",
      "duration": 30
    }
  ]
}

IMPORTANTE:
- Cada seção deve ter texto COMPLETO, NÃO resumos
- SEM placeholders, SEM "..."
- Duração total deve somar ~${targetDuration}s
- Foco em RETER o espectador do início ao fim`;

    // 1. Tentar Claude (Anthropic) primeiro
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const anthropic = new Anthropic({ apiKey: anthropicKey });
        const response = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        });

        const content = response.content[0];
        if (content.type === "text") {
          const jsonMatch = content.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const sections = parsed.sections.map((s: any, idx: number) => ({
              id: `section-${Date.now()}-${idx}`,
              text: s.text,
              duration: s.duration || avgSectionDuration,
              order: idx,
            }));

            return NextResponse.json({ sections });
          }
        }
      } catch (error) {
        console.error("Anthropic failed:", error);
      }
    }

    // 2. Fallback para OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const openai = new OpenAI({ apiKey: openaiKey });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          const result = JSON.parse(content);
          const sections = result.sections.map((s: any, idx: number) => ({
            id: `section-${Date.now()}-${idx}`,
            text: s.text,
            duration: s.duration || avgSectionDuration,
            order: idx,
          }));

          return NextResponse.json({ sections });
        }
      } catch (error) {
        console.error("OpenAI failed:", error);
      }
    }

    // 3. Fallback para Google Gemini
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (googleKey) {
      try {
        const genAI = new GoogleGenerativeAI(googleKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const sections = parsed.sections.map((s: any, idx: number) => ({
            id: `section-${Date.now()}-${idx}`,
            text: s.text,
            duration: s.duration || avgSectionDuration,
            order: idx,
          }));

          return NextResponse.json({ sections });
        }
      } catch (error) {
        console.error("Google failed:", error);
      }
    }

    // 4. Último fallback: roteiro básico gerado programaticamente
    const fallbackSections = [];
    for (let i = 0; i < numSections; i++) {
      let text = "";
      if (i === 0) {
        text = `Você está prestes a descobrir tudo sobre ${theme}. Prepare-se para transformar sua compreensão sobre este assunto!`;
      } else if (i === numSections - 1) {
        text = `Agora você tem todas as informações essenciais sobre ${theme}. Não esqueça de curtir e se inscrever para mais conteúdo como este!`;
      } else {
        text = `Ponto ${i}: Este é um aspecto fundamental de ${theme} que você precisa conhecer. Vamos explorar isso em detalhes.`;
      }

      fallbackSections.push({
        id: `section-${Date.now()}-${i}`,
        text,
        duration: Math.round(targetDuration / numSections),
        order: i,
      });
    }

    return NextResponse.json({ sections: fallbackSections });
  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao gerar roteiro" },
      { status: 500 }
    );
  }
}
