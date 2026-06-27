// Pure report builders — turn the finance data into accountant-facing CSV and
// printable HTML. No native/React/data imports so this stays testable and
// portable. Callers fetch the data (via the API hooks) and hand it in; the
// screens pass the returned strings to lib/finance/export.

import type { GstReport, Invoice, LedgerStatement } from "@/types/api";

const WORKSHOP = "Main Street Motors";
const GSTIN = "27ABCDE1234F1Z5";

const esc = (v: string | number) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const row = (cells: (string | number)[]) => cells.map(esc).join(",");
const half = (gst: number) => Math.round(gst / 2);

// Customer statement (ledger) as CSV.
export function partyLedgerCsv(ledger: LedgerStatement): string {
  const lines = [
    row([`Statement of Account — ${ledger.customer}`]),
    row([WORKSHOP]),
    "",
    row(["Date", "Particulars", "Invoice", "Debit", "Credit", "Balance"]),
    ...ledger.entries.map((e) => row([e.date, e.particulars, e.ref, e.debit || "", e.credit || "", e.balance])),
    "",
    row(["", "", "Closing balance", "", "", ledger.closing]),
  ];
  return lines.join("\n");
}

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

// Printable statement of account (for PDF export).
export function partyLedgerHtml(ledger: LedgerStatement, monthLabel: string): string {
  const fmt = (n: number) => (n ? "₹" + n.toLocaleString("en-IN") : "");
  const rows = ledger.entries
    .map(
      (e) => `<tr>
        <td>${e.date}</td><td>${e.particulars}</td><td>${e.ref}</td>
        <td class="num">${fmt(e.debit)}</td><td class="num">${fmt(e.credit)}</td>
        <td class="num">${"₹" + e.balance.toLocaleString("en-IN")}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"/><style>
    body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1a1a1a;padding:28px}
    h1{font-size:20px;margin:0} .sub{color:#6b7280;font-size:12px;margin:2px 0 18px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th,td{text-align:left;padding:8px 6px;border-bottom:1px solid #ececef}
    th{color:#6b7280;font-weight:700;text-transform:uppercase;font-size:10px;letter-spacing:.4px}
    .num{text-align:right;font-variant-numeric:tabular-nums}
    .close{margin-top:16px;display:flex;justify-content:space-between;font-weight:800;font-size:15px;
      border-top:2px solid #1a1a1a;padding-top:10px}
  </style></head><body>
    <h1>Statement of Account</h1>
    <div class="sub">${WORKSHOP} · ${ledger.customer} · ${monthLabel}</div>
    <table><thead><tr><th>Date</th><th>Particulars</th><th>Invoice</th>
      <th class="num">Debit</th><th class="num">Credit</th><th class="num">Balance</th></tr></thead>
      <tbody>${rows}</tbody></table>
    <div class="close"><span>Closing balance due</span><span>₹${ledger.closing.toLocaleString("en-IN")}</span></div>
  </body></html>`;
}
