/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4F6EF7',
          dark: '#1a1a2e',
          canvas: '#f0f2f8',
          panel: '#f8f9ff',
          success: '#22c55e',
          border: '#e2e8f0',
          text: '#1a1a2e',
          muted: '#94a3b8',
        },
        site: {
          primary: 'var(--site-primary, #4F6EF7)',
          secondary: 'var(--site-secondary, #7C3AED)',
          accent: 'var(--site-accent, #F59E0B)',
          bg: 'var(--site-bg, #ffffff)',
          text: 'var(--site-text, #1a1a2e)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
