import { Image, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { Row, Bubble, BubbleTime } from "@/components/chat/Chat";
import { Ticks } from "@/components/timeline/Ticks";
import type { TickState } from "@/components/timeline/useTicks";
import type { JobEvent } from "@/types/api";

// A photo attachment. The image is shown from its url (a local uri while the
// optimistic send is uploading, then the storage url once the server echoes).
export function PhotoCard({
  ev,
  own,
  tick,
}: {
  ev: Extract<JobEvent, { type: "PHOTO" }>;
  own: boolean;
  tick?: TickState;
}) {
  const uploading = own && ev.status === "sending";
  return (
    <Row initials={ev.by.initials} color={ev.by.color} name={own ? undefined : ev.by.name} own={own}>
      <Bubble className="p-[6px]" own={own}>
        <View>
          <Image
            source={{ uri: ev.payload.url }}
            style={{ width: 180, height: 135, borderRadius: 10, opacity: uploading ? 0.6 : 1 }}
            resizeMode="cover"
          />
          {uploading ? (
            <View className="absolute inset-0 items-center justify-center">
              <Icon name="clock" size={22} color="#fff" weight="bold" />
            </View>
          ) : null}
          {ev.payload.tag ? (
            <View className="absolute bottom-[9px] left-[9px] rounded-[6px] bg-white/80 px-[7px] py-[3px]">
              <Txt className="font-bold text-[9px] text-[#8A8A93]" style={{ letterSpacing: 0.4 }}>
                {ev.payload.tag}
              </Txt>
            </View>
          ) : null}
        </View>
        <View className="flex-row items-center self-end px-[4px]" style={{ gap: 3 }}>
          <BubbleTime own={own}>{ev.time}</BubbleTime>
          {own ? <Ticks state={tick} onLight /> : null}
        </View>
      </Bubble>
    </Row>
  );
}
