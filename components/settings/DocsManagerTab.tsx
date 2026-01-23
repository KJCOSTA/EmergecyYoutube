"use client";

import { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { createDocPage, updateDocPage, deleteDocPage } from '@/app/actions/settings';
import type { DocPage, DocCategory } from '@/types';

interface DocsManagerTabProps {
  initialDocs: DocPage[];
  onUpdate: () => void;
}

const CATEGORIES: { value: DocCategory; label: string }[] = [
  { value: 'getting-started', label: 'Primeiros Passos' },
  { value: 'features', label: 'Recursos' },
  { value: 'api', label: 'API' },
  { value: 'guides', label: 'Guias' },
  { value: 'changelog', label: 'Changelog' },
];

export function DocsManagerTab({ initialDocs, onUpdate }: DocsManagerTabProps) {
  const [docs, setDocs] = useState(initialDocs);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DocPage>>({
    title: '',
    category: 'getting-started',
    content: '',
    visible: true,
    order: 1,
  });

  const handleCreate = async () => {
    try {
      const newDoc = await createDocPage({
        title: formData.title || 'Sem título',
        category: formData.category as DocCategory,
        content: formData.content || '',
        visible: formData.visible ?? true,
        order: formData.order ?? docs.length + 1,
      });

      setDocs([...docs, newDoc]);
      setIsCreating(false);
      setFormData({ title: '', category: 'getting-started', content: '', visible: true, order: 1 });
      onUpdate();
    } catch (error) {
      console.error('Failed to create doc:', error);
      alert('Erro ao criar documento');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const updated = await updateDocPage(id, formData);
      if (updated) {
        setDocs(docs.map(doc => doc.id === id ? updated : doc));
        setEditingId(null);
        setFormData({ title: '', category: 'getting-started', content: '', visible: true, order: 1 });
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update doc:', error);
      alert('Erro ao atualizar documento');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      const success = await deleteDocPage(id);
      if (success) {
        setDocs(docs.filter(doc => doc.id !== id));
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete doc:', error);
      alert('Erro ao excluir documento');
    }
  };

  const handleToggleVisibility = async (doc: DocPage) => {
    try {
      const updated = await updateDocPage(doc.id, { visible: !doc.visible });
      if (updated) {
        setDocs(docs.map(d => d.id === doc.id ? updated : d));
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const startEdit = (doc: DocPage) => {
    setEditingId(doc.id);
    setFormData({
      title: doc.title,
      category: doc.category,
      content: doc.content,
      visible: doc.visible,
      order: doc.order,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ title: '', category: 'getting-started', content: '', visible: true, order: 1 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <FileText className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gerenciador de Documentação</h2>
            <p className="text-sm text-zinc-400">Crie e edite páginas de documentação</p>
          </div>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nova Página
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {isCreating ? 'Criar Nova Página' : 'Editar Página'}
            </h3>
            <button
              onClick={cancelEdit}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 px-3 text-white"
                placeholder="Título da página"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as DocCategory })}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 px-3 text-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Conteúdo (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 px-3 text-white font-mono text-sm resize-none"
              placeholder="# Título\n\nConteúdo em markdown..."
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visible}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-700 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-zinc-300">Visível no menu de documentação</span>
            </label>

            <button
              onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              {isCreating ? 'Criar' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {/* Docs List */}
      <div className="grid grid-cols-1 gap-3">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`p-2 rounded-lg ${doc.visible ? 'bg-green-500/10' : 'bg-zinc-800'}`}>
                  {doc.visible ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate">{doc.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>{CATEGORIES.find(c => c.value === doc.category)?.label}</span>
                    <span>•</span>
                    <span>Ordem: {doc.order}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleVisibility(doc)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  title={doc.visible ? 'Ocultar' : 'Mostrar'}
                >
                  {doc.visible ? (
                    <Eye className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
                <button
                  onClick={() => startEdit(doc)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
