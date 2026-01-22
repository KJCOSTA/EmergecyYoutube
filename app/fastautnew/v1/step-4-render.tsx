'use client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StepData = any;

interface Step4Props {
  data: StepData;
}

export default function Step4({ data }: Step4Props) {
  return (
    <>
      <h1>Renderizando vídeo...</h1>
      <pre style={{ fontSize: 10, marginTop: 20 }}>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}
