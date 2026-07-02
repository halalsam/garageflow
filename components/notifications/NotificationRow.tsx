import { Pressable, View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Icon, type IconName } from "@/components/Icon";
import { agoLabel } from "@/lib/format";
import type { AppNotification } from "@/types/api";

// Icon + tint per push type (see the backend's PushData.type).
const TYPE_META: Record<string, { icon: IconName; bg: string; color: string }> = {
  chat: { icon: "bell", bg: "#FEF6E7", color: "#D97706" },
  estimate_submitted: { icon: "receipt", bg: "#F2ECFE", color: "#6C2BD9" },
  estimate_approved: { icon: "check-circle", bg: "#EAF8F0", color: "#16A34A" },
  estimate_declined: { icon: "x-circle", bg: "#FDECEC", color: "#DC2626" },
  job_assigned: { icon: "wrench", bg: "#FFF6F2", color: "#FF5A1F" },
  job_completed: { icon: "seal-check", bg: "#EAF8F0", color: "#16A34A" },
  job_delivered: { icon: "car-profile", bg: "#EAF2FF", color: "#2563EB" },
};
const FALLBACK = TYPE_META.chat;

// One inbox entry. Unread rows get a dot; tapping deep-links via data.jobCode.
export function NotificationRow({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress?: () => void;
}) {
  const meta = TYPE_META[notification.data?.type ?? ""] ?? FALLBACK;
  return (
    <Pressable
      className="flex-row rounded-card bg-white p-[13px]"
      style={{ gap: 12, opacity: notification.read ? 0.75 : 1 }}
      onPress={onPress}
    >
      <View
        className="h-[38px] w-[38px] items-center justify-center rounded-tile"
        style={{ backgroundColor: meta.bg }}
      >
        <Icon name={meta.icon} size={19} color={meta.color} weight="fill" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <Txt className="flex-1 font-bold text-[14px]" numberOfLines={1}>
            {notification.title}
          </Txt>
          <Txt className="font-medium text-[11px] text-faint">{agoLabel(notification.atISO)}</Txt>
          {!notification.read ? (
            <View className="h-[8px] w-[8px] rounded-full bg-orange" />
          ) : null}
        </View>
        <Txt className="mt-[2px] font-medium text-[13px] text-muted" numberOfLines={2}>
          {notification.body}
        </Txt>
      </View>
    </Pressable>
  );
}
