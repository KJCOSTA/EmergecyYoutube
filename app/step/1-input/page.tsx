"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import GuidelinesModal from "@/components/GuidelinesModal";
import ApiKeysModal from "@/components/ApiKeysModal";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import FileDropzone from "@/components/FileDropzone";
import Badge from "@/components/ui/Badge";
import { useWorkflowStore } from "@/lib/store";
import { checkAPIKeys } from "@/lib/api-keys";
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
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function Step1Input() {
  const router = useRouter();
  const { setContext, setStep, context } = useWorkflowStore();

  const [apiKeyStatus, setApiKeyStatus] = useState<APIKeyStatus | null>(null);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);

  // Form state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [metrics, setMetrics] = useState<ChannelMetrics[]>([]);
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [isSyncingChannel, setIsSyncingChannel] = useState(false);
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
    if (!apiKeyStatus?.youtube) {
      setError("YouTube API não configurada. Adicione as chaves nas configurações.");
      return;
    }

    setIsSyncingChannel(true);
    setError(null);

    try {
      const response = await fetch("/api/youtube/channel");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao sincronizar canal");
      }
      const data = await response.json();
      setChannelData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao sincronizar canal");
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

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Menu de Entrada
          </h1>
          <p className="text-gray-400">
            Configure o contexto inicial para a produção do seu vídeo.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CSV Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-500" />
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

              {metrics.length > 0 && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">
                      {metrics.length} vídeos carregados
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Total de views:{" "}
                    {formatNumber(metrics.reduce((sum, m) => sum + m.views, 0))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* YouTube Sync */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                Sincronizar Canal
              </CardTitle>
              <CardDescription>
                Conecte com a API do YouTube para obter dados em tempo real do seu canal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingKeys ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : !apiKeyStatus?.youtube ? (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    YouTube API não configurada. Adicione YOUTUBE_API_KEY e
                    YOUTUBE_CHANNEL_ID nas variáveis de ambiente.
                  </p>
                </div>
              ) : (
                <>
                  <Button
                    onClick={handleSyncChannel}
                    isLoading={isSyncingChannel}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                    className="w-full"
                  >
                    {channelData ? "Atualizar Dados" : "Sincronizar Canal"}
                  </Button>

                  {channelData && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                          <Youtube className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {channelData.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatNumber(channelData.subscriberCount)} inscritos
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <p className="text-gray-400">Vídeos</p>
                          <p className="text-white font-medium">
                            {formatNumber(channelData.videoCount)}
                          </p>
                        </div>
                        <div className="p-2 bg-gray-800 rounded-lg">
                          <p className="text-gray-400">Views Total</p>
                          <p className="text-white font-medium">
                            {formatNumber(channelData.viewCount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Theme Definition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
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
              className="text-lg"
            />

            <Toggle
              checked={autoMode}
              onChange={setAutoMode}
              label="Modo Automático"
              description="Se ativado, a IA pode sugerir ajustes no tema baseado nos dados de performance do seu canal."
            />

            {autoMode && (metrics.length > 0 || channelData) && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-300 font-medium">Modo Híbrido Ativado</p>
                  <p className="text-blue-300/70 text-sm mt-1">
                    A IA irá analisar os dados disponíveis e pode sugerir
                    melhorias no tema, mas sempre respeitando sua escolha
                    original.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Summary */}
        {(metrics.length > 0 || channelData) && (
          <Card padding="sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="success">Dados Carregados</Badge>
                {metrics.length > 0 && (
                  <span className="text-sm text-gray-400">
                    {metrics.length} vídeos do CSV
                  </span>
                )}
                {channelData && (
                  <span className="text-sm text-gray-400">
                    Canal sincronizado
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Eye className="w-4 h-4" />}
              >
                Ver Detalhes
              </Button>
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-end">
          <Button
            onClick={handleProceed}
            disabled={!hasEnoughData}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            size="lg"
          >
            Continuar para Inteligência
          </Button>
        </div>
      </div>

      <GuidelinesModal />
      <ApiKeysModal />
    </Layout>
  );
}
