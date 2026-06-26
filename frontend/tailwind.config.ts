import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.5rem",
        lg: "2.5rem",
      },
      screens: {
        sm: "100%",
        md: "100%",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        cream: "var(--color-cream)",
        rose: "var(--color-rose)",
        ink: {
          900: "var(--color-ink-900)",
          700: "var(--color-ink-700)",
          500: "var(--color-ink-500)",
          300: "var(--color-ink-300)",
        },
        brand: {
          DEFAULT: "var(--color-brand)",
          hover: "var(--color-brand-hover)",
        },
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        warning: "var(--color-warning)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Tajawal", "Cairo", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Tajawal", "Cairo", "system-ui", "sans-serif"],
        latinDisplay: ["var(--font-latin-display)", "serif"],
        latinUi: ["var(--font-latin-ui)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["2.5rem", { lineHeight: "1.15" }],
        h1: ["1.875rem", { lineHeight: "1.2" }],
        h2: ["1.5rem", { lineHeight: "1.25" }],
        h3: ["1.25rem", { lineHeight: "1.3" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.6" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        xs: ["0.75rem", { lineHeight: "1.4" }],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "20px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 12px rgba(0,0,0,0.06)",
        lg: "0 12px 24px rgba(0,0,0,0.08)",
        pop: "0 20px 40px rgba(122, 62, 46, 0.12)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "320ms",
      },
      zIndex: {
        base: "0",
        sticky: "30",
        floating: "40",
        overlay: "50",
        drawer: "60",
        modal: "70",
        toast: "80",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [require("tailwindcss-logical")],
};

export default config;
