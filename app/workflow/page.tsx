"use client";

import { useState, useEffect, Suspense } from 'react';
import { CheckCircle2, Circle, Lock, ArrowRight, FileInput, Brain, FileVideo, Film, Wrench, Upload, AlertCircle } from 'lucide-react';
import { useWorkflowStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';

const workflowSteps = [
  {
    step: 1 as const,
    title: "Entrada",
    description: "Defina o tema e configure o projeto",
    icon: FileInput,
    path: "/step/1-input",
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: 2 as const,
    title: "Inteligência",
    description: "Pesquisa e análise de conteúdo",
    icon: Brain,
    path: "/step/2-research",
    color: "from-purple-500 to-pink-500",
  },
  {
    step: 4 as const,
    title: "Proposta",
    description: "Geração de roteiro e conteúdo",
    icon: FileVideo,
    path: "/step/4-proposal",
    color: "from-green-500 to-emerald-500",
  },
  {
    step: 5 as const,
    title: "Studio",
    description: "Seleção de mídia e storyboard",
    icon: Film,
    path: "/step/5-studio",
    color: "from-orange-500 to-red-500",
  },
  {
    step: 5 as const,
    title: "Render",
    description: "Renderização do vídeo",
    icon: Wrench,
    path: "/step/5-studio",
    color: "from-yellow-500 to-orange-500",
  },
  {
    step: 6 as const,
    title: "Upload",
    description: "Publicação no YouTube",
    icon: Upload,
    path: "/step/6-upload",
    color: "from-indigo-500 to-purple-500",
  },
];

function WorkflowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentStep,
    canNavigateToStep,
    resetWorkflow,
    context,
    research,
    proposal,
    storyboard,
    upload
  } = useWorkflowStore();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Reset workflow state on mount (unless continuing)
  useEffect(() => {
    const continueParam = searchParams.get('continue');
    const hasData = context !== null || research !== null || proposal !== null;

    // Se NÃO está continuando explicitamente E tem dados antigos, mostrar dialog
    if (!continueParam && hasData) {
      setShowResetDialog(true);
    }

    // Se parâmetro continue=false foi passado, resetar imediatamente
    if (continueParam === 'false') {
      resetWorkflow();
      setShowResetDialog(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Removido resetWorkflow, context, etc pra evitar loops

  // Verifica se um step foi realmente completado baseado nos dados
  const isStepCompleted = (step: 1 | 2 | 4 | 5 | 6): boolean => {
    switch (step) {
      case 1:
        return context !== null;
      case 2:
        return research !== null;
      case 4:
        return proposal !== null && proposal.allApproved === true;
      case 5:
        return storyboard !== null;
      case 6:
        return upload !== null;
      default:
        return false;
    }
  };

  const getStepStatus = (step: 1 | 2 | 4 | 5 | 6) => {
    // Primeiro verifica se o step foi completado com dados reais
    if (isStepCompleted(step) && step < currentStep) return "completed";
    if (step === currentStep) return "current";
    if (canNavigateToStep(step)) return "available";
    return "locked";
  };

  const handleStepClick = (step: 1 | 2 | 4 | 5 | 6, path: string) => {
    const status = getStepStatus(step);
    if (status !== "locked") {
      router.push(path);
    }
  };

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
                <p className="text-sm text-zinc-400">
                  Detectamos um workflow anterior. Deseja continuar de onde parou ou iniciar um novo?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResetDialog(false);
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
        <p className="text-zinc-400">Siga as etapas para criar seu vídeo automaticamente</p>
      </div>

      {/* Timeline Horizontal */}
      <div className="relative mb-12">
        {/* Progress Bar */}
        <div className="absolute top-[52px] left-0 right-0 h-1 bg-zinc-800 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{
              width: `${(workflowSteps.findIndex(s => s.step === currentStep) / (workflowSteps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-6 gap-4">
          {workflowSteps.map((stepData, index) => {
            const status = getStepStatus(stepData.step);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            const isLocked = status === "locked";
            const Icon = stepData.icon;

            return (
              <div key={index} className="relative">
                <button
                  onClick={() => handleStepClick(stepData.step, stepData.path)}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                  disabled={isLocked}
                  className={`
                    relative w-full flex flex-col items-center cursor-pointer disabled:cursor-not-allowed
                    transition-all duration-300
                    ${hoveredStep === index && !isLocked ? 'scale-110' : ''}
                  `}
                >
                  {/* Circle */}
                  <div
                    className={`
                      relative z-10 w-[104px] h-[104px] rounded-full flex items-center justify-center
                      transition-all duration-300 border-4
                      ${isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400 shadow-lg shadow-green-500/50'
                        : isCurrent
                        ? `bg-gradient-to-br ${stepData.color} border-white shadow-lg shadow-purple-500/50 animate-pulse`
                        : isLocked
                        ? 'bg-zinc-800 border-zinc-700'
                        : 'bg-zinc-900 border-zinc-600 hover:border-indigo-500'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    ) : isCurrent ? (
                      <Icon className="w-12 h-12 text-white" />
                    ) : isLocked ? (
                      <Lock className="w-12 h-12 text-zinc-600" />
                    ) : (
                      <Icon className="w-12 h-12 text-zinc-400" />
                    )}
                  </div>

                  {/* Label */}
                  <div className="mt-4 text-center">
                    <h3
                      className={`
                        text-sm font-bold mb-1 transition-colors
                        ${isCompleted
                          ? 'text-green-400'
                          : isCurrent
                          ? 'text-white'
                          : isLocked
                          ? 'text-zinc-600'
                          : 'text-zinc-400'
                        }
                      `}
                    >
                      {stepData.title}
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-[120px]">
                      {stepData.description}
                    </p>
                  </div>

                  {/* Step Number Badge */}
                  <div
                    className={`
                      absolute -top-2 -right-2 z-20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-indigo-500 text-white'
                        : 'bg-zinc-700 text-zinc-400'
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-lg">
            {workflowSteps.find(s => s.step === currentStep)?.icon ? (
              <div className="w-8 h-8 text-indigo-400">
                {(() => {
                  const StepIcon = workflowSteps.find(s => s.step === currentStep)?.icon;
                  return StepIcon ? <StepIcon className="w-full h-full" /> : null;
                })()}
              </div>
            ) : null}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              Etapa Atual: {workflowSteps.find(s => s.step === currentStep)?.title}
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              {workflowSteps.find(s => s.step === currentStep)?.description}
            </p>
            <button
              onClick={() => {
                const currentStepData = workflowSteps.find(s => s.step === currentStep);
                if (currentStepData) {
                  router.push(currentStepData.path);
                }
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-3">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <h4 className="font-medium text-white mb-2">Etapas Completadas</h4>
          <p className="text-sm text-zinc-500">Marcadas em verde. Você pode revisitar a qualquer momento.</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-3">
            <Circle className="w-6 h-6 text-indigo-400" />
          </div>
          <h4 className="font-medium text-white mb-2">Etapa Atual</h4>
          <p className="text-sm text-zinc-500">Destacada e pulsando. Clique para continuar o workflow.</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="w-10 h-10 bg-zinc-500/10 rounded-lg flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-zinc-400" />
          </div>
          <h4 className="font-medium text-white mb-2">Etapas Bloqueadas</h4>
          <p className="text-sm text-zinc-500">Complete as etapas anteriores para desbloquear.</p>
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
