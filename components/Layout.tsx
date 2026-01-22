"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";
import {
  Menu,
  X,
  Home,
  Workflow,
  BookOpen,
  Key,
  ChevronRight,
  FileText,
} from "lucide-react";
import GuidelinesModal from "./GuidelinesModal";
import ConnectApisModal from "./ConnectApisModal";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
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

  const menuItems = [
    {
      label: "Home",
      icon: <Home className="w-5 h-5" />,
      path: "/",
      type: "link" as const,
    },
    {
      label: "WorkFlow",
      icon: <Workflow className="w-5 h-5" />,
      path: "/workflow",
      type: "link" as const,
    },
    {
      label: "Documentação",
      icon: <FileText className="w-5 h-5" />,
      path: "/documentation",
      type: "link" as const,
    },
    {
      label: "Diretrizes",
      icon: <BookOpen className="w-5 h-5" />,
      type: "button" as const,
      onClick: openGuidelinesModal,
    },
    {
      label: "API Keys",
      icon: <Key className="w-5 h-5" />,
      type: "button" as const,
      onClick: openApiKeyModal,
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg border border-zinc-800"
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
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-zinc-900 border-r border-zinc-800 transition-transform duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EY</span>
              </div>
              <span className="text-lg font-bold text-white">Emergency YT</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-auto">
            {menuItems.map((item, index) => {
              if (item.type === "link") {
                const isActive = pathname === item.path ||
                    (item.path === "/workflow" && pathname.startsWith("/step/")) ||
                    (item.path === "/documentation" && pathname.startsWith("/documentation"));

                return (
                  <Link
                    key={index}
                    href={item.path}
                    onClick={() => {
                      if (isMobile) toggleSidebar();
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg",
                        isActive
                          ? "bg-indigo-600/30"
                          : "bg-zinc-800"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              } else {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick?.();
                      if (isMobile) toggleSidebar();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all duration-200"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                );
              }
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center">
              Emergency YouTube v1.0.0
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
        {children}
      </main>

      {/* Modals */}
      <GuidelinesModal />
      <ConnectApisModal />
    </div>
  );
}
