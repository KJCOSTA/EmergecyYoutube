'use client'
import { useState } from 'react'

interface FastAutnewResult {
  status?: string;
  proposta?: unknown;
  video_url?: string;
}

export default function FastAutnew() {
  const [tema, setTema] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FastAutnewResult | null>(null)

  async function run() {
    setLoading(true)
    const res = await fetch('/api/fastautnew/run', {
      method: 'POST',
      body: JSON.stringify({ tema })
    })
    setResult(await res.json())
    setLoading(false)
  }

  async function approve() {
    setLoading(true)
    const res = await fetch('/api/fastautnew/render', { method: 'POST' })
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>FASTAUTNEW</h1>
      <input placeholder="Tema do vídeo"
        value={tema}
        onChange={e => setTema(e.target.value)} />
      <br /><br />
      <button onClick={run} disabled={loading}>Gerar Proposta</button>
      <button onClick={approve} disabled={loading}>Aprovar e Renderizar</button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
