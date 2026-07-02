// Small presentational helpers + app-level constants shared across screens.
// (Formerly lived in data/mock.ts; the mock fixtures are gone now that the app
// reads live data from the API.)

// Indian-rupee formatter. The API sends whole-rupee numbers; screens call this.
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

// The (single-tenant) workshop name shown in headers/receipts. Not yet exposed
// by the API — kept here until a workshop/settings endpoint lands.
export const WORKSHOP = "Main Street Motors";

// Compact relative-time label for feed rows ("Just now", "5m ago", "2h ago",
// then a short date once it's older than a day).
export function agoLabel(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// Current reporting period anchors used for labels and client-side month
// filtering. The server is authoritative for figures; these are display/filter
// helpers only.
export const MONTH = "2026-06"; // "YYYY-MM"
export const MONTH_LABEL = "June 2026";
