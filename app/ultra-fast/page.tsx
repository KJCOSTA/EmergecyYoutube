"use client";

import { useState } from "react";
import {
  Sparkles,
  Edit3,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  Search,
  Upload,
  Film,
  Download,
  Play,
  Music,
  Mic,
  Settings as SettingsIcon,
  Loader2,
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
  Video as VideoIcon,
  Clock,
} from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

// Tipos
type Step = "config" | "script" | "media" | "render" | "complete";

interface ScriptSection {
  id: string;
  text: string;
  duration: number;
  order: number;
  regenerating?: boolean;
}

interface MediaOption {
  id: string;
  url: string;
  thumbnail: string;
  type: "image" | "video";
  source: "pexels" | "pixabay" | "unsplash";
  selected?: boolean;
}

interface SceneMedia {
  sceneId: string;
  options: MediaOption[];
  selected: MediaOption | null;
}

export default function UltraFastV2() {
  // Estado do fluxo
  const [currentStep, setCurrentStep] = useState<Step>("config");
  const [theme, setTheme] = useState("");
  const [targetDuration, setTargetDuration] = useState(540); // 9 minutos = 540s

  // Estado do roteiro
  const [scriptSections, setScriptSections] = useState<ScriptSection[]>([]);
  const [generatingScript, setGeneratingScript] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Estado da mídia
  const [scenesMedia, setScenesMedia] = useState<SceneMedia[]>([]);
  const [searchingMedia, setSearchingMedia] = useState(false);
  const [expandedScene, setExpandedScene] = useState<string | null>(null);

  // Estado da renderização
  const [renderConfig, setRenderConfig] = useState({
    quality: "hd" as "hd" | "4k",
    soundtrack: null as string | null,
    tts: "none" as "none" | "openai" | "elevenlabs" | "google",
    ttsVoice: "alloy",
    subtitles: false,
  });
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  // ==================== FUNÇÕES ====================

  // Gerar roteiro inicial
  const handleGenerateScript = async () => {
    if (!theme.trim()) {
      setError("Digite um tema para o vídeo");
      return;
    }

    setGeneratingScript(true);
    setError(null);

    try {
      const response = await fetch("/api/ultra-fast-v2/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, targetDuration }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar roteiro");
      }

      const data = await response.json();
      setScriptSections(data.sections);
      setCurrentStep("script");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar roteiro");
    } finally {
      setGeneratingScript(false);
    }
  };

  // Regenerar seção específica
  const handleRegenerateSection = async (sectionId: string) => {
    const section = scriptSections.find((s) => s.id === sectionId);
    if (!section) return;

    // Marcar seção como sendo regenerada
    setScriptSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, regenerating: true } : s))
    );
    setError(null);

    try {
      const response = await fetch("/api/ultra-fast-v2/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          currentText: section.text,
          duration: section.duration,
          context: scriptSections.map(s => s.text).join(" "),
        }),
      });

      const data = await response.json();

      // Se houver erro na API, mostrar o erro real
      if (!response.ok) {
        throw new Error(data.error || data.details || "Falha ao regenerar seção");
      }

      // Atualizar seção com novo texto
      setScriptSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, text: data.text, regenerating: false } : s))
      );
    } catch (err) {
      // Remover flag de regenerating
      setScriptSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, regenerating: false } : s))
      );

      // Mostrar erro detalhado
      const errorMessage = err instanceof Error ? err.message : "Erro ao regenerar seção";
      setError(`Erro ao regenerar seção: ${errorMessage}`);
      console.error("Regenerate error:", err);
    }
  };

  // Adicionar nova seção
  const handleAddSection = () => {
    const newSection: ScriptSection = {
      id: `section-${Date.now()}`,
      text: "Nova seção - edite o texto aqui...",
      duration: 30,
      order: scriptSections.length,
    };
    setScriptSections([...scriptSections, newSection]);
  };

  // Remover seção
  const handleRemoveSection = (sectionId: string) => {
    setScriptSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  // Atualizar texto da seção
  const handleUpdateSection = (sectionId: string, text: string) => {
    setScriptSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, text } : s))
    );
  };

  // Atualizar duração da seção
  const handleUpdateDuration = (sectionId: string, duration: number) => {
    setScriptSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, duration } : s))
    );
  };

  // Aprovar roteiro e buscar mídia
  const handleApproveScript = async () => {
    setSearchingMedia(true);
    setError(null);

    try {
      const response = await fetch("/api/ultra-fast-v2/media-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: scriptSections }),
      });

      if (!response.ok) throw new Error("Falha ao buscar mídia");

      const data = await response.json();
      setScenesMedia(data.scenes);
      setCurrentStep("media");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar mídia");
    } finally {
      setSearchingMedia(false);
    }
  };

  // Selecionar mídia para cena
  const handleSelectMedia = (sceneId: string, mediaId: string) => {
    setScenesMedia((prev) =>
      prev.map((scene) => {
        if (scene.sceneId !== sceneId) return scene;

        const selected = scene.options.find((opt) => opt.id === mediaId) || null;
        return { ...scene, selected };
      })
    );
  };

  // Buscar mais mídia para cena
  const handleSearchMoreMedia = async (sceneId: string) => {
    const section = scriptSections.find((s) => s.id === sceneId);
    if (!section) return;

    try {
      const response = await fetch("/api/ultra-fast-v2/media-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: [section] }),
      });

      if (!response.ok) throw new Error("Falha ao buscar mais mídia");

      const data = await response.json();
      if (data.scenes.length > 0) {
        setScenesMedia((prev) =>
          prev.map((scene) =>
            scene.sceneId === sceneId
              ? { ...scene, options: [...scene.options, ...data.scenes[0].options] }
              : scene
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar mais mídia");
    }
  };

  // Aprovar mídia e ir para renderização
  const handleApproveMedia = () => {
    const allSelected = scenesMedia.every((scene) => scene.selected !== null);

    if (!allSelected) {
      setError("Selecione mídia para todas as cenas antes de continuar");
      return;
    }

    setCurrentStep("render");
    setError(null);
  };

  // Renderizar vídeo
  const handleRenderVideo = async () => {
    setRendering(true);
    setRenderProgress(0);
    setError(null);

    try {
      // Montar storyboard final
      const storyboard = scriptSections.map((section) => {
        const sceneMedia = scenesMedia.find((s) => s.sceneId === section.id);
        return {
          id: section.id,
          text: section.text,
          duration: section.duration,
          media: sceneMedia?.selected || null,
        };
      });

      const response = await fetch("/api/ultra-fast-v2/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyboard,
          config: renderConfig,
        }),
      });

      if (!response.ok) throw new Error("Falha ao renderizar vídeo");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("Streaming não suportado");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));

            if (data.progress !== undefined) {
              setRenderProgress(data.progress);
            }

            if (data.status === "completed" && data.videoUrl) {
              setVideoUrl(data.videoUrl);
              setCurrentStep("complete");
              setRendering(false);
            } else if (data.status === "error") {
              throw new Error(data.error || "Erro na renderização");
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao renderizar vídeo");
      setRendering(false);
    }
  };

  // Calcular duração total
  const totalDuration = scriptSections.reduce((sum, s) => sum + s.duration, 0);
  const totalMinutes = Math.floor(totalDuration / 60);
  const totalSeconds = totalDuration % 60;

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-layer-0 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-purple-500" />
            Ultra-Fast Video
          </h1>
          <p className="text-muted text-lg">
            Crie vídeos de 9 minutos com controle total em cada etapa
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2">
          {[
            { key: "config", label: "Configuração" },
            { key: "script", label: "Roteiro" },
            { key: "media", label: "Mídia" },
            { key: "render", label: "Renderização" },
            { key: "complete", label: "Completo" },
          ].map((step, idx) => {
            const steps: Step[] = ["config", "script", "media", "render", "complete"];
            const currentIdx = steps.indexOf(currentStep);
            const stepIdx = steps.indexOf(step.key as Step);
            const isActive = stepIdx === currentIdx;
            const isCompleted = stepIdx < currentIdx;

            return (
              <div key={step.key} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    isActive
                      ? "bg-purple-500 border-purple-500 text-white"
                      : isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-layer-2 border-subtle text-muted"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                {idx < 4 && (
                  <div
                    className={`w-12 h-0.5 ${
                      isCompleted ? "bg-green-500" : "bg-subtle"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mensagem de erro global */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        )}

        {/* ETAPA 1: CONFIGURAÇÃO */}
        {currentStep === "config" && (
          <Card>
            <CardHeader>
              <CardTitle>Configure seu vídeo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tema do vídeo *
                </label>
                <Textarea
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Ex: Como criar vídeos profissionais com IA, Estratégias de marketing digital para 2026..."
                  rows={3}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Duração alvo (minutos)
                </label>
                <input
                  type="number"
                  value={targetDuration / 60}
                  onChange={(e) => setTargetDuration(Number(e.target.value) * 60)}
                  min={1}
                  max={15}
                  className="w-32 px-4 py-2 bg-layer-2 border border-subtle rounded-lg text-white"
                />
                <span className="ml-2 text-muted">minutos (~{Math.round(targetDuration / 60 * 15)}-{Math.round(targetDuration / 60 * 20)} seções)</span>
              </div>

              <Button
                onClick={handleGenerateScript}
                disabled={generatingScript || !theme.trim()}
                className="w-full"
                size="lg"
              >
                {generatingScript ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Gerando roteiro...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar Roteiro
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ETAPA 2: ROTEIRO */}
        {currentStep === "script" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Roteiro ({scriptSections.length} seções)</span>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted">
                    <Clock className="w-4 h-4" />
                    Duração total: {totalMinutes}min {totalSeconds}s
                  </div>
                  <Button
                    onClick={handleAddSection}
                    variant="secondary"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Seção
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scriptSections.map((section, idx) => (
                <div
                  key={section.id}
                  className="p-4 bg-layer-2 border border-subtle rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      Seção {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={section.duration}
                        onChange={(e) =>
                          handleUpdateDuration(section.id, Number(e.target.value))
                        }
                        className="w-20 px-2 py-1 text-sm bg-layer-1 border border-subtle rounded text-white"
                        min={10}
                        max={120}
                      />
                      <span className="text-xs text-muted">segundos</span>
                      <button
                        onClick={() => handleRegenerateSection(section.id)}
                        disabled={section.regenerating}
                        className={`p-1 hover:bg-layer-1 rounded transition-colors ${
                          section.regenerating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        title={section.regenerating ? "Regenerando..." : "Regenerar esta seção"}
                      >
                        <RefreshCw className={`w-4 h-4 text-blue-400 ${
                          section.regenerating ? "animate-spin" : ""
                        }`} />
                      </button>
                      <button
                        onClick={() => handleRemoveSection(section.id)}
                        className="p-1 hover:bg-layer-1 rounded transition-colors"
                        title="Remover seção"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {editingSection === section.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={section.text}
                        onChange={(e) => handleUpdateSection(section.id, e.target.value)}
                        rows={3}
                        className="w-full"
                      />
                      <Button
                        onClick={() => setEditingSection(null)}
                        size="sm"
                        variant="secondary"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Salvar
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => setEditingSection(section.id)}
                      className="p-3 bg-layer-1 rounded cursor-pointer hover:bg-layer-1/80 transition-colors"
                    >
                      <p className="text-sm text-muted">{section.text}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-blue-400">
                        <Edit3 className="w-3 h-3" />
                        Clique para editar
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-subtle">
                <Button
                  onClick={handleApproveScript}
                  disabled={searchingMedia || scriptSections.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {searchingMedia ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Buscando mídia...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Aprovar Roteiro e Buscar Mídia
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ETAPA 3: MÍDIA */}
        {currentStep === "media" && (
          <Card>
            <CardHeader>
              <CardTitle>Selecione a mídia para cada cena</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {scenesMedia.map((scene, idx) => {
                const section = scriptSections.find((s) => s.id === scene.sceneId);
                if (!section) return null;

                const isExpanded = expandedScene === scene.sceneId;

                return (
                  <div
                    key={scene.sceneId}
                    className="p-4 bg-layer-2 border border-subtle rounded-lg"
                  >
                    <div
                      onClick={() =>
                        setExpandedScene(isExpanded ? null : scene.sceneId)
                      }
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">
                            Cena {idx + 1}
                          </span>
                          {scene.selected && (
                            <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Selecionada
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted line-clamp-2">
                          {section.text}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-muted" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          {scene.options.map((media) => (
                            <div
                              key={media.id}
                              onClick={() => handleSelectMedia(scene.sceneId, media.id)}
                              className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                scene.selected?.id === media.id
                                  ? "border-green-500 ring-2 ring-green-500/50"
                                  : "border-transparent hover:border-blue-500"
                              }`}
                            >
                              <img
                                src={media.thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 right-2">
                                {media.type === "video" ? (
                                  <VideoIcon className="w-4 h-4 text-white drop-shadow" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-white drop-shadow" />
                                )}
                              </div>
                              {scene.selected?.id === media.id && (
                                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                  <Check className="w-8 h-8 text-white drop-shadow-lg" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={() => handleSearchMoreMedia(scene.sceneId)}
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Buscar mais opções
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-4 border-t border-subtle">
                <Button
                  onClick={handleApproveMedia}
                  className="w-full"
                  size="lg"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Aprovar Mídia e Configurar Renderização
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ETAPA 4: RENDERIZAÇÃO */}
        {currentStep === "render" && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Renderização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Qualidade */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Qualidade do vídeo
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "hd", label: "Full HD (1080p)", desc: "Mais rápido" },
                    { key: "4k", label: "4K (2160p)", desc: "Mais lento" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() =>
                        setRenderConfig({ ...renderConfig, quality: opt.key as "hd" | "4k" })
                      }
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        renderConfig.quality === opt.key
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-subtle bg-layer-2 hover:border-purple-500/50"
                      }`}
                    >
                      <div className="font-medium text-white">{opt.label}</div>
                      <div className="text-xs text-muted mt-1">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* TTS */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Narração (Text-to-Speech)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "none", label: "Sem narração", icon: null },
                    { key: "openai", label: "OpenAI TTS", icon: <Mic className="w-4 h-4" /> },
                    { key: "elevenlabs", label: "ElevenLabs", icon: <Mic className="w-4 h-4" /> },
                    { key: "google", label: "Google TTS", icon: <Mic className="w-4 h-4" /> },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() =>
                        setRenderConfig({ ...renderConfig, tts: opt.key as any })
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        renderConfig.tts === opt.key
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-subtle bg-layer-2 hover:border-purple-500/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-white">
                        {opt.icon}
                        <span className="text-sm">{opt.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Música de fundo */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Música de fundo
                </label>
                <select
                  value={renderConfig.soundtrack || ""}
                  onChange={(e) =>
                    setRenderConfig({
                      ...renderConfig,
                      soundtrack: e.target.value || null,
                    })
                  }
                  className="w-full px-4 py-2 bg-layer-2 border border-subtle rounded-lg text-white"
                >
                  <option value="">Sem música</option>
                  <option value="upbeat">Upbeat - Energético</option>
                  <option value="chill">Chill - Relaxante</option>
                  <option value="corporate">Corporate - Profissional</option>
                  <option value="cinematic">Cinematic - Épico</option>
                </select>
              </div>

              {/* Legendas */}
              <div className="flex items-center justify-between p-4 bg-layer-2 rounded-lg">
                <div>
                  <div className="font-medium text-white">Legendas automáticas</div>
                  <div className="text-xs text-muted mt-1">
                    Adiciona legendas sincronizadas com o áudio
                  </div>
                </div>
                <button
                  onClick={() =>
                    setRenderConfig({
                      ...renderConfig,
                      subtitles: !renderConfig.subtitles,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    renderConfig.subtitles ? "bg-purple-500" : "bg-layer-1"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      renderConfig.subtitles ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Resumo */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-sm font-medium text-blue-400 mb-2">
                  Resumo da renderização
                </div>
                <ul className="space-y-1 text-sm text-muted">
                  <li>• {scriptSections.length} cenas</li>
                  <li>• Duração: ~{totalMinutes}min {totalSeconds}s</li>
                  <li>• Qualidade: {renderConfig.quality === "4k" ? "4K" : "Full HD"}</li>
                  <li>
                    • Narração:{" "}
                    {renderConfig.tts === "none"
                      ? "Sem narração"
                      : renderConfig.tts === "openai"
                      ? "OpenAI TTS"
                      : renderConfig.tts === "elevenlabs"
                      ? "ElevenLabs"
                      : "Google TTS"}
                  </li>
                  <li>
                    • Música: {renderConfig.soundtrack || "Sem música"}
                  </li>
                </ul>
              </div>

              {rendering ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">Renderizando vídeo...</span>
                    <span className="text-purple-400">{renderProgress}%</span>
                  </div>
                  <div className="w-full bg-layer-2 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full transition-all duration-500"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted text-center">
                    Isso pode levar alguns minutos. Não feche esta página.
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleRenderVideo}
                  className="w-full"
                  size="lg"
                >
                  <Film className="w-5 h-5 mr-2" />
                  Renderizar Vídeo
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* ETAPA 5: COMPLETO */}
        {currentStep === "complete" && videoUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Check className="w-6 h-6" />
                Vídeo Pronto!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video src={videoUrl} controls className="w-full h-full">
                  Seu navegador não suporta vídeo.
                </video>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={videoUrl}
                  download
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Baixar Vídeo
                </a>
                <Button
                  onClick={() => {
                    setCurrentStep("config");
                    setTheme("");
                    setScriptSections([]);
                    setScenesMedia([]);
                    setVideoUrl(null);
                  }}
                  variant="secondary"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Novo Vídeo
                </Button>
              </div>

              <div className="p-4 bg-layer-2 rounded-lg">
                <div className="text-sm font-medium text-white mb-2">
                  Informações do vídeo
                </div>
                <ul className="space-y-1 text-sm text-muted">
                  <li>• Duração: {totalMinutes}min {totalSeconds}s</li>
                  <li>• {scriptSections.length} cenas</li>
                  <li>• Qualidade: {renderConfig.quality === "4k" ? "4K (2160p)" : "Full HD (1080p)"}</li>
                  <li>• Formato: MP4</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
