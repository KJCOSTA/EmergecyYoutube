'use client'

interface Step1Props {
  onNext: (data: { tema: string }) => void;
}

export default function Step1({ onNext }: Step1Props) {
  return (
    <>
      <h1>FASTAUTNEW — Entrada</h1>
      <button onClick={() => onNext({ tema: 'ORACAO ESPIRITA DA MANHA' })}>
        Gerar Proposta
      </button>
    </>
  )
}
