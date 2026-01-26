"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "active" | "completed" | "error";
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
  showDescription?: boolean;
}

export default function StepIndicator({
  steps,
  currentStep,
  className,
  orientation = "horizontal",
  showDescription = true,
}: StepIndicatorProps) {
  return orientation === "horizontal" ? (
    <HorizontalStepIndicator
      steps={steps}
      currentStep={currentStep}
      className={className}
      showDescription={showDescription}
    />
  ) : (
    <VerticalStepIndicator
      steps={steps}
      currentStep={currentStep}
      className={className}
      showDescription={showDescription}
    />
  );
}

function HorizontalStepIndicator({
  steps,
  currentStep,
  className,
  showDescription,
}: Omit<StepIndicatorProps, "orientation">) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50"
                    >
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(6, 182, 212, 0.7)",
                          "0 0 0 10px rgba(6, 182, 212, 0)",
                          "0 0 0 0 rgba(6, 182, 212, 0)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50"
                    >
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </motion.div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                      <Circle className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <div className="mt-3 text-center max-w-[120px]">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isCompleted && "text-green-400",
                      isActive && "text-cyan-400",
                      isPending && "text-gray-500"
                    )}
                  >
                    {step.title}
                  </p>
                  {showDescription && step.description && (
                    <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 relative">
                  <div className="absolute inset-0 bg-gray-800" />
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: index < currentStep ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VerticalStepIndicator({
  steps,
  currentStep,
  className,
  showDescription,
}: Omit<StepIndicatorProps, "orientation">) {
  return (
    <div className={cn("space-y-6", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={step.id} className="flex items-start gap-4">
            {/* Step Circle and Line */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50"
                  >
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </motion.div>
                ) : isActive ? (
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(6, 182, 212, 0.7)",
                        "0 0 0 10px rgba(6, 182, 212, 0)",
                        "0 0 0 0 rgba(6, 182, 212, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50"
                  >
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </motion.div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                    <Circle className="w-6 h-6 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="w-0.5 h-16 my-2 relative">
                  <div className="absolute inset-0 bg-gray-800" />
                  <motion.div
                    initial={{ height: "0%" }}
                    animate={{ height: index < currentStep ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-to-b from-green-500 to-emerald-600"
                  />
                </div>
              )}
            </div>

            {/* Step Info */}
            <div className="flex-1 pt-2">
              <p
                className={cn(
                  "text-base font-semibold",
                  isCompleted && "text-green-400",
                  isActive && "text-cyan-400",
                  isPending && "text-gray-500"
                )}
              >
                {step.title}
              </p>
              {showDescription && step.description && (
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Compact version for minimal space
interface CompactStepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export function CompactStepIndicator({
  totalSteps,
  currentStep,
  className,
}: CompactStepIndicatorProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">
          Etapa {currentStep + 1} de {totalSteps}
        </span>
        <span className="text-cyan-400 font-semibold">{progress.toFixed(0)}%</span>
      </div>
      <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50"
        />
      </div>
    </div>
  );
}
