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
