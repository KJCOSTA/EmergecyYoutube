"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Wifi,
  WifiOff,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  Play,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useUIStore } from "@/lib/store";
import { useAPIKeysStore } from "@/lib/api-keys-store";

interface APIService {
  id: string;
  name: string;
  description: string;
  keyField: string;
  secondaryField?: string;
  required: boolean;
  category: "ai" | "media" | "youtube" | "other";
}

interface ConnectionResult {
  status: "idle" | "testing" | "success" | "error";
  message?: string;
  details?: string;
}

const API_SERVICES: APIService[] = [
  // AI Providers
  { id: "openai", name: "OpenAI", description: "GPT-4, DALL-E", keyField: "openai_api_key", required: true, category: "ai" },
  { id: "google", name: "Google Gemini", description: "Gemini Pro, Vision", keyField: "google_api_key", required: false, category: "ai" },
  { id: "anthropic", name: "Anthropic", description: "Claude 3.5", keyField: "anthropic_api_key", required: false, category: "ai" },

  // YouTube
  { id: "youtube", name: "YouTube Data API", description: "Channel sync, Upload", keyField: "youtube_api_key", secondaryField: "youtube_channel_id", required: true, category: "youtube" },

  // Media
  { id: "pexels", name: "Pexels", description: "Stock videos/images", keyField: "pexels_api_key", required: false, category: "media" },
  { id: "pixabay", name: "Pixabay", description: "Stock media", keyField: "pixabay_api_key", required: false, category: "media" },
  { id: "unsplash", name: "Unsplash", description: "High-quality images", keyField: "unsplash_api_key", required: false, category: "media" },

  // Other
  { id: "tavily", name: "Tavily", description: "Deep research", keyField: "tavily_api_key", required: false, category: "other" },
  { id: "elevenlabs", name: "ElevenLabs", description: "Voice synthesis", keyField: "elevenlabs_api_key", required: false, category: "other" },
  { id: "json2video", name: "JSON2Video", description: "Video rendering", keyField: "json2video_api_key", required: false, category: "other" },
];

export default function ConnectApisModal() {
  const { isConnectApisModalOpen, setConnectApisModalOpen } = useUIStore();
  const { keys, setKey, getKey, hasKey, markKeyTested } = useAPIKeysStore();

  const [connectionResults, setConnectionResults] = useState<Record<string, ConnectionResult>>({});
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    ai: true,
    youtube: true,
    media: false,
    other: false,
  });

  // Initialize edit values from stored keys
  useEffect(() => {
    if (isConnectApisModalOpen) {
      const initial: Record<string, string> = {};
      API_SERVICES.forEach((service) => {
        initial[service.keyField] = getKey(service.keyField as keyof typeof keys) || "";
        if (service.secondaryField) {
          initial[service.secondaryField] = getKey(service.secondaryField as keyof typeof keys) || "";
        }
      });
      setEditValues(initial);
    }
  }, [isConnectApisModalOpen, getKey, keys]);

  const testSingleAPI = async (service: APIService): Promise<ConnectionResult> => {
    setConnectionResults((prev) => ({
      ...prev,
      [service.id]: { status: "testing" },
    }));

    try {
      // Use stored key or edited value
      const keyValue = editValues[service.keyField] || getKey(service.keyField as keyof typeof keys);

      if (!keyValue) {
        const result: ConnectionResult = {
          status: "error",
          message: "Chave não configurada",
          details: "Insira a API key antes de testar",
        };
        setConnectionResults((prev) => ({ ...prev, [service.id]: result }));
        return result;
      }

      // Prepare request body with the format the API expects
      const body: { keyType: string; keyValue: string; channelId?: string } = {
        keyType: service.keyField,
        keyValue: keyValue,
      };

      // Add secondary field if needed (for YouTube Channel ID)
      if (service.secondaryField) {
        const secondaryValue = editValues[service.secondaryField] || getKey(service.secondaryField as keyof typeof keys);
        if (secondaryValue) {
          body.channelId = secondaryValue;
        }
      }

      const response = await fetch("/api/config/test-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const result: ConnectionResult = {
          status: "success",
          message: data.message || "Conectado com sucesso",
          details: data.details,
        };
        setConnectionResults((prev) => ({ ...prev, [service.id]: result }));

        // Mark key as tested successfully
        markKeyTested(service.keyField as keyof typeof keys, true);
        if (service.secondaryField) {
          markKeyTested(service.secondaryField as keyof typeof keys, true);
        }

        return result;
      } else {
        const result: ConnectionResult = {
          status: "error",
          message: data.message || "Falha na conexão",
          details: data.message,
        };
        setConnectionResults((prev) => ({ ...prev, [service.id]: result }));

        // Mark key as tested but failed
        markKeyTested(service.keyField as keyof typeof keys, false);

        return result;
      }
    } catch (error) {
      const result: ConnectionResult = {
        status: "error",
        message: "Erro de rede",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      };
      setConnectionResults((prev) => ({ ...prev, [service.id]: result }));
      return result;
    }
  };

  const testAllAPIs = async () => {
    setIsTestingAll(true);

    // Expand all categories during test
    setExpandedCategories({ ai: true, youtube: true, media: true, other: true });

    for (const service of API_SERVICES) {
      const keyValue = editValues[service.keyField] || getKey(service.keyField as keyof typeof keys);
      if (keyValue) {
        await testSingleAPI(service);
        // Small delay between tests for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 300));
      } else {
        setConnectionResults((prev) => ({
          ...prev,
          [service.id]: { status: "idle", message: "Chave não configurada" },
        }));
      }
    }

    setIsTestingAll(false);
  };

  const saveKey = (service: APIService) => {
    const value = editValues[service.keyField];
    if (value) {
      setKey(service.keyField as keyof typeof keys, value);
    }
    if (service.secondaryField) {
      const secondaryValue = editValues[service.secondaryField];
      if (secondaryValue) {
        setKey(service.secondaryField as keyof typeof keys, secondaryValue);
      }
    }
    setEditingService(null);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const getStatusIcon = (status: ConnectionResult["status"]) => {
    switch (status) {
      case "testing":
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <WifiOff className="w-5 h-5 text-zinc-600" />;
    }
  };

  const getStatusBg = (status: ConnectionResult["status"]) => {
    switch (status) {
      case "testing":
        return "bg-blue-500/10 border-blue-500/30";
      case "success":
        return "bg-emerald-500/10 border-emerald-500/30";
      case "error":
        return "bg-red-500/10 border-red-500/30";
      default:
        return "bg-zinc-800/50 border-zinc-700/50";
    }
  };

  const categoryLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    ai: { label: "Provedores de IA", icon: <Zap className="w-4 h-4" /> },
    youtube: { label: "YouTube", icon: <Play className="w-4 h-4" /> },
    media: { label: "Bibliotecas de Mídia", icon: <Wifi className="w-4 h-4" /> },
    other: { label: "Outros Serviços", icon: <Wifi className="w-4 h-4" /> },
  };

  const servicesByCategory = API_SERVICES.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, APIService[]>);

  if (!isConnectApisModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setConnectApisModalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl max-h-[85vh] overflow-hidden bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30">
                <Wifi className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Conectar APIs</h2>
                <p className="text-sm text-zinc-500">Configure e teste suas conexões</p>
              </div>
            </div>
            <button
              onClick={() => setConnectApisModalOpen(false)}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Test All Button */}
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
            <Button
              onClick={testAllAPIs}
              isLoading={isTestingAll}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500"
            >
              {isTestingAll ? "Testando conexões..." : "Testar Todas as Conexões"}
            </Button>
          </div>

          {/* Services List */}
          <div className="overflow-y-auto max-h-[calc(85vh-180px)] px-6 py-4 space-y-4">
            {Object.entries(servicesByCategory).map(([category, services]) => (
              <div key={category} className="space-y-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                    {categoryLabels[category]?.icon}
                    {categoryLabels[category]?.label}
                    <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-700 text-zinc-400">
                      {services.length}
                    </span>
                  </div>
                  {expandedCategories[category] ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </button>

                {/* Services */}
                <AnimatePresence>
                  {expandedCategories[category] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2 overflow-hidden"
                    >
                      {services.map((service) => {
                        const result = connectionResults[service.id] || { status: "idle" };
                        const isEditing = editingService === service.id;
                        const hasStoredKey = hasKey(service.keyField as keyof typeof keys);

                        return (
                          <motion.div
                            key={service.id}
                            layout
                            className={`p-4 rounded-lg border transition-all ${getStatusBg(result.status)}`}
                          >
                            {/* Service Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(result.status)}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-white">{service.name}</span>
                                    {service.required && (
                                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        OBRIGATÓRIO
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-zinc-500">{service.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {!isEditing && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingService(service.id)}
                                      className="text-zinc-400 hover:text-white"
                                    >
                                      Editar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => testSingleAPI(service)}
                                      disabled={!hasStoredKey && !editValues[service.keyField]}
                                      isLoading={result.status === "testing"}
                                    >
                                      Testar
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Status Message */}
                            {result.message && (
                              <div className={`text-sm mt-2 ${
                                result.status === "success" ? "text-emerald-400" :
                                result.status === "error" ? "text-red-400" : "text-zinc-500"
                              }`}>
                                {result.message}
                              </div>
                            )}

                            {/* Error Details */}
                            {result.status === "error" && result.details && (
                              <div className="mt-2 p-3 rounded-lg bg-red-950/50 border border-red-900/50">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                  <div className="text-xs text-red-300 font-mono break-all">
                                    {result.details}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Edit Mode */}
                            {isEditing && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 space-y-3"
                              >
                                <div>
                                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                                    API Key
                                  </label>
                                  <div className="relative">
                                    <input
                                      type={showKeys[service.keyField] ? "text" : "password"}
                                      value={editValues[service.keyField] || ""}
                                      onChange={(e) =>
                                        setEditValues((prev) => ({
                                          ...prev,
                                          [service.keyField]: e.target.value,
                                        }))
                                      }
                                      placeholder="Insira sua API key..."
                                      className="w-full px-3 py-2 pr-10 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-mono text-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setShowKeys((prev) => ({
                                          ...prev,
                                          [service.keyField]: !prev[service.keyField],
                                        }))
                                      }
                                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white transition-colors"
                                    >
                                      {showKeys[service.keyField] ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {service.secondaryField && (
                                  <div>
                                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                                      {service.secondaryField === "youtube_channel_id" ? "Channel ID" : "Secondary Key"}
                                    </label>
                                    <input
                                      type="text"
                                      value={editValues[service.secondaryField] || ""}
                                      onChange={(e) =>
                                        setEditValues((prev) => ({
                                          ...prev,
                                          [service.secondaryField!]: e.target.value,
                                        }))
                                      }
                                      placeholder="Insira o valor..."
                                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-mono text-sm"
                                    />
                                  </div>
                                )}

                                <div className="flex items-center gap-2 pt-2">
                                  <Button
                                    size="sm"
                                    onClick={() => saveKey(service)}
                                    leftIcon={<Save className="w-3 h-3" />}
                                    className="bg-emerald-600 hover:bg-emerald-500"
                                  >
                                    Salvar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingService(null)}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      saveKey(service);
                                      testSingleAPI(service);
                                    }}
                                    leftIcon={<Play className="w-3 h-3" />}
                                  >
                                    Salvar e Testar
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
