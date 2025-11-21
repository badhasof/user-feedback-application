/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          hover: "#4338ca",
        },
        secondary: "#64748b",
      },
      borderRadius: {
        container: "0.75rem",
      },
      spacing: {
        section: "2rem",
      },
      fontFamily: {
        sans: [
          "Satoshi",
          "Inter Variable",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Space Grotesk",
          "Satoshi",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
