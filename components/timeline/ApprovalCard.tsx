import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import type { JobEvent } from "@/types/api";

// A centered approval marker. Approve is green, decline is red; the body text
// comes from the server ("Approved · released to technician").
export function ApprovalCard({ ev }: { ev: Extract<JobEvent, { type: "APPROVAL" }> }) {
  const declined = ev.payload?.decision === "decline";
  const bg = declined ? "#FEECEC" : "#E7F8EE";
  const fg = declined ? "#DC2626" : "#16A34A";
  return (
    <View
      className="flex-row items-center self-center rounded-full px-[13px] py-[6px]"
      style={{ backgroundColor: bg, gap: 5 }}
    >
      <Icon name={declined ? "x-circle" : "check-circle"} size={13} color={fg} weight="fill" />
      <Txt className="font-bold text-[10.5px]" style={{ color: fg }}>
        {ev.body ?? (declined ? "Estimate declined" : "Estimate approved")}
      </Txt>
    </View>
  );
}
