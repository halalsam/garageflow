import type { JobEvent, Person } from "@/types/api";

// An event is "own" when it was authored by the current user. Prefer the stable
// user id; fall back to initials + name for older rows that lack one.
export function isOwnEvent(ev: JobEvent, me?: Person): boolean {
  if (!me || !("by" in ev) || !ev.by) return false;
  return ev.by.id && me.id
    ? ev.by.id === me.id
    : ev.by.initials === me.initials && ev.by.name === me.name;
}
