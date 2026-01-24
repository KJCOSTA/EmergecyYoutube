"use client";

import { useState, useEffect } from "react";
import { Copy, Check, FileCode } from "lucide-react";

// Check if we're in a shared view context
function useCanCopy() {
  const [canCopy, setCanCopy] = useState(true);

  useEffect(() => {
    // Check URL for share token
    const params = new URLSearchParams(window.location.search);
    const token = params.get("s");

    if (token) {
      // Check if this token belongs to the owner
      try {
        const tokens = localStorage.getItem("ey_owner_tokens");
        const ownerTokens = tokens ? JSON.parse(tokens) : [];
        if (!ownerTokens.includes(token)) {
          setCanCopy(false);
        }
      } catch {
        setCanCopy(false);
      }
    }
  }, []);

  return canCopy;
}

interface CopyButtonProps {
  content: string;
  className?: string;
}

export function CopyButton({ content, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const canCopy = useCanCopy();

  if (!canCopy) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-lg transition-all ${
        copied
          ? "bg-green-500/20 text-green-400"
          : "bg-layer-2/50 text-muted hover:bg-zinc-700 hover:text-white"
      } ${className}`}
      title={copied ? "Copiado!" : "Copiar"}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

interface MarkdownButtonProps {
  content: string;
  filename?: string;
  className?: string;
}

export function MarkdownButton({ content, filename = "content.md", className = "" }: MarkdownButtonProps) {
  const canCopy = useCanCopy();

  if (!canCopy) return null;

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className={`p-1.5 rounded-lg transition-all bg-layer-2/50 text-muted hover:bg-indigo-500/20 hover:text-indigo-400 ${className}`}
      title="Exportar como Markdown"
    >
      <FileCode className="w-3.5 h-3.5" />
    </button>
  );
}

interface CopyMdButtonsProps {
  content: string;
  markdownContent?: string;
  filename?: string;
  className?: string;
}

export function CopyMdButtons({ content, markdownContent, filename, className = "" }: CopyMdButtonsProps) {
  const canCopy = useCanCopy();

  if (!canCopy) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <CopyButton content={content} />
      <MarkdownButton content={markdownContent || content} filename={filename} />
    </div>
  );
}

export default CopyMdButtons;
