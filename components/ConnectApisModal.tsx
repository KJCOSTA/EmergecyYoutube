"use client";

import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, RefreshCw, Key, Save, Server, Monitor, Trash2 } from 'lucide-react';
import { useAPIKeysStore, StoredAPIKeys } from '@/lib/api-keys-store';
import { useUIStore } from '@/lib/store';

// Mapeamento EXATO com lib/api-keys-store.ts
const KEY_MAP: Record<string, keyof StoredAPIKeys> = {
  openai: "openai_api_key",
  gemini: "google_api_key",
  anthropic: "anthropic_api_key",
  youtube: "youtube_api_key",
  pexels: "pexels_api_key",
  pixabay: "pixabay_api_key",
  elevenlabs: "elevenlabs_api_key",
  tavily: "tavily_api_key",
  json2video: "json2video_api_key"
};

const API_NAMES: Record<string, string> = {
  openai: "OpenAI (GPT-4)",
  gemini: "Google Gemini",
  anthropic: "Anthropic Claude",
  youtube: "YouTube Data API",
  pexels: "Pexels Media",
  pixabay: "Pixabay Media",
  elevenlabs: "ElevenLabs Voice",
  tavily: "Tavily Search",
  json2video: "JSON2Video"
};

export default function ConnectApisModal() {
  const { isApiKeyModalOpen, closeApiKeyModal } = useUIStore();
  const isOpen = isApiKeyModalOpen;
  const onClose = closeApiKeyModal;
  const [loading, setLoading] = useState(true);
  const [serverKeys, setServerKeys] = useState<Record<string, boolean>>({});
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const { keys: localKeys, setKey, clearKey } = useAPIKeysStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      checkServerKeys();
    }
  }, [isOpen]);

  const checkServerKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setServerKeys(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = (visualKey: string) => {
    const storeKeyName = KEY_MAP[visualKey];
    if (storeKeyName) {
      setKey(storeKeyName, manualInput);
      setShowEdit(null);
      setManualInput("");
    }
  };

  const handleClearKey = (visualKey: string) => {
    const storeKeyName = KEY_MAP[visualKey];
    if (storeKeyName) {
      clearKey(storeKeyName);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#09090b] border border-subtle rounded-xl text-white shadow-2xl flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-subtle bg-layer-1/50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" />
              Central de Conexões
            </h2>
            <p className="text-muted text-sm">Gerencie chaves do Servidor (.env) ou Locais (Navegador).</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-layer-2 rounded-full transition-colors cursor-pointer">
            <X className="w-6 h-6 text-muted hover:text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-3">
               <RefreshCw className="animate-spin w-8 h-8 text-indigo-500" />
               <p>Verificando status...</p>
             </div>
          ) : (
            Object.keys(API_NAMES).map((key) => {
              const storeKeyName = KEY_MAP[key];
              const isServerConnected = serverKeys[key];
              const hasLocalKey = mounted && !!localKeys[storeKeyName];
              const isLocalConnected = hasLocalKey;
              const isConnected = isServerConnected || isLocalConnected;
              const isEditing = showEdit === key;

              return (
                <div key={key} className={`border rounded-lg transition-all ${isConnected ? 'border-green-900/30 bg-green-900/5' : 'border-subtle bg-layer-1/30'}`}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-500/10' : 'bg-layer-2'}`}>
                        {isConnected ? <Check className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-zinc-500" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-200">{API_NAMES[key]}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {isServerConnected && (
                            <span className="flex items-center gap-1 text-[10px] bg-layer-2 px-2 py-0.5 rounded text-zinc-300 border border-subtle">
                              <Server className="w-3 h-3" /> Servidor
                            </span>
                          )}
                          {isLocalConnected && (
                            <span className="flex items-center gap-1 text-[10px] bg-indigo-900/30 px-2 py-0.5 rounded text-indigo-300 border border-indigo-500/20">
                              <Monitor className="w-3 h-3" /> Local
                            </span>
                          )}
                          {!isConnected && <span className="text-[10px] text-red-400 font-medium">Chave ausente</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isLocalConnected && !isServerConnected && (
                         <button onClick={() => handleClearKey(key)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors" title="Remover">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      )}
                      {!isServerConnected && (
                        <button
                          onClick={() => {
                            setShowEdit(isEditing ? null : key);
                            setManualInput(localKeys[storeKeyName] || "");
                          }}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer border ${isEditing ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-layer-1 border-subtle text-zinc-300 hover:bg-layer-2'}`}
                        >
                          {isEditing ? 'Cancelar' : (isLocalConnected ? 'Editar' : 'Adicionar')}
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="p-4 border-t border-subtle bg-black/20 animate-in slide-in-from-top-2 duration-200">
                      <label className="text-xs text-muted mb-1.5 block">Cole sua chave API aqui:</label>
                      <div className="flex gap-2">
                        <input 
                          type="password"
                          placeholder="sk-..."
                          className="flex-1 bg-zinc-950 border border-subtle rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          value={manualInput}
                          onChange={(e) => setManualInput(e.target.value)}
                        />
                        <button 
                          onClick={() => handleSaveKey(key)}
                          disabled={!manualInput}
                          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
                        >
                          <Save className="w-4 h-4" /> Salvar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        <div className="p-6 border-t border-subtle bg-layer-1/50 rounded-b-xl flex justify-between items-center">
          <button onClick={checkServerKeys} className="text-muted hover:text-white text-sm flex items-center gap-2 transition-colors cursor-pointer">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Verificar
          </button>
          <button onClick={onClose} className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold rounded-lg transition-colors cursor-pointer shadow-lg shadow-white/5">
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
