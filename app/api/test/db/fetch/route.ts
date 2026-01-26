import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("[DB TEST FETCH] Iniciando requisição de busca");

    // Busca a última mensagem salva
    const lastMessage = await prisma.testMessage.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("[DB TEST FETCH] Última mensagem encontrada:", lastMessage);

    if (!lastMessage) {
      return NextResponse.json({
        success: true,
        message: "Nenhuma mensagem encontrada no banco",
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Mensagem recuperada com sucesso",
      data: lastMessage,
    });

  } catch (error) {
    console.error("[DB TEST FETCH] Erro completo:", error);

    return NextResponse.json(
      {
        error: "Erro ao buscar do banco de dados",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
