"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Toggle from "@/components/ui/Toggle";
import { useGuidelinesStore, useUIStore } from "@/lib/store";
import { Diretriz, DiretrizScope } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  FileText,
  Image,
  Volume2,
  AlignLeft,
  Film,
  Zap,
  Settings2,
  Sparkles,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const SCOPE_OPTIONS: { value: DiretrizScope; label: string; icon: React.ElementType; color: string; bgColor: string }[] = [
  { value: "script", label: "Roteiro", icon: FileText, color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20" },
  { value: "thumbnail", label: "Thumbnail", icon: Image, color: "text-purple-400", bgColor: "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20" },
  { value: "audio", label: "Áudio", icon: Volume2, color: "text-green-400", bgColor: "bg-green-500/10 border-green-500/30 hover:bg-green-500/20" },
  { value: "description", label: "Descrição", icon: AlignLeft, color: "text-amber-400", bgColor: "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20" },
  { value: "video", label: "Vídeo", icon: Film, color: "text-red-400", bgColor: "bg-red-500/10 border-red-500/30 hover:bg-red-500/20" },
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
      title=""
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Customizado */}
        <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
            <Settings2 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Engine de Diretrizes
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-zinc-400 text-sm">Configure comportamentos globais do sistema de IA</p>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-zinc-300">
              As diretrizes são <strong className="text-indigo-400">globais e transversais</strong>. Elas são
              aplicadas automaticamente em todas as gerações de conteúdo conforme
              o escopo selecionado. As diretrizes <strong className="text-green-400">ADICIONAM</strong> contexto à análise,
              nunca substituem.
            </p>
          </div>
        </div>

        {/* Create New Button */}
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full p-4 border-2 border-dashed border-zinc-700 hover:border-indigo-500/50 rounded-xl transition-all group hover:bg-indigo-500/5"
          >
            <div className="flex items-center justify-center gap-2 text-zinc-400 group-hover:text-indigo-400">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Criar Nova Diretriz</span>
            </div>
          </button>
        )}

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-indigo-500/30 rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
              <div className={`p-2 rounded-lg ${editingId ? 'bg-amber-500/10' : 'bg-green-500/10'}`}>
                {editingId ? <Pencil className="w-4 h-4 text-amber-400" /> : <Zap className="w-4 h-4 text-green-400" />}
              </div>
              <h3 className="text-lg font-semibold text-white">
                {editingId ? "Editar Diretriz" : "Nova Diretriz"}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Título</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Tom de voz formal"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Descrição (opcional)</label>
                <input
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descrição da diretriz"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">System Prompt</label>
                <textarea
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                  placeholder="Instruções que serão adicionadas ao prompt do AI..."
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Aplicar em:
                </label>
                <div className="flex flex-wrap gap-2">
                  {SCOPE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.appliesTo.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleScope(option.value)}
                        className={cn(
                          "px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border",
                          isSelected
                            ? `${option.bgColor} ${option.color} border-current`
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button
                  onClick={editingId ? handleSaveEdit : handleCreate}
                  disabled={!formData.title || !formData.systemPrompt || formData.appliesTo.length === 0}
                  className={cn(
                    "flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                    formData.title && formData.systemPrompt && formData.appliesTo.length > 0
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  )}
                >
                  <Check className="w-4 h-4" />
                  {editingId ? "Salvar Alterações" : "Criar Diretriz"}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Guidelines */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Diretrizes Existentes
            </h3>
            <span className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400">
              {guidelines.diretrizes.length} {guidelines.diretrizes.length === 1 ? 'diretriz' : 'diretrizes'}
            </span>
          </div>

          {guidelines.diretrizes.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="text-zinc-500 mb-2">Nenhuma diretriz criada ainda</p>
              <p className="text-zinc-600 text-sm">Crie sua primeira diretriz para personalizar o comportamento da IA</p>
            </div>
          ) : (
            <div className="space-y-3">
              {guidelines.diretrizes.map((diretriz) => (
                <div
                  key={diretriz.id}
                  className={cn(
                    "bg-zinc-900 border rounded-xl p-4 transition-all group hover:shadow-lg",
                    diretriz.active ? "border-green-500/30 hover:border-green-500/50" : "border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="font-semibold text-white">{diretriz.title}</h4>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
                          diretriz.active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-zinc-700 text-zinc-400"
                        )}>
                          {diretriz.active ? (
                            <>
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                              Ativa
                            </>
                          ) : (
                            "Inativa"
                          )}
                        </span>
                      </div>
                      {diretriz.description && (
                        <p className="text-sm text-zinc-400 mb-3">
                          {diretriz.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {diretriz.appliesTo.map((scope) => {
                          const scopeData = SCOPE_OPTIONS.find((o) => o.value === scope);
                          const Icon = scopeData?.icon || FileText;
                          return (
                            <span
                              key={scope}
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border",
                                scopeData?.bgColor || "bg-zinc-800",
                                scopeData?.color || "text-zinc-400"
                              )}
                            >
                              <Icon className="w-3 h-3" />
                              {scopeData?.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <Toggle
                        checked={diretriz.active}
                        onChange={() => toggleDiretriz(diretriz.id)}
                      />
                      <button
                        onClick={() => handleEdit(diretriz)}
                        className="p-2 hover:bg-amber-500/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4 text-amber-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(diretriz.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
