import { ScrollView, View } from "react-native";
import Constants from "expo-constants";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { TopBar, HeaderIcon } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Metric } from "@/components/ui/Metric";
import { RolePill } from "@/components/ui/RolePill";
import { ListRow } from "@/components/ui/ListRow";
import { UnreadBadge } from "@/components/notifications/UnreadBadge";
import { useAuth } from "@/lib/auth";
import { useNotifications } from "@/lib/api/hooks/queries";
import { WORKSHOP } from "@/lib/format";
import type { Role } from "@/types/api";

// Per-role metric placeholders + badge tint (identity comes from the auth user).
const ROLE_META: Record<Role, { bg: string; color: string; metrics: { num: string; label: string }[] }> = {
  tech: {
    bg: "#FFF6F2",
    color: "#FF5A1F",
    metrics: [
      { num: "4", label: "Jobs assigned" },
      { num: "2", label: "In progress" },
    ],
  },
  manager: {
    bg: "#F2ECFE",
    color: "#6C2BD9",
    metrics: [
      { num: "12", label: "Jobs today" },
      { num: "3", label: "Pending approvals" },
    ],
  },
  admin: {
    bg: "#F2ECFE",
    color: "#6C2BD9",
    metrics: [
      { num: "₹2.4L", label: "Revenue this week" },
      { num: "5", label: "Team members" },
    ],
  },
};

export function ProfileScreen() {
  const { user, role, logout } = useAuth();
  const meta = ROLE_META[role];
  const unread = useNotifications().data?.unread ?? 0;

  const signOut = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <Screen>
      <TopBar title="Profile" right={<HeaderIcon name="gear-six" />} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}>
        <Card className="items-center" style={{ gap: 7 }}>
          <Avatar initials={user?.initials ?? "?"} color={user?.color ?? "a"} size={72} />
          <View className="items-center">
            <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
              {user?.name ?? "—"}
            </Txt>
            <Txt className="mt-[4px] font-medium text-[13px] text-muted">{WORKSHOP}</Txt>
          </View>
          {user ? <RolePill icon={user.roleIcon} label={user.roleLabel} bg={meta.bg} color={meta.color} /> : null}
        </Card>

        <View className="mt-[10px] flex-row" style={{ gap: 10 }}>
          {meta.metrics.map((m) => (
            <Metric key={m.label} num={m.num} label={m.label} />
          ))}
        </View>

        <Card className="mt-[10px] px-[16px] py-[4px]">
          <ListRow
            icon="bell"
            iconBg="#FEF6E7"
            iconColor="#D97706"
            label="Notifications"
            chevron
            divider={false}
            right={unread > 0 ? <UnreadBadge count={unread} /> : undefined}
            onPress={() => router.push("/notifications")}
          />
          <ListRow
            icon="sign-out"
            iconBg="#FDECEC"
            iconColor="#DC2626"
            label="Log out"
            labelColor="#DC2626"
            onPress={signOut}
          />
        </Card>

        <Txt className="mt-[14px] text-center font-medium text-[11px] text-muted">
          Garage Flow v{Constants.expoConfig?.version ?? "1.0.0"}
        </Txt>
      </ScrollView>
    </Screen>
  );
}
