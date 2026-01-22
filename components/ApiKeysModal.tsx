"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { useUIStore } from "@/lib/store";
import { APIKeyStatus } from "@/types";
import { checkAPIKeys } from "@/lib/api-keys";
import { Check, X, Loader2, ExternalLink } from "lucide-react";

interface KeyConfig {
  key: keyof APIKeyStatus;
  name: string;
  envVar: string;
  docsUrl: string;
  required: boolean;
}

const API_KEYS: KeyConfig[] = [
  {
    key: "youtube",
    name: "YouTube Data API",
    envVar: "YOUTUBE_API_KEY + YOUTUBE_CHANNEL_ID",
    docsUrl: "https://console.cloud.google.com/apis/credentials",
    required: true,
  },
  {
    key: "openai",
    name: "OpenAI",
    envVar: "OPENAI_API_KEY",
    docsUrl: "https://platform.openai.com/api-keys",
    required: false,
  },
  {
    key: "google",
    name: "Google Gemini",
    envVar: "GOOGLE_GENERATIVE_AI_API_KEY",
    docsUrl: "https://aistudio.google.com/apikey",
    required: false,
  },
  {
    key: "anthropic",
    name: "Anthropic Claude",
    envVar: "ANTHROPIC_API_KEY",
    docsUrl: "https://console.anthropic.com/settings/keys",
    required: false,
  },
  {
    key: "pexels",
    name: "Pexels",
    envVar: "PEXELS_API_KEY",
    docsUrl: "https://www.pexels.com/api/",
    required: false,
  },
  {
    key: "pixabay",
    name: "Pixabay",
    envVar: "PIXABAY_API_KEY",
    docsUrl: "https://pixabay.com/api/docs/",
    required: false,
  },
  {
    key: "unsplash",
    name: "Unsplash",
    envVar: "UNSPLASH_ACCESS_KEY",
    docsUrl: "https://unsplash.com/developers",
    required: false,
  },
  {
    key: "json2video",
    name: "JSON2Video",
    envVar: "JSON2VIDEO_API_KEY",
    docsUrl: "https://json2video.com/",
    required: false,
  },
  {
    key: "elevenlabs",
    name: "ElevenLabs",
    envVar: "ELEVENLABS_API_KEY",
    docsUrl: "https://elevenlabs.io/",
    required: false,
  },
  {
    key: "tavily",
    name: "Tavily",
    envVar: "TAVILY_API_KEY",
    docsUrl: "https://tavily.com/",
    required: false,
  },
  {
    key: "replicate",
    name: "Replicate",
    envVar: "REPLICATE_API_TOKEN",
    docsUrl: "https://replicate.com/account/api-tokens",
    required: false,
  },
  {
    key: "stability",
    name: "Stability AI",
    envVar: "STABILITY_API_KEY",
    docsUrl: "https://platform.stability.ai/",
    required: false,
  },
];

export default function ApiKeysModal() {
  const { isApiKeyModalOpen, closeApiKeyModal } = useUIStore();
  const [status, setStatus] = useState<APIKeyStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isApiKeyModalOpen) {
      setIsLoading(true);
      checkAPIKeys().then((data) => {
        setStatus(data);
        setIsLoading(false);
      });
    }
  }, [isApiKeyModalOpen]);

  const configuredCount = status
    ? Object.values(status).filter(Boolean).length
    : 0;
  const totalCount = API_KEYS.length;

  return (
    <Modal
      isOpen={isApiKeyModalOpen}
      onClose={closeApiKeyModal}
      title="Status das API Keys"
      size="lg"
    >
      <div className="space-y-6">
        {/* Summary */}
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <p className="text-sm text-gray-400">APIs Configuradas</p>
            <p className="text-2xl font-bold text-white">
              {configuredCount} / {totalCount}
            </p>
          </div>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          ) : configuredCount >= 3 ? (
            <Badge variant="success">Sistema Funcional</Badge>
          ) : (
            <Badge variant="warning">Configuração Incompleta</Badge>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-300">
            As API keys devem ser configuradas como variáveis de ambiente no
            arquivo <code className="bg-blue-500/20 px-1 rounded">.env.local</code>{" "}
            (desenvolvimento local) ou nas configurações do Vercel (produção).
          </p>
        </div>

        {/* API Keys List */}
        <div className="space-y-2">
          {API_KEYS.map((config) => {
            const isConfigured = status?.[config.key] ?? false;

            return (
              <div
                key={config.key}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isConfigured ? "bg-green-500/20" : "bg-gray-700"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : isConfigured ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{config.name}</p>
                      {config.required && (
                        <Badge variant="warning" size="sm">
                          Requerido
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-mono">
                      {config.envVar}
                    </p>
                  </div>
                </div>

                <a
                  href={config.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  <span>Obter</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Minimum Requirements */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-300">
            <strong>Requisitos mínimos:</strong> Para o sistema funcionar, você
            precisa de pelo menos:
          </p>
          <ul className="text-sm text-yellow-300/80 mt-2 list-disc list-inside space-y-1">
            <li>YouTube Data API (para sincronização do canal)</li>
            <li>Pelo menos 1 provedor de AI (OpenAI, Google, ou Anthropic)</li>
            <li>Pelo menos 1 provedor de mídia (Pexels, Pixabay, ou Unsplash)</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
