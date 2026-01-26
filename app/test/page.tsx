"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Database, Brain, ArrowRight, FlaskConical, Home } from "lucide-react";

export default function TestIndexPage() {
  const router = useRouter();

  return (
    <div className="min-h-full pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
            >
              <FlaskConical className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                Testes de Diagnóstico
              </h1>
              <p className="text-foreground-muted flex items-center gap-2">
                <span>Laboratório técnico</span>
                <span className="text-foreground-muted/50">•</span>
                <span className="text-amber-400 font-medium">Validação de Infraestrutura</span>
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Voltar ao Dashboard
          </motion.button>
        </div>
      </motion.div>

      {/* Test Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
      >
        {/* Database Test Card */}
        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/test/db")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950/40 via-cyan-950/30 to-layer-2/50 backdrop-blur-xl border-2 border-blue-500/20 p-8 text-left hover:border-blue-400/60 hover:shadow-glow-lg hover:shadow-blue-500/50 transition-all duration-300"
        >
          {/* Animated gradient mesh background */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

          {/* Glow overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300">
              <Database className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Teste de Banco de Dados
            </h2>

            <p className="text-foreground-muted mb-4">
              Valida conexão e persistência no PostgreSQL
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm text-foreground-muted">
                <span className="text-blue-400 mt-0.5">✓</span>
                <span>Salvar e buscar dados</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground-muted">
                <span className="text-blue-400 mt-0.5">✓</span>
                <span>Logs completos de erros</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground-muted">
                <span className="text-blue-400 mt-0.5">✓</span>
                <span>Teste isolado via Prisma</span>
              </li>
            </ul>

            <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
              <span>Iniciar teste</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </motion.button>

        {/* AI APIs Test Card */}
        <motion.button
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/test/ai")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950/40 via-violet-950/30 to-layer-2/50 backdrop-blur-xl border-2 border-purple-500/20 p-8 text-left hover:border-purple-400/60 hover:shadow-glow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          {/* Animated gradient mesh background */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

          {/* Glow overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300">
              <Brain className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Teste de APIs de IA
            </h2>

            <p className="text-foreground-muted mb-4">
              Valida tokens e chamadas reais às APIs
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-sm text-foreground-muted">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>OpenAI, Gemini, Claude</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground-muted">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Testar tokens manualmente</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-foreground-muted">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Ver resposta bruta e metadados</span>
              </li>
            </ul>

            <div className="flex items-center gap-2 text-purple-400 font-semibold group-hover:gap-3 transition-all">
              <span>Iniciar teste</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/40 via-orange-950/30 to-layer-2/50 backdrop-blur-xl border-2 border-amber-500/20 p-6"
      >
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              Ambiente de Diagnóstico
            </h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Páginas isoladas sem autenticação ou middleware</li>
              <li>• Código explícito focado em clareza e logs</li>
              <li>• Apenas para validação técnica da infraestrutura</li>
              <li>
                • Consulte o{" "}
                <span className="text-amber-400 font-semibold">
                  README
                </span>{" "}
                para instruções completas
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
