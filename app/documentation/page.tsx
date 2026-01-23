"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";
import {
  exportTabAsMarkdown,
  exportAllTabsAsMarkdown,
  exportTabAsPDF,
  DocumentationTab,
} from "@/lib/documentation-export";
import {
  Brain,
  Building2,
  Plug,
  Layers,
  Compass,
  Download,
  FileText,
  FileDown,
  ChevronRight,
  BookOpen,
  Mail,
  Clock,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { ShareProvider, useShare } from "@/lib/share-context";
import ShareButtons from "@/components/documentation/ShareButtons";
import Image from "next/image";

// Configuração do projeto
const PROJECT_CONFIG = {
  name: "Emergency YouTube",
  subtitle: "Sistema de Monitoramento de Emergências via YouTube",
  launchDate: new Date("2025-03-15T00:00:00"),
  lastUpdate: {
    date: "23/01/2026",
    time: "18:45",
    author: "Claude",
    authorType: "ai" as const,
  },
  progress: {
    completed: 68,
    items: [
      { name: "Interface Base", percent: 100, status: "done" },
      { name: "Documentação", percent: 95, status: "done" },
      { name: "Integrações API", percent: 45, status: "progress" },
      { name: "Sistema de Alertas", percent: 30, status: "progress" },
      { name: "Dashboard Analytics", percent: 60, status: "progress" },
      { name: "Deploy & Testes", percent: 70, status: "progress" },
    ],
  },
};

// Tab Components
import GenesisTab from "@/components/documentation/GenesisTab";
import SystemVisionTab from "@/components/documentation/SystemVisionTab";
import IntegrationsTab from "@/components/documentation/IntegrationsTab";
import TechStackTab from "@/components/documentation/TechStackTab";
import CurrentStateTab from "@/components/documentation/CurrentStateTab";

// Tab content for export
import {
  genesisContent,
  systemVisionContent,
  integrationsContent,
  techStackContent,
  currentStateContent,
} from "@/components/documentation/content";

const tabs = [
  {
    id: "genesis",
    label: "Gênese & Intenção",
    icon: Brain,
    description: "Origem e propósito fundamental do sistema",
    component: GenesisTab,
    gradient: "from-purple-500 to-indigo-600",
  },
  {
    id: "system-vision",
    label: "Visão Sistêmica",
    icon: Building2,
    description: "Funcionamento e arquitetura operacional",
    component: SystemVisionTab,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "integrations",
    label: "Integrações & APIs",
    icon: Plug,
    description: "Conexões externas e fluxo de dados",
    component: IntegrationsTab,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: "tech-stack",
    label: "Stack Tecnológica",
    icon: Layers,
    description: "Tecnologias e linguagens utilizadas",
    component: TechStackTab,
    gradient: "from-orange-500 to-amber-600",
  },
  {
    id: "current-state",
    label: "Estado Atual",
    icon: Compass,
    description: "Status do projeto e próximos passos",
    component: CurrentStateTab,
    gradient: "from-rose-500 to-pink-600",
  },
];

// Componente de Countdown
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <Rocket className="w-4 h-4 text-amber-400" />
      <span className="text-zinc-300">Lançamento em:</span>
      <div className="flex gap-1">
        <span className="bg-zinc-800 px-2 py-1 rounded font-mono text-amber-400">{timeLeft.days}d</span>
        <span className="bg-zinc-800 px-2 py-1 rounded font-mono text-amber-400">{timeLeft.hours}h</span>
        <span className="bg-zinc-800 px-2 py-1 rounded font-mono text-amber-400">{timeLeft.minutes}m</span>
        <span className="bg-zinc-800 px-2 py-1 rounded font-mono text-amber-400">{timeLeft.seconds}s</span>
      </div>
    </div>
  );
}

// Componente de Barra de Progresso
function ProjectProgress() {
  return (
    <div className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span className="font-semibold text-white">Progresso do Projeto</span>
        </div>
        <span className="text-2xl font-bold text-green-400">{PROJECT_CONFIG.progress.completed}%</span>
      </div>

      {/* Barra principal */}
      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${PROJECT_CONFIG.progress.completed}%` }}
        />
      </div>

      {/* Items detalhados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PROJECT_CONFIG.progress.items.map((item) => (
          <div key={item.name} className="bg-zinc-800/50 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-400 truncate">{item.name}</span>
              <span className={cn(
                "text-xs font-medium",
                item.status === "done" ? "text-green-400" : "text-amber-400"
              )}>{item.percent}%</span>
            </div>
            <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  item.status === "done" ? "bg-green-500" : "bg-amber-500"
                )}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente Avatar do Kleiton
function KleitonAvatar({ size = 48 }: { size?: number }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div
        className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        KJ
      </div>
    );
  }

  return (
    <Image
      src="/images/kleiton-profile.jpg"
      alt="Kleiton Jatobá"
      width={size}
      height={size}
      className="rounded-full object-cover"
      onError={() => setImageError(true)}
    />
  );
}

// Componente de Última Atualização
function LastUpdateInfo() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm bg-zinc-800/50 px-3 py-2 rounded-lg">
      <Clock className="w-4 h-4 text-blue-400" />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-zinc-400">Última atualização:</span>
        <span className="text-white font-medium">{PROJECT_CONFIG.lastUpdate.date}</span>
        <span className="text-zinc-500">às</span>
        <span className="text-white font-medium">{PROJECT_CONFIG.lastUpdate.time}</span>
        <span className="text-zinc-500">por</span>
        <div className="flex items-center gap-1">
          {PROJECT_CONFIG.lastUpdate.authorType === "ai" ? (
            <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs font-medium">
              🤖 {PROJECT_CONFIG.lastUpdate.author}
            </span>
          ) : (
            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
              <KleitonAvatar size={16} />
              {PROJECT_CONFIG.lastUpdate.author}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentationContent() {
  const [activeTab, setActiveTab] = useState("genesis");
  const { isSharedView, canCopy } = useShare();

  const activeTabData = tabs.find((t) => t.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  // Prepare documentation tabs for export
  const documentationTabs: DocumentationTab[] = [
    { id: "genesis", title: "Gênese & Intenção do Sistema", icon: "🧠", content: genesisContent },
    { id: "system-vision", title: "Visão Sistêmica & Funcionamento", icon: "🏗️", content: systemVisionContent },
    { id: "integrations", title: "Arquitetura de Integrações & APIs", icon: "🔌", content: integrationsContent },
    { id: "tech-stack", title: "Stack Tecnológica & Linguagens", icon: "🧱", content: techStackContent },
    { id: "current-state", title: "Estado Atual & Próximos Passos", icon: "🧭", content: currentStateContent },
  ];

  const handleExportMarkdown = () => {
    const tab = documentationTabs.find((t) => t.id === activeTab);
    if (tab) exportTabAsMarkdown(tab);
  };

  const handleExportAllMarkdown = () => {
    exportAllTabsAsMarkdown(documentationTabs);
  };

  const handleExportPDF = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (tab) exportTabAsPDF(activeTab, tab.label);
  };

  return (
    <div className="min-h-screen">
      {/* Header Principal com Nome do Sistema */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-8 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto">
          {/* Título do Sistema */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              📺 {PROJECT_CONFIG.name}
            </h1>
            <p className="text-white/90 text-base sm:text-lg">
              {PROJECT_CONFIG.subtitle}
            </p>
            <p className="text-white/70 text-sm mt-1">
              Documentação Técnica Completa
            </p>
          </div>

          {/* Countdown de Lançamento */}
          <div className="flex justify-center mb-6">
            <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <CountdownTimer targetDate={PROJECT_CONFIG.launchDate} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Documentação Viva
                </h2>
                <p className="text-white/80 text-sm sm:text-base">
                  Memória cognitiva e base de auditoria técnica
                </p>
              </div>
            </div>

            {/* Share Button - Only visible for owners */}
            {!isSharedView && (
              <div className="sm:ml-auto">
                <ShareButtons />
              </div>
            )}
          </div>

          {/* Founder Info com Foto */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-6 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/30">
                <KleitonAvatar size={48} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm sm:text-base">Kleiton Jatobá</p>
                <p className="text-white/70 text-xs sm:text-sm">Founder & Creator</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
              <Mail className="w-4 h-4" />
              <a href="mailto:akzdigitalbr@gmail.com" className="hover:text-white transition-colors">
                akzdigitalbr@gmail.com
              </a>
            </div>
          </div>

          {/* Export Buttons - Only visible for owners */}
          {canCopy && (
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm font-medium transition-all"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar Aba (Markdown)</span>
                <span className="sm:hidden">Aba MD</span>
              </button>
              <button
                onClick={handleExportAllMarkdown}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm font-medium transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar Tudo (Markdown)</span>
                <span className="sm:hidden">Tudo MD</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm font-medium transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar Aba (PDF)</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>
          )}

          {/* Shared View Notice */}
          {isSharedView && (
            <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl">
              <p className="text-amber-200 text-sm">
                Você está visualizando uma versão compartilhada desta documentação.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Seção de Progresso e Última Atualização */}
      <div className="bg-zinc-950 border-b border-zinc-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Última Atualização */}
          <LastUpdateInfo />

          {/* Barra de Progresso do Projeto */}
          <ProjectProgress />
        </div>
      </div>

        {/* Tab Navigation */}
        <div className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex overflow-x-auto gap-1 py-2 hide-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all",
                      isActive
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Description */}
        {activeTabData && (
          <div className="bg-zinc-900/30 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                <span>{activeTabData.description}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <div id={`tab-content-${activeTab}`}>
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* Protection for shared views */
        .shared-view {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .shared-view * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export default function DocumentationPage() {
  return (
    <Layout>
      <ShareProvider>
        <DocumentationContent />
      </ShareProvider>
    </Layout>
  );
}
