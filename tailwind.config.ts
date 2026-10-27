import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          800: "#0f1624",
          850: "#0b101c",
          900: "#070a12",
          950: "#04070d",
        },
        accent: {
          blue: "#3b82f6",
          indigo: "#4f46e5",
          violet: "#6366f1",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
      },
      backgroundImage: {
        "radial-subtle": "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
        "card-glass": "linear-gradient(180deg, rgba(18, 26, 43, 0.6) 0%, rgba(11, 17, 30, 0.7) 100%)",
      },
      boxShadow: {
        "subtle": "0 1px 2px 0 rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.06)",
        "glass": "0 8px 32px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        "glass-hover": "0 16px 40px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
