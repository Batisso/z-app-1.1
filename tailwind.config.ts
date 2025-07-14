import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", "var(--font-syne)", "system-ui", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
    },
    textShadow: {
      'glow': '0 0 8px rgba(255, 165, 0, 0.8), 0 0 12px rgba(255, 165, 0, 0.6), 0 0 16px rgba(255, 165, 0, 0.4)',
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        '.text-glow': {
          'text-shadow': 'var(--tw-text-shadow-glow)',
        },
      });
    },
  ],
};

export default config; 