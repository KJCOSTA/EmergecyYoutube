'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface ColorSwatchProps {
  name: string;
  value: string;
  cssVariable?: string;
  showHex?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ColorSwatch({
  name,
  value,
  cssVariable,
  showHex = true,
  size = 'md',
  className = '',
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const copyToClipboard = async () => {
    const textToCopy = cssVariable || value;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`group ${className}`}>
      <button
        onClick={copyToClipboard}
        className={`
          ${sizes[size]}
          rounded-xl border border-border-subtle
          transition-all duration-200
          hover:scale-105 hover:border-border-active
          hover:shadow-glow-md
          relative overflow-hidden
          focus:outline-none focus:ring-2 focus:ring-cyan-500/50
        `}
        style={{ backgroundColor: value }}
        title={`Copiar: ${cssVariable || value}`}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
          {copied ? (
            <Check className="w-5 h-5 text-success" />
          ) : (
            <Copy className="w-4 h-4 text-white" />
          )}
        </div>
      </button>

      <div className="mt-2 space-y-0.5">
        <p className="text-sm font-medium text-foreground truncate">{name}</p>
        {showHex && (
          <p className="text-xs text-foreground-muted font-mono">
            {value.startsWith('var(') ? cssVariable : value}
          </p>
        )}
      </div>
    </div>
  );
}

interface ColorPaletteProps {
  name: string;
  colors: { shade: string; value: string; cssVar?: string }[];
  className?: string;
}

export function ColorPalette({ name, colors, className = '' }: ColorPaletteProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        {name}
      </h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <ColorSwatch
            key={color.shade}
            name={color.shade}
            value={color.value}
            cssVariable={color.cssVar}
            size="md"
          />
        ))}
      </div>
    </div>
  );
}

interface ColorGridProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ColorGrid({ title, description, children, className = '' }: ColorGridProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-foreground-muted">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {children}
      </div>
    </div>
  );
}
