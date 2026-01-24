"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore, useBrandingStore } from "@/lib/store";
import {
  Menu,
  X,
  Home,
  Workflow,
  BookOpen,
  Key,
  ChevronRight,
  FileText,
  Settings,
  ChevronLeft,
  LogOut,
  Palette,
} from "lucide-react";
import GuidelinesModal from "./GuidelinesModal";
import ConnectApisModal from "./ConnectApisModal";
import { getProfile } from "@/app/actions/settings";
import type { UserProfile } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, openGuidelinesModal, openApiKeyModal } = useUIStore();
  const { systemName, logoUrl } = useBrandingStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
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
      label: "Design System",
      icon: <Palette className="w-5 h-5" />,
      path: "/documentation/design-system",
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

  const settingsItem = {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    path: "/settings",
    type: "link" as const,
  };

  return (
    <div className="min-h-screen bg-layer-0 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-layer-1 rounded-lg border border-default"
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
          "fixed lg:sticky top-0 left-0 z-40 h-screen bg-layer-1 border-r border-default transition-all duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed && !isMobile ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-default">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 relative">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="ORION"
                    className="w-full h-full object-contain drop-shadow-glow"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  /* Fallback: Logo SVG ORION */
                  <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-glow-md shadow-cyan-500/50 group-hover:shadow-glow-lg group-hover:shadow-cyan-400/70 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                    <span className="relative text-white font-black text-lg tracking-tighter drop-shadow-lg">
                      OR
                    </span>
                  </div>
                )}
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent whitespace-nowrap group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-cyan-300 transition-all duration-300">
                    {systemName}
                  </span>
                  <span className="text-xs text-cyan-400 font-medium">
                    AI-Powered Production
                  </span>
                </div>
              )}
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
                        ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                        : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary",
                      isCollapsed && !isMobile && "justify-center"
                    )}
                    title={isCollapsed && !isMobile ? item.label : undefined}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                        isActive
                          ? "bg-cyan-500/25"
                          : "bg-surface-default"
                      )}
                    >
                      {item.icon}
                    </span>
                    {(!isCollapsed || isMobile) && (
                      <span className="font-medium">{item.label}</span>
                    )}
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
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-all duration-200",
                      isCollapsed && !isMobile && "justify-center"
                    )}
                    title={isCollapsed && !isMobile ? item.label : undefined}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-default flex-shrink-0">
                      {item.icon}
                    </span>
                    {(!isCollapsed || isMobile) && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </button>
                );
              }
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-default space-y-3">
            {/* Settings Link */}
            <Link
              href={settingsItem.path}
              onClick={() => {
                if (isMobile) toggleSidebar();
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                pathname === settingsItem.path
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary",
                isCollapsed && !isMobile && "justify-center"
              )}
              title={isCollapsed && !isMobile ? settingsItem.label : undefined}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                  pathname === settingsItem.path
                    ? "bg-emerald-500/25"
                    : "bg-surface-default"
                )}
              >
                {settingsItem.icon}
              </span>
              {(!isCollapsed || isMobile) && (
                <span className="font-medium">{settingsItem.label}</span>
              )}
            </Link>

            {/* Collapse Button (desktop only) */}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-all duration-200 group border border-transparent hover:border-border-subtle"
                title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-default group-hover:bg-cyan-500/10 transition-colors">
                  <ChevronLeft className={cn(
                    "w-4 h-4 transition-all duration-300 group-hover:text-cyan-400",
                    isCollapsed && "rotate-180"
                  )} />
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-medium flex-1 text-left">Recolher</span>
                )}
              </button>
            )}

            {/* Version */}
            {(!isCollapsed || isMobile) && (
              <p className="text-xs text-text-muted text-center">
                {systemName} v1.0.0
              </p>
            )}
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
      <main className="flex-1 min-h-screen flex flex-col">
        {/* Header with User Avatar */}
        <header className="sticky top-0 z-30 bg-layer-1/95 backdrop-blur-sm border-b border-default">
          <div className="flex items-center justify-end px-6 py-3 gap-4">
            {/* System Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-75" />
                <div className="relative w-2 h-2 bg-success rounded-full" />
              </div>
              <span className="text-xs font-medium text-success">Sistema Operacional</span>
            </div>

            {profile && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-elevated transition-all"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-text-primary">{profile.name}</p>
                    <p className="text-xs text-text-secondary">{profile.role}</p>
                  </div>
                  <div className="relative">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-9 h-9 rounded-full border-2 border-subtle"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-layer-1" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-layer-2 border border-default rounded-lg shadow-xl z-50 overflow-hidden">
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-surface-elevated transition-colors text-text-secondary hover:text-text-primary"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Configurações</span>
                      </Link>
                      <div className="border-t border-default" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          window.location.reload();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-elevated transition-colors text-red-400 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sair</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Modals */}
      <GuidelinesModal />
      <ConnectApisModal />
    </div>
  );
}
