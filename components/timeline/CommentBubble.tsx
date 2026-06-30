import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { Row, Bubble, BubbleTime } from "@/components/chat/Chat";
import type { JobEvent, Person } from "@/types/api";

// A text comment. Own comments sit right (orange); others sit left with an
// avatar. A pending send shows a clock; a failed one shows a red warning.
export function CommentBubble({
  ev,
  own,
}: {
  ev: Extract<JobEvent, { type: "COMMENT" }>;
  own: boolean;
  me?: Person;
}) {
  return (
    <Row initials={ev.by.initials} color={ev.by.color} name={own ? undefined : ev.by.name} own={own}>
      <Bubble own={own}>
        <Txt className={`text-[13px] ${own ? "text-white" : ""}`} style={{ lineHeight: 19 }}>
          {ev.body}
        </Txt>
        <View className="flex-row items-center self-end" style={{ gap: 3 }}>
          <BubbleTime own={own}>{ev.time}</BubbleTime>
          {own && ev.status === "sending" ? (
            <Icon name="clock" size={10} color="rgba(255,255,255,0.7)" weight="bold" />
          ) : null}
          {own && ev.status === "failed" ? (
            <Icon name="warning-circle" size={11} color="#FCA5A5" weight="fill" />
          ) : null}
        </View>
      </Bubble>
    </Row>
  );
}
