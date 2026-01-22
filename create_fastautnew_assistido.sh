#!/bin/bash
set -e

echo "=========================================="
echo " FASTAUTNEW ASSISTIDO — EMERGENCY MODE"
echo "=========================================="

BASE="app/fastautnew-assistido"
API="app/api/fastautnew-assistido"

echo "1) Criando pastas..."
mkdir -p $BASE
mkdir -p $API/run

echo "2) Criando UI assistida..."

cat << 'TSX' > $BASE/page.tsx
'use client'
import { useState } from 'react'

export default function FastAutnewAssistido() {
  const [tema, setTema] = useState('')
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function gerar() {
    setLoading(true)
    const res = await fetch('/api/fastautnew-assistido/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tema })
    })
    const data = await res.json()
    setResultado(data)
    setLoading(false)
  }

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <h1>FASTAUTNEW ASSISTIDO</h1>

      <input
        value={tema}
        onChange={e => setTema(e.target.value)}
        placeholder="Tema do vídeo"
        style={{ width: '100%', padding: 12, marginTop: 16 }}
      />

      <button onClick={gerar} disabled={loading} style={{ marginTop: 16 }}>
        {loading ? 'Gerando...' : 'Gerar Proposta'}
      </button>

      {resultado && (
        <pre style={{ marginTop: 32, whiteSpace: 'pre-wrap' }}>
{JSON.stringify(resultado, null, 2)}
        </pre>
      )}
    </div>
  )
}
TSX

echo "3) Criando API assistida (Gemini)..."

cat << 'TS' > $API/run/route.ts
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
TS

echo "4) Commitando..."
git add .
git commit -m "feat: FASTAUTNEW assistido (emergency mode)" || true

echo "=========================================="
echo " FASTAUTNEW ASSISTIDO CRIADO"
echo " Acesse após deploy:"
echo " https://emergecy-youtube.vercel.app/fastautnew-assistido"
echo "=========================================="
