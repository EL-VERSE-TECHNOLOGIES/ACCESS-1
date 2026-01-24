/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' if you want to use system preference
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-surface': '#0f172a', // slate-900
        'dark-surface-variant': '#1e293b', // slate-800
        'neon-accent': '#00ffc2', // The specified neon accent
        'neon-accent-hover': '#00e6b2', // Slightly darker for hover states
        'text-primary': '#f1f5f9', // slate-100
        'text-secondary': '#cbd5e1', // slate-300
        'success': '#00ff9d',
        'warning': '#ffd166',
        'error': '#ff6b6b',
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0, 255, 194, 0.5)',
        'neon-lg': '0 0 25px rgba(0, 255, 194, 0.7)',
      }
    },
  },
  plugins: [],
}
