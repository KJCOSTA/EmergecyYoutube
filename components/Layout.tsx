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
  User,
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
          "fixed lg:sticky top-0 left-0 z-40 h-screen bg-zinc-900 border-r border-zinc-800 transition-all duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed && !isMobile ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={systemName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {systemName.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              {(!isCollapsed || isMobile) && (
                <span className="text-lg font-bold text-white whitespace-nowrap overflow-hidden">
                  {systemName}
                </span>
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
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                      isCollapsed && !isMobile && "justify-center"
                    )}
                    title={isCollapsed && !isMobile ? item.label : undefined}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                        isActive
                          ? "bg-indigo-600/30"
                          : "bg-zinc-800"
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
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all duration-200",
                      isCollapsed && !isMobile && "justify-center"
                    )}
                    title={isCollapsed && !isMobile ? item.label : undefined}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 flex-shrink-0">
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
          <div className="p-4 border-t border-zinc-800 space-y-3">
            {/* Settings Link */}
            <Link
              href={settingsItem.path}
              onClick={() => {
                if (isMobile) toggleSidebar();
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                pathname === settingsItem.path
                  ? "bg-green-600/20 text-green-400 border border-green-500/30"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                isCollapsed && !isMobile && "justify-center"
              )}
              title={isCollapsed && !isMobile ? settingsItem.label : undefined}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                  pathname === settingsItem.path
                    ? "bg-green-600/30"
                    : "bg-zinc-800"
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
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-all"
                title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
              >
                <ChevronLeft className={cn(
                  "w-5 h-5 transition-transform",
                  isCollapsed && "rotate-180"
                )} />
                {!isCollapsed && (
                  <span className="text-xs font-medium">Recolher</span>
                )}
              </button>
            )}

            {/* Version */}
            {(!isCollapsed || isMobile) && (
              <p className="text-xs text-zinc-500 text-center">
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
        <header className="sticky top-0 z-30 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="flex items-center justify-end px-6 py-3">
            {profile && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-all"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{profile.name}</p>
                    <p className="text-xs text-zinc-400">{profile.role}</p>
                  </div>
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-9 h-9 rounded-full border-2 border-zinc-700"
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 overflow-hidden">
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Meu Perfil</span>
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-3 hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Configurações</span>
                      </Link>
                      <div className="border-t border-zinc-800" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          window.location.reload();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-zinc-800 transition-colors text-red-400 hover:text-red-300"
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
        <div className="flex-1">
          {children}
        </div>
      </main>

      {/* Modals */}
      <GuidelinesModal />
      <ConnectApisModal />
    </div>
  );
}
