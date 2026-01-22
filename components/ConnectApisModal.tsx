"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Wifi, Loader2, CheckCircle2, XCircle, AlertTriangle,
  RefreshCw, Eye, EyeOff, Save, Play, ChevronDown, ChevronUp, Zap, Server,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useUIStore } from "@/lib/store";
import { useAPIKeysStore } from "@/lib/api-keys-store";
import { APIKeyStatus } from "@/types";

interface APIService {
  id: string;
  name: string;
  description: string;
  keyField: string;
  secondaryField?: string;
  required: boolean;
  category: "ai" | "media" | "youtube" | "other";
  serverStatusKey: keyof APIKeyStatus;
}

interface ConnectionResult {
  status: "idle" | "testing" | "success" | "error" | "server";
  message?: string;
  details?: string;
}

// Configuração dos Serviços
const API_SERVICES: APIService[] = [
  { id: "openai", name: "OpenAI", description: "GPT-4, DALL-E", keyField: "openai_api_key", required: true, category: "ai", serverStatusKey: "openai" },
  { id: "google", name: "Google Gemini", description: "Gemini Pro, Vision", keyField: "google_api_key", required: false, category: "ai", serverStatusKey: "google" },
  { id: "anthropic", name: "Anthropic", description: "Claude 3.5", keyField: "anthropic_api_key", required: false, category: "ai", serverStatusKey: "anthropic" },
  { id: "youtube", name: "YouTube Data API", description: "Sincronização e Upload", keyField: "youtube_api_key", secondaryField: "youtube_channel_id", required: true, category: "youtube", serverStatusKey: "youtube" },
  { id: "pexels", name: "Pexels", description: "Vídeos e Imagens", keyField: "pexels_api_key", required: false, category: "media", serverStatusKey: "pexels" },
  { id: "pixabay", name: "Pixabay", description: "Mídia Gratuita", keyField: "pixabay_api_key", required: false, category: "media", serverStatusKey: "pixabay" },
  { id: "elevenlabs", name: "ElevenLabs", description: "Vozes Ultra Realistas", keyField: "elevenlabs_api_key", required: false, category: "other", serverStatusKey: "elevenlabs" },
  { id: "tavily", name: "Tavily", description: "Deep Research na Web", keyField: "tavily_api_key", required: false, category: "other", serverStatusKey: "tavily" },
  { id: "json2video", name: "JSON2Video", description: "Renderização de Vídeo", keyField: "json2video_api_key", required: false, category: "other", serverStatusKey: "json2video" },
];

export default function ConnectApisModal() {
  const { isConnectApisModalOpen, setConnectApisModalOpen } = useUIStore();
  const { keys, setKey, getKey, markKeyTested } = useAPIKeysStore();

  const [serverStatus, setServerStatus] = useState<APIKeyStatus | null>(null);
  const [isLoadingServerStatus, setIsLoadingServerStatus] = useState(true);
  const [connectionResults, setConnectionResults] = useState<Record<string, ConnectionResult>>({});
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    ai: true, youtube: true, media: true, other: true,
  });

  // Carregar status do servidor ao abrir
  useEffect(() => {
    if (isConnectApisModalOpen) {
      setIsLoadingServerStatus(true);
      fetch("/api/config/keys")
        .then((res) => res.json())
        .then((status: APIKeyStatus) => {
          setServerStatus(status);
          const initialResults: Record<string, ConnectionResult> = {};
          API_SERVICES.forEach((service) => {
            // Se existir no servidor, marca como conectado via servidor
            if (status[service.serverStatusKey]) {
              initialResults[service.id] = {
                status: "server",
                message: "Conectado via Servidor",
                details: "Chave segura (.env)",
              };
            }
          });
          setConnectionResults(initialResults);
        })
        .catch(console.error)
        .finally(() => setIsLoadingServerStatus(false));

      // Carregar chaves locais para edição
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

  const testSingleAPI = async (service: APIService) => {
    setConnectionResults((prev) => ({ ...prev, [service.id]: { status: "testing" } }));

    try {
      const keyValue = editValues[service.keyField] || getKey(service.keyField as keyof typeof keys);
      
      // Se não tiver chave e não estiver no servidor, erro
      if (!keyValue && !serverStatus?.[service.serverStatusKey]) {
        const result: ConnectionResult = { status: "error", message: "Chave ausente", details: "Insira uma chave para testar" };
        setConnectionResults((prev) => ({ ...prev, [service.id]: result }));
        return;
      }

      // Payload compatível com o Backend "Solução Definitiva"
      const payload: any = {
        provider: service.id,
        key: keyValue, // Pode ser vazio se for usar a do servidor, o backend decide
      };

      if (service.secondaryField) {
        payload.channelId = editValues[service.secondaryField] || getKey(service.secondaryField as keyof typeof keys);
      }

      const response = await fetch("/api/config/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setConnectionResults((prev) => ({
          ...prev,
          [service.id]: { status: "success", message: "Conectado!", details: "API respondendo corretamente" }
        }));
        if (keyValue) markKeyTested(service.keyField as keyof typeof keys, true);
      } else {
        throw new Error(data.error || "Falha ao conectar");
      }
    } catch (error: any) {
      setConnectionResults((prev) => ({
        ...prev,
        [service.id]: { status: "error", message: "Erro de Conexão", details: error.message }
      }));
      markKeyTested(service.keyField as keyof typeof keys, false);
    }
  };

  const testAllAPIs = async () => {
    setIsTestingAll(true);
    for (const service of API_SERVICES) {
      // Tenta testar todos os serviços sequencialmente.
      // Se não houver chave, o testSingleAPI vai gerar o erro visual "Chave ausente".
      await testSingleAPI(service);
    }
    setIsTestingAll(false);
  };

  const saveKey = (service: APIService) => {
    const val = editValues[service.keyField];
    if (val) setKey(service.keyField as keyof typeof keys, val);
    
    if (service.secondaryField) {
      const secVal = editValues[service.secondaryField];
      if (secVal) setKey(service.secondaryField as keyof typeof keys, secVal);
    }
    setEditingService(null);
  };

  const servicesByCategory = API_SERVICES.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, APIService[]>);

  const getIcon = (result: ConnectionResult) => {
    if (result?.status === 'testing') return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    if (result?.status === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (result?.status === 'error') return <XCircle className="w-5 h-5 text-red-500" />;
    if (result?.status === 'server') return <Server className="w-5 h-5 text-violet-500" />;
    return <Wifi className="w-5 h-5 text-zinc-600" />;
  };

  if (!isConnectApisModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setConnectApisModalOpen(false)}
      >
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} 
          className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" /> Central de Conexões
              </h2>
              <p className="text-zinc-400 text-sm">Gerencie as APIs que dão poder ao sistema.</p>
            </div>
            <button onClick={() => setConnectApisModalOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg"><X className="w-5 h-5 text-zinc-400" /></button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <Button onClick={testAllAPIs} disabled={isTestingAll} isLoading={isTestingAll} className="w-full mb-4 bg-violet-600 hover:bg-violet-700">
              {isTestingAll ? "Testando Conexões..." : "Testar Todas as Conexões"}
            </Button>

            {Object.entries(servicesByCategory).map(([cat, services]) => (
              <div key={cat} className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-2">{cat}</h3>
                {services.map(service => {
                  const result = connectionResults[service.id];
                  const isEditing = editingService === service.id;
                  
                  return (
                    <div key={service.id} className={`p-4 rounded-xl border transition-all ${
                      result?.status === 'success' ? 'bg-emerald-950/10 border-emerald-500/20' : 
                      result?.status === 'error' ? 'bg-red-950/10 border-red-500/20' : 
                      'bg-zinc-900/50 border-zinc-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                            {getIcon(result)}
                          </div>
                          <div>
                            <div className="font-medium text-zinc-200">{service.name}</div>
                            <div className="text-xs text-zinc-500">{service.description}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <Button size="sm" variant="ghost" onClick={() => setEditingService(isEditing ? null : service.id)}>
                             {isEditing ? "Fechar" : "Editar"}
                           </Button>
                           <Button size="sm" variant="outline" onClick={() => testSingleAPI(service)} isLoading={result?.status === 'testing'}>
                             Testar
                           </Button>
                        </div>
                      </div>

                      {/* Mensagens de Status */}
                      {result?.message && (
                        <div className={`mt-2 text-xs px-2 ${
                          result.status === 'error' ? 'text-red-400' : 
                          result.status === 'success' ? 'text-emerald-400' : 'text-zinc-400'
                        }`}>
                          {result.message} {result.details && `• ${result.details}`}
                        </div>
                      )}

                      {/* Área de Edição */}
                      {isEditing && (
                        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
                          <div>
                            <label className="text-xs text-zinc-400 mb-1 block">Chave API (API Key)</label>
                            <div className="relative">
                              <input 
                                type={showKeys[service.keyField] ? "text" : "password"}
                                value={editValues[service.keyField] || ""}
                                onChange={(e) => setEditValues(p => ({...p, [service.keyField]: e.target.value}))}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none"
                                placeholder="sk-..."
                              />
                              <button onClick={() => setShowKeys(p => ({...p, [service.keyField]: !p[service.keyField]}))}
                                className="absolute right-2 top-2 text-zinc-500 hover:text-white">
                                {showKeys[service.keyField] ? <EyeOff size={14}/> : <Eye size={14}/>}
                              </button>
                            </div>
                          </div>
                          
                          {service.secondaryField && (
                            <div>
                              <label className="text-xs text-zinc-400 mb-1 block">ID do Canal (Channel ID)</label>
                              <input 
                                type="text"
                                value={editValues[service.secondaryField] || ""}
                                onChange={(e) => setEditValues(p => ({...p, [service.secondaryField!]: e.target.value}))}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none"
                              />
                            </div>
                          )}

                          <div className="flex justify-end gap-2">
                             <Button size="sm" onClick={() => saveKey(service)} leftIcon={<Save size={14}/>}>Salvar Chave</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}