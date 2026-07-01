import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { fmtDuration } from "@/components/chat/useChat";

// Inline "hold to record" status bar shown while the mic button is held.
// Turns red once the finger has slid far enough left to arm cancel.
export function RecordingBar({
  millis,
  canceling,
}: {
  millis: number;
  canceling: boolean;
}) {
  return (
    <View className="flex-1 flex-row items-center rounded-full bg-[#F3F4F6] px-[16px] py-[11px]" style={{ gap: 8 }}>
      <Icon name="circle" size={11} color="#EF4444" weight="fill" />
      <Txt className="font-bold text-[16px] text-ink" style={{ fontVariant: ["tabular-nums"] }}>
        {fmtDuration(Math.floor(millis / 1000))}
      </Txt>
      <View className="flex-1 flex-row items-center justify-end" style={{ gap: 4 }}>
        <Icon name="caret-left" size={13} weight="bold" color={canceling ? "#EF4444" : "#9CA3AF"} />
        <Txt className="font-bold text-[12px]" style={{ color: canceling ? "#EF4444" : "#9CA3AF" }}>
          {canceling ? "release to cancel" : "slide to cancel"}
        </Txt>
      </View>
    </View>
  );
}
