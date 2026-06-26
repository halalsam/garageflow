import { View } from "react-native";
import { Txt } from "./Txt";
import { cardShadow } from "@/lib/theme";

export function Metric({
  num,
  label,
  bg,
  numColor,
  labelColor,
}: {
  num: string;
  label: string;
  bg?: string;
  numColor?: string;
  labelColor?: string;
}) {
  return (
    <View
      className="flex-1 rounded-[16px] bg-white p-[14px]"
      style={[cardShadow, bg ? { backgroundColor: bg } : null]}
    >
      <Txt className="font-black text-[22px]" style={{ letterSpacing: -0.5, color: numColor }}>
        {num}
      </Txt>
      <Txt
        className="font-bold text-[11px] text-muted mt-[3px]"
        style={{ lineHeight: 14, color: labelColor }}
      >
        {label}
      </Txt>
    </View>
  );
}
