/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0F172A",
        teal: "#14B8A6",
        amber: "#F59E0B",
      },
    },
  },
  plugins: [],
};