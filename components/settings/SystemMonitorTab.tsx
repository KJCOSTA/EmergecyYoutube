"use client";

import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Cpu, Clock, Server, CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react';
import type { SystemMonitorData } from '@/types';

export function SystemMonitorTab() {
  const [data, setData] = useState<SystemMonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadHealthData();

    // Auto-refresh every 30 seconds
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadHealthData();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadHealthData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/system/health');
      if (response.ok) {
        const healthData = await response.json();
        setData(healthData);
        setLastUpdate(new Date());
      } else {
        console.error('Failed to fetch health data');
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'offline':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 text-zinc-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Activity className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Monitor do Sistema</h2>
            <p className="text-sm text-zinc-400">
              Acompanhe a saúde da aplicação e status das APIs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
            />
            Auto-refresh (30s)
          </label>

          <button
            onClick={loadHealthData}
            disabled={loading}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {lastUpdate && (
        <div className="text-xs text-zinc-500">
          Última atualização: {lastUpdate.toLocaleString('pt-BR')}
        </div>
      )}

      {data && (
        <>
          {/* System Metrics */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-zinc-400" />
              Métricas do Sistema
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Memory Usage */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-zinc-400">Memória RSS</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatBytes(data.system.memory.rss)}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Heap: {formatBytes(data.system.memory.heapUsed)} /{' '}
                  {formatBytes(data.system.memory.heapTotal)}
                </p>
              </div>

              {/* Uptime */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-zinc-400">Uptime</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatUptime(data.system.uptime)}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Tempo ativo do processo</p>
              </div>

              {/* Node Version */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-medium text-zinc-400">Node.js</span>
                </div>
                <p className="text-2xl font-bold text-white">{data.system.nodeVersion}</p>
                <p className="text-xs text-zinc-500 mt-1">Versão do runtime</p>
              </div>

              {/* Platform */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-zinc-400">Plataforma</span>
                </div>
                <p className="text-2xl font-bold text-white capitalize">
                  {data.system.platform}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Sistema operacional</p>
              </div>
            </div>
          </div>

          {/* API Status */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-400" />
              Status das APIs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.apis.map((api, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-4 ${getStatusColor(api.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(api.status)}
                      <div>
                        <p className="font-semibold">{api.name}</p>
                        {api.responseTime && (
                          <p className="text-xs opacity-80 mt-0.5">
                            {api.responseTime}ms
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-black/20">
                      {api.status}
                    </span>
                  </div>

                  {api.error && (
                    <p className="text-xs mt-2 opacity-70">{api.error}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">
              Informações Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-500">Memória Externa:</span>
                <span className="text-white ml-2 font-mono">
                  {formatBytes(data.system.memory.external)}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">Timestamp:</span>
                <span className="text-white ml-2 font-mono">
                  {new Date(data.system.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
