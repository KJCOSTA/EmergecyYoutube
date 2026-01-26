"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  className?: string;
  variant?: "default" | "success" | "warning" | "error";
  animate?: boolean;
}

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  className,
  variant = "default",
  animate = true,
}: ProgressBarProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  const variantStyles = {
    default: "from-cyan-500 to-blue-600",
    success: "from-green-500 to-emerald-600",
    warning: "from-amber-500 to-orange-600",
    error: "from-red-500 to-rose-600",
  };

  const glowColors = {
    default: "shadow-cyan-500/50",
    success: "shadow-green-500/50",
    warning: "shadow-amber-500/50",
    error: "shadow-red-500/50",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-gray-400 font-mono">
              {normalizedProgress.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        {/* Barra de fundo com shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent animate-shimmer" />

        {/* Barra de progresso */}
        <motion.div
          initial={animate ? { width: 0 } : { width: `${normalizedProgress}%` }}
          animate={{ width: `${normalizedProgress}%` }}
          transition={{
            duration: animate ? 0.5 : 0,
            ease: "easeOut",
          }}
          className={cn(
            "h-full rounded-full bg-gradient-to-r shadow-lg",
            variantStyles[variant],
            glowColors[variant]
          )}
        >
          {/* Efeito de brilho animado */}
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}

interface MultiProgressBarProps {
  segments: Array<{
    value: number;
    label: string;
    color: string;
  }>;
  className?: string;
}

export function MultiProgressBar({ segments, className }: MultiProgressBarProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center h-3 w-full bg-gray-800 rounded-full overflow-hidden">
        {segments.map((segment, index) => {
          const percentage = (segment.value / total) * 100;

          return (
            <motion.div
              key={index}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
              style={{ backgroundColor: segment.color }}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {segments.map((segment, index) => {
          const percentage = ((segment.value / total) * 100).toFixed(1);

          return (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-xs text-gray-400">
                {segment.label} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
