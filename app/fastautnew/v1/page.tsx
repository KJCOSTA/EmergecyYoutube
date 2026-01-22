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
