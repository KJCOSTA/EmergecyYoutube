"use client";

import { useState, useEffect } from 'react';
import ConnectApisModal from '@/components/ConnectApisModal';
import { Upload, Youtube, Wifi, FileText, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import { useAPIKeysStore } from '@/lib/api-keys-store';

export default function InputPage() {
  const [showModal, setShowModal] = useState(false);
  const [serverStatus, setServerStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { keys: localKeys } = useAPIKeysStore();

  useEffect(() => {
    setMounted(true);
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setServerStatus(data);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    } finally {
      setLoading(false);
    }
  };

  const isYoutubeConnected = serverStatus.youtube || (mounted && !!localKeys.youtube_api_key && localKeys.youtube_api_key.length > 5);
  
  const isAIConnected = 
    serverStatus.openai || (mounted && !!localKeys.openai_api_key) ||
    serverStatus.gemini || (mounted && !!localKeys.google_api_key) ||
    serverStatus.anthropic || (mounted && !!localKeys.anthropic_api_key);

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Menu de Entrada</h1>
          <p className="text-zinc-400 mt-1">Configure o contexto inicial para a produção do seu vídeo.</p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className={`px-5 py-2.5 rounded-lg font-semibold shadow-lg flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap cursor-pointer hover:ring-2 ${
            isYoutubeConnected && isAIConnected 
              ? "bg-green-600 hover:bg-green-500 text-white shadow-green-500/20 hover:ring-green-500/50" 
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:ring-indigo-500/50"
          }`}
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
          {isYoutubeConnected && isAIConnected ? "Conexões Ativas" : "Conectar APIs"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all group">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Upload className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Upload de Métricas</h3>
              <p className="text-xs text-zinc-500">Dados históricos do canal (CSV)</p>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-zinc-800 rounded-xl h-40 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all cursor-pointer">
            <div className="p-3 bg-zinc-800 rounded-full mb-3 shadow-inner">
              <FileText className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="font-medium text-zinc-300">Arraste o arquivo aqui</p>
          </div>
        </div>

        <div className={`border rounded-xl p-6 transition-all group ${isYoutubeConnected ? 'bg-green-900/10 border-green-900/30' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 rounded-lg transition-colors ${isYoutubeConnected ? 'bg-green-500/20' : 'bg-red-500/10'}`}>
              <Youtube className={`w-5 h-5 ${isYoutubeConnected ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Sincronização</h3>
              <p className="text-xs text-zinc-500">Conexão em tempo real</p>
            </div>
            {isYoutubeConnected && (
               <span className="ml-auto bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 animate-in fade-in zoom-in">
                 <CheckCircle2 className="w-3 h-3" /> ATIVO
               </span>
            )}
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl h-40 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {isYoutubeConnected ? (
              <div className="z-10 flex flex-col items-center gap-3 animate-in slide-in-from-bottom-2">
                 <div className="p-3 bg-green-500/10 rounded-full mb-1 border border-green-500/20">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                 </div>
                 <p className="text-green-400 font-medium">Canal Sincronizado</p>
                 <p className="text-zinc-500 text-xs">Pronto para gerar conteúdo</p>
              </div>
            ) : (
              <div className="z-10 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-zinc-300">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">API Necessária</span>
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md border border-zinc-700 transition-colors cursor-pointer"
                >
                  Configurar Acesso
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">Definição de Tema</h3>
            <p className="text-xs text-zinc-500">O que vamos criar hoje?</p>
          </div>
        </div>
        
        <input 
          type="text" 
          placeholder="Ex: Oração da Manhã, Notícias sobre IA, Review de Tech..." 
          className="w-full bg-black/50 border border-zinc-700 rounded-xl py-4 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
        />
      </div>

      <ConnectApisModal isOpen={showModal} onClose={() => { setShowModal(false); checkServerStatus(); }} />
    </div>
  );
}
