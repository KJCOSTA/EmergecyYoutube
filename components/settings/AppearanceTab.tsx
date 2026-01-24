"use client";

import { useState, useEffect } from 'react';
import { Palette, Save, RefreshCw, RotateCcw, Upload, Image as ImageIcon } from 'lucide-react';
import { getBranding, updateBranding, resetBranding } from '@/app/actions/settings';
import { useBrandingStore } from '@/lib/store';
import type { BrandingConfig } from '@/types';

export function AppearanceTab() {
  const [config, setConfig] = useState<BrandingConfig>({
    systemName: 'ORION',
    logoUrl: null,
    updatedAt: new Date().toISOString(),
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const { setBranding, resetBranding: resetBrandingStore } = useBrandingStore();

  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = async () => {
    setLoading(true);
    try {
      const data = await getBranding();
      setConfig(data);
    } catch (error) {
      console.error('Failed to load branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    try {
      const updated = await updateBranding({
        systemName: config.systemName,
        logoUrl: config.logoUrl,
      });

      setConfig(updated);

      // Sync with Zustand store (client-side)
      setBranding(updated.systemName, updated.logoUrl);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update branding:', error);
      alert('Erro ao atualizar aparência');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Tem certeza que deseja resetar para o padrão ORION?')) {
      return;
    }

    setSaving(true);
    try {
      const defaultConfig = await resetBranding();
      setConfig(defaultConfig);

      // Sync with Zustand store
      resetBrandingStore();

      alert('Branding resetado com sucesso!');
    } catch (error) {
      console.error('Failed to reset branding:', error);
      alert('Erro ao resetar branding');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 text-disabled animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-subtle">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Palette className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Aparência do Sistema</h2>
            <p className="text-sm text-muted">Personalize o nome e logotipo (White Label)</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          disabled={saving}
          className="px-4 py-2 bg-layer-2 hover:bg-zinc-700 text-secondary rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          Resetar Padrão
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logo Preview */}
        <div className="lg:col-span-1">
          <div className="bg-layer-1/50 border border-subtle rounded-xl p-6">
            <h3 className="text-sm font-semibold text-secondary mb-4">Preview do Logo</h3>

            <div className="aspect-square bg-black/50 border-2 border-dashed border-subtle rounded-xl flex items-center justify-center overflow-hidden">
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-disabled mx-auto mb-2" />
                  <p className="text-xs text-muted">Sem logo</p>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-layer-1 border border-subtle rounded-lg">
              <p className="text-xs font-semibold text-muted mb-1">Nome do Sistema:</p>
              <p className="text-lg font-bold text-white">{config.systemName}</p>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-layer-1/50 border border-subtle rounded-xl p-6 space-y-4">
            {/* System Name */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Nome do Sistema
              </label>
              <input
                type="text"
                value={config.systemName}
                onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
                className="w-full bg-black/50 border border-subtle rounded-lg py-2.5 px-4 text-white placeholder:text-disabled focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Ex: ORION, MyApp, Studio..."
              />
              <p className="text-xs text-muted mt-1">
                Este nome aparecerá na barra lateral e no título da página
              </p>
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                URL do Logotipo
              </label>
              <input
                type="url"
                value={config.logoUrl || ''}
                onChange={(e) => setConfig({ ...config, logoUrl: e.target.value || null })}
                className="w-full bg-black/50 border border-subtle rounded-lg py-2.5 px-4 text-white placeholder:text-disabled focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="https://exemplo.com/logo.png"
              />
              <p className="text-xs text-muted mt-1">
                Formatos recomendados: PNG, SVG (fundo transparente)
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Upload className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-purple-300 mb-1">
                    Como fazer upload do logo
                  </h4>
                  <ul className="text-xs text-purple-200/80 space-y-1">
                    <li>• Use um serviço como Imgur, Cloudinary ou GitHub</li>
                    <li>• Para GitHub: suba a imagem e copie o link &quot;raw&quot;</li>
                    <li>• Tamanho recomendado: 512x512px ou maior</li>
                    <li>• Deixe em branco para usar o logo padrão</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t border-subtle">
              <div className="text-xs text-muted">
                Última atualização:{' '}
                {new Date(config.updatedAt).toLocaleString('pt-BR')}
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Additional Info */}
          <div className="bg-layer-1/50 border border-subtle rounded-xl p-6">
            <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-muted" />
              Sistema White Label
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Com o sistema White Label, você pode personalizar completamente a identidade visual do ORION.
              Altere o nome do sistema e o logotipo para refletir sua marca. As mudanças são aplicadas
              automaticamente em toda a interface, incluindo a barra lateral, título da página e metadados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
