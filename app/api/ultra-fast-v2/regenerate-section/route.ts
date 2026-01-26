import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

// API simples para regenerar uma seção específica
export async function POST(request: NextRequest) {
  try {
    const { theme, currentText, duration, context } = await request.json();

    const prompt = `Reescreva esta seção de roteiro de vídeo sobre "${theme}":

SEÇÃO ATUAL:
"${currentText}"

DURAÇÃO ALVO: ${duration} segundos de narração

CONTEXTO DO VÍDEO COMPLETO:
${context.substring(0, 500)}...

REQUISITOS:
- Manter a duração aproximada (${duration}s)
- Texto diferente mas cobrindo a mesma ideia
- 2-4 frases curtas e impactantes
- Linguagem acessível e engajadora

RESPONDA APENAS COM O NOVO TEXTO, SEM FORMATAÇÃO EXTRA.`;

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      const openai = new OpenAI({ apiKey: openaiKey });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 200,
      });

      const newText = response.choices[0]?.message?.content?.trim() || currentText;
      return NextResponse.json({ text: newText });
    }

    // Fallback: retorna texto com pequena variação
    return NextResponse.json({ text: `${currentText} (versão atualizada)` });
  } catch (error) {
    console.error("Regenerate section error:", error);
    return NextResponse.json(
      { error: "Falha ao regenerar seção" },
      { status: 500 }
    );
  }
}
