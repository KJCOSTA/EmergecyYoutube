"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Database, Brain, ArrowRight, FlaskConical } from "lucide-react";

export default function TestIndexPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Testes de Diagnóstico
              </h1>
              <p className="text-gray-600">
                Laboratório técnico para validar infraestrutura
              </p>
            </div>
          </div>
        </motion.div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Database Test Card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/test/db")}
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left border-2 border-transparent hover:border-blue-500"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300">
                <Database className="w-7 h-7 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                Teste de Banco de Dados
              </h2>

              <p className="text-gray-600 mb-4">
                Valida conexão e persistência no PostgreSQL
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Salvar e buscar dados</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Logs completos de erros</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Teste isolado via Prisma</span>
                </li>
              </ul>

              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                <span>Iniciar teste</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.button>

          {/* AI APIs Test Card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/test/ai")}
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left border-2 border-transparent hover:border-purple-500"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300">
                <Brain className="w-7 h-7 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                Teste de APIs de IA
              </h2>

              <p className="text-gray-600 mb-4">
                Valida tokens e chamadas reais às APIs
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span>OpenAI, Gemini, Claude</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span>Testar tokens manualmente</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span>Ver resposta bruta e metadados</span>
                </li>
              </ul>

              <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                <span>Iniciar teste</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.button>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Ambiente de Diagnóstico
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Páginas isoladas sem autenticação ou middleware</li>
                <li>• Código explícito focado em clareza e logs</li>
                <li>• Apenas para validação técnica da infraestrutura</li>
                <li>
                  • Consulte o{" "}
                  <a
                    href="/test/README.md"
                    className="text-amber-600 hover:underline font-semibold"
                  >
                    README
                  </a>{" "}
                  para instruções completas
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Voltar para o Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
}
