"use client";

import { useState, useEffect, useCallback } from 'react';
import { Terminal, GitCommit, Globe, Search, Trash2, RefreshCw, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { getLogs, clearLogs, searchSystemLogs } from '@/app/actions/settings';
import { fetchGitHubCommits } from '@/app/actions/github';
import { fetchVercelDeployments } from '@/app/actions/vercel';
import type { SystemLog, GitHubCommit, VercelDeployment, LogLevel } from '@/types';

type LogsTabView = 'system' | 'git' | 'vercel';

export function LogsTab() {
  const [activeView, setActiveView] = useState<LogsTabView>('system');
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [gitCommits, setGitCommits] = useState<GitHubCommit[]>([]);
  const [vercelDeployments, setVercelDeployments] = useState<VercelDeployment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (activeView === 'system') {
        const logs = await getLogs(100);
        setSystemLogs(logs);
      } else if (activeView === 'git') {
        const { commits, error } = await fetchGitHubCommits(50);
        if (error) {
          setError(error);
        } else {
          setGitCommits(commits);
        }
      } else if (activeView === 'vercel') {
        const { deployments, error } = await fetchVercelDeployments(50);
        if (error) {
          setError(error);
        } else {
          setVercelDeployments(deployments);
        }
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [activeView]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || activeView !== 'system') return;

    setLoading(true);
    try {
      const results = await searchSystemLogs(searchQuery);
      setSystemLogs(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('Tem certeza que deseja limpar todos os logs do sistema?')) return;

    try {
      await clearLogs();
      setSystemLogs([]);
      alert('Logs limpos com sucesso!');
    } catch (err) {
      console.error('Failed to clear logs:', err);
      alert('Erro ao limpar logs');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadData();
  };

  const getLogLevelStyles = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/20',
          icon: AlertCircle,
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/20',
          icon: AlertTriangle,
        };
      case 'success':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          border: 'border-green-500/20',
          icon: CheckCircle2,
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/20',
          icon: Info,
        };
    }
  };

  const getDeploymentStateStyles = (state: string) => {
    switch (state) {
      case 'READY':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          label: 'Pronto',
        };
      case 'ERROR':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          label: 'Erro',
        };
      case 'BUILDING':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          label: 'Construindo',
        };
      case 'QUEUED':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          label: 'Na Fila',
        };
      default:
        return {
          bg: 'bg-zinc-500/10',
          text: 'text-zinc-400',
          label: state,
        };
    }
  };

  const formatTimestamp = (timestamp: string | number) => {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Terminal className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Logs & Atividades</h2>
            <p className="text-sm text-zinc-400">Monitore o sistema, commits e deployments</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          {activeView === 'system' && systemLogs.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm flex items-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Logs
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800">
        <button
          onClick={() => setActiveView('system')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeView === 'system'
              ? 'text-emerald-400'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Logs do Sistema
          </div>
          {activeView === 'system' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          )}
        </button>
        <button
          onClick={() => setActiveView('git')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeView === 'git'
              ? 'text-emerald-400'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4" />
            Commits GitHub
          </div>
          {activeView === 'git' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          )}
        </button>
        <button
          onClick={() => setActiveView('vercel')}
          className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
            activeView === 'vercel'
              ? 'text-emerald-400'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Deployments Vercel
          </div>
          {activeView === 'vercel' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          )}
        </button>
      </div>

      {/* Search Bar (System Logs only) */}
      {activeView === 'system' && (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Pesquisar nos logs..."
              className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || loading}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buscar
          </button>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all"
            >
              Limpar
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-400 mb-1">Erro ao carregar dados</h4>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-zinc-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {/* System Logs View */}
          {activeView === 'system' && (
            <div className="space-y-2">
              {systemLogs.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
                  <Terminal className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">Nenhum log encontrado</p>
                </div>
              ) : (
                systemLogs.map((log) => {
                  const styles = getLogLevelStyles(log.level);
                  const Icon = styles.icon;

                  return (
                    <div
                      key={log.id}
                      className={`bg-zinc-900/50 border ${styles.border} rounded-lg p-4 hover:bg-zinc-900 transition-all`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${styles.bg} rounded-lg flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${styles.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 ${styles.bg} ${styles.text} text-xs font-medium rounded uppercase`}>
                              {log.level}
                            </span>
                            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded">
                              {log.source}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-white">{log.message}</p>
                          {log.details && Object.keys(log.details).length > 0 && (
                            <div className="mt-2 p-2 bg-black/30 rounded border border-zinc-800">
                              <pre className="text-xs text-zinc-400 font-mono overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Git Commits View */}
          {activeView === 'git' && (
            <div className="space-y-2">
              {gitCommits.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
                  <GitCommit className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">Nenhum commit encontrado</p>
                  <p className="text-xs text-zinc-500 mt-1">Configure a integração GitHub nas configurações</p>
                </div>
              ) : (
                gitCommits.map((commit) => (
                  <div
                    key={commit.sha}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-900 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-zinc-800 rounded-lg flex-shrink-0">
                        <GitCommit className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-xs font-mono rounded">
                            {commit.sha}
                          </code>
                          <span className="text-xs text-zinc-500">
                            {formatTimestamp(commit.date)}
                          </span>
                        </div>
                        <p className="text-sm text-white mb-1">{commit.message}</p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <span>{commit.author}</span>
                          {commit.url && (
                            <>
                              <span>•</span>
                              <a
                                href={commit.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 hover:underline"
                              >
                                Ver no GitHub
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Vercel Deployments View */}
          {activeView === 'vercel' && (
            <div className="space-y-2">
              {vercelDeployments.length === 0 ? (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
                  <Globe className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">Nenhum deployment encontrado</p>
                  <p className="text-xs text-zinc-500 mt-1">Configure a integração Vercel nas configurações</p>
                </div>
              ) : (
                vercelDeployments.map((deployment) => {
                  const styles = getDeploymentStateStyles(deployment.state);

                  return (
                    <div
                      key={deployment.uid}
                      className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-900 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${styles.bg} rounded-lg flex-shrink-0`}>
                          <Globe className={`w-4 h-4 ${styles.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 ${styles.bg} ${styles.text} text-xs font-medium rounded`}>
                              {styles.label}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {formatTimestamp(deployment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-white mb-1">{deployment.name}</p>
                          {deployment.url && (
                            <a
                              href={`https://${deployment.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
                            >
                              {deployment.url}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
