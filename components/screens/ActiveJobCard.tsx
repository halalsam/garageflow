import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Txt } from "@/components/ui/Txt";
import { Badge } from "@/components/ui/Badge";
import { Plate } from "@/components/ui/Plate";
import { CarThumb } from "@/components/ui/CarThumb";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cardShadow, type Tone } from "@/lib/theme";

export function ActiveJobCard({
  id,
  plate,
  title,
  techInitials,
  techColor,
  techName,
  progress,
  status,
  tone,
  barColor,
}: {
  id: string;
  plate: string;
  title: string;
  techInitials: string;
  techColor: string;
  techName: string;
  progress: number;
  status?: string;
  tone?: Tone;
  barColor?: string;
}) {
  return (
    <Pressable
      className="overflow-hidden rounded-card bg-white"
      style={[cardShadow, { width: 236 }]}
      onPress={() => router.push(`/job/${id}`)}
    >
      <CarThumb height={88}>
        <View className="absolute left-[8px] top-[8px]">
          <Plate number={plate} scale={0.82} />
        </View>
        {status ? (
          <View className="absolute right-[8px] top-[8px]">
            <Badge label={status} tone={tone ?? "blue"} />
          </View>
        ) : null}
      </CarThumb>
      <View className="p-[12px]">
        <Txt className="font-bold text-[15px]">{title}</Txt>
        <View className="mt-[10px] flex-row items-center" style={{ gap: 6 }}>
          <Avatar initials={techInitials} color={techColor} size={28} />
          <Txt className="font-bold text-[12px]">{techName}</Txt>
          <Txt className="font-bold text-[12px] text-muted">· {progress}%</Txt>
        </View>
        <View className="mt-[6px]">
          <ProgressBar value={progress} color={barColor} />
        </View>
      </View>
    </Pressable>
  );
}
