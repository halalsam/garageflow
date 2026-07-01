import { Pressable, ScrollView, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { ActiveJobCard } from "@/components/screens/ActiveJobCard";
import type { Job } from "@/types/api";

const DONE = ["COMPLETED", "DELIVERED"];

// Horizontal rail of the workshop's live jobs. Hides itself when nothing is
// on the floor.
export function ActiveJobsStrip({ jobs, onSeeAll }: { jobs: Job[]; onSeeAll?: () => void }) {
  const active = jobs.filter((j) => !DONE.includes(j.status)).slice(0, 8);
  if (active.length === 0) return null;

  return (
    <View>
      <View className="flex-row items-center justify-between px-[18px]">
        <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
          Active jobs
        </Txt>
        {onSeeAll ? (
          <Pressable onPress={onSeeAll} hitSlop={8}>
            <Txt className="font-bold text-[13px] text-orange">See all</Txt>
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-[10px]"
        contentContainerStyle={{ paddingHorizontal: 18, gap: 12 }}
      >
        {active.map((job) => (
          <ActiveJobCard
            key={job.id}
            id={job.id}
            plate={job.plate}
            title={`${job.make} ${job.model}`}
            techInitials={job.tech?.initials ?? "?"}
            techColor={job.tech?.color ?? "a"}
            techName={job.tech?.name ?? "Unassigned"}
            progress={job.progress ?? 0}
            status={job.status}
            tone={job.tone}
            barColor={job.tone === "amber" ? "#F59E0B" : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
}
