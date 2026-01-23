"use client";

import React, { useState, useEffect } from 'react';
import { FolderOpen, File, Download, RefreshCw, ChevronRight, HardDrive, FileText, FolderClosed } from 'lucide-react';
import type { DirectoryListing, FileEntry } from '@/types';

export function FilesTab() {
  const [listing, setListing] = useState<DirectoryListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState('');
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);

  const loadDirectory = async (path: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/files/list?path=${encodeURIComponent(path)}`);
      if (response.ok) {
        const data = await response.json();
        setListing(data);
      } else {
        console.error('Failed to load directory');
        alert('Erro ao carregar diretório');
      }
    } catch (error) {
      console.error('Error loading directory:', error);
      alert('Erro ao carregar diretório');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: FileEntry) => {
    if (file.type === 'directory') return;

    setDownloadingFile(file.path);
    try {
      const response = await fetch(`/api/files/download?path=${encodeURIComponent(file.path)}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erro ao baixar arquivo');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Erro ao baixar arquivo');
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleNavigate = (file: FileEntry) => {
    if (file.type === 'directory') {
      setCurrentPath(file.path);
    }
  };

  const handleGoUp = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.join('/'));
  };

  const formatBytes = (bytes?: number): string => {
    if (!bytes) return '—';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getFileIcon = (entry: FileEntry) => {
    if (entry.type === 'directory') {
      return <FolderClosed className="w-5 h-5 text-yellow-500" />;
    }

    const ext = entry.name.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, React.ReactElement> = {
      json: <FileText className="w-5 h-5 text-blue-400" />,
      txt: <FileText className="w-5 h-5 text-zinc-400" />,
      csv: <FileText className="w-5 h-5 text-green-400" />,
      xml: <FileText className="w-5 h-5 text-orange-400" />,
    };

    return iconMap[ext || ''] || <File className="w-5 h-5 text-zinc-500" />;
  };

  if (loading && !listing) {
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
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <HardDrive className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gerenciador de Arquivos</h2>
            <p className="text-sm text-zinc-400">
              Visualize e baixe arquivos do sistema
            </p>
          </div>
        </div>

        <button
          onClick={() => loadDirectory(currentPath)}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <FolderOpen className="w-4 h-4 text-zinc-500" />
        <button
          onClick={() => setCurrentPath('')}
          className="text-orange-400 hover:text-orange-300 transition-colors"
        >
          data
        </button>
        {currentPath.split('/').filter(Boolean).map((part, index, arr) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <button
              onClick={() => {
                const newPath = arr.slice(0, index + 1).join('/');
                setCurrentPath(newPath);
              }}
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              {part}
            </button>
          </div>
        ))}
      </div>

      {/* File List */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-950/50 border-b border-zinc-800 text-xs font-medium text-zinc-400">
          <div className="col-span-6">Nome</div>
          <div className="col-span-2">Tamanho</div>
          <div className="col-span-3">Modificado</div>
          <div className="col-span-1 text-right">Ação</div>
        </div>

        {/* Entries */}
        <div className="divide-y divide-zinc-800">
          {/* Go Up Button */}
          {currentPath && (
            <button
              onClick={handleGoUp}
              className="w-full grid grid-cols-12 gap-4 px-6 py-3 hover:bg-zinc-800/50 transition-colors text-left"
            >
              <div className="col-span-6 flex items-center gap-3">
                <FolderClosed className="w-5 h-5 text-zinc-500" />
                <span className="text-zinc-400">..</span>
              </div>
              <div className="col-span-5 text-sm text-zinc-500">Voltar</div>
            </button>
          )}

          {listing?.entries.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-zinc-800/50 transition-colors group"
            >
              {/* Name */}
              <button
                onClick={() => handleNavigate(entry)}
                className="col-span-6 flex items-center gap-3 text-left"
              >
                {getFileIcon(entry)}
                <span className="text-white font-medium truncate group-hover:text-orange-400 transition-colors">
                  {entry.name}
                </span>
              </button>

              {/* Size */}
              <div className="col-span-2 flex items-center text-sm text-zinc-400">
                {formatBytes(entry.size)}
              </div>

              {/* Modified Date */}
              <div className="col-span-3 flex items-center text-sm text-zinc-400">
                {formatDate(entry.modifiedAt)}
              </div>

              {/* Action */}
              <div className="col-span-1 flex items-center justify-end">
                {entry.type === 'file' && (
                  <button
                    onClick={() => handleDownload(entry)}
                    disabled={downloadingFile === entry.path}
                    className="p-2 hover:bg-orange-600/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Baixar arquivo"
                  >
                    {downloadingFile === entry.path ? (
                      <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 text-orange-400" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {listing?.entries.length === 0 && (
            <div className="px-6 py-12 text-center">
              <FolderOpen className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500">Diretório vazio</p>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <HardDrive className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-orange-300 mb-1">
              Gerenciador de Arquivos (Vault)
            </h4>
            <p className="text-xs text-orange-200/80">
              Navegue pelos arquivos gerados pelo sistema na pasta <code className="bg-black/30 px-1.5 py-0.5 rounded">data/</code>.
              Clique em pastas para navegar e use o botão de download para baixar arquivos individuais.
              Os arquivos incluem configurações, perfis, documentação e logs do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
