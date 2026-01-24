"use client";

import {
  Play,
  Search,
  FileText,
  Film,
  Clapperboard,
  Upload,
  Users,
  Bot,
  ArrowRight,
  CheckCircle2,
  Monitor,
  Server,
  Database,
  Briefcase,
  GraduationCap,
  Building,
} from "lucide-react";
import { CopyMdButtons } from "./CopyButton";

export default function SystemVisionTab() {
  const workflowSteps = [
    {
      num: 1,
      title: "Input",
      subtitle: "Entrada de Dados",
      icon: Play,
      color: "indigo",
      inputs: ["Tema principal", "Configurações de formato", "Público-alvo", "Diretrizes"],
      outputs: ["Objeto de contexto", "Parâmetros validados"],
    },
    {
      num: 2,
      title: "Research",
      subtitle: "Pesquisa",
      icon: Search,
      color: "blue",
      inputs: ["Contexto estruturado"],
      outputs: ["Dados de pesquisa", "Referências", "Sugestões"],
    },
    {
      num: 3,
      title: "Proposal",
      subtitle: "Proposta Criativa",
      icon: FileText,
      color: "purple",
      inputs: ["Pesquisa consolidada"],
      outputs: ["Roteiro", "Títulos", "Descrição", "Tags"],
    },
    {
      num: 4,
      title: "Studio",
      subtitle: "Produção Visual",
      icon: Film,
      color: "pink",
      inputs: ["Roteiro aprovado"],
      outputs: ["Storyboard", "Mídias selecionadas"],
    },
    {
      num: 5,
      title: "Render",
      subtitle: "Composição",
      icon: Clapperboard,
      color: "orange",
      inputs: ["Storyboard completo"],
      outputs: ["Vídeo renderizado", "Preview"],
    },
    {
      num: 6,
      title: "Upload",
      subtitle: "Publicação",
      icon: Upload,
      color: "green",
      inputs: ["Vídeo final"],
      outputs: ["URL do vídeo", "Estatísticas"],
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
    indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400", gradient: "from-indigo-500 to-indigo-600" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", gradient: "from-blue-500 to-blue-600" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", gradient: "from-purple-500 to-purple-600" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", gradient: "from-pink-500 to-pink-600" },
    orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", gradient: "from-orange-500 to-orange-600" },
    green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", gradient: "from-green-500 to-green-600" },
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/50 via-cyan-900/50 to-blue-900/50 border border-blue-500/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="text-2xl font-bold text-white mb-4">O Que o Sistema Faz</h2>
          <p className="text-lg text-secondary leading-relaxed max-w-3xl">
            O <strong className="text-white">ORION</strong> é uma plataforma de automação
            de produção de vídeos que transforma um simples tema em um{" "}
            <span className="text-cyan-400 font-semibold">
              vídeo completo publicado no YouTube
            </span>
            . O sistema orquestra múltiplas IAs e serviços para executar cada etapa do processo de produção.
          </p>
        </div>
      </section>

      {/* Target Audience */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            Para Quem Foi Projetado
          </h3>
          <CopyMdButtons
            content="Público-alvo: Criadores Solo (empreendedores, educadores), Pequenas Empresas (marketing, comunicação), Agências (produção em escala, prototipagem)"
            markdownContent={`## Para Quem Foi Projetado\n\n### Criadores de Conteúdo Solo\n- Empreendedores digitais\n- Educadores e professores\n- Profissionais liberais\n\n### Pequenas Empresas\n- Marketing digital interno\n- Comunicação institucional\n- Treinamento corporativo\n\n### Agências e Produtoras\n- Produção em escala\n- Prototipagem rápida\n- Testes de conceito`}
            filename="publico-alvo.md"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Briefcase,
              title: "Criadores de Conteúdo Solo",
              items: ["Empreendedores digitais", "Educadores e professores", "Profissionais liberais"],
              color: "cyan",
            },
            {
              icon: Building,
              title: "Pequenas Empresas",
              items: ["Marketing digital interno", "Comunicação institucional", "Treinamento corporativo"],
              color: "blue",
            },
            {
              icon: GraduationCap,
              title: "Agências e Produtoras",
              items: ["Produção em escala", "Prototipagem rápida", "Testes de conceito"],
              color: "indigo",
            },
          ].map((profile, index) => (
            <div
              key={index}
              className="bg-layer-1 border border-subtle rounded-xl p-6"
            >
              <profile.icon className={`w-10 h-10 text-${profile.color}-400 mb-4`} />
              <h4 className="font-bold text-white mb-3">{profile.title}</h4>
              <ul className="space-y-2">
                {profile.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Steps */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Play className="w-6 h-6 text-green-400" />
            Fluxo Principal de Funcionamento
          </h3>
          <CopyMdButtons
            content="Workflow: 1) Input (Tema, Configurações) → 2) Research (Pesquisa) → 3) Proposal (Roteiro) → 4) Studio (Storyboard) → 5) Render (Vídeo) → 6) Upload (YouTube)"
            markdownContent={`## Fluxo Principal de Funcionamento\n\n### 1. Input - Entrada de Dados\n- **Entradas:** Tema principal, Configurações de formato, Público-alvo, Diretrizes\n- **Saídas:** Objeto de contexto, Parâmetros validados\n\n### 2. Research - Pesquisa\n- **Entradas:** Contexto estruturado\n- **Saídas:** Dados de pesquisa, Referências, Sugestões\n\n### 3. Proposal - Proposta Criativa\n- **Entradas:** Pesquisa consolidada\n- **Saídas:** Roteiro, Títulos, Descrição, Tags\n\n### 4. Studio - Produção Visual\n- **Entradas:** Roteiro aprovado\n- **Saídas:** Storyboard, Mídias selecionadas\n\n### 5. Render - Composição\n- **Entradas:** Storyboard completo\n- **Saídas:** Vídeo renderizado, Preview\n\n### 6. Upload - Publicação\n- **Entradas:** Vídeo final\n- **Saídas:** URL do vídeo, Estatísticas`}
            filename="workflow.md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowSteps.map((step) => {
            const colors = colorMap[step.color];
            return (
              <div
                key={step.num}
                className={`${colors.bg} ${colors.border} border rounded-xl p-5 relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 text-6xl font-bold text-white/5">
                  {step.num}
                </div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{step.title}</h4>
                      <p className={`text-sm ${colors.text}`}>{step.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted uppercase mb-2">Entradas</p>
                      <div className="flex flex-wrap gap-1">
                        {step.inputs.map((input, i) => (
                          <span key={i} className="px-2 py-1 bg-layer-2 rounded text-xs text-secondary">
                            {input}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted uppercase mb-2">Saídas</p>
                      <div className="flex flex-wrap gap-1">
                        {step.outputs.map((output, i) => (
                          <span key={i} className={`px-2 py-1 ${colors.bg} rounded text-xs ${colors.text}`}>
                            {output}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Human vs Automation */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Interação entre Automação e Decisão Humana
          </h3>
          <CopyMdButtons
            content="Filosofia: O sistema sugere, o humano decide. Cada etapa gera proposta, usuário pode aceitar/modificar/regenerar, histórico permite rollback."
            markdownContent={`## Interação entre Automação e Decisão Humana\n\n| Etapa | Decisão Humana | Automação |\n|-------|----------------|----------|\n| Input | Define tema e parâmetros | Valida e estrutura |\n| Research | Aprova abordagem | Pesquisa e sintetiza |\n| Proposal | Revisa e edita roteiro | Gera todas as versões |\n| Studio | Ajusta mídias | Seleciona e compõe |\n| Render | Aprova preview | Renderiza vídeo |\n| Upload | Confirma publicação | Executa upload |\n\n### Filosofia de Controle\n**"O sistema sugere, o humano decide"**\n\n- Cada etapa gera uma proposta completa\n- O usuário pode aceitar, modificar ou regenerar\n- Nenhuma ação destrutiva sem confirmação\n- Histórico de versões permite rollback`}
            filename="automacao-humano.md"
          />
        </div>

        <div className="bg-layer-1 border border-subtle rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 gap-0 border-b border-subtle bg-layer-2/50">
            <div className="p-4 font-semibold text-white">Etapa</div>
            <div className="p-4 font-semibold text-purple-400 flex items-center gap-2">
              <Users className="w-4 h-4" /> Decisão Humana
            </div>
            <div className="p-4 font-semibold text-cyan-400 flex items-center gap-2">
              <Bot className="w-4 h-4" /> Automação
            </div>
          </div>
          {[
            { step: "Input", human: "Define tema e parâmetros", auto: "Valida e estrutura" },
            { step: "Research", human: "Aprova abordagem", auto: "Pesquisa e sintetiza" },
            { step: "Proposal", human: "Revisa e edita roteiro", auto: "Gera todas as versões" },
            { step: "Studio", human: "Ajusta mídias", auto: "Seleciona e compõe" },
            { step: "Render", human: "Aprova preview", auto: "Renderiza vídeo" },
            { step: "Upload", human: "Confirma publicação", auto: "Executa upload" },
          ].map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-0 border-b border-subtle last:border-0 hover:bg-layer-2/30 transition-colors"
            >
              <div className="p-4 text-secondary font-medium">{row.step}</div>
              <div className="p-4 text-muted text-sm">{row.human}</div>
              <div className="p-4 text-muted text-sm">{row.auto}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-5 bg-purple-900/20 border border-purple-500/20 rounded-xl">
          <h4 className="font-bold text-purple-400 mb-2">Filosofia de Controle</h4>
          <p className="text-xl font-semibold text-white mb-4">&quot;O sistema sugere, o humano decide&quot;</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Cada etapa gera uma proposta completa",
              "O usuário pode aceitar, modificar ou regenerar",
              "Nenhuma ação destrutiva sem confirmação",
              "Histórico de versões permite rollback",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-secondary text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Architecture Components */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-orange-400" />
            Componentes Principais e Responsabilidades
          </h3>
          <CopyMdButtons
            content="Componentes: Frontend (Next.js, React, Tailwind, Zustand), Backend (API Routes, integração IAs), Estado Global (Zustand Stores com localStorage)"
            markdownContent={`## Componentes Principais\n\n### Frontend (Next.js App Router)\n**Responsabilidades:**\n- Interface de usuário\n- Navegação por workflow\n- Estado local e persistência\n- Comunicação com APIs\n\n**Tecnologias:** React 19, Tailwind, Framer Motion, Zustand\n\n### Backend (API Routes)\n**Responsabilidades:**\n- Integração com IAs\n- Comunicação externa\n- Processamento de dados\n- Validação e segurança\n\n**Endpoints:** /api/proposal/*, /api/images/*, /api/youtube/*\n\n### Estado Global (Zustand Stores)\n**Stores:**\n- WorkflowStore - Dados e navegação\n- GuidelinesStore - Diretrizes\n- UIStore - Estado de interface\n\n**Persistência:** localStorage`}
            filename="componentes.md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Frontend */}
          <div className="bg-gradient-to-b from-blue-900/30 to-zinc-900 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="w-8 h-8 text-blue-400" />
              <div>
                <h4 className="font-bold text-white">Frontend</h4>
                <p className="text-xs text-blue-400">Next.js App Router</p>
              </div>
            </div>
            <p className="text-xs font-medium text-muted uppercase mb-2">Responsabilidades</p>
            <ul className="space-y-2 text-sm text-muted">
              <li>Interface de usuário</li>
              <li>Navegação por workflow</li>
              <li>Estado local e persistência</li>
              <li>Comunicação com APIs</li>
            </ul>
            <p className="text-xs font-medium text-muted uppercase mt-4 mb-2">Tecnologias</p>
            <div className="flex flex-wrap gap-1">
              {["React 19", "Tailwind", "Framer Motion", "Zustand"].map((tech, i) => (
                <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="bg-gradient-to-b from-green-900/30 to-zinc-900 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-8 h-8 text-green-400" />
              <div>
                <h4 className="font-bold text-white">Backend</h4>
                <p className="text-xs text-green-400">API Routes</p>
              </div>
            </div>
            <p className="text-xs font-medium text-muted uppercase mb-2">Responsabilidades</p>
            <ul className="space-y-2 text-sm text-muted">
              <li>Integração com IAs</li>
              <li>Comunicação externa</li>
              <li>Processamento de dados</li>
              <li>Validação e segurança</li>
            </ul>
            <p className="text-xs font-medium text-muted uppercase mt-4 mb-2">Endpoints</p>
            <div className="flex flex-wrap gap-1">
              {["/api/proposal/*", "/api/images/*", "/api/youtube/*"].map((endpoint, i) => (
                <span key={i} className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-mono">
                  {endpoint}
                </span>
              ))}
            </div>
          </div>

          {/* State */}
          <div className="bg-gradient-to-b from-amber-900/30 to-zinc-900 border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-amber-400" />
              <div>
                <h4 className="font-bold text-white">Estado Global</h4>
                <p className="text-xs text-amber-400">Zustand Stores</p>
              </div>
            </div>
            <p className="text-xs font-medium text-muted uppercase mb-2">Stores</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><strong className="text-amber-400">WorkflowStore</strong> - Dados e navegação</li>
              <li><strong className="text-amber-400">GuidelinesStore</strong> - Diretrizes</li>
              <li><strong className="text-amber-400">UIStore</strong> - Estado de interface</li>
            </ul>
            <p className="text-xs font-medium text-muted uppercase mt-4 mb-2">Persistência</p>
            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs">
              localStorage
            </span>
          </div>
        </div>
      </section>

      {/* Flow Diagram */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ArrowRight className="w-6 h-6 text-cyan-400" />
          Diagrama de Fluxo Operacional
        </h3>

        <div className="bg-layer-1 border border-subtle rounded-xl p-6 overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Top Row */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {[
                { name: "INPUT", sub: "Tema", color: "indigo" },
                { name: "RESEARCH", sub: "Pesquisa", color: "blue" },
                { name: "PROPOSAL", sub: "Roteiro", color: "purple" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`bg-${step.color}-500/20 border border-${step.color}-500/30 rounded-lg p-4 text-center min-w-[120px]`}>
                    <p className={`font-bold text-${step.color}-400`}>{step.name}</p>
                    <p className="text-xs text-muted">{step.sub}</p>
                  </div>
                  {i < 2 && <ArrowRight className="w-6 h-6 text-disabled" />}
                </div>
              ))}
            </div>

            {/* Arrow Down */}
            <div className="flex justify-end mr-16 mb-6">
              <div className="w-0.5 h-12 bg-zinc-700" />
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-center gap-4 flex-row-reverse">
              {[
                { name: "UPLOAD", sub: "YouTube", color: "green" },
                { name: "RENDER", sub: "Vídeo", color: "orange" },
                { name: "STUDIO", sub: "Storyboard", color: "pink" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  {i < 2 && <ArrowRight className="w-6 h-6 text-disabled rotate-180" />}
                  <div className={`bg-${step.color}-500/20 border border-${step.color}-500/30 rounded-lg p-4 text-center min-w-[120px]`}>
                    <p className={`font-bold text-${step.color}-400`}>{step.name}</p>
                    <p className="text-xs text-muted">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl">
        <p className="text-sm text-blue-300 italic text-center">
          Este documento descreve a visão sistêmica do ORION, detalhando seu
          funcionamento e a interação entre componentes automatizados e decisões humanas.
        </p>
      </div>
    </div>
  );
}
