import { Image, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { CarThumb } from "@/components/ui/CarThumb";
import { Icon } from "@/components/Icon";
import { Row, Bubble, BubbleTime, SystemPill } from "@/components/chat/Chat";
import { VoiceMessage } from "@/components/chat/VoiceMessage";
import { inr } from "@/lib/format";
import type { Person, TimelineItem } from "@/types/api";
// Renders a single timeline entry. `me` decides whether a message is rendered
// as an outgoing ("own") bubble on the right.
export function ChatMessage({ it, me }: { it: TimelineItem; me?: Person }) {
  if (it.kind === "system") {
    return <SystemPill text={it.text} tone={it.tone} icon={it.icon} />;
  }

  // Right-align only messages authored by the current user. Prefer the stable
  // user id; fall back to name + initials for older entries that lack one.
  const own =
    !!me &&
    (it.by.id && me.id
      ? it.by.id === me.id
      : it.by.initials === me.initials && it.by.name === me.name);
  const senderName = own ? undefined : it.by.name;

  switch (it.kind) {
    case "text":
      return (
        <Row initials={it.by.initials} color={it.by.color} name={senderName} own={own}>
          <Bubble own={own}>
            <Txt className={`text-[13px] ${own ? "text-white" : ""}`} style={{ lineHeight: 19 }}>
              {it.text}
            </Txt>
            <BubbleTime own={own}>{it.time}</BubbleTime>
          </Bubble>
        </Row>
      );
    case "photo":
      return (
        <Row initials={it.by.initials} color={it.by.color} name={senderName} own={own}>
          <Bubble className="p-[6px]" own={own}>
            {it.uri ? (
              <Image source={{ uri: it.uri }} style={{ width: 180, height: 135, borderRadius: 10 }} resizeMode="cover" />
            ) : (
              <CarThumb width={150} height={104} radius={10} iconSize={30}>
                {it.tag ? (
                  <View className="absolute bottom-[9px] left-[9px] rounded-[6px] bg-white/80 px-[7px] py-[3px]">
                    <Txt className="font-bold text-[9px] text-[#8A8A93]" style={{ letterSpacing: 0.4 }}>
                      {it.tag}
                    </Txt>
                  </View>
                ) : null}
              </CarThumb>
            )}
            <BubbleTime own={own} className="px-[4px]">
              {it.time}
            </BubbleTime>
          </Bubble>
        </Row>
      );
    case "voice":
      return (
        <Row initials={it.by.initials} color={it.by.color} name={senderName} own={own}>
          <Bubble style={{ minWidth: 160 }}>
            <VoiceMessage uri={it.uri} dur={it.dur} />
            <BubbleTime>{it.time}</BubbleTime>
          </Bubble>
        </Row>
      );
    case "part":
      return (
        <Row initials={it.by.initials} color={it.by.color} name={senderName} own={own}>
          <Bubble className="border border-[#FFE0D2] bg-[#FFF6F2]" style={{ width: 230 }}>
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <View className="h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-orange">
                <Icon name="package" size={15} color="#fff" weight="fill" />
              </View>
              <View className="flex-1">
                <Txt className="font-bold text-[13px]">{it.name}</Txt>
                <Txt className="font-medium text-[11px] text-muted">
                  Qty {it.qty} · {inr(it.price)}
                </Txt>
              </View>
            </View>
            <BubbleTime>{it.time}</BubbleTime>
          </Bubble>
        </Row>
      );
  }
}
