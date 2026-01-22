"use client";

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, Key, X } from 'lucide-react';

interface ApiStatus {
  [key: string]: boolean;
}

export default function ConnectApisModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [serverKeys, setServerKeys] = useState<ApiStatus>({});

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
    } catch (error) {
      console.error("Erro ao verificar chaves:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl text-white shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-semibold">Status das Conexões</h2>
            <p className="text-sm text-zinc-400 mt-1">Verificação automática das chaves no servidor Vercel.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-purple-500 w-8 h-8" /></div>
          ) : (
            <div className="grid gap-3 max-h-[50vh] overflow-y-auto pr-2">
              {[
                { id: 'openai', label: 'OpenAI (GPT-4)' },
                { id: 'gemini', label: 'Google Gemini' },
                { id: 'anthropic', label: 'Anthropic Claude' },
                { id: 'tavily', label: 'Tavily (Pesquisa)' },
                { id: 'youtube', label: 'YouTube API' },
                { id: 'pexels', label: 'Pexels Media' },
                { id: 'elevenlabs', label: 'ElevenLabs Voz' }
              ].map((api) => (
                <div key={api.id} className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-md ${serverKeys[api.id] ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      <Key className={`w-4 h-4 ${serverKeys[api.id] ? 'text-green-500' : 'text-red-500'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{api.label}</h4>
                      {serverKeys[api.id] 
                        ? <span className="text-green-500 text-xs font-medium">Conectado (Servidor)</span>
                        : <span className="text-red-500 text-xs font-medium">Chave ausente no Vercel</span>
                      }
                    </div>
                  </div>
                  {serverKeys[api.id] 
                    ? <CheckCircle2 className="w-6 h-6 text-green-500" />
                    : <XCircle className="w-6 h-6 text-red-500" />
                  }
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-zinc-800 bg-zinc-900/30 rounded-b-xl">
           <button 
             onClick={checkServerKeys} 
             className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
           >
             Recarregar
           </button>
           <button 
             onClick={onClose} 
             className="px-4 py-2 text-sm font-medium text-black bg-white hover:bg-zinc-200 rounded-md transition-colors"
           >
             Fechar
           </button>
        </div>
      </div>
    </div>
  );
}
