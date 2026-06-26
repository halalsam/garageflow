/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#F7F7F8",
        ink: "#1A1A1A",
        muted: "#6B7280",
        faint: "#9CA3AF",
        line: "#F1F1F4",
        orange: "#FF5A1F",
        "orange-soft": "#FFF6F2",
        purple: "#6C2BD9",
        wa: "#25D366",
        green: "#22C55E",
        // status tint backgrounds
        "t-gray": "#F1F1F4",
        "t-blue": "#EAF2FF",
        "t-green": "#E7F8EE",
        "t-amber": "#FEF6E7",
        "t-purple": "#F2ECFE",
        "t-red": "#FDECEC",
        // status tint text
        "tx-gray": "#6B7280",
        "tx-blue": "#2563EB",
        "tx-green": "#16A34A",
        "tx-amber": "#D97706",
        "tx-purple": "#6C2BD9",
        "tx-red": "#DC2626",
        // avatars
        "av-a": "#FF5A1F",
        "av-b": "#6C2BD9",
        "av-c": "#3B82F6",
        "av-d": "#16A34A",
        "av-e": "#F59E0B",
        "av-f": "#0EA5A4",
      },
      fontFamily: {
        sans: ["Satoshi-Regular"],
        medium: ["Satoshi-Medium"],
        bold: ["Satoshi-Bold"],
        black: ["Satoshi-Black"],
      },
      borderRadius: {
        card: "18px",
        btn: "13px",
        tile: "11px",
      },
    },
  },
  plugins: [],
};
