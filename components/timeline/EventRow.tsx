import { CommentBubble } from "./CommentBubble";
import { PhotoCard } from "./PhotoCard";
import { VoiceCard } from "./VoiceCard";
import { PartCard } from "./PartCard";
import { StatusPill } from "./StatusPill";
import { ApprovalCard } from "./ApprovalCard";
import { SystemLine } from "./SystemLine";
import { isOwnEvent } from "./useEventReceipts";
import type { TickState } from "./useTicks";
import type { JobEvent, Person } from "@/types/api";

// Renders one timeline event by switching on `event.type`. `me` decides which
// messages align right (own); `tick` is the WhatsApp-style delivery/read glyph
// shown inline at the end of an own message (sent ✓ / read ✓✓).
export function EventRow({
  event,
  me,
  tick,
}: {
  event: JobEvent;
  me?: Person;
  tick?: TickState;
}) {
  const own = isOwnEvent(event, me);

  switch (event.type) {
    case "COMMENT":
      return <CommentBubble ev={event} own={own} tick={tick} />;
    case "PHOTO":
      return <PhotoCard ev={event} own={own} tick={tick} />;
    case "VOICE":
      return <VoiceCard ev={event} own={own} tick={tick} />;
    case "PART_ADDED":
      return <PartCard ev={event} />;
    case "STATUS_CHANGE":
      return <StatusPill ev={event} />;
    case "APPROVAL":
      return <ApprovalCard ev={event} />;
    case "SYSTEM":
      return <SystemLine ev={event} />;
  }
}
