import { Pressable, TextInput, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { inr } from "@/lib/format";
import type { JobLine } from "./useNewJob";

// One editable estimate line on the New Job card: label + note (from the
// catalogue or hand-typed), an editable ₹ amount, and a remove control.
export function LineItemRow({
  line,
  first,
  onChangeAmount,
  onRemove,
}: {
  line: JobLine;
  first?: boolean;
  onChangeAmount: (amount: number) => void;
  onRemove: () => void;
}) {
  return (
    <View className={`flex-row items-center justify-between py-[10px] ${first ? "" : "border-t border-line"}`}>
      <View className="flex-1 pr-[10px]">
        <Txt className="font-bold text-[13px]">{line.label}</Txt>
        {line.note ? <Txt className="mt-[3px] font-medium text-[11px] text-muted">{line.note}</Txt> : null}
      </View>
      <View className="flex-row items-center" style={{ gap: 8 }}>
        <View className="flex-row items-center rounded-[10px] bg-line px-[10px]">
          <Txt className="font-bold text-[13px] text-muted">₹</Txt>
          <TextInput
            className="min-w-[56px] py-[7px] text-right font-bold text-[13px] text-ink"
            keyboardType="number-pad"
            value={line.amount ? String(line.amount) : ""}
            placeholder="0"
            placeholderTextColor="#C3C3CC"
            onChangeText={(v) => onChangeAmount(Math.round(Number(v.replace(/[^0-9]/g, "")) || 0))}
          />
        </View>
        <Pressable hitSlop={8} onPress={onRemove}>
          <Icon name="x-circle" size={20} weight="fill" color="#D9D9DF" />
        </Pressable>
      </View>
    </View>
  );
}
