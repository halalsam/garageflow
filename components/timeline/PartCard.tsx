import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { Row, Bubble, BubbleTime } from "@/components/chat/Chat";
import { inr } from "@/lib/format";
import type { JobEvent } from "@/types/api";

// A part added to the job (server-generated). Always rendered left as a tinted
// card with the part name, quantity and line price (rupees).
export function PartCard({ ev }: { ev: Extract<JobEvent, { type: "PART_ADDED" }> }) {
  const { partName, qty, price } = ev.payload;
  return (
    <Row initials={ev.by?.initials ?? "·"} color={ev.by?.color ?? "a"} name={ev.by?.name} own={false}>
      <Bubble className="border border-[#FFE0D2] bg-[#FFF6F2]" style={{ width: 230 }}>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <View className="h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-orange">
            <Icon name="package" size={15} color="#fff" weight="fill" />
          </View>
          <View className="flex-1">
            <Txt className="font-bold text-[13px]">{partName}</Txt>
            <Txt className="font-medium text-[11px] text-muted">
              Qty {qty} · {inr(price)}
            </Txt>
          </View>
        </View>
        <BubbleTime>{ev.time}</BubbleTime>
      </Bubble>
    </Row>
  );
}
