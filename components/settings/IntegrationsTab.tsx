"use client";

import { useState } from 'react';
import { Github, Globe, Save, Trash2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { saveGitHubTokens, saveVercelTokens, removeGitHubTokensAction, removeVercelTokensAction } from '@/app/actions/settings';
import { testGitHubConnection } from '@/app/actions/github';
import { testVercelConnection } from '@/app/actions/vercel';
import type { IntegrationTokens } from '@/types';

interface IntegrationsTabProps {
  initialTokens: IntegrationTokens;
  onUpdate: () => void;
}

export function IntegrationsTab({ initialTokens, onUpdate }: IntegrationsTabProps) {
  const [tokens, setTokens] = useState(initialTokens);
  const [githubForm, setGithubForm] = useState({
    token: tokens.github?.token || '',
    owner: tokens.github?.owner || '',
    repo: tokens.github?.repo || '',
  });
  const [vercelForm, setVercelForm] = useState({
    token: tokens.vercel?.token || '',
    projectId: tokens.vercel?.projectId || '',
  });
  const [testing, setTesting] = useState<'github' | 'vercel' | null>(null);
  const [testResults, setTestResults] = useState<{
    github?: { success: boolean; error?: string };
    vercel?: { success: boolean; error?: string };
  }>({});

  const handleSaveGitHub = async () => {
    try {
      const updated = await saveGitHubTokens(
        githubForm.token,
        githubForm.owner,
        githubForm.repo
      );
      setTokens(updated);
      onUpdate();
      alert('Integração GitHub salva com sucesso!');
    } catch (error) {
      console.error('Failed to save GitHub tokens:', error);
      alert('Erro ao salvar integração GitHub');
    }
  };

  const handleSaveVercel = async () => {
    try {
      const updated = await saveVercelTokens(
        vercelForm.token,
        vercelForm.projectId
      );
      setTokens(updated);
      onUpdate();
      alert('Integração Vercel salva com sucesso!');
    } catch (error) {
      console.error('Failed to save Vercel tokens:', error);
      alert('Erro ao salvar integração Vercel');
    }
  };

  const handleRemoveGitHub = async () => {
    if (!confirm('Tem certeza que deseja remover a integração GitHub?')) return;

    try {
      const updated = await removeGitHubTokensAction();
      setTokens(updated);
      setGithubForm({ token: '', owner: '', repo: '' });
      setTestResults({ ...testResults, github: undefined });
      onUpdate();
    } catch (error) {
      console.error('Failed to remove GitHub tokens:', error);
      alert('Erro ao remover integração GitHub');
    }
  };

  const handleRemoveVercel = async () => {
    if (!confirm('Tem certeza que deseja remover a integração Vercel?')) return;

    try {
      const updated = await removeVercelTokensAction();
      setTokens(updated);
      setVercelForm({ token: '', projectId: '' });
      setTestResults({ ...testResults, vercel: undefined });
      onUpdate();
    } catch (error) {
      console.error('Failed to remove Vercel tokens:', error);
      alert('Erro ao remover integração Vercel');
    }
  };

  const handleTestGitHub = async () => {
    setTesting('github');
    try {
      const result = await testGitHubConnection();
      setTestResults({ ...testResults, github: result });
    } catch {
      setTestResults({
        ...testResults,
        github: { success: false, error: 'Erro ao testar conexão' },
      });
    } finally {
      setTesting(null);
    }
  };

  const handleTestVercel = async () => {
    setTesting('vercel');
    try {
      const result = await testVercelConnection();
      setTestResults({ ...testResults, vercel: result });
    } catch {
      setTestResults({
        ...testResults,
        vercel: { success: false, error: 'Erro ao testar conexão' },
      });
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Globe className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Integrações & Tokens</h2>
          <p className="text-sm text-zinc-400">Configure APIs para logs e automação</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* GitHub Integration */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-800 rounded-lg">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">GitHub</h3>
              <p className="text-xs text-zinc-500">Para logs de commits e changelog automático</p>
            </div>
            {tokens.github && (
              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Configurado
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Token</label>
              <input
                type="password"
                value={githubForm.token}
                onChange={(e) => setGithubForm({ ...githubForm, token: e.target.value })}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 px-3 text-white text-sm"
                placeholder="ghp_..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Owner</label>
                <input
                  type="text"
                  value={githubForm.owner}
                  onChange={(e) => setGithubForm({ ...githubForm, owner: e.target.value })}
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 px-3 text-white text-sm"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Repositório</label>
                <input
                  type="text"
                  value={githubForm.repo}
                  onChange={(e) => setGithubForm({ ...githubForm, repo: e.target.value })}
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 px-3 text-white text-sm"
                  placeholder="repository-name"
                />
              </div>
            </div>

            {testResults.github && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${testResults.github.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {testResults.github.success ? (
                  <><CheckCircle2 className="w-4 h-4" /> Conexão bem-sucedida!</>
                ) : (
                  <><XCircle className="w-4 h-4" /> {testResults.github.error}</>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleTestGitHub}
                disabled={testing === 'github' || !tokens.github}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {testing === 'github' ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Testando...</>
                ) : (
                  <>Testar Conexão</>
                )}
              </button>
              <button
                onClick={handleSaveGitHub}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              {tokens.github && (
                <button
                  onClick={handleRemoveGitHub}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm flex items-center gap-2 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vercel Integration */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-zinc-800 rounded-lg">
              <svg className="w-5 h-5 text-white" viewBox="0 0 76 76" fill="currentColor">
                <path d="M38 0L76 66H0L38 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Vercel</h3>
              <p className="text-xs text-zinc-500">Para logs de deployments</p>
            </div>
            {tokens.vercel && (
              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Configurado
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Token</label>
              <input
                type="password"
                value={vercelForm.token}
                onChange={(e) => setVercelForm({ ...vercelForm, token: e.target.value })}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 px-3 text-white text-sm"
                placeholder="v1_..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Project ID</label>
              <input
                type="text"
                value={vercelForm.projectId}
                onChange={(e) => setVercelForm({ ...vercelForm, projectId: e.target.value })}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 px-3 text-white text-sm"
                placeholder="prj_..."
              />
            </div>

            {testResults.vercel && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${testResults.vercel.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {testResults.vercel.success ? (
                  <><CheckCircle2 className="w-4 h-4" /> Conexão bem-sucedida!</>
                ) : (
                  <><XCircle className="w-4 h-4" /> {testResults.vercel.error}</>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleTestVercel}
                disabled={testing === 'vercel' || !tokens.vercel}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {testing === 'vercel' ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Testando...</>
                ) : (
                  <>Testar Conexão</>
                )}
              </button>
              <button
                onClick={handleSaveVercel}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
              {tokens.vercel && (
                <button
                  onClick={handleRemoveVercel}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm flex items-center gap-2 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
