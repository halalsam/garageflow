import { View } from "react-native";
import { Icon } from "@/components/Icon";
import { Row, Bubble, BubbleTime } from "@/components/chat/Chat";
import { VoiceMessage } from "@/components/chat/VoiceMessage";
import { fmtDuration } from "@/components/chat/useChat";
import type { JobEvent } from "@/types/api";

// A voice note. The audio plays from its url (local uri while uploading, storage
// url after the echo). Duration comes from payload.durationMs.
export function VoiceCard({
  ev,
  own,
}: {
  ev: Extract<JobEvent, { type: "VOICE" }>;
  own: boolean;
}) {
  const dur = fmtDuration(Math.round((ev.payload.durationMs ?? 0) / 1000));
  return (
    <Row initials={ev.by.initials} color={ev.by.color} name={own ? undefined : ev.by.name} own={own}>
      <Bubble style={{ minWidth: 160 }}>
        <VoiceMessage uri={ev.payload.url} dur={dur} />
        <View className="flex-row items-center self-end" style={{ gap: 3 }}>
          <BubbleTime>{ev.time}</BubbleTime>
          {own && ev.status === "sending" ? (
            <Icon name="clock" size={10} color="#A1A1AA" weight="bold" />
          ) : null}
          {own && ev.status === "failed" ? (
            <Icon name="warning-circle" size={11} color="#EF4444" weight="fill" />
          ) : null}
        </View>
      </Bubble>
    </Row>
  );
}
