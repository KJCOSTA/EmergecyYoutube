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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/test")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Testes
          </button>
          <button
            onClick={() => router.push("/test/ai")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium transition-colors"
          >
            <Brain className="w-4 h-4" />
            Teste de IA
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Teste de Banco de Dados
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Página de diagnóstico técnico - Teste de conexão e persistência no PostgreSQL
          </p>

          <div className="space-y-4">
            {/* Input de texto */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mensagem de teste:
              </label>
              <input
                id="content"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Digite algo para salvar no banco..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                disabled={loading}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading || !content.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Aguarde..." : "Salvar no banco"}
              </button>

              <button
                onClick={handleFetch}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Aguarde..." : "Buscar do banco"}
              </button>
            </div>

            {/* Exibição de erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-semibold mb-2">Erro:</h3>
                <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
                  {error}
                </pre>
              </div>
            )}

            {/* Exibição do resultado */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-semibold mb-2">
                  Resultado:
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-green-700">
                    <strong>Mensagem:</strong> {result.message}
                  </p>
                  {result.data && (
                    <div>
                      <p className="text-sm text-green-700 font-semibold mb-1">
                        Dados retornados:
                      </p>
                      <pre className="bg-white p-3 rounded text-xs text-gray-800 overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instruções */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h3 className="text-blue-800 font-semibold mb-2">Instruções:</h3>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Digite algo no campo de texto</li>
                <li>Clique em "Salvar no banco" para persistir no PostgreSQL</li>
                <li>Clique em "Buscar do banco" para recuperar a última mensagem salva</li>
                <li>Abra o console do navegador (F12) para ver logs detalhados</li>
                <li>Verifique o terminal do servidor para logs do backend</li>
              </ul>
            </div>

            {/* Informações técnicas */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-gray-800 font-semibold mb-2">
                Informações técnicas:
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  <strong>Tabela:</strong> TestMessage
                </li>
                <li>
                  <strong>API Save:</strong> POST /api/test/db/save
                </li>
                <li>
                  <strong>API Fetch:</strong> GET /api/test/db/fetch
                </li>
                <li>
                  <strong>ORM:</strong> Prisma
                </li>
                <li>
                  <strong>Banco:</strong> PostgreSQL
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
