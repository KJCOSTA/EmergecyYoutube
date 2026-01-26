"use client";

import { useState, useEffect, Suspense } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, Circle, Lock } from 'lucide-react';
import { useWorkflowStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';

// Simplified workflow steps for current step info
const workflowStepsInfo = [
  { step: 1, title: "Entrada", description: "Defina o tema e configure o projeto", path: "/step/1-input" },
  { step: 2, title: "Inteligência", description: "Pesquisa e análise de conteúdo", path: "/step/2-research" },
  { step: 4, title: "Proposta", description: "Geração de roteiro e conteúdo", path: "/step/4-proposal" },
  { step: 5, title: "Studio", description: "Seleção de mídia e storyboard", path: "/step/5-studio" },
  { step: 6, title: "Upload", description: "Publicação no YouTube", path: "/step/6-upload" },
];

function WorkflowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentStep,
    resetWorkflow,
    context,
    research,
    proposal,
  } = useWorkflowStore();
  const [showResetDialog, setShowResetDialog] = useState(false);

  useEffect(() => {
    const continueParam = searchParams.get('continue');
    const hasData = context !== null || research !== null || proposal !== null;

    if (!continueParam && hasData) {
      setShowResetDialog(true);
    }

    if (continueParam === 'false') {
      resetWorkflow();
      setShowResetDialog(false);
    }
  }, [searchParams, resetWorkflow, context, research, proposal]);

  const currentStepData = workflowStepsInfo.find(s => s.step === currentStep);

  return (
    <div className="w-full">
      {/* Reset Dialog */}
      {showResetDialog && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" onClick={() => setShowResetDialog(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-layer-2 border border-warning/30 rounded-2xl shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Workflow em Andamento</h3>
                <p className="text-sm text-muted">
                  Detectamos um workflow anterior. Deseja continuar de onde parou ou iniciar um novo?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResetDialog(false);
                  if(currentStepData) router.push(currentStepData.path);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-layer-1 border border-default hover:bg-surface-elevated text-text-primary transition-all"
              >
                Continuar
              </button>
              <button
                onClick={() => {
                  resetWorkflow();
                  setShowResetDialog(false);
                  router.push('/workflow?continue=false');
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-warning/10 border border-warning/30 hover:bg-warning/20 text-warning transition-all"
              >
                Iniciar Novo
              </button>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          WorkFlow de Produção
        </h1>
        <p className="text-muted">Siga as etapas para criar seu vídeo automaticamente.</p>
      </div>

      {/* Current Step Info */}
      <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              Etapa Atual: {currentStepData?.title}
            </h3>
            <p className="text-sm text-muted mb-4">
              {currentStepData?.description}
            </p>
            <button
              onClick={() => {
                if (currentStepData) {
                  router.push(currentStepData.path);
                }
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Ir para a Etapa Atual
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-layer-1 border border-subtle rounded-xl p-6">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <h4 className="font-medium text-white mb-2">Etapas Completadas</h4>
          <p className="text-sm text-muted">Marcadas em verde na barra de progresso acima.</p>
        </div>

        <div className="bg-layer-1 border border-subtle rounded-xl p-6">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-3">
            <Circle className="w-6 h-6 text-indigo-400" />
          </div>
          <h4 className="font-medium text-white mb-2">Etapa Atual</h4>
          <p className="text-sm text-muted">Destacada e pulsando na barra de progresso.</p>
        </div>

        <div className="bg-layer-1 border border-subtle rounded-xl p-6">
          <div className="w-10 h-10 bg-layer-3/50 rounded-lg flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-muted" />
          </div>
          <h4 className="font-medium text-white mb-2">Etapas Bloqueadas</h4>
          <p className="text-sm text-muted">Complete as etapas anteriores para desbloquear.</p>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground-muted">Carregando workflow...</p>
        </div>
      </div>
    }>
      <WorkflowContent />
    </Suspense>
  );
}
