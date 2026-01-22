import { NextResponse } from 'next/server'

// ⚠️ STUB: This endpoint returns mock data for testing purposes only
// TODO: Implement real AI-powered script and title generation
export async function POST(req: Request) {
  const { tema } = await req.json()
  return NextResponse.json({
    status: 'WAITING_APPROVAL',
    proposta: {
      tema,
      roteiro: 'Roteiro gerado automaticamente',
      titulos: ['Título 1','Título 2','Título 3']
    }
  })
}
