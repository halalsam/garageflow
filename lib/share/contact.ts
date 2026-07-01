import { Alert, Linking } from "react-native";
import { sharePdf } from "@/lib/finance/export";
import { WORKSHOP } from "@/lib/format";
import type { CompletionPhoto, JobDetail } from "@/types/api";

const SIDE_LABEL: Record<string, string> = {
  front: "Front",
  back: "Back",
  left: "Left",
  right: "Right",
};

// Strip a human-typed phone ("+91 98201 44556") down to dialable digits, keeping
// a leading + if present. WhatsApp needs the country code with no separators.
function normalizePhone(phone?: string): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[^\d+]/g, "");
  const digits = cleaned.replace(/\D/g, "");
  return digits.length >= 7 ? cleaned : null;
}

// Place a phone call to the customer.
export async function callCustomer(phone?: string) {
  const num = normalizePhone(phone);
  if (!num) return Alert.alert("No phone number", "This customer has no phone number saved.");
  const url = `tel:${num}`;
  const ok = await Linking.canOpenURL(url).catch(() => false);
  if (!ok) return Alert.alert("Can't call", "Calling isn't available on this device.");
  Linking.openURL(url);
}

// Open a WhatsApp chat with the customer, optionally pre-filling a message.
export async function whatsappCustomer(phone?: string, text?: string) {
  const num = normalizePhone(phone)?.replace(/^\+/, "");
  if (!num) return Alert.alert("No phone number", "This customer has no phone number saved.");
  const q = text ? `&text=${encodeURIComponent(text)}` : "";
  const appUrl = `whatsapp://send?phone=${num}${q}`;
  const webUrl = `https://wa.me/${num}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
  const hasApp = await Linking.canOpenURL(appUrl).catch(() => false);
  Linking.openURL(hasApp ? appUrl : webUrl);
}

// Build a shareable PDF (vehicle summary + the given photos) and hand it to the
// native share sheet, from which the user can pick WhatsApp. `title` labels the
// section (e.g. "Job completed" / "Vehicle delivered").
export async function shareCustomerReport(
  job: JobDetail,
  photos: CompletionPhoto[],
  title = "Vehicle report",
) {
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
    <div class="muted">${title}</div>
    <div class="meta">
      <div style="font-weight:700">${job.make} ${job.model} · ${job.year} · ${job.plate}</div>
      <div class="muted">${job.customer?.name ?? ""}</div>
    </div>
    ${cards ? `<h2>Vehicle condition photos</h2><div class="grid">${cards}</div>` : ""}
  </body></html>`;

  await sharePdf(`${job.plate} ${title.toLowerCase()}`, html);
}
