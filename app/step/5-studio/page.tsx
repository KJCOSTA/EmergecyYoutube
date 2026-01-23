"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { useWorkflowStore } from "@/lib/store";
import { checkAPIKeys } from "@/lib/api-keys";
import { APIKeyStatus, StoryboardData, MediaItem, MediaSource } from "@/types";
import { formatDuration } from "@/lib/utils";
import {
  Film,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Play,
  Image,
  Search,
  GripVertical,
  Trash2,
  Plus,
  Video,
} from "lucide-react";

export default function Step5Studio() {
  const router = useRouter();
  const { context, proposal, storyboard, render, setStoryboard, setRender, updateRender, setStep } =
    useWorkflowStore();

  const [apiKeyStatus, setApiKeyStatus] = useState<APIKeyStatus | null>(null);
  const [, setIsLoadingKeys] = useState(true);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);
  const [isSearchingMedia, setIsSearchingMedia] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Media search state
  const [mediaSearchResults, setMediaSearchResults] = useState<Record<string, MediaItem[]>>({});
  const [selectedSources, setSelectedSources] = useState<MediaSource[]>(["pexels", "pixabay", "unsplash"]);

  // Load API keys
  useEffect(() => {
    checkAPIKeys().then((status) => {
      setApiKeyStatus(status);
      setIsLoadingKeys(false);

      // Auto-select available sources
      const sources: MediaSource[] = [];
      if (status.pexels) sources.push("pexels");
      if (status.pixabay) sources.push("pixabay");
      if (status.unsplash) sources.push("unsplash");
      setSelectedSources(sources);
    });
  }, []);

  // Redirect if no proposal
  useEffect(() => {
    if (!context || !proposal || !proposal.allApproved) {
      router.push("/step/4-proposal");
    }
  }, [context, proposal, router]);

  const generateStoryboard = async () => {
    if (!proposal) return;
    setIsGeneratingStoryboard(true);
    setError(null);

    try {
      const response = await fetch("/api/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: proposal.id,
          script: proposal.script,
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const storyboardData: StoryboardData = await response.json();
      setStoryboard(storyboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar storyboard");
    } finally {
      setIsGeneratingStoryboard(false);
    }
  };

  const searchMediaForScene = async (sceneId: string, query: string) => {
    setIsSearchingMedia(sceneId);
    setError(null);

    try {
      const response = await fetch("/api/media/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          sources: selectedSources,
          mediaType: "all",
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const { results } = await response.json();
      setMediaSearchResults((prev) => ({ ...prev, [sceneId]: results }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na busca de mídia");
    } finally {
      setIsSearchingMedia(null);
    }
  };

  const selectMediaForScene = (sceneId: string, media: MediaItem) => {
    if (!storyboard) return;

    const updatedScenes = storyboard.scenes.map((scene) =>
      scene.id === sceneId ? { ...scene, media } : scene
    );

    setStoryboard({
      ...storyboard,
      scenes: updatedScenes,
    });

    // Clear search results for this scene
    setMediaSearchResults((prev) => {
      const updated = { ...prev };
      delete updated[sceneId];
      return updated;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateSceneOrder = (fromIndex: number, toIndex: number) => {
    if (!storyboard) return;

    const scenes = [...storyboard.scenes];
    const [movedScene] = scenes.splice(fromIndex, 1);
    scenes.splice(toIndex, 0, movedScene);

    // Update order property
    const reorderedScenes = scenes.map((scene, i) => ({ ...scene, order: i }));

    setStoryboard({
      ...storyboard,
      scenes: reorderedScenes,
    });
  };

  const startRender = async () => {
    if (!storyboard || !proposal) return;
    setIsRendering(true);
    setError(null);

    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyboardId: storyboard.id,
          scenes: storyboard.scenes,
          soundtrack: proposal.soundtrack.selected
            ? proposal.soundtrack.suggestions.find((s) => s.id === proposal.soundtrack.selected)
            : null,
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const renderData = await response.json();
      setRender(renderData);

      // Poll for render status
      pollRenderStatus(renderData.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao iniciar renderização");
      setIsRendering(false);
    }
  };

  const pollRenderStatus = async (jobId: string) => {
    try {
      const response = await fetch(`/api/render?jobId=${jobId}`);
      if (!response.ok) throw new Error("Erro ao verificar status");

      const status = await response.json();
      updateRender(status);

      if (status.status === "rendering") {
        setTimeout(() => pollRenderStatus(jobId), 5000);
      } else {
        setIsRendering(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao verificar renderização");
      setIsRendering(false);
    }
  };

  const handleProceed = () => {
    if (render?.status === "completed") {
      setStep(6);
      router.push("/step/6-upload");
    }
  };

  if (!context || !proposal) {
    return null;
  }

  const allScenesHaveMedia = storyboard?.scenes.every((scene) => scene.media !== null) ?? false;
  const canRender = storyboard && allScenesHaveMedia && apiKeyStatus?.json2video;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Studio de Criação
        </h1>
        <p className="text-gray-400">
          Popule cada cena com mídia, revise e renderize seu vídeo.
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

        {/* Storyboard Generation */}
        {!storyboard && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-500" />
                Gerar Storyboard
              </CardTitle>
              <CardDescription>
                O storyboard divide o roteiro aprovado em cenas individuais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={generateStoryboard}
                isLoading={isGeneratingStoryboard}
                leftIcon={<Film className="w-4 h-4" />}
              >
                Gerar Storyboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Storyboard Scenes */}
        {storyboard && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Storyboard ({storyboard.scenes.length} cenas)
                </h2>
                <p className="text-sm text-gray-400">
                  Duração total: {formatDuration(storyboard.totalDuration)}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant={allScenesHaveMedia ? "success" : "warning"}>
                  {storyboard.scenes.filter((s) => s.media).length}/{storyboard.scenes.length} com mídia
                </Badge>
              </div>
            </div>

            {/* Media Sources Filter */}
            <Card padding="sm">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Fontes de mídia:</span>
                {(["pexels", "pixabay", "unsplash"] as MediaSource[]).map((source) => {
                  const isAvailable = apiKeyStatus?.[source as keyof APIKeyStatus];
                  const isSelected = selectedSources.includes(source);

                  return (
                    <button
                      key={source}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedSources((prev) =>
                            prev.includes(source)
                              ? prev.filter((s) => s !== source)
                              : [...prev, source]
                          );
                        }
                      }}
                      disabled={!isAvailable}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        !isAvailable
                          ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                          : isSelected
                          ? "bg-primary-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Scenes List */}
            <div className="space-y-4">
              {storyboard.scenes.map((scene, index) => (
                <Card key={scene.id} padding="sm">
                  <div className="flex gap-4">
                    {/* Drag Handle */}
                    <div className="flex items-center">
                      <GripVertical className="w-5 h-5 text-gray-600 cursor-move" />
                    </div>

                    {/* Scene Number */}
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-gray-400">{index + 1}</span>
                    </div>

                    {/* Media Preview */}
                    <div className="w-32 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {scene.media ? (
                        scene.media.type === "video" ? (
                          <video
                            src={scene.media.previewUrl}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={scene.media.previewUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Scene Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="info" size="sm">
                          {formatDuration(scene.duration)}
                        </Badge>
                        {scene.media && (
                          <Badge variant="success" size="sm">
                            {scene.media.source}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">{scene.text}</p>

                      {/* Media Source Info */}
                      {scene.media && (
                        <p className="text-xs text-gray-500 mt-1">{scene.media.attribution}</p>
                      )}
                    </div>

                    {/* Scene Actions */}
                    <div className="flex flex-col gap-2">
                      <SearchMediaButton
                        sceneText={scene.text}
                        isSearching={isSearchingMedia === scene.id}
                        onSearch={(query) => searchMediaForScene(scene.id, query)}
                      />
                      {scene.media && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const updatedScenes = storyboard.scenes.map((s) =>
                              s.id === scene.id ? { ...s, media: null } : s
                            );
                            setStoryboard({ ...storyboard, scenes: updatedScenes });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Media Search Results */}
                  {mediaSearchResults[scene.id] && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400">
                          {mediaSearchResults[scene.id].length} resultados encontrados
                        </span>
                        <button
                          onClick={() =>
                            setMediaSearchResults((prev) => {
                              const updated = { ...prev };
                              delete updated[scene.id];
                              return updated;
                            })
                          }
                          className="text-sm text-gray-500 hover:text-gray-400"
                        >
                          Fechar
                        </button>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {mediaSearchResults[scene.id].slice(0, 16).map((media) => (
                          <button
                            key={media.id}
                            onClick={() => selectMediaForScene(scene.id, media)}
                            className="aspect-video bg-gray-800 rounded overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all"
                          >
                            <img
                              src={media.previewUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Render Section */}
        {storyboard && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-green-500" />
                Renderização
              </CardTitle>
              <CardDescription>
                Combine todas as cenas em um vídeo final.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!apiKeyStatus?.json2video ? (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-300 text-sm">
                    JSON2Video API não configurada. Adicione JSON2VIDEO_API_KEY para habilitar a
                    renderização.
                  </p>
                </div>
              ) : render ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        render.status === "completed"
                          ? "success"
                          : render.status === "error"
                          ? "error"
                          : "info"
                      }
                    >
                      {render.status === "rendering"
                        ? `Renderizando... ${render.progress}%`
                        : render.status === "completed"
                        ? "Concluído"
                        : render.status === "error"
                        ? "Erro"
                        : "Pendente"}
                    </Badge>
                    {render.status === "rendering" && (
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 transition-all"
                          style={{ width: `${render.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {render.videoUrl && (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video src={render.videoUrl} controls className="w-full h-full" />
                    </div>
                  )}

                  {render.error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-red-300 text-sm">{render.error}</p>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={startRender}
                  isLoading={isRendering}
                  disabled={!canRender}
                  leftIcon={<Play className="w-4 h-4" />}
                >
                  Renderizar Vídeo
                </Button>
              )}

              {!allScenesHaveMedia && (
                <p className="text-sm text-yellow-400 mt-3">
                  Todas as cenas precisam ter mídia antes de renderizar.
                </p>
              )}
            </CardContent>
          </Card>
        )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/step/4-proposal")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Voltar
        </Button>

        <Button
          onClick={handleProceed}
          disabled={render?.status !== "completed"}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          size="lg"
        >
          Continuar para Upload
        </Button>
      </div>
    </div>
  );
}

// Search Media Button Component
function SearchMediaButton({
  sceneText,
  isSearching,
  onSearch,
}: {
  sceneText: string;
  isSearching: boolean;
  onSearch: (query: string) => void;
}) {
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setShowInput(false);
      setQuery("");
    }
  };

  // Auto-generate search query from scene text
  const autoSearch = () => {
    const keywords = sceneText.split(" ").slice(0, 5).join(" ");
    onSearch(keywords);
  };

  if (showInput) {
    return (
      <div className="flex gap-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          className="w-32 text-sm py-1"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button size="sm" onClick={handleSearch}>
          <Search className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={autoSearch}
        isLoading={isSearching}
      >
        <Search className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setShowInput(true)}
        title="Busca personalizada"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
