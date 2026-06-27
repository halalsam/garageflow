import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Icon, type IconName } from "@/components/Icon";

// A tappable card that opens a finance report (GST, expenses, …).
export function ReportLink({
  icon,
  tint,
  title,
  subtitle,
  onPress,
}: {
  icon: IconName;
  tint: { bg: string; fg: string };
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Card className="flex-row items-center p-[12px]" style={{ gap: 11 }} onPress={onPress}>
      <View className="h-[38px] w-[38px] items-center justify-center rounded-[11px]" style={{ backgroundColor: tint.bg }}>
        <Icon name={icon} size={18} weight="fill" color={tint.fg} />
      </View>
      <View className="flex-1">
        <Txt className="font-bold text-[13.5px]">{title}</Txt>
        <Txt className="mt-[3px] font-medium text-[12px] text-muted">{subtitle}</Txt>
      </View>
      <Icon name="caret-right" size={16} weight="bold" color="#C3C3CC" />
    </Card>
  );
}
