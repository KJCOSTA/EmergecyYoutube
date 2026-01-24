import type { Config } from "tailwindcss";
import tokens from "./lib/design-tokens";

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
        background: tokens.colors.backgrounds.layer0,
        foreground: tokens.colors.text.primary,
        layer: tokens.colors.backgrounds,
        surface: tokens.colors.surfaces,
        border: tokens.colors.borders,
        text: tokens.colors.text,
        
        // Paletas da marca
        orion: tokens.colors.brand.blue,
        'orion-red': tokens.colors.brand.red,
        
        // Paletas de acento
        cyan: tokens.colors.accent.cyan,
        indigo: tokens.colors.accent.indigo,
        violet: tokens.colors.accent.violet,

        // Cores semânticas
        success: {
          DEFAULT: tokens.colors.semantic.success.solid,
          bg: tokens.colors.semantic.success.bg,
          border: tokens.colors.semantic.success.border,
          text: tokens.colors.semantic.success.text,
        },
        warning: {
          DEFAULT: tokens.colors.semantic.warning.solid,
          bg: tokens.colors.semantic.warning.bg,
          border: tokens.colors.semantic.warning.border,
          text: tokens.colors.semantic.warning.text,
        },
        error: {
          DEFAULT: tokens.colors.semantic.error.solid,
          bg: tokens.colors.semantic.error.bg,
          border: tokens.colors.semantic.error.border,
          text: tokens.colors.semantic.error.text,
        },
        info: {
          DEFAULT: tokens.colors.semantic.info.solid,
          bg: tokens.colors.semantic.info.bg,
          border: tokens.colors.semantic.info.border,
          text: tokens.colors.semantic.info.text,
        },
        
        // Efeitos
        glow: tokens.colors.effects,
        highlight: tokens.colors.effects.highlight,
        
        // Paleta de utilidade (mantida para flexibilidade)
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
      },
      
      // ========================================
      // TIPOGRAFIA
      // ========================================
      fontFamily: tokens.typography.fonts,
      fontSize: tokens.typography.sizes,

      // ========================================
      // ESPAÇAMENTO
      // ========================================
      spacing: {
        ...tokens.spacing,
        // Mantendo customizações específicas se necessário
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },

      // ========================================
      // BORDER RADIUS
      // ========================================
      borderRadius: tokens.radius,

      // ========================================
      // SOMBRAS
      // ========================================
      boxShadow: {
        ...tokens.shadows, // sm, md, lg, xl, 2xl, inner, card, etc
        'glow-blue': tokens.shadows.glowBlue,
        'glow-cyan': tokens.shadows.glowCyan,
        'glow-violet': tokens.shadows.glowViolet,
      },

      // ========================================
      // GRADIENTES
      // ========================================
      backgroundImage: tokens.gradients,

      // ========================================
      // ANIMAÇÕES E KEYFRAMES
      // ========================================
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "fade-in-up": "fadeInUp 0.3s ease-out forwards",
        "fade-in-down": "fadeInDown 0.3s ease-out forwards",
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        "slide-in-left": "slideInLeft 0.3s ease-out forwards",
        "scale-in": "scaleIn 0.2s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "gradient-border": "gradientBorder 4s ease infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeInUp: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeInDown: { from: { opacity: "0", transform: "translateY(-10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideInRight: { from: { opacity: "0", transform: "translateX(20px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        slideInLeft: { from: { opacity: "0", transform: "translateX(-20px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        scaleIn: { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "scale(1)" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-5px)" } },
        shimmer: { "0%": { "background-position": "-200% 0" }, "100%": { "background-position": "200% 0" } },
        gradientBorder: { "0%, 100%": { "background-position": "0% 50%" }, "50%": { "background-position": "100% 50%" } },
      },

      // ========================================
      // TRANSIÇÕES
      // ========================================
      transitionDuration: tokens.motion.duration,
      transitionTimingFunction: tokens.motion.easing,

      // ========================================
      // Z-INDEX
      // ========================================
      zIndex: tokens.zIndex,
      
      // ========================================
      // BLUR
      // ========================================
      backdropBlur: {
        xs: "2px",
        ...tokens.radius // Re-using radius values for blur consistency
      },
    },
  },
  plugins: [],
};

export default config;