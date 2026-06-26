import { Pressable, View } from "react-native";
import { Txt } from "./Txt";

export function Stepper({
  value,
  onChange,
  muted,
}: {
  value: number;
  onChange?: (v: number) => void;
  muted?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center overflow-hidden rounded-[10px] ${
        muted ? "bg-white border-[1.5px] border-[#E7E7EA]" : "bg-line"
      }`}
    >
      <Pressable
        className="h-[30px] w-[30px] items-center justify-center"
        onPress={() => onChange?.(Math.max(0, value - 1))}
      >
        <Txt className="font-bold text-[16px] text-orange">−</Txt>
      </Pressable>
      <Txt className={`w-[26px] text-center font-bold text-[13px] ${value === 0 ? "text-faint" : "text-ink"}`}>
        {value}
      </Txt>
      <Pressable
        className="h-[30px] w-[30px] items-center justify-center"
        onPress={() => onChange?.(value + 1)}
      >
        <Txt className="font-bold text-[16px] text-orange">+</Txt>
      </Pressable>
    </View>
  );
}
