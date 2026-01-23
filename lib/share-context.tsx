"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ShareContextType {
  isSharedView: boolean;
  shareToken: string | null;
  generateShareLink: () => string;
  canCopy: boolean;
  canShare: boolean;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

// Generate a unique share token
function generateToken(): string {
  return btoa(Date.now().toString(36) + Math.random().toString(36).substring(2));
}

// Store owner tokens in localStorage
function getOwnerTokens(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const tokens = localStorage.getItem("ey_owner_tokens");
    return tokens ? JSON.parse(tokens) : [];
  } catch {
    return [];
  }
}

function addOwnerToken(token: string) {
  if (typeof window === "undefined") return;
  const tokens = getOwnerTokens();
  if (!tokens.includes(token)) {
    tokens.push(token);
    localStorage.setItem("ey_owner_tokens", JSON.stringify(tokens));
  }
}

export function ShareProvider({ children }: { children: ReactNode }) {
  const [isSharedView, setIsSharedView] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if this is a shared view by looking at the URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("s");

    if (token) {
      // Check if this token belongs to the owner
      const ownerTokens = getOwnerTokens();
      if (!ownerTokens.includes(token)) {
        // This is a viewer (not the owner)
        setIsSharedView(true);
        setShareToken(token);

        // Apply copy protection for shared views
        document.body.classList.add("shared-view");

        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => {
          e.preventDefault();
          return false;
        };

        // Disable copy/cut
        const handleCopy = (e: ClipboardEvent) => {
          e.preventDefault();
          return false;
        };

        // Disable text selection via keyboard
        const handleKeydown = (e: KeyboardEvent) => {
          if (
            (e.ctrlKey || e.metaKey) &&
            (e.key === "c" || e.key === "a" || e.key === "u" || e.key === "s")
          ) {
            e.preventDefault();
            return false;
          }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("copy", handleCopy);
        document.addEventListener("cut", handleCopy);
        document.addEventListener("keydown", handleKeydown);

        return () => {
          document.removeEventListener("contextmenu", handleContextMenu);
          document.removeEventListener("copy", handleCopy);
          document.removeEventListener("cut", handleCopy);
          document.removeEventListener("keydown", handleKeydown);
          document.body.classList.remove("shared-view");
        };
      }
    }
  }, []);

  const generateShareLink = (): string => {
    const token = generateToken();
    addOwnerToken(token); // Mark this token as owned by the creator

    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?s=${token}`;
  };

  return (
    <ShareContext.Provider
      value={{
        isSharedView,
        shareToken,
        generateShareLink,
        canCopy: !isSharedView,
        canShare: !isSharedView,
      }}
    >
      {children}
    </ShareContext.Provider>
  );
}

export function useShare() {
  const context = useContext(ShareContext);
  if (context === undefined) {
    throw new Error("useShare must be used within a ShareProvider");
  }
  return context;
}
