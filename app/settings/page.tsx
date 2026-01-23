"use client";

import { useState, useEffect } from 'react';
import { User, FileText, Globe, Terminal, Settings } from 'lucide-react';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { DocsManagerTab } from '@/components/settings/DocsManagerTab';
import { IntegrationsTab } from '@/components/settings/IntegrationsTab';
import { LogsTab } from '@/components/settings/LogsTab';
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
        active: 'text-indigo-400 bg-indigo-500/10',
        inactive: 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
        indicator: 'bg-indigo-500',
      },
      amber: {
        active: 'text-amber-400 bg-amber-500/10',
        inactive: 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
        indicator: 'bg-amber-500',
      },
      blue: {
        active: 'text-blue-400 bg-blue-500/10',
        inactive: 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
        indicator: 'bg-blue-500',
      },
      emerald: {
        active: 'text-emerald-400 bg-emerald-500/10',
        inactive: 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
        indicator: 'bg-emerald-500',
      },
    };

    return colors[color as keyof typeof colors] || colors.indigo;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-12 h-12 text-zinc-600 mx-auto mb-4 animate-spin" />
          <p className="text-zinc-400">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Configurações</h1>
              <p className="text-sm text-zinc-400">Gerencie perfil, documentação e integrações</p>
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
                      ? 'bg-white/10'
                      : 'bg-zinc-800 group-hover:bg-zinc-700'
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
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-8">
              {activeTab === 'profile' && profile && (
                <div className="animate-fade-in">
                  <ProfileTab initialProfile={profile} />
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
