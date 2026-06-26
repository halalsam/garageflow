import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Metric } from "@/components/ui/Metric";
import { SearchBar } from "@/components/ui/SearchBar";
import { CarThumb } from "@/components/ui/CarThumb";
import { ActiveJobCard } from "@/components/screens/ActiveJobCard";
import { Icon } from "@/components/Icon";
import { WORKSHOP } from "@/data/mock";

export default function ManagerDashboard() {
  return (
    <Screen>
      <View className="flex-row items-center justify-between px-[18px] pb-[10px] pt-[6px]">
        <View>
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <Icon name="storefront" size={14} color="#FF5A1F" weight="fill" />
            <Txt className="font-medium text-[13px] text-muted">{WORKSHOP}</Txt>
          </View>
          <Txt className="font-black text-[24px]" style={{ letterSpacing: -0.5 }}>
            Good morning, Priya
          </Txt>
        </View>
        <Avatar initials="PS" color="b" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-[18px]">
          <SearchBar placeholder="Search plate, customer, or phone…" />
        </View>

        <View className="mt-[16px] flex-row flex-wrap px-[18px]" style={{ gap: 10 }}>
          <View className="flex-row" style={{ gap: 10, width: "100%" }}>
            <Metric num="8" label="Jobs in progress" />
            <Metric num="3" label="Awaiting my approval" bg="#F2ECFE" numColor="#6C2BD9" labelColor="#6C2BD9" />
          </View>
          <View className="flex-row" style={{ gap: 10, width: "100%" }}>
            <Metric num="4" label="Due for delivery" />
            <Metric num="₹1.2L" label="Outstanding" />
          </View>
        </View>

        <View className="mt-[24px] flex-row items-center justify-between px-[18px]">
          <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
            Active jobs
          </Txt>
          <Txt className="font-bold text-[13px] text-orange">See all</Txt>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-[10px]"
          contentContainerStyle={{ paddingHorizontal: 18, gap: 12 }}
        >
          <ActiveJobCard id="j1" plate="MH 02 AB 1234" title="Maruti Swift" techInitials="AP" techColor="a" techName="Arjun Patel" progress={65} status="IN PROGRESS" tone="blue" />
          <ActiveJobCard id="j2" plate="GJ 01 KK 0921" title="Hyundai Creta" techInitials="SV" techColor="d" techName="Suresh V." progress={40} status="AWAITING PART" tone="amber" barColor="#F59E0B" />
        </ScrollView>

        <View className="mt-[22px] px-[18px]">
          <Card className="flex-row items-center p-[12px]" style={{ gap: 12 }} onPress={() => router.push("/approval/j3")}>
            <CarThumb width={46} height={46} radius={11} iconSize={21} />
            <View className="flex-1">
              <Txt className="font-bold text-[14px]">Tata Nexon · ₹14,200</Txt>
              <Txt className="mt-[4px] font-medium text-[13px] text-muted">Needs my approval</Txt>
            </View>
            <Badge label="REVIEW" tone="purple" />
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
