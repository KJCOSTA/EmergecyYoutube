"use client";

import { useState } from "react";
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
  User,
  Mail,
} from "lucide-react";
import { ShareProvider, useShare } from "@/lib/share-context";
import ShareButtons from "@/components/documentation/ShareButtons";

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
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Documentação Viva
                </h1>
                <p className="text-white/80 text-sm sm:text-base">
                  Memória cognitiva e base de auditoria técnica do sistema
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

          {/* Founder Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-6 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                KJ
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
