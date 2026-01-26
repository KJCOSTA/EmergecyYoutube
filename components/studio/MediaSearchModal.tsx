"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid3x3, PlayCircle, Download, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import { MediaItem } from "@/types";

interface MediaSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  initialQuery?: string;
  type?: "image" | "video" | "all";
}

export default function MediaSearchModal({
  isOpen,
  onClose,
  onSelect,
  initialQuery = "",
  type = "all",
}: MediaSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [mediaType, setMediaType] = useState<"image" | "video" | "all">(type);
  const [source, setSource] = useState<"pexels" | "pixabay" | "all">("all");
  const [sortBy, setSortBy] = useState<"relevance" | "popular">("relevance");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSearch();
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Implementar busca real nas APIs
      // Por agora, simular com dados mock
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResults: MediaItem[] = Array.from({ length: 12 }, (_, i) => ({
        id: `media-${i}`,
        source: i % 2 === 0 ? "pexels" : "pixabay",
        sourceId: `${i}`,
        url: `https://via.placeholder.com/1920x1080/1a1a2e/16213e?text=Media+${i + 1}`,
        previewUrl: `https://via.placeholder.com/400x300/1a1a2e/16213e?text=Media+${i + 1}`,
        type: mediaType === "all" ? (i % 2 === 0 ? "image" : "video") : mediaType,
        duration: mediaType === "video" || (mediaType === "all" && i % 2 !== 0) ? 15 : null,
        attribution: `Photographer ${i + 1}`,
      }));

      setResults(mockResults);
    } catch (error) {
      console.error("Erro ao buscar mídia:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectMedia = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  const handleConfirmSelection = () => {
    if (selectedMedia) {
      onSelect(selectedMedia);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buscar Mídia"
      size="large"
    >
      <div className="space-y-6">
        {/* Busca */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Buscar imagens ou vídeos..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all",
              isSearching || !query.trim()
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-cyan-500 text-white"
            )}
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buscar"}
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filtros:</span>
          </div>

          {/* Tipo */}
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as "image" | "video" | "all")}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">Todos</option>
            <option value="image">Imagens</option>
            <option value="video">Vídeos</option>
          </select>

          {/* Fonte */}
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as "pexels" | "pixabay" | "all")}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">Todas as fontes</option>
            <option value="pexels">Pexels</option>
            <option value="pixabay">Pixabay</option>
          </select>

          {/* Ordenação */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "relevance" | "popular")}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="relevance">Relevância</option>
            <option value="popular">Popularidade</option>
          </select>
        </div>

        {/* Resultados */}
        <div className="min-h-[400px]">
          {isSearching ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Buscando mídia...</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">
                  {results.length} resultados encontrados
                </p>
                {selectedMedia && (
                  <div className="flex items-center gap-2 text-sm text-cyan-400">
                    <span>1 selecionado</span>
                    <button
                      onClick={() => setSelectedMedia(null)}
                      className="p-1 hover:bg-cyan-500/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {results.map((media) => (
                  <MediaCard
                    key={media.id}
                    media={media}
                    isSelected={selectedMedia?.id === media.id}
                    onClick={() => handleSelectMedia(media)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <Grid3x3 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum resultado encontrado</p>
                <p className="text-sm text-gray-600 mt-2">
                  Tente buscar com outros termos
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Ações */}
        {selectedMedia && (
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg font-medium bg-gray-800 hover:bg-gray-700 text-white transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmSelection}
              className="flex-1 px-4 py-3 rounded-lg font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition-all"
            >
              Usar Mídia Selecionada
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

interface MediaCardProps {
  media: MediaItem;
  isSelected: boolean;
  onClick: () => void;
}

function MediaCard({ media, isSelected, onClick }: MediaCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative aspect-video rounded-lg overflow-hidden bg-gray-900 border-2 transition-all",
        isSelected
          ? "border-cyan-500 ring-2 ring-cyan-500/50"
          : "border-gray-800 hover:border-gray-700"
      )}
    >
      <img
        src={media.previewUrl}
        alt="Media preview"
        className="w-full h-full object-cover"
      />

      {/* Overlay com info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center justify-between text-white text-xs">
            <span className="truncate">{media.attribution}</span>
            {media.type === "video" && media.duration && (
              <div className="flex items-center gap-1 bg-black/50 rounded px-1.5 py-0.5">
                <PlayCircle className="w-3 h-3" />
                <span>{media.duration}s</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Indicador de tipo */}
      <div className="absolute top-2 right-2">
        <div className="bg-black/70 backdrop-blur-sm rounded-full p-1.5">
          {media.type === "video" ? (
            <PlayCircle className="w-4 h-4 text-white" />
          ) : (
            <Download className="w-4 h-4 text-white" />
          )}
        </div>
      </div>

      {/* Check de seleção */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-2 left-2 bg-cyan-500 rounded-full p-1"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
