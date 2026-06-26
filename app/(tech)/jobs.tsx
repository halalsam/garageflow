import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { SearchBar } from "@/components/ui/SearchBar";
import { ChipRow } from "@/components/ui/Chip";
import { JobCard } from "@/components/screens/JobCard";
import { JOBS } from "@/data/mock";

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
