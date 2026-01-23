"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FolderOpen,
  File,
  RefreshCw,
  ChevronRight,
  FileText,
  FolderClosed,
  Upload,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  ExternalLink,
  AlertCircle,
  Cloud,
} from 'lucide-react';
import type { DirectoryListing, FileEntry } from '@/types';

export function FilesTab() {
  const [listing, setListing] = useState<DirectoryListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      }
    } catch (error) {
      console.error('Error loading directory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (currentPath) {
        formData.append('folder', currentPath);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      // Refresh the listing after upload
      await loadDirectory(currentPath);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Erro ao fazer upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = (file: FileEntry) => {
    if (file.type === 'directory' || !file.url) return;

    // Open URL directly for Vercel Blob files
    window.open(file.url, '_blank');
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
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
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
      // Documents
      json: <FileText className="w-5 h-5 text-blue-400" />,
      txt: <FileText className="w-5 h-5 text-zinc-400" />,
      csv: <FileText className="w-5 h-5 text-green-400" />,
      xml: <FileText className="w-5 h-5 text-orange-400" />,
      md: <FileText className="w-5 h-5 text-purple-400" />,
      pdf: <FileText className="w-5 h-5 text-red-400" />,
      // Images
      jpg: <ImageIcon className="w-5 h-5 text-pink-400" />,
      jpeg: <ImageIcon className="w-5 h-5 text-pink-400" />,
      png: <ImageIcon className="w-5 h-5 text-pink-400" />,
      gif: <ImageIcon className="w-5 h-5 text-pink-400" />,
      webp: <ImageIcon className="w-5 h-5 text-pink-400" />,
      svg: <ImageIcon className="w-5 h-5 text-pink-400" />,
      // Video
      mp4: <Video className="w-5 h-5 text-cyan-400" />,
      webm: <Video className="w-5 h-5 text-cyan-400" />,
      mov: <Video className="w-5 h-5 text-cyan-400" />,
      // Audio
      mp3: <Music className="w-5 h-5 text-emerald-400" />,
      wav: <Music className="w-5 h-5 text-emerald-400" />,
      ogg: <Music className="w-5 h-5 text-emerald-400" />,
      // Archives
      zip: <Archive className="w-5 h-5 text-amber-400" />,
      tar: <Archive className="w-5 h-5 text-amber-400" />,
      gz: <Archive className="w-5 h-5 text-amber-400" />,
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
            <Cloud className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gerenciador de Arquivos</h2>
            <p className="text-sm text-zinc-400">
              Vercel Blob Storage - Arquivos do projeto
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload
          </button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Refresh Button */}
          <button
            onClick={() => loadDirectory(currentPath)}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Status Message */}
      {listing?.message && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-amber-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{listing.message}</span>
        </div>
      )}

      {/* Stats */}
      {listing && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-500">Total de Arquivos</p>
            <p className="text-2xl font-bold text-white">{listing.totalFiles || 0}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-500">Tamanho Total</p>
            <p className="text-2xl font-bold text-white">{formatBytes(listing.totalSize)}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-500">Nesta Pasta</p>
            <p className="text-2xl font-bold text-white">{listing.entries.length}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <FolderOpen className="w-4 h-4 text-zinc-500" />
        <button
          onClick={() => setCurrentPath('')}
          className="text-orange-400 hover:text-orange-300 transition-colors"
        >
          root
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
                onClick={() => entry.type === 'directory' ? handleNavigate(entry) : null}
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
                {entry.type === 'file' && entry.url && (
                  <button
                    onClick={() => handleDownload(entry)}
                    className="p-2 hover:bg-orange-600/20 rounded-lg transition-colors"
                    title="Abrir/Baixar arquivo"
                  >
                    <ExternalLink className="w-4 h-4 text-orange-400" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {listing?.entries.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Cloud className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500">Nenhum arquivo encontrado</p>
              <p className="text-zinc-600 text-sm mt-1">
                Faça upload de arquivos para começar
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Cloud className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-orange-300 mb-1">
              Vercel Blob Storage
            </h4>
            <p className="text-xs text-orange-200/80">
              Os arquivos são armazenados no Vercel Blob, um serviço de armazenamento
              de objetos integrado ao Vercel. Faça upload de imagens, vídeos, documentos
              e outros arquivos para usar em seus projetos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
