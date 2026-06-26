import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Txt } from "./Txt";
import { Icon, type IconName } from "@/components/Icon";

// App header. Use either `title` (+optional back) or pass custom `left`/`right`.
export function TopBar({
  title,
  back,
  right,
  left,
  className = "",
}: {
  title?: string;
  back?: boolean;
  right?: React.ReactNode;
  left?: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`flex-row items-center justify-between px-[18px] pb-[10px] pt-[6px] ${className}`}>
      <View className="flex-row items-center" style={{ gap: 8 }}>
        {back ? (
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Icon name="caret-left" size={22} weight="bold" />
          </Pressable>
        ) : null}
        {left}
        {title ? <Txt className="font-black text-[24px]" style={{ letterSpacing: -0.5 }}>{title}</Txt> : null}
      </View>
      {right}
    </View>
  );
}

export function HeaderIcon({ name, onPress }: { name: IconName; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <Icon name={name} size={22} color="#6B7280" />
    </Pressable>
  );
}
