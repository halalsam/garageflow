import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Row, Bubble, BubbleTime } from "@/components/chat/Chat";
import { Ticks } from "@/components/timeline/Ticks";
import type { TickState } from "@/components/timeline/useTicks";
import type { JobEvent } from "@/types/api";

// A text comment. Own comments sit right (orange); others sit left with an
// avatar. Own comments show a WhatsApp-style tick (sent ✓ / read ✓✓) by the time.
export function CommentBubble({
  ev,
  own,
  tick,
}: {
  ev: Extract<JobEvent, { type: "COMMENT" }>;
  own: boolean;
  tick?: TickState;
}) {
  return (
    <Row initials={ev.by.initials} color={ev.by.color} name={own ? undefined : ev.by.name} own={own}>
      <Bubble own={own}>
        <Txt className={`text-[13px] ${own ? "text-white" : ""}`} style={{ lineHeight: 19 }}>
          {ev.body}
        </Txt>
        <View className="flex-row items-center self-end" style={{ gap: 3 }}>
          <BubbleTime own={own}>{ev.time}</BubbleTime>
          {own ? <Ticks state={tick} /> : null}
        </View>
      </Bubble>
    </Row>
  );
}
