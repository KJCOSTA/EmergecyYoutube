"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import GuidelinesModal from "@/components/GuidelinesModal";
import ApiKeysModal from "@/components/ApiKeysModal";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useWorkflowStore } from "@/lib/store";
import { checkAPIKeys } from "@/lib/api-keys";
import { APIKeyStatus } from "@/types";
import { downloadJSON } from "@/lib/utils";
import {
  Upload,
  ArrowLeft,
  AlertCircle,
  Play,
  Youtube,
  FileVideo,
  FileText,
  Tag,
  Image,
  Download,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

export default function Step6Upload() {
  const router = useRouter();
  const { context, proposal, storyboard, render, upload, setUpload, resetWorkflow } =
    useWorkflowStore();

  const [apiKeyStatus, setApiKeyStatus] = useState<APIKeyStatus | null>(null);
  const [, setIsLoadingKeys] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load API keys
  useEffect(() => {
    checkAPIKeys().then((status) => {
      setApiKeyStatus(status);
      setIsLoadingKeys(false);
    });
  }, []);

  // Redirect if no render
  useEffect(() => {
    if (!context || !proposal || !render?.videoUrl) {
      router.push("/step/5-studio");
    }
  }, [context, proposal, render, router]);

  const handleUpload = async () => {
    if (!proposal || !render) return;
    setIsUploading(true);
    setError(null);

    try {
      // Note: Real YouTube upload requires OAuth2 authentication
      // This is a simulation showing what the upload would do
      const selectedTitle = proposal.titlesAndThumbs.variations.find(
        (v) => v.id === proposal.titlesAndThumbs.selectedVariation
      );

      const response = await fetch("/api/youtube/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: proposal.id,
          renderId: render.id,
          videoUrl: render.videoUrl,
          title: selectedTitle?.title || context?.theme || "Video",
          description: proposal.description.content,
          tags: proposal.tags.items,
          thumbnailUrl: selectedTitle?.thumbnailUrl,
          uploadSetup: proposal.uploadSetup,
          accessToken: "", // Would come from OAuth2 flow
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const uploadData = await response.json();
      setUpload(uploadData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload");
    } finally {
      setIsUploading(false);
    }
  };

  const exportAllData = () => {
    const exportData = {
      context,
      proposal,
      storyboard,
      render,
      upload,
      exportedAt: new Date().toISOString(),
    };
    downloadJSON(exportData, `emergency-youtube-export-${Date.now()}.json`);
  };

  const handleStartNew = () => {
    if (confirm("Tem certeza que deseja iniciar um novo projeto? Todos os dados serão perdidos.")) {
      resetWorkflow();
      router.push("/step/1-input");
    }
  };

  if (!context || !proposal || !render) {
    return null;
  }

  const selectedTitle = proposal.titlesAndThumbs.variations.find(
    (v) => v.id === proposal.titlesAndThumbs.selectedVariation
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Finalização e Upload
          </h1>
          <p className="text-gray-400">
            Revise seu vídeo e envie para o YouTube.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              ×
            </button>
          </div>
        )}

        {/* Video Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-green-500" />
              Preview do Vídeo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video src={render.videoUrl || undefined} controls className="w-full h-full" />
            </div>
          </CardContent>
        </Card>

        {/* Metadata Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title & Thumbnail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5 text-purple-500" />
                Título e Thumbnail
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTitle ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Título</p>
                    <p className="text-lg font-medium text-white">{selectedTitle.title}</p>
                  </div>
                  {selectedTitle.thumbnailUrl && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Thumbnail</p>
                      <img
                        src={selectedTitle.thumbnailUrl}
                        alt={selectedTitle.title}
                        className="rounded-lg max-w-xs"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum título selecionado</p>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Descrição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                  {proposal.description.content}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-yellow-500" />
                Tags ({proposal.tags.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-auto">
                {proposal.tags.items.map((tag, i) => (
                  <Badge key={i} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileVideo className="w-5 h-5 text-green-500" />
                Configurações de Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Categoria</p>
                  <p className="text-white">{getCategoryName(proposal.uploadSetup.category)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Idioma</p>
                  <p className="text-white">{getLanguageName(proposal.uploadSetup.language)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Licença</p>
                  <p className="text-white">
                    {proposal.uploadSetup.license === "youtube"
                      ? "YouTube Standard"
                      : "Creative Commons"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Para Crianças</p>
                  <p className="text-white">{proposal.uploadSetup.madeForKids ? "Sim" : "Não"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className={upload?.status === "published" ? "border-green-500/50" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" />
              Upload para YouTube
            </CardTitle>
            <CardDescription>
              Envie seu vídeo diretamente para o YouTube.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!apiKeyStatus?.youtube ? (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  YouTube API não configurada. Adicione as chaves YOUTUBE_API_KEY e
                  YOUTUBE_CLIENT_ID/SECRET para habilitar o upload.
                </p>
              </div>
            ) : upload ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      upload.status === "published"
                        ? "success"
                        : upload.status === "error"
                        ? "error"
                        : "info"
                    }
                  >
                    {upload.status === "uploading"
                      ? "Enviando..."
                      : upload.status === "processing"
                      ? "Processando..."
                      : upload.status === "published"
                      ? "Publicado!"
                      : upload.status === "error"
                      ? "Erro"
                      : "Pendente"}
                  </Badge>
                </div>

                {upload.youtubeUrl && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-300 mb-2">Vídeo publicado com sucesso!</p>
                    <a
                      href={upload.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-400 hover:text-green-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver no YouTube
                    </a>
                  </div>
                )}

                {upload.error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-300 text-sm">{upload.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    <strong>Nota:</strong> O upload para o YouTube requer autenticação OAuth2.
                    Em produção, você será redirecionado para autorizar o acesso ao seu canal.
                  </p>
                </div>
                <Button
                  onClick={handleUpload}
                  isLoading={isUploading}
                  leftIcon={<Upload className="w-4 h-4" />}
                  size="lg"
                >
                  Confirmar e Enviar para o YouTube
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export & Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Exportar Dados</CardTitle>
            <CardDescription>
              Baixe todos os dados do projeto em formato JSON.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={exportAllData} leftIcon={<Download className="w-4 h-4" />}>
                Exportar Projeto Completo
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  downloadJSON(proposal, `proposal-${proposal.id}.json`)
                }
                leftIcon={<Download className="w-4 h-4" />}
              >
                Exportar Proposta
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  storyboard && downloadJSON(storyboard, `storyboard-${storyboard.id}.json`)
                }
                leftIcon={<Download className="w-4 h-4" />}
                disabled={!storyboard}
              >
                Exportar Storyboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/step/5-studio")}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Voltar
          </Button>

          <Button
            onClick={handleStartNew}
            variant="secondary"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Iniciar Novo Projeto
          </Button>
        </div>
      </div>

      <GuidelinesModal />
      <ApiKeysModal />
    </Layout>
  );
}

function getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    "1": "Film & Animation",
    "2": "Autos & Vehicles",
    "10": "Music",
    "15": "Pets & Animals",
    "17": "Sports",
    "19": "Travel & Events",
    "20": "Gaming",
    "22": "People & Blogs",
    "23": "Comedy",
    "24": "Entertainment",
    "25": "News & Politics",
    "26": "Howto & Style",
    "27": "Education",
    "28": "Science & Technology",
  };
  return categories[categoryId] || categoryId;
}

function getLanguageName(languageCode: string): string {
  const languages: Record<string, string> = {
    pt: "Português",
    en: "English",
    es: "Español",
  };
  return languages[languageCode] || languageCode;
}
