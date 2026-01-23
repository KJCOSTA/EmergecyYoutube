"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";
import AssetCard from "@/components/AssetCard";
import { useWorkflowStore, useGuidelinesStore } from "@/lib/store";
import { checkAPIKeys } from "@/lib/api-keys";
import {
  AIProvider,
  APIKeyStatus,
  ProposalData,
  Script,
  Soundtrack,
  Description,
  Tags,
  TitlesAndThumbs,
  UploadSetup,
  ImageProvider,
  TTSProvider,
} from "@/types";
import { v4 as uuidv4 } from "uuid";
import { formatDuration } from "@/lib/utils";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
  Sparkles,
  Image,
  Settings,
  Volume2,
} from "lucide-react";

export default function Step4Proposal() {
  const router = useRouter();
  const { context, research, proposal, setProposal, updateProposal, setStep } = useWorkflowStore();
  const { getDiretrizesForScope } = useGuidelinesStore();

  const [apiKeyStatus, setApiKeyStatus] = useState<APIKeyStatus | null>(null);
  const [, setIsLoadingKeys] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Individual generation states
  const [generatingScript, setGeneratingScript] = useState(false);
  const [generatingSoundtrack, setGeneratingSoundtrack] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [generatingTags, setGeneratingTags] = useState(false);
  const [generatingTitles, setGeneratingTitles] = useState(false);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const [generatingAudio, setGeneratingAudio] = useState(false);

  // Edit states
  const [editingScript, setEditingScript] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingTags, setEditingTags] = useState(false);
  const [editContent, setEditContent] = useState("");

  // Default upload setup
  const defaultUploadSetup: UploadSetup = {
    category: "22",
    language: "pt",
    license: "youtube",
    madeForKids: false,
    ageRestricted: false,
    paidPromotion: false,
    allowComments: true,
    allowEmbedding: true,
  };

  // Load API keys
  useEffect(() => {
    checkAPIKeys().then((status) => {
      setApiKeyStatus(status);
      setIsLoadingKeys(false);
    });
  }, []);

  // Redirect if no research
  useEffect(() => {
    if (!context || !research) {
      router.push("/step/1-input");
    }
  }, [context, research, router]);

  // Initialize proposal if not exists
  useEffect(() => {
    if (context && research && !proposal) {
      const initialProposal: ProposalData = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contextId: context.id,
        researchId: research.id,
        rationale: "",
        script: {
          id: uuidv4(),
          status: "pending",
          sections: [],
          totalDuration: 0,
          generatedAt: "",
          approvedAt: null,
          audioUrl: null,
          ttsProvider: null,
          ttsVoice: null,
        },
        soundtrack: {
          id: uuidv4(),
          status: "pending",
          suggestions: [],
          selected: null,
          generatedAt: "",
          approvedAt: null,
        },
        description: {
          id: uuidv4(),
          status: "pending",
          content: "",
          generatedAt: "",
          approvedAt: null,
        },
        tags: {
          id: uuidv4(),
          status: "pending",
          items: [],
          generatedAt: "",
          approvedAt: null,
        },
        uploadSetup: defaultUploadSetup,
        titlesAndThumbs: {
          id: uuidv4(),
          status: "pending",
          variations: [],
          selectedVariation: null,
          generatedAt: "",
          approvedAt: null,
        },
        allApproved: false,
      };
      setProposal(initialProposal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, research, proposal, setProposal]);

  const generateScript = async (provider: AIProvider, model: string) => {
    if (!context || !proposal) return;
    setGeneratingScript(true);
    setError(null);

    try {
      const diretrizes = getDiretrizesForScope("script");
      const response = await fetch("/api/proposal/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: context.theme,
          research,
          diretrizes,
          provider,
          model,
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const script: Script = await response.json();
      updateProposal({ script, updatedAt: new Date().toISOString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar roteiro");
    } finally {
      setGeneratingScript(false);
    }
  };

  const generateSoundtrack = async (provider: AIProvider, model: string) => {
    if (!context || !proposal) return;
    setGeneratingSoundtrack(true);
    setError(null);

    try {
      const response = await fetch("/api/proposal/soundtrack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: context.theme,
          mood: "professional, engaging",
          provider,
          model,
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const soundtrack: Soundtrack = await response.json();
      updateProposal({ soundtrack, updatedAt: new Date().toISOString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar trilha");
    } finally {
      setGeneratingSoundtrack(false);
    }
  };

  const generateDescription = async (provider: AIProvider, model: string) => {
    if (!context || !proposal) return;
    setGeneratingDescription(true);
    setError(null);

    try {
      const diretrizes = getDiretrizesForScope("description");
      const response = await fetch("/api/proposal/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: context.theme,
          script: proposal.script,
          research,
          diretrizes,
          provider,
          model,
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const description: Description = await response.json();
      updateProposal({ description, updatedAt: new Date().toISOString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar descrição");
    } finally {
      setGeneratingDescription(false);
    }
  };

  const generateTags = async (provider: AIProvider, model: string) => {
    if (!context || !proposal) return;
    setGeneratingTags(true);
    setError(null);

    try {
      const response = await fetch("/api/proposal/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: context.theme,
          description: proposal.description.content,
          research,
          provider,
          model,
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const tags: Tags = await response.json();
      updateProposal({ tags, updatedAt: new Date().toISOString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar tags");
    } finally {
      setGeneratingTags(false);
    }
  };

  const generateTitles = async (provider: AIProvider, model: string) => {
    if (!context || !proposal) return;
    setGeneratingTitles(true);
    setError(null);

    try {
      const diretrizes = getDiretrizesForScope("thumbnail");
      const response = await fetch("/api/proposal/titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: context.theme,
          script: proposal.script,
          research,
          diretrizes,
          provider,
          model,
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const titlesAndThumbs: TitlesAndThumbs = await response.json();
      updateProposal({ titlesAndThumbs, updatedAt: new Date().toISOString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar títulos");
    } finally {
      setGeneratingTitles(false);
    }
  };

  const generateThumbnailImage = async (variationId: string, provider: ImageProvider) => {
    if (!proposal) return;
    setGeneratingImage(variationId);
    setError(null);

    try {
      const variation = proposal.titlesAndThumbs.variations.find((v) => v.id === variationId);
      if (!variation) throw new Error("Variação não encontrada");

      const response = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: variation.thumbnailPrompt,
          provider,
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const { imageUrl } = await response.json();

      const updatedVariations = proposal.titlesAndThumbs.variations.map((v) =>
        v.id === variationId ? { ...v, thumbnailUrl: imageUrl, imageProvider: provider } : v
      );

      updateProposal({
        titlesAndThumbs: {
          ...proposal.titlesAndThumbs,
          variations: updatedVariations,
        },
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar imagem");
    } finally {
      setGeneratingImage(null);
    }
  };

  const generateAudio = async (ttsProvider: TTSProvider, voice: string) => {
    if (!proposal?.script) return;
    setGeneratingAudio(true);
    setError(null);

    try {
      const fullText = proposal.script.sections.map((s) => s.content).join("\n\n");
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: fullText,
          provider: ttsProvider,
          voice,
        }),
      });

      if (!response.ok) throw new Error((await response.json()).error);
      const { audioUrl } = await response.json();

      updateProposal({
        script: {
          ...proposal.script,
          audioUrl,
          ttsProvider,
          ttsVoice: voice,
        },
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar áudio");
    } finally {
      setGeneratingAudio(false);
    }
  };

  const approveAsset = (asset: "script" | "soundtrack" | "description" | "tags" | "titlesAndThumbs") => {
    if (!proposal) return;

    const now = new Date().toISOString();
    const updates: Partial<ProposalData> = { updatedAt: now };

    switch (asset) {
      case "script":
        updates.script = { ...proposal.script, status: "approved", approvedAt: now };
        break;
      case "soundtrack":
        updates.soundtrack = { ...proposal.soundtrack, status: "approved", approvedAt: now };
        break;
      case "description":
        updates.description = { ...proposal.description, status: "approved", approvedAt: now };
        break;
      case "tags":
        updates.tags = { ...proposal.tags, status: "approved", approvedAt: now };
        break;
      case "titlesAndThumbs":
        updates.titlesAndThumbs = { ...proposal.titlesAndThumbs, status: "approved", approvedAt: now };
        break;
    }

    updateProposal(updates);

    // Check if all approved
    const updatedProposal = { ...proposal, ...updates };
    const allApproved =
      updatedProposal.script.status === "approved" &&
      updatedProposal.soundtrack.status === "approved" &&
      updatedProposal.description.status === "approved" &&
      updatedProposal.tags.status === "approved" &&
      updatedProposal.titlesAndThumbs.status === "approved";

    if (allApproved) {
      updateProposal({ allApproved: true });
    }
  };

  const handleProceed = () => {
    if (proposal?.allApproved) {
      setStep(5);
      router.push("/step/5-studio");
    }
  };

  if (!context || !research || !proposal) {
    return null;
  }

  const canProceed = proposal.allApproved;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Proposta de Vídeo - Mesa de Decisão
        </h1>
        <p className="text-gray-400">
          Todos os assets são gerados aqui. Nada avança sem sua aprovação.
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

        {/* Rationale */}
        {proposal.rationale && (
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Por que esta proposta vai performar bem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">{proposal.rationale}</p>
            </CardContent>
          </Card>
        )}

        {/* Script */}
        <AssetCard
          title="Roteiro"
          status={proposal.script.status}
          isGenerating={generatingScript}
          apiKeyStatus={apiKeyStatus!}
          onEdit={() => {
            setEditContent(proposal.script.sections.map((s) => s.content).join("\n\n---\n\n"));
            setEditingScript(true);
          }}
          onRegenerate={generateScript}
          onApprove={() => approveAsset("script")}
          isEditing={editingScript}
          onCancelEdit={() => setEditingScript(false)}
          onSaveEdit={() => {
            // Parse edited content back to sections (simplified)
            setEditingScript(false);
          }}
          editContent={
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={20}
              className="font-mono text-sm"
            />
          }
        >
          {proposal.script.sections.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Duração: {formatDuration(proposal.script.totalDuration)}</span>
                <span>Seções: {proposal.script.sections.length}</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-auto">
                {proposal.script.sections.map((section) => (
                  <div key={section.id} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="info">{section.type}</Badge>
                      <span className="text-xs text-gray-500">
                        {formatDuration(section.duration)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* TTS Section */}
              <div className="pt-4 border-t border-gray-800">
                <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Gerar Áudio (TTS)
                </h4>
                {proposal.script.audioUrl ? (
                  <div className="flex items-center gap-3">
                    <audio controls src={proposal.script.audioUrl} className="flex-1" />
                    <Badge variant="success">Gerado</Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Select
                      options={[
                        { value: "openai:alloy", label: "OpenAI - Alloy" },
                        { value: "openai:nova", label: "OpenAI - Nova" },
                        { value: "google:pt-BR-Wavenet-A", label: "Google - PT-BR Female" },
                      ]}
                      placeholder="Selecione voz..."
                      className="w-48"
                      onChange={(value) => {
                        const [provider, voice] = value.split(":") as [TTSProvider, string];
                        generateAudio(provider, voice);
                      }}
                    />
                    {generatingAudio && <Loader2 className="w-4 h-4 animate-spin" />}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Clique em &quot;Regerar&quot; para gerar o roteiro
            </p>
          )}
        </AssetCard>

        {/* Soundtrack */}
        <AssetCard
          title="Trilha Sonora"
          status={proposal.soundtrack.status}
          isGenerating={generatingSoundtrack}
          apiKeyStatus={apiKeyStatus!}
          onRegenerate={generateSoundtrack}
          onApprove={() => approveAsset("soundtrack")}
        >
          {proposal.soundtrack.suggestions.length > 0 ? (
            <div className="space-y-3">
              {proposal.soundtrack.suggestions.map((track) => (
                <div
                  key={track.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    proposal.soundtrack.selected === track.id
                      ? "bg-primary-500/10 border-primary-500"
                      : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                  }`}
                  onClick={() =>
                    updateProposal({
                      soundtrack: { ...proposal.soundtrack, selected: track.id },
                    })
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{track.title}</p>
                      <p className="text-sm text-gray-400">
                        {track.artist} • {track.genre}
                      </p>
                    </div>
                    <Badge variant="default">{track.license}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Clique em &quot;Regerar&quot; para sugerir trilhas
            </p>
          )}
        </AssetCard>

        {/* Description */}
        <AssetCard
          title="Descrição"
          status={proposal.description.status}
          isGenerating={generatingDescription}
          apiKeyStatus={apiKeyStatus!}
          onEdit={() => {
            setEditContent(proposal.description.content);
            setEditingDescription(true);
          }}
          onRegenerate={generateDescription}
          onApprove={() => approveAsset("description")}
          isEditing={editingDescription}
          onCancelEdit={() => setEditingDescription(false)}
          onSaveEdit={() => {
            updateProposal({
              description: { ...proposal.description, content: editContent },
            });
            setEditingDescription(false);
          }}
          editContent={
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={10}
            />
          }
        >
          {proposal.description.content ? (
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans">
                {proposal.description.content}
              </pre>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Clique em &quot;Regerar&quot; para gerar a descrição
            </p>
          )}
        </AssetCard>

        {/* Tags */}
        <AssetCard
          title="Tags"
          status={proposal.tags.status}
          isGenerating={generatingTags}
          apiKeyStatus={apiKeyStatus!}
          onEdit={() => {
            setEditContent(proposal.tags.items.join(", "));
            setEditingTags(true);
          }}
          onRegenerate={generateTags}
          onApprove={() => approveAsset("tags")}
          isEditing={editingTags}
          onCancelEdit={() => setEditingTags(false)}
          onSaveEdit={() => {
            updateProposal({
              tags: {
                ...proposal.tags,
                items: editContent.split(",").map((t) => t.trim()).filter(Boolean),
              },
            });
            setEditingTags(false);
          }}
          editContent={
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              helperText="Separe as tags por vírgula"
            />
          }
        >
          {proposal.tags.items.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {proposal.tags.items.map((tag, i) => (
                <Badge key={i} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Clique em &quot;Regerar&quot; para gerar as tags
            </p>
          )}
        </AssetCard>

        {/* Upload Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              Setup de Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                label="Categoria"
                value={proposal.uploadSetup.category}
                onChange={(value) =>
                  updateProposal({
                    uploadSetup: { ...proposal.uploadSetup, category: value },
                  })
                }
                options={[
                  { value: "22", label: "People & Blogs" },
                  { value: "27", label: "Education" },
                  { value: "28", label: "Science & Technology" },
                  { value: "24", label: "Entertainment" },
                  { value: "26", label: "Howto & Style" },
                ]}
              />
              <Select
                label="Idioma"
                value={proposal.uploadSetup.language}
                onChange={(value) =>
                  updateProposal({
                    uploadSetup: { ...proposal.uploadSetup, language: value },
                  })
                }
                options={[
                  { value: "pt", label: "Português" },
                  { value: "en", label: "English" },
                  { value: "es", label: "Español" },
                ]}
              />
              <Select
                label="Licença"
                value={proposal.uploadSetup.license}
                onChange={(value) =>
                  updateProposal({
                    uploadSetup: {
                      ...proposal.uploadSetup,
                      license: value as "youtube" | "creative_commons",
                    },
                  })
                }
                options={[
                  { value: "youtube", label: "YouTube Standard" },
                  { value: "creative_commons", label: "Creative Commons" },
                ]}
              />
            </div>
            <div className="mt-4 space-y-3">
              <Toggle
                checked={proposal.uploadSetup.madeForKids}
                onChange={(checked) =>
                  updateProposal({
                    uploadSetup: { ...proposal.uploadSetup, madeForKids: checked },
                  })
                }
                label="Feito para crianças"
              />
              <Toggle
                checked={proposal.uploadSetup.allowComments}
                onChange={(checked) =>
                  updateProposal({
                    uploadSetup: { ...proposal.uploadSetup, allowComments: checked },
                  })
                }
                label="Permitir comentários"
              />
              <Toggle
                checked={proposal.uploadSetup.allowEmbedding}
                onChange={(checked) =>
                  updateProposal({
                    uploadSetup: { ...proposal.uploadSetup, allowEmbedding: checked },
                  })
                }
                label="Permitir incorporação"
              />
            </div>
          </CardContent>
        </Card>

        {/* Titles & Thumbnails */}
        <AssetCard
          title="Títulos e Thumbnails"
          status={proposal.titlesAndThumbs.status}
          isGenerating={generatingTitles}
          apiKeyStatus={apiKeyStatus!}
          onRegenerate={generateTitles}
          onApprove={() => approveAsset("titlesAndThumbs")}
        >
          {proposal.titlesAndThumbs.variations.length > 0 ? (
            <div className="space-y-4">
              {proposal.titlesAndThumbs.variations.map((variation) => (
                <div
                  key={variation.id}
                  className={`p-4 rounded-lg border transition-all ${
                    proposal.titlesAndThumbs.selectedVariation === variation.id
                      ? "bg-primary-500/10 border-primary-500"
                      : "bg-gray-800/50 border-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-48 h-27 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {variation.thumbnailUrl ? (
                        <img
                          src={variation.thumbnailUrl}
                          alt={variation.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-2">{variation.title}</h4>
                      <p className="text-sm text-gray-400 mb-3">{variation.thumbnailPrompt}</p>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={
                            proposal.titlesAndThumbs.selectedVariation === variation.id
                              ? "success"
                              : "outline"
                          }
                          onClick={() =>
                            updateProposal({
                              titlesAndThumbs: {
                                ...proposal.titlesAndThumbs,
                                selectedVariation: variation.id,
                              },
                            })
                          }
                        >
                          {proposal.titlesAndThumbs.selectedVariation === variation.id
                            ? "Selecionado"
                            : "Selecionar"}
                        </Button>

                        {/* Image Generation Buttons */}
                        {apiKeyStatus?.openai && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateThumbnailImage(variation.id, "dalle")}
                            isLoading={generatingImage === variation.id}
                            disabled={generatingImage !== null}
                          >
                            DALL·E
                          </Button>
                        )}
                        {apiKeyStatus?.stability && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateThumbnailImage(variation.id, "stability")}
                            isLoading={generatingImage === variation.id}
                            disabled={generatingImage !== null}
                          >
                            Stability
                          </Button>
                        )}
                        {apiKeyStatus?.replicate && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateThumbnailImage(variation.id, "replicate")}
                            isLoading={generatingImage === variation.id}
                            disabled={generatingImage !== null}
                          >
                            Replicate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Clique em &quot;Regerar&quot; para gerar títulos e prompts de thumbnail
            </p>
          )}
        </AssetCard>

        {/* Approval Status */}
        <Card className={canProceed ? "border-green-500/50" : "border-yellow-500/50"}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {canProceed ? (
                  <>
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Todos os assets aprovados!</p>
                      <p className="text-sm text-gray-400">
                        Você pode prosseguir para o Studio de Criação.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Aprovações pendentes</p>
                      <p className="text-sm text-gray-400">
                        Gere e aprove todos os assets para continuar.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {[
                  { name: "Roteiro", status: proposal.script.status },
                  { name: "Trilha", status: proposal.soundtrack.status },
                  { name: "Descrição", status: proposal.description.status },
                  { name: "Tags", status: proposal.tags.status },
                  { name: "Títulos", status: proposal.titlesAndThumbs.status },
                ].map((item) => (
                  <Badge
                    key={item.name}
                    variant={item.status === "approved" ? "success" : "warning"}
                    size="sm"
                  >
                    {item.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/step/2-research")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Voltar
        </Button>

        <Button
          onClick={handleProceed}
          disabled={!canProceed}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          size="lg"
        >
          Continuar para Studio
        </Button>
      </div>
    </div>
  );
}
