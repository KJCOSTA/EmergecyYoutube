"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Youtube, Wifi, FileText, Sparkles, CheckCircle2, RefreshCw, ArrowRight, Users, Video, Eye, X, AlertCircle } from "lucide-react";
import { useAPIKeysStore } from '@/lib/api-keys-store';
import { useUIStore, useWorkflowStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface ServerStatus {
  openai?: boolean;
  gemini?: boolean;
  anthropic?: boolean;
  youtube?: boolean;
  pexels?: boolean;
  pixabay?: boolean;
  elevenlabs?: boolean;
  tavily?: boolean;
  json2video?: boolean;
}

interface ChannelInfo {
  name: string;
  subscribers: string;
  videos: string;
  views: string;
  thumbnail?: string;
  channelId?: string;
  channelUrl?: string;
}

export default function InputPage() {
  const router = useRouter();
  const [serverStatus, setServerStatus] = useState<ServerStatus>({});
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [theme, setTheme] = useState("");
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [loadingChannel, setLoadingChannel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pega as chaves que você salvou no navegador
  const { keys: localKeys } = useAPIKeysStore();
  const { openApiKeyModal } = useUIStore();
  const { setContext, setStep } = useWorkflowStore();

  useEffect(() => {
    setMounted(true);
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setServerStatus(data);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    } finally {
      setLoading(false);
    }
  };

  // LÓGICA DE CONEXÃO HÍBRIDA (O SEGREDO ESTÁ AQUI)
  // Verifica se a chave existe no Servidor Vercel OU no seu Navegador
  const isYoutubeConnected = serverStatus.youtube || (mounted && !!localKeys.youtube_api_key && localKeys.youtube_api_key.length > 5);

  const isAIConnected =
    serverStatus.openai || (mounted && !!localKeys.openai_api_key) ||
    serverStatus.gemini || (mounted && !!localKeys.google_api_key) ||
    serverStatus.anthropic || (mounted && !!localKeys.anthropic_api_key);

  // Carregar informações do canal
  const fetchChannelInfo = useCallback(async () => {
    setLoadingChannel(true);
    try {
      // Buscar dados reais da API do YouTube
      const headers: HeadersInit = {};
      if (localKeys.youtube_api_key) {
        headers['x-youtube-api-key'] = localKeys.youtube_api_key;
      }
      if (localKeys.youtube_channel_id) {
        headers['x-youtube-channel-id'] = localKeys.youtube_channel_id;
      }

      const response = await fetch('/api/youtube/channel', { headers });

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados do canal: ${response.status}`);
      }

      const data = await response.json();

      // Formatar números para exibição amigável
      const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
      };

      // Buscar thumbnail do canal
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${data.channelId}&key=${localKeys.youtube_api_key}`
      );

      let thumbnailUrl = undefined;
      if (channelResponse.ok) {
        const channelData = await channelResponse.json();
        if (channelData.items && channelData.items.length > 0) {
          thumbnailUrl = channelData.items[0].snippet.thumbnails.default.url;
        }
      }

      setChannelInfo({
        name: data.title,
        subscribers: formatNumber(data.subscriberCount),
        videos: formatNumber(data.videoCount),
        views: formatNumber(data.viewCount),
        thumbnail: thumbnailUrl,
        channelId: data.channelId,
        channelUrl: `https://www.youtube.com/channel/${data.channelId}`
      });
    } catch (error) {
      console.error("Erro ao buscar info do canal:", error);
    } finally {
      setLoadingChannel(false);
    }
  }, [localKeys.youtube_api_key, localKeys.youtube_channel_id]);

  // Carregar informações do canal quando conectado
  useEffect(() => {
    if (isYoutubeConnected && !channelInfo && !loadingChannel) {
      fetchChannelInfo();
    }
  }, [isYoutubeConnected, channelInfo, loadingChannel, fetchChannelInfo]);

  // Upload de arquivo
  const handleFileSelect = useCallback((file: File) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setUploadedFile(file);
    } else {
      alert('Por favor, selecione um arquivo CSV válido.');
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Avançar para próxima etapa
  const canAdvance = theme.trim().length > 0 && isAIConnected;

  const handleAdvance = () => {
    if (canAdvance) {
      const now = new Date().toISOString();
      setContext({
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
        theme: theme.trim(),
        autoMode: false,
        metrics: [],
        channelData: channelInfo ? {
          channelId: "user-channel",
          title: channelInfo.name,
          description: "",
          subscriberCount: parseInt(channelInfo.subscribers.replace(/[^0-9]/g, "")) || 0,
          videoCount: parseInt(channelInfo.videos.replace(/[^0-9]/g, "")) || 0,
          viewCount: parseInt(channelInfo.views.replace(/[^0-9]/g, "")) || 0,
          recentVideos: [],
        } : null,
      });
      setStep(2);
      router.push('/step/2-research');
    }
  };

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-in fade-in duration-500">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Menu de Entrada</h1>
          <p className="text-zinc-400 mt-1 text-sm sm:text-base">Configure o contexto inicial para a produção do seu vídeo.</p>
        </div>

        <button
          onClick={() => openApiKeyModal()}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold shadow-lg flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap cursor-pointer hover:ring-2 text-sm sm:text-base ${
            isYoutubeConnected && isAIConnected
              ? "bg-green-600 hover:bg-green-500 text-white shadow-green-500/20 hover:ring-green-500/50"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 hover:ring-indigo-500/50"
          }`}
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
          {isYoutubeConnected && isAIConnected ? "Conexões Ativas" : "Conectar APIs"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Card Upload - AGORA FUNCIONAL */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6 hover:border-zinc-700 transition-all group">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-2.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base sm:text-lg">Upload de Métricas</h3>
              <p className="text-xs text-zinc-500">Dados históricos do canal (CSV)</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleInputChange}
            className="hidden"
          />

          {uploadedFile ? (
            <div className="border-2 border-green-500/30 bg-green-500/5 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 sm:p-3 bg-green-500/10 rounded-full flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-green-400 text-sm sm:text-base truncate">{uploadedFile.name}</p>
                    <p className="text-zinc-500 text-xs">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={handleClickUpload}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl h-32 sm:h-40 flex flex-col items-center justify-center text-zinc-500 transition-all cursor-pointer ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-600'
              }`}
            >
              <div className={`p-2 sm:p-3 rounded-full mb-2 sm:mb-3 shadow-inner transition-colors ${isDragging ? 'bg-blue-500/20' : 'bg-zinc-800'}`}>
                <FileText className={`w-5 h-5 sm:w-6 sm:h-6 ${isDragging ? 'text-blue-400' : 'text-zinc-400'}`} />
              </div>
              <p className="font-medium text-zinc-300 text-sm sm:text-base">
                {isDragging ? 'Solte o arquivo aqui' : 'Clique ou arraste o arquivo'}
              </p>
              <p className="text-xs text-zinc-500 mt-1">Apenas arquivos CSV</p>
            </div>
          )}
        </div>

        {/* Card YouTube Sync - COM INFO DO CANAL */}
        <div className={`border rounded-xl p-4 sm:p-6 transition-all group ${isYoutubeConnected ? 'bg-green-900/10 border-green-900/30' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}>
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className={`p-2 sm:p-2.5 rounded-lg transition-colors ${isYoutubeConnected ? 'bg-green-500/20' : 'bg-red-500/10'}`}>
              <Youtube className={`w-4 h-4 sm:w-5 sm:h-5 ${isYoutubeConnected ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base sm:text-lg">Sincronização</h3>
              <p className="text-xs text-zinc-500">Conexão em tempo real</p>
            </div>
            {isYoutubeConnected && (
               <span className="ml-auto bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 animate-in fade-in zoom-in">
                 <CheckCircle2 className="w-3 h-3" /> ATIVO
               </span>
            )}
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl min-h-[128px] sm:min-h-[160px] flex flex-col items-center justify-center p-4 sm:p-6 text-center relative overflow-hidden">
            {isYoutubeConnected ? (
              loadingChannel ? (
                <div className="z-10 flex flex-col items-center gap-3">
                  <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 animate-spin" />
                  <p className="text-zinc-400 text-sm">Carregando dados do canal...</p>
                </div>
              ) : channelInfo ? (
                <div className="z-10 w-full animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    {channelInfo.thumbnail ? (
                      <img
                        src={channelInfo.thumbnail}
                        alt={channelInfo.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                        {channelInfo.name.charAt(0)}
                      </div>
                    )}
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-white text-sm sm:text-base truncate">{channelInfo.name}</p>
                      <p className="text-green-400 text-xs">Canal Conectado</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-zinc-800/50 rounded-lg p-2 sm:p-3">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 mx-auto mb-1" />
                      <p className="text-white font-bold text-xs sm:text-sm">{channelInfo.subscribers}</p>
                      <p className="text-zinc-500 text-[10px] sm:text-xs">Inscritos</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-2 sm:p-3">
                      <Video className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 mx-auto mb-1" />
                      <p className="text-white font-bold text-xs sm:text-sm">{channelInfo.videos}</p>
                      <p className="text-zinc-500 text-[10px] sm:text-xs">Vídeos</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-2 sm:p-3">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-400 mx-auto mb-1" />
                      <p className="text-white font-bold text-xs sm:text-sm">{channelInfo.views}</p>
                      <p className="text-zinc-500 text-[10px] sm:text-xs">Views</p>
                    </div>
                  </div>
                  {channelInfo.channelUrl && (
                    <div className="mt-3 pt-3 border-t border-zinc-800">
                      <p className="text-zinc-500 text-[10px] sm:text-xs mb-1">Canal no YouTube:</p>
                      <a
                        href={channelInfo.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm break-all transition-colors"
                      >
                        {channelInfo.channelUrl}
                      </a>
                      <p className="text-zinc-600 text-[10px] mt-1">ID: {channelInfo.channelId}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="z-10 flex flex-col items-center gap-3 animate-in slide-in-from-bottom-2">
                   <div className="p-2 sm:p-3 bg-green-500/10 rounded-full mb-1 border border-green-500/20">
                      <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                   </div>
                   <p className="text-green-400 font-medium text-sm sm:text-base">Canal Sincronizado</p>
                   <p className="text-zinc-500 text-xs">Pronto para gerar conteúdo</p>
                </div>
              )
            ) : (
              <div className="z-10 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-zinc-300">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium">API Necessária</span>
                </div>
                <button
                  onClick={() => openApiKeyModal()}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 sm:px-4 py-2 rounded-md border border-zinc-700 transition-colors cursor-pointer"
                >
                  Configurar Acesso
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Definição de Tema */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-amber-500/10 rounded-lg">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base sm:text-lg">Definição de Tema</h3>
            <p className="text-xs text-zinc-500">O que vamos criar hoje?</p>
          </div>
        </div>

        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Ex: Oração da Manhã, Notícias sobre IA, Review de Tech..."
          className="w-full bg-black/50 border border-zinc-700 rounded-xl py-3 sm:py-4 px-3 sm:px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm sm:text-base"
        />
      </div>

      {/* Botão de Avançar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
        {!canAdvance && (
          <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm order-2 sm:order-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              {!theme.trim()
                ? 'Defina um tema para continuar'
                : !isAIConnected
                ? 'Conecte pelo menos uma API de IA'
                : ''}
            </span>
          </div>
        )}

        <button
          onClick={handleAdvance}
          disabled={!canAdvance}
          className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base order-1 sm:order-2 ${
            canAdvance
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40 cursor-pointer active:scale-95'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          Avançar para Pesquisa
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
