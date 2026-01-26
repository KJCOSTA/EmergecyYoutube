"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Database } from "lucide-react";

const PROVIDERS = {
  openai: {
    name: "OpenAI",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
  },
  google: {
    name: "Google Gemini",
    models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash-exp"],
  },
  anthropic: {
    name: "Anthropic Claude",
    models: ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"],
  },
};

export default function AITestPage() {
  const router = useRouter();
  const [provider, setProvider] = useState<keyof typeof PROVIDERS>("openai");
  const [model, setModel] = useState(PROVIDERS.openai.models[0]);
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("Olá! Por favor, responda em português: qual é a capital do Brasil?");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProviderChange = (newProvider: keyof typeof PROVIDERS) => {
    setProvider(newProvider);
    setModel(PROVIDERS[newProvider].models[0]);
  };

  const handleTest = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      console.log("[CLIENT] Testando API de IA:", {
        provider,
        model,
        hasApiKey: !!apiKey,
        promptLength: prompt.length,
      });

      const response = await fetch("/api/test/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          model,
          apiKey,
          prompt,
        }),
      });

      const data = await response.json();

      console.log("[CLIENT] Resposta do servidor:", data);

      if (!response.ok) {
        throw new Error(
          data.details?.message || data.error || "Erro ao chamar API"
        );
      }

      setResult(data);
    } catch (err) {
      console.error("[CLIENT] Erro ao testar API:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
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
            onClick={() => router.push("/test/db")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-colors"
          >
            <Database className="w-4 h-4" />
            Teste de DB
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Teste de APIs de IA
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Página de diagnóstico técnico - Validação de tokens, SDKs e chamadas reais às APIs
          </p>

          <div className="space-y-4">
            {/* Seleção de Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider de IA:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(PROVIDERS).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleProviderChange(key as keyof typeof PROVIDERS)}
                    className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                      provider === key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    disabled={loading}
                  >
                    {value.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Modelo */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Modelo:
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                disabled={loading}
              >
                {PROVIDERS[provider].models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* API Key */}
            <div>
              <label
                htmlFor="apiKey"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                API Key:
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Cole sua API key aqui..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Sua API key é usada apenas para esta requisição e não é armazenada
              </p>
            </div>

            {/* Prompt */}
            <div>
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Prompt:
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Digite seu prompt aqui..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                disabled={loading}
              />
            </div>

            {/* Botão de teste */}
            <button
              onClick={handleTest}
              disabled={loading || !apiKey.trim() || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Testando API..." : "Executar Teste"}
            </button>

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
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-semibold mb-2">
                    Resposta da IA:
                  </h3>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {result.text}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-800 font-semibold mb-2">
                    Metadados:
                  </h3>
                  <div className="space-y-1 text-sm text-blue-700">
                    <p>
                      <strong>Provider:</strong> {result.provider}
                    </p>
                    <p>
                      <strong>Modelo:</strong> {result.model}
                    </p>
                    <p>
                      <strong>Duração:</strong> {result.duration}
                    </p>
                    {result.usage && (
                      <div>
                        <p className="font-semibold mt-2">Uso de tokens:</p>
                        <pre className="bg-white p-2 rounded text-xs mt-1 overflow-auto">
                          {JSON.stringify(result.usage, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-gray-800 font-semibold mb-2">
                    Resposta completa (JSON):
                  </h3>
                  <pre className="bg-white p-3 rounded text-xs text-gray-800 overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Instruções */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-blue-800 font-semibold mb-2">Instruções:</h3>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Selecione o provider de IA desejado</li>
                <li>Escolha o modelo</li>
                <li>Cole sua API key (ela não será armazenada)</li>
                <li>Escreva um prompt de teste</li>
                <li>Clique em "Executar Teste" para fazer a chamada real</li>
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
                  <strong>API Route:</strong> POST /api/test/ai
                </li>
                <li>
                  <strong>SDK:</strong> Vercel AI SDK (ai@6.0.49)
                </li>
                <li>
                  <strong>Providers:</strong> @ai-sdk/openai, @ai-sdk/google,
                  @ai-sdk/anthropic
                </li>
                <li>
                  <strong>Sem abstrações:</strong> Chamadas diretas às APIs oficiais
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
