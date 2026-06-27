// Small presentational helpers + app-level constants shared across screens.
// (Formerly lived in data/mock.ts; the mock fixtures are gone now that the app
// reads live data from the API.)

// Indian-rupee formatter. The API sends whole-rupee numbers; screens call this.
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

// The (single-tenant) workshop name shown in headers/receipts. Not yet exposed
// by the API — kept here until a workshop/settings endpoint lands.
export const WORKSHOP = "Main Street Motors";

// Current reporting period anchors used for labels and client-side month
// filtering. The server is authoritative for figures; these are display/filter
// helpers only.
export const MONTH = "2026-06"; // "YYYY-MM"
export const MONTH_LABEL = "June 2026";
