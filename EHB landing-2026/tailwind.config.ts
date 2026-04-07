import type { Config } from "tailwindcss";

/**
 * EHB brand tokens — aligned with docs/development/EHB_COLOR_SCHEME_PLAN.md
 * (logo five + Part 3 surfaces + Part 4 text + extended platform colors).
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
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
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        /** EHB_UIUX_DESIGN_PLAN Part 2 — prices, scores, stats */
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"]
      },
      fontSize: {
        hero: ["64px", { lineHeight: "1.1" }],
        section: ["36px", { lineHeight: "1.2" }],
        "card-title": ["20px", { lineHeight: "1.3" }],
        body: ["16px", { lineHeight: "1.6" }],
        /** UIUX Part 2 type scale */
        "ui-h1": ["48px", { lineHeight: "1.15", fontWeight: "800" }],
        "ui-h2": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "ui-caption": ["13px", { lineHeight: "1.45" }],
        "ui-badge": ["11px", { lineHeight: "1.2", fontWeight: "700" }],
        "ui-price": ["24px", { lineHeight: "1.1", fontWeight: "700" }]
      },
      colors: {
        // Page / card defaults — Part 3
        bg: "#0D1017",
        card: "#181E2E",
        primary: "#29ABE2",
        ehb: {
          appRoot: "#080A10",
          pageBg: "#0D1017",
          sectionBg: "#111622",
          cardBg: "#181E2E",
          cardHover: "#1E2638",
          inputBg: "#252D40",
          borderSoft: "rgba(255, 255, 255, 0.06)",
          // Legacy layout aliases (used across app)
          background: "#0D1017",
          surface: "#111622",
          surfaceSoft: "#181E2E",
          // Logo five — Part 1
          educationRed: "#CC2200",
          healthBlue: "#29ABE2",
          businessGreen: "#22B14C",
          energyOrange: "#F7941D",
          powerBlack: "#231F20",
          // Extended — Part 2 / UIUX
          platformPurple: "#7C3AED",
          vipGold: "#F59E0B",
          techTeal: "#06B6D4",
          blueBright: "#33C3FF",
          // Semantic shortcuts (maps to logo system)
          primary: "#29ABE2",
          secondary: "#22B14C",
          accent: "#F7941D",
          highlight: "#CC2200",
          // Glow / UI (Health Blue + Blue Bright)
          neonBlue: "#33C3FF",
          neonBlueSoft: "rgba(51, 195, 255, 0.7)",
          electricBlue: "#29ABE2",
          electricBlueSoft: "rgba(41, 171, 226, 0.7)",
          violetGlow: "#7C3AED",
          slate: "#94a3b8",
          slateSoft: "rgba(148, 163, 184, 0.65)",
          textBody: "#B0BAD3",
          textMuted: "#6B7A99",
          footer: "#080A10"
        },
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
        "mesh-dark": `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(41,171,226,0.14), transparent),
          radial-gradient(ellipse 60% 40% at 100% 0%, rgba(124,58,237,0.1), transparent),
          radial-gradient(ellipse 50% 30% at 0% 50%, rgba(8,10,16,0.95), transparent)`,
        "gradient-hero": `linear-gradient(135deg, rgba(41, 171, 226, 0.18) 0%, rgba(13, 16, 23, 0.95) 40%, rgba(34, 177, 76, 0.12) 100%)`,
        "gradient-text": `linear-gradient(135deg, #33C3FF 0%, #29ABE2 35%, #22B14C 70%, #e5e7eb 100%)`,
        "gradient-border": "linear-gradient(135deg, #33C3FF, #29ABE2, #22B14C)",
        "gradient-new":
          "linear-gradient(135deg, #22B14C 0%, #059669 30%, #7C3AED 70%, #F59E0B 100%)",
        "gradient-new-soft": `linear-gradient(135deg, rgba(34,177,76,0.2) 0%, rgba(124,58,237,0.2) 50%, rgba(245,158,11,0.15) 100%)`,
        "gradient-btn-primary": "linear-gradient(135deg, #29ABE2 0%, #22B14C 100%)",
        "gradient-hero-ecosystem":
          "linear-gradient(180deg, #080A10 0%, #0D1017 50%, #080A10 100%)"
      },
      boxShadow: {
        "neon-blue":
          "0 0 24px -6px rgba(51,195,255,0.75), 0 0 64px -16px rgba(41,171,226,0.4)",
        "neon-electric":
          "0 0 24px -6px rgba(41,171,226,0.85), 0 0 64px -16px rgba(41,171,226,0.45)",
        "card-glass":
          "0 18px 45px rgba(8,10,16,0.92), 0 0 0 1px rgba(148,163,184,0.15) inset",
        "card-glass-hover":
          "0 24px 60px rgba(8,10,16,0.96), 0 0 0 1px rgba(41,171,226,0.55) inset, 0 0 40px rgba(41,171,226,0.45)",
        "neon-emerald":
          "0 0 28px -4px rgba(34,177,76,0.75), 0 0 56px -12px rgba(34,177,76,0.4)",
        "neon-amber":
          "0 0 24px -4px rgba(245,158,11,0.7), 0 0 48px -12px rgba(245,158,11,0.3)",
        "glass-new":
          "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(167,139,250,0.15) inset",
        "neon-green":
          "0 0 24px -4px rgba(34,177,76,0.7), 0 0 48px -12px rgba(34,177,76,0.35)",
        "neon-red":
          "0 0 24px -4px rgba(204,34,0,0.55), 0 0 48px -12px rgba(204,34,0,0.28)",
        "neon-orange":
          "0 0 24px -4px rgba(247,148,29,0.65), 0 0 48px -12px rgba(247,148,29,0.32)",
        "neon-primary":
          "0 0 24px -4px rgba(41,171,226,0.7), 0 0 48px -12px rgba(41,171,226,0.35)"
      },
      spacing: {
        "safe-t": "env(safe-area-inset-top)",
        "safe-b": "env(safe-area-inset-bottom)",
        "safe-l": "env(safe-area-inset-left)",
        "safe-r": "env(safe-area-inset-right)",
        section: "120px",
        "card-gap": "24px"
      },
      maxWidth: {
        ultra: "1400px"
      },
      minHeight: {
        touch: "44px",
        "touch-lg": "48px",
        hero: "80vh"
      },
      minWidth: {
        touch: "44px"
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
