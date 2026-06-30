import { View } from "react-native";
import { ReadReceipt } from "@/components/chat/ReadReceipt";
import { CommentBubble } from "./CommentBubble";
import { PhotoCard } from "./PhotoCard";
import { VoiceCard } from "./VoiceCard";
import { PartCard } from "./PartCard";
import { StatusPill } from "./StatusPill";
import { ApprovalCard } from "./ApprovalCard";
import { SystemLine } from "./SystemLine";
import { isOwnEvent } from "./useEventReceipts";
import type { JobEvent, Person } from "@/types/api";

// Renders one timeline event by switching on `event.type`. `me` decides which
// messages align right (own); `seenBy` lists participants who have read up to
// this (own) message — shown as tiny avatars beneath it.
export function EventRow({
  event,
  me,
  seenBy,
}: {
  event: JobEvent;
  me?: Person;
  seenBy?: Person[];
}) {
  const own = isOwnEvent(event, me);
  const body = renderBody();

  return own && seenBy?.length ? (
    <View>
      {body}
      <ReadReceipt people={seenBy} />
    </View>
  ) : (
    body
  );

  function renderBody() {
    switch (event.type) {
      case "COMMENT":
        return <CommentBubble ev={event} own={own} />;
      case "PHOTO":
        return <PhotoCard ev={event} own={own} />;
      case "VOICE":
        return <VoiceCard ev={event} own={own} />;
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
}
