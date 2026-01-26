"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Brain } from "lucide-react";

export default function DatabaseTestPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      console.log("[CLIENT] Salvando no banco:", content);

      const response = await fetch("/api/test/db/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      console.log("[CLIENT] Resposta do servidor:", data);

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar");
      }

      setResult(data);
      setContent(""); // Limpa o campo após salvar
    } catch (err) {
      console.error("[CLIENT] Erro ao salvar:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      console.log("[CLIENT] Buscando do banco...");

      const response = await fetch("/api/test/db/fetch");
      const data = await response.json();

      console.log("[CLIENT] Resposta do servidor:", data);

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar");
      }

      setResult(data);
    } catch (err) {
      console.error("[CLIENT] Erro ao buscar:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/test")}
            className="flex items-center gap-2 text-foreground-muted hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Testes
          </button>
          <button
            onClick={() => router.push("/test/ai")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 font-medium transition-colors"
          >
            <Brain className="w-4 h-4" />
            Teste de IA
          </button>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950/40 via-cyan-950/30 to-layer-2/50 backdrop-blur-xl border-2 border-blue-500/20 p-6">
          {/* Animated gradient mesh */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/></svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Teste de Banco de Dados
                </h1>
                <p className="text-sm text-foreground-muted">
                  Diagnóstico de conexão PostgreSQL + Prisma
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Input de texto */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Mensagem de teste:
                </label>
                <input
                  id="content"
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite algo para salvar no banco..."
                  className="w-full px-4 py-3 bg-layer-2 border border-border-subtle rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder:text-foreground-muted transition-all"
                  disabled={loading}
                />
              </div>

              {/* Botões */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading || !content.trim()}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar no banco"
                  )}
                </button>

                <button
                  onClick={handleFetch}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-green-500/50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    "Buscar do banco"
                  )}
                </button>
              </div>

              {/* Exibição de erro */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    Erro:
                  </h3>
                  <pre className="text-sm text-red-300 whitespace-pre-wrap break-words">
                    {error}
                  </pre>
                </div>
              )}

              {/* Exibição do resultado */}
              {result && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                    Sucesso!
                  </h3>
                  <p className="text-sm text-green-300 mb-3">
                    {result.message}
                  </p>
                  {result.data && (
                    <div>
                      <p className="text-sm text-green-400 font-semibold mb-2">
                        Dados retornados:
                      </p>
                      <pre className="bg-layer-2 border border-border-subtle p-3 rounded text-xs text-foreground overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Instruções */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
                <h3 className="text-blue-400 font-semibold mb-2">Como testar:</h3>
                <ul className="text-sm text-blue-300 space-y-1 list-disc list-inside">
                  <li>Digite algo no campo de texto acima</li>
                  <li>Clique em "Salvar no banco" para persistir no PostgreSQL</li>
                  <li>Clique em "Buscar do banco" para recuperar a última mensagem</li>
                  <li>Abra o console (F12) para ver logs detalhados</li>
                </ul>
              </div>

              {/* Informações técnicas */}
              <div className="bg-layer-2/50 border border-border-subtle rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">
                  Stack técnico:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-foreground-muted">
                  <div>
                    <span className="text-cyan-400">Tabela:</span> TestMessage
                  </div>
                  <div>
                    <span className="text-cyan-400">ORM:</span> Prisma
                  </div>
                  <div>
                    <span className="text-cyan-400">Banco:</span> PostgreSQL (Neon)
                  </div>
                  <div>
                    <span className="text-cyan-400">API:</span> /api/test/db/*
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
