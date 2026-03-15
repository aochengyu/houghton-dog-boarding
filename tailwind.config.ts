import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Semantic surface aliases ──────────────────────── */
        surface: {
          page:    '#faf6f0',  /* = cream */
          card:    '#ffffff',
          tinted:  '#f5ece0',  /* = cream-200 */
          dark:    '#154D54',  /* = teal */
          teal:    '#154D54',  /* = teal — marquee, pricing card */
          footer:  '#111e17',
          accent:  '#C09292',  /* = rose */
        },
        /* ── Brand primitives ─────────────────────────────── */
        forest: {
          50:  "#f0f5f2",
          100: "#d6e8dc",
          200: "#aed1bc",
          300: "#7db49a",
          400: "#4e9277",
          500: "#2d6e55",
          600: "#1f5240",
          700: "#154D54",
          800: "#0d3338",
          900: "#0a2629",
          DEFAULT: "#154D54",
        },
        cream: {
          50:  "#fdfcfa",
          100: "#faf6f0",
          200: "#f5ece0",
          300: "#ecd9c5",
          DEFAULT: "#faf6f0",
        },
        terra: {
          light: "#d4b0b0",
          DEFAULT: "#C09292",
          dark: "#9a6e6e",
        },
        gold: {
          light: "#e8c77a",
          DEFAULT: "#d4a853",
          dark: "#a87d2e",
        },
        teal: {
          light: "#1e6b78",
          DEFAULT: "#154D54",
          dark: "#0d3338",
        },
        rose: {
          light: "#d4b0b0",
          DEFAULT: "#C09292",
          dark: "#9a6e6e",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        'paw-bounce': 'paw-bounce 0.9s ease-in-out infinite',
        'paw-stamp': 'paw-stamp 2s ease-in-out infinite',
        'ripple-out': 'ripple-out 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'draw-circle': 'draw-circle 0.45s cubic-bezier(0.65, 0, 0.45, 1) forwards',
        'draw-check': 'draw-check 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards',
        'particle-burst': 'particle-burst 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'pay-pulse': 'pay-pulse 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-right': 'slideRight 0.5s ease forwards',
        'float': 'float 3s ease-in-out infinite',
        'scale-in': 'scaleIn 0.4s ease forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee': 'marquee 35s linear infinite',
        'fade-slide-in': 'fade-slide-in 0.25s ease-out both',
        'shake': 'shake 0.4s ease-in-out',
        'scale-in-micro': 'scale-in 0.15s ease-out',
        'bounce-in': 'bounce-in 0.3s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'fade-slide-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
        'scale-in': {
          from: { transform: 'scale(0.5)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'card':        '0 2px 8px rgba(21,77,84,0.06), 0 1px 2px rgba(21,77,84,0.04)',
        'card-hover':  '0 12px 40px rgba(21,77,84,0.12), 0 4px 12px rgba(21,77,84,0.08)',
        'glow':        '0 0 40px rgba(192,146,146,0.15)',
        'glow-terra':  '0 0 40px rgba(192,146,146,0.25)',
        'glow-gold':   '0 0 32px rgba(212,168,83,0.20)',
        'button':      '0 1px 2px rgba(21,77,84,0.12)',
        'button-hover':'0 4px 16px rgba(192,146,146,0.35)',
      },
    },
  },
  plugins: [],
};
export default config;
