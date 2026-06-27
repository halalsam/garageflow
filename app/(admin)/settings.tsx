import { ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ListRow } from "@/components/ui/ListRow";
import { Icon } from "@/components/Icon";
import { WORKSHOP } from "@/lib/format";
function SectionLabel({ children }: { children: string }) {
  return (
    <Txt className="mb-[8px] font-bold text-[11px] text-faint" style={{ letterSpacing: 0.4 }}>
      {children}
    </Txt>
  );
}

const Value = ({ children }: { children: string }) => (
  <Txt className="font-medium text-[13px] text-muted">{children}</Txt>
);

export default function Settings() {
  return (
    <Screen>
      <TopBar title="Settings" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}>
        <Card className="flex-row items-center justify-between p-[13px]">
          <View className="flex-row items-center" style={{ gap: 12 }}>
            <View className="h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-orange">
              <Icon name="wrench" size={20} color="#fff" weight="fill" />
            </View>
            <View>
              <Txt className="font-black text-[15px]">{WORKSHOP}</Txt>
              <Txt className="mt-[4px] font-medium text-[13px] text-muted">Tap to switch workshop</Txt>
            </View>
          </View>
          <Icon name="caret-up-down" size={18} weight="bold" color="#9CA3AF" />
        </Card>

        <View className="mt-[14px]">
          <SectionLabel>WORKSHOP</SectionLabel>
          <Card className="px-[16px] py-[4px]">
            <ListRow icon="storefront" iconBg="#FFF6F2" iconColor="#FF5A1F" label="Workshop info" right={<Value>Name, logo, address</Value>} chevron divider={false} />
            <ListRow icon="percent" iconBg="#F2ECFE" iconColor="#6C2BD9" label="GST tax rate" right={<Badge label="18%" tone="purple" />} />
            <ListRow icon="receipt" iconBg="#EAF2FF" iconColor="#2563EB" label="Invoice preferences" chevron />
          </Card>
        </View>

        <View className="mt-[16px]">
          <SectionLabel>APP</SectionLabel>
          <Card className="px-[16px] py-[4px]">
            <ListRow icon="bell" iconBg="#FEF6E7" iconColor="#D97706" label="Notifications" chevron divider={false} />
            <ListRow icon="globe" iconBg="#E7F8EE" iconColor="#16A34A" label="Web dashboard" right={<Value>garageflow.app</Value>} />
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
