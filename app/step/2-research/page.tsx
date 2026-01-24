"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AIModelSelector from "@/components/AIModelSelector";
import { useWorkflowStore, useGuidelinesStore } from "@/lib/store";
import { checkAPIKeys } from "@/lib/api-keys";
import { useAPIKeysStore, getAPIKeyHeaders } from "@/lib/api-keys-store";
import { AIProvider, APIKeyStatus, ResearchData } from "@/types";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
  Search,
  TrendingUp,
  Users,
  Lightbulb,
  Globe,
} from "lucide-react";

export default function Step2Research() {
  const router = useRouter();
  const { context, research, setResearch, setStep } = useWorkflowStore();
  const { getActiveDiretrizes } = useGuidelinesStore();
  const { keys } = useAPIKeysStore();

  const [apiKeyStatus, setApiKeyStatus] = useState<APIKeyStatus | null>(null);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Load API keys
  useEffect(() => {
    checkAPIKeys().then((status) => {
      setApiKeyStatus(status);
      setIsLoadingKeys(false);

      // Auto-select first available provider
      if (status.openai) {
        setSelectedProvider("openai");
        setSelectedModel("gpt-4o");
      } else if (status.google) {
        setSelectedProvider("google");
        setSelectedModel("gemini-1.5-pro");
      } else if (status.anthropic) {
        setSelectedProvider("anthropic");
        setSelectedModel("claude-3-5-sonnet-latest");
      }
    });
  }, []);

  // Redirect if no context
  useEffect(() => {
    if (!context) {
      router.push("/step/1-input");
    }
  }, [context, router]);

  const handleGenerate = async () => {
    if (!selectedProvider || !selectedModel || !context) {
      setError("Selecione um provedor e modelo de IA.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const activeDiretrizes = getActiveDiretrizes();
      const apiKeyHeaders = getAPIKeyHeaders(keys);

      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...apiKeyHeaders,
        },
        body: JSON.stringify({
          contextId: context.id,
          theme: context.theme,
          channelData: context.channelData,
          metrics: context.metrics,
          provider: selectedProvider,
          model: selectedModel,
          diretrizes: activeDiretrizes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha na pesquisa");
      }

      const researchData: ResearchData = await response.json();
      setResearch(researchData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na pesquisa");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceed = () => {
    if (research) {
      setStep(4);
      router.push("/step/4-proposal");
    }
  };

  if (!context) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Inteligência - Deep Research Agent
        </h1>
        <p className="text-muted">
          Análise profunda de dados e pesquisa de tendências para o tema:{" "}
          <span className="text-white font-medium">{context.theme}</span>
        </p>
      </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* AI Selection & Generate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              Configuração do Agente
            </CardTitle>
            <CardDescription>
              Selecione o modelo de IA para executar a pesquisa profunda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingKeys ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted" />
              </div>
            ) : (
              <AIModelSelector
                selectedProvider={selectedProvider}
                selectedModel={selectedModel}
                onProviderChange={setSelectedProvider}
                onModelChange={setSelectedModel}
                apiKeyStatus={apiKeyStatus!}
                label="Selecione o modelo para pesquisa"
              />
            )}

            {apiKeyStatus?.tavily && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm">
                  Tavily API detectada - pesquisa real habilitada
                </span>
              </div>
            )}

            {!apiKeyStatus?.tavily && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-sm">
                  Tavily não configurado - pesquisa será simulada via LLM
                </span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!selectedProvider || !selectedModel}
              leftIcon={<Search className="w-4 h-4" />}
            >
              {research ? "Regenerar Pesquisa" : "Executar Pesquisa"}
            </Button>
          </CardFooter>
        </Card>

        {/* Research Results */}
        {research && (
          <div className="space-y-6">
            {/* Internal Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Análise Interna (Canal)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-layer-2 rounded-lg">
                    <h4 className="text-sm font-medium text-muted mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Tópicos de Alta Performance
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {research.internalAnalysis.topPerformingTopics.map((topic, i) => (
                        <Badge key={i} variant="success">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-layer-2 rounded-lg">
                    <h4 className="text-sm font-medium text-muted mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Insights da Audiência
                    </h4>
                    <ul className="space-y-1 text-sm text-foreground-secondary">
                      {research.internalAnalysis.audienceInsights.map((insight, i) => (
                        <li key={i}>• {insight}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-layer-2 rounded-lg">
                    <h4 className="text-sm font-medium text-muted mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Lacunas de Conteúdo
                    </h4>
                    <ul className="space-y-1 text-sm text-foreground-secondary">
                      {research.internalAnalysis.contentGaps.map((gap, i) => (
                        <li key={i}>• {gap}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-layer-2 rounded-lg">
                    <h4 className="text-sm font-medium text-muted mb-2 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Recomendações
                    </h4>
                    <ul className="space-y-1 text-sm text-foreground-secondary">
                      {research.internalAnalysis.recommendations.map((rec, i) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* External Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  Análise Externa (Mercado)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-layer-2 rounded-lg">
                    <h4 className="text-sm font-medium text-muted mb-2">
                      Tópicos em Alta
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {research.externalAnalysis.trendingTopics.map((topic, i) => (
                        <Badge key={i} variant="info">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-layer-2 rounded-lg">
                    <h4 className="text-sm font-medium text-muted mb-2">
                      Insights de Competidores
                    </h4>
                    <ul className="space-y-1 text-sm text-foreground-secondary">
                      {research.externalAnalysis.competitorInsights.map((insight, i) => (
                        <li key={i}>• {insight}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-layer-2 rounded-lg">
                    <h4 className="text-sm font-medium text-muted mb-2">
                      Oportunidades de Mercado
                    </h4>
                    <ul className="space-y-1 text-sm text-foreground-secondary">
                      {research.externalAnalysis.marketOpportunities.map((opp, i) => (
                        <li key={i}>• {opp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consolidated Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Síntese Estratégica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground-secondary leading-relaxed">
                  {research.consolidatedInsights}
                </p>
              </CardContent>
            </Card>

            {/* Research Queries */}
            <Card>
              <CardHeader>
                <CardTitle>Queries Executadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {research.queries.map((query, i) => (
                    <div
                      key={i}
                      className="p-3 bg-layer-3 rounded-lg border border-subtle"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">
                          {query.query}
                        </span>
                        <Badge variant={query.source === "tavily" ? "success" : "warning"}>
                          {query.source === "tavily" ? "Tavily" : "Simulado"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted">
                        {query.results.length} resultados encontrados
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/step/1-input")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Voltar
        </Button>

        <Button
          onClick={handleProceed}
          disabled={!research}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          size="lg"
        >
          Continuar para Proposta
        </Button>
      </div>
    </div>
  );
}
