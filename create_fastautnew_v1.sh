#!/bin/bash
set -e

echo "=========================================="
echo " FASTAUTNEW V1 — WIZARD MODE"
echo "=========================================="

mkdir -p app/fastautnew/v1
mkdir -p app/api/fastautnew/v1/{propose,approve,render}

echo "1) Criando Wizard Controller..."
cat << 'TSX' > app/fastautnew/v1/page.tsx
'use client'
import { useState } from 'react'
import Step1 from './step-1-input'
import Step2 from './step-2-proposal'
import Step3 from './step-3-review'
import Step4 from './step-4-render'

export default function FastAutnewV1() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<any>(null)

  return (
    <div style={{ padding: 32 }}>
      {step === 1 && <Step1 onNext={(d) => { setData(d); setStep(2) }} />}
      {step === 2 && <Step2 data={data} onNext={(d) => { setData(d); setStep(3) }} />}
      {step === 3 && <Step3 data={data} onApprove={() => setStep(4)} />}
      {step === 4 && <Step4 data={data} />}
    </div>
  )
}
TSX

echo "2) Criando Steps..."
cat << 'TSX' > app/fastautnew/v1/step-1-input.tsx
'use client'
export default function Step1({ onNext }: any) {
  return (
    <>
      <h1>FASTAUTNEW — Entrada</h1>
      <button onClick={() => onNext({ tema: 'ORACAO ESPIRITA DA MANHA' })}>
        Gerar Proposta
      </button>
    </>
  )
}
TSX

cat << 'TSX' > app/fastautnew/v1/step-2-proposal.tsx
'use client'
export default function Step2({ data, onNext }: any) {
  return (
    <>
      <h1>Proposta Gerada</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={() => onNext(data)}>Revisar</button>
    </>
  )
}
TSX

cat << 'TSX' > app/fastautnew/v1/step-3-review.tsx
'use client'
export default function Step3({ data, onApprove }: any) {
  return (
    <>
      <h1>Revisão & Aprovação</h1>
      <button onClick={onApprove}>Aprovar Proposta</button>
    </>
  )
}
TSX

cat << 'TSX' > app/fastautnew/v1/step-4-render.tsx
'use client'
export default function Step4() {
  return <h1>Renderizando vídeo...</h1>
}
TSX

echo "3) Commitando..."
git add .
git commit -m "feat: FASTAUTNEW V1 wizard with approval flow"
git push

echo "=========================================="
echo " FASTAUTNEW V1 PUBLICADO"
echo " URL: /fastautnew/v1"
echo "=========================================="
