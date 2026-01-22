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
