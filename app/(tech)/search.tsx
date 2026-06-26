import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plate } from "@/components/ui/Plate";
import { CarThumb } from "@/components/ui/CarThumb";
import { Icon } from "@/components/Icon";

const RESULTS = [
  { id: "j1", plate: "MH 02 AB 1234", title: "Maruti Swift · 2021", status: "ACTIVE", tone: "blue" as const },
  { id: "r2", plate: "MH 02 AB 1299", title: "Tata Nexon · 2020", status: "DONE", tone: "green" as const },
];

export default function PlateSearch() {
  return (
    <Screen>
      <TopBar title="Search" back />
      <View className="px-[18px]">
        <View className="flex-row items-center rounded-full border-2 border-orange bg-white px-[18px] py-[13px]" style={{ gap: 10 }}>
          <Icon name="search" size={19} weight="bold" color="#FF5A1F" />
          <Txt className="font-bold text-[14px]" style={{ fontFamily: "monospace", letterSpacing: 1 }}>
            MH 02 AB 12
            <Txt className="text-orange" style={{ fontFamily: "monospace" }}>
              |
            </Txt>
          </Txt>
        </View>
        <Txt className="mt-[16px] font-bold text-[11px] text-faint" style={{ letterSpacing: 0.5 }}>
          2 MATCHES
        </Txt>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 8, gap: 10 }}>
        {RESULTS.map((r) => (
          <Card
            key={r.id}
            className="flex-row items-center p-[11px]"
            style={{ gap: 14 }}
            onPress={() => router.push(`/job/${r.id === "j1" ? "j1" : "j4"}`)}
          >
            <CarThumb width={62} height={62} radius={13} iconSize={26} />
            <View className="flex-1">
              <Plate number={r.plate} />
              <Txt className="mt-[6px] font-bold text-[15px]">{r.title}</Txt>
            </View>
            <Badge label={r.status} tone={r.tone} />
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
