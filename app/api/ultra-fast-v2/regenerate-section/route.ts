import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

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
- Texto DIFERENTE mas cobrindo a mesma ideia
- 2-4 frases curtas e impactantes
- Linguagem acessível e engajadora
- SEM markdown, SEM formatação, SEM aspas

RESPONDA APENAS COM O NOVO TEXTO, NADA MAIS.`;

    // 1. Tentar Claude (Anthropic) primeiro
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const anthropic = new Anthropic({ apiKey: anthropicKey });
        const response = await anthropic.messages.create({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 300,
          messages: [{ role: "user", content: prompt }],
        });

        const content = response.content[0];
        if (content.type === "text") {
          const newText = content.text.trim().replace(/^["']|["']$/g, "");
          return NextResponse.json({ text: newText });
        }
      } catch (error) {
        console.error("Anthropic regenerate failed:", error);
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
          temperature: 0.9,
          max_tokens: 200,
        });

        const newText = response.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g, "") || "";
        if (newText) {
          return NextResponse.json({ text: newText });
        }
      } catch (error) {
        console.error("OpenAI regenerate failed:", error);
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

        const newText = text.trim().replace(/^["']|["']$/g, "");
        if (newText) {
          return NextResponse.json({ text: newText });
        }
      } catch (error) {
        console.error("Google regenerate failed:", error);
      }
    }

    // 4. Último fallback: variação simples do texto atual
    const variations = [
      `${currentText.replace(/\.$/, "")}. Este conceito é fundamental para entender o tema.`,
      `Vamos explorar isso: ${currentText}`,
      `${currentText} Isso faz toda a diferença.`,
      `Preste atenção: ${currentText}`,
    ];

    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    return NextResponse.json({ text: randomVariation });
  } catch (error) {
    console.error("Regenerate section error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Falha ao regenerar seção",
        details: "Verifique se suas chaves de API estão configuradas corretamente"
      },
      { status: 500 }
    );
  }
}
