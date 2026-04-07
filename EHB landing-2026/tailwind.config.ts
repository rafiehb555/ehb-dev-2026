import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Law OLS reference tree (copy-paste / future promotion); keeps text-ehb-* in the CSS bundle if used
    "./content/industries/law/ols-law-source/nextjs-app/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
        // Visual system alternates: Inter, Satoshi, Plus Jakarta Sans
      },
      fontSize: {
        "hero": ["64px", { lineHeight: "1.1" }],
        "section": ["36px", { lineHeight: "1.2" }],
        "card-title": ["20px", { lineHeight: "1.3" }],
        "body": ["16px", { lineHeight: "1.6" }]
      },
      colors: {
        bg: "#0B0F14",
        card: "#0F141B",
        primary: "#6366F1",
        ehb: {
          // Core (base theme – keep)
          background: "#020617",
          surface: "#020c1b",
          surfaceSoft: "#04101f",
          borderSoft: "rgba(148, 163, 184, 0.25)",
          // Logo colors (brand identity)
          primary: "#00AEEF",   // logo blue – AI / technology
          secondary: "#22C55E", // logo green – success / growth
          accent: "#F59E0B",    // logo orange – ecosystem / connection
          highlight: "#E53935", // logo red – Education / highlight
          // Glow effects (AI futuristic)
          neonBlue: "#00eaff",  // AI glow
          neonBlueSoft: "rgba(0, 234, 255, 0.7)",
          electricBlue: "#3b82f6",
          electricBlueSoft: "rgba(59, 130, 246, 0.7)",
          violetGlow: "#8b5cf6", // purple glow
          // Supporting
          slate: "#94a3b8",
          slateSoft: "rgba(148, 163, 184, 0.65)",
          /** Body / secondary text — EHB_COLOR_SCHEME_PLAN Part 4 */
          textBody: "#B0BAD3",
          /** Hints / placeholders — EHB_COLOR_SCHEME_PLAN Part 4 */
          textMuted: "#6B7A99",
          footer: "#010409"
        },
        // EHB NEW THEME v2 – distinct look (black + purple base, emerald + amber)
        ehbNew: {
          bg: "#0a0814",
          surface: "#120f1f",
          surfaceSoft: "#1a1628",
          border: "rgba(167, 139, 250, 0.2)",
          emerald: "#10b981",
          emeraldSoft: "rgba(16, 185, 129, 0.6)",
          amber: "#f59e0b",
          amberSoft: "rgba(245, 158, 11, 0.6)",
          violet: "#a78bfa",
          violetSoft: "rgba(167, 139, 250, 0.5)",
          rose: "#f43f5e",
          muted: "#a1a1aa",
          white: "#fafafa"
        }
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,234,255,0.16), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(59,130,246,0.16), transparent), radial-gradient(ellipse 50% 30% at 0% 50%, rgba(15,23,42,0.9), transparent)",
        "gradient-hero":
          "linear-gradient(135deg, rgba(0, 234, 255, 0.18) 0%, rgba(15,23,42,0.9) 40%, rgba(59,130,246,0.25) 100%)",
        "gradient-text":
          "linear-gradient(135deg, #00eaff 0%, #3b82f6 40%, #60a5fa 75%, #e5e7eb 100%)",
        "gradient-border":
          "linear-gradient(135deg, #00eaff, #3b82f6, #0ea5e9)",
        "gradient-new":
          "linear-gradient(135deg, #10b981 0%, #059669 30%, #a78bfa 70%, #f59e0b 100%)",
        "gradient-new-soft":
          "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(167,139,250,0.2) 50%, rgba(245,158,11,0.15) 100%)",
        "gradient-btn-primary": "linear-gradient(135deg, #00AEEF 0%, #22C55E 100%)",
        "gradient-hero-ecosystem": "linear-gradient(180deg, #020617 0%, #001B2E 50%, #020617 100%)"
      },
      boxShadow: {
        "neon-blue":
          "0 0 24px -6px rgba(0,234,255,0.8), 0 0 64px -16px rgba(0,234,255,0.4)",
        "neon-electric":
          "0 0 24px -6px rgba(59,130,246,0.9), 0 0 64px -16px rgba(59,130,246,0.45)",
        "card-glass":
          "0 18px 45px rgba(15,23,42,0.9), 0 0 0 1px rgba(148,163,184,0.18) inset",
        "card-glass-hover":
          "0 24px 60px rgba(15,23,42,0.95), 0 0 0 1px rgba(56,189,248,0.6) inset, 0 0 40px rgba(56,189,248,0.55)",
        "neon-emerald":
          "0 0 28px -4px rgba(16,185,129,0.8), 0 0 56px -12px rgba(16,185,129,0.4)",
        "neon-amber":
          "0 0 24px -4px rgba(245,158,11,0.7), 0 0 48px -12px rgba(245,158,11,0.3)",
        "glass-new":
          "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(167,139,250,0.15) inset",
        "neon-green": "0 0 24px -4px rgba(34,197,94,0.7), 0 0 48px -12px rgba(34,197,94,0.35)",
        "neon-red": "0 0 24px -4px rgba(229,57,53,0.6), 0 0 48px -12px rgba(229,57,53,0.3)",
        "neon-orange": "0 0 24px -4px rgba(245,158,11,0.7), 0 0 48px -12px rgba(245,158,11,0.35)",
        "neon-primary": "0 0 24px -4px rgba(0,174,239,0.7), 0 0 48px -12px rgba(0,174,239,0.35)"
      },
      spacing: {
        "safe-t": "env(safe-area-inset-top)",
        "safe-b": "env(safe-area-inset-bottom)",
        "safe-l": "env(safe-area-inset-left)",
        "safe-r": "env(safe-area-inset-right)",
        "section": "120px",
        "card-gap": "24px"
      },
      maxWidth: {
        "ultra": "1400px"
      },
      minHeight: {
        touch: "44px",
        "touch-lg": "48px",
        "hero": "80vh"
      },
      minWidth: {
        touch: "44px"
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;

