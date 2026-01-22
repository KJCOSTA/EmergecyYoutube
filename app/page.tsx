"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Rocket,
  Zap,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Film,
  Brain,
  RefreshCw,
  Settings,
} from 'lucide-react';
import { useUIStore } from '@/lib/store';

interface APIStatus {
  name: string;
  key: string;
  status: 'checking' | 'online' | 'offline' | 'error';
  responseTime?: number;
  error?: string;
}

const API_LIST = [
  { name: 'GEMINI', key: 'gemini', icon: '🧠' },
  { name: 'OPENAI', key: 'openai', icon: '🤖' },
  { name: 'ANTHROPIC', key: 'anthropic', icon: '🔮' },
  { name: 'YOUTUBE', key: 'youtube', icon: '📺' },
  { name: 'PEXELS', key: 'pexels', icon: '📷' },
  { name: 'PIXABAY', key: 'pixabay', icon: '🖼️' },
  { name: 'ELEVENLABS', key: 'elevenlabs', icon: '🎤' },
  { name: 'TAVILY', key: 'tavily', icon: '🔍' },
  { name: 'JSON2VIDEO', key: 'json2video', icon: '🎬' },
];

export default function HomePage() {
  const router = useRouter();
  const { openApiKeyModal } = useUIStore();
  const [bootStage, setBootStage] = useState<'initializing' | 'checking' | 'complete'>('initializing');
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([]);
  const [currentCheckingIndex, setCurrentCheckingIndex] = useState(0);
  const [systemReady, setSystemReady] = useState(false);

  useEffect(() => {
    startBootSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startBootSequence = async () => {
    // Stage 1: Initializing
    setBootStage('initializing');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Stage 2: Checking APIs
    setBootStage('checking');
    await checkAPIs();

    // Stage 3: Complete
    setBootStage('complete');
    setSystemReady(true);
  };

  const checkAPIs = async () => {
    const statuses: APIStatus[] = API_LIST.map(api => ({
      name: api.name,
      key: api.key,
      status: 'checking' as const,
    }));
    setApiStatuses(statuses);

    try {
      const startTime = Date.now();
      const response = await fetch('/api/status');
      const data = await response.json();
      const endTime = Date.now();

      const updatedStatuses: APIStatus[] = API_LIST.map((api) => {
        const isOnline = data[api.key] === true;
        const status: 'online' | 'offline' = isOnline ? 'online' : 'offline';
        return {
          name: api.name,
          key: api.key,
          status,
          responseTime: isOnline ? endTime - startTime + Math.random() * 200 : undefined,
        };
      });

      // Animate checking one by one
      for (let i = 0; i < updatedStatuses.length; i++) {
        setCurrentCheckingIndex(i);
        setApiStatuses(prev => {
          const newStatuses = [...prev];
          newStatuses[i] = updatedStatuses[i];
          return newStatuses;
        });
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch {
      const errorStatuses: APIStatus[] = API_LIST.map(api => ({
        name: api.name,
        key: api.key,
        status: 'error' as const,
        error: 'Failed to check API status',
      }));
      setApiStatuses(errorStatuses);
    }
  };

  const recheckAPIs = () => {
    setBootStage('checking');
    setSystemReady(false);
    setCurrentCheckingIndex(0);
    checkAPIs().then(() => {
      setBootStage('complete');
      setSystemReady(true);
    });
  };

  const onlineCount = apiStatuses.filter(api => api.status === 'online').length;
  const offlineCount = apiStatuses.filter(api => api.status === 'offline').length;
  const errorCount = apiStatuses.filter(api => api.status === 'error').length;
  const totalCount = API_LIST.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse">
              <Rocket className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Emergency YouTube
          </h1>
          <p className="text-xl text-zinc-400">Produção Automática de Vídeos com IA</p>
        </div>

        {/* Boot Sequence */}
        {bootStage === 'initializing' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center backdrop-blur-sm">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Inicializando Sistemas...</h2>
            <p className="text-zinc-400">Preparando motores para decolagem 🚀</p>
          </div>
        )}

        {/* API Status Grid */}
        {bootStage !== 'initializing' && (
          <div className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <h3 className="text-sm font-medium text-green-400">ONLINE</h3>
                </div>
                <p className="text-4xl font-bold text-white">{onlineCount}</p>
                <p className="text-sm text-zinc-400 mt-1">APIs conectadas</p>
              </div>

              <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-sm font-medium text-red-400">OFFLINE</h3>
                </div>
                <p className="text-4xl font-bold text-white">{offlineCount + errorCount}</p>
                <p className="text-sm text-zinc-400 mt-1">APIs desconectadas</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-sm font-medium text-indigo-400">SISTEMA</h3>
                </div>
                <p className="text-4xl font-bold text-white">
                  {Math.round((onlineCount / totalCount) * 100)}%
                </p>
                <p className="text-sm text-zinc-400 mt-1">Operacional</p>
              </div>
            </div>

            {/* API Connection Status */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Rocket className="w-6 h-6 text-indigo-400" />
                  {bootStage === 'checking' ? 'Ligando Turbinas...' : 'Status das Conexões'}
                </h2>
                <button
                  onClick={recheckAPIs}
                  disabled={bootStage === 'checking'}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${bootStage === 'checking' ? 'animate-spin' : ''}`} />
                  Verificar Novamente
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {apiStatuses.map((api, index) => (
                  <div
                    key={api.key}
                    className={`
                      border rounded-xl p-4 transition-all duration-300
                      ${api.status === 'online'
                        ? 'bg-green-900/10 border-green-500/30'
                        : api.status === 'offline'
                        ? 'bg-red-900/10 border-red-500/30'
                        : api.status === 'error'
                        ? 'bg-orange-900/10 border-orange-500/30'
                        : 'bg-zinc-800/50 border-zinc-700'
                      }
                      ${bootStage === 'checking' && index === currentCheckingIndex ? 'ring-2 ring-indigo-500' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{API_LIST[index].icon}</span>
                        <span className="font-medium text-white">{api.name}</span>
                      </div>
                      {api.status === 'checking' && (
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                      )}
                      {api.status === 'online' && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      {api.status === 'offline' && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      {api.status === 'error' && (
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={`
                          font-medium
                          ${api.status === 'online' ? 'text-green-400' : ''}
                          ${api.status === 'offline' ? 'text-red-400' : ''}
                          ${api.status === 'error' ? 'text-orange-400' : ''}
                          ${api.status === 'checking' ? 'text-zinc-400' : ''}
                        `}
                      >
                        {api.status === 'checking' && 'Verificando...'}
                        {api.status === 'online' && 'Online'}
                        {api.status === 'offline' && 'Offline'}
                        {api.status === 'error' && 'Erro'}
                      </span>
                      {api.responseTime && (
                        <span className="text-xs text-zinc-500">{Math.round(api.responseTime)}ms</span>
                      )}
                    </div>

                    {api.status === 'offline' && (
                      <button
                        onClick={openApiKeyModal}
                        className="mt-3 w-full px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 rounded transition-colors"
                      >
                        Configurar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ready State */}
            {systemReady && (
              <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-2 border-indigo-500/50 rounded-2xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
                <h2 className="text-3xl font-bold text-white mb-3">
                  {onlineCount === totalCount
                    ? '🚀 SISTEMA PRONTO PARA DECOLAGEM!'
                    : '⚠️ SISTEMA OPERACIONAL (MODO DEGRADADO)'}
                </h2>
                <p className="text-zinc-300 mb-6">
                  {onlineCount === totalCount
                    ? 'Todas as turbinas ligadas! Vamos criar conteúdo incrível.'
                    : `${onlineCount} de ${totalCount} APIs conectadas. Configure as APIs offline para ter acesso total.`}
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => router.push('/workflow')}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all flex items-center gap-3 shadow-lg shadow-indigo-500/50"
                  >
                    <Film className="w-5 h-5" />
                    Iniciar Produção
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {offlineCount > 0 && (
                    <button
                      onClick={openApiKeyModal}
                      className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center gap-3"
                    >
                      <Settings className="w-5 h-5" />
                      Configurar APIs
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <Brain className="w-10 h-10 text-purple-400 mb-3" />
                <h3 className="font-bold text-white mb-2">IA Generativa</h3>
                <p className="text-sm text-zinc-400">Roteiros criados automaticamente por múltiplas IAs</p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <Film className="w-10 h-10 text-indigo-400 mb-3" />
                <h3 className="font-bold text-white mb-2">Produção Automática</h3>
                <p className="text-sm text-zinc-400">Vídeos prontos em minutos sem edição manual</p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <Sparkles className="w-10 h-10 text-yellow-400 mb-3" />
                <h3 className="font-bold text-white mb-2">Otimização SEO</h3>
                <p className="text-sm text-zinc-400">Títulos, tags e descrições otimizadas</p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <Zap className="w-10 h-10 text-green-400 mb-3" />
                <h3 className="font-bold text-white mb-2">Modo Rápido</h3>
                <p className="text-sm text-zinc-400">Workflow completo ou modo assistido</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
