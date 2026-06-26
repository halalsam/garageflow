import { Pressable, ScrollView, View } from "react-native";
import { Txt } from "./Txt";
import { Icon, type IconName } from "@/components/Icon";
import { cardShadow } from "@/lib/theme";

export function Chip({
  label,
  active,
  icon,
  onPress,
}: {
  label: string;
  active?: boolean;
  icon?: IconName;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center rounded-full px-[15px] py-[8px] ${
        active ? "bg-ink" : "bg-white"
      }`}
      style={active ? undefined : cardShadow}
    >
      {icon ? (
        <Icon name={icon} size={14} weight="fill" color={active ? "#fff" : "#6B7280"} />
      ) : null}
      <Txt
        className={`font-bold text-[12px] ${active ? "text-white" : "text-muted"} ${icon ? "ml-[6px]" : ""}`}
      >
        {label}
      </Txt>
    </Pressable>
  );
}

// Horizontal scrolling row of chips.
export function ChipRow({
  items,
  value,
  onChange,
  className = "",
}: {
  items: string[];
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerStyle={{ gap: 8, paddingRight: 18 }}
    >
      {items.map((it) => (
        <Chip key={it} label={it} active={value === it} onPress={() => onChange?.(it)} />
      ))}
    </ScrollView>
  );
}

// Static row (no scroll) — used inside padded sections.
export function ChipGroup({ children }: { children: React.ReactNode }) {
  return <View className="flex-row" style={{ gap: 8 }}>{children}</View>;
}
