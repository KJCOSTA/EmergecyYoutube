import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: Request) {
  const { tema } = await req.json()

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const prompt = `
Você é um estrategista de YouTube espiritual.

Tema: ${tema}

Gere:
1) 3 títulos otimizados
2) Roteiro de 8 a 10 minutos
3) Estrutura de retenção
4) Sugestão de imagens por bloco

Formato claro e organizado.
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  return NextResponse.json({
    status: 'PROPOSTA_GERADA',
    tema,
    conteudo: text
  })
}
