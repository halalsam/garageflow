import { useMemo } from "react";
import type { JobEvent, JobRead, Person } from "@/types/api";
import { isOwnEvent } from "@/components/timeline/useEventReceipts";

// WhatsApp-style delivery state for one of the current user's own messages.
//   sending  → clock (optimistic, not yet confirmed by the server)
//   failed   → red warning
//   sent     → single grey ✓ (server has it, no recipient has read yet)
//   read     → blue ✓✓ (another participant has read up to this message)
// We don't have per-recipient delivery receipts, so "sent" doubles as
// "delivered" — a single tick until someone reads, then blue double ticks.
export type TickState = "sending" | "failed" | "sent" | "read";

// Build a map of own-event id → tick state. `reads` are the per-user read
// markers (who read up to when); an own message is "read" once some OTHER
// participant's marker is at/after the message's timestamp.
export function useTicks(
  events: JobEvent[],
  me?: Person,
  reads?: JobRead[],
): Record<string, TickState> {
  return useMemo(() => {
    const out: Record<string, TickState> = {};
    if (!me) return out;

    // Latest read time among OTHER participants (the moment "someone else" last
    // opened the chat). A message at/before this has been read.
    let othersReadAt = 0;
    for (const r of reads ?? []) {
      if (!r.by) continue;
      if (me.id ? r.by.id === me.id : r.by.initials === me.initials) continue;
      const t = Date.parse(r.atISO);
      if (t > othersReadAt) othersReadAt = t;
    }

    for (const ev of events) {
      if (!isOwnEvent(ev, me)) continue;
      if (ev.status === "sending") {
        out[ev.id] = "sending";
      } else if (ev.status === "failed") {
        out[ev.id] = "failed";
      } else if (othersReadAt && Date.parse(ev.createdAt) <= othersReadAt) {
        out[ev.id] = "read";
      } else {
        out[ev.id] = "sent";
      }
    }
    return out;
  }, [events, me, reads]);
}
