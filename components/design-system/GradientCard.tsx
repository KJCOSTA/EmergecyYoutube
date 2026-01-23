'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface GradientCardProps {
  name: string;
  cssVariable: string;
  gradient: string;
  description?: string;
  className?: string;
}

export function GradientCard({
  name,
  cssVariable,
  gradient,
  description,
  className = '',
}: GradientCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(cssVariable);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group ${className}`}>
      <button
        onClick={copyToClipboard}
        className="
          w-full h-32 rounded-xl border border-border-subtle
          transition-all duration-300
          hover:scale-[1.02] hover:border-border-active
          hover:shadow-card-hover
          relative overflow-hidden
          focus:outline-none focus:ring-2 focus:ring-cyan-500/50
        "
        style={{ background: gradient }}
        title={`Copiar: ${cssVariable}`}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
          {copied ? (
            <div className="flex items-center gap-2 text-success">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Copiado!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-white">
              <Copy className="w-4 h-4" />
              <span className="text-sm">Copiar CSS</span>
            </div>
          )}
        </div>
      </button>

      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-foreground-muted font-mono truncate">{cssVariable}</p>
        {description && (
          <p className="text-xs text-foreground-muted">{description}</p>
        )}
      </div>
    </div>
  );
}

interface GradientGridProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function GradientGrid({ title, description, children, className = '' }: GradientGridProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-foreground-muted">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}
