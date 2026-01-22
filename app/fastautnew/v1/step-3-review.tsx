'use client'
export default function Step3({ data, onApprove }: any) {
  return (
    <>
      <h1>Revisão & Aprovação</h1>
      <button onClick={onApprove}>Aprovar Proposta</button>
    </>
  )
}
