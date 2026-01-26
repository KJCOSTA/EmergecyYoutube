import { NextRequest, NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(request: NextRequest) {
  try {
    console.log("[AI TEST] Iniciando requisição de teste de IA");

    const body = await request.json();
    const { provider, apiKey, model, prompt } = body;

    // Validações
    if (!provider || !apiKey || !model || !prompt) {
      return NextResponse.json(
        {
          error: "Campos obrigatórios: provider, apiKey, model, prompt",
          received: { provider, model, hasApiKey: !!apiKey, hasPrompt: !!prompt },
        },
        { status: 400 }
      );
    }

    console.log("[AI TEST] Configuração:", {
      provider,
      model,
      promptLength: prompt.length,
    });

    // Cria o provider baseado na seleção
    let aiProvider: any;
    let modelInstance: any;

    switch (provider) {
      case "openai":
        console.log("[AI TEST] Configurando OpenAI...");
        aiProvider = createOpenAI({
          apiKey: apiKey,
        });
        modelInstance = aiProvider(model);
        break;

      case "google":
        console.log("[AI TEST] Configurando Google Gemini...");
        aiProvider = createGoogleGenerativeAI({
          apiKey: apiKey,
        });
        modelInstance = aiProvider(model);
        break;

      case "anthropic":
        console.log("[AI TEST] Configurando Anthropic Claude...");
        aiProvider = createAnthropic({
          apiKey: apiKey,
        });
        modelInstance = aiProvider(model);
        break;

      default:
        return NextResponse.json(
          {
            error: `Provider '${provider}' não suportado`,
            supportedProviders: ["openai", "google", "anthropic"],
          },
          { status: 400 }
        );
    }

    console.log("[AI TEST] Fazendo chamada para a API...");

    const startTime = Date.now();

    const result = await generateText({
      model: modelInstance,
      prompt: prompt,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log("[AI TEST] Resposta recebida em", duration, "ms");
    console.log("[AI TEST] Texto gerado:", result.text.substring(0, 100) + "...");

    return NextResponse.json({
      success: true,
      provider,
      model,
      duration: `${duration}ms`,
      usage: result.usage,
      text: result.text,
      metadata: {
        finishReason: result.finishReason,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("[AI TEST] Erro completo:", error);

    // Captura detalhes específicos do erro
    let errorDetails: any = {
      message: error instanceof Error ? error.message : String(error),
    };

    // Se for um erro de API, tenta capturar mais detalhes
    if (error && typeof error === "object") {
      if ("status" in error) errorDetails.status = error.status;
      if ("statusText" in error) errorDetails.statusText = error.statusText;
      if ("code" in error) errorDetails.code = error.code;
      if ("type" in error) errorDetails.type = error.type;
    }

    return NextResponse.json(
      {
        error: "Erro ao chamar API de IA",
        details: errorDetails,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
