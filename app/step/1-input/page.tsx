"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import GuidelinesModal from "@/components/GuidelinesModal";
import ApiKeysModal from "@/components/ApiKeysModal";
import ConnectApisModal from "@/components/ConnectApisModal";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import FileDropzone from "@/components/FileDropzone";
import Badge from "@/components/ui/Badge";
import { useWorkflowStore, useUIStore } from "@/lib/store";
import { checkAPIKeys } from "@/lib/api-keys";
import { useAPIKeysStore, getAPIKeyHeaders } from "@/lib/api-keys-store";
import { ChannelMetrics, ChannelData, APIKeyStatus } from "@/types";
import { v4 as uuidv4 } from "uuid";
import Papa from "papaparse";
import {
  Upload,
  Youtube,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  TrendingUp,
  Wifi,
  Zap,
  Settings2,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

// Skeleton loading component
function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-zinc-800 rounded w-1/3" />
      <div className="h-10 bg-zinc-800 rounded" />
      <div className="h-4 bg-zinc-800 rounded w-2/3" />
    </div>
  );
}

export default function Step1Input() {
  const router = useRouter();
  const { setContext, setStep, context } = useWorkflowStore();
  const { setConnectApisModalOpen } = useUIStore();
  const { keys } = useAPIKeysStore();

  const [apiKeyStatus, setApiKeyStatus] = useState<APIKeyStatus | null>(null);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);

  // Form state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [metrics, setMetrics] = useState<ChannelMetrics[]>([]);
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [isSyncingChannel, setIsSyncingChannel] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [theme, setTheme] = useState("");
  const [autoMode, setAutoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load API key status
  useEffect(() => {
    checkAPIKeys().then((status) => {
      setApiKeyStatus(status);
      setIsLoadingKeys(false);
    });
  }, []);

  // Reload API key status when keys change
  useEffect(() => {
    checkAPIKeys().then(setApiKeyStatus);
  }, [keys]);

  // Load existing context if available
  useEffect(() => {
    if (context) {
      setMetrics(context.metrics);
      setChannelData(context.channelData);
      setTheme(context.theme);
      setAutoMode(context.autoMode);
    }
  }, [context]);

  const handleCsvUpload = (file: File) => {
    setCsvFile(file);
    setError(null);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const parsedMetrics: ChannelMetrics[] = results.data
            .filter((row: unknown) => {
              const r = row as Record<string, string>;
              return r["Video"] || r["Title"] || r["video_id"];
            })
            .map((row: unknown) => {
              const r = row as Record<string, string>;
              return {
                videoId: r["Video"] || r["video_id"] || "",
                title: r["Title"] || r["title"] || r["Video title"] || "",
                views: parseInt(r["Views"] || r["views"] || "0"),
                likes: parseInt(r["Likes"] || r["likes"] || "0"),
                comments: parseInt(r["Comments"] || r["comments"] || "0"),
                watchTime: parseFloat(r["Watch time (hours)"] || r["watch_time"] || "0"),
                averageViewDuration: parseFloat(
                  r["Average view duration"] || r["avg_duration"] || "0"
                ),
                ctr: parseFloat(r["Impressions click-through rate (%)"] || r["ctr"] || "0"),
                impressions: parseInt(r["Impressions"] || r["impressions"] || "0"),
                publishedAt: r["Published"] || r["published_at"] || "",
              };
            });

          setMetrics(parsedMetrics);
        } catch (err) {
          setError("Erro ao processar o arquivo CSV. Verifique o formato.");
          console.error(err);
        }
      },
      error: (err) => {
        setError(`Erro ao ler o arquivo: ${err.message}`);
      },
    });
  };

  const handleSyncChannel = async () => {
    setIsSyncingChannel(true);
    setSyncError(null);

    try {
      const apiKeyHeaders = getAPIKeyHeaders(keys);

      const response = await fetch("/api/youtube/channel", {
        headers: apiKeyHeaders,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Falha ao sincronizar canal");
      }

      setChannelData(data);
      setSyncError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao sincronizar canal";
      setSyncError(errorMessage);
    } finally {
      setIsSyncingChannel(false);
    }
  };

  const handleProceed = () => {
    if (!theme.trim()) {
      setError("Por favor, defina um tema para o vídeo.");
      return;
    }

    const contextData = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      theme: theme.trim(),
      autoMode,
      metrics,
      channelData,
    };

    setContext(contextData);
    setStep(2);
    router.push("/step/2-research");
  };

  const hasEnoughData = theme.trim().length > 0;

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div {...fadeInUp}>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Menu de Entrada
          </h1>
          <p className="text-zinc-400">
            Configure o contexto inicial para a produção do seu vídeo.
          </p>
        </motion.div>

        {/* Quick Connect Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-cyan-500/10 border border-violet-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30">
                  <Zap className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Configure suas conexões</p>
                  <p className="text-sm text-zinc-400">
                    Conecte APIs de IA, YouTube e outras integrações
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setConnectApisModalOpen(true)}
                leftIcon={<Wifi className="w-4 h-4" />}
                className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border-0"
              >
                Conectar APIs
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 backdrop-blur-sm"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300 transition-colors"
              >
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CSV Upload */}
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Card className="h-full bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Upload className="w-4 h-4 text-blue-400" />
                  </div>
                  Upload de Métricas
                </CardTitle>
                <CardDescription>
                  Faça upload do CSV exportado do YouTube Studio com métricas dos seus vídeos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileDropzone
                  onFileAccepted={handleCsvUpload}
                  currentFile={csvFile}
                  onRemove={() => {
                    setCsvFile(null);
                    setMetrics([]);
                  }}
                  accept={{ "text/csv": [".csv"] }}
                  label="Upload CSV do YouTube Studio"
                  description="Arraste o arquivo ou clique para selecionar"
                />

                <AnimatePresence>
                  {metrics.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                    >
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Check className="w-4 h-4" />
                        <span className="font-medium">
                          {metrics.length} vídeos carregados
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-zinc-400">
                        Total de views:{" "}
                        <span className="text-white font-medium">
                          {formatNumber(metrics.reduce((sum, m) => sum + m.views, 0))}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* YouTube Sync */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card className="h-full bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <Youtube className="w-4 h-4 text-red-400" />
                  </div>
                  Sincronizar Canal
                </CardTitle>
                <CardDescription>
                  Conecte com a API do YouTube para obter dados em tempo real do seu canal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingKeys ? (
                  <CardSkeleton />
                ) : !apiKeyStatus?.youtube ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-300 font-medium">YouTube API não configurada</p>
                          <p className="text-amber-300/70 text-sm mt-1">
                            Configure sua API Key e Channel ID para sincronizar dados do canal.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => setConnectApisModalOpen(true)}
                      leftIcon={<Settings2 className="w-4 h-4" />}
                      variant="outline"
                      className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                      Configurar YouTube API
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      onClick={handleSyncChannel}
                      isLoading={isSyncingChannel}
                      leftIcon={<RefreshCw className="w-4 h-4" />}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 border-0"
                    >
                      {channelData ? "Atualizar Dados" : "Sincronizar Canal"}
                    </Button>

                    {/* Sync Error */}
                    <AnimatePresence>
                      {syncError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                        >
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-red-300 font-medium">Erro na sincronização</p>
                              <p className="text-red-300/70 text-sm mt-1 font-mono break-all">
                                {syncError}
                              </p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setConnectApisModalOpen(true)}
                                className="mt-2 text-red-400 hover:text-red-300"
                              >
                                Verificar configuração
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Channel Data */}
                    <AnimatePresence>
                      {channelData && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="mt-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-red-500/20">
                              <Youtube className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {channelData.title}
                              </p>
                              <p className="text-sm text-zinc-400">
                                {formatNumber(channelData.subscriberCount)} inscritos
                              </p>
                            </div>
                            <Badge variant="success" className="ml-auto">
                              Conectado
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Vídeos</p>
                              <p className="text-white font-semibold text-lg mt-1">
                                {formatNumber(channelData.videoCount)}
                              </p>
                            </div>
                            <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Views Total</p>
                              <p className="text-white font-semibold text-lg mt-1">
                                {formatNumber(channelData.viewCount)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Theme Definition */}
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                Definição de Tema
              </CardTitle>
              <CardDescription>
                Sobre o que vamos falar hoje? A IA pode sugerir ajustes baseados nos dados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Tema do Vídeo"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ex: Como criar um canal do YouTube em 2024"
                className="text-lg bg-zinc-950 border-zinc-800 focus:border-violet-500"
              />

              <Toggle
                checked={autoMode}
                onChange={setAutoMode}
                label="Modo Automático"
                description="Se ativado, a IA pode sugerir ajustes no tema baseado nos dados de performance do seu canal."
              />

              <AnimatePresence>
                {autoMode && (metrics.length > 0 || channelData) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3"
                  >
                    <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-300 font-medium">Modo Híbrido Ativado</p>
                      <p className="text-blue-300/70 text-sm mt-1">
                        A IA irá analisar os dados disponíveis e pode sugerir
                        melhorias no tema, mas sempre respeitando sua escolha
                        original.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Summary */}
        <AnimatePresence>
          {(metrics.length > 0 || channelData) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card padding="sm" className="bg-zinc-900/30 border-zinc-800/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Dados Carregados
                    </Badge>
                    {metrics.length > 0 && (
                      <span className="text-sm text-zinc-400">
                        {metrics.length} vídeos do CSV
                      </span>
                    )}
                    {channelData && (
                      <span className="text-sm text-zinc-400">
                        Canal sincronizado
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Eye className="w-4 h-4" />}
                    className="text-zinc-400 hover:text-white"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <Button
            onClick={handleProceed}
            disabled={!hasEnoughData}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border-0 disabled:from-zinc-700 disabled:to-zinc-700"
          >
            Continuar para Inteligência
          </Button>
        </motion.div>
      </div>

      <GuidelinesModal />
      <ApiKeysModal />
      <ConnectApisModal />
    </Layout>
  );
}
