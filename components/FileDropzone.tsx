"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Upload, File, X } from "lucide-react";

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  currentFile?: File | null;
  onRemove?: () => void;
  label?: string;
  description?: string;
}

export default function FileDropzone({
  onFileAccepted,
  accept = { "text/csv": [".csv"] },
  maxSize = 10 * 1024 * 1024, // 10MB
  currentFile,
  onRemove,
  label = "Upload de Arquivo",
  description = "Arraste e solte ou clique para selecionar",
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (currentFile) {
    return (
      <div className="border border-subtle rounded-lg p-4 bg-layer-2/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <File className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{currentFile.name}</p>
              <p className="text-xs text-muted">
                {formatFileSize(currentFile.size)}
              </p>
            </div>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-primary-500 bg-primary-500/10"
            : "border-subtle hover:border-gray-600 bg-layer-2/30"
        )}
      >
        <input {...getInputProps()} />
        <Upload
          className={cn(
            "w-10 h-10 mx-auto mb-3",
            isDragActive ? "text-primary-500" : "text-muted"
          )}
        />
        <p className="text-sm font-medium text-white mb-1">{label}</p>
        <p className="text-xs text-muted">{description}</p>
        <p className="text-xs text-muted mt-2">
          Tamanho máximo: {formatFileSize(maxSize)}
        </p>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-2 text-sm text-red-400">
          {fileRejections[0].errors.map((error) => (
            <p key={error.code}>{error.message}</p>
          ))}
        </div>
      )}
    </div>
  );
}
