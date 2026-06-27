import { Alert, ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LedgerTable } from "@/components/finance/LedgerTable";
import { Loading, ErrorState } from "@/components/ui/QueryState";
import { useLedger } from "@/lib/api/hooks/queries";
import { partyLedgerCsv, partyLedgerHtml } from "@/lib/finance/reports";
import { shareCsv, sharePdf } from "@/lib/finance/export";
import { inr, MONTH_LABEL } from "@/lib/format";
const slug = (s: string) => s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");

export function LedgerStatementScreen({ customerId }: { customerId: string }) {
  const { data: ledger, isLoading, isError, refetch } = useLedger(customerId);

  if (isLoading) {
    return (
      <Screen>
        <TopBar title="Statement" back />
        <Loading label="Loading statement…" />
      </Screen>
    );
  }
  if (isError || !ledger) {
    return (
      <Screen>
        <TopBar title="Statement" back />
        <ErrorState onRetry={() => refetch()} />
      </Screen>
    );
  }

  const settled = ledger.closing <= 0;
  const run = (fn: () => Promise<void>) => fn().catch(() => Alert.alert("Export failed", "Couldn't generate the file."));
  const exportPdf = () => run(() => sharePdf(`${ledger.customer} statement`, partyLedgerHtml(ledger, MONTH_LABEL)));
  const exportCsv = () => run(() => shareCsv(`${slug(ledger.customer)}-statement.csv`, partyLedgerCsv(ledger)));

  return (
    <Screen>
      <TopBar title="Statement" back />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}>
        <Card className="p-[15px]">
          <Txt className="font-black text-[16px]">{ledger.customer}</Txt>
          <Txt className="mt-[1px] font-medium text-[12px] text-muted">Total billed {inr(ledger.billed)}</Txt>
          <View className="mt-[12px] flex-row items-end justify-between border-t border-line pt-[11px]">
            <Txt className="font-bold text-[12px] text-muted">{settled ? "Fully settled" : "Closing balance due"}</Txt>
            <Txt className="font-black text-[22px]" style={{ color: settled ? "#16A34A" : "#DC2626" }}>
              {inr(ledger.closing)}
            </Txt>
          </View>
        </Card>

        <View className="mt-[18px] mb-[10px]">
          <SectionLabel>TRANSACTIONS</SectionLabel>
        </View>
        <LedgerTable entries={ledger.entries} />

        <View className="mt-[16px] flex-row" style={{ gap: 10 }}>
          <Button label="PDF" icon="file-pdf" className="flex-1" onPress={exportPdf} />
          <Button label="Excel" variant="ghost" icon="export" className="flex-1" onPress={exportCsv} />
        </View>
      </ScrollView>
    </Screen>
  );
}
