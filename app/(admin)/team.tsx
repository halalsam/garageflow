import { ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { RolePill } from "@/components/ui/RolePill";
import { Icon } from "@/components/Icon";
import { TEAM } from "@/data/mock";

const ROLE_STYLE: Record<string, { bg: string; color: string }> = {
  admin: { bg: "#F2ECFE", color: "#6C2BD9" },
  manager: { bg: "#F2ECFE", color: "#6C2BD9" },
  tech: { bg: "#FFF6F2", color: "#FF5A1F" },
};

export default function Team() {
  return (
    <Screen>
      <TopBar title="Team" right={<Button label="Add" icon="plus" iconWeight="bold" small />} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24, gap: 10 }}>
        {TEAM.map((m) => {
          const rs = m.inactive ? { bg: "#F1F1F4", color: "#9CA3AF" } : ROLE_STYLE[m.role];
          return (
            <Card key={m.initials} className="flex-row items-center p-[13px]" style={{ gap: 12, opacity: m.inactive ? 0.6 : 1 }}>
              <Avatar initials={m.initials} color={m.inactive ? "#9CA3AF" : m.color} />
              <View className="flex-1">
                <Txt className="font-bold text-[14px]">{m.name}</Txt>
                {m.active ? (
                  <View className="mt-[4px] flex-row items-center" style={{ gap: 6 }}>
                    <Icon name="circle" size={8} weight="fill" color="#22C55E" />
                    <Txt className="font-medium text-[13px] text-muted">Active now</Txt>
                  </View>
                ) : (
                  <Txt className="mt-[4px] font-medium text-[13px] text-muted">{m.inactive ? "Inactive" : m.phone}</Txt>
                )}
              </View>
              <RolePill icon={m.roleIcon} label={m.roleLabel} bg={rs.bg} color={rs.color} small />
            </Card>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
