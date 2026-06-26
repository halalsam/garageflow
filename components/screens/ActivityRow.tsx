import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

// A single "Team activity" row: who is doing what, with a status badge.
export function ActivityRow({
  initials,
  color,
  name,
  task,
  label,
  tone,
  first,
}: {
  initials: string;
  color: string;
  name: string;
  task: string;
  label: string;
  tone: "blue" | "amber";
  first?: boolean;
}) {
  return (
    <View className={`flex-row items-center py-[11px] ${first ? "" : "border-t border-line"}`} style={{ gap: 13 }}>
      <Avatar initials={initials} color={color} size={28} />
      <Txt className="flex-1 font-bold text-[13px]">
        {name} — <Txt className="font-medium text-[13px] text-muted">{task}</Txt>
      </Txt>
      <Badge label={label} tone={tone} />
    </View>
  );
}
