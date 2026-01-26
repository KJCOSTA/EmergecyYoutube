/**
 * ============================================
 * ORION - Sistema de Modos de Workflow
 * ============================================
 *
 * Configuração dos diferentes modos de operação do sistema ORION.
 * Cada modo define um conjunto de funcionalidades e fluxo de trabalho.
 */

import { WorkflowMode } from "@/types";

export interface WorkflowModeConfig {
  id: WorkflowMode;
  nome: string;
  descricao: string;
  descricaoDetalhada: string;
  ativo: boolean;
  recursos: string[];
  icone: string; // Lucide icon name
  cor: string; // Cor do gradiente
  tempoEstimado: string;
  badge?: string;
}

/**
 * Configuração completa de todos os modos disponíveis
 */
export const WORKFLOW_MODES: Record<WorkflowMode, WorkflowModeConfig> = {
  FAST: {
    id: "FAST",
    nome: "Modo Rápido",
    descricao: "Mídia stock + opção de geração IA sob demanda",
    descricaoDetalhada: "Crie vídeos rapidamente usando nossa biblioteca de mídia stock. Opcionalmente, gere mídia customizada com IA quando necessário.",
    ativo: true,
    recursos: [
      "Múltiplas fontes de input (planilha, tema, link, transcrição)",
      "Análise adaptativa com IA",
      "Teste A/B/C de thumbnails para YouTube",
      "Biblioteca de mídia stock (Pexels, Pixabay)",
      "Geração de mídia com IA sob demanda",
      "Upload de mídia própria",
      "Preview obrigatório antes do upload",
      "Feedback em tempo real"
    ],
    icone: "Zap",
    cor: "from-cyan-500 to-blue-600",
    tempoEstimado: "15-30 min",
    badge: "Recomendado"
  },
  STANDARD: {
    id: "STANDARD",
    nome: "Modo Padrão",
    descricao: "Em breve - Equilíbrio entre velocidade e personalização",
    descricaoDetalhada: "Modo balanceado com mais opções de customização e controle sobre o processo de criação.",
    ativo: false,
    recursos: [
      "Todas as funcionalidades do Modo Rápido",
      "Editor de roteiro avançado",
      "Timeline de edição",
      "Mais controles de personalização",
      "Aprovações em múltiplas etapas"
    ],
    icone: "Settings",
    cor: "from-blue-500 to-indigo-600",
    tempoEstimado: "45-60 min"
  },
  PREMIUM: {
    id: "PREMIUM",
    nome: "Modo Premium",
    descricao: "Em breve - Máxima personalização e controle",
    descricaoDetalhada: "Controle total sobre cada aspecto da produção do vídeo, com ferramentas profissionais de edição.",
    ativo: false,
    recursos: [
      "Todas as funcionalidades do Modo Padrão",
      "Editor de vídeo profissional integrado",
      "Biblioteca de transições e efeitos",
      "Animações customizadas",
      "Múltiplas revisões",
      "Exportação em múltiplos formatos",
      "Suporte prioritário"
    ],
    icone: "Crown",
    cor: "from-purple-500 to-pink-600",
    tempoEstimado: "90+ min",
    badge: "Em breve"
  }
};

/**
 * Retorna apenas os modos ativos
 */
export function getActiveModes(): WorkflowModeConfig[] {
  return Object.values(WORKFLOW_MODES).filter(mode => mode.ativo);
}

/**
 * Retorna configuração de um modo específico
 */
export function getModeConfig(mode: WorkflowMode): WorkflowModeConfig {
  return WORKFLOW_MODES[mode];
}

/**
 * Verifica se um modo está ativo
 */
export function isModeActive(mode: WorkflowMode): boolean {
  return WORKFLOW_MODES[mode].ativo;
}

/**
 * Retorna o modo padrão
 */
export function getDefaultMode(): WorkflowMode {
  return "FAST";
}
