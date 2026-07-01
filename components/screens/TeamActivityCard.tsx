import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { ActivityRow } from "@/components/screens/ActivityRow";
import type { Job } from "@/types/api";

const DONE = ["COMPLETED", "DELIVERED"];

// Who is working on what right now, derived from assigned in-flight jobs.
// Hides when nobody has an active assignment.
export function TeamActivityCard({ jobs }: { jobs: Job[] }) {
  const active = jobs
    .filter((j) => j.tech && !DONE.includes(j.status))
    .slice(0, 5);
  if (active.length === 0) return null;

  return (
    <View>
      <Txt className="mb-[10px] font-bold text-[15px]">Team activity</Txt>
      <Card className="px-[14px] py-[6px]">
        {active.map((job, i) => (
          <ActivityRow
            key={job.id}
            first={i === 0}
            initials={job.tech!.initials}
            color={job.tech!.color}
            name={job.tech!.name.split(" ")[0]}
            task={`${job.make} ${job.model}`}
            label={job.status}
            tone={job.tone}
          />
        ))}
      </Card>
    </View>
  );
}
