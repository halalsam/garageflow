import { Badge } from "@/components/ui/Badge";
import type { InvoiceStatus } from "@/types/api";
import type { Tone } from "@/lib/theme";

const TONE_FOR: Record<InvoiceStatus, Tone> = {
  PAID: "green",
  PARTIAL: "amber",
  UNPAID: "red",
};

// Maps an invoice's derived status to the right badge tone.
export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge label={status} tone={TONE_FOR[status]} />;
}
