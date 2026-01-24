"use client";

import {
  Lightbulb,
  Target,
  Code2,
  CheckCircle2,
  XCircle,
  Puzzle,
  Layers,
  Eye,
  Shield,
  FileText,
  Zap,
  Brain,
  Users,
  Clock,
  DollarSign,
} from "lucide-react";
import { CopyMdButtons } from "./CopyButton";

export default function GenesisTab() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-purple-900/50 border border-purple-500/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Lightbulb className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Por Que Este Sistema Foi Criado
              </h2>
              <p className="text-purple-300">A origem e propósito fundamental</p>
            </div>
          </div>
          <p className="text-lg text-secondary leading-relaxed max-w-3xl">
            O <strong className="text-white">ORION</strong> (anteriormente ORION) nasceu de uma necessidade
            real e urgente: <span className="text-purple-400 font-semibold">democratizar a produção
            de vídeos profissionais para YouTube</span>, eliminando as barreiras técnicas, financeiras
            e de tempo que impedem criadores de conteúdo de manter uma presença consistente na plataforma.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-red-400" />
            O Problema Fundamental
          </h3>
          <CopyMdButtons
            content="Barreiras para criar vídeos: 1) Habilidades técnicas (edição, design, áudio), 2) Investimento (equipamentos, software), 3) Tempo extensivo (8-20h por vídeo), 4) Conhecimento SEO"
            markdownContent={`## O Problema Fundamental\n\nCriar vídeos de qualidade para YouTube tradicionalmente exige:\n\n1. **Habilidades Técnicas** - Edição de vídeo, design gráfico e produção de áudio\n2. **Investimento** - Equipamentos, software e possivelmente equipe\n3. **Tempo Extensivo** - Um vídeo de 10 min pode levar 8-20 horas de produção\n4. **Conhecimento SEO** - Otimização e descoberta do conteúdo\n\n> Esta barreira exclui milhões de potenciais criadores que têm conhecimento valioso mas não os recursos para transformá-lo em conteúdo visual.`}
            filename="problema.md"
          />
        </div>
        <p className="text-muted mb-6">
          Criar vídeos de qualidade para YouTube tradicionalmente exige:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Code2,
              title: "Habilidades Técnicas",
              description: "Edição de vídeo, design gráfico e produção de áudio",
              color: "text-red-400",
              bg: "bg-red-500/10",
              border: "border-red-500/20",
            },
            {
              icon: DollarSign,
              title: "Investimento",
              description: "Equipamentos, software e possivelmente equipe",
              color: "text-orange-400",
              bg: "bg-orange-500/10",
              border: "border-orange-500/20",
            },
            {
              icon: Clock,
              title: "Tempo Extensivo",
              description: "Um vídeo de 10 min pode levar 8-20 horas de produção",
              color: "text-yellow-400",
              bg: "bg-yellow-500/10",
              border: "border-yellow-500/20",
            },
            {
              icon: Brain,
              title: "Conhecimento SEO",
              description: "Otimização e descoberta do conteúdo",
              color: "text-amber-400",
              bg: "bg-amber-500/10",
              border: "border-amber-500/20",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`${item.bg} ${item.border} border rounded-xl p-5`}
            >
              <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
              <h4 className="font-semibold text-white mb-2">{item.title}</h4>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-layer-2/50 rounded-xl border border-subtle">
          <p className="text-secondary italic">
            Essa barreira exclui milhões de potenciais criadores que têm conhecimento
            valioso mas não os recursos para transformá-lo em conteúdo visual.
          </p>
        </div>
      </section>

      {/* The Solution */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-green-400" />
            A Solução Proposta
          </h3>
          <CopyMdButtons
            content="ORION: 1) Recebe tema, 2) Pesquisa conteúdo, 3) Gera roteiro/trilha/thumbnail/descrição, 4) Cria storyboard, 5) Renderiza vídeo, 6) Publica no YouTube"
            markdownContent={`## A Solução Proposta\n\nO ORION é um sistema de automação inteligente que:\n\n1. Recebe apenas o tema/tópico do vídeo\n2. Pesquisa e estrutura o conteúdo automaticamente\n3. Gera roteiro, trilha sonora, thumbnail e descrição\n4. Cria o storyboard com seleção de mídias\n5. Renderiza o vídeo final\n6. Publica diretamente no YouTube`}
            filename="solucao.md"
          />
        </div>
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-xl p-6">
          <p className="text-secondary mb-6">
            O ORION é um <strong className="text-green-400">sistema de automação inteligente</strong> que:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: "1", text: "Recebe apenas o tema/tópico do vídeo" },
              { num: "2", text: "Pesquisa e estrutura o conteúdo automaticamente" },
              { num: "3", text: "Gera roteiro, trilha sonora, thumbnail e descrição" },
              { num: "4", text: "Cria o storyboard com seleção de mídias" },
              { num: "5", text: "Renderiza o vídeo final" },
              { num: "6", text: "Publica diretamente no YouTube" },
            ].map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-layer-1/50 rounded-lg"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{step.num}</span>
                </div>
                <p className="text-secondary text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Guidelines */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Diretrizes de Design (Prompts Fundacionais)
          </h3>
          <CopyMdButtons
            content="Diretrizes: 1) Automação Máxima com Controle Humano, 2) Qualidade Profissional, 3) Interface Intuitiva, 4) Escalabilidade"
            markdownContent={`## Diretrizes de Design\n\n### 1. Automação Máxima, Controle Humano\n- O sistema automatiza tarefas repetitivas e técnicas\n- O humano mantém controle sobre decisões criativas e editoriais\n- Cada etapa pode ser revisada e modificada antes de avançar\n\n### 2. Qualidade de Produção Profissional\n- Outputs devem ser indistinguíveis de produções manuais\n- Padrões de YouTube Creator Academy são referência\n- SEO e engagement são prioridades arquiteturais\n\n### 3. Interface Intuitiva\n- Zero curva de aprendizado para operações básicas\n- Interface guiada por workflow linear\n- Feedback visual claro em cada etapa\n\n### 4. Escalabilidade\n- Suportar múltiplos vídeos em paralelo\n- Funcionar com diferentes nichos de conteúdo\n- Permitir personalização de diretrizes por projeto`}
            filename="diretrizes-design.md"
          />
        </div>
        <div className="space-y-4">
          {[
            {
              title: "Automação Máxima, Controle Humano",
              points: [
                "O sistema automatiza tarefas repetitivas e técnicas",
                "O humano mantém controle sobre decisões criativas e editoriais",
                "Cada etapa pode ser revisada e modificada antes de avançar",
              ],
              icon: Users,
              color: "indigo",
            },
            {
              title: "Qualidade de Produção Profissional",
              points: [
                "Outputs devem ser indistinguíveis de produções manuais",
                "Padrões de YouTube Creator Academy são referência",
                "SEO e engagement são prioridades arquiteturais",
              ],
              icon: Target,
              color: "purple",
            },
            {
              title: "Interface Intuitiva",
              points: [
                "Zero curva de aprendizado para operações básicas",
                "Interface guiada por workflow linear",
                "Feedback visual claro em cada etapa",
              ],
              icon: Eye,
              color: "cyan",
            },
            {
              title: "Escalabilidade",
              points: [
                "Suportar múltiplos vídeos em paralelo",
                "Funcionar com diferentes nichos de conteúdo",
                "Permitir personalização de diretrizes por projeto",
              ],
              icon: Layers,
              color: "green",
            },
          ].map((guideline, index) => (
            <div
              key={index}
              className={`bg-${guideline.color}-500/5 border border-${guideline.color}-500/20 rounded-xl p-5`}
              style={{
                backgroundColor: `rgba(var(--${guideline.color}-rgb, 99, 102, 241), 0.05)`,
                borderColor: `rgba(var(--${guideline.color}-rgb, 99, 102, 241), 0.2)`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <guideline.icon className={`w-6 h-6 text-${guideline.color}-400`} />
                <h4 className="font-semibold text-white">{guideline.title}</h4>
              </div>
              <ul className="space-y-2">
                {guideline.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-secondary text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Architectural Decisions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Puzzle className="w-6 h-6 text-amber-400" />
            Decisões Arquiteturais Derivadas
          </h3>
          <CopyMdButtons
            content="Por que Next.js 15? App Router, Server Components, API Routes, Vercel nativo. Por que Zustand? Simplicidade, persistência localStorage, TypeScript first. Por que 6 Etapas? Espelha produção real, validação humana, rollback."
            markdownContent={`## Decisões Arquiteturais\n\n### Por que Next.js 15?\n- App Router para roteamento moderno\n- Server Components para performance\n- API Routes para backend integrado\n- Vercel como deploy nativo\n\n### Por que Zustand?\n- Simplicidade sobre complexidade\n- Persistência nativa com localStorage\n- TypeScript first\n- Minimal boilerplate\n\n### Por que 6 Etapas?\n- Espelha produção real de vídeo\n- Validação humana em cada transição\n- Rollback para etapas anteriores\n- Clareza sobre status atual`}
            filename="decisoes-arquiteturais.md"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-layer-1 border border-subtle rounded-xl p-5">
            <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-white">N</span>
            </div>
            <h4 className="font-bold text-white mb-2">Por que Next.js 15?</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>App Router para roteamento moderno</li>
              <li>Server Components para performance</li>
              <li>API Routes para backend integrado</li>
              <li>Vercel como deploy nativo</li>
            </ul>
          </div>
          <div className="bg-layer-1 border border-subtle rounded-xl p-5">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-white">Z</span>
            </div>
            <h4 className="font-bold text-white mb-2">Por que Zustand?</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>Simplicidade sobre complexidade</li>
              <li>Persistência nativa com localStorage</li>
              <li>TypeScript first</li>
              <li>Minimal boilerplate</li>
            </ul>
          </div>
          <div className="bg-layer-1 border border-subtle rounded-xl p-5">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-white">6</span>
            </div>
            <h4 className="font-bold text-white mb-2">Por que 6 Etapas?</h4>
            <ul className="text-sm text-muted space-y-1">
              <li>Espelha produção real de vídeo</li>
              <li>Validação humana em cada transição</li>
              <li>Rollback para etapas anteriores</li>
              <li>Clareza sobre status atual</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What the system does/doesn't do */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6 text-cyan-400" />
          Elementos Intencionais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-5">
            <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              O que o sistema FAZ:
            </h4>
            <ul className="space-y-3">
              {[
                "Pesquisa profunda sobre qualquer tema",
                "Geração de roteiros otimizados para engagement",
                "Seleção automática de mídia relevante",
                "Composição de vídeo com narração",
                "Upload direto para YouTube",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-secondary text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-5">
            <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              O que o sistema NÃO FAZ (exclusões conscientes):
            </h4>
            <ul className="space-y-3">
              {[
                "Não substitui a voz humana",
                "Não gera conteúdo controverso",
                "Não garante viralização",
                "Não armazena vídeos eternamente",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-secondary text-sm">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-violet-400" />
          Princípios de Design
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              num: "1",
              title: "Transparência sobre Magia",
              description:
                "O sistema mostra claramente o que está fazendo em cada etapa, evitando caixas pretas que frustram usuários.",
            },
            {
              num: "2",
              title: "Falhas Graceful",
              description:
                "Quando uma integração falha, o sistema oferece alternativas ou permite retry, nunca travando completamente.",
            },
            {
              num: "3",
              title: "Dados Locais",
              description:
                "Dados sensíveis (API keys, configurações) ficam no navegador do usuário, não em servidores externos.",
            },
            {
              num: "4",
              title: "Documentação Viva",
              description:
                "Este próprio módulo é parte do sistema, não um documento externo que envelhece.",
            },
          ].map((principle, index) => (
            <div
              key={index}
              className="bg-layer-1/50 border border-subtle rounded-xl p-5 flex gap-4"
            >
              <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-violet-400 font-bold">{principle.num}</span>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{principle.title}</h4>
                <p className="text-sm text-muted">{principle.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Note */}
      <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl">
        <p className="text-sm text-purple-300 italic text-center">
          Este documento representa a intenção fundacional do sistema ORION,
          servindo como referência para decisões futuras e transferência de contexto entre IAs.
        </p>
      </div>
    </div>
  );
}
