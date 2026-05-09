/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-primary)',
        surface: 'var(--bg-secondary)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        accent: 'var(--accent-color)',
        'accent-hover': 'var(--accent-hover)',
        danger: 'var(--danger-color)',
        success: 'var(--success-color)',
        border: 'var(--border-color)',
      },
    },
  },
  plugins: [],
}
