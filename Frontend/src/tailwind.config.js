/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          500: '#8b5cf6',  // Your Figma purple
          600: '#7c3aed',
          700: '#6d28d9',
        },
        secondary: {
          500: '#4f46e5',  // Figma indigo/blue
        },
        neutral: {
          50: '#f8fafc',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
};
