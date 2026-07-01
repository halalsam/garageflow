import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Txt } from "@/components/ui/Txt";
import { Badge } from "@/components/ui/Badge";
import { Plate } from "@/components/ui/Plate";
import { CarThumb } from "@/components/ui/CarThumb";
import { Icon } from "@/components/Icon";
import { cardShadow, type Tone } from "@/lib/theme";
import type { Job } from "@/types/api";
// Shared media header for the job-card family: the car thumbnail with the plate
// pinned top-left and an optional status badge top-right. Both JobCard and
// ActiveJobCard render through this so the header markup lives in one place.
export function JobCardMedia({
  height,
  plate,
  plateScale = 1,
  inset = 9,
  status,
  tone = "blue",
  uri,
  children,
}: {
  height: number;
  plate: string;
  plateScale?: number;
  inset?: number;
  status?: string;
  tone?: Tone;
  uri?: string;
  children?: React.ReactNode;
}) {
  return (
    <CarThumb height={height} uri={uri}>
      <View className="absolute" style={{ left: inset, top: inset }}>
        <Plate number={plate} scale={plateScale} />
      </View>
      {status ? (
        <View className="absolute" style={{ right: inset, top: inset }}>
          <Badge label={status} tone={tone} />
        </View>
      ) : null}
      {children}
    </CarThumb>
  );
}

// Full-width job list card (technician "My Jobs" list).
export function JobCard({ job }: { job: Job }) {
  return (
    <Pressable
      className="overflow-hidden rounded-card bg-white"
      style={cardShadow}
      onPress={() => router.push(`/job/${job.id}`)}
    >
      <JobCardMedia height={104} plate={job.plate} status={job.status} tone={job.tone} uri={job.photoUrl}>
        {job.bay ? (
          <View className="absolute bottom-[9px] left-[9px] rounded-[6px] bg-white/80 px-[7px] py-[3px]">
            <Txt className="font-bold text-[9px] text-[#8A8A93]" style={{ letterSpacing: 0.4 }}>
              {job.type} · {job.bay}
            </Txt>
          </View>
        ) : null}
      </JobCardMedia>
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
