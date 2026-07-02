import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";

// Small orange counter pill for unread notifications.
export function UnreadBadge({ count }: { count: number }) {
  return (
    <View className="min-w-[22px] items-center justify-center rounded-full bg-orange px-[7px] py-[2px]">
      <Txt className="font-bold text-[11px] text-white">{count > 99 ? "99+" : count}</Txt>
    </View>
  );
}
