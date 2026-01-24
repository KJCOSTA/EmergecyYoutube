"use client";

import { useState, useEffect } from 'react';
import { User, FileText, Globe, Terminal, Settings, Palette, Activity, HardDrive } from 'lucide-react';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { DocsManagerTab } from '@/components/settings/DocsManagerTab';
import { IntegrationsTab } from '@/components/settings/IntegrationsTab';
import { LogsTab } from '@/components/settings/LogsTab';
import { AppearanceTab } from '@/components/settings/AppearanceTab';
import { SystemMonitorTab } from '@/components/settings/SystemMonitorTab';
import { FilesTab } from '@/components/settings/FilesTab';
import { getProfile, getDocs, getTokens } from '@/app/actions/settings';
import type { UserProfile, DocsData, IntegrationTokens, SettingsTab as TabType } from '@/types';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [docs, setDocs] = useState<DocsData>({ pages: [], updatedAt: new Date().toISOString() });
  const [tokens, setTokens] = useState<IntegrationTokens | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [profileData, docsData, tokensData] = await Promise.all([
        getProfile(),
        getDocs(),
        getTokens(),
      ]);

      setProfile(profileData);
      setDocs(docsData);
      setTokens(tokensData);
    } catch (error) {
      console.error('Failed to load settings data:', error);
      alert('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleDocsUpdate = async () => {
    try {
      const docsData = await getDocs();
      setDocs(docsData);
    } catch (error) {
      console.error('Failed to reload docs:', error);
    }
  };

  const handleTokensUpdate = async () => {
    try {
      const tokensData = await getTokens();
      setTokens(tokensData);
    } catch (error) {
      console.error('Failed to reload tokens:', error);
    }
  };

  const tabs = [
    {
      id: 'profile' as TabType,
      label: 'Perfil',
      icon: User,
      color: 'indigo',
    },
    {
      id: 'appearance' as TabType,
      label: 'Aparência',
      icon: Palette,
      color: 'purple',
    },
    {
      id: 'monitor' as TabType,
      label: 'Monitor',
      icon: Activity,
      color: 'cyan',
    },
    {
      id: 'files' as TabType,
      label: 'Arquivos',
      icon: HardDrive,
      color: 'orange',
    },
    {
      id: 'docs' as TabType,
      label: 'Documentação',
      icon: FileText,
      color: 'amber',
    },
    {
      id: 'integrations' as TabType,
      label: 'Integrações',
      icon: Globe,
      color: 'blue',
    },
    {
      id: 'logs' as TabType,
      label: 'Logs',
      icon: Terminal,
      color: 'emerald',
    },
  ];

  const getTabColorClasses = (color: string) => {
    const colors = {
      indigo: {
        active: 'text-indigo-400 bg-indigo-500/10 border-2 border-indigo-500/30 shadow-glow-md shadow-indigo-500/20',
        inactive: 'text-muted hover:text-white hover:bg-layer-2/80 border-2 border-transparent hover:border-indigo-500/20',
        indicator: 'bg-indigo-500 shadow-glow-sm shadow-indigo-500/50',
      },
      purple: {
        active: 'text-purple-400 bg-purple-500/10 border-2 border-purple-500/30 shadow-glow-md shadow-purple-500/20',
        inactive: 'text-muted hover:text-white hover:bg-layer-2/80 border-2 border-transparent hover:border-purple-500/20',
        indicator: 'bg-purple-500 shadow-glow-sm shadow-purple-500/50',
      },
      cyan: {
        active: 'text-cyan-400 bg-cyan-500/10 border-2 border-cyan-500/30 shadow-glow-md shadow-cyan-500/20',
        inactive: 'text-muted hover:text-white hover:bg-layer-2/80 border-2 border-transparent hover:border-cyan-500/20',
        indicator: 'bg-cyan-500 shadow-glow-sm shadow-cyan-500/50',
      },
      orange: {
        active: 'text-orange-400 bg-orange-500/10 border-2 border-orange-500/30 shadow-glow-md shadow-orange-500/20',
        inactive: 'text-muted hover:text-white hover:bg-layer-2/80 border-2 border-transparent hover:border-orange-500/20',
        indicator: 'bg-orange-500 shadow-glow-sm shadow-orange-500/50',
      },
      amber: {
        active: 'text-amber-400 bg-amber-500/10 border-2 border-amber-500/30 shadow-glow-md shadow-amber-500/20',
        inactive: 'text-muted hover:text-white hover:bg-layer-2/80 border-2 border-transparent hover:border-amber-500/20',
        indicator: 'bg-amber-500 shadow-glow-sm shadow-amber-500/50',
      },
      blue: {
        active: 'text-blue-400 bg-blue-500/10 border-2 border-blue-500/30 shadow-glow-md shadow-blue-500/20',
        inactive: 'text-muted hover:text-white hover:bg-layer-2/80 border-2 border-transparent hover:border-blue-500/20',
        indicator: 'bg-blue-500 shadow-glow-sm shadow-blue-500/50',
      },
      emerald: {
        active: 'text-emerald-400 bg-emerald-500/10 border-2 border-emerald-500/30 shadow-glow-md shadow-emerald-500/20',
        inactive: 'text-muted hover:text-white hover:bg-layer-2/80 border-2 border-transparent hover:border-emerald-500/20',
        indicator: 'bg-emerald-500 shadow-glow-sm shadow-emerald-500/50',
      },
    };

    return colors[color as keyof typeof colors] || colors.indigo;
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <Settings className="w-12 h-12 text-cyan-500 mx-auto mb-4 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 bg-cyan-500/20 blur-xl animate-pulse" />
          </div>
          <p className="text-muted">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b border-subtle bg-gradient-to-br from-layer-1/80 via-indigo-950/20 to-layer-1/80 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-indigo-500/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-glow-md shadow-indigo-500/50 group hover:shadow-glow-lg hover:shadow-indigo-400/70 transition-all duration-300">
              <Settings className="w-6 h-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">Configurações</h1>
              <p className="text-sm text-muted">Gerencie perfil, documentação e integrações</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar Tabs */}
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const colorClasses = getTabColorClasses(tab.color);

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3.5 rounded-xl flex items-center gap-3 transition-all text-left relative group ${
                    isActive
                      ? colorClasses.active
                      : colorClasses.inactive
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white/10 shadow-glow-sm'
                      : 'bg-layer-2 group-hover:bg-layer-3'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{tab.label}</span>
                  {isActive && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 ${colorClasses.indicator} rounded-r`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            <div className="relative overflow-hidden bg-gradient-to-br from-layer-1/80 via-indigo-950/10 to-layer-2/50 backdrop-blur-xl border-2 border-subtle rounded-2xl p-8 shadow-xl hover:border-active/30 transition-all duration-300 group">
              {/* Animated gradient mesh background */}
              <div className="absolute inset-0 bg-gradient-mesh opacity-10" />

              {/* Glow overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-shimmer" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {activeTab === 'profile' && profile && (
                  <div className="animate-fade-in">
                    <ProfileTab initialProfile={profile} />
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="animate-fade-in">
                    <AppearanceTab />
                  </div>
                )}

                {activeTab === 'monitor' && (
                  <div className="animate-fade-in">
                    <SystemMonitorTab />
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className="animate-fade-in">
                    <FilesTab />
                  </div>
                )}

                {activeTab === 'docs' && (
                  <div className="animate-fade-in">
                    <DocsManagerTab initialDocs={docs.pages} onUpdate={handleDocsUpdate} />
                  </div>
                )}

                {activeTab === 'integrations' && tokens && (
                  <div className="animate-fade-in">
                    <IntegrationsTab initialTokens={tokens} onUpdate={handleTokensUpdate} />
                  </div>
                )}

                {activeTab === 'logs' && (
                  <div className="animate-fade-in">
                    <LogsTab />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
