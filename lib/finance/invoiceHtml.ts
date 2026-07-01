import { WORKSHOP, inr } from "@/lib/format";
import type { CompletionPhoto, Invoice } from "@/types/api";

const SIDE_LABEL: Record<string, string> = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
};

// Optional walk-around photos appended to the invoice: `before` is the set
// captured when work finished, `after` the delivery hand-off set.
export type InvoicePhotos = { before: CompletionPhoto[]; after: CompletionPhoto[] };

function photoSection(title: string, photos: CompletionPhoto[]): string {
  if (!photos.length) return "";
  const cards = photos
    .map(
      (p) =>
        `<div class="card"><img src="${p.uri}" /><div class="cap">${SIDE_LABEL[p.side] ?? p.side}</div></div>`,
    )
    .join("");
  return `<h2>${title}</h2><div class="grid">${cards}</div>`;
}

// Build a printable HTML document for a single invoice. Rendered to PDF via
// expo-print and handed to the share sheet (see sharePdf in ./export).
export function invoiceHtml(invoice: Invoice, photos?: InvoicePhotos): string {
  const lines = invoice.lines
    .map(
      (l) => `<tr><td>${escape(l.label)}</td><td class="r">${inr(l.amount)}</td></tr>`,
    )
    .join("");

  const paidRow =
    invoice.paid != null
      ? `<tr><td>Paid</td><td class="r">${inr(invoice.paid)}</td></tr>
         <tr><td>Balance</td><td class="r">${inr(invoice.balance ?? invoice.total - (invoice.paid ?? 0))}</td></tr>`
      : "";

  return `<!doctype html><html><head><meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif; color: #18181B; margin: 0; padding: 40px; }
    .head { display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 22px; font-weight: 800; }
    .muted { color: #71717A; font-size: 12px; }
    .status { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; background: #F2ECFE; color: #6C2BD9; }
    .meta { margin-top: 18px; padding-top: 14px; border-top: 1px solid #E4E4E7; }
    table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 14px; }
    td { padding: 9px 0; border-top: 1px solid #E4E4E7; }
    tr:first-child td { border-top: 0; }
    .r { text-align: right; font-weight: 600; }
    .totals td { border: 0; padding: 3px 0; color: #71717A; }
    .grand td { border-top: 2px solid #18181B; padding-top: 12px; font-size: 18px; font-weight: 800; color: #18181B; }
    h2 { font-size: 14px; margin: 26px 0 10px; }
    .grid { display: flex; flex-wrap: wrap; gap: 12px; }
    .card { width: calc(50% - 6px); }
    .card img { width: 100%; border-radius: 10px; display: block; }
    .cap { margin-top: 6px; font-size: 12px; font-weight: 700; color: #52525B; }
  </style></head>
  <body>
    <div class="head">
      <div>
        <div class="brand">${WORKSHOP}</div>
        <div class="muted">GSTIN 27ABCDE1234F1Z5</div>
      </div>
      <div class="status">${invoice.status ?? "UNPAID"}</div>
    </div>
    <div class="meta">
      <div class="muted">${escape(invoice.number)} · ${escape(invoice.date)}</div>
      <div style="margin-top:4px;font-weight:700;font-size:13px">${escape(invoice.customer)} · ${escape(invoice.car)} · ${escape(invoice.plate)}</div>
    </div>
    <table>${lines}</table>
    <table class="totals">
      <tr><td>Subtotal</td><td class="r">${inr(invoice.subtotal)}</td></tr>
      <tr><td>GST 18%</td><td class="r">${inr(invoice.gst)}</td></tr>
      ${paidRow}
      <tr class="grand"><td>Grand total</td><td class="r">${inr(invoice.total)}</td></tr>
    </table>
    ${photos ? photoSection("Before — at arrival", photos.before) : ""}
    ${photos ? photoSection("After — at delivery", photos.after) : ""}
  </body></html>`;
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}
