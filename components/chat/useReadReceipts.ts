import { useMemo } from "react";
import type { JobRead, Person, TimelineItem } from "@/types/api";

// Map of timeline index -> people who have read up to (and no further than)
// that message. Produces the "floating avatar" effect: each other participant's
// avatar appears under the latest of YOUR messages they've seen.
export type Receipts = Record<number, Person[]>;

function isMine(it: TimelineItem, me?: Person): it is Extract<TimelineItem, { by: Person }> {
  if (!me || it.kind === "system") return false;
  return it.by.id && me.id ? it.by.id === me.id : it.by.initials === me.initials && it.by.name === me.name;
}

export function useReadReceipts(messages: TimelineItem[], me?: Person, reads?: JobRead[]): Receipts {
  return useMemo(() => {
    const out: Receipts = {};
    if (!me || !reads?.length) return out;

    // Indices of the current user's own messages, with their timestamps.
    const own = messages
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => isMine(it, me) && (it as Extract<TimelineItem, { by: Person }>).atISO);

    if (!own.length) return out;

    for (const r of reads) {
      if (!r.by || (me.id && r.by.id === me.id) || (!me.id && r.by.initials === me.initials)) continue;
      const readAt = Date.parse(r.atISO);
      // Latest own message at or before this viewer's read time.
      let target: number | null = null;
      for (const { it, i } of own) {
        const at = Date.parse((it as Extract<TimelineItem, { by: Person }>).atISO!);
        if (at <= readAt) target = i;
        else break;
      }
      if (target != null) (out[target] ??= []).push(r.by);
    }
    return out;
  }, [messages, me, reads]);
}
