import { View } from "react-native";
import { Txt } from "./Txt";
import { Icon, type IconName } from "@/components/Icon";

// Pill with icon + label, e.g. Manager / Owner / Technician.
export function RolePill({
  icon,
  label,
  bg,
  color,
  small,
}: {
  icon: IconName;
  label: string;
  bg: string;
  color: string;
  small?: boolean;
}) {
  return (
    <View
      className="flex-row items-center self-start rounded-full"
      style={{ backgroundColor: bg, paddingVertical: small ? 5 : 6, paddingHorizontal: small ? 10 : 13, gap: 6 }}
    >
      <Icon name={icon} size={small ? 12 : 14} color={color} weight="fill" />
      <Txt className="font-bold" style={{ color, fontSize: small ? 11 : 12 }}>
        {label}
      </Txt>
    </View>
  );
}
