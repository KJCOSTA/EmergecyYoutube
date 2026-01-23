"use client";

import { useState } from 'react';
import { User, Save, RefreshCw } from 'lucide-react';
import { updateProfile } from '@/app/actions/settings';
import type { UserProfile } from '@/types';

interface ProfileTabProps {
  initialProfile: UserProfile;
}

export function ProfileTab({ initialProfile }: ProfileTabProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    try {
      const updated = await updateProfile({
        name: profile.name,
        role: profile.role,
        avatarUrl: profile.avatarUrl,
        bio: profile.bio,
      });

      setProfile(updated);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <User className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Perfil do Usuário</h2>
          <p className="text-sm text-zinc-400">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Preview */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-zinc-700">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
            <p className="text-sm text-zinc-400">{profile.role}</p>
            <p className="text-xs text-zinc-500 mt-2">ID: {profile.id}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2.5 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Seu nome"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Cargo
              </label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2.5 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Seu cargo"
              />
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                URL do Avatar
              </label>
              <input
                type="url"
                value={profile.avatarUrl}
                onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2.5 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="https://..."
              />
              <p className="text-xs text-zinc-500 mt-1">
                Dica: Use{' '}
                <a
                  href="https://api.dicebear.com/7.x/avataaars/svg?seed=YourName"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  DiceBear
                </a>{' '}
                para gerar avatares
              </p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2.5 px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                placeholder="Escreva uma breve descrição sobre você..."
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <div className="text-xs text-zinc-500">
                Última atualização:{' '}
                {new Date(profile.updatedAt).toLocaleString('pt-BR')}
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : success ? (
                  <>
                    <Save className="w-4 h-4" />
                    Salvo!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
