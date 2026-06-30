import { SystemPill } from "@/components/chat/Chat";
import type { JobEvent } from "@/types/api";

// A server-generated system note (e.g. "Estimate submitted for approval"),
// rendered as a centered pill. Reuses the chat SystemPill primitive.
export function SystemLine({ ev }: { ev: Extract<JobEvent, { type: "SYSTEM" }> }) {
  const tone = (ev.payload?.tone as "purple" | "green" | undefined) ?? "purple";
  const icon = (ev.payload?.icon as "shield-check" | "check-circle" | undefined) ?? "shield-check";
  return <SystemPill text={ev.body} tone={tone} icon={icon} />;
}
