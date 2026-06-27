import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { SearchBar } from "@/components/ui/SearchBar";
import { ChipRow } from "@/components/ui/Chip";
import { JobCard } from "@/components/screens/JobCard";
import { Loading, ErrorState, EmptyState } from "@/components/ui/QueryState";
import { useJobs } from "@/lib/api/hooks/queries";
import { useAuth } from "@/lib/auth";

export default function TechJobs() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");
  const { data: jobs, isLoading, isError, refetch } = useJobs({ mine: true });

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-[18px] pb-[10px] pt-[6px]">
        <View>
          <Txt className="font-medium text-[13px] text-muted">Good morning</Txt>
          <Txt className="font-black text-[24px]" style={{ letterSpacing: -0.5 }}>
            {user?.name ?? "Technician"}
          </Txt>
        </View>
        <Avatar initials={user?.initials ?? "?"} color={user?.color ?? "a"} />
      </View>

      <View className="px-[18px]">
        <SearchBar placeholder="Search by plate number…" />
      </View>
      <View className="pb-[14px] pt-[14px]">
        <ChipRow
          className="pl-[18px]"
          items={[`All${jobs ? ` · ${jobs.length}` : ""}`, "In Progress", "Completed", "Today"]}
          value={filter.startsWith("All") ? `All${jobs ? ` · ${jobs.length}` : ""}` : filter}
          onChange={setFilter}
        />
      </View>

      {isLoading ? (
        <Loading label="Loading your jobs…" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !jobs || jobs.length === 0 ? (
        <EmptyState icon="wrench" text="No jobs assigned to you yet" />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 18, paddingTop: 4, gap: 12 }}
        >
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}
