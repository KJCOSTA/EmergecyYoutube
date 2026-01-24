"use client";

import { useState, useRef } from 'react';
import { User, Save, RefreshCw, Upload, Camera, X } from 'lucide-react';
import { updateProfile } from '@/app/actions/settings';
import type { UserProfile } from '@/types';

interface ProfileTabProps {
  initialProfile: UserProfile;
}

export function ProfileTab({ initialProfile }: ProfileTabProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Tipo de arquivo inválido. Use JPEG, PNG, GIF ou WebP.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Arquivo muito grande. Máximo 5MB.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      setProfile({ ...profile, avatarUrl: result.url });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Erro ao fazer upload');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
      <div className="flex items-center gap-3 pb-4 border-b border-subtle">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <User className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Perfil do Usuário</h2>
          <p className="text-sm text-muted">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Preview with Upload */}
        <div className="lg:col-span-1">
          <div className="bg-layer-1/50 border border-subtle rounded-xl p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-subtle">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Upload Overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <RefreshCw className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
            <p className="text-sm text-muted">{profile.role}</p>
            <p className="text-xs text-muted mt-2">ID: {profile.id}</p>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg flex items-center gap-2 mx-auto transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Alterar Foto
                </>
              )}
            </button>

            {/* Upload Error */}
            {uploadError && (
              <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                <X className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <p className="text-xs text-muted mt-3">
              Clique na foto ou no botão para alterar.
              <br />
              Formatos: JPEG, PNG, GIF, WebP (máx. 5MB)
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-layer-1/50 border border-subtle rounded-xl p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Nome
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-black/50 border border-subtle rounded-lg py-2.5 px-4 text-white placeholder:text-disabled focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Seu nome"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Cargo
              </label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full bg-black/50 border border-subtle rounded-lg py-2.5 px-4 text-white placeholder:text-disabled focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Seu cargo"
              />
            </div>

            {/* Avatar URL - Manual input as fallback */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                URL do Avatar (alternativo)
              </label>
              <input
                type="url"
                value={profile.avatarUrl}
                onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                className="w-full bg-black/50 border border-subtle rounded-lg py-2.5 px-4 text-white placeholder:text-disabled focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="https://..."
              />
              <p className="text-xs text-muted mt-1">
                Ou use{' '}
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
              <label className="block text-sm font-medium text-secondary mb-2">
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full bg-black/50 border border-subtle rounded-lg py-2.5 px-4 text-white placeholder:text-disabled focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                placeholder="Escreva uma breve descrição sobre você..."
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t border-subtle">
              <div className="text-xs text-muted">
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
