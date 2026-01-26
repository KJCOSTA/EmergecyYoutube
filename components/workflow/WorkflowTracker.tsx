"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkflowStore } from '@/lib/store';
import { CheckCircle2, Circle, Lock, FileInput, Brain, FileVideo, Film, Wrench, Upload } from 'lucide-react';

const workflowSteps = [
  { step: 1 as const, title: "Entrada", description: "Defina o tema e configure o projeto", icon: FileInput, path: "/step/1-input", color: "from-blue-500 to-cyan-500" },
  { step: 2 as const, title: "Inteligência", description: "Pesquisa e análise de conteúdo", icon: Brain, path: "/step/2-research", color: "from-purple-500 to-pink-500" },
  { step: 4 as const, title: "Proposta", description: "Geração de roteiro e conteúdo", icon: FileVideo, path: "/step/4-proposal", color: "from-green-500 to-emerald-500" },
  { step: 5 as const, title: "Studio", description: "Seleção de mídia e storyboard", icon: Film, path: "/step/5-studio", color: "from-orange-500 to-red-500" },
  { step: 5 as const, title: "Render", description: "Renderização do vídeo", icon: Wrench, path: "/step/5-studio", color: "from-yellow-500 to-orange-500" },
  { step: 6 as const, title: "Upload", description: "Publicação no YouTube", icon: Upload, path: "/step/6-upload", color: "from-indigo-500 to-purple-500" },
];

export default function WorkflowTracker() {
  const router = useRouter();
  const { currentStep, canNavigateToStep, context, research, proposal, storyboard, upload } = useWorkflowStore();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const isStepCompleted = (step: 1 | 2 | 4 | 5 | 6): boolean => {
    switch (step) {
      case 1: return context !== null;
      case 2: return research !== null;
      case 4: return proposal !== null && proposal.allApproved === true;
      case 5: return storyboard !== null;
      case 6: return upload !== null;
      default: return false;
    }
  };

  const getStepStatus = (step: 1 | 2 | 4 | 5 | 6) => {
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

  const currentStepIndex = workflowSteps.findIndex(s => s.step === currentStep);
  const progressPercentage = (currentStepIndex / (workflowSteps.length - 1)) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-4 bg-layer-1/95 backdrop-blur-sm border-b border-default sticky top-[65px] z-20">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-layer-3 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-6 gap-x-4">
          {workflowSteps.map((stepData, index) => {
            const status = getStepStatus(stepData.step);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";
            const isLocked = status === "locked";
            const Icon = stepData.icon;

            return (
              <div key={index} className="relative flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(stepData.step, stepData.path)}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                  disabled={isLocked}
                  className="relative w-full flex flex-col items-center cursor-pointer disabled:cursor-not-allowed transition-transform duration-200 hover:scale-110"
                >
                  <div
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      isCompleted ? 'bg-green-500 border-green-400'
                      : isCurrent ? 'bg-gradient-to-br from-cyan-500 to-blue-500 border-white shadow-lg shadow-blue-500/50'
                      : isLocked ? 'bg-layer-2 border-subtle'
                      : 'bg-layer-1 border-default hover:border-active'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-8 h-8 text-white" />
                    : isCurrent ? <Icon className="w-8 h-8 text-white" />
                    : isLocked ? <Lock className="w-7 h-7 text-disabled" />
                    : <Icon className="w-7 h-7 text-muted" />}
                  </div>
                </button>
                <h3 className={`mt-3 text-xs font-semibold text-center transition-colors ${
                    isCurrent ? 'text-white' : 'text-muted'
                }`}>
                  {stepData.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
