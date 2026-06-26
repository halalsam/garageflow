import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "@/components/ui/Txt";
import { Badge } from "@/components/ui/Badge";
import { Plate } from "@/components/ui/Plate";
import { CarThumb } from "@/components/ui/CarThumb";
import { Button } from "@/components/ui/Button";
import { Composer } from "@/components/chat/Composer";
import { Row, Bubble, BubbleTime, SystemPill, Waveform } from "@/components/chat/Chat";
import { AddPartSheet } from "@/components/screens/AddPartSheet";
import { VoiceOverlay } from "@/components/screens/VoiceOverlay";
import { Icon } from "@/components/Icon";
import { useRole } from "@/lib/role";
import { getJob, JOBS, TIMELINE, TIMELINE_DONE, inr, type TimelineItem } from "@/data/mock";

function Item({ it }: { it: TimelineItem }) {
  switch (it.kind) {
    case "system":
      return <SystemPill text={it.text} tone={it.tone} icon={it.icon} />;
    case "text":
      return (
        <Row initials={it.by.initials} color={it.by.color}>
          <Bubble>
            <Txt className="text-[13px]" style={{ lineHeight: 19 }}>
              {it.text}
            </Txt>
            <BubbleTime>{it.time}</BubbleTime>
          </Bubble>
        </Row>
      );
    case "photo":
      return (
        <Row initials={it.by.initials} color={it.by.color}>
          <Bubble className="p-[6px]">
            <CarThumb width={150} height={104} radius={10} iconSize={30}>
              <View className="absolute bottom-[9px] left-[9px] rounded-[6px] bg-white/80 px-[7px] py-[3px]">
                <Txt className="font-bold text-[9px] text-[#8A8A93]" style={{ letterSpacing: 0.4 }}>
                  {it.tag}
                </Txt>
              </View>
            </CarThumb>
            <BubbleTime className="px-[4px]">{it.time}</BubbleTime>
          </Bubble>
        </Row>
      );
    case "voice":
      return (
        <Row initials={it.by.initials} color={it.by.color}>
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
        <Row initials={it.by.initials} color={it.by.color}>
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

export default function JobTimeline() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { role } = useRole();
  const job = getJob(id) ?? JOBS[0];
  const done = job.status === "COMPLETED";
  const feed = done ? TIMELINE_DONE : TIMELINE;
  const isManager = role !== "tech";

  const [sheet, setSheet] = useState(false);
  const [voice, setVoice] = useState(false);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F0EEF6]">
      {/* header */}
      <View className="bg-white px-[14px] pb-[12px] pt-[8px]" style={{ shadowColor: "#281E14", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Icon name="caret-left" size={21} weight="bold" />
          </Pressable>
          <CarThumb width={42} height={42} radius={11} iconSize={20} />
          <View className="flex-1">
            <Plate number={job.plate} scale={0.82} />
            <Txt className="mt-[3px] font-bold text-[13px]">
              {job.make} {job.model} · {job.year}
            </Txt>
          </View>
          <Badge label={job.status} tone={job.tone} />
        </View>

        {/* role-aware actions */}
        <View className="mt-[11px] flex-row" style={{ gap: 8 }}>
          {isManager ? (
            <>
              <Button label="Reassign" variant="ghost" icon="arrows-clockwise" iconWeight="bold" small className="flex-1" />
              <Button label="Customer" variant="ghost" icon="phone" iconWeight="bold" small className="flex-1" />
              <Button label="Invoice" variant="pur" icon="receipt" small className="flex-1" onPress={() => router.push(`/invoice/${job.id}`)} />
            </>
          ) : (
            <>
              <Button label="Pause" icon="pause" small className="flex-1 bg-[#FEF6E7]" textClassName="text-[#D97706]" />
              <Button label="Complete" variant="green" icon="check" small className="flex-1" />
            </>
          )}
        </View>
      </View>

      {/* feed */}
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 24, gap: 11 }}>
        {feed.map((it, i) => (
          <Item key={i} it={it} />
        ))}
      </ScrollView>

      <Composer
        placeholder={isManager ? "Message the team…" : "Add a note…"}
        smiley={!isManager}
        onAttach={() => setSheet(true)}
        onMic={() => setVoice(true)}
      />

      <AddPartSheet visible={sheet} onClose={() => setSheet(false)} />
      <VoiceOverlay visible={voice} onClose={() => setVoice(false)} />
    </SafeAreaView>
  );
}
