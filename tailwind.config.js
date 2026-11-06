/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          base: 'var(--neu-base)',
          dark: 'var(--neu-dark)',
          light: 'var(--neu-light)',
          border: 'var(--neu-border)',
          subtle: 'var(--neu-border-subtle)',
          text: 'var(--neu-text)',
          muted: 'var(--neu-text-muted)',
          track: 'var(--neu-track)',
          header: 'var(--neu-table-header)',
        },
        petroleum: {
          DEFAULT: '#0c3547',
          light: '#134b63',
          dark: '#0a2d3d',
        }
      },
      boxShadow: {
        'neu-flat': '8px 8px 16px var(--neu-dark), -8px -8px 16px var(--neu-light)',
        'neu-flat-md': '4px 4px 8px var(--neu-dark), -4px -4px 8px var(--neu-light)',
        'neu-flat-sm': '3px 3px 6px var(--neu-dark), -3px -3px 6px var(--neu-light)',
        'neu-flat-xs': '2px 2px 4px var(--neu-dark), -2px -2px 4px var(--neu-light)',
        'neu-pressed': 'inset 3px 3px 6px var(--neu-dark), inset -3px -3px 6px var(--neu-light)',
        'neu-pressed-sm': 'inset 2px 2px 4px var(--neu-dark), inset -2px -2px 4px var(--neu-light)',
        'neu-pressed-xs': 'inset 1px 1px 2px var(--neu-dark), inset -1px -1px 2px var(--neu-light)',
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
};
