import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { Metric } from "@/components/ui/Metric";
import { RolePill } from "@/components/ui/RolePill";
import { ActiveJobsStrip } from "@/components/screens/ActiveJobsStrip";
import { TeamActivityCard } from "@/components/screens/TeamActivityCard";
import { Icon } from "@/components/Icon";
import { useDashboard, useJobs } from "@/lib/api/hooks/queries";
import { useAuth } from "@/lib/auth";
import { WORKSHOP, inr } from "@/lib/format";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data } = useDashboard();
  const { data: jobs } = useJobs();
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
          <Avatar initials={user?.initials ?? "?"} color={user?.color ?? "f"} />
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

        <View className="mt-[15px]">
          <ActiveJobsStrip jobs={jobs ?? []} />
        </View>

        <View className="mt-[15px] px-[18px]">
          <TeamActivityCard jobs={jobs ?? []} />
        </View>
      </ScrollView>
    </Screen>
  );
}
