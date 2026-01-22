"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useGuidelinesStore, useUIStore } from "@/lib/store";
import { Diretriz, DiretrizScope } from "@/types";
import { Plus, Pencil, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SCOPE_OPTIONS: { value: DiretrizScope; label: string }[] = [
  { value: "script", label: "Roteiro" },
  { value: "thumbnail", label: "Thumbnail" },
  { value: "audio", label: "Áudio" },
  { value: "description", label: "Descrição" },
  { value: "video", label: "Vídeo" },
];

export default function GuidelinesModal() {
  const { isGuidelinesModalOpen, closeGuidelinesModal } = useUIStore();
  const {
    guidelines,
    addDiretriz,
    updateDiretriz,
    deleteDiretriz,
    toggleDiretriz,
  } = useGuidelinesStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    systemPrompt: string;
    appliesTo: DiretrizScope[];
  }>({
    title: "",
    description: "",
    systemPrompt: "",
    appliesTo: [],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      systemPrompt: "",
      appliesTo: [],
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleCreate = () => {
    if (!formData.title || !formData.systemPrompt || formData.appliesTo.length === 0) {
      return;
    }

    addDiretriz({
      title: formData.title,
      description: formData.description,
      systemPrompt: formData.systemPrompt,
      appliesTo: formData.appliesTo,
      active: true,
    });

    resetForm();
  };

  const handleEdit = (diretriz: Diretriz) => {
    setEditingId(diretriz.id);
    setFormData({
      title: diretriz.title,
      description: diretriz.description,
      systemPrompt: diretriz.systemPrompt,
      appliesTo: diretriz.appliesTo,
    });
  };

  const handleSaveEdit = () => {
    if (!editingId || !formData.title || !formData.systemPrompt) return;

    updateDiretriz(editingId, {
      title: formData.title,
      description: formData.description,
      systemPrompt: formData.systemPrompt,
      appliesTo: formData.appliesTo,
    });

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta diretriz?")) {
      deleteDiretriz(id);
    }
  };

  const toggleScope = (scope: DiretrizScope) => {
    setFormData((prev) => ({
      ...prev,
      appliesTo: prev.appliesTo.includes(scope)
        ? prev.appliesTo.filter((s) => s !== scope)
        : [...prev.appliesTo, scope],
    }));
  };

  return (
    <Modal
      isOpen={isGuidelinesModalOpen}
      onClose={closeGuidelinesModal}
      title="Engine de Diretrizes"
      size="xl"
    >
      <div className="space-y-6">
        {/* Description */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-300">
            As diretrizes são <strong>globais e transversais</strong>. Elas são
            aplicadas automaticamente em todas as gerações de conteúdo conforme
            o escopo selecionado. As diretrizes ADICIONAM contexto à análise,
            nunca substituem.
          </p>
        </div>

        {/* Create New Button */}
        {!isCreating && !editingId && (
          <Button
            onClick={() => setIsCreating(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nova Diretriz
          </Button>
        )}

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <Card className="border-primary-500/50">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingId ? "Editar Diretriz" : "Nova Diretriz"}
            </h3>
            <div className="space-y-4">
              <Input
                label="Título"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ex: Tom de voz formal"
              />

              <Input
                label="Descrição (opcional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Breve descrição da diretriz"
              />

              <Textarea
                label="System Prompt"
                value={formData.systemPrompt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    systemPrompt: e.target.value,
                  }))
                }
                placeholder="Instruções que serão adicionadas ao prompt do AI..."
                rows={4}
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Aplicar em:
                </label>
                <div className="flex flex-wrap gap-2">
                  {SCOPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleScope(option.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                        formData.appliesTo.includes(option.value)
                          ? "bg-primary-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={editingId ? handleSaveEdit : handleCreate}
                  disabled={
                    !formData.title ||
                    !formData.systemPrompt ||
                    formData.appliesTo.length === 0
                  }
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  {editingId ? "Salvar" : "Criar"}
                </Button>
                <Button variant="ghost" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Existing Guidelines */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Diretrizes Existentes ({guidelines.diretrizes.length})
          </h3>

          {guidelines.diretrizes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma diretriz criada ainda.
            </div>
          ) : (
            guidelines.diretrizes.map((diretriz) => (
              <Card key={diretriz.id} padding="sm" className="group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{diretriz.title}</h4>
                      <Badge variant={diretriz.active ? "success" : "default"}>
                        {diretriz.active ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                    {diretriz.description && (
                      <p className="text-sm text-gray-400 mb-2">
                        {diretriz.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {diretriz.appliesTo.map((scope) => (
                        <Badge key={scope} variant="info" size="sm">
                          {SCOPE_OPTIONS.find((o) => o.value === scope)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Toggle
                      checked={diretriz.active}
                      onChange={() => toggleDiretriz(diretriz.id)}
                    />
                    <button
                      onClick={() => handleEdit(diretriz)}
                      className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(diretriz.id)}
                      className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
