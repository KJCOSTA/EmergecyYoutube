"use client";

import { useState } from "react";
import { Sparkles, DollarSign, Image, Video, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface AIMediaGeneratorProps {
  sceneText: string;
  onGenerate: (prompt: string, type: "image" | "video") => Promise<string>;
  className?: string;
}

export default function AIMediaGenerator({
  sceneText,
  onGenerate,
  className,
}: AIMediaGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const costs = {
    image: { flux: 0.04, dalle: 0.02, stability: 0.03 },
    video: { runway: 0.50, pika: 0.40 },
  };

  const estimatedCost = mediaType === "image" ? costs.image.flux : costs.video.runway;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Por favor, descreva a mídia que deseja gerar");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedUrl(null);

    try {
      const url = await onGenerate(prompt, mediaType);
      setGeneratedUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar mídia");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseMedia = () => {
    // Implementar uso da mídia gerada
    setIsOpen(false);
    setPrompt("");
    setGeneratedUrl(null);
  };

  const handleClose = () => {
    if (!isGenerating) {
      setIsOpen(false);
      setPrompt("");
      setGeneratedUrl(null);
      setError(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
          "bg-gradient-to-r from-purple-600 to-pink-600",
          "hover:from-purple-500 hover:to-pink-500",
          "text-white font-medium transition-all",
          "shadow-lg shadow-purple-500/20",
          className
        )}
      >
        <Sparkles className="w-4 h-4" />
        Gerar com IA
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Gerar Mídia com IA">
        <div className="space-y-6">
          {/* Tipo de Mídia */}
          <div>
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 block">
              Tipo de Mídia
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMediaType("image")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  mediaType === "image"
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-gray-700 hover:border-gray-600"
                )}
              >
                <Image className={cn("w-6 h-6 mx-auto mb-2", mediaType === "image" ? "text-cyan-400" : "text-gray-500")} />
                <p className={cn("text-sm font-medium", mediaType === "image" ? "text-cyan-400" : "text-gray-400")}>
                  Imagem
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  ~${costs.image.flux.toFixed(2)}
                </p>
              </button>

              <button
                onClick={() => setMediaType("video")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  mediaType === "video"
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-gray-700 hover:border-gray-600"
                )}
              >
                <Video className={cn("w-6 h-6 mx-auto mb-2", mediaType === "video" ? "text-cyan-400" : "text-gray-500")} />
                <p className={cn("text-sm font-medium", mediaType === "video" ? "text-cyan-400" : "text-gray-400")}>
                  Vídeo
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  ~${costs.video.runway.toFixed(2)}
                </p>
              </button>
            </div>
          </div>

          {/* Contexto da Cena */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Texto da Cena
            </p>
            <p className="text-sm text-gray-300">{sceneText}</p>
          </div>

          {/* Prompt */}
          <div>
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Descreva a {mediaType === "image" ? "imagem" : "vídeo"}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={
                mediaType === "image"
                  ? "Ex: Paisagem montanhosa ao nascer do sol, cores vibrantes, estilo fotorrealista..."
                  : "Ex: Câmera se movendo suavemente sobre uma floresta verde, vista aérea, iluminação natural..."
              }
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              disabled={isGenerating}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-600">
                {prompt.length} caracteres
              </p>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <DollarSign className="w-3 h-3" />
                <span>Custo estimado: ${estimatedCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <AnimatePresence>
            {generatedUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-3"
              >
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide block">
                  Preview
                </label>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
                  {mediaType === "image" ? (
                    <img
                      src={generatedUrl}
                      alt="Generated"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={generatedUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Erro */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3">
            {generatedUrl ? (
              <>
                <Button
                  onClick={handleGenerate}
                  variant="secondary"
                  className="flex-1"
                  disabled={isGenerating}
                >
                  Gerar Novamente
                </Button>
                <Button onClick={handleUseMedia} variant="primary" className="flex-1">
                  Usar Esta Mídia
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleClose}
                  variant="secondary"
                  className="flex-1"
                  disabled={isGenerating}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleGenerate}
                  variant="primary"
                  className="flex-1"
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Aviso de Custo */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-xs text-amber-400">
              ⚠️ A geração de mídia com IA consome créditos. O valor será debitado
              após a geração bem-sucedida.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
