import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
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
        sans: ["var(--font-sora)", "system-ui", "sans-serif"]
      },
      colors: {
        ehb: {
          blue: "#0F172A",
          teal: "#14B8A6",
          cyan: "#22D3EE",
          accent: "#38BDF8",
          violet: "#8B5CF6",
          purple: "#A78BFA",
          fuchsia: "#D946EF",
          glow: {
            teal: "rgba(20, 184, 166, 0.4)",
            cyan: "rgba(34, 211, 238, 0.4)",
            violet: "rgba(139, 92, 246, 0.4)",
            accent: "rgba(56, 189, 248, 0.4)"
          }
        }
      },
      backgroundImage: {
        "mesh-dark": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56, 189, 248, 0.12), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(139, 92, 246, 0.08), transparent), radial-gradient(ellipse 50% 30% at 0% 50%, rgba(20, 184, 166, 0.06), transparent)",
        "gradient-hero": "linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(56, 189, 248, 0.12) 100%)",
        "gradient-text": "linear-gradient(135deg, #22D3EE 0%, #38BDF8 35%, #A78BFA 70%, #D946EF 100%)",
        "gradient-text-teal": "linear-gradient(135deg, #14B8A6 0%, #22D3EE 100%)",
        "gradient-border": "linear-gradient(135deg, #14B8A6, #8B5CF6, #38BDF8)"
      },
      boxShadow: {
        "neon-teal": "0 0 20px -4px rgba(20, 184, 166, 0.5), 0 0 40px -10px rgba(20, 184, 166, 0.2)",
        "neon-cyan": "0 0 20px -4px rgba(34, 211, 238, 0.5), 0 0 40px -10px rgba(34, 211, 238, 0.2)",
        "neon-violet": "0 0 20px -4px rgba(139, 92, 246, 0.5), 0 0 40px -10px rgba(139, 92, 246, 0.2)",
        "neon-accent": "0 0 24px -4px rgba(56, 189, 248, 0.5), 0 0 48px -12px rgba(56, 189, 248, 0.2)",
        "card-premium": "0 4px 6px -1px rgba(0,0,0,0.4), 0 12px 24px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 30px -8px rgba(20, 184, 166, 0.12)",
        "card-premium-violet": "0 4px 6px -1px rgba(0,0,0,0.4), 0 12px 24px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 30px -8px rgba(139, 92, 246, 0.15)"
      },
      spacing: {
        "safe-t": "env(safe-area-inset-top)",
        "safe-b": "env(safe-area-inset-bottom)",
        "safe-l": "env(safe-area-inset-left)",
        "safe-r": "env(safe-area-inset-right)"
      },
      minHeight: {
        touch: "44px",
        "touch-lg": "48px"
      },
      minWidth: {
        touch: "44px"
      }
    }
  },
  plugins: []
};

export default config;

