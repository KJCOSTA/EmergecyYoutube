'use client'

interface Step3Props {
  data: unknown;
  onApprove: () => void;
}

export default function Step3({ onApprove }: Step3Props) {
  return (
    <>
      <h1>Revisão & Aprovação</h1>
      <button onClick={onApprove}>Aprovar Proposta</button>
    </>
  )
}
