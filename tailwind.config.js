/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'asist-primary': '#2563eb',
        'asist-secondary': '#1e40af',
        'asist-success': '#16a34a',
        'asist-warning': '#f59e0b',
        'asist-danger': '#dc2626',
      },
    },
  },
  plugins: [],
};
