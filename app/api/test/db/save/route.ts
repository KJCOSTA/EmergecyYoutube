import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log("[DB TEST SAVE] Iniciando requisição de salvamento");

    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      console.error("[DB TEST SAVE] Conteúdo inválido:", content);
      return NextResponse.json(
        {
          error: "Campo 'content' é obrigatório e deve ser uma string",
          received: content
        },
        { status: 400 }
      );
    }

    console.log("[DB TEST SAVE] Salvando no banco:", { content });

    const testMessage = await prisma.testMessage.create({
      data: {
        content,
      },
    });

    console.log("[DB TEST SAVE] Salvo com sucesso:", testMessage);

    return NextResponse.json({
      success: true,
      message: "Mensagem salva no banco com sucesso",
      data: testMessage,
    });

  } catch (error) {
    console.error("[DB TEST SAVE] Erro completo:", error);

    return NextResponse.json(
      {
        error: "Erro ao salvar no banco de dados",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
