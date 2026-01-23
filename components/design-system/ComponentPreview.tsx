'use client';

import { useState } from 'react';
import { Code, Eye } from 'lucide-react';

interface ComponentPreviewProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  code?: string;
  className?: string;
}

export function ComponentPreview({
  title,
  description,
  children,
  code,
  className = '',
}: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className={`card-glass overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
        <div>
          <h4 className="text-lg font-semibold text-foreground">{title}</h4>
          {description && (
            <p className="text-sm text-foreground-muted mt-0.5">{description}</p>
          )}
        </div>
        {code && (
          <button
            onClick={() => setShowCode(!showCode)}
            className={`
              btn-ghost btn-sm gap-2
              ${showCode ? 'text-cyan-400' : ''}
            `}
          >
            {showCode ? (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            ) : (
              <>
                <Code className="w-4 h-4" />
                Código
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      {showCode && code ? (
        <div className="p-6 bg-layer-1">
          <pre className="text-sm font-mono text-foreground-secondary overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      ) : (
        <div className="p-6 bg-layer-0/50">
          {children}
        </div>
      )}
    </div>
  );
}

interface ComponentSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ComponentSection({ title, description, children, className = '' }: ComponentSectionProps) {
  return (
    <section className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-2 text-foreground-muted">{description}</p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}

interface PreviewGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export function PreviewGrid({ children, cols = 2, className = '' }: PreviewGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-6 ${className}`}>
      {children}
    </div>
  );
}

interface SpacingPreviewProps {
  name: string;
  value: string;
  className?: string;
}

export function SpacingPreview({ name, value, className = '' }: SpacingPreviewProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div
        className="bg-cyan-500/30 border border-cyan-500/50 rounded"
        style={{ width: value, height: value, minWidth: '4px', minHeight: '4px' }}
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-foreground-muted font-mono">{value}</p>
      </div>
    </div>
  );
}

interface ShadowPreviewProps {
  name: string;
  shadow: string;
  className?: string;
}

export function ShadowPreview({ name, shadow, className = '' }: ShadowPreviewProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="w-24 h-24 bg-layer-2 rounded-xl mb-3"
        style={{ boxShadow: shadow }}
      />
      <p className="text-sm font-medium text-foreground text-center">{name}</p>
    </div>
  );
}

interface RadiusPreviewProps {
  name: string;
  radius: string;
  className?: string;
}

export function RadiusPreview({ name, radius, className = '' }: RadiusPreviewProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className="w-20 h-20 bg-gradient-cyan-blue mb-3"
        style={{ borderRadius: radius }}
      />
      <p className="text-sm font-medium text-foreground">{name}</p>
      <p className="text-xs text-foreground-muted font-mono">{radius}</p>
    </div>
  );
}
