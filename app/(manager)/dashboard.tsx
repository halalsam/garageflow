import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { Metric } from "@/components/ui/Metric";
import { SearchBar } from "@/components/ui/SearchBar";
import { ActiveJobsStrip } from "@/components/screens/ActiveJobsStrip";
import { NextApprovalCard } from "@/components/screens/NextApprovalCard";
import { Icon } from "@/components/Icon";
import { useApprovals, useDashboard, useJobs } from "@/lib/api/hooks/queries";
import { useAuth } from "@/lib/auth";
import { WORKSHOP, inr } from "@/lib/format";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { data } = useDashboard();
  const { data: jobs } = useJobs();
  const { data: approvals } = useApprovals();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-[18px] pb-[10px] pt-[6px]">
        <View>
          <View className="flex-row items-center" style={{ gap: 6 }}>
            <Icon name="storefront" size={14} color="#FF5A1F" weight="fill" />
            <Txt className="font-medium text-[13px] text-muted">{WORKSHOP}</Txt>
          </View>
          <Txt className="font-black text-[24px]" style={{ letterSpacing: -0.5 }}>
            Good morning, {firstName}
          </Txt>
        </View>
        <Avatar initials={user?.initials ?? "?"} color={user?.color ?? "b"} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-[18px]">
          <Pressable onPress={() => router.push("/(manager)/jobs")}>
            <SearchBar placeholder="Search plate, customer, or phone…" />
          </Pressable>
        </View>

        <View className="mt-[16px] flex-row flex-wrap px-[18px]" style={{ gap: 10 }}>
          <View className="flex-row" style={{ gap: 10, width: "100%" }}>
            <Metric num={data ? String(data.jobsInProgress) : "—"} label="Jobs in progress" onPress={() => router.push("/(manager)/jobs")} />
            <Metric num={data ? String(data.awaitingApproval) : "—"} label="Awaiting my approval" bg="#F2ECFE" numColor="#6C2BD9" labelColor="#6C2BD9" onPress={() => router.push("/(manager)/approvals")} />
          </View>
          <View className="flex-row" style={{ gap: 10, width: "100%" }}>
            <Metric num={data ? String(data.dueForDelivery) : "—"} label="Due for delivery" />
            <Metric num={data?.outstanding === undefined ? "—" : inr(data.outstanding)} label="Outstanding" onPress={() => router.push("/(manager)/finances")} />
          </View>
        </View>

        <View className="mt-[24px]">
          <ActiveJobsStrip jobs={jobs ?? []} onSeeAll={() => router.push("/(manager)/jobs")} />
        </View>

        <View className="mt-[22px] px-[18px]">
          <NextApprovalCard approvals={approvals ?? []} />
        </View>
      </ScrollView>
    </Screen>
  );
}
