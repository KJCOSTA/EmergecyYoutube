'use client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StepData = any;

interface Step2Props {
  data: StepData;
  onNext: (data: StepData) => void;
}

export default function Step2({ data, onNext }: Step2Props) {
  return (
    <>
      <h1>Proposta Gerada</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={() => onNext(data)}>Revisar</button>
    </>
  )
}
