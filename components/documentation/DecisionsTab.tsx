"use client";

import AnimatedSection from "./AnimatedSection";
import {
  Brain,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Server,
  Database,
  Mail,
  Workflow,
  Zap,
} from "lucide-react";

export default function DecisionsTab() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <AnimatedSection delay={0}>
        <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-8 h-8 text-violet-400" />
            <h2 className="text-2xl font-bold text-white">
              Decisoes Arquiteturais - Claude Code
            </h2>
          </div>
          <p className="text-zinc-300">
            Registro historico de todas as decisoes arquiteturais, debates e consensos
            alcancados durante o desenvolvimento do ORION. Este documento serve como
            auditoria tecnica e memoria do projeto.
          </p>
        </div>
      </AnimatedSection>

      {/* Sessao 1: O Grande Debate - Janeiro 2026 */}
      <AnimatedSection delay={0.1}>
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-semibold text-white">
              Sessao 1: O Grande Debate Arquitetural (Janeiro 2026)
            </h3>
          </div>

          {/* Contexto */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-violet-400 mb-3">Contexto</h4>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Necessidade de migrar de localStorage para persistencia real em banco de dados,
              implementar workflows duraveis para processos longos (renderizacao de video,
              deep research), e criar sistema de aprovacao humana (human-in-the-loop).
            </p>
          </div>

          {/* Participantes */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-violet-400 mb-3">Participantes do Debate</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🤖</span>
                  <span className="font-medium text-white">Claude (Anthropic)</span>
                </div>
                <p className="text-zinc-400 text-sm">
                  Posicao: Conservadora e battle-tested. Priorizou estabilidade com Inngest.
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🌟</span>
                  <span className="font-medium text-white">Gemini (Google)</span>
                </div>
                <p className="text-zinc-400 text-sm">
                  Posicao: Bleeding edge. Descobriu ToolLoopAgent no AI SDK 6.
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💬</span>
                  <span className="font-medium text-white">ChatGPT (OpenAI)</span>
                </div>
                <p className="text-zinc-400 text-sm">
                  Posicao: Validador critico. Confirmou existencia do SDK 6 e cautela com beta.
                </p>
              </div>
            </div>
          </div>

          {/* Pontos Criticos Identificados */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-red-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Pontos Criticos Identificados
            </h4>
            <div className="space-y-3">
              <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
                <p className="text-red-300 font-medium mb-1">1. Vercel Functions Timeout</p>
                <p className="text-zinc-400 text-sm">
                  Limite de 300s (5 min) no Vercel Pro. Processos como renderizacao podem levar
                  minutos/horas. Solucao: workflows duraveis externos.
                </p>
              </div>
              <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
                <p className="text-red-300 font-medium mb-1">2. Vercel Workflow DevKit em Beta</p>
                <p className="text-zinc-400 text-sm">
                  Embora exista, ainda esta em Public Beta. Risco de bugs criticos em producao.
                </p>
              </div>
              <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
                <p className="text-red-300 font-medium mb-1">3. AI SDK Versao Atual</p>
                <p className="text-zinc-400 text-sm">
                  Projeto usa AI SDK 4.3.19. Para usar ToolLoopAgent, precisa migrar para v6.
                </p>
              </div>
            </div>
          </div>

          {/* Consenso Alcancado */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-green-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Consenso Unanime: OPCAO B - Arquitetura Hibrida
            </h4>
            <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-4">
              <p className="text-zinc-300 mb-4">
                Apos debate intenso, as tres IAs chegaram a um consenso:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                  <span className="text-zinc-300">
                    <strong className="text-white">Cerebro (AI SDK 6 + ToolLoopAgent):</strong> Inteligencia
                    de ultima geracao para agentes autonomos.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Server className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-zinc-300">
                    <strong className="text-white">Corpo Blindado (Inngest):</strong> Durabilidade,
                    retries automaticos, sleep nativo, battle-tested (100M+ execucoes/dia).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-zinc-300">
                    <strong className="text-white">Persistencia (Vercel Postgres + Prisma):</strong> Estado
                    persistente cross-device, relacional, migracao controlada.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-zinc-300">
                    <strong className="text-white">Notificacao (Resend):</strong> 10K emails/mes gratis
                    para aprovacao humana.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Stack Final Decidida */}
      <AnimatedSection delay={0.2}>
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Workflow className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">
              Stack Tecnica Final Aprovada
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">Camada</th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">Tecnologia</th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">Justificativa</th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">Custo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-medium">Intelligence</td>
                  <td className="py-3 px-4 text-cyan-400">AI SDK 6 + ToolLoopAgent</td>
                  <td className="py-3 px-4 text-zinc-400">Agentes autonomos com loop de ferramentas</td>
                  <td className="py-3 px-4 text-green-400">$0</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-medium">Orchestration</td>
                  <td className="py-3 px-4 text-cyan-400">Inngest</td>
                  <td className="py-3 px-4 text-zinc-400">Workflows duraveis, 100K runs/mes free</td>
                  <td className="py-3 px-4 text-green-400">$0</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-medium">Persistence</td>
                  <td className="py-3 px-4 text-cyan-400">Vercel Postgres + Prisma</td>
                  <td className="py-3 px-4 text-zinc-400">256MB incluido no Pro, ORM type-safe</td>
                  <td className="py-3 px-4 text-green-400">$0</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-medium">Storage</td>
                  <td className="py-3 px-4 text-cyan-400">Vercel Blob</td>
                  <td className="py-3 px-4 text-zinc-400">1GB incluido no Pro para videos/audios</td>
                  <td className="py-3 px-4 text-green-400">$0</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-medium">Notifications</td>
                  <td className="py-3 px-4 text-cyan-400">Resend</td>
                  <td className="py-3 px-4 text-zinc-400">10K emails/mes para aprovacao</td>
                  <td className="py-3 px-4 text-green-400">$0</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-white font-bold">TOTAL</td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4 text-green-400 font-bold">$20/mes (Vercel Pro)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>

      {/* Arquitetura Visual */}
      <AnimatedSection delay={0.3}>
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">
              Arquitetura do Pipeline de Video
            </h3>
          </div>

          <div className="bg-zinc-950 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm text-zinc-300 whitespace-pre font-mono">
{`┌─────────────────────────────────────────────────────────────────┐
│  AI SDK 6 (ToolLoopAgent)          Inngest                      │
│  ┌─────────────────────┐           ┌─────────────────────┐      │
│  │ Research Agent      │──────────>│ step.run()          │      │
│  │ (Gemini 2.0)        │           │ step.sleep()        │      │
│  └─────────────────────┘           │ step.waitForEvent() │      │
│  ┌─────────────────────┐           │ Retry automatico    │      │
│  │ Script Agent        │──────────>│                     │      │
│  │ (Claude 3.5)        │           └─────────────────────┘      │
│  └─────────────────────┘                    │                   │
│                                             ▼                   │
│                        ┌────────────────────────────────────┐   │
│                        │ Vercel Postgres + Blob             │   │
│                        └────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

FLUXO DO WORKFLOW:
─────────────────────────────────────────────────────────────────────
1. Deep Research (Gemini)    →  Pesquisa trends e referencias
2. Script Generation (Claude) →  Gera roteiro otimizado
3. AGUARDAR APROVACAO        →  Email + step.waitForEvent('7d')
4. Storyboard Generation     →  Cria cenas com prompts visuais
5. Render (JSON2VIDEO)       →  step.sleep() enquanto renderiza
6. Upload YouTube            →  Com retry automatico`}
            </pre>
          </div>
        </div>
      </AnimatedSection>

      {/* Modelo de Dados */}
      <AnimatedSection delay={0.4}>
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-semibold text-white">
              Modelo de Dados (Prisma Schema)
            </h3>
          </div>

          <div className="bg-zinc-950 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs sm:text-sm text-green-400 whitespace-pre font-mono">
{`model Project {
  id          String         @id @default(cuid())
  name        String
  status      ProjectStatus  @default(DRAFT)
  createdAt   DateTime       @default(now())

  // Relacionamentos
  context     Context?
  research    Research?
  script      Script?
  storyboard  Storyboard?
  render      Render?
  upload      Upload?
  workflow    WorkflowState?
}

enum ProjectStatus {
  DRAFT | RESEARCHING | SCRIPTING | AWAITING_APPROVAL
  APPROVED | RENDERING | UPLOADING | COMPLETED | FAILED
}

model WorkflowState {
  inngestRunId     String?   // ID da execucao no Inngest
  currentStep      String
  awaitingApproval Boolean   @default(false)
  approvalToken    String?   @unique
}`}
            </pre>
          </div>
        </div>
      </AnimatedSection>

      {/* Status de Implementacao */}
      <AnimatedSection delay={0.5}>
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            Fases Implementadas (Concluido em 23/01/2026)
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">FASE 1</span>
              <span className="text-green-300 line-through">Setup Prisma + Vercel Postgres + Schema</span>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">FASE 2</span>
              <span className="text-green-300 line-through">Configuracao Inngest + Client + Webhook</span>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">FASE 3</span>
              <span className="text-green-300 line-through">Agentes AI SDK 6 (Research + Script)</span>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">FASE 4</span>
              <span className="text-green-300 line-through">Sistema de Aprovacao + Notificacoes</span>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">FASE 5</span>
              <span className="text-amber-300">Refatoracao Frontend + Migracao localStorage</span>
              <span className="text-amber-400 text-xs">(Em progresso)</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">Arquivos Criados:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              <div className="text-cyan-400">prisma/schema.prisma</div>
              <div className="text-cyan-400">lib/db/prisma.ts</div>
              <div className="text-cyan-400">lib/inngest/client.ts</div>
              <div className="text-cyan-400">lib/inngest/functions/video-pipeline.ts</div>
              <div className="text-cyan-400">lib/agents/research-agent.ts</div>
              <div className="text-cyan-400">lib/agents/script-agent.ts</div>
              <div className="text-cyan-400">lib/services/research.service.ts</div>
              <div className="text-cyan-400">lib/services/script.service.ts</div>
              <div className="text-cyan-400">lib/services/notification.service.ts</div>
              <div className="text-cyan-400">app/api/inngest/route.ts</div>
              <div className="text-cyan-400">app/api/approve/route.ts</div>
              <div className="text-cyan-400">app/approve/[token]/page.tsx</div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <AnimatedSection delay={0.6}>
        <div className="bg-zinc-800/30 rounded-xl p-4 text-center">
          <p className="text-zinc-500 text-sm">
            Documento gerado em: 23/01/2026 | Implementacao concluida: 23/01/2026
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            Participantes: Claude (Anthropic), Gemini (Google), ChatGPT (OpenAI) | Deploy: Vercel Pro
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
}
