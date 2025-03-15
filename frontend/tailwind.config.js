/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"], // ✅ Ensure Tailwind scans all files
    theme: {
      extend: {
        colors: {
          background: "#ffffff", // ✅ Add these custom colors
          foreground: "#171717",
        },
      },
    },
    plugins: [],
  };
  