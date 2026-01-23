"use client";

import {
  Layers,
  Code,
  Cpu,
  Cloud,
  Package,
  CheckCircle2,
} from "lucide-react";
import { CopyMdButtons } from "./CopyButton";

// Tech logo component
const TechLogo = ({
  name,
  letter,
  gradient,
}: {
  name: string;
  letter: string;
  gradient: string;
}) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
    >
      {letter}
    </div>
    <span className="text-xs text-zinc-400">{name}</span>
  </div>
);

export default function TechStackTab() {
  const dependencies = {
    production: [
      { name: "next", version: "15.1.11", function: "Framework" },
      { name: "react", version: "19.0.0", function: "UI Library" },
      { name: "ai", version: "latest", function: "AI SDK 6" },
      { name: "@ai-sdk/anthropic", version: "latest", function: "Claude AI" },
      { name: "@ai-sdk/google", version: "latest", function: "Gemini AI" },
      { name: "@ai-sdk/openai", version: "latest", function: "GPT AI" },
      { name: "inngest", version: "3.49.3", function: "Workflow Orchestration" },
      { name: "prisma", version: "6.x", function: "Database ORM" },
      { name: "@prisma/client", version: "6.x", function: "Prisma Client" },
      { name: "resend", version: "6.8.0", function: "Email Service" },
      { name: "zustand", version: "5.0.3", function: "State Management" },
      { name: "tailwindcss", version: "3.4.17", function: "Styling" },
      { name: "framer-motion", version: "11.15.0", function: "Animations" },
      { name: "lucide-react", version: "0.469.0", function: "Icons" },
      { name: "zod", version: "3.24.1", function: "Validation" },
    ],
    dev: [
      { name: "typescript", version: "5.7.3", function: "Type checking" },
      { name: "eslint", version: "9.x", function: "Linting" },
      { name: "@types/react", version: "19.x", function: "React types" },
      { name: "@types/node", version: "22.x", function: "Node types" },
    ],
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900/50 via-amber-900/50 to-orange-900/50 border border-orange-500/20 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Layers className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Visão Geral da Stack
              </h2>
              <p className="text-orange-300">Tecnologias e arquitetura</p>
            </div>
          </div>
          <p className="text-lg text-zinc-300 leading-relaxed max-w-3xl">
            O ORION utiliza uma{" "}
            <span className="text-orange-400 font-semibold">
              stack moderna e otimizada
            </span>{" "}
            para aplicações web de alta performance, com foco em Developer
            Experience (DX) e User Experience (UX).
          </p>
        </div>
      </section>

      {/* Languages */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-400" />
            Linguagens de Programação
          </h3>
          <CopyMdButtons
            content="TypeScript 5.7: 100% do código frontend e backend. Strict mode, Path aliases, Type inference, Utility types."
            markdownContent={`## Linguagens de Programação\n\n### TypeScript 5.7\n- 100% do código frontend e backend\n- Strict mode habilitado\n- Path aliases (@/components, @/lib)\n- Type inference avançado\n- Utility types (Partial, Pick, Omit)\n\n**Benefícios:**\n- Detecção de erros em desenvolvimento\n- Autocomplete inteligente\n- Refatoração segura\n- Documentação inline via tipos`}
            filename="linguagens.md"
          />
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              TS
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white mb-2">TypeScript 5.7</h4>
              <p className="text-zinc-400 mb-4">
                100% do código frontend e backend
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase mb-2">
                    Características Utilizadas
                  </p>
                  <ul className="space-y-1 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Strict mode habilitado
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Path aliases (@/components, @/lib)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Type inference avançado
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Utility types (Partial, Pick, Omit)
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase mb-2">
                    Benefícios
                  </p>
                  <ul className="space-y-1 text-sm text-zinc-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      Detecção de erros em desenvolvimento
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      Autocomplete inteligente
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      Refatoração segura
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      Documentação inline via tipos
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-400" />
            Frameworks e Bibliotecas
          </h3>
          <CopyMdButtons
            content="Next.js 15.1.11, React 19, Tailwind CSS 3.4.17, Zustand 5.0, Framer Motion 11.15, Lucide React 0.469"
            markdownContent={`## Frameworks e Bibliotecas\n\n### Next.js 15.1.11\n- App Router para roteamento\n- Server Components para performance\n- API Routes para backend\n- Image Optimization\n\n### React 19\n- Hooks: useState, useEffect, useCallback, useMemo, useRef\n- Functional Components, Custom Hooks\n\n### Tailwind CSS 3.4.17\n- Framework CSS utility-first\n\n### Zustand 5.0\n- State Management\n- Stores: WorkflowStore, GuidelinesStore, UIStore\n\n### Framer Motion 11.15\n- Animações e transições\n\n### Lucide React 0.469\n- Biblioteca de ícones`}
            filename="frameworks.md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Next.js */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white font-bold text-lg border border-zinc-600">
                N
              </div>
              <div>
                <h4 className="font-bold text-white">Next.js 15.1.11</h4>
                <p className="text-xs text-zinc-500">Framework Full-Stack</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { feature: "App Router", use: "Roteamento e layouts" },
                { feature: "Server Components", use: "Performance e SEO" },
                { feature: "API Routes", use: "Backend integrado" },
                { feature: "Image Optimization", use: "Otimização de mídia" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-zinc-400">
                  <span className="text-white">{item.feature}</span>
                  <span>{item.use}</span>
                </div>
              ))}
            </div>
          </div>

          {/* React */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                R
              </div>
              <div>
                <h4 className="font-bold text-white">React 19</h4>
                <p className="text-xs text-zinc-500">UI Library</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase">Hooks</p>
              <div className="flex flex-wrap gap-1">
                {["useState", "useEffect", "useCallback", "useMemo", "useRef"].map(
                  (hook, i) => (
                    <code
                      key={i}
                      className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs"
                    >
                      {hook}
                    </code>
                  )
                )}
              </div>
              <p className="text-xs font-medium text-zinc-500 uppercase mt-3">
                Patterns
              </p>
              <p className="text-sm text-zinc-400">
                Functional Components, Custom Hooks, Composição
              </p>
            </div>
          </div>

          {/* Tailwind */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                T
              </div>
              <div>
                <h4 className="font-bold text-white">Tailwind CSS 3.4.17</h4>
                <p className="text-xs text-zinc-500">Framework CSS</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase">
                Classes Mais Usadas
              </p>
              <div className="font-mono text-xs space-y-1">
                <div className="text-zinc-400">
                  <span className="text-teal-400">bg-zinc-900</span> → Background
                </div>
                <div className="text-zinc-400">
                  <span className="text-teal-400">text-white</span> → Texto
                </div>
                <div className="text-zinc-400">
                  <span className="text-teal-400">border-zinc-800</span> → Bordas
                </div>
                <div className="text-zinc-400">
                  <span className="text-teal-400">rounded-xl</span> → Cantos
                </div>
              </div>
            </div>
          </div>

          {/* Zustand */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                Z
              </div>
              <div>
                <h4 className="font-bold text-white">Zustand 5.0</h4>
                <p className="text-xs text-zinc-500">State Management</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase">Stores</p>
              <ul className="text-sm space-y-1">
                <li className="text-amber-400">WorkflowStore</li>
                <li className="text-amber-400">GuidelinesStore</li>
                <li className="text-amber-400">UIStore</li>
              </ul>
              <p className="text-xs text-zinc-500 mt-2">
                Middleware: persist, devtools
              </p>
            </div>
          </div>

          {/* Framer Motion */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                F
              </div>
              <div>
                <h4 className="font-bold text-white">Framer Motion 11.15</h4>
                <p className="text-xs text-zinc-500">Animations</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase">Uso</p>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>Transições de página</li>
                <li>Animações de entrada</li>
                <li>Hover effects</li>
                <li>Loading states</li>
              </ul>
            </div>
          </div>

          {/* Lucide */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                L
              </div>
              <div>
                <h4 className="font-bold text-white">Lucide React 0.469</h4>
                <p className="text-xs text-zinc-500">Iconography</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-zinc-500 uppercase">
                Padrão de Uso
              </p>
              <code className="block p-2 bg-zinc-800 rounded text-xs text-zinc-300">
                {`<IconName className="w-5 h-5" />`}
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Cloud className="w-6 h-6 text-green-400" />
            Tecnologias de Infraestrutura
          </h3>
          <CopyMdButtons
            content="Vercel: Deploy automático, Edge Functions, CDN Global. GitHub: Versionamento, CI/CD automático."
            markdownContent={`## Infraestrutura\n\n### Vercel\n- Hospedagem e Deploy\n- Automatic deployments\n- Edge Functions\n- Environment Variables\n- Analytics\n- Preview deployments\n- CDN Global\n\n### GitHub\n- Versionamento\n- CI/CD automático\n- push main → Deploy production\n- push feature/* → Preview deploy\n- pull request → Checks automáticos`}
            filename="infraestrutura.md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vercel */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-600 to-zinc-900 flex items-center justify-center text-white font-bold text-xl border border-zinc-500">
                V
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Vercel</h4>
                <p className="text-sm text-zinc-500">Hospedagem e Deploy</p>
              </div>
            </div>
            <p className="text-xs font-medium text-zinc-500 uppercase mb-2">
              Features Utilizadas
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Automatic deployments",
                "Edge Functions",
                "Environment Variables",
                "Analytics",
                "Preview deployments",
                "CDN Global",
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-zinc-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* GitHub */}
          <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white font-bold text-xl">
                G
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">GitHub</h4>
                <p className="text-sm text-zinc-500">Versionamento e CI</p>
              </div>
            </div>
            <p className="text-xs font-medium text-zinc-500 uppercase mb-2">
              Workflows
            </p>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <code className="px-2 py-0.5 bg-zinc-800 rounded text-xs">
                  push main
                </code>
                <span className="text-zinc-500">→</span>
                Deploy production
              </li>
              <li className="flex items-center gap-2">
                <code className="px-2 py-0.5 bg-zinc-800 rounded text-xs">
                  push feature/*
                </code>
                <span className="text-zinc-500">→</span>
                Preview deploy
              </li>
              <li className="flex items-center gap-2">
                <code className="px-2 py-0.5 bg-zinc-800 rounded text-xs">
                  pull request
                </code>
                <span className="text-zinc-500">→</span>
                Checks automáticos
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-violet-400" />
            Diagrama por Camadas
          </h3>
          <CopyMdButtons
            content="Camadas: Frontend (React, Tailwind, Framer, Zustand, Lucide) → Framework (Next.js 15) → Backend (Vercel AI, Zod) → IA (Anthropic, Google, OpenAI) → Infraestrutura (Vercel)"
            markdownContent={`## Arquitetura por Camadas\n\n### FRONTEND\nReact 19, Tailwind, Framer Motion, Zustand, Lucide\n\n### FRAMEWORK\nNext.js 15 (App Router, Server Components, API Routes)\n\n### BACKEND\nVercel AI SDK, Zod, node-fetch\n\n### IA LAYER\nAnthropic Claude, Google AI, OpenAI\n\n### INFRAESTRUTURA\nVercel (Edge Functions, CDN Global, Env Vars)`}
            filename="arquitetura-camadas.md"
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-x-auto">
          <div className="min-w-[600px] space-y-4">
            {/* Frontend Layer */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <h4 className="font-bold text-blue-400 mb-3 text-center">FRONTEND</h4>
              <div className="flex justify-center gap-6">
                <TechLogo name="React 19" letter="R" gradient="from-cyan-500 to-blue-600" />
                <TechLogo name="Tailwind" letter="T" gradient="from-teal-500 to-cyan-600" />
                <TechLogo name="Framer" letter="F" gradient="from-pink-500 to-purple-600" />
                <TechLogo name="Zustand" letter="Z" gradient="from-amber-500 to-yellow-600" />
                <TechLogo name="Lucide" letter="L" gradient="from-red-500 to-orange-600" />
              </div>
            </div>

            {/* Framework Layer */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
              <h4 className="font-bold text-zinc-400 mb-3 text-center">FRAMEWORK</h4>
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl px-8 py-4 text-center border border-zinc-600">
                  <p className="font-bold text-white text-lg">Next.js 15</p>
                  <div className="flex gap-4 mt-2 text-xs text-zinc-400">
                    <span>App Router</span>
                    <span>Server Components</span>
                    <span>API Routes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Backend Layer */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <h4 className="font-bold text-green-400 mb-3 text-center">BACKEND</h4>
              <div className="flex justify-center gap-6">
                <TechLogo name="Vercel AI" letter="V" gradient="from-green-500 to-emerald-600" />
                <TechLogo name="Zod" letter="Z" gradient="from-blue-500 to-indigo-600" />
                <TechLogo name="node-fetch" letter="N" gradient="from-lime-500 to-green-600" />
              </div>
            </div>

            {/* IA Layer */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <h4 className="font-bold text-purple-400 mb-3 text-center">IA LAYER</h4>
              <div className="flex justify-center gap-6">
                <TechLogo name="Anthropic" letter="A" gradient="from-amber-500 to-orange-600" />
                <TechLogo name="Google AI" letter="G" gradient="from-blue-500 to-indigo-600" />
                <TechLogo name="OpenAI" letter="O" gradient="from-green-500 to-emerald-600" />
              </div>
            </div>

            {/* Infrastructure Layer */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <h4 className="font-bold text-amber-400 mb-3 text-center">INFRAESTRUTURA</h4>
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl px-8 py-4 text-center border border-zinc-600">
                  <p className="font-bold text-white text-lg">Vercel</p>
                  <div className="flex gap-4 mt-2 text-xs text-zinc-400">
                    <span>Edge Functions</span>
                    <span>CDN Global</span>
                    <span>Env Vars</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dependencies Table */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-cyan-400" />
          Dependências
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Production */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-green-500/10 border-b border-zinc-800 px-4 py-3">
              <h4 className="font-bold text-green-400">Production Dependencies</h4>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase">
                    <th className="text-left pb-2">Pacote</th>
                    <th className="text-left pb-2">Versão</th>
                    <th className="text-left pb-2">Função</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {dependencies.production.map((dep, i) => (
                    <tr key={i} className="border-t border-zinc-800">
                      <td className="py-2 font-mono text-cyan-400">{dep.name}</td>
                      <td className="py-2 text-zinc-500">{dep.version}</td>
                      <td className="py-2">{dep.function}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dev */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-amber-500/10 border-b border-zinc-800 px-4 py-3">
              <h4 className="font-bold text-amber-400">Dev Dependencies</h4>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase">
                    <th className="text-left pb-2">Pacote</th>
                    <th className="text-left pb-2">Versão</th>
                    <th className="text-left pb-2">Função</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {dependencies.dev.map((dep, i) => (
                    <tr key={i} className="border-t border-zinc-800">
                      <td className="py-2 font-mono text-amber-400">{dep.name}</td>
                      <td className="py-2 text-zinc-500">{dep.version}</td>
                      <td className="py-2">{dep.function}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="p-4 bg-orange-900/20 border border-orange-500/20 rounded-xl">
        <p className="text-sm text-orange-300 italic text-center">
          Este documento cataloga todas as tecnologias utilizadas no ORION,
          sua função e posição na arquitetura.
        </p>
      </div>
    </div>
  );
}
