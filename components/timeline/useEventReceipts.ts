import { useMemo } from "react";
import type { JobEvent, JobRead, Person } from "@/types/api";

// An event is "own" when it was authored by the current user. Prefer the stable
// user id; fall back to initials + name for older rows that lack one.
export function isOwnEvent(ev: JobEvent, me?: Person): boolean {
  if (!me || !("by" in ev) || !ev.by) return false;
  return ev.by.id && me.id
    ? ev.by.id === me.id
    : ev.by.initials === me.initials && ev.by.name === me.name;
}

// Map of event id → people who have read up to (and no further than) that event.
// Produces the "floating avatar" read receipt under the latest of YOUR messages
// each other participant has seen. Mirrors the old useReadReceipts but keyed by
// event id (events arrive newest-first, so we sort a chronological copy).
export function useEventReceipts(
  events: JobEvent[],
  me?: Person,
  reads?: JobRead[],
): Record<string, Person[]> {
  return useMemo(() => {
    const out: Record<string, Person[]> = {};
    if (!me || !reads?.length) return out;

    const own = events
      .filter((ev) => isOwnEvent(ev, me) && ev.status !== "sending" && ev.status !== "failed")
      .slice()
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    if (!own.length) return out;

    for (const r of reads) {
      if (!r.by) continue;
      if (me.id ? r.by.id === me.id : r.by.initials === me.initials) continue;
      const readAt = Date.parse(r.atISO);
      let targetId: string | null = null;
      for (const ev of own) {
        if (Date.parse(ev.createdAt) <= readAt) targetId = ev.id;
        else break;
      }
      if (targetId) (out[targetId] ??= []).push(r.by);
    }
    return out;
  }, [events, me, reads]);
}
