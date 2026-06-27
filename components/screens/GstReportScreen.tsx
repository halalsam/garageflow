import { Alert, ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GstReport } from "@/components/finance/GstReport";
import { Icon } from "@/components/Icon";
import { gstr1Csv, gstr3bCsv } from "@/lib/finance/reports";
import { shareCsv } from "@/lib/finance/export";

export function GstReportScreen() {
  const run = (fn: () => Promise<void>) => fn().catch(() => Alert.alert("Export failed", "Couldn't generate the file."));

  return (
    <Screen>
      <TopBar title="GST report" back />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}>
        <GstReport />
        <View className="mt-[12px] flex-row items-start px-[2px]" style={{ gap: 6 }}>
          <Icon name="info" size={14} weight="fill" color="#6B7280" />
          <Txt className="flex-1 font-medium text-[11px] text-muted" style={{ lineHeight: 16 }}>
            Output tax collected on sales this period. Pay against your GSTR-3B; input
            credit on purchases is not deducted here.
          </Txt>
        </View>

        <View className="mt-[18px] mb-[10px]">
          <SectionLabel>EXPORT FOR FILING</SectionLabel>
        </View>
        <View className="flex-row" style={{ gap: 10 }}>
          <Button label="GSTR-1" icon="export" className="flex-1" onPress={() => run(() => shareCsv("gstr1.csv", gstr1Csv()))} />
          <Button label="GSTR-3B" variant="ghost" icon="export" className="flex-1" onPress={() => run(() => shareCsv("gstr3b.csv", gstr3bCsv()))} />
        </View>
      </ScrollView>
    </Screen>
  );
}
