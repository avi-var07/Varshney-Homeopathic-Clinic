import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette - warm green
        green: {
          50: "#f0faf4",
          100: "#dcf5e7",
          200: "#bbead0",
          300: "#86d8ab",
          400: "#4bbe82",
          500: "#27a060",
          600: "#1a824c",
          700: "#17683e",
          800: "#165333",
          900: "#13442b",
          950: "#0a2719",
        },
        // Saffron/orange accent
        saffron: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffdba8",
          300: "#ffc070",
          400: "#ff9d37",
          500: "#ff7f0e",
          600: "#f06204",
          700: "#c74806",
          800: "#9e390d",
          900: "#7f310e",
          950: "#451604",
        },
        // Warm beige
        beige: {
          50: "#fdf9f3",
          100: "#faf1e4",
          200: "#f4e0c6",
          300: "#ecc89f",
          400: "#e2a96f",
          500: "#d88e4a",
          600: "#ca773e",
          700: "#a85e34",
          800: "#874d30",
          900: "#6e402a",
          950: "#3a2014",
        },
        // Warm cream background
        cream: {
          50: "#fefcf8",
          100: "#fdf8ef",
          200: "#faf0dc",
          300: "#f5e4c0",
          400: "#efd49d",
          500: "#e8c07a",
        },
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(0,0,0,0.06)",
        card: "0 2px 16px rgba(0,0,0,0.08)",
        glow: "0 0 40px rgba(39,160,96,0.15)",
        "saffron-glow": "0 0 40px rgba(255,127,14,0.12)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #f0faf4 0%, #fdf9f3 50%, #fff8ed 100%)",
        "green-gradient": "linear-gradient(135deg, #1a824c 0%, #27a060 100%)",
        "warm-gradient":
          "linear-gradient(135deg, #fdf9f3 0%, #f0faf4 50%, #fff8ed 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
        pulse_soft: "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
