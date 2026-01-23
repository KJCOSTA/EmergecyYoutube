'use client';

interface TypographySampleProps {
  name: string;
  description?: string;
  className?: string;
  fontClass?: string;
  sampleText?: string;
  specs?: {
    size?: string;
    weight?: string;
    lineHeight?: string;
    letterSpacing?: string;
  };
}

export function TypographySample({
  name,
  description,
  className = '',
  fontClass = '',
  sampleText = 'O rápido rato roeu a roupa do rei de Roma.',
  specs,
}: TypographySampleProps) {
  return (
    <div className={`card-glass p-6 rounded-xl ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div>
          <h4 className="text-lg font-semibold text-foreground">{name}</h4>
          {description && (
            <p className="text-sm text-foreground-muted mt-1">{description}</p>
          )}
        </div>
        {specs && (
          <div className="flex flex-wrap gap-2">
            {specs.size && (
              <span className="badge-default text-2xs">
                {specs.size}
              </span>
            )}
            {specs.weight && (
              <span className="badge-default text-2xs">
                {specs.weight}
              </span>
            )}
            {specs.lineHeight && (
              <span className="badge-default text-2xs">
                LH: {specs.lineHeight}
              </span>
            )}
            {specs.letterSpacing && (
              <span className="badge-default text-2xs">
                LS: {specs.letterSpacing}
              </span>
            )}
          </div>
        )}
      </div>
      <p className={`text-foreground ${fontClass}`}>{sampleText}</p>
    </div>
  );
}

interface TypographyScaleProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function TypographyScale({ title, description, children, className = '' }: TypographyScaleProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-foreground-muted">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export function FontPreview() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Sans */}
      <div className="card-glass p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Inter</h4>
          <span className="badge-info">Sans-serif</span>
        </div>
        <p className="text-foreground mb-4">
          Fonte principal para UI, textos e títulos. Moderna, legível e com
          ótimo suporte a múltiplos pesos.
        </p>
        <div className="space-y-2 border-t border-border-subtle pt-4">
          <p className="font-normal text-foreground-muted">Regular 400</p>
          <p className="font-medium text-foreground-muted">Medium 500</p>
          <p className="font-semibold text-foreground-muted">Semibold 600</p>
          <p className="font-bold text-foreground-muted">Bold 700</p>
        </div>
      </div>

      {/* Mono */}
      <div className="card-glass p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">JetBrains Mono</h4>
          <span className="badge-default">Monospace</span>
        </div>
        <p className="text-foreground mb-4">
          Fonte monospace para código, dados numéricos e elementos técnicos.
          Excelente legibilidade em tamanhos pequenos.
        </p>
        <div className="space-y-2 border-t border-border-subtle pt-4 font-mono">
          <p className="text-foreground-muted">const hello = &apos;world&apos;;</p>
          <p className="text-foreground-muted">1234567890</p>
          <p className="text-foreground-muted">@#$%^&*()_+=</p>
        </div>
      </div>
    </div>
  );
}
