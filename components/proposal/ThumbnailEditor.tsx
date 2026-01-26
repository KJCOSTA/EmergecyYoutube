"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Copy,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { TitleThumbnailVariation } from "@/types";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface ThumbnailEditorProps {
  variations: [
    TitleThumbnailVariation,
    TitleThumbnailVariation,
    TitleThumbnailVariation
  ];
  onVariationUpdate: (index: number, updates: Partial<TitleThumbnailVariation>) => void;
  onGenerateThumbnail: (index: number, prompt: string) => Promise<void>;
  className?: string;
}

export default function ThumbnailEditor({
  variations,
  onVariationUpdate,
  onGenerateThumbnail,
  className,
}: ThumbnailEditorProps) {
  const labels = ["A", "B", "C"];
  const allReady = variations.every((v) => v.isReady);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">
            Teste A/B/C de Thumbnails
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Todas as 3 versões serão enviadas para teste no YouTube
          </p>
        </div>

        {/* Status Badge */}
        <div
          className={cn(
            "px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2",
            allReady
              ? "bg-green-500/20 text-green-400"
              : "bg-amber-500/20 text-amber-400"
          )}
        >
          {allReady ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Todas prontas
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              {variations.filter((v) => v.isReady).length}/3 prontas
            </>
          )}
        </div>
      </div>

      {/* Grid de Variações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {variations.map((variation, index) => (
          <ThumbnailVariationCard
            key={variation.id}
            variation={variation}
            label={labels[index]}
            index={index}
            onUpdate={(updates) => onVariationUpdate(index, updates)}
            onGenerate={(prompt) => onGenerateThumbnail(index, prompt)}
          />
        ))}
      </div>

      {/* Aviso */}
      {!allReady && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-amber-400 font-semibold text-sm">
              Complete todas as 3 thumbnails para continuar
            </p>
            <p className="text-amber-400/70 text-xs mt-1">
              O YouTube permite testar até 3 thumbnails simultaneamente para
              descobrir qual performa melhor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ThumbnailVariationCardProps {
  variation: TitleThumbnailVariation;
  label: string;
  index: number;
  onUpdate: (updates: Partial<TitleThumbnailVariation>) => void;
  onGenerate: (prompt: string) => Promise<void>;
}

function ThumbnailVariationCard({
  variation,
  label,
  index,
  onUpdate,
  onGenerate,
}: ThumbnailVariationCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(variation.thumbnailPrompt);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Implementar upload de arquivo
      // Por agora, simular com setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const url = URL.createObjectURL(file);
      onUpdate({
        thumbnailUrl: url,
        isReady: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(variation.thumbnailPrompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/50">
                {label}
              </div>
              <div>
                <h4 className="font-semibold text-white">Variação {label}</h4>
                <p className="text-xs text-gray-400">
                  {variation.isReady ? "Pronta" : "Pendente"}
                </p>
              </div>
            </div>

            {variation.isReady && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Título */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Título
            </label>
            <input
              type="text"
              value={variation.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Título chamativo para o vídeo"
            />
          </div>

          {/* Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Prompt da Thumbnail
              </label>
              <button
                onClick={copyPrompt}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copiar
              </button>
            </div>
            <textarea
              value={variation.thumbnailPrompt}
              onChange={(e) => onUpdate({ thumbnailPrompt: e.target.value })}
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              placeholder="Descreva a thumbnail que deseja gerar com IA..."
            />
          </div>

          {/* Preview da Thumbnail */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Preview
            </label>
            {variation.thumbnailUrl ? (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
                <img
                  src={variation.thumbnailUrl}
                  alt={`Thumbnail ${label}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => onUpdate({ thumbnailUrl: null, isReady: false })}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-gray-900 border-2 border-dashed border-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhuma thumbnail</p>
                </div>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="space-y-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !variation.thumbnailPrompt}
              className="w-full"
              variant="primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Gerar com IA
                </>
              )}
            </Button>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id={`upload-${variation.id}`}
                disabled={isUploading}
              />
              <label
                htmlFor={`upload-${variation.id}`}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer",
                  isUploading
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                )}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Manual
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
