import type { Config } from "tailwindcss";

/**
 * ============================================
 * ORION Design System - Tailwind Configuration
 * ============================================
 *
 * Configuração estendida do Tailwind CSS
 * sincronizada com o Design System ORION.
 *
 * As CSS Variables em globals.css são a fonte
 * primária de verdade. Esta configuração as
 * expõe para uso com classes Tailwind.
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
      // CORES - Paleta ORION
      // ========================================
      colors: {
        // CSS Variable references
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Layers de profundidade
        layer: {
          0: "var(--bg-layer-0)",
          1: "var(--bg-layer-1)",
          2: "var(--bg-layer-2)",
          3: "var(--bg-layer-3)",
          4: "var(--bg-layer-4)",
        },

        // Superfícies
        surface: {
          DEFAULT: "var(--surface-default)",
          elevated: "var(--surface-elevated)",
          glass: "var(--surface-glass)",
          "glass-subtle": "var(--surface-glass-subtle)",
          overlay: "var(--surface-overlay)",
        },

        // Bordas
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
          active: "var(--border-active)",
          glow: "var(--border-glow)",
        },

        // Texto
        text: {
          primary: "var(--foreground)",
          secondary: "var(--foreground-secondary)",
          muted: "var(--foreground-muted)",
          disabled: "var(--foreground-disabled)",
          inverse: "var(--foreground-inverse)",
        },

        // Brand ORION - Azul
        orion: {
          50: "#E8F4FC",
          100: "#C5E4F8",
          200: "#8EC8F2",
          300: "#57ACEB",
          400: "#3B82F6",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E3A5F",
          800: "#0F2341",
          900: "#0A1628",
          950: "#050A12",
        },

        // Brand ORION - Vermelho (CTAs críticos)
        "orion-red": {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
        },

        // Accent Cyan - Estados ativos
        cyan: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
          950: "#083344",
        },

        // Accent Indigo - Estados secundários
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
          950: "#1E1B4B",
        },

        // Accent Violet - Elementos decorativos
        violet: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          950: "#2E1065",
        },

        // Semânticas
        success: {
          DEFAULT: "var(--success)",
          bg: "var(--success-bg)",
          border: "var(--success-border)",
          text: "var(--success-text)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          bg: "var(--warning-bg)",
          border: "var(--warning-border)",
          text: "var(--warning-text)",
        },
        error: {
          DEFAULT: "var(--error)",
          bg: "var(--error-bg)",
          border: "var(--error-border)",
          text: "var(--error-text)",
        },
        info: {
          DEFAULT: "var(--info)",
          bg: "var(--info-bg)",
          border: "var(--info-border)",
          text: "var(--info-text)",
        },

        // Effects
        glow: {
          blue: "var(--glow-blue)",
          cyan: "var(--glow-cyan)",
          violet: "var(--glow-violet)",
          red: "var(--glow-red)",
        },
        highlight: "var(--highlight)",
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
      // SHADOWS
      // ========================================
      boxShadow: {
        "glow-sm": "0 0 10px 0 var(--glow-cyan)",
        "glow-md": "0 0 20px 0 var(--glow-cyan)",
        "glow-lg": "0 0 30px 0 var(--glow-cyan)",
        "glow-blue-sm": "0 0 10px 0 var(--glow-blue)",
        "glow-blue-md": "0 0 20px 0 var(--glow-blue)",
        "glow-blue-lg": "0 0 30px 0 var(--glow-blue)",
        "glow-violet-sm": "0 0 10px 0 var(--glow-violet)",
        "glow-violet-md": "0 0 20px 0 var(--glow-violet)",
        "glow-violet-lg": "0 0 30px 0 var(--glow-violet)",
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        "card-elevated": "var(--shadow-card-elevated)",
      },

      // ========================================
      // BACKGROUND IMAGE (Gradients)
      // ========================================
      backgroundImage: {
        "gradient-orion": "var(--gradient-orion-primary)",
        "gradient-orion-dark": "var(--gradient-orion-dark)",
        "gradient-orion-deep": "var(--gradient-orion-deep)",
        "gradient-cyan-blue": "var(--gradient-cyan-blue)",
        "gradient-blue-indigo": "var(--gradient-blue-indigo)",
        "gradient-violet-blue": "var(--gradient-violet-blue)",
        "gradient-cyan-glow": "var(--gradient-cyan-glow)",
        "gradient-blue-glow": "var(--gradient-blue-glow)",
        "gradient-card": "var(--gradient-card)",
        "gradient-card-hover": "var(--gradient-card-hover)",
        "gradient-mesh": "var(--gradient-mesh)",
        "gradient-border": "var(--gradient-border)",
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
      // TRANSITION
      // ========================================
      transitionDuration: {
        "fast": "150ms",
        "normal": "200ms",
        "slow": "300ms",
        "slower": "500ms",
      },

      transitionTimingFunction: {
        "ease-spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
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
