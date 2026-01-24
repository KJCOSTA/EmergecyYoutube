"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full mx-4 bg-gradient-to-br from-layer-1/95 via-indigo-950/20 to-layer-2/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-subtle",
          "max-h-[90vh] overflow-hidden flex flex-col",
          "animate-fade-in shadow-glow-lg shadow-indigo-500/20",
          sizes[size]
        )}
      >
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-10 pointer-events-none" />

        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none rounded-2xl" />

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-subtle bg-gradient-to-r from-layer-2/50 to-transparent backdrop-blur-sm">
            {title && (
              <h2 className="text-lg font-semibold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-layer-2 text-muted hover:text-white transition-all hover:shadow-glow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}
