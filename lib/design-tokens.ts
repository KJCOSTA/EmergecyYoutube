/**
 * ============================================
 * ORION Design System - Design Tokens
 * ============================================
 *
 * Single Source of Truth para cores, tipografia,
 * espaçamentos e motion do sistema ORION.
 *
 * Paleta baseada no logo oficial:
 * - Azul profundo como base
 * - Vermelho ORION como acento crítico
 * - Cyan/Indigo para estados ativos
 */

// ============================================
// CORES - PALETA ORION
// ============================================

/**
 * Cores de fundo em camadas (layers)
 * Do mais profundo ao mais elevado
 */
export const backgrounds = {
  layer0: '#050A12',  // Base mais profunda - fundo principal
  layer1: '#0A1628',  // Cards, sidebar - azul muito escuro
  layer2: '#0F2341',  // Elementos elevados
  layer3: '#1A3A5C',  // Hover states, menus
  layer4: '#245177',  // Elementos em destaque
} as const;

/**
 * Cores de superfície (para cards e painéis)
 */
export const surfaces = {
  default: 'rgba(10, 22, 40, 0.8)',    // Card padrão com transparência
  elevated: 'rgba(15, 35, 65, 0.9)',   // Card elevado
  glass: 'rgba(26, 58, 92, 0.4)',      // Glassmorphism
  glassSubtle: 'rgba(10, 22, 40, 0.6)', // Glass mais sutil
  overlay: 'rgba(5, 10, 18, 0.8)',     // Overlay para modais
} as const;

/**
 * Cores de borda
 */
export const borders = {
  subtle: 'rgba(30, 58, 95, 0.3)',      // Borda sutil
  default: 'rgba(30, 58, 95, 0.5)',     // Borda padrão
  strong: 'rgba(59, 130, 246, 0.4)',    // Borda com destaque
  active: 'rgba(6, 182, 212, 0.5)',     // Borda ativa (cyan)
  glow: 'rgba(59, 130, 246, 0.6)',      // Borda com glow
} as const;

/**
 * Cores de texto
 */
export const text = {
  primary: '#F0F4F8',     // Texto principal - quase branco
  secondary: '#94A3B8',   // Texto secundário - slate-400
  muted: '#64748B',       // Texto muted - slate-500
  disabled: '#475569',    // Texto desabilitado - slate-600
  inverse: '#0A1628',     // Texto em fundos claros
} as const;

/**
 * Cores da marca ORION
 */
export const brand = {
  // Azul ORION - cor principal
  blue: {
    50: '#E8F4FC',
    100: '#C5E4F8',
    200: '#8EC8F2',
    300: '#57ACEB',
    400: '#3B82F6',   // Azul principal
    500: '#2563EB',
    600: '#1D4ED8',
    700: '#1E3A5F',   // Azul profundo (do logo)
    800: '#0F2341',
    900: '#0A1628',   // Azul mais escuro
    950: '#050A12',
  },
  // Vermelho ORION - acento crítico (do logo YouTube)
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',   // Vermelho principal
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
} as const;

/**
 * Cores de acento
 */
export const accent = {
  // Cyan - estados ativos, links, foco
  cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',   // Cyan principal
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
    950: '#083344',
  },
  // Indigo - estados secundários
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',   // Indigo principal
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },
  // Violet - elementos decorativos
  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',   // Violet principal
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    950: '#2E1065',
  },
} as const;

/**
 * Cores semânticas (feedback)
 */
export const semantic = {
  success: {
    bg: 'rgba(16, 185, 129, 0.1)',      // Fundo verde
    border: 'rgba(16, 185, 129, 0.3)',  // Borda verde
    text: '#34D399',                     // Texto verde claro
    solid: '#10B981',                    // Solid verde
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    text: '#FBBF24',
    solid: '#F59E0B',
  },
  error: {
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    text: '#F87171',
    solid: '#EF4444',
  },
  info: {
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    text: '#60A5FA',
    solid: '#3B82F6',
  },
} as const;

/**
 * Cores de glow e highlight
 */
export const effects = {
  glowBlue: 'rgba(59, 130, 246, 0.4)',
  glowCyan: 'rgba(6, 182, 212, 0.4)',
  glowViolet: 'rgba(139, 92, 246, 0.4)',
  glowRed: 'rgba(239, 68, 68, 0.3)',
  highlight: 'rgba(6, 182, 212, 0.1)',
} as const;

// ============================================
// GRADIENTES
// ============================================

export const gradients = {
  // Gradientes principais ORION
  orionPrimary: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 50%, #3B82F6 100%)',
  orionDark: 'linear-gradient(180deg, #050A12 0%, #0A1628 100%)',
  orionDeep: 'linear-gradient(135deg, #050A12 0%, #0F2341 100%)',

  // Gradientes de acento
  cyanBlue: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
  blueIndigo: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
  violetBlue: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',

  // Gradientes de destaque
  cyanGlow: 'linear-gradient(180deg, rgba(6, 182, 212, 0.2) 0%, transparent 100%)',
  blueGlow: 'linear-gradient(180deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%)',

  // Gradiente de borda animada
  borderGradient: 'linear-gradient(90deg, #3B82F6, #06B6D4, #8B5CF6, #3B82F6)',

  // Gradientes sutis para cards
  cardSubtle: 'linear-gradient(180deg, rgba(15, 35, 65, 0.5) 0%, rgba(10, 22, 40, 0.8) 100%)',
  cardHover: 'linear-gradient(180deg, rgba(26, 58, 92, 0.4) 0%, rgba(15, 35, 65, 0.6) 100%)',

  // Mesh gradients para fundos
  meshBackground: 'radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.15) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(6, 182, 212, 0.1) 0px, transparent 50%)',
} as const;

// ============================================
// TIPOGRAFIA
// ============================================

export const typography = {
  fonts: {
    sans: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, monospace',
  },

  // Tamanhos de fonte (em rem)
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  // Line heights
  lineHeights: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Font weights
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Letter spacing
  tracking: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

// Presets de tipografia para uso rápido
export const textStyles = {
  // Display - títulos grandes
  displayLg: {
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.tracking.tight,
  },
  displayMd: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.tracking.tight,
  },

  // Headings
  h1: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
  },
  h2: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
  },
  h3: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.snug,
  },
  h4: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.snug,
  },

  // Body text
  bodyLg: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.relaxed,
  },
  bodyMd: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
  },
  bodySm: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
  },

  // Labels e captions
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    letterSpacing: typography.tracking.wide,
  },
  caption: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.normal,
  },

  // Code
  code: {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.sm,
  },
} as const;

// ============================================
// ESPAÇAMENTO
// ============================================

// Base: 4px
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
} as const;

// Espaçamentos semânticos
export const componentSpacing = {
  // Padding interno de componentes
  cardPadding: spacing[6],         // 24px
  cardPaddingSm: spacing[4],       // 16px
  cardPaddingLg: spacing[8],       // 32px

  buttonPadding: spacing[4],       // 16px horizontal
  buttonPaddingY: spacing[2.5],    // 10px vertical

  inputPadding: spacing[4],        // 16px
  inputPaddingY: spacing[3],       // 12px

  // Gaps
  gridGap: spacing[6],             // 24px
  gridGapSm: spacing[4],           // 16px
  stackGap: spacing[4],            // 16px
  inlineGap: spacing[2],           // 8px

  // Section spacing
  sectionGap: spacing[16],         // 64px
  sectionGapSm: spacing[10],       // 40px

  // Page margins
  pageMargin: spacing[8],          // 32px
  pageMarginMobile: spacing[4],    // 16px
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const radius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================
// SOMBRAS
// ============================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',

  // Shadows com cor
  glowBlue: '0 0 20px 0 rgba(59, 130, 246, 0.3)',
  glowCyan: '0 0 20px 0 rgba(6, 182, 212, 0.3)',
  glowViolet: '0 0 20px 0 rgba(139, 92, 246, 0.3)',

  // Card shadows
  card: '0 4px 20px 0 rgba(0, 0, 0, 0.3)',
  cardHover: '0 8px 30px 0 rgba(0, 0, 0, 0.4), 0 0 20px 0 rgba(59, 130, 246, 0.1)',
  cardElevated: '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
} as const;

// ============================================
// MOTION / ANIMAÇÃO
// ============================================

export const motion = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Easings
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Transitions pré-definidos
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

// Presets de animação para Framer Motion
export const motionPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.3 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 },
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
} as const;

// ============================================
// Z-INDEX
// ============================================

export const zIndex = {
  hide: -1,
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
  tooltip: 700,
  max: 9999,
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// COMPONENTES - CONFIGURAÇÕES PADRÃO
// ============================================

export const components = {
  button: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    radius: radius.lg,
  },
  input: {
    height: {
      sm: '32px',
      md: '40px',
      lg: '48px',
    },
    radius: radius.lg,
  },
  card: {
    radius: radius.xl,
    padding: componentSpacing.cardPadding,
  },
  badge: {
    radius: radius.full,
    height: '24px',
  },
  modal: {
    radius: radius['2xl'],
    maxWidth: '500px',
  },
} as const;

// ============================================
// EXPORTS CONSOLIDADOS
// ============================================

export const tokens = {
  colors: {
    backgrounds,
    surfaces,
    borders,
    text,
    brand,
    accent,
    semantic,
    effects,
  },
  gradients,
  typography,
  textStyles,
  spacing,
  componentSpacing,
  radius,
  shadows,
  motion,
  motionPresets,
  zIndex,
  breakpoints,
  components,
} as const;

export default tokens;
