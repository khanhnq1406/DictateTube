import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "bg-primary": "#1C172E",
        "bg-secondary": "#241F3A",
        btn: "#4F46E5",
        "btn-hover": "#4338CA",
        "color-shadow-primary": "#50114D",
        "color-shadow-secondary": "#0E1449",
        "text-success": "#45A34C",
        "text-warning": "#ECB231",
        "text-secondary": "#B7B4C7",
        "text-success-hover": "#3D8B40",
      },
      boxShadow: {
        "shadow-primary-l": "0px 0px 50px 5px #50114D",
        "shadow-primary-s": "0px 0px 30px 0px #50114D",
        "shadow-secondary-l": "0px 0px 50px 5px #0E1449",
        "shadow-secondary-s": "0px 0px 30px 0px #0E1449",
      },
      borderColor: {
        "color-shadow-primary": "#50114D",
      },
      backgroundImage: {
        "border-gradient": "linear-gradient(to right, #4F46E5, #50114D)",
      },
    },
  },
  plugins: [],
} satisfies Config;
