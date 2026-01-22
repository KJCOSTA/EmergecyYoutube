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
} from "lucide-react";

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

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState("genesis");

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
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Documentação Viva
                </h1>
                <p className="text-white/80">
                  Memória cognitiva e base de auditoria técnica do sistema
                </p>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all"
              >
                <FileText className="w-4 h-4" />
                Exportar Aba (Markdown)
              </button>
              <button
                onClick={handleExportAllMarkdown}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all"
              >
                <FileDown className="w-4 h-4" />
                Exportar Tudo (Markdown)
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all"
              >
                <Download className="w-4 h-4" />
                Exportar Aba (PDF)
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex overflow-x-auto gap-1 py-2 hide-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                      isActive
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Description */}
        {activeTabData && (
          <div className="bg-zinc-900/30 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-8 py-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <ChevronRight className="w-4 h-4" />
                <span>{activeTabData.description}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
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
      `}</style>
    </Layout>
  );
}
