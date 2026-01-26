"use client";

import { useState } from "react";
import { Loader2, Download, CheckCircle, XCircle, Sparkles } from "lucide-react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

type GenerationStep =
  | "idle"
  | "generating_script"
  | "creating_storyboard"
  | "searching_media"
  | "rendering"
  | "completed"
  | "error";

interface GenerationStatus {
  step: GenerationStep;
  progress: number;
  message: string;
  videoUrl?: string;
  error?: string;
}

export default function QuickVideoPage() {
  const [theme, setTheme] = useState("");
  const [duration, setDuration] = useState(60);
  const [status, setStatus] = useState<GenerationStatus>({
    step: "idle",
    progress: 0,
    message: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!theme.trim()) {
      alert("Por favor, insira um tema para o vídeo");
      return;
    }

    setIsGenerating(true);
    setStatus({
      step: "generating_script",
      progress: 10,
      message: "Gerando roteiro com IA...",
    });

    try {
      const response = await fetch("/api/quick-video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          duration,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha na geração do vídeo");
      }

      // Processar resposta streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Streaming não suportado");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            setStatus(data);

            if (data.step === "completed") {
              setIsGenerating(false);
            } else if (data.step === "error") {
              setIsGenerating(false);
            }
          }
        }
      }
    } catch (error) {
      console.error("Generation error:", error);
      setStatus({
        step: "error",
        progress: 0,
        message: "Erro ao gerar vídeo",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
      setIsGenerating(false);
    }
  };

  const getStepIcon = (step: GenerationStep) => {
    switch (step) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "idle":
        return <Sparkles className="w-6 h-6 text-blue-500" />;
      default:
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    }
  };

  const getStepLabel = (step: GenerationStep) => {
    const labels: Record<GenerationStep, string> = {
      idle: "Pronto para começar",
      generating_script: "Gerando roteiro",
      creating_storyboard: "Criando storyboard",
      searching_media: "Buscando imagens e vídeos",
      rendering: "Renderizando vídeo final",
      completed: "Vídeo pronto!",
      error: "Erro na geração",
    };
    return labels[step];
  };

  return (
    <div className="min-h-screen bg-layer-0 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-blue-500" />
            Quick Video
          </h1>
          <p className="text-muted text-lg">
            Gere um vídeo profissional em minutos. Digite o tema e pronto!
          </p>
        </div>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Configure seu vídeo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tema do vídeo *
              </label>
              <Textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Ex: Como economizar dinheiro em 2026, Dicas de produtividade para freelancers, Benefícios da meditação..."
                rows={3}
                disabled={isGenerating}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Duração aproximada (segundos)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-layer-2 border border-subtle rounded-lg text-white"
              >
                <option value={30}>30 segundos (Short)</option>
                <option value={60}>60 segundos (Padrão)</option>
                <option value={90}>90 segundos</option>
                <option value={120}>2 minutos</option>
              </select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !theme.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Gerando vídeo...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Gerar Vídeo Agora
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        {status.step !== "idle" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getStepIcon(status.step)}
                {getStepLabel(status.step)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="w-full bg-layer-2 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${status.progress}%` }}
                />
              </div>

              {/* Status Message */}
              <p className="text-muted text-center">{status.message}</p>

              {/* Error Message */}
              {status.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 font-medium">Erro:</p>
                  <p className="text-red-300 text-sm">{status.error}</p>
                </div>
              )}

              {/* Download Button */}
              {status.step === "completed" && status.videoUrl && (
                <div className="space-y-3">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-400 font-medium text-center">
                      ✅ Seu vídeo está pronto!
                    </p>
                  </div>

                  <a
                    href={status.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Baixar Vídeo
                  </a>

                  <video
                    src={status.videoUrl}
                    controls
                    className="w-full rounded-lg border border-subtle"
                  >
                    Seu navegador não suporta vídeo.
                  </video>

                  <Button
                    onClick={() => {
                      setTheme("");
                      setStatus({ step: "idle", progress: 0, message: "" });
                    }}
                    variant="secondary"
                    className="w-full"
                  >
                    Criar Novo Vídeo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {status.step === "idle" && (
          <Card>
            <CardHeader>
              <CardTitle>Como funciona?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-muted">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>
                    <strong className="text-white">Digite o tema:</strong> Descreva sobre o que será seu vídeo
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>
                    <strong className="text-white">IA gera o roteiro:</strong> Nosso sistema cria automaticamente um roteiro profissional
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>
                    <strong className="text-white">Busca mídia stock:</strong> Selecionamos imagens e vídeos de alta qualidade do Pexels e Pixabay
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>
                    <strong className="text-white">Renderiza o vídeo:</strong> Montamos tudo em um vídeo final profissional
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <span>
                    <strong className="text-white">Baixe e publique:</strong> Faça download e publique no YouTube, Instagram ou onde quiser!
                  </span>
                </li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
