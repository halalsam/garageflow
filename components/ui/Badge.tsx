import { View } from "react-native";
import { Txt } from "./Txt";
import { TONE, type Tone } from "@/lib/theme";

// Small status pill, e.g. IN PROGRESS / APPROVED / 3 PENDING.
export function Badge({ label, tone = "gray" }: { label: string; tone?: Tone }) {
  const t = TONE[tone];
  return (
    <View className="rounded-full px-[10px] py-[4px]" style={{ backgroundColor: t.bg }}>
      <Txt className="font-bold" style={{ color: t.tx, fontSize: 10, letterSpacing: 0.2 }}>
        {label}
      </Txt>
    </View>
  );
}
