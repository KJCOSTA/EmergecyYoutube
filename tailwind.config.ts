import type { Config } from "tailwindcss";
import { backgrounds, surfaces, borders, text, brand, accent, semantic, gradients, spacing as designSpacing, shadows as designShadows, motion } from "./lib/design-tokens";

/**
 * ============================================
 * ORION Design System - Tailwind Configuration
 * ============================================
 *
 * Configuração estendida do Tailwind CSS
 * sincronizada com o Design System ORION.
 *
 * FONTE PRIMÁRIA: lib/design-tokens.ts
 * Este arquivo força o uso dos design tokens
 * TypeScript como single source of truth.
 */

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ========================================
      // CORES - Paleta ORION (Design Tokens)
      // ========================================
      colors: {
        // Compatibility with CSS Variables
        background: backgrounds.layer0,
        foreground: text.primary,

        // Layers de profundidade (from design-tokens.ts)
        layer: {
          0: backgrounds.layer0,
          1: backgrounds.layer1,
          2: backgrounds.layer2,
          3: backgrounds.layer3,
          4: backgrounds.layer4,
        },

        // Superfícies (from design-tokens.ts)
        surface: {
          DEFAULT: surfaces.default,
          elevated: surfaces.elevated,
          glass: surfaces.glass,
          "glass-subtle": surfaces.glassSubtle,
          overlay: surfaces.overlay,
        },

        // Bordas (from design-tokens.ts)
        border: {
          subtle: borders.subtle,
          DEFAULT: borders.default,
          strong: borders.strong,
          active: borders.active,
          glow: borders.glow,
        },

        // Texto (from design-tokens.ts)
        text: {
          primary: text.primary,
          secondary: text.secondary,
          muted: text.muted,
          disabled: text.disabled,
          inverse: text.inverse,
        },

        // Brand ORION - Azul (from design-tokens.ts)
        orion: {
          50: "#E8F4FC",
          100: "#C5E4F8",
          200: "#8EC8F2",
          300: "#57ACEB",
          400: brand.blue[400],
          500: "#2563EB",
          600: "#1D4ED8",
          700: brand.blue[700],
          800: backgrounds.layer2,
          900: backgrounds.layer1,
          950: backgrounds.layer0,
        },

        // Brand ORION - Vermelho (from design-tokens.ts)
        "orion-red": {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: brand.red[500],
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
        },

        // Accent Cyan - Estados ativos (from design-tokens.ts)
        cyan: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: accent.cyan[400],
          500: accent.cyan[500],
          600: accent.cyan[600],
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
          950: "#083344",
        },

        // Accent Indigo - Estados secundários (from design-tokens.ts)
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: accent.indigo[400],
          500: accent.indigo[500],
          600: accent.indigo[600],
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },

        // Accent Violet - Elementos decorativos (from design-tokens.ts)
        violet: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: accent.violet[400],
          500: accent.violet[500],
          600: accent.violet[600],
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          950: "#2E1065",
        },

        // Semânticas (from design-tokens.ts)
        success: {
          DEFAULT: semantic.success,
          bg: `${semantic.success}20`,
          border: `${semantic.success}40`,
          text: semantic.success,
        },
        warning: {
          DEFAULT: semantic.warning,
          bg: `${semantic.warning}20`,
          border: `${semantic.warning}40`,
          text: semantic.warning,
        },
        error: {
          DEFAULT: semantic.error,
          bg: `${semantic.error}20`,
          border: `${semantic.error}40`,
          text: semantic.error,
        },
        info: {
          DEFAULT: semantic.info,
          bg: `${semantic.info}20`,
          border: `${semantic.info}40`,
          text: semantic.info,
        },

        // Slate palette (100-900 with opacity support)
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },

        // Effects (from design-tokens.ts)
        glow: {
          blue: brand.blue[400],
          cyan: accent.cyan[400],
          violet: accent.violet[400],
          red: brand.red[500],
        },
        highlight: accent.cyan[400],
      },

      // ========================================
      // TIPOGRAFIA
      // ========================================
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },

      // ========================================
      // ESPAÇAMENTO
      // ========================================
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },

      // ========================================
      // BORDER RADIUS
      // ========================================
      borderRadius: {
        "4xl": "2rem",
      },

      // ========================================
      // SHADOWS (from design-tokens.ts)
      // ========================================
      boxShadow: {
        sm: designShadows.sm,
        DEFAULT: designShadows.md,
        md: designShadows.md,
        lg: designShadows.lg,
        xl: designShadows.xl,
        "2xl": designShadows["2xl"],
        inner: designShadows.inner,
        "glow-sm": "0 0 10px 0 rgba(6, 182, 212, 0.3)",
        "glow-md": "0 0 20px 0 rgba(6, 182, 212, 0.3)",
        "glow-lg": "0 0 30px 0 rgba(6, 182, 212, 0.4)",
        "glow-blue-sm": "0 0 10px 0 rgba(59, 130, 246, 0.3)",
        "glow-blue-md": designShadows.glowBlue,
        "glow-blue-lg": "0 0 30px 0 rgba(59, 130, 246, 0.4)",
        "glow-violet-sm": "0 0 10px 0 rgba(139, 92, 246, 0.3)",
        "glow-violet-md": designShadows.glowViolet,
        "glow-violet-lg": "0 0 30px 0 rgba(139, 92, 246, 0.4)",
        card: designShadows.card,
        "card-hover": designShadows.cardHover,
        "card-elevated": designShadows.cardElevated,
      },

      // ========================================
      // BACKGROUND IMAGE (Gradients from design-tokens.ts)
      // ========================================
      backgroundImage: {
        "gradient-orion": gradients.orionPrimary,
        "gradient-orion-dark": gradients.orionDark,
        "gradient-orion-deep": gradients.orionDeep,
        "gradient-cyan-blue": gradients.cyanBlue,
        "gradient-blue-indigo": gradients.blueIndigo,
        "gradient-violet-blue": gradients.violetBlue,
        "gradient-cyan-glow": gradients.cyanGlow,
        "gradient-blue-glow": gradients.blueGlow,
        "gradient-card": gradients.cardSubtle,
        "gradient-card-hover": gradients.cardHover,
        "gradient-mesh": gradients.meshBackground,
        "gradient-border": gradients.borderGradient,
      },

      // ========================================
      // ANIMATIONS
      // ========================================
      animation: {
        "fade-in": "fadeIn var(--duration-normal) var(--ease-out)",
        "fade-in-up": "fadeInUp var(--duration-slow) var(--ease-out) forwards",
        "fade-in-down": "fadeInDown var(--duration-slow) var(--ease-out) forwards",
        "slide-in-right": "slideInRight var(--duration-slow) var(--ease-out) forwards",
        "slide-in-left": "slideInLeft var(--duration-slow) var(--ease-out) forwards",
        "scale-in": "scaleIn var(--duration-normal) var(--ease-out) forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulseGlow 2s var(--ease-in-out) infinite",
        "spin-slow": "spin 3s linear infinite",
        "float": "float 3s var(--ease-in-out) infinite",
        "shimmer": "shimmer 1.5s var(--ease-in-out) infinite",
        "data-flow": "dataFlow 2s linear infinite",
        "gradient-border": "gradientBorder 4s ease infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 var(--glow-cyan)" },
          "50%": { boxShadow: "0 0 20px 4px var(--glow-cyan)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        dataFlow: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientBorder: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },

      // ========================================
      // TRANSITION (from design-tokens.ts)
      // ========================================
      transitionDuration: {
        fast: motion.duration.fast,
        normal: motion.duration.normal,
        slow: motion.duration.slow,
        slower: motion.duration.slower,
      },

      transitionTimingFunction: {
        "ease-in": motion.easing.easeIn,
        "ease-out": motion.easing.easeOut,
        "ease-in-out": motion.easing.easeInOut,
        "ease-spring": motion.easing.spring,
      },

      // ========================================
      // Z-INDEX
      // ========================================
      zIndex: {
        "dropdown": "100",
        "sticky": "200",
        "overlay": "300",
        "modal": "400",
        "popover": "500",
        "toast": "600",
        "tooltip": "700",
        "max": "9999",
      },

      // ========================================
      // BACKDROP BLUR
      // ========================================
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
