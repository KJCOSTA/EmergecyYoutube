"use client";

import { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import { AIProvider, AIModelOption, APIKeyStatus } from "@/types";
import { getModelsForProvider, getProviderName } from "@/lib/ai";
import { AlertCircle } from "lucide-react";

interface AIModelSelectorProps {
  selectedProvider: AIProvider | null;
  selectedModel: string | null;
  onProviderChange: (provider: AIProvider) => void;
  onModelChange: (model: string) => void;
  apiKeyStatus?: APIKeyStatus;
  label?: string;
  compact?: boolean;
}

export default function AIModelSelector({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  apiKeyStatus,
  label = "AI Model",
  compact = false,
}: AIModelSelectorProps) {
  const [models, setModels] = useState<AIModelOption[]>([]);

  const providers: { value: AIProvider; label: string; available: boolean }[] = [
    {
      value: "openai",
      label: getProviderName("openai"),
      available: apiKeyStatus?.openai ?? true,
    },
    {
      value: "google",
      label: getProviderName("google"),
      available: apiKeyStatus?.google ?? true,
    },
    {
      value: "anthropic",
      label: getProviderName("anthropic"),
      available: apiKeyStatus?.anthropic ?? true,
    },
  ];

  useEffect(() => {
    if (selectedProvider) {
      const providerModels = getModelsForProvider(selectedProvider);
      setModels(providerModels);

      // Auto-select first model if none selected
      if (!selectedModel && providerModels.length > 0) {
        onModelChange(providerModels[0].id);
      }
    }
  }, [selectedProvider, selectedModel, onModelChange]);

  const availableProviders = providers.filter((p) => p.available);
  const hasAnyProvider = availableProviders.length > 0;

  if (!hasAnyProvider) {
    return (
      <div className="flex items-center gap-2 text-yellow-500 text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>No AI provider configured. Please add API keys.</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Select
          value={selectedProvider || ""}
          onChange={(value) => onProviderChange(value as AIProvider)}
          options={availableProviders.map((p) => ({
            value: p.value,
            label: p.label,
            disabled: !p.available,
          }))}
          placeholder="Provider"
          className="w-36"
        />
        {selectedProvider && (
          <Select
            value={selectedModel || ""}
            onChange={onModelChange}
            options={models.map((m) => ({
              value: m.id,
              label: m.name,
            }))}
            placeholder="Model"
            className="w-40"
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        <Select
          value={selectedProvider || ""}
          onChange={(value) => onProviderChange(value as AIProvider)}
          options={availableProviders.map((p) => ({
            value: p.value,
            label: p.available ? p.label : `${p.label} (not configured)`,
            disabled: !p.available,
          }))}
          placeholder="Select provider..."
          className="w-48"
        />
        {selectedProvider && (
          <Select
            value={selectedModel || ""}
            onChange={onModelChange}
            options={models.map((m) => ({
              value: m.id,
              label: m.name,
            }))}
            placeholder="Select model..."
            className="w-48"
          />
        )}
      </div>
      {selectedProvider && !providers.find((p) => p.value === selectedProvider)?.available && (
        <p className="text-sm text-yellow-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          This provider is not configured. Add the API key in settings.
        </p>
      )}
    </div>
  );
}
