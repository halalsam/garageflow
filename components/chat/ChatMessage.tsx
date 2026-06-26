import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { CarThumb } from "@/components/ui/CarThumb";
import { Icon } from "@/components/Icon";
import { Row, Bubble, BubbleTime, SystemPill, Waveform } from "@/components/chat/Chat";
import { inr, type Person, type TimelineItem } from "@/data/mock";

// Renders a single timeline entry. `me` decides whether a message is rendered
// as an outgoing ("own") bubble on the right.
export function ChatMessage({ it, me }: { it: TimelineItem; me?: Person }) {
  if (it.kind === "system") {
    return <SystemPill text={it.text} tone={it.tone} icon={it.icon} />;
  }

  const own = !!me && it.by.initials === me.initials;

  switch (it.kind) {
    case "text":
      return (
        <Row initials={it.by.initials} color={it.by.color} own={own}>
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
        <Row initials={it.by.initials} color={it.by.color} own={own}>
          <Bubble className="p-[6px]" own={own}>
            <CarThumb width={150} height={104} radius={10} iconSize={30}>
              <View className="absolute bottom-[9px] left-[9px] rounded-[6px] bg-white/80 px-[7px] py-[3px]">
                <Txt className="font-bold text-[9px] text-[#8A8A93]" style={{ letterSpacing: 0.4 }}>
                  {it.tag}
                </Txt>
              </View>
            </CarThumb>
            <BubbleTime own={own} className="px-[4px]">
              {it.time}
            </BubbleTime>
          </Bubble>
        </Row>
      );
    case "voice":
      return (
        <Row initials={it.by.initials} color={it.by.color} own={own}>
          <Bubble style={{ minWidth: 160 }}>
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <Icon name="play" size={18} color="#FF5A1F" weight="fill" />
              <Waveform />
              <Txt className="font-bold text-[11px] text-muted">{it.dur}</Txt>
            </View>
            <BubbleTime>{it.time}</BubbleTime>
          </Bubble>
        </Row>
      );
    case "part":
      return (
        <Row initials={it.by.initials} color={it.by.color} own={own}>
          <Bubble className="border border-[#FFE0D2] bg-[#FFF6F2]">
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
