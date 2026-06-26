// Raw token values for places that need a hex string (icon colors, svg, shadows).
// Tailwind/NativeWind classes mirror these in tailwind.config.js.

export const C = {
  bg: "#F7F7F8",
  ink: "#1A1A1A",
  muted: "#6B7280",
  faint: "#9CA3AF",
  line: "#F1F1F4",
  white: "#FFFFFF",
  orange: "#FF5A1F",
  orangeSoft: "#FFF6F2",
  purple: "#6C2BD9",
  wa: "#25D366",
  green: "#22C55E",
} as const;

// status pill: background + text
export type Tone = "gray" | "blue" | "green" | "amber" | "purple" | "red";

export const TONE: Record<Tone, { bg: string; tx: string }> = {
  gray: { bg: "#F1F1F4", tx: "#6B7280" },
  blue: { bg: "#EAF2FF", tx: "#2563EB" },
  green: { bg: "#E7F8EE", tx: "#16A34A" },
  amber: { bg: "#FEF6E7", tx: "#D97706" },
  purple: { bg: "#F2ECFE", tx: "#6C2BD9" },
  red: { bg: "#FDECEC", tx: "#DC2626" },
};

// avatar background colors keyed a–f, matching the design's .av-* classes
export const AVATAR: Record<string, string> = {
  a: "#FF5A1F",
  b: "#6C2BD9",
  c: "#3B82F6",
  d: "#16A34A",
  e: "#F59E0B",
  f: "#0EA5A4",
};

// soft card shadow used across the app
export const cardShadow = {
  shadowColor: "#281E14",
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;
