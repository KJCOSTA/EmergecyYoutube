"use client";

import { motion } from "framer-motion";
import { Zap, Settings, Crown, CheckCircle2, Lock } from "lucide-react";
import { WorkflowMode } from "@/types";
import { WORKFLOW_MODES, WorkflowModeConfig } from "@/lib/workflow-modes";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface ModeSelectorProps {
  selectedMode: WorkflowMode;
  onSelect: (mode: WorkflowMode) => void;
  className?: string;
}

const iconMap = {
  Zap: Zap,
  Settings: Settings,
  Crown: Crown,
};

export default function ModeSelector({
  selectedMode,
  onSelect,
  className,
}: ModeSelectorProps) {
  const modes = Object.values(WORKFLOW_MODES);

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Escolha o Modo de Operação
        </h3>
        <p className="text-sm text-gray-400">
          Selecione como você deseja criar seu vídeo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => (
          <ModeCard
            key={mode.id}
            mode={mode}
            isSelected={selectedMode === mode.id}
            onSelect={() => onSelect(mode.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface ModeCardProps {
  mode: WorkflowModeConfig;
  isSelected: boolean;
  onSelect: () => void;
}

function ModeCard({ mode, isSelected, onSelect }: ModeCardProps) {
  const Icon = iconMap[mode.icone as keyof typeof iconMap] || Zap;

  return (
    <motion.button
      onClick={mode.ativo ? onSelect : undefined}
      disabled={!mode.ativo}
      whileHover={mode.ativo ? { scale: 1.02 } : undefined}
      whileTap={mode.ativo ? { scale: 0.98 } : undefined}
      className={cn(
        "relative p-6 rounded-xl border text-left transition-all duration-200",
        "bg-gradient-to-br backdrop-blur-sm",
        mode.ativo
          ? isSelected
            ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
            : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
          : "border-gray-800 bg-gray-900/30 cursor-not-allowed opacity-60"
      )}
    >
      {/* Badge de destaque */}
      {mode.badge && (
        <div className="absolute top-4 right-4">
          <Badge variant={mode.ativo ? "primary" : "secondary"}>
            {mode.badge}
          </Badge>
        </div>
      )}

      {/* Ícone do modo */}
      <div
        className={cn(
          "mb-4 p-3 rounded-lg inline-flex",
          mode.ativo
            ? `bg-gradient-to-br ${mode.cor}`
            : "bg-gray-800"
        )}
      >
        {mode.ativo ? (
          <Icon className="w-6 h-6 text-white" />
        ) : (
          <Lock className="w-6 h-6 text-gray-500" />
        )}
      </div>

      {/* Nome e descrição */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          {mode.nome}
          {isSelected && mode.ativo && (
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          )}
        </h4>
        <p className="text-sm text-gray-400">{mode.descricao}</p>
      </div>

      {/* Tempo estimado */}
      {mode.ativo && (
        <div className="mb-4 text-xs text-gray-500">
          ⏱️ Tempo estimado: {mode.tempoEstimado}
        </div>
      )}

      {/* Lista de recursos */}
      {mode.ativo && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Recursos incluídos:
          </p>
          <ul className="space-y-1">
            {mode.recursos.slice(0, 3).map((recurso, index) => (
              <li key={index} className="text-xs text-gray-500 flex items-start gap-2">
                <span className="text-cyan-500 mt-0.5">•</span>
                <span>{recurso}</span>
              </li>
            ))}
            {mode.recursos.length > 3 && (
              <li className="text-xs text-gray-500 italic">
                + {mode.recursos.length - 3} mais recursos
              </li>
            )}
          </ul>
        </div>
      )}

      {!mode.ativo && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 italic">
            Este modo estará disponível em breve
          </p>
        </div>
      )}

      {/* Indicador de seleção */}
      {isSelected && mode.ativo && (
        <div className="absolute inset-0 rounded-xl border-2 border-cyan-500 pointer-events-none" />
      )}
    </motion.button>
  );
}
