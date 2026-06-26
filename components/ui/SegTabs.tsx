import { Pressable, View } from "react-native";
import { Txt } from "./Txt";
import { cardShadow } from "@/lib/theme";

// Segmented control (Parts / Services).
export function SegTabs({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View className="flex-row rounded-[12px] bg-[#EFEFF1] p-[4px]" style={{ gap: 8 }}>
      {items.map((it) => {
        const on = it === value;
        return (
          <Pressable
            key={it}
            onPress={() => onChange(it)}
            className={`flex-1 items-center rounded-[9px] py-[9px] ${on ? "bg-white" : ""}`}
            style={on ? cardShadow : undefined}
          >
            <Txt className={`font-bold text-[13px] ${on ? "text-ink" : "text-muted"}`}>{it}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}
