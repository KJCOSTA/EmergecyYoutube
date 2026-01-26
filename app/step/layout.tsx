'use client';

import WorkflowTracker from "@/components/workflow/WorkflowTracker";
import { Suspense } from "react";

export default function StepLayout({ children }: { children: React.ReactNode }) {
  return (
    // FRAGMENT <> USADO PARA EVITAR ELEMENTO DIV EXTRA
    // O <Layout> FOI REMOVIDO PARA CORRIGIR A DUPLICAÇÃO
    <>
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <p>Carregando...</p>
        </div>
      }>
        <WorkflowTracker />
        <div className="pt-8">
          {children}
        </div>
      </Suspense>
    </>
  );
}
