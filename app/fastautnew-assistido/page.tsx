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
