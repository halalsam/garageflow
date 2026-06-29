import { sharePdf } from "@/lib/finance/export";
import { WORKSHOP } from "@/lib/format";
import type { CompletionPhoto, JobDetail } from "@/types/api";

const SIDE_LABEL: Record<string, string> = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
};

// Build a completion report PDF (vehicle summary + the four walk-around photos)
// and hand it to the native share sheet so it can go to the customer.
export async function shareCompletionReport(job: JobDetail, photos: CompletionPhoto[]) {
  const cards = photos
    .map(
      (p) =>
        `<div class="card"><img src="${p.uri}" /><div class="cap">${SIDE_LABEL[p.side] ?? p.side}</div></div>`,
    )
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, Roboto, Arial, sans-serif; color: #18181B; margin: 0; padding: 36px; }
    .brand { font-size: 22px; font-weight: 800; }
    .muted { color: #71717A; font-size: 12px; }
    h2 { font-size: 15px; margin: 22px 0 12px; }
    .meta { margin-top: 14px; padding-top: 12px; border-top: 1px solid #E4E4E7; font-size: 13px; }
    .grid { display: flex; flex-wrap: wrap; gap: 12px; }
    .card { width: calc(50% - 6px); }
    .card img { width: 100%; border-radius: 10px; display: block; }
    .cap { margin-top: 6px; font-size: 12px; font-weight: 700; color: #52525B; }
  </style></head>
  <body>
    <div class="brand">${WORKSHOP}</div>
    <div class="muted">Job completion report</div>
    <div class="meta">
      <div style="font-weight:700">${job.make} ${job.model} · ${job.year} · ${job.plate}</div>
      <div class="muted">${job.customer?.name ?? ""}</div>
    </div>
    <h2>Vehicle condition photos</h2>
    <div class="grid">${cards}</div>
  </body></html>`;

  await sharePdf(`${job.plate} completion`, html);
}
