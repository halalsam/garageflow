import { Pressable, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { fmtDuration } from "@/components/chat/useChat";

// Hands-free recording bar shown after the user swipes up to lock. The finger
// is no longer down, so the trash / send controls are explicit tap targets.
export function LockedRecordingBar({
  millis,
  onCancel,
  onSend,
}: {
  millis: number;
  onCancel: () => void;
  onSend: () => void;
}) {
  return (
    <View className="flex-1 flex-row items-center" style={{ gap: 9 }}>
      <Pressable
        onPress={onCancel}
        hitSlop={6}
        className="h-[48px] w-[48px] items-center justify-center rounded-full active:opacity-70"
      >
        <Icon name="trash" size={22} weight="regular" color="#EF4444" />
      </Pressable>

      <View className="flex-1 flex-row items-center rounded-full bg-[#F3F4F6] px-[16px] py-[11px]" style={{ gap: 8 }}>
        <Icon name="circle" size={11} color="#EF4444" weight="fill" />
        <Txt className="font-bold text-[16px] text-ink" style={{ fontVariant: ["tabular-nums"] }}>
          {fmtDuration(Math.floor(millis / 1000))}
        </Txt>
        <View className="flex-1 flex-row items-center justify-end" style={{ gap: 4 }}>
          <Icon name="lock-simple" size={13} weight="fill" color="#6C2BD9" />
          <Txt className="font-bold text-[12px]" style={{ color: "#6C2BD9" }}>
            locked
          </Txt>
        </View>
      </View>

      <Pressable
        onPress={onSend}
        className="h-[48px] w-[48px] items-center justify-center rounded-full bg-orange active:opacity-80"
      >
        <Icon name="paper-plane-tilt" size={20} weight="fill" color="#fff" />
      </Pressable>
    </View>
  );
}
