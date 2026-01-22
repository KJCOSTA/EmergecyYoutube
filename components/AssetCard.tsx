"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AIModelSelector from "@/components/AIModelSelector";
import { AssetStatus, AIProvider, APIKeyStatus } from "@/types";
import { Check, RefreshCw, Pencil, Loader2, AlertCircle } from "lucide-react";

interface AssetCardProps {
  title: string;
  status: AssetStatus;
  children: React.ReactNode;
  isEditing?: boolean;
  onEdit?: () => void;
  onRegenerate?: (provider: AIProvider, model: string) => void;
  onApprove?: () => void;
  onCancelEdit?: () => void;
  onSaveEdit?: () => void;
  editContent?: React.ReactNode;
  apiKeyStatus?: APIKeyStatus;
  error?: string;
  isGenerating?: boolean;
}

export default function AssetCard({
  title,
  status,
  children,
  isEditing = false,
  onEdit,
  onRegenerate,
  onApprove,
  onCancelEdit,
  onSaveEdit,
  editContent,
  apiKeyStatus,
  error,
  isGenerating = false,
}: AssetCardProps) {
  const [showRegenerate, setShowRegenerate] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const getStatusBadge = () => {
    switch (status) {
      case "pending":
        return <Badge variant="default">Pendente</Badge>;
      case "generating":
        return <Badge variant="info">Gerando...</Badge>;
      case "ready":
        return <Badge variant="warning">Aguardando Aprovação</Badge>;
      case "approved":
        return <Badge variant="success">Aprovado</Badge>;
      case "error":
        return <Badge variant="error">Erro</Badge>;
      default:
        return null;
    }
  };

  const handleRegenerate = () => {
    if (selectedProvider && selectedModel && onRegenerate) {
      onRegenerate(selectedProvider, selectedModel);
      setShowRegenerate(false);
    }
  };

  return (
    <Card className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {getStatusBadge()}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Content */}
      <div className="mb-4">
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : isEditing ? (
          editContent
        ) : (
          children
        )}
      </div>

      {/* Regenerate AI Selector */}
      {showRegenerate && (
        <div className="mb-4 p-4 bg-gray-800/50 rounded-lg space-y-3">
          <AIModelSelector
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            onProviderChange={setSelectedProvider}
            onModelChange={setSelectedModel}
            apiKeyStatus={apiKeyStatus}
            label="Selecione o modelo para regenerar"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handleRegenerate}
              disabled={!selectedProvider || !selectedModel}
            >
              Regenerar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowRegenerate(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {isEditing ? (
          <>
            <Button size="sm" variant="success" onClick={onSaveEdit}>
              Salvar
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancelEdit}>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            {status !== "approved" && status !== "generating" && onEdit && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Pencil className="w-4 h-4" />}
                onClick={onEdit}
              >
                Editar
              </Button>
            )}
            {status !== "approved" && status !== "generating" && onRegenerate && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={() => setShowRegenerate(true)}
              >
                Regerar
              </Button>
            )}
            {status === "ready" && onApprove && (
              <Button
                size="sm"
                variant="success"
                leftIcon={<Check className="w-4 h-4" />}
                onClick={onApprove}
              >
                Aprovar
              </Button>
            )}
            {status === "approved" && (
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <Check className="w-4 h-4" />
                Aprovado
              </span>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
