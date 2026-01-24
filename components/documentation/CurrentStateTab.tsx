"use client";

import {
  Compass,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Calendar,
  Gauge,
} from "lucide-react";

export default function CurrentStateTab() {
  const completedFeatures = [
    { name: "Dashboard com Boot Sequence", priority: "Alta", impact: "Alto" },
    { name: "Workflow de 6 etapas", priority: "Crítica", impact: "Crítico" },
    { name: "Input de tema e configuração", priority: "Crítica", impact: "Alto" },
    { name: "Pesquisa com IA", priority: "Alta", impact: "Alto" },
    { name: "Geração de roteiro", priority: "Crítica", impact: "Crítico" },
    { name: "Geração de títulos/thumbnails", priority: "Alta", impact: "Alto" },
    { name: "Geração de descrição e tags", priority: "Alta", impact: "Alto" },
    { name: "Seleção de trilha sonora", priority: "Média", impact: "Médio" },
    { name: "Sistema de diretrizes", priority: "Média", impact: "Alto" },
    { name: "Configuração de API Keys", priority: "Crítica", impact: "Crítico" },
    { name: "Persistência de estado", priority: "Alta", impact: "Alto" },
    { name: "Prisma Schema + Database", priority: "Crítica", impact: "Crítico" },
    { name: "Inngest Video Pipeline", priority: "Crítica", impact: "Crítico" },
    { name: "AI Agents (Research + Script)", priority: "Alta", impact: "Alto" },
    { name: "Sistema de Aprovação Humana", priority: "Alta", impact: "Alto" },
    { name: "Notificações por Email (Resend)", priority: "Média", impact: "Alto" },
  ];

  const partialFeatures = [
    { name: "Upload YouTube", progress: 85, blocker: "OAuth final config", priority: "Alta" },
    { name: "Render de vídeo (JSON2VIDEO)", progress: 75, blocker: "Integração API", priority: "Alta" },
    { name: "TTS (ElevenLabs)", progress: 60, blocker: "API quota", priority: "Média" },
    { name: "Storyboard editor", progress: 50, blocker: "UX refinement", priority: "Média" },
    { name: "Migração localStorage → Prisma", progress: 40, blocker: "Refatoração frontend", priority: "Alta" },
  ];

  const notStartedFeatures = [
    { name: "Multi-idioma interface", complexity: "Média", priority: "Baixa", impact: "Médio" },
    { name: "Histórico de vídeos", complexity: "Baixa", priority: "Média", impact: "Alto" },
    { name: "Templates de vídeo", complexity: "Média", priority: "Média", impact: "Alto" },
    { name: "Batch processing", complexity: "Alta", priority: "Baixa", impact: "Médio" },
    { name: "Analytics dashboard", complexity: "Alta", priority: "Baixa", impact: "Médio" },
    { name: "Colaboração multi-usuário", complexity: "Alta", priority: "Baixa", impact: "Baixo" },
  ];

  const technicalDebt = {
    high: [
      { name: "Error boundaries", description: "Implementar em todas as páginas", impact: "Estabilidade", effort: "Baixo" },
      { name: "Loading states", description: "Padronizar em todas as operações", impact: "UX", effort: "Médio" },
      { name: "Testes E2E", description: "Adicionar testes com Playwright", impact: "Qualidade", effort: "Alto" },
    ],
    medium: [
      { name: "Code splitting", description: "Otimizar bundle com lazy loading", impact: "Performance", effort: "Médio" },
      { name: "API rate limiting", description: "Implementar no frontend", impact: "Custo", effort: "Médio" },
      { name: "Retry logic", description: "Melhorar para falhas de API", impact: "Resiliência", effort: "Médio" },
    ],
    low: [
      { name: "CSS cleanup", description: "Remover estilos não utilizados", impact: "Manutenção", effort: "Baixo" },
      { name: "Type coverage", description: "Aumentar coverage de tipos", impact: "DX", effort: "Médio" },
      { name: "Documentation", description: "Documentar funções complexas", impact: "Manutenção", effort: "Médio" },
    ],
  };

  const risks = {
    technical: [
      { risk: "API rate limits", probability: "Média", impact: "Alto", mitigation: "Cache, retry, fallbacks" },
      { risk: "Custo de APIs", probability: "Alta", impact: "Médio", mitigation: "Monitoramento, alertas" },
      { risk: "Mudanças em APIs externas", probability: "Média", impact: "Alto", mitigation: "Versionamento, abstrações" },
      { risk: "Performance em mobile", probability: "Baixa", impact: "Médio", mitigation: "Testing, otimização" },
    ],
    business: [
      { risk: "Políticas YouTube", probability: "Média", impact: "Crítico", mitigation: "Compliance, guidelines" },
      { risk: "Competição", probability: "Alta", impact: "Médio", mitigation: "Inovação, UX" },
      { risk: "Dependência de IAs", probability: "Média", impact: "Alto", mitigation: "Multi-provider" },
    ],
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "crítica":
        return "bg-red-500/20 text-red-400";
      case "alta":
        return "bg-orange-500/20 text-orange-400";
      case "média":
        return "bg-yellow-500/20 text-yellow-400";
      case "baixa":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-zinc-500/20 text-muted";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "crítico":
        return "bg-red-500/20 text-red-400";
      case "alto":
        return "bg-purple-500/20 text-purple-400";
      case "médio":
        return "bg-blue-500/20 text-blue-400";
      case "baixo":
        return "bg-zinc-500/20 text-muted";
      default:
        return "bg-zinc-500/20 text-muted";
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-900/50 via-pink-900/50 to-rose-900/50 border border-rose-500/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-rose-500/20 rounded-xl">
              <Compass className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Status Geral do Projeto
              </h2>
              <p className="text-rose-300">Estado atual e roadmap</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Versão", value: "2.0.0", icon: Target },
              { label: "Status", value: "Em Produção", icon: CheckCircle2 },
              { label: "Última Atualização", value: "Janeiro 2026", icon: Calendar },
              { label: "Uptime", value: "99.9%", icon: Gauge },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-layer-1/50 rounded-lg p-4 border border-subtle"
              >
                <stat.icon className="w-5 h-5 text-rose-400 mb-2" />
                <p className="text-xs text-muted">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted">
              URL de Produção:{" "}
              <a
                href="https://emergecy-youtube.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:text-rose-300 underline"
              >
                https://emergecy-youtube.vercel.app
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Completed Features */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          Funcionalidades Concluídas
        </h3>

        <div className="bg-layer-1 border border-subtle rounded-xl overflow-hidden">
          <div className="bg-green-500/10 border-b border-subtle px-4 py-3 flex items-center justify-between">
            <span className="font-medium text-green-400">Core Features</span>
            <span className="text-sm text-muted">
              {completedFeatures.length} funcionalidades
            </span>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-xs uppercase">
                  <th className="text-left pb-3">Funcionalidade</th>
                  <th className="text-left pb-3">Prioridade</th>
                  <th className="text-left pb-3">Impacto</th>
                  <th className="text-left pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {completedFeatures.map((feature, i) => (
                  <tr key={i} className="border-t border-subtle">
                    <td className="py-3 text-white">{feature.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(feature.priority)}`}>
                        {feature.priority}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${getImpactColor(feature.impact)}`}>
                        {feature.impact}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Concluído
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Partial Features */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-yellow-400" />
          Funcionalidades Parciais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partialFeatures.map((feature, i) => (
            <div
              key={i}
              className="bg-layer-1 border border-subtle rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{feature.name}</h4>
                <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(feature.priority)}`}>
                  {feature.priority}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted">Progresso</span>
                  <span className="text-white font-medium">{feature.progress}%</span>
                </div>
                <div className="w-full h-2 bg-layer-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"
                    style={{ width: `${feature.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-muted">Bloqueio:</span>
                <span className="text-yellow-400">{feature.blocker}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Not Started Features */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <XCircle className="w-6 h-6 text-muted" />
          Funcionalidades Não Iniciadas
        </h3>

        <div className="bg-layer-1 border border-subtle rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-layer-2/50">
              <tr className="text-muted text-xs uppercase">
                <th className="text-left p-4">Funcionalidade</th>
                <th className="text-left p-4">Complexidade</th>
                <th className="text-left p-4">Prioridade</th>
                <th className="text-left p-4">Impacto</th>
              </tr>
            </thead>
            <tbody>
              {notStartedFeatures.map((feature, i) => (
                <tr key={i} className="border-t border-subtle hover:bg-layer-2/30">
                  <td className="p-4 text-secondary">{feature.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      feature.complexity === "Alta" ? "bg-red-500/20 text-red-400" :
                      feature.complexity === "Média" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-green-500/20 text-green-400"
                    }`}>
                      {feature.complexity}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(feature.priority)}`}>
                      {feature.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${getImpactColor(feature.impact)}`}>
                      {feature.impact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Technical Debt */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          Dívidas Técnicas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* High Priority */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden">
            <div className="bg-red-500/10 px-4 py-3 border-b border-red-500/20">
              <h4 className="font-semibold text-red-400">Alta Prioridade</h4>
            </div>
            <div className="p-4 space-y-3">
              {technicalDebt.high.map((item, i) => (
                <div key={i} className="p-3 bg-layer-1/50 rounded-lg">
                  <p className="font-medium text-white text-sm">{item.name}</p>
                  <p className="text-xs text-muted mt-1">{item.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-layer-2 rounded text-xs text-muted">
                      {item.impact}
                    </span>
                    <span className="px-2 py-0.5 bg-layer-2 rounded text-xs text-muted">
                      Esforço: {item.effort}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medium Priority */}
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl overflow-hidden">
            <div className="bg-yellow-500/10 px-4 py-3 border-b border-yellow-500/20">
              <h4 className="font-semibold text-yellow-400">Média Prioridade</h4>
            </div>
            <div className="p-4 space-y-3">
              {technicalDebt.medium.map((item, i) => (
                <div key={i} className="p-3 bg-layer-1/50 rounded-lg">
                  <p className="font-medium text-white text-sm">{item.name}</p>
                  <p className="text-xs text-muted mt-1">{item.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-layer-2 rounded text-xs text-muted">
                      {item.impact}
                    </span>
                    <span className="px-2 py-0.5 bg-layer-2 rounded text-xs text-muted">
                      Esforço: {item.effort}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Priority */}
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl overflow-hidden">
            <div className="bg-green-500/10 px-4 py-3 border-b border-green-500/20">
              <h4 className="font-semibold text-green-400">Baixa Prioridade</h4>
            </div>
            <div className="p-4 space-y-3">
              {technicalDebt.low.map((item, i) => (
                <div key={i} className="p-3 bg-layer-1/50 rounded-lg">
                  <p className="font-medium text-white text-sm">{item.name}</p>
                  <p className="text-xs text-muted mt-1">{item.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-layer-2 rounded text-xs text-muted">
                      {item.impact}
                    </span>
                    <span className="px-2 py-0.5 bg-layer-2 rounded text-xs text-muted">
                      Esforço: {item.effort}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Risks */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-violet-400" />
          Riscos Conhecidos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Technical Risks */}
          <div className="bg-layer-1 border border-subtle rounded-xl overflow-hidden">
            <div className="bg-violet-500/10 px-4 py-3 border-b border-subtle">
              <h4 className="font-semibold text-violet-400">Riscos Técnicos</h4>
            </div>
            <div className="p-4 space-y-3">
              {risks.technical.map((item, i) => (
                <div key={i} className="p-3 bg-layer-2/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-white text-sm">{item.risk}</p>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        item.probability === "Alta" ? "bg-red-500/20 text-red-400" :
                        item.probability === "Média" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        P: {item.probability}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getImpactColor(item.impact)}`}>
                        I: {item.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted">
                    <span className="text-muted">Mitigação:</span> {item.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Risks */}
          <div className="bg-layer-1 border border-subtle rounded-xl overflow-hidden">
            <div className="bg-rose-500/10 px-4 py-3 border-b border-subtle">
              <h4 className="font-semibold text-rose-400">Riscos de Negócio</h4>
            </div>
            <div className="p-4 space-y-3">
              {risks.business.map((item, i) => (
                <div key={i} className="p-3 bg-layer-2/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-white text-sm">{item.risk}</p>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        item.probability === "Alta" ? "bg-red-500/20 text-red-400" :
                        item.probability === "Média" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-green-500/20 text-green-400"
                      }`}>
                        P: {item.probability}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getImpactColor(item.impact)}`}>
                        I: {item.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted">
                    <span className="text-muted">Mitigação:</span> {item.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Evolution */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          Sugestões de Evolução Futura
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Short Term */}
          <div className="bg-gradient-to-b from-cyan-900/30 to-zinc-900 border border-cyan-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-semibold text-cyan-400">Curto Prazo</h4>
                <p className="text-xs text-muted">1-3 meses</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                { name: "Completar Upload YouTube", priority: "Crítica" },
                { name: "Implementar Render Local", priority: "Alta" },
                { name: "Adicionar Testes", priority: "Alta" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-white">{item.name}</p>
                    <span className={`text-xs ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Medium Term */}
          <div className="bg-gradient-to-b from-purple-900/30 to-zinc-900 border border-purple-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-400">Médio Prazo</h4>
                <p className="text-xs text-muted">3-6 meses</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Templates de Vídeo",
                "Histórico e Analytics",
                "Melhorias de UX",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5" />
                  <p className="text-sm text-white">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Long Term */}
          <div className="bg-gradient-to-b from-amber-900/30 to-zinc-900 border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-400">Longo Prazo</h4>
                <p className="text-xs text-muted">6-12 meses</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "API Pública",
                "Marketplace de Assets",
                "Versão Enterprise",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-amber-400 mt-0.5" />
                  <p className="text-sm text-white">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Conclusão</h3>
        <p className="text-secondary mb-4">
          O ORION está em estágio de{" "}
          <span className="text-green-400 font-semibold">produção funcional</span> com
          as principais features de geração de conteúdo operacionais. Os próximos
          passos críticos são:
        </p>
        <ol className="space-y-2 text-secondary">
          {[
            "Completar a integração de upload YouTube",
            "Implementar render de vídeo completo",
            "Adicionar cobertura de testes",
            "Resolver dívidas técnicas de alta prioridade",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-bold">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
        <p className="text-muted mt-4 text-sm">
          O sistema está preparado para escalar e evoluir conforme as necessidades
          dos usuários.
        </p>
      </section>

      {/* Footer Note */}
      <div className="p-4 bg-rose-900/20 border border-rose-500/20 rounded-xl">
        <p className="text-sm text-rose-300 italic text-center">
          Este documento reflete o estado atual do ORION e serve como
          roadmap para decisões de desenvolvimento futuro.
        </p>
      </div>
    </div>
  );
}
