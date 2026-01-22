"use client";

import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, RefreshCw, Key, Save, Eye, EyeOff } from 'lucide-react';

// Mapa de nomes amigáveis
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

export default function ConnectApisModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [serverKeys, setServerKeys] = useState<Record<string, boolean>>({});
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [manualKeys, setManualKeys] = useState<Record<string, string>>({});

  // Carrega status do servidor ao abrir
  useEffect(() => {
    if (isOpen) checkServerKeys();
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

  const handleSaveKey = (key: string) => {
    // Aqui você pode implementar a lógica para salvar no localStorage ou enviar para uma API de teste
    // Por enquanto, vamos apenas fechar a edição para simular o salvamento visual
    setShowEdit(null);
    alert(`Chave ${key} salva localmente! (Implementação de persistência pendente)`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#09090b] border border-zinc-800 rounded-xl text-white shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-500" />
              Gerenciar Conexões
            </h2>
            <p className="text-zinc-400 text-sm">Verifique o status do servidor ou insira chaves manuais.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-zinc-400 hover:text-white" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-12 text-zinc-500 gap-3">
               <RefreshCw className="animate-spin w-8 h-8 text-indigo-500" />
               <p>Verificando variáveis de ambiente...</p>
             </div>
          ) : (
            Object.keys(API_NAMES).map((key) => {
              const isConnected = serverKeys[key];
              const isEditing = showEdit === key;

              return (
                <div key={key} className={`border rounded-lg transition-all ${isConnected ? 'border-green-900/30 bg-green-900/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-500/10' : 'bg-zinc-800'}`}>
                        {isConnected ? <Check className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-zinc-500" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-200">{API_NAMES[key]}</h3>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">
                          {isConnected ? 'Conectado via Vercel Env' : 'Chave não detectada no servidor'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">
                          ATIVO
                        </span>
                      ) : (
                        <button 
                          onClick={() => setShowEdit(isEditing ? null : key)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md transition-colors"
                        >
                          {isEditing ? 'Cancelar' : 'Editar'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Área de Edição Manual (Só aparece se clicar em Editar) */}
                  {isEditing && !isConnected && (
                    <div className="p-4 border-t border-zinc-800 bg-black/20 animate-in slide-in-from-top-2 duration-200">
                      <label className="text-xs text-zinc-400 mb-1.5 block">Insira a chave manualmente (Session Storage)</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="password"
                            placeholder={`Cole sua chave ${API_NAMES[key]} aqui...`}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            value={manualKeys[key] || ''}
                            onChange={(e) => setManualKeys({...manualKeys, [key]: e.target.value})}
                          />
                        </div>
                        <button 
                          onClick={() => handleSaveKey(key)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Salvar
                        </button>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2">
                        * Nota: Chaves manuais são temporárias. Para produção, adicione nas variáveis de ambiente da Vercel.
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 rounded-b-xl flex justify-between items-center">
          <button 
            onClick={checkServerKeys} 
            className="text-zinc-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Verificar Novamente
          </button>
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold rounded-lg transition-colors shadow-lg shadow-white/5"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
