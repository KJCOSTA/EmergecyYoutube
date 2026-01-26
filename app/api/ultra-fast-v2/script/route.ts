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

    const prompt = `Crie um roteiro de vídeo profissional e envolvente sobre: "${theme}"

REQUISITOS CRÍTICOS:
- DURAÇÃO TOTAL ALVO: ${targetDuration} segundos (~${Math.floor(targetDuration / 60)} minutos)
- NÚMERO DE SEÇÕES: ${numSections} seções
- CADA SEÇÃO: 25-40 segundos de narração
- ESTRUTURA: Gancho inicial → Desenvolvimento (${numSections - 3} seções) → Resumo → Call-to-action final

FORMATO DA RESPOSTA (APENAS JSON):
{
  "sections": [
    {
      "text": "Texto completo da seção aqui (2-4 frases curtas e impactantes)",
      "duration": 30
    }
  ]
}

IMPORTANTE:
- Texto claro, direto e engajador
- Cada seção deve ter sentido próprio mas fluir naturalmente para a próxima
- Linguagem acessível e profissional
- SEM placeholders, SEM "..."
- A soma das durações deve ser próxima de ${targetDuration} segundos`;

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
