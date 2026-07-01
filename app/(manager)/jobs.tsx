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
import { Loading, ErrorState, EmptyState } from "@/components/ui/QueryState";
import { useJobs } from "@/lib/api/hooks/queries";

// Which statuses each filter chip shows; "All" bypasses the lookup.
const FILTER_STATUSES: Record<string, string[]> = {
  "In Progress": ["IN PROGRESS", "AWAITING PART"],
  Review: ["REVIEW"],
  Done: ["COMPLETED", "DELIVERED"],
};

export default function ManagerJobs() {
  const [filter, setFilter] = useState("All");
  const { data: jobs, isLoading, isError, refetch } = useJobs();
  const count = jobs?.length ?? 0;
  const shown = (jobs ?? []).filter(
    (j) => filter.startsWith("All") || FILTER_STATUSES[filter]?.includes(j.status),
  );

  return (
    <Screen>
      <TopBar
        title="All Jobs"
        right={<HeaderIcon name="plus" onPress={() => router.push("/job/new")} />}
      />
      <View className="px-[18px]">
        <ChipRow
          items={[`All · ${count}`, "In Progress", "Review", "Done"]}
          value={filter.startsWith("All") ? `All · ${count}` : filter}
          onChange={setFilter}
        />
      </View>

      {isLoading ? (
        <Loading label="Loading jobs…" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : shown.length === 0 ? (
        <EmptyState icon="wrench" text={filter.startsWith("All") ? "No jobs yet" : `No ${filter.toLowerCase()} jobs`} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 13, gap: 10, paddingBottom: 24 }}>
          {shown.map((j) => (
            <Card key={j.id} className="flex-row items-center p-[11px]" style={{ gap: 12 }} onPress={() => router.push(`/job/${j.id}`)}>
              <CarThumb width={50} height={50} radius={12} iconSize={22} />
              <View className="flex-1">
                <Plate number={j.plate} scale={0.82} />
                <Txt className="mt-[5px] font-bold text-[13px]">
                  {j.make} {j.model}
                </Txt>
              </View>
              <View className="items-center" style={{ gap: 6 }}>
                <Badge label={j.status} tone={j.tone} />
                {j.tech ? (
                  <Avatar initials={j.tech.initials} color={j.tech.color} size={28} />
                ) : (
                  <View className="h-[28px] w-[28px] items-center justify-center rounded-full bg-line">
                    <Icon name="user" size={14} weight="bold" color="#9CA3AF" />
                  </View>
                )}
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}
