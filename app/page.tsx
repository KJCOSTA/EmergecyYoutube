"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Film,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Settings,
  TrendingUp,
  Video,
  Wifi,
  WifiOff,
  XCircle,
  Zap,
  BarChart3,
  Eye,
  Calendar,
} from 'lucide-react';
import { useUIStore, useBrandingStore } from '@/lib/store';

interface APIStatus {
  name: string;
  key: string;
  status: 'checking' | 'online' | 'offline' | 'error';
  icon: string;
  category: 'ai' | 'media' | 'output' | 'infra';
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  onlineAPIs: number;
  totalAPIs: number;
  lastCheck: Date;
}

const API_LIST: Omit<APIStatus, 'status'>[] = [
  { name: 'Gemini', key: 'gemini', icon: '🧠', category: 'ai' },
  { name: 'OpenAI', key: 'openai', icon: '🤖', category: 'ai' },
  { name: 'Anthropic', key: 'anthropic', icon: '🔮', category: 'ai' },
  { name: 'YouTube', key: 'youtube', icon: '📺', category: 'output' },
  { name: 'Pexels', key: 'pexels', icon: '📷', category: 'media' },
  { name: 'Pixabay', key: 'pixabay', icon: '🖼️', category: 'media' },
  { name: 'ElevenLabs', key: 'elevenlabs', icon: '🎤', category: 'media' },
  { name: 'Tavily', key: 'tavily', icon: '🔍', category: 'ai' },
  { name: 'JSON2Video', key: 'json2video', icon: '🎬', category: 'output' },
  { name: 'GitHub', key: 'github', icon: '🐙', category: 'infra' },
  { name: 'Vercel', key: 'vercel', icon: '▲', category: 'infra' },
];

export default function MissionControlPage() {
  const router = useRouter();
  const { openApiKeyModal } = useUIStore();
  const { systemName } = useBrandingStore();

  const [isLoading, setIsLoading] = useState(true);
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    onlineAPIs: 0,
    totalAPIs: API_LIST.length,
    lastCheck: new Date(),
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    setIsLoading(true);

    const statuses: APIStatus[] = API_LIST.map(api => ({
      ...api,
      status: 'checking' as const,
    }));
    setApiStatuses(statuses);

    try {
      const response = await fetch('/api/status');
      const data = await response.json();

      const updatedStatuses: APIStatus[] = API_LIST.map((api) => ({
        ...api,
        status: data[api.key] === true ? 'online' : 'offline',
      }));

      setApiStatuses(updatedStatuses);

      const onlineCount = updatedStatuses.filter(s => s.status === 'online').length;
      const healthStatus: 'healthy' | 'degraded' | 'critical' =
        onlineCount === API_LIST.length ? 'healthy' :
        onlineCount >= API_LIST.length * 0.5 ? 'degraded' : 'critical';

      setSystemHealth({
        overall: healthStatus,
        onlineAPIs: onlineCount,
        totalAPIs: API_LIST.length,
        lastCheck: new Date(),
      });
    } catch {
      const errorStatuses: APIStatus[] = API_LIST.map(api => ({
        ...api,
        status: 'error' as const,
      }));
      setApiStatuses(errorStatuses);
      setSystemHealth({
        overall: 'critical',
        onlineAPIs: 0,
        totalAPIs: API_LIST.length,
        lastCheck: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    await checkSystemStatus();
    setIsRefreshing(false);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-success';
      case 'degraded': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-foreground-muted';
    }
  };

  const getHealthBg = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-success/10 border-success/30';
      case 'degraded': return 'bg-warning/10 border-warning/30';
      case 'critical': return 'bg-error/10 border-error/30';
      default: return 'bg-layer-2 border-border-subtle';
    }
  };

  const categorizedAPIs = {
    ai: apiStatuses.filter(a => a.category === 'ai'),
    media: apiStatuses.filter(a => a.category === 'media'),
    output: apiStatuses.filter(a => a.category === 'output'),
    infra: apiStatuses.filter(a => a.category === 'infra'),
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-cyan-blue flex items-center justify-center shadow-glow-sm">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {systemName}
              </h1>
            </div>
            <p className="text-foreground-muted">
              Mission Control — Centro de Comando
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshStatus}
              disabled={isRefreshing}
              className="btn-secondary btn-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <button
              onClick={() => router.push('/workflow')}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              Nova Produção
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - System Health + APIs */}
        <div className="lg:col-span-2 space-y-6">
          {/* System Health Card */}
          <div className={`card p-6 border ${getHealthBg(systemHealth.overall)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  systemHealth.overall === 'healthy' ? 'bg-success status-dot-pulse' :
                  systemHealth.overall === 'degraded' ? 'bg-warning' : 'bg-error'
                }`} />
                <h2 className="text-lg font-semibold text-foreground">
                  Status do Sistema
                </h2>
              </div>
              <span className={`badge ${
                systemHealth.overall === 'healthy' ? 'badge-success' :
                systemHealth.overall === 'degraded' ? 'badge-warning' : 'badge-error'
              }`}>
                {systemHealth.overall === 'healthy' ? 'Operacional' :
                 systemHealth.overall === 'degraded' ? 'Degradado' : 'Crítico'}
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-layer-1 rounded-xl">
                  <div className="text-3xl font-bold text-foreground">
                    {systemHealth.onlineAPIs}
                  </div>
                  <div className="text-xs text-foreground-muted mt-1">APIs Online</div>
                </div>
                <div className="text-center p-4 bg-layer-1 rounded-xl">
                  <div className="text-3xl font-bold text-foreground">
                    {systemHealth.totalAPIs - systemHealth.onlineAPIs}
                  </div>
                  <div className="text-xs text-foreground-muted mt-1">APIs Offline</div>
                </div>
                <div className="text-center p-4 bg-layer-1 rounded-xl">
                  <div className="text-3xl font-bold text-foreground">
                    {Math.round((systemHealth.onlineAPIs / systemHealth.totalAPIs) * 100)}%
                  </div>
                  <div className="text-xs text-foreground-muted mt-1">Disponibilidade</div>
                </div>
                <div className="text-center p-4 bg-layer-1 rounded-xl">
                  <div className="text-sm font-medium text-foreground">
                    {systemHealth.lastCheck.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-foreground-muted mt-1">Última Verificação</div>
                </div>
              </div>
            )}
          </div>

          {/* APIs by Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* AI Providers */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-violet-400" />
                <h3 className="font-medium text-foreground">Provedores IA</h3>
              </div>
              <div className="space-y-2">
                {categorizedAPIs.ai.map(api => (
                  <APIStatusRow key={api.key} api={api} onConfigure={openApiKeyModal} />
                ))}
              </div>
            </div>

            {/* Media */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-4 h-4 text-cyan-400" />
                <h3 className="font-medium text-foreground">Mídia</h3>
              </div>
              <div className="space-y-2">
                {categorizedAPIs.media.map(api => (
                  <APIStatusRow key={api.key} api={api} onConfigure={openApiKeyModal} />
                ))}
              </div>
            </div>

            {/* Output */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-4 h-4 text-rose-400" />
                <h3 className="font-medium text-foreground">Output</h3>
              </div>
              <div className="space-y-2">
                {categorizedAPIs.output.map(api => (
                  <APIStatusRow key={api.key} api={api} onConfigure={openApiKeyModal} />
                ))}
              </div>
            </div>

            {/* Infrastructure */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="font-medium text-foreground">Infraestrutura</h3>
              </div>
              <div className="space-y-2">
                {categorizedAPIs.infra.map(api => (
                  <APIStatusRow key={api.key} api={api} onConfigure={openApiKeyModal} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions + Recent */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Ações Rápidas
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/workflow')}
                className="w-full btn-primary justify-start"
              >
                <Play className="w-4 h-4" />
                Iniciar Nova Produção
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>

              <button
                onClick={openApiKeyModal}
                className="w-full btn-secondary justify-start"
              >
                <Settings className="w-4 h-4" />
                Configurar APIs
              </button>

              <button
                onClick={() => router.push('/documentation')}
                className="w-full btn-outline justify-start"
              >
                <Eye className="w-4 h-4" />
                Ver Documentação
              </button>
            </div>
          </div>

          {/* Alerts */}
          {systemHealth.overall !== 'healthy' && (
            <div className="card p-6 border border-warning/30 bg-warning/5">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Alertas
              </h2>
              <div className="space-y-3">
                {apiStatuses.filter(a => a.status === 'offline').map(api => (
                  <div key={api.key} className="flex items-center justify-between p-3 bg-layer-1 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>{api.icon}</span>
                      <span className="text-sm text-foreground">{api.name}</span>
                    </div>
                    <span className="badge-error text-xs">Offline</span>
                  </div>
                ))}
                <button
                  onClick={openApiKeyModal}
                  className="w-full btn-outline btn-sm mt-2"
                >
                  Configurar APIs Offline
                </button>
              </div>
            </div>
          )}

          {/* Recent Activity Placeholder */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-foreground-muted" />
              Atividade Recente
            </h2>
            <div className="text-center py-8 text-foreground-muted">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma produção recente</p>
              <button
                onClick={() => router.push('/workflow')}
                className="btn-ghost btn-sm mt-4"
              >
                Criar primeira produção
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-foreground-muted" />
              Estatísticas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">0</div>
                <div className="text-xs text-foreground-muted">Vídeos Criados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">0</div>
                <div className="text-xs text-foreground-muted">Em Progresso</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      {systemHealth.overall === 'healthy' && !isLoading && (
        <div className="mt-8 card-glass p-6 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 to-blue-950/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-cyan-blue flex items-center justify-center shadow-glow-sm">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Sistema 100% Operacional
                </h3>
                <p className="text-sm text-foreground-muted">
                  Todas as APIs conectadas. Pronto para produção de vídeos.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/workflow')}
              className="btn-primary btn-lg whitespace-nowrap"
            >
              <Rocket className="w-5 h-5" />
              Iniciar Produção
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// API Status Row Component
function APIStatusRow({ api, onConfigure }: { api: APIStatus; onConfigure: () => void }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-layer-1 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-base">{api.icon}</span>
        <span className="text-sm text-foreground">{api.name}</span>
      </div>
      {api.status === 'checking' ? (
        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
      ) : api.status === 'online' ? (
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-success" />
          <span className="text-xs text-success">Online</span>
        </div>
      ) : (
        <button
          onClick={onConfigure}
          className="flex items-center gap-1.5 text-xs text-error hover:text-error/80 transition-colors"
        >
          <WifiOff className="w-3.5 h-3.5" />
          Offline
        </button>
      )}
    </div>
  );
}
