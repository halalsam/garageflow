import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { TopBar, HeaderIcon } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Metric } from "@/components/ui/Metric";
import { RolePill } from "@/components/ui/RolePill";
import { ListRow } from "@/components/ui/ListRow";
import { useRole } from "@/lib/role";
import { WORKSHOP } from "@/data/mock";

const PROFILES = {
  tech: {
    name: "Arjun Patel",
    initials: "AP",
    color: "a",
    role: { icon: "wrench" as const, label: "Technician", bg: "#FFF6F2", color: "#FF5A1F" },
    metrics: [
      { num: "4", label: "Jobs assigned" },
      { num: "2", label: "In progress" },
    ],
  },
  manager: {
    name: "Priya Sharma",
    initials: "PS",
    color: "b",
    role: { icon: "shield-check" as const, label: "Manager", bg: "#F2ECFE", color: "#6C2BD9" },
    metrics: [
      { num: "12", label: "Jobs today" },
      { num: "3", label: "Pending approvals" },
    ],
  },
  admin: {
    name: "Vikram Khanna",
    initials: "VK",
    color: "f",
    role: { icon: "crown-simple" as const, label: "Owner", bg: "#F2ECFE", color: "#6C2BD9" },
    metrics: [
      { num: "₹2.4L", label: "Revenue this week" },
      { num: "5", label: "Team members" },
    ],
  },
};

export function ProfileScreen() {
  const { role } = useRole();
  const p = PROFILES[role];

  return (
    <Screen>
      <TopBar title="Profile" right={<HeaderIcon name="gear-six" />} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}>
        <Card className="items-center" style={{ gap: 7 }}>
          <Avatar initials={p.initials} color={p.color} size={72} />
          <View className="items-center">
            <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
              {p.name}
            </Txt>
            <Txt className="mt-[4px] font-medium text-[13px] text-muted">{WORKSHOP} · since 2021</Txt>
          </View>
          <RolePill {...p.role} />
        </Card>

        <View className="mt-[10px] flex-row" style={{ gap: 10 }}>
          {p.metrics.map((m) => (
            <Metric key={m.label} num={m.num} label={m.label} />
          ))}
        </View>

        <Card className="mt-[10px] px-[16px] py-[4px]">
          <ListRow icon="bell" iconBg="#FEF6E7" iconColor="#D97706" label="Notifications" chevron divider={false} />
          <ListRow
            icon="globe"
            iconBg="#EAF2FF"
            iconColor="#2563EB"
            label="Language"
            right={<Txt className="font-medium text-[13px] text-muted">English</Txt>}
          />
          <ListRow icon="question" iconBg="#F1F1F4" iconColor="#6B7280" label="Help & support" chevron />
          <ListRow
            icon="sign-out"
            iconBg="#FDECEC"
            iconColor="#DC2626"
            label="Log out"
            labelColor="#DC2626"
            onPress={() => router.replace("/")}
          />
        </Card>

        <Txt className="mt-[14px] text-center font-medium text-[11px] text-muted">
          Garage Flow v2.4 · Multi-workshop
        </Txt>
      </ScrollView>
    </Screen>
  );
}
