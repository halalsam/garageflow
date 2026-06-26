import { View } from "react-native";
import { Txt } from "./Txt";
import { AVATAR } from "@/lib/theme";

type Props = {
  initials: string;
  color?: keyof typeof AVATAR | string; // "a".."f" or a hex
  size?: number;
};

export function Avatar({ initials, color = "a", size = 38 }: Props) {
  const bg = AVATAR[color as keyof typeof AVATAR] ?? (color as string);
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      <Txt className="font-bold text-white" style={{ fontSize: size * 0.37 }}>
        {initials}
      </Txt>
    </View>
  );
}
