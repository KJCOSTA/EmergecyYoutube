'use client';

import { useState } from 'react';
import {
  Palette,
  Type,
  Box,
  Layers,
  Sparkles,
  Zap,
  MousePointer2,
  Layout,
  Circle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  ChevronRight,
  Loader2,
  ArrowRight,
  Settings,
  Bell,
  Star,
} from 'lucide-react';
import {
  ColorSwatch,
  ColorPalette,
  ColorGrid,
  GradientCard,
  GradientGrid,
  TypographySample,
  TypographyScale,
  FontPreview,
  ComponentPreview,
  ComponentSection,
  PreviewGrid,
  SpacingPreview,
  ShadowPreview,
  RadiusPreview,
} from '@/components/design-system';

// Navegação do Design System
const sections = [
  { id: 'overview', label: 'Visão Geral', icon: Layout },
  { id: 'colors', label: 'Cores', icon: Palette },
  { id: 'gradients', label: 'Gradientes', icon: Sparkles },
  { id: 'typography', label: 'Tipografia', icon: Type },
  { id: 'spacing', label: 'Espaçamento', icon: Box },
  { id: 'components', label: 'Componentes', icon: Layers },
  { id: 'motion', label: 'Motion', icon: Zap },
  { id: 'guidelines', label: 'Guidelines', icon: MousePointer2 },
];

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-layer-0">
      {/* Header Hero */}
      <header className="relative overflow-hidden border-b border-border-subtle">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-orion-deep opacity-50" />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-mesh)' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-cyan-blue flex items-center justify-center shadow-glow-md">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="badge-info">v1.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            ORION{' '}
            <span className="text-gradient">Design System</span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground-secondary max-w-2xl mb-8">
            Sistema de design completo para a plataforma ORION. Uma linguagem visual
            unificada que guia todas as experiências do produto.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Dark-first</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Glassmorphism</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Motion disciplinado</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Acessível</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <nav className="lg:sticky lg:top-6 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200 text-left
                      ${isActive
                        ? 'bg-surface-glass border border-border-active text-foreground shadow-glow-sm'
                        : 'text-foreground-muted hover:text-foreground hover:bg-surface-glass-subtle'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-24">
            {/* Overview */}
            <section id="overview" className="scroll-mt-6">
              <SectionHeader
                title="Visão Geral"
                description="Fundamentos e princípios do Design System ORION."
              />

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <PrincipleCard
                  icon={<Circle className="w-6 h-6" />}
                  title="Dark-First"
                  description="Projetado primariamente para modo escuro. Um centro de comando para produção de vídeos exige foco e redução de fadiga visual."
                />
                <PrincipleCard
                  icon={<Layers className="w-6 h-6" />}
                  title="Profundidade"
                  description="Sistema de camadas (layers) que cria hierarquia visual clara. Do layer-0 mais profundo ao layer-4 mais elevado."
                />
                <PrincipleCard
                  icon={<Sparkles className="w-6 h-6" />}
                  title="Glassmorphism Moderado"
                  description="Efeitos de vidro sutis para criar sofisticação sem comprometer legibilidade ou performance."
                />
                <PrincipleCard
                  icon={<Zap className="w-6 h-6" />}
                  title="Motion Funcional"
                  description="Animações servem a um propósito: feedback, transição de contexto ou indicação de estado. Nunca decorativas."
                />
              </div>

              {/* Color Identity */}
              <div className="mt-12 card-glass p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-foreground mb-6">Identidade de Cores</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="h-24 rounded-xl bg-gradient-cyan-blue shadow-glow-md" />
                    <div>
                      <h4 className="font-semibold text-foreground">Azul ORION + Cyan</h4>
                      <p className="text-sm text-foreground-muted mt-1">
                        Cor principal. Transmite confiança, tecnologia e profissionalismo.
                        Usado em CTAs primários, estados ativos e elementos de foco.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-24 rounded-xl bg-orion-red-600 shadow-lg" />
                    <div>
                      <h4 className="font-semibold text-foreground">Vermelho ORION</h4>
                      <p className="text-sm text-foreground-muted mt-1">
                        Acento crítico do logo. Estritamente limitado a CTAs críticos,
                        estados de erro ou ações irreversíveis.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-24 rounded-xl bg-gradient-orion-deep" />
                    <div>
                      <h4 className="font-semibold text-foreground">Azul Profundo</h4>
                      <p className="text-sm text-foreground-muted mt-1">
                        Base do sistema. Múltiplas camadas de azul escuro criam
                        profundidade e hierarquia visual.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Colors */}
            <section id="colors" className="scroll-mt-6">
              <SectionHeader
                title="Cores"
                description="Paleta completa de cores do sistema ORION."
              />

              {/* Background Layers */}
              <ColorGrid
                title="Backgrounds (Layers)"
                description="Sistema de camadas para criar profundidade visual."
                className="mt-8"
              >
                <ColorSwatch name="Layer 0" value="#050A12" cssVariable="--bg-layer-0" />
                <ColorSwatch name="Layer 1" value="#0A1628" cssVariable="--bg-layer-1" />
                <ColorSwatch name="Layer 2" value="#0F2341" cssVariable="--bg-layer-2" />
                <ColorSwatch name="Layer 3" value="#1A3A5C" cssVariable="--bg-layer-3" />
                <ColorSwatch name="Layer 4" value="#245177" cssVariable="--bg-layer-4" />
              </ColorGrid>

              {/* Brand Colors */}
              <div className="mt-12 space-y-8">
                <ColorPalette
                  name="ORION Blue"
                  colors={[
                    { shade: '50', value: '#E8F4FC', cssVar: '--orion-blue-50' },
                    { shade: '100', value: '#C5E4F8', cssVar: '--orion-blue-100' },
                    { shade: '200', value: '#8EC8F2', cssVar: '--orion-blue-200' },
                    { shade: '300', value: '#57ACEB', cssVar: '--orion-blue-300' },
                    { shade: '400', value: '#3B82F6', cssVar: '--orion-blue-400' },
                    { shade: '500', value: '#2563EB', cssVar: '--orion-blue-500' },
                    { shade: '600', value: '#1D4ED8', cssVar: '--orion-blue-600' },
                    { shade: '700', value: '#1E3A5F', cssVar: '--orion-blue-700' },
                    { shade: '800', value: '#0F2341', cssVar: '--orion-blue-800' },
                    { shade: '900', value: '#0A1628', cssVar: '--orion-blue-900' },
                    { shade: '950', value: '#050A12', cssVar: '--orion-blue-950' },
                  ]}
                />

                <ColorPalette
                  name="Cyan (Estados Ativos)"
                  colors={[
                    { shade: '400', value: '#22D3EE', cssVar: '--accent-cyan-400' },
                    { shade: '500', value: '#06B6D4', cssVar: '--accent-cyan-500' },
                    { shade: '600', value: '#0891B2', cssVar: '--accent-cyan-600' },
                  ]}
                />

                <ColorPalette
                  name="Indigo (Estados Secundários)"
                  colors={[
                    { shade: '400', value: '#818CF8', cssVar: '--accent-indigo-400' },
                    { shade: '500', value: '#6366F1', cssVar: '--accent-indigo-500' },
                    { shade: '600', value: '#4F46E5', cssVar: '--accent-indigo-600' },
                  ]}
                />

                <ColorPalette
                  name="Violet (Decorativo)"
                  colors={[
                    { shade: '400', value: '#A78BFA', cssVar: '--accent-violet-400' },
                    { shade: '500', value: '#8B5CF6', cssVar: '--accent-violet-500' },
                    { shade: '600', value: '#7C3AED', cssVar: '--accent-violet-600' },
                  ]}
                />

                <ColorPalette
                  name="ORION Red (Acento Crítico)"
                  colors={[
                    { shade: '400', value: '#F87171', cssVar: '--orion-red-400' },
                    { shade: '500', value: '#EF4444', cssVar: '--orion-red-500' },
                    { shade: '600', value: '#DC2626', cssVar: '--orion-red-600' },
                  ]}
                />
              </div>

              {/* Semantic Colors */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-foreground mb-6">Cores Semânticas</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SemanticColorCard
                    name="Success"
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    bgClass="bg-success-bg"
                    borderClass="border-success-border"
                    textClass="text-success-text"
                  />
                  <SemanticColorCard
                    name="Warning"
                    icon={<AlertCircle className="w-5 h-5" />}
                    bgClass="bg-warning-bg"
                    borderClass="border-warning-border"
                    textClass="text-warning-text"
                  />
                  <SemanticColorCard
                    name="Error"
                    icon={<XCircle className="w-5 h-5" />}
                    bgClass="bg-error-bg"
                    borderClass="border-error-border"
                    textClass="text-error-text"
                  />
                  <SemanticColorCard
                    name="Info"
                    icon={<Info className="w-5 h-5" />}
                    bgClass="bg-info-bg"
                    borderClass="border-info-border"
                    textClass="text-info-text"
                  />
                </div>
              </div>

              {/* Text Colors */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-foreground mb-6">Cores de Texto</h3>
                <div className="card-glass p-6 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-foreground">Texto Primário</span>
                    <code className="text-xs font-mono text-foreground-muted">--foreground</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-foreground-secondary">Texto Secundário</span>
                    <code className="text-xs font-mono text-foreground-muted">--foreground-secondary</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-foreground-muted">Texto Muted</span>
                    <code className="text-xs font-mono text-foreground-muted">--foreground-muted</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-foreground-disabled">Texto Disabled</span>
                    <code className="text-xs font-mono text-foreground-muted">--foreground-disabled</code>
                  </div>
                </div>
              </div>
            </section>

            {/* Gradients */}
            <section id="gradients" className="scroll-mt-6">
              <SectionHeader
                title="Gradientes"
                description="Gradientes oficiais do sistema ORION."
              />

              <GradientGrid
                title="Gradientes Principais"
                description="Usados em elementos de destaque e CTAs."
                className="mt-8"
              >
                <GradientCard
                  name="Cyan Blue"
                  cssVariable="--gradient-cyan-blue"
                  gradient="linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)"
                  description="Botões primários, CTAs"
                />
                <GradientCard
                  name="Blue Indigo"
                  cssVariable="--gradient-blue-indigo"
                  gradient="linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)"
                  description="Estados ativos, foco"
                />
                <GradientCard
                  name="Violet Blue"
                  cssVariable="--gradient-violet-blue"
                  gradient="linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)"
                  description="Elementos decorativos"
                />
              </GradientGrid>

              <GradientGrid
                title="Gradientes de Background"
                description="Usados em fundos e seções."
                className="mt-12"
              >
                <GradientCard
                  name="ORION Primary"
                  cssVariable="--gradient-orion-primary"
                  gradient="linear-gradient(135deg, #0A1628 0%, #1E3A5F 50%, #3B82F6 100%)"
                  description="Headers, heroes"
                />
                <GradientCard
                  name="ORION Dark"
                  cssVariable="--gradient-orion-dark"
                  gradient="linear-gradient(180deg, #050A12 0%, #0A1628 100%)"
                  description="Fundos principais"
                />
                <GradientCard
                  name="ORION Deep"
                  cssVariable="--gradient-orion-deep"
                  gradient="linear-gradient(135deg, #050A12 0%, #0F2341 100%)"
                  description="Seções profundas"
                />
              </GradientGrid>

              <GradientGrid
                title="Gradientes de Efeito"
                description="Usados para glow e efeitos visuais."
                className="mt-12"
              >
                <GradientCard
                  name="Cyan Glow"
                  cssVariable="--gradient-cyan-glow"
                  gradient="linear-gradient(180deg, rgba(6, 182, 212, 0.2) 0%, transparent 100%)"
                  description="Efeito de luz superior"
                />
                <GradientCard
                  name="Blue Glow"
                  cssVariable="--gradient-blue-glow"
                  gradient="linear-gradient(180deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%)"
                  description="Efeito de luz azul"
                />
                <GradientCard
                  name="Card Gradient"
                  cssVariable="--gradient-card"
                  gradient="linear-gradient(180deg, rgba(15, 35, 65, 0.5) 0%, rgba(10, 22, 40, 0.8) 100%)"
                  description="Fundo de cards"
                />
              </GradientGrid>
            </section>

            {/* Typography */}
            <section id="typography" className="scroll-mt-6">
              <SectionHeader
                title="Tipografia"
                description="Sistema tipográfico do ORION."
              />

              <FontPreview />

              <TypographyScale
                title="Escala de Tamanhos"
                description="Tamanhos de fonte padronizados."
                className="mt-12"
              >
                <TypographySample
                  name="Display Large"
                  description="Títulos hero"
                  fontClass="text-5xl font-bold tracking-tight"
                  specs={{ size: '3rem / 48px', weight: '700', lineHeight: '1.25' }}
                />
                <TypographySample
                  name="Display Medium"
                  description="Títulos de seção"
                  fontClass="text-4xl font-bold tracking-tight"
                  specs={{ size: '2.25rem / 36px', weight: '700', lineHeight: '1.25' }}
                />
                <TypographySample
                  name="Heading 1"
                  description="Títulos principais"
                  fontClass="text-3xl font-semibold"
                  specs={{ size: '1.875rem / 30px', weight: '600', lineHeight: '1.25' }}
                />
                <TypographySample
                  name="Heading 2"
                  description="Subtítulos"
                  fontClass="text-2xl font-semibold"
                  specs={{ size: '1.5rem / 24px', weight: '600', lineHeight: '1.33' }}
                />
                <TypographySample
                  name="Heading 3"
                  description="Títulos de card"
                  fontClass="text-xl font-semibold"
                  specs={{ size: '1.25rem / 20px', weight: '600', lineHeight: '1.4' }}
                />
                <TypographySample
                  name="Body Large"
                  description="Texto de destaque"
                  fontClass="text-lg"
                  specs={{ size: '1.125rem / 18px', weight: '400', lineHeight: '1.625' }}
                />
                <TypographySample
                  name="Body"
                  description="Texto padrão"
                  fontClass="text-base"
                  specs={{ size: '1rem / 16px', weight: '400', lineHeight: '1.5' }}
                />
                <TypographySample
                  name="Body Small"
                  description="Texto secundário"
                  fontClass="text-sm"
                  specs={{ size: '0.875rem / 14px', weight: '400', lineHeight: '1.43' }}
                />
                <TypographySample
                  name="Caption"
                  description="Legendas e labels"
                  fontClass="text-xs"
                  specs={{ size: '0.75rem / 12px', weight: '400', lineHeight: '1.33' }}
                />
                <TypographySample
                  name="Code"
                  description="Código e dados"
                  fontClass="text-sm font-mono"
                  sampleText="const orion = 'design-system';"
                  specs={{ size: '0.875rem / 14px', weight: '400' }}
                />
              </TypographyScale>
            </section>

            {/* Spacing */}
            <section id="spacing" className="scroll-mt-6">
              <SectionHeader
                title="Espaçamento"
                description="Sistema de espaçamento baseado em múltiplos de 4px."
              />

              <div className="mt-8 grid md:grid-cols-2 gap-8">
                {/* Spacing Scale */}
                <div className="card-glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Escala Base</h3>
                  <div className="space-y-4">
                    <SpacingPreview name="0.5" value="0.125rem" />
                    <SpacingPreview name="1" value="0.25rem" />
                    <SpacingPreview name="2" value="0.5rem" />
                    <SpacingPreview name="3" value="0.75rem" />
                    <SpacingPreview name="4" value="1rem" />
                    <SpacingPreview name="6" value="1.5rem" />
                    <SpacingPreview name="8" value="2rem" />
                    <SpacingPreview name="12" value="3rem" />
                    <SpacingPreview name="16" value="4rem" />
                    <SpacingPreview name="24" value="6rem" />
                  </div>
                </div>

                {/* Border Radius */}
                <div className="card-glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Border Radius</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <RadiusPreview name="sm" radius="0.25rem" />
                    <RadiusPreview name="md" radius="0.375rem" />
                    <RadiusPreview name="lg" radius="0.5rem" />
                    <RadiusPreview name="xl" radius="0.75rem" />
                    <RadiusPreview name="2xl" radius="1rem" />
                    <RadiusPreview name="3xl" radius="1.5rem" />
                    <RadiusPreview name="4xl" radius="2rem" />
                    <RadiusPreview name="full" radius="9999px" />
                  </div>
                </div>
              </div>

              {/* Shadows */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Sombras</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
                  <ShadowPreview name="Card" shadow="var(--shadow-card)" />
                  <ShadowPreview name="Card Hover" shadow="var(--shadow-card-hover)" />
                  <ShadowPreview name="Elevated" shadow="var(--shadow-card-elevated)" />
                  <ShadowPreview name="Glow Blue" shadow="var(--shadow-glow-blue)" />
                  <ShadowPreview name="Glow Cyan" shadow="var(--shadow-glow-cyan)" />
                  <ShadowPreview name="Glow Violet" shadow="var(--shadow-glow-violet)" />
                </div>
              </div>
            </section>

            {/* Components */}
            <section id="components" className="scroll-mt-6">
              <SectionHeader
                title="Componentes"
                description="Componentes UI do sistema ORION."
              />

              {/* Buttons */}
              <ComponentSection
                title="Botões"
                description="Sistema completo de botões com variantes e estados."
                className="mt-8"
              >
                <ComponentPreview
                  title="Variantes de Botão"
                  description="6 variantes para diferentes contextos."
                >
                  <div className="flex flex-wrap gap-4">
                    <button className="btn-primary">Primary</button>
                    <button className="btn-secondary">Secondary</button>
                    <button className="btn-outline">Outline</button>
                    <button className="btn-ghost">Ghost</button>
                    <button className="btn-success">Success</button>
                    <button className="btn-danger">Danger</button>
                  </div>
                </ComponentPreview>

                <ComponentPreview
                  title="Tamanhos"
                  description="3 tamanhos disponíveis."
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <button className="btn-primary btn-sm">Small</button>
                    <button className="btn-primary">Medium</button>
                    <button className="btn-primary btn-lg">Large</button>
                  </div>
                </ComponentPreview>

                <ComponentPreview
                  title="Estados"
                  description="Estados de loading e disabled."
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <button className="btn-primary" disabled>
                      Disabled
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                      Continuar
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </ComponentPreview>
              </ComponentSection>

              {/* Badges */}
              <ComponentSection
                title="Badges"
                description="Indicadores de status e tags."
                className="mt-12"
              >
                <ComponentPreview
                  title="Variantes Semânticas"
                  description="Badges para diferentes estados."
                >
                  <div className="flex flex-wrap gap-3">
                    <span className="badge-success">Success</span>
                    <span className="badge-warning">Warning</span>
                    <span className="badge-error">Error</span>
                    <span className="badge-info">Info</span>
                    <span className="badge-default">Default</span>
                  </div>
                </ComponentPreview>

                <ComponentPreview
                  title="Com Ícones"
                  description="Badges com ícones para mais contexto."
                >
                  <div className="flex flex-wrap gap-3">
                    <span className="badge-success flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Aprovado
                    </span>
                    <span className="badge-warning flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Pendente
                    </span>
                    <span className="badge-error flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      Rejeitado
                    </span>
                  </div>
                </ComponentPreview>
              </ComponentSection>

              {/* Cards */}
              <ComponentSection
                title="Cards"
                description="Containers com diferentes níveis de elevação."
                className="mt-12"
              >
                <PreviewGrid cols={3}>
                  <div className="card p-6">
                    <h4 className="font-semibold text-foreground mb-2">Card Padrão</h4>
                    <p className="text-sm text-foreground-muted">
                      Card básico com background sutil e borda.
                    </p>
                  </div>
                  <div className="card-elevated p-6">
                    <h4 className="font-semibold text-foreground mb-2">Card Elevado</h4>
                    <p className="text-sm text-foreground-muted">
                      Card com sombra para maior destaque.
                    </p>
                  </div>
                  <div className="card-glass p-6">
                    <h4 className="font-semibold text-foreground mb-2">Card Glass</h4>
                    <p className="text-sm text-foreground-muted">
                      Card com efeito glassmorphism.
                    </p>
                  </div>
                  <div className="card-hover p-6">
                    <h4 className="font-semibold text-foreground mb-2">Card Hover</h4>
                    <p className="text-sm text-foreground-muted">
                      Passe o mouse para ver o efeito.
                    </p>
                  </div>
                  <div className="card p-6 glow-hover border border-border-subtle">
                    <h4 className="font-semibold text-foreground mb-2">Card Glow</h4>
                    <p className="text-sm text-foreground-muted">
                      Com efeito de glow no hover.
                    </p>
                  </div>
                </PreviewGrid>
              </ComponentSection>

              {/* Form Elements */}
              <ComponentSection
                title="Formulários"
                description="Inputs, selects e outros elementos de formulário."
                className="mt-12"
              >
                <ComponentPreview
                  title="Inputs"
                  description="Campos de entrada de texto."
                >
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="label">Label padrão</label>
                      <input type="text" className="input" placeholder="Digite algo..." />
                    </div>
                    <div>
                      <label className="label">Textarea</label>
                      <textarea className="textarea" placeholder="Descrição..." rows={3} />
                    </div>
                    <div>
                      <label className="label">Select</label>
                      <select className="select">
                        <option>Opção 1</option>
                        <option>Opção 2</option>
                        <option>Opção 3</option>
                      </select>
                    </div>
                  </div>
                </ComponentPreview>
              </ComponentSection>

              {/* Step Indicators */}
              <ComponentSection
                title="Step Indicators"
                description="Indicadores de progresso do workflow."
                className="mt-12"
              >
                <ComponentPreview
                  title="Estados de Step"
                  description="Diferentes estados do indicador de step."
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="step-completed">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-foreground-muted">Completed</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="step-active">2</div>
                      <span className="text-xs text-foreground-muted">Active</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="step-pending">3</div>
                      <span className="text-xs text-foreground-muted">Pending</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="step-locked">4</div>
                      <span className="text-xs text-foreground-muted">Locked</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="step-error">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-foreground-muted">Error</span>
                    </div>
                  </div>
                </ComponentPreview>
              </ComponentSection>

              {/* Status Indicators */}
              <ComponentSection
                title="Status Indicators"
                description="Pontos de status para indicar estados."
                className="mt-12"
              >
                <ComponentPreview
                  title="Status Dots"
                  description="Indicadores visuais de status."
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="status-dot status-online" />
                      <span className="text-sm text-foreground-muted">Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="status-dot status-offline" />
                      <span className="text-sm text-foreground-muted">Offline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="status-dot status-warning" />
                      <span className="text-sm text-foreground-muted">Warning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="status-dot status-error" />
                      <span className="text-sm text-foreground-muted">Error</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="status-dot-pulse status-online" />
                      <span className="text-sm text-foreground-muted">Pulse</span>
                    </div>
                  </div>
                </ComponentPreview>
              </ComponentSection>
            </section>

            {/* Motion */}
            <section id="motion" className="scroll-mt-6">
              <SectionHeader
                title="Motion"
                description="Sistema de animações e transições."
              />

              <div className="mt-8 space-y-8">
                {/* Duration */}
                <div className="card-glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Durações</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-layer-1 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Fast</p>
                      <p className="text-xs text-foreground-muted font-mono">150ms</p>
                      <p className="text-xs text-foreground-muted mt-2">Micro-interações, hovers</p>
                    </div>
                    <div className="p-4 bg-layer-1 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Normal</p>
                      <p className="text-xs text-foreground-muted font-mono">200ms</p>
                      <p className="text-xs text-foreground-muted mt-2">Transições padrão</p>
                    </div>
                    <div className="p-4 bg-layer-1 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Slow</p>
                      <p className="text-xs text-foreground-muted font-mono">300ms</p>
                      <p className="text-xs text-foreground-muted mt-2">Transições de entrada</p>
                    </div>
                    <div className="p-4 bg-layer-1 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Slower</p>
                      <p className="text-xs text-foreground-muted font-mono">500ms</p>
                      <p className="text-xs text-foreground-muted mt-2">Animações complexas</p>
                    </div>
                  </div>
                </div>

                {/* Easings */}
                <div className="card-glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Easings</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-layer-1 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Ease In Out</p>
                      <p className="text-xs text-foreground-muted font-mono">cubic-bezier(0.4, 0, 0.2, 1)</p>
                      <p className="text-xs text-foreground-muted mt-2">Padrão para a maioria das transições</p>
                    </div>
                    <div className="p-4 bg-layer-1 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Ease Out</p>
                      <p className="text-xs text-foreground-muted font-mono">cubic-bezier(0, 0, 0.2, 1)</p>
                      <p className="text-xs text-foreground-muted mt-2">Elementos entrando na tela</p>
                    </div>
                    <div className="p-4 bg-layer-1 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Ease In</p>
                      <p className="text-xs text-foreground-muted font-mono">cubic-bezier(0.4, 0, 1, 1)</p>
                      <p className="text-xs text-foreground-muted mt-2">Elementos saindo da tela</p>
                    </div>
                    <div className="p-4 bg-layer-1 rounded-lg">
                      <p className="text-sm font-medium text-foreground">Spring</p>
                      <p className="text-xs text-foreground-muted font-mono">cubic-bezier(0.175, 0.885, 0.32, 1.275)</p>
                      <p className="text-xs text-foreground-muted mt-2">Animações com bounce sutil</p>
                    </div>
                  </div>
                </div>

                {/* Animation Examples */}
                <ComponentPreview
                  title="Exemplos de Animação"
                  description="Animações disponíveis no sistema."
                >
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AnimationDemo name="Pulse Glow" className="animate-pulse-glow" />
                    <AnimationDemo name="Float" className="animate-float" />
                    <AnimationDemo name="Shimmer" className="shimmer bg-layer-2" />
                    <AnimationDemo name="Spinner" hasSpinner />
                  </div>
                </ComponentPreview>
              </div>
            </section>

            {/* Guidelines */}
            <section id="guidelines" className="scroll-mt-6">
              <SectionHeader
                title="Guidelines"
                description="Diretrizes de uso do Design System."
              />

              <div className="mt-8 space-y-8">
                {/* Glassmorphism */}
                <GuidelineCard
                  title="Glassmorphism"
                  description="Quando usar e quando evitar efeitos de vidro."
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-success-text mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Usar para
                      </h4>
                      <ul className="space-y-2 text-sm text-foreground-muted">
                        <li>Cards sobre backgrounds com gradiente</li>
                        <li>Modais e overlays</li>
                        <li>Navegação flutuante</li>
                        <li>Elementos que precisam de profundidade</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-error-text mb-3 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Evitar para
                      </h4>
                      <ul className="space-y-2 text-sm text-foreground-muted">
                        <li>Texto pequeno ou crítico</li>
                        <li>Muitos elementos em sequência</li>
                        <li>Dispositivos de baixa performance</li>
                        <li>Elementos com muito conteúdo</li>
                      </ul>
                    </div>
                  </div>
                </GuidelineCard>

                {/* Cor Vermelha */}
                <GuidelineCard
                  title="Uso do Vermelho ORION"
                  description="O vermelho é reservado para situações específicas."
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success-text shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Ações destrutivas</p>
                        <p className="text-xs text-foreground-muted">Deletar, cancelar assinatura, remover acesso</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success-text shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Estados de erro</p>
                        <p className="text-xs text-foreground-muted">Validação de formulário, falhas de sistema</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success-text shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Alertas críticos</p>
                        <p className="text-xs text-foreground-muted">Downtime, problemas de segurança</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-error-text shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Nunca usar para</p>
                        <p className="text-xs text-foreground-muted">CTAs primários, decoração, ênfase geral</p>
                      </div>
                    </div>
                  </div>
                </GuidelineCard>

                {/* Motion */}
                <GuidelineCard
                  title="Disciplina de Motion"
                  description="Animações devem servir a um propósito."
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        Feedback
                      </h4>
                      <p className="text-sm text-foreground-muted">
                        Indicar que uma ação foi reconhecida. Hover states, cliques, submits.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-cyan-400" />
                        Transição
                      </h4>
                      <p className="text-sm text-foreground-muted">
                        Suavizar mudanças de contexto. Página, modal, painel lateral.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-cyan-400" />
                        Estado
                      </h4>
                      <p className="text-sm text-foreground-muted">
                        Indicar status atual. Loading, processando, aguardando.
                      </p>
                    </div>
                  </div>
                </GuidelineCard>

                {/* Accessibility */}
                <GuidelineCard
                  title="Acessibilidade"
                  description="Garantindo uma experiência inclusiva."
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium text-foreground">Contraste mínimo 4.5:1</span>
                      </div>
                      <p className="text-sm text-foreground-muted">
                        Texto sobre fundos deve ter contraste suficiente para leitura.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium text-foreground">Focus visible</span>
                      </div>
                      <p className="text-sm text-foreground-muted">
                        Todos os elementos interativos devem ter estado de foco visível.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium text-foreground">Reduzir movimento</span>
                      </div>
                      <p className="text-sm text-foreground-muted">
                        Respeitar prefers-reduced-motion do usuário.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium text-foreground">Touch targets</span>
                      </div>
                      <p className="text-sm text-foreground-muted">
                        Mínimo de 44x44px para elementos tocáveis em mobile.
                      </p>
                    </div>
                  </div>
                </GuidelineCard>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-cyan-blue flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">ORION Design System</span>
            </div>
            <p className="text-sm text-foreground-muted">
              Single Source of Truth para a plataforma ORION
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="pb-6 border-b border-border-subtle">
      <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-foreground-muted">{description}</p>
    </div>
  );
}

function PrincipleCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-glass p-6 rounded-xl glow-hover border border-border-subtle">
      <div className="w-12 h-12 rounded-xl bg-gradient-cyan-blue flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-foreground-muted">{description}</p>
    </div>
  );
}

function SemanticColorCard({
  name,
  icon,
  bgClass,
  borderClass,
  textClass,
}: {
  name: string;
  icon: React.ReactNode;
  bgClass: string;
  borderClass: string;
  textClass: string;
}) {
  return (
    <div className={`p-4 rounded-xl border ${bgClass} ${borderClass}`}>
      <div className={`flex items-center gap-3 ${textClass}`}>
        {icon}
        <span className="font-medium">{name}</span>
      </div>
    </div>
  );
}

function AnimationDemo({
  name,
  className = '',
  hasSpinner = false,
}: {
  name: string;
  className?: string;
  hasSpinner?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`
          w-20 h-20 mx-auto rounded-xl border border-border-active
          flex items-center justify-center
          ${className}
        `}
      >
        {hasSpinner ? (
          <div className="spinner" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-cyan-blue" />
        )}
      </div>
      <p className="mt-3 text-sm text-foreground-muted">{name}</p>
    </div>
  );
}

function GuidelineCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-glass p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-foreground-muted mb-6">{description}</p>
      {children}
    </div>
  );
}
