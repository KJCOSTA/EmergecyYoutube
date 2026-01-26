"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Film,
  Loader2,
  Play,
  Rocket,
  Settings,
  Sparkles,
  TrendingUp,
  Video,
  Wifi,
  WifiOff,
  Zap,
  Eye,
  BarChart3,
  Code2,
  Server,
  Brain,
  FlaskConical,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
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

// Mock chart data for API availability trends (last 7 checks)
const generateChartData = (currentPercentage: number) => {
  const data = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 10 * 60 * 1000); // 10 min intervals
    const variance = Math.random() * 20 - 10; // ±10%
    const availability = Math.max(60, Math.min(100, currentPercentage + variance));

    data.push({
      time: time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      availability: Math.round(availability),
    });
  }

  return data;
};

export default function DashboardPage() {
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
  const [chartData, setChartData] = useState<Array<{ time: string; availability: number }>>([]);

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

      // Generate chart data based on current availability
      const currentAvailability = Math.round((onlineCount / API_LIST.length) * 100);
      setChartData(generateChartData(currentAvailability));
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

  const categorizedAPIs = {
    ai: apiStatuses.filter(a => a.category === 'ai'),
    media: apiStatuses.filter(a => a.category === 'media'),
    output: apiStatuses.filter(a => a.category === 'output'),
    infra: apiStatuses.filter(a => a.category === 'infra'),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-full pb-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30"
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">
                  {systemName}
                </h1>
                <p className="text-foreground-muted flex items-center gap-2">
                  <span>Mission Control</span>
                  <span className="text-foreground-muted/50">•</span>
                  <span className="text-cyan-400 font-medium">AI-Powered Production</span>
                </p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/workflow')}
            className="relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white font-semibold shadow-glow-lg shadow-cyan-500/50 hover:shadow-glow-lg hover:shadow-cyan-400/70 transition-all duration-300 overflow-hidden group active:scale-95 border border-cyan-400/30 hover:border-cyan-300/60"
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <span className="relative z-10 flex items-center gap-2">
              <Rocket className="w-5 h-5 drop-shadow-glow" />
              Nova Produção
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform drop-shadow-glow" />
            </span>

            {/* Pulsing glow background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Actions CTAs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Quick Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/30 p-6 group hover:border-green-400/60 hover:shadow-glow-lg hover:shadow-green-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Quick Video</h3>
                  <p className="text-xs text-muted">Automático · 3-5 min</p>
                </div>
              </div>
              <p className="text-sm text-foreground-muted mb-4">
                Gere vídeos curtos automaticamente. Zero configuração, máxima velocidade.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/quick-video')}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-400/70 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Gerar Agora
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Ultra-Fast V2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 border-2 border-purple-500/30 p-6 group hover:border-purple-400/60 hover:shadow-glow-lg hover:shadow-purple-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Ultra-Fast</h3>
                  <p className="text-xs text-muted">Controlado · 10-15 min</p>
                </div>
              </div>
              <p className="text-sm text-foreground-muted mb-4">
                Vídeos de 9 minutos com controle total. Edite roteiro, escolha mídia, configure tudo.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/ultra-fast')}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-400/70 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Criar Vídeo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-4"
      >
        {/* System Health - Large Card (Spans 8 cols) */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-layer-2/50 backdrop-blur-xl border-2 border-cyan-500/20 p-6 h-full group hover:border-cyan-400/60 hover:shadow-glow-lg hover:shadow-cyan-500/50 transition-all duration-300">
            {/* Animated gradient mesh background */}
            <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

            {/* Glow overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-shimmer" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-400/50 flex items-center justify-center shadow-glow-sm shadow-cyan-500/50 group-hover:shadow-glow-md group-hover:shadow-cyan-400/70 transition-shadow duration-300">
                    <Activity className="w-5 h-5 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Status do Sistema</h2>
                    <p className="text-sm text-foreground-muted">Monitoramento em tempo real</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  systemHealth.overall === 'healthy'
                    ? 'bg-success/10 border border-success/20'
                    : systemHealth.overall === 'degraded'
                    ? 'bg-warning/10 border border-warning/20'
                    : 'bg-error/10 border border-error/20'
                }`}>
                  <div className="relative w-2 h-2">
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                      systemHealth.overall === 'healthy' ? 'bg-success' :
                      systemHealth.overall === 'degraded' ? 'bg-warning' : 'bg-error'
                    }`} />
                    <div className={`relative w-2 h-2 rounded-full ${
                      systemHealth.overall === 'healthy' ? 'bg-success' :
                      systemHealth.overall === 'degraded' ? 'bg-warning' : 'bg-error'
                    }`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    systemHealth.overall === 'healthy' ? 'text-success' :
                    systemHealth.overall === 'degraded' ? 'text-warning' : 'text-error'
                  }`}>
                    {systemHealth.overall === 'healthy' ? 'Operacional' :
                     systemHealth.overall === 'degraded' ? 'Degradado' : 'Crítico'}
                  </span>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard
                    label="APIs Online"
                    value={systemHealth.onlineAPIs}
                    icon={<Wifi className="w-5 h-5" />}
                    color="cyan"
                  />
                  <StatCard
                    label="APIs Offline"
                    value={systemHealth.totalAPIs - systemHealth.onlineAPIs}
                    icon={<WifiOff className="w-5 h-5" />}
                    color="rose"
                  />
                  <StatCard
                    label="Disponibilidade"
                    value={`${Math.round((systemHealth.onlineAPIs / systemHealth.totalAPIs) * 100)}%`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="emerald"
                  />
                  <StatCard
                    label="Última Check"
                    value={systemHealth.lastCheck.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    icon={<Clock className="w-5 h-5" />}
                    color="violet"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions - Vertical Card (Spans 4 cols) */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-4"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950/40 via-violet-950/30 to-layer-2/50 backdrop-blur-xl border-2 border-purple-500/20 p-6 h-full group hover:border-purple-400/60 hover:shadow-glow-lg hover:shadow-purple-500/50 transition-all duration-300">
            {/* Animated gradient mesh */}
            <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

            {/* Glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-shimmer" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/50 flex items-center justify-center shadow-glow-sm shadow-purple-500/50 group-hover:shadow-glow-md group-hover:shadow-purple-400/70 transition-shadow duration-300">
                  <Zap className="w-5 h-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
                </div>
                <h2 className="text-lg font-semibold text-white">Ações Rápidas</h2>
              </div>

              <div className="space-y-3">
                <ActionButton
                  icon={<Play className="w-4 h-4" />}
                  label="Iniciar Produção"
                  description="Novo workflow de vídeo"
                  onClick={() => router.push('/workflow')}
                  gradient="from-cyan-500 to-blue-500"
                />
                <ActionButton
                  icon={<Settings className="w-4 h-4" />}
                  label="Configurar APIs"
                  description="Gerenciar integrações"
                  onClick={openApiKeyModal}
                  gradient="from-violet-500 to-purple-500"
                />
                <ActionButton
                  icon={<Eye className="w-4 h-4" />}
                  label="Documentação"
                  description="Guias e referências"
                  onClick={() => router.push('/documentation')}
                  gradient="from-emerald-500 to-green-500"
                />
                <ActionButton
                  icon={<FlaskConical className="w-4 h-4" />}
                  label="Testes de Diagnóstico"
                  description="Validar DB e APIs"
                  onClick={() => router.push('/test')}
                  gradient="from-amber-500 to-orange-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Providers */}
        <APICard
          title="Provedores IA"
          icon={<Brain className="w-5 h-5 text-violet-400" />}
          apis={categorizedAPIs.ai}
          onConfigure={openApiKeyModal}
          color="violet"
        />

        {/* Media APIs */}
        <APICard
          title="Mídia"
          icon={<Film className="w-5 h-5 text-cyan-400" />}
          apis={categorizedAPIs.media}
          onConfigure={openApiKeyModal}
          color="cyan"
        />

        {/* Output */}
        <APICard
          title="Output"
          icon={<Video className="w-5 h-5 text-rose-400" />}
          apis={categorizedAPIs.output}
          onConfigure={openApiKeyModal}
          color="rose"
        />

        {/* Infrastructure */}
        <APICard
          title="Infraestrutura"
          icon={<Server className="w-5 h-5 text-amber-400" />}
          apis={categorizedAPIs.infra}
          onConfigure={openApiKeyModal}
          color="amber"
        />

        {/* Statistics with Chart - Wide Card */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-6"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/40 via-green-950/30 to-layer-2/50 backdrop-blur-xl border-2 border-emerald-500/20 p-6 h-full group hover:border-emerald-400/60 hover:shadow-glow-lg hover:shadow-emerald-500/50 transition-all duration-300">
            {/* Animated gradient mesh */}
            <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

            {/* Glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent animate-shimmer" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-green-500/30 border border-emerald-400/50 flex items-center justify-center shadow-glow-sm shadow-emerald-500/50 group-hover:shadow-glow-md group-hover:shadow-emerald-400/70 transition-shadow duration-300">
                    <BarChart3 className="w-5 h-5 text-emerald-300 group-hover:text-emerald-200 transition-colors" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Disponibilidade</h2>
                    <p className="text-xs text-foreground-muted">Últimos 60 minutos</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400">
                    {Math.round((systemHealth.onlineAPIs / systemHealth.totalAPIs) * 100)}%
                  </div>
                  <div className="text-xs text-foreground-muted">Uptime</div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-48"
                  >
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-48"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="availabilityGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis
                          dataKey="time"
                          stroke="#64748b"
                          fontSize={11}
                          tickLine={false}
                          axisLine={{ stroke: '#334155' }}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={11}
                          tickLine={false}
                          axisLine={{ stroke: '#334155' }}
                          domain={[0, 100]}
                          ticks={[0, 25, 50, 75, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                          labelStyle={{ color: '#94a3b8' }}
                          itemStyle={{ color: '#10b981' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="availability"
                          stroke="#10b981"
                          strokeWidth={2}
                          fill="url(#availabilityGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* System Health with Radial Chart */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-6"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-layer-2/50 backdrop-blur-xl border-2 border-blue-500/20 p-6 h-full group hover:border-blue-400/60 hover:shadow-glow-lg hover:shadow-blue-500/50 transition-all duration-300">
            {/* Animated gradient mesh */}
            <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

            {/* Glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-shimmer" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-400/50 flex items-center justify-center shadow-glow-sm shadow-blue-500/50 group-hover:shadow-glow-md group-hover:shadow-blue-400/70 transition-shadow duration-300">
                  <Code2 className="w-5 h-5 text-blue-300 group-hover:text-blue-200 transition-colors" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Saúde do Sistema</h2>
                  <p className="text-xs text-foreground-muted">Status atual das APIs</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center h-48"
                  >
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="radial"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-48 flex items-center"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="100%"
                        data={[
                          {
                            name: 'Disponibilidade',
                            value: Math.round((systemHealth.onlineAPIs / systemHealth.totalAPIs) * 100),
                            fill: systemHealth.overall === 'healthy' ? '#10b981' :
                                  systemHealth.overall === 'degraded' ? '#f59e0b' : '#ef4444',
                          },
                        ]}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar
                          background={{ fill: '#1e293b' }}
                          dataKey="value"
                          cornerRadius={10}
                        />
                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white text-4xl font-bold"
                        >
                          {Math.round((systemHealth.onlineAPIs / systemHealth.totalAPIs) * 100)}%
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <InfoRow label="Online" value={`${systemHealth.onlineAPIs}/${systemHealth.totalAPIs}`} />
                <InfoRow label="Status" value={systemHealth.overall === 'healthy' ? '✅ OK' : systemHealth.overall === 'degraded' ? '⚠️ Degradado' : '❌ Crítico'} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Banner */}
        {systemHealth.overall === 'healthy' && !isLoading && (
          <motion.div
            variants={itemVariants}
            className="col-span-12"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-cyan-500/20 p-6">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b2_1px,transparent_1px),linear-gradient(to_bottom,#0891b2_1px,transparent_1px)] bg-[size:14px_24px] opacity-5" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
                  >
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Sistema 100% Operacional
                    </h3>
                    <p className="text-sm text-foreground-muted">
                      Todas as APIs conectadas. Pronto para produção de vídeos.
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/workflow')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-shadow flex items-center gap-2 active:scale-95"
                >
                  <Rocket className="w-5 h-5" />
                  Iniciar Produção
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// Helper Components
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    rose: 'from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-400',
    emerald: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400',
    violet: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="relative overflow-hidden rounded-xl bg-layer-2/50 border border-border-subtle p-4 group cursor-default"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')} opacity-0 group-hover:opacity-100 transition-opacity`} />

      <div className="relative z-10">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')} border ${colorClasses[color as keyof typeof colorClasses].split(' ')[2]} flex items-center justify-center mb-3`}>
          <div className={colorClasses[color as keyof typeof colorClasses].split(' ')[3]}>
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-foreground-muted">{label}</div>
      </div>
    </motion.div>
  );
}

function ActionButton({ icon, label, description, onClick, gradient }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-layer-2/50 border border-border-subtle hover:border-cyan-500/30 transition-all duration-200 group text-left active:scale-95"
    >
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{label}</div>
        <div className="text-xs text-foreground-muted truncate">{description}</div>
      </div>
      <ArrowRight className="w-4 h-4 text-foreground-muted group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
    </motion.button>
  );
}

function APICard({ title, icon, apis, onConfigure, color }: {
  title: string;
  icon: React.ReactNode;
  apis: APIStatus[];
  onConfigure: () => void;
  color: string;
}) {
  const colorClasses = {
    violet: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 violet-500/5',
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 cyan-500/5',
    rose: 'from-rose-500/20 to-red-500/20 border-rose-500/30 rose-500/5',
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 amber-500/5',
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 100,
          },
        },
      }}
      className="col-span-12 sm:col-span-6 lg:col-span-3"
    >
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-layer-1/80 to-layer-2/50 backdrop-blur-xl border border-border-subtle p-5 h-full group hover:border-${color}-500/30 transition-all duration-300`}>
        <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')} border ${colorClasses[color as keyof typeof colorClasses].split(' ')[2]} flex items-center justify-center`}>
              {icon}
            </div>
            <h3 className="font-medium text-white text-sm">{title}</h3>
          </div>

          <div className="space-y-2">
            {apis.map(api => (
              <APIRow key={api.key} api={api} onConfigure={onConfigure} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function APIRow({ api, onConfigure }: { api: APIStatus; onConfigure: () => void }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-layer-2/50 transition-colors group/row">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm">{api.icon}</span>
        <span className="text-xs text-foreground truncate">{api.name}</span>
      </div>
      {api.status === 'checking' ? (
        <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin flex-shrink-0" />
      ) : api.status === 'online' ? (
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-xs text-success">On</span>
        </div>
      ) : (
        <button
          onClick={onConfigure}
          className="text-xs text-error hover:text-error/80 transition-colors flex-shrink-0"
        >
          Off
        </button>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-layer-2/30 border border-border-subtle">
      <span className="text-sm text-foreground-muted">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
