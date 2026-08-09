/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#4f46e5',
          light: '#eef2ff',
          hover: '#4338ca',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#fafaf8',
          sidebar: '#f5f4f0',
          border: '#e7e5e0',
          hover: '#f0efeb',
        },
        ink: {
          DEFAULT: '#1c1917',
          secondary: '#57534e',
          tertiary: '#a8a29e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
