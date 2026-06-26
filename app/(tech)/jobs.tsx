import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Plate } from "@/components/ui/Plate";
import { CarThumb } from "@/components/ui/CarThumb";
import { SearchBar } from "@/components/ui/SearchBar";
import { ChipRow } from "@/components/ui/Chip";
import { Icon } from "@/components/Icon";
import { cardShadow } from "@/lib/theme";
import { JOBS, type Job } from "@/data/mock";

function JobCard({ job }: { job: Job }) {
  return (
    <Pressable
      className="overflow-hidden rounded-card bg-white"
      style={cardShadow}
      onPress={() => router.push(`/job/${job.id}`)}
    >
      <CarThumb height={104}>
        <View className="absolute left-[9px] top-[9px]">
          <Plate number={job.plate} />
        </View>
        <View className="absolute right-[9px] top-[9px]">
          <Badge label={job.status} tone={job.tone} />
        </View>
        {job.bay ? (
          <View className="absolute bottom-[9px] left-[9px] rounded-[6px] bg-white/80 px-[7px] py-[3px]">
            <Txt className="font-bold text-[9px] text-[#8A8A93]" style={{ letterSpacing: 0.4 }}>
              {job.type} · {job.bay}
            </Txt>
          </View>
        ) : null}
      </CarThumb>
      <View className="p-[13px]">
        <View className="flex-row items-center justify-between">
          <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
            {job.make} {job.model} · {job.year}
          </Txt>
          {job.priority ? (
            <View
              className="rounded-full px-[10px] py-[4px]"
              style={{ backgroundColor: job.priority === "HIGH" ? "#FEF6E7" : "#F1F1F4" }}
            >
              <Txt className="font-bold text-[11px]" style={{ color: job.priority === "HIGH" ? "#D97706" : "#6B7280" }}>
                {job.priority}
              </Txt>
            </View>
          ) : null}
        </View>
        <View className="mt-[4px] flex-row items-center" style={{ gap: 5 }}>
          <Icon name="user-circle" size={15} color="#6B7280" weight="fill" />
          <Txt className="font-medium text-[13px] text-muted">{job.customer.name}</Txt>
        </View>
        {job.complaint ? (
          <Txt className="mt-[7px] font-medium text-[13px] text-[#4B5563]">{job.complaint}</Txt>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function TechJobs() {
  const [filter, setFilter] = useState("All · 4");
  return (
    <Screen>
      <View className="flex-row items-center justify-between px-[18px] pb-[10px] pt-[6px]">
        <View>
          <Txt className="font-medium text-[13px] text-muted">Good morning</Txt>
          <Txt className="font-black text-[24px]" style={{ letterSpacing: -0.5 }}>
            Arjun Patel
          </Txt>
        </View>
        <Avatar initials="AP" color="a" />
      </View>

      <View className="px-[18px]">
        <SearchBar placeholder="Search by plate number…" />
      </View>
      <View className="mt-[12px]">
        <ChipRow
          className="pl-[18px]"
          items={["All · 4", "In Progress", "Completed", "Today"]}
          value={filter}
          onChange={setFilter}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 18, paddingTop: 13, gap: 12 }}
      >
        {JOBS.map((j) => (
          <JobCard key={j.id} job={j} />
        ))}
      </ScrollView>
    </Screen>
  );
}
