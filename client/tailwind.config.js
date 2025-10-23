module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        afyaBlue: "#0ea5a4",
        afyaDark: "#0f172a",
        surface: "#F8F9FA",
        background: "#F3F4F6",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
