// Pure report builders — turn the finance data into accountant-facing CSV and
// printable HTML. No native/React/data imports so this stays testable and
// portable. Callers fetch the data (via the API hooks) and hand it in; the
// screens pass the returned strings to lib/finance/export.

import type { GstReport, Invoice } from "@/types/api";

const WORKSHOP = "Main Street Motors";
const GSTIN = "27ABCDE1234F1Z5";

const esc = (v: string | number) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const row = (cells: (string | number)[]) => cells.map(esc).join(",");
const half = (gst: number) => Math.round(gst / 2);

// GSTR-1 style outward-supplies / sales register for the period's invoices.
export function gstr1Csv(invoices: Invoice[], monthLabel: string): string {
  const lines = [
    row([`GSTR-1 Outward Supplies — ${monthLabel}`]),
    row([WORKSHOP, `GSTIN ${GSTIN}`]),
    "",
    row(["Invoice No", "Date", "Customer", "Taxable Value", "CGST", "SGST", "Invoice Value"]),
    ...invoices.map((i) => row([i.number, i.issuedAt, i.customer, i.subtotal, half(i.gst), i.gst - half(i.gst), i.total])),
  ];
  return lines.join("\n");
}

// GSTR-3B summary (net output tax for the period) from the aggregate report.
export function gstr3bCsv(g: GstReport, monthLabel: string): string {
  const lines = [
    row([`GSTR-3B Summary — ${monthLabel}`]),
    row([WORKSHOP, `GSTIN ${GSTIN}`]),
    "",
    row(["3.1(a) Outward taxable supplies", g.taxable]),
    row(["Central Tax (CGST)", g.cgst]),
    row(["State Tax (SGST)", g.sgst]),
    row(["Total tax payable", g.gst]),
    row(["Taxable invoices", g.count]),
  ];
  return lines.join("\n");
}
