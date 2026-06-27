import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Metric } from "@/components/ui/Metric";
import { RolePill } from "@/components/ui/RolePill";
import { ActiveJobCard } from "@/components/screens/ActiveJobCard";
import { ActivityRow } from "@/components/screens/ActivityRow";
import { Icon } from "@/components/Icon";
import { useDashboard } from "@/lib/api/hooks/queries";
import { WORKSHOP, inr } from "@/lib/format";
export default function AdminDashboard() {
  const { data } = useDashboard();
  const num = (n?: number) => (n === undefined ? "—" : inr(n));
  return (
    <Screen>
      <View className="flex-row items-center justify-between px-[18px] pb-[10px] pt-[6px]">
        <View>
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <Icon name="storefront" size={14} color="#FF5A1F" weight="fill" />
            <Txt className="font-medium text-[13px] text-muted">{WORKSHOP}</Txt>
          </View>
          <Txt className="font-black text-[24px]" style={{ letterSpacing: -0.5 }}>
            Business overview
          </Txt>
        </View>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <RolePill icon="crown-simple" label="Owner" bg="#F2ECFE" color="#6C2BD9" small />
          <Avatar initials="VK" color="f" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-[18px]" style={{ gap: 10 }}>
          <View className="flex-row" style={{ gap: 10 }}>
            <Metric num={num(data?.revenueThisWeek)} label="Revenue this week" bg="#FFF6F2" numColor="#FF5A1F" onPress={() => router.push("/(admin)/finances")} />
            <Metric num={num(data?.outstanding)} label="Outstanding" onPress={() => router.push("/(admin)/finances")} />
          </View>
          <View className="flex-row" style={{ gap: 10 }}>
            <Metric num={data ? String(data.jobsInProgress) : "—"} label="Jobs in progress" />
            <Metric num={data ? String(data.awaitingApproval) : "—"} label="Awaiting approval" />
          </View>
        </View>

        <View className="mt-[15px] flex-row items-center justify-between px-[18px]">
          <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
            Active jobs
          </Txt>
          <Txt className="font-bold text-[13px] text-orange">See all</Txt>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-[10px]" contentContainerStyle={{ paddingHorizontal: 18, gap: 12 }}>
          <ActiveJobCard id="j1" plate="MH 02 AB 1234" title="Maruti Swift" techInitials="AP" techColor="a" techName="Arjun" progress={65} />
          <ActiveJobCard id="j2" plate="GJ 01 KK 0921" title="Hyundai Creta" techInitials="SV" techColor="d" techName="Suresh" progress={40} barColor="#F59E0B" />
        </ScrollView>

        <View className="mt-[15px] px-[18px]">
          <Txt className="mb-[10px] font-bold text-[15px]">Team activity</Txt>
          <Card className="px-[14px] py-[6px]">
            <ActivityRow first initials="AP" color="a" name="Arjun" task="Swift, brakes" label="ACTIVE" tone="blue" />
            <ActivityRow initials="SV" color="d" name="Suresh" task="Creta, AC" label="PART" tone="amber" />
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
