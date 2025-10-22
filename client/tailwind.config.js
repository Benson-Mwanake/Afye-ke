// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#22C55E", // bright green accent (buttons, highlights)
          light: "#86EFAC", // light green hover or background tint
          dark: "#15803D", // darker green for hover states
        },
        secondary: "#0C4A6E", // deep navy blue for hero/footer sections
        background: "#F9FAFB", // soft background
        surface: "#FFFFFF", // card/section backgrounds
        border: "#E5E7EB", // neutral border
        text: {
          primary: "#111827",
          secondary: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // clean & medical look
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 6px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
