"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkflowStore, useUIStore } from "@/lib/store";
import { WorkflowStep } from "@/types";
import {
  Menu,
  X,
  FileInput,
  Brain,
  FileVideo,
  Film,
  Upload,
  BookOpen,
  ChevronRight,
  Key,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const steps: {
  step: WorkflowStep;
  label: string;
  icon: React.ReactNode;
  path: string;
}[] = [
  {
    step: 1,
    label: "Entrada",
    icon: <FileInput className="w-5 h-5" />,
    path: "/step/1-input",
  },
  {
    step: 2,
    label: "Inteligência",
    icon: <Brain className="w-5 h-5" />,
    path: "/step/2-research",
  },
  {
    step: 4,
    label: "Proposta",
    icon: <FileVideo className="w-5 h-5" />,
    path: "/step/4-proposal",
  },
  {
    step: 5,
    label: "Studio",
    icon: <Film className="w-5 h-5" />,
    path: "/step/5-studio",
  },
  {
    step: 6,
    label: "Upload",
    icon: <Upload className="w-5 h-5" />,
    path: "/step/6-upload",
  },
];

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { currentStep, canNavigateToStep } = useWorkflowStore();
  const { isSidebarOpen, toggleSidebar, openGuidelinesModal, openApiKeyModal } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getStepStatus = (step: WorkflowStep) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    if (canNavigateToStep(step)) return "available";
    return "locked";
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg border border-gray-800"
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileVideo className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Emergency YT</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Workflow
            </p>
            {steps.map(({ step, label, icon, path }) => {
              const status = getStepStatus(step);
              const isActive = pathname === path;
              const isLocked = status === "locked";

              return (
                <Link
                  key={step}
                  href={isLocked ? "#" : path}
                  onClick={(e) => {
                    if (isLocked) e.preventDefault();
                    if (isMobile) toggleSidebar();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary-600/20 text-primary-400"
                      : status === "completed"
                      ? "text-green-400 hover:bg-gray-800"
                      : isLocked
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg",
                      isActive
                        ? "bg-primary-600/30"
                        : status === "completed"
                        ? "bg-green-500/20"
                        : "bg-gray-800"
                    )}
                  >
                    {icon}
                  </span>
                  <span className="font-medium">{label}</span>
                  {status === "completed" && (
                    <span className="ml-auto text-green-400 text-xs">✓</span>
                  )}
                  {isLocked && (
                    <span className="ml-auto text-gray-600 text-xs">🔒</span>
                  )}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="my-4 border-t border-gray-800" />

            {/* Global Settings */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Configurações
            </p>

            <button
              onClick={() => {
                openGuidelinesModal();
                if (isMobile) toggleSidebar();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="font-medium">Diretrizes</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>

            <button
              onClick={() => {
                openApiKeyModal();
                if (isMobile) toggleSidebar();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800">
                <Key className="w-5 h-5" />
              </span>
              <span className="font-medium">API Keys</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              Emergency YouTube v0.1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
