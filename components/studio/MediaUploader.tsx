"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileVideo, FileImage, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MediaUploaderProps {
  sceneId: string;
  onUploadComplete: (url: string, type: "image" | "video") => void;
  className?: string;
}

export default function MediaUploader({
  sceneId,
  onUploadComplete,
  className,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validar tipo de arquivo
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      if (!isVideo && !isImage) {
        setError("Formato de arquivo não suportado");
        return;
      }

      // Validar tamanho (máximo 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Arquivo muito grande. Máximo: 100MB");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simular upload com progresso
        // Em produção, fazer upload real para Vercel Blob ou S3
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        clearInterval(interval);
        setUploadProgress(100);

        // Criar URL temporário
        const url = URL.createObjectURL(file);
        const type = isVideo ? "video" : "image";

        onUploadComplete(url, type);

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch {
        setError("Erro ao fazer upload do arquivo");
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [onUploadComplete]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <input
        type="file"
        accept="video/*,image/*"
        onChange={handleFileSelect}
        className="hidden"
        id={`media-upload-${sceneId}`}
        disabled={isUploading}
      />

      <label
        htmlFor={`media-upload-${sceneId}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "block border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer",
          isDragging
            ? "border-cyan-500 bg-cyan-500/10"
            : isUploading
            ? "border-gray-700 bg-gray-900 cursor-not-allowed"
            : "border-gray-700 hover:border-gray-600 hover:bg-gray-900/50"
        )}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4 w-full"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-cyan-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">Enviando arquivo...</p>
                <div className="w-full max-w-xs mx-auto h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  />
                </div>
                <p className="text-sm text-gray-400">{uploadProgress}%</p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-white font-medium mb-2">
                {isDragging ? "Solte o arquivo aqui" : "Clique ou arraste um arquivo"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Vídeo ou imagem própria
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <FileVideo className="w-4 h-4" />
                  <span>MP4, MOV, WEBM</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileImage className="w-4 h-4" />
                  <span>JPG, PNG, WEBP</span>
                </div>
              </div>
            </>
          )}
        </div>
      </label>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:bg-red-500/20 rounded transition-colors"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
