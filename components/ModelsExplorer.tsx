"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  Loader2,
  AlertCircle,
  Cpu,
} from "lucide-react";

interface Model {
  id: string;
  name: string;
  description: string;
  isNew?: boolean;
}

interface ModelCategory {
  name: string;
  description: string;
  models: Model[];
}

interface ProviderModels {
  name: string;
  icon: string;
  categories: ModelCategory[];
}

interface ModelsExplorerProps {
  provider: string;
  apiKey?: string;
  isConnected: boolean;
}

export default function ModelsExplorer({ provider, apiKey, isConnected }: ModelsExplorerProps) {
  const [models, setModels] = useState<ProviderModels | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  // Carregar modelos estáticos
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/models?provider=${provider}`);
        if (res.ok) {
          const data = await res.json();
          setModels(data);
          // Expandir primeira categoria por padrão
          if (data.categories?.length > 0) {
            setExpandedCategories({ [data.categories[0].name]: true });
          }
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [provider]);

  // Carregar modelos disponíveis se conectado
  useEffect(() => {
    const fetchAvailableModels = async () => {
      if (!isConnected || !apiKey) return;

      setLoadingAvailable(true);
      try {
        const res = await fetch('/api/models', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider, key: apiKey })
        });
        if (res.ok) {
          const data = await res.json();
          setAvailableModels(data.availableModels || []);
        }
      } catch (error) {
        console.error('Error fetching available models:', error);
      } finally {
        setLoadingAvailable(false);
      }
    };

    fetchAvailableModels();
  }, [provider, apiKey, isConnected]);

  // Filtrar modelos por pesquisa
  const filteredCategories = useMemo(() => {
    if (!models?.categories) return [];
    if (!searchQuery.trim()) return models.categories;

    const query = searchQuery.toLowerCase();
    return models.categories
      .map(category => ({
        ...category,
        models: category.models.filter(
          model =>
            model.id.toLowerCase().includes(query) ||
            model.name.toLowerCase().includes(query) ||
            model.description.toLowerCase().includes(query)
        )
      }))
      .filter(category => category.models.length > 0);
  }, [models, searchQuery]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const isModelAvailable = (modelId: string) => {
    if (availableModels.length === 0) return null; // Não verificado
    return availableModels.some(m => m.includes(modelId) || modelId.includes(m));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!models) {
    return (
      <div className="p-4 text-center text-muted">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-disabled" />
        <p>Modelos não disponíveis para este provedor</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com pesquisa */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{models.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{models.name}</h3>
          <p className="text-xs text-muted">
            {loadingAvailable ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Verificando disponibilidade...
              </span>
            ) : isConnected ? (
              <span className="text-green-400">API conectada - modelos verificados</span>
            ) : (
              <span className="text-yellow-400">Configure a API para ver disponibilidade</span>
            )}
          </p>
        </div>
      </div>

      {/* Campo de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar modelos..."
          className="w-full pl-10 pr-4 py-2 bg-layer-2/50 border border-subtle rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Lista de categorias e modelos */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {filteredCategories.map((category) => (
          <div
            key={category.name}
            className="border border-subtle rounded-lg overflow-hidden"
          >
            {/* Cabeçalho da categoria */}
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full px-4 py-3 bg-layer-2/50 hover:bg-layer-2 flex items-center justify-between transition-colors"
            >
              <div className="text-left">
                <h4 className="font-medium text-white text-sm">{category.name}</h4>
                <p className="text-xs text-muted">{category.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted bg-zinc-700 px-2 py-0.5 rounded">
                  {category.models.length} modelos
                </span>
                {expandedCategories[category.name] ? (
                  <ChevronUp className="w-4 h-4 text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted" />
                )}
              </div>
            </button>

            {/* Lista de modelos */}
            {expandedCategories[category.name] && (
              <div className="divide-y divide-zinc-800">
                {category.models.map((model) => {
                  const availability = isModelAvailable(model.id);
                  return (
                    <div
                      key={model.id}
                      className="px-4 py-3 bg-layer-1/50 hover:bg-layer-2/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm text-indigo-300">
                              {model.id}
                            </span>
                            {model.isNew && (
                              <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-medium rounded flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                NOVO
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white mt-0.5">{model.name}</p>
                          <p className="text-xs text-muted mt-0.5">{model.description}</p>
                        </div>

                        {/* Status de disponibilidade */}
                        <div className="flex-shrink-0">
                          {availability === true && (
                            <div className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-1 rounded">
                              <Check className="w-3 h-3" />
                              <span className="text-[10px] font-medium">Disponível</span>
                            </div>
                          )}
                          {availability === false && (
                            <div className="flex items-center gap-1 text-muted bg-zinc-700/30 px-2 py-1 rounded">
                              <Cpu className="w-3 h-3" />
                              <span className="text-[10px]">Indisponível</span>
                            </div>
                          )}
                          {availability === null && isConnected && (
                            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">
                              <AlertCircle className="w-3 h-3" />
                              <span className="text-[10px]">Verificar</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="p-8 text-center text-muted">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum modelo encontrado para &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
}
