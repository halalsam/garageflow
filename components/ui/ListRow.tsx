import { Pressable, View } from "react-native";
import { Txt } from "./Txt";
import { Icon, type IconName } from "@/components/Icon";

// Settings-style row: colored icon tile, label, optional right value/chevron.
export function ListRow({
  icon,
  iconBg,
  iconColor,
  label,
  labelColor,
  right,
  chevron,
  divider = true,
  onPress,
}: {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  label: string;
  labelColor?: string;
  right?: React.ReactNode;
  chevron?: boolean;
  divider?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center py-[14px] ${divider ? "border-t border-line" : ""}`}
      style={{ gap: 13 }}
    >
      <View
        className="h-[38px] w-[38px] items-center justify-center rounded-tile"
        style={{ backgroundColor: iconBg }}
      >
        <Icon name={icon} size={19} color={iconColor} weight="fill" />
      </View>
      <Txt className="flex-1 font-bold text-[14px]" style={labelColor ? { color: labelColor } : undefined}>
        {label}
      </Txt>
      {right}
      {chevron ? <Icon name="caret-right" size={16} color="#9CA3AF" /> : null}
    </Pressable>
  );
}
