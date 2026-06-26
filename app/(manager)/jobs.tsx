import { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { TopBar, HeaderIcon } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plate } from "@/components/ui/Plate";
import { CarThumb } from "@/components/ui/CarThumb";
import { Avatar } from "@/components/ui/Avatar";
import { ChipRow } from "@/components/ui/Chip";
import { Icon } from "@/components/Icon";

const ROWS = [
  { id: "j1", plate: "MH 02 AB 1234", model: "Maruti Swift", status: "IN PROGRESS", tone: "blue" as const, tech: { i: "AP", c: "a" } },
  { id: "j2", plate: "GJ 01 KK 0921", model: "Hyundai Creta", status: "AWAITING", tone: "amber" as const, tech: { i: "SV", c: "d" } },
  { id: "j3", plate: "DL 3C AT 7788", model: "Tata Nexon", status: "REVIEW", tone: "purple" as const, tech: null },
  { id: "j4", plate: "KA 05 MN 4521", model: "Honda City", status: "COMPLETED", tone: "green" as const, tech: { i: "Rn", c: "e" } },
];

export default function ManagerJobs() {
  const [filter, setFilter] = useState("All · 18");
  return (
    <Screen>
      <TopBar title="All Jobs" right={<HeaderIcon name="sliders" />} />
      <View className="px-[18px]">
        <ChipRow items={["All · 18", "In Progress", "Review", "Done"]} value={filter} onChange={setFilter} />
      </View>

      <View className="mt-[12px] flex-row items-center px-[18px]" style={{ gap: 8 }}>
        <Txt className="font-bold text-[11px] text-faint">TECH</Txt>
        <Avatar initials="AP" color="a" size={28} />
        <Avatar initials="SV" color="d" size={28} />
        <Avatar initials="Rn" color="e" size={28} />
        <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-line">
          <Txt className="font-bold text-[11px] text-muted">+2</Txt>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 13, gap: 10, paddingBottom: 24 }}>
        {ROWS.map((r) => (
          <Card key={r.id} className="flex-row items-center p-[11px]" style={{ gap: 12 }} onPress={() => router.push(`/job/${r.id}`)}>
            <CarThumb width={50} height={50} radius={12} iconSize={22} />
            <View className="flex-1">
              <Plate number={r.plate} scale={0.82} />
              <Txt className="mt-[5px] font-bold text-[13px]">{r.model}</Txt>
            </View>
            <View className="items-center" style={{ gap: 6 }}>
              <Badge label={r.status} tone={r.tone} />
              {r.tech ? (
                <Avatar initials={r.tech.i} color={r.tech.c} size={28} />
              ) : (
                <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-line">
                  <Icon name="user" size={14} weight="bold" color="#9CA3AF" />
                </View>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
