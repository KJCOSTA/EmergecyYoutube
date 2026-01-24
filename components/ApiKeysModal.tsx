"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useUIStore } from "@/lib/store";
import { useAPIKeysStore, StoredAPIKeys } from "@/lib/api-keys-store";
import { APIKeyStatus } from "@/types";
import { checkAPIKeys } from "@/lib/api-keys";
import ModelsExplorer from "@/components/ModelsExplorer";
import {
  Check,
  X,
  Loader2,
  ExternalLink,
  Eye,
  EyeOff,
  Save,
  TestTube,
  Trash2,
  Key,
  Cpu,
  ChevronRight,
} from "lucide-react";

interface KeyConfig {
  key: keyof StoredAPIKeys;
  name: string;
  envVar: string;
  docsUrl: string;
  placeholder: string;
  required: boolean;
  dependsOn?: keyof StoredAPIKeys;
}

const API_KEYS_CONFIG: KeyConfig[] = [
  {
    key: "youtube_api_key",
    name: "YouTube Data API Key",
    envVar: "YOUTUBE_API_KEY",
    docsUrl: "https://console.cloud.google.com/apis/credentials",
    placeholder: "AIza...",
    required: true,
  },
  {
    key: "youtube_channel_id",
    name: "YouTube Channel ID",
    envVar: "YOUTUBE_CHANNEL_ID",
    docsUrl: "https://www.youtube.com/account_advanced",
    placeholder: "UC...",
    required: true,
    dependsOn: "youtube_api_key",
  },
  {
    key: "openai_api_key",
    name: "OpenAI",
    envVar: "OPENAI_API_KEY",
    docsUrl: "https://platform.openai.com/api-keys",
    placeholder: "sk-...",
    required: false,
  },
  {
    key: "google_api_key",
    name: "Google Gemini",
    envVar: "GOOGLE_GENERATIVE_AI_API_KEY",
    docsUrl: "https://aistudio.google.com/apikey",
    placeholder: "AIza...",
    required: false,
  },
  {
    key: "anthropic_api_key",
    name: "Anthropic Claude",
    envVar: "ANTHROPIC_API_KEY",
    docsUrl: "https://console.anthropic.com/settings/keys",
    placeholder: "sk-ant-...",
    required: false,
  },
  {
    key: "pexels_api_key",
    name: "Pexels",
    envVar: "PEXELS_API_KEY",
    docsUrl: "https://www.pexels.com/api/",
    placeholder: "...",
    required: false,
  },
  {
    key: "pixabay_api_key",
    name: "Pixabay",
    envVar: "PIXABAY_API_KEY",
    docsUrl: "https://pixabay.com/api/docs/",
    placeholder: "...",
    required: false,
  },
  {
    key: "unsplash_api_key",
    name: "Unsplash",
    envVar: "UNSPLASH_ACCESS_KEY",
    docsUrl: "https://unsplash.com/developers",
    placeholder: "...",
    required: false,
  },
  {
    key: "json2video_api_key",
    name: "JSON2Video",
    envVar: "JSON2VIDEO_API_KEY",
    docsUrl: "https://json2video.com/",
    placeholder: "...",
    required: false,
  },
  {
    key: "elevenlabs_api_key",
    name: "ElevenLabs",
    envVar: "ELEVENLABS_API_KEY",
    docsUrl: "https://elevenlabs.io/",
    placeholder: "...",
    required: false,
  },
  {
    key: "tavily_api_key",
    name: "Tavily (Pesquisa)",
    envVar: "TAVILY_API_KEY",
    docsUrl: "https://tavily.com/",
    placeholder: "tvly-...",
    required: false,
  },
  {
    key: "replicate_api_key",
    name: "Replicate",
    envVar: "REPLICATE_API_TOKEN",
    docsUrl: "https://replicate.com/account/api-tokens",
    placeholder: "r8_...",
    required: false,
  },
  {
    key: "stability_api_key",
    name: "Stability AI",
    envVar: "STABILITY_API_KEY",
    docsUrl: "https://platform.stability.ai/",
    placeholder: "sk-...",
    required: false,
  },
];

export default function ApiKeysModal() {
  const { isApiKeyModalOpen, closeApiKeyModal } = useUIStore();
  const { keys, testedKeys, setKey, markKeyTested, clearKey, clearAllKeys } =
    useAPIKeysStore();

  const [serverStatus, setServerStatus] = useState<APIKeyStatus | null>(null);
  const [, setIsLoadingServer] = useState(true);
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testingAll, setTestingAll] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  // Carregar status das chaves do servidor
  useEffect(() => {
    if (isApiKeyModalOpen) {
      setIsLoadingServer(true);
      checkAPIKeys().then((status) => {
        setServerStatus(status);
        setIsLoadingServer(false);
      });
    }
  }, [isApiKeyModalOpen]);

  const testSingleKey = async (config: KeyConfig) => {
    const value = keys[config.key];
    if (!value) {
      setTestResults((prev) => ({
        ...prev,
        [config.key]: { success: false, message: "Chave não preenchida" },
      }));
      return;
    }

    setTestingKey(config.key);
    try {
      const response = await fetch("/api/config/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyType: config.key,
          keyValue: value,
          channelId: config.key === "youtube_api_key" ? keys.youtube_channel_id : undefined,
        }),
      });

      const result = await response.json();
      setTestResults((prev) => ({
        ...prev,
        [config.key]: { success: result.success, message: result.message },
      }));
      markKeyTested(config.key, result.success);
    } catch {
      setTestResults((prev) => ({
        ...prev,
        [config.key]: { success: false, message: "Erro ao testar" },
      }));
      markKeyTested(config.key, false);
    } finally {
      setTestingKey(null);
    }
  };

  const testAllKeys = async () => {
    setTestingAll(true);
    const keysToTest = API_KEYS_CONFIG.filter((config) => keys[config.key]);

    for (const config of keysToTest) {
      await testSingleKey(config);
    }
    setTestingAll(false);
  };

  const toggleShowPassword = (key: string) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getKeyStatus = (config: KeyConfig) => {
    const hasLocalKey = !!keys[config.key];
    const localKeyTested = testedKeys[config.key];
    const serverKey = config.key.replace("_api_key", "").replace("_", "") as keyof APIKeyStatus;
    const hasServerKey = serverStatus?.[serverKey] ?? false;

    if (hasLocalKey && localKeyTested) {
      return "valid";
    } else if (hasLocalKey) {
      return "pending";
    } else if (hasServerKey) {
      return "server";
    }
    return "missing";
  };

  const configuredCount = API_KEYS_CONFIG.filter((config) => {
    const status = getKeyStatus(config);
    return status === "valid" || status === "server";
  }).length;

  const [activeTab, setActiveTab] = useState<'keys' | 'models'>('keys');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // Provedores de IA para explorar modelos
  const AI_PROVIDERS = [
    { key: 'openai', name: 'OpenAI', icon: '🤖', apiKeyField: 'openai_api_key' },
    { key: 'anthropic', name: 'Anthropic', icon: '🔮', apiKeyField: 'anthropic_api_key' },
    { key: 'gemini', name: 'Google Gemini', icon: '🧠', apiKeyField: 'google_api_key' },
    { key: 'elevenlabs', name: 'ElevenLabs', icon: '🎤', apiKeyField: 'elevenlabs_api_key' },
    { key: 'pexels', name: 'Pexels', icon: '📷', apiKeyField: 'pexels_api_key' },
    { key: 'pixabay', name: 'Pixabay', icon: '🖼️', apiKeyField: 'pixabay_api_key' },
    { key: 'youtube', name: 'YouTube', icon: '📺', apiKeyField: 'youtube_api_key' },
    { key: 'tavily', name: 'Tavily', icon: '🔍', apiKeyField: 'tavily_api_key' },
    { key: 'json2video', name: 'JSON2Video', icon: '🎬', apiKeyField: 'json2video_api_key' },
  ];

  const isProviderConnected = (apiKeyField: string) => {
    const hasLocalKey = !!keys[apiKeyField as keyof StoredAPIKeys];
    const serverKey = apiKeyField.replace("_api_key", "").replace("_", "") as keyof APIKeyStatus;
    const hasServerKey = serverStatus?.[serverKey] ?? false;
    return hasLocalKey || hasServerKey;
  };

  return (
    <Modal
      isOpen={isApiKeyModalOpen}
      onClose={closeApiKeyModal}
      title="Configurar API Keys"
      size="xl"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-subtle">
          <button
            onClick={() => { setActiveTab('keys'); setSelectedProvider(null); }}
            className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'keys'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-muted hover:text-gray-200'
            }`}
          >
            <Key className="w-4 h-4" />
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'models'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-muted hover:text-gray-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Modelos Disponíveis
          </button>
        </div>

        {/* Tab: Modelos */}
        {activeTab === 'models' && (
          <div className="space-y-4">
            {!selectedProvider ? (
              <>
                <p className="text-sm text-muted">
                  Selecione um provedor para explorar os modelos disponíveis:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AI_PROVIDERS.map(provider => {
                    const connected = isProviderConnected(provider.apiKeyField);
                    return (
                      <button
                        key={provider.key}
                        onClick={() => setSelectedProvider(provider.key)}
                        className={`p-4 rounded-lg border transition-all flex items-center gap-3 hover:bg-layer-2/50 ${
                          connected
                            ? 'border-green-500/30 bg-green-900/10'
                            : 'border-subtle bg-layer-2/30'
                        }`}
                      >
                        <span className="text-2xl">{provider.icon}</span>
                        <div className="text-left flex-1">
                          <p className="font-medium text-white text-sm">{provider.name}</p>
                          <p className={`text-xs ${connected ? 'text-green-400' : 'text-muted'}`}>
                            {connected ? 'Conectado' : 'Não configurado'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted" />
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  ← Voltar para lista
                </button>
                <ModelsExplorer
                  provider={selectedProvider}
                  apiKey={keys[AI_PROVIDERS.find(p => p.key === selectedProvider)?.apiKeyField as keyof StoredAPIKeys]}
                  isConnected={isProviderConnected(AI_PROVIDERS.find(p => p.key === selectedProvider)?.apiKeyField || '')}
                />
              </>
            )}
          </div>
        )}

        {/* Tab: API Keys */}
        {activeTab === 'keys' && (
          <>
        {/* Resumo */}
        <div className="flex items-center justify-between p-4 bg-layer-2/50 rounded-lg">
          <div>
            <p className="text-sm text-muted">APIs Configuradas</p>
            <p className="text-2xl font-bold text-white">
              {configuredCount} / {API_KEYS_CONFIG.length}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testAllKeys}
              isLoading={testingAll}
              leftIcon={<TestTube className="w-4 h-4" />}
            >
              Testar Todas
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllKeys}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Limpar
            </Button>
          </div>
        </div>

        {/* Instruções */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Como funciona:</strong> Insira suas API keys abaixo. Elas serão salvas
            na sua sessão do navegador (sessionStorage) e usadas enquanto você estiver
            usando o sistema. As chaves do servidor (.env) têm prioridade.
          </p>
        </div>

        {/* Lista de APIs */}
        <div className="space-y-3 max-h-[50vh] overflow-auto pr-2">
          {API_KEYS_CONFIG.map((config) => {
            const status = getKeyStatus(config);
            const isTestingThis = testingKey === config.key;
            const testResult = testResults[config.key];

            return (
              <div
                key={config.key}
                className="p-4 bg-layer-2/30 rounded-lg border border-subtle"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{config.name}</span>
                    {config.required && (
                      <Badge variant="warning" size="sm">
                        Requerido
                      </Badge>
                    )}
                    {status === "valid" && (
                      <Badge variant="success" size="sm">
                        <Check className="w-3 h-3 mr-1" />
                        Validado
                      </Badge>
                    )}
                    {status === "server" && (
                      <Badge variant="info" size="sm">
                        Servidor
                      </Badge>
                    )}
                    {status === "pending" && (
                      <Badge variant="warning" size="sm">
                        Não testada
                      </Badge>
                    )}
                  </div>
                  <a
                    href={config.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
                  >
                    Obter
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type={showPassword[config.key] ? "text" : "password"}
                      value={keys[config.key]}
                      onChange={(e) => setKey(config.key, e.target.value)}
                      placeholder={config.placeholder}
                      className="pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword(config.key)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gray-300"
                    >
                      {showPassword[config.key] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testSingleKey(config)}
                    isLoading={isTestingThis}
                    disabled={!keys[config.key] || testingAll}
                    className="w-24"
                  >
                    {isTestingThis ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <TestTube className="w-4 h-4 mr-1" />
                        Testar
                      </>
                    )}
                  </Button>
                  {keys[config.key] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearKey(config.key)}
                      className="px-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Resultado do teste */}
                {testResult && (
                  <div
                    className={`mt-2 text-sm flex items-center gap-1 ${
                      testResult.success ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {testResult.success ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {testResult.message}
                  </div>
                )}

                {/* Info do env var */}
                <p className="text-xs text-muted mt-2 font-mono">
                  ENV: {config.envVar}
                </p>
              </div>
            );
          })}
        </div>

        {/* Requisitos Mínimos */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-300">
            <strong>Requisitos mínimos para funcionar:</strong>
          </p>
          <ul className="text-sm text-yellow-300/80 mt-2 list-disc list-inside space-y-1">
            <li>YouTube Data API Key + Channel ID (para sincronização)</li>
            <li>Pelo menos 1 provedor de AI (OpenAI, Google, ou Anthropic)</li>
            <li>Pelo menos 1 provedor de mídia (Pexels, Pixabay, ou Unsplash)</li>
          </ul>
        </div>
          </>
        )}

        {/* Botões de ação */}
        <div className="flex justify-end gap-2 pt-4 border-t border-subtle">
          <Button variant="ghost" onClick={closeApiKeyModal}>
            Fechar
          </Button>
          <Button
            variant="primary"
            onClick={closeApiKeyModal}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Salvar e Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
