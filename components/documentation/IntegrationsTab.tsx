"use client";

import {
  Plug,
  AlertCircle,
  ArrowRight,
  Shield,
  Server,
  Database,
  Key,
  RefreshCw,
  Lock,
} from "lucide-react";
import { CopyMdButtons } from "./CopyButton";

// API/Service logos as simple text badges (would be real logos in production)
const ServiceLogo = ({ name, color }: { name: string; color: string }) => (
  <div
    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
  >
    {name.charAt(0)}
  </div>
);

export default function IntegrationsTab() {
  const integrations = [
    {
      name: "Inngest",
      logo: "I",
      gradient: "from-emerald-500 to-green-600",
      function: "Orquestração de workflows duráveis e pipelines de vídeo",
      criticality: "Crítica",
      criticalityColor: "bg-red-500/20 text-red-400 font-bold",
      model: "Event-driven Workflow",
      use: "Video pipeline, aprovação humana, retries",
      auth: "API Keys (INNGEST_EVENT_KEY, INNGEST_SIGNING_KEY)",
      endpoints: ["/api/inngest", "step.run()", "step.waitForEvent()"],
    },
    {
      name: "Resend",
      logo: "R",
      gradient: "from-violet-500 to-indigo-600",
      function: "Envio de emails transacionais e notificações",
      criticality: "Alta",
      criticalityColor: "bg-red-500/20 text-red-400",
      model: "REST API",
      use: "Aprovação de roteiros, alertas",
      auth: "API Key (RESEND_API_KEY)",
      endpoints: ["POST /emails"],
    },
    {
      name: "Anthropic Claude",
      logo: "C",
      gradient: "from-amber-500 to-orange-600",
      function: "Geração de conteúdo de alta qualidade (roteiros, descrições, pesquisa)",
      criticality: "Alta",
      criticalityColor: "bg-red-500/20 text-red-400",
      model: "Claude 3.5 Sonnet / Claude 3 Opus",
      use: "Roteiros, análise, estruturação",
      auth: "API Key (ANTHROPIC_API_KEY)",
      endpoints: ["POST /v1/messages"],
    },
    {
      name: "Google Gemini",
      logo: "G",
      gradient: "from-blue-500 to-indigo-600",
      function: "Deep Research e análise de tendências",
      criticality: "Alta",
      criticalityColor: "bg-red-500/20 text-red-400",
      model: "Gemini 2.0 Flash",
      use: "Research Agent, análise de canal",
      auth: "API Key (GOOGLE_GENERATIVE_AI_API_KEY)",
      endpoints: [],
    },
    {
      name: "OpenAI",
      logo: "O",
      gradient: "from-green-500 to-emerald-600",
      function: "Geração de imagens e modelos alternativos",
      criticality: "Moderada",
      criticalityColor: "bg-yellow-500/20 text-yellow-400",
      model: "GPT-4o, DALL-E 3",
      use: "Thumbnails, imagens complementares",
      auth: "API Key (OPENAI_API_KEY)",
      endpoints: ["POST /v1/chat/completions", "POST /v1/images/generations"],
    },
    {
      name: "YouTube Data API",
      logo: "Y",
      gradient: "from-red-500 to-red-600",
      function: "Upload de vídeos e gerenciamento de canal",
      criticality: "Crítica",
      criticalityColor: "bg-red-500/20 text-red-400 font-bold",
      model: "v3",
      use: "Upload, metadados, thumbnails",
      auth: "OAuth 2.0",
      endpoints: ["youtube.upload", "youtube.readonly"],
    },
    {
      name: "Pexels",
      logo: "P",
      gradient: "from-teal-500 to-cyan-600",
      function: "Busca de imagens e vídeos stock gratuitos",
      criticality: "Moderada",
      criticalityColor: "bg-yellow-500/20 text-yellow-400",
      model: "REST API",
      use: "B-roll, imagens de cena",
      auth: "API Key (PEXELS_API_KEY)",
      endpoints: ["GET /v1/search", "GET /videos/search"],
    },
    {
      name: "Pixabay",
      logo: "X",
      gradient: "from-lime-500 to-green-600",
      function: "Busca alternativa de mídia stock",
      criticality: "Baixa",
      criticalityColor: "bg-green-500/20 text-green-400",
      model: "REST API",
      use: "Fallback para Pexels",
      auth: "API Key (PIXABAY_API_KEY)",
      endpoints: [],
    },
    {
      name: "ElevenLabs",
      logo: "E",
      gradient: "from-violet-500 to-purple-600",
      function: "Text-to-Speech de alta qualidade",
      criticality: "Alta",
      criticalityColor: "bg-red-500/20 text-red-400",
      model: "Multilingual v2",
      use: "Narração do vídeo",
      auth: "API Key (ELEVENLABS_API_KEY)",
      endpoints: ["POST /v1/text-to-speech"],
    },
    {
      name: "Replicate",
      logo: "R",
      gradient: "from-pink-500 to-rose-600",
      function: "Geração de imagens via modelos open-source",
      criticality: "Moderada",
      criticalityColor: "bg-yellow-500/20 text-yellow-400",
      model: "Flux, SDXL",
      use: "Thumbnails, arte conceitual",
      auth: "API Token (REPLICATE_API_TOKEN)",
      endpoints: ["POST /v1/predictions"],
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/50 via-emerald-900/50 to-green-900/50 border border-green-500/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Plug className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Visão Geral das Integrações
              </h2>
              <p className="text-green-300">Arquitetura de conexões externas</p>
            </div>
          </div>
          <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl">
            O ORION integra-se com{" "}
            <span className="text-green-400 font-semibold">múltiplos serviços externos</span>{" "}
            para fornecer suas funcionalidades. Cada integração tem um propósito
            específico e nível de criticidade definido.
          </p>
        </div>
      </section>

      {/* Integration Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-emerald-400" />
            APIs e Serviços Integrados
          </h3>
          <CopyMdButtons
            content={integrations.map(api => `${api.name}: ${api.function}`).join('\n')}
            markdownContent={`## APIs e Serviços Integrados\n\n${integrations.map(api =>
              `### ${api.name}\n- **Função:** ${api.function}\n- **Criticidade:** ${api.criticality}\n- **Modelo:** ${api.model}\n- **Uso:** ${api.use}\n- **Auth:** ${api.auth}`
            ).join('\n\n')}`}
            filename="apis-integradas.md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.map((api, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <ServiceLogo name={api.name} color={api.gradient} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white">{api.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs ${api.criticalityColor}`}>
                      {api.criticality}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">{api.function}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-zinc-500 uppercase mb-1">Modelo/Versão</p>
                  <p className="text-zinc-300">{api.model}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase mb-1">Uso Principal</p>
                  <p className="text-zinc-300">{api.use}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Key className="w-3 h-3" />
                  <span>{api.auth}</span>
                </div>
                {api.endpoints.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {api.endpoints.map((endpoint, i) => (
                      <code
                        key={i}
                        className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400 font-mono"
                      >
                        {endpoint}
                      </code>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connection Diagram */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Plug className="w-6 h-6 text-cyan-400" />
            Diagrama de Conexões
          </h3>
          <CopyMdButtons
            content="Diagrama de Conexões: IA Providers (Anthropic, Google Gemini, OpenAI, Replicate), Media Services (Pexels, Pixabay, ElevenLabs, Replicate Video), Video Platform (YouTube Data API)"
            markdownContent={`## Diagrama de Conexões\n\n### IA PROVIDERS\n- Anthropic Claude\n- Google Gemini\n- OpenAI GPT-4\n- Replicate\n\n### MEDIA SERVICES\n- Pexels Images\n- Pixabay Videos\n- ElevenLabs TTS\n- Replicate Video\n\n### VIDEO PLATFORM\n- YouTube Data API v3`}
            filename="diagrama-conexoes.md"
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl px-8 py-4">
              <p className="text-white font-bold text-lg">EMERGENCY YOUTUBE</p>
              <p className="text-white/70 text-sm">Next.js App</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Orchestration */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
              <h4 className="font-bold text-emerald-400 mb-4 text-center">ORCHESTRATION</h4>
              <div className="space-y-3">
                {[
                  { name: "Inngest", color: "from-emerald-500 to-green-600" },
                  { name: "Resend Email", color: "from-violet-500 to-indigo-600" },
                  { name: "Prisma ORM", color: "from-cyan-500 to-blue-600" },
                ].map((service, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {service.name.charAt(0)}
                    </div>
                    <span className="text-sm text-zinc-300">{service.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* IA Providers */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
              <h4 className="font-bold text-amber-400 mb-4 text-center">IA PROVIDERS</h4>
              <div className="space-y-3">
                {[
                  { name: "Anthropic Claude", color: "from-amber-500 to-orange-600" },
                  { name: "Google Gemini", color: "from-blue-500 to-indigo-600" },
                  { name: "OpenAI GPT-4", color: "from-green-500 to-emerald-600" },
                  { name: "Replicate", color: "from-pink-500 to-rose-600" },
                ].map((provider, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {provider.name.charAt(0)}
                    </div>
                    <span className="text-sm text-zinc-300">{provider.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Services */}
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5">
              <h4 className="font-bold text-cyan-400 mb-4 text-center">MEDIA SERVICES</h4>
              <div className="space-y-3">
                {[
                  { name: "Pexels Images", color: "from-teal-500 to-cyan-600" },
                  { name: "Pixabay Videos", color: "from-lime-500 to-green-600" },
                  { name: "ElevenLabs TTS", color: "from-violet-500 to-purple-600" },
                  { name: "JSON2VIDEO", color: "from-pink-500 to-rose-600" },
                ].map((service, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-xs font-bold`}>
                      {service.name.charAt(0)}
                    </div>
                    <span className="text-sm text-zinc-300">{service.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Platform */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
              <h4 className="font-bold text-red-400 mb-4 text-center">VIDEO PLATFORM</h4>
              <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
                  Y
                </div>
                <span className="text-zinc-300 font-medium">YouTube Data API</span>
                <span className="text-xs text-zinc-500 mt-1">v3</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Flow */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowRight className="w-6 h-6 text-blue-400" />
            Fluxo Real de Dados
          </h3>
          <CopyMdButtons
            content="Fluxos: 1) Geração de Roteiro (Usuário → API → Anthropic → Roteiro → UI), 2) Geração de Thumbnail (Roteiro → API → Replicate/DALL-E → Imagem → Preview), 3) Upload YouTube (Vídeo → API → OAuth → YouTube → URL)"
            markdownContent={`## Fluxo Real de Dados\n\n### 1. Geração de Roteiro\nUsuário (Input tema) → API (/proposal/script) → Anthropic (Claude API) → Roteiro (Estruturado) → Frontend (UI)\n\n### 2. Geração de Thumbnail\nRoteiro (Contexto) → API (/images/generate) → Replicate/DALL-E → Imagem (Base64) → Frontend (Preview)\n\n### 3. Upload para YouTube\nVídeo (Renderizado) → API (/youtube/upload) → OAuth 2.0 (Auth) → YouTube (Data API) → Publicado (URL)`}
            filename="fluxo-dados.md"
          />
        </div>

        <div className="space-y-6">
          {/* Script Generation Flow */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h4 className="font-semibold text-white mb-4">1. Geração de Roteiro</h4>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {[
                { label: "Usuário", sub: "Input (tema)" },
                { label: "API", sub: "/proposal/script" },
                { label: "Anthropic", sub: "Claude API" },
                { label: "Roteiro", sub: "Estruturado" },
                { label: "Frontend", sub: "UI" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 min-w-[100px] text-center">
                    <p className="text-white font-medium text-sm">{step.label}</p>
                    <p className="text-zinc-500 text-xs">{step.sub}</p>
                  </div>
                  {i < 4 && <ArrowRight className="w-5 h-5 text-zinc-600 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail Generation Flow */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h4 className="font-semibold text-white mb-4">2. Geração de Thumbnail</h4>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {[
                { label: "Roteiro", sub: "Contexto" },
                { label: "API", sub: "/images/generate" },
                { label: "Replicate", sub: "ou DALL-E" },
                { label: "Imagem", sub: "Base64" },
                { label: "Frontend", sub: "Preview" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 min-w-[100px] text-center">
                    <p className="text-white font-medium text-sm">{step.label}</p>
                    <p className="text-zinc-500 text-xs">{step.sub}</p>
                  </div>
                  {i < 4 && <ArrowRight className="w-5 h-5 text-zinc-600 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Upload Flow */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h4 className="font-semibold text-white mb-4">3. Upload para YouTube</h4>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {[
                { label: "Vídeo", sub: "Renderizado" },
                { label: "API", sub: "/youtube/upload" },
                { label: "OAuth 2.0", sub: "Auth" },
                { label: "YouTube", sub: "Data API" },
                { label: "Publicado", sub: "URL" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 min-w-[100px] text-center">
                    <p className="text-white font-medium text-sm">{step.label}</p>
                    <p className="text-zinc-500 text-xs">{step.sub}</p>
                  </div>
                  {i < 4 && <ArrowRight className="w-5 h-5 text-zinc-600 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-violet-400" />
            Observações de Autenticação e Segurança
          </h3>
          <CopyMdButtons
            content="Segurança: API Keys Sistema (Variáveis ambiente Vercel), API Keys Usuário (localStorage criptografado), OAuth Tokens (Cookie httpOnly). Fallbacks: Anthropic→Gemini, Pexels→Pixabay, ElevenLabs→TTS alternativo"
            markdownContent={`## Autenticação e Segurança\n\n### Armazenamento de Credenciais\n- **API Keys (Sistema):** Variáveis de ambiente (Vercel) - Não expostas ao cliente\n- **API Keys (Usuário):** localStorage (browser) - Criptografadas localmente\n- **OAuth Tokens:** Cookie httpOnly - Sessão segura\n\n### Fallback e Redundância\n- Anthropic → Google Gemini\n- Pexels → Pixabay\n- ElevenLabs → TTS alternativo`}
            filename="seguranca.md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Credential Storage */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              Armazenamento de Credenciais
            </h4>
            <div className="space-y-3">
              {[
                { type: "API Keys (Sistema)", local: "Variáveis de ambiente (Vercel)", security: "Não expostas ao cliente" },
                { type: "API Keys (Usuário)", local: "localStorage (browser)", security: "Criptografadas localmente" },
                { type: "OAuth Tokens", local: "Cookie httpOnly", security: "Sessão segura" },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-zinc-800/50 rounded-lg">
                  <p className="font-medium text-white text-sm">{item.type}</p>
                  <p className="text-xs text-zinc-400">{item.local}</p>
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {item.security}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fallback & Redundancy */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              Fallback e Redundância
            </h4>
            <div className="space-y-4">
              {[
                {
                  primary: "Anthropic",
                  fallback: "Google Gemini",
                  icon: AlertCircle,
                },
                {
                  primary: "Pexels",
                  fallback: "Pixabay",
                  icon: AlertCircle,
                },
                {
                  primary: "ElevenLabs",
                  fallback: "TTS alternativo",
                  icon: AlertCircle,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 p-2 bg-zinc-800 rounded text-center">
                    <p className="text-sm text-white">{item.primary}</p>
                  </div>
                  <item.icon className="w-4 h-4 text-yellow-400" />
                  <div className="flex-1 p-2 bg-zinc-800/50 rounded text-center border border-dashed border-zinc-700">
                    <p className="text-sm text-zinc-400">{item.fallback}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-4">
              Se o serviço primário falhar, o sistema tenta automaticamente o fallback.
            </p>
          </div>
        </div>
      </section>

      {/* OAuth Flow */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-6 h-6 text-red-400" />
            Fluxo OAuth (YouTube)
          </h3>
          <CopyMdButtons
            content="Fluxo OAuth: 1) Usuário clica Conectar → 2) Redirect Google OAuth → 3) Autoriza escopos → 4) Callback com código → 5) Tokens armazenados"
            markdownContent={`## Fluxo OAuth (YouTube)\n\n1. Usuário clica em Conectar YouTube\n2. Redirect para Google OAuth\n3. Usuário autoriza escopos\n4. Callback com código\n5. Tokens armazenados`}
            filename="oauth-flow.md"
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { num: "1", text: "Usuário clica em Conectar YouTube" },
              { num: "2", text: "Redirect para Google OAuth" },
              { num: "3", text: "Usuário autoriza escopos" },
              { num: "4", text: "Callback com código" },
              { num: "5", text: "Tokens armazenados" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-red-400 font-bold">{step.num}</span>
                </div>
                <p className="text-xs text-zinc-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-xl">
        <p className="text-sm text-green-300 italic text-center">
          Este documento detalha todas as integrações do ORION, seus fluxos de dados
          e considerações de segurança.
        </p>
      </div>
    </div>
  );
}
