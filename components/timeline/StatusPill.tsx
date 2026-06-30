import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import type { JobEvent } from "@/types/api";

// A centered status-change marker: "IN PROGRESS → REVIEW".
export function StatusPill({ ev }: { ev: Extract<JobEvent, { type: "STATUS_CHANGE" }> }) {
  const { from, to } = ev.payload;
  return (
    <View
      className="flex-row items-center self-center rounded-full bg-[#EEF2FF] px-[13px] py-[6px]"
      style={{ gap: 6 }}
    >
      <Txt className="font-bold text-[10.5px] text-[#6366F1]">{from}</Txt>
      <Icon name="arrow-right" size={11} color="#6366F1" weight="bold" />
      <Txt className="font-bold text-[10.5px] text-[#6366F1]">{to}</Txt>
    </View>
  );
}
