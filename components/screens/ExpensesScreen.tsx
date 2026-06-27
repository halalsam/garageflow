import { ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ExpenseRow } from "@/components/finance/ExpenseRow";
import {
  expensesInMonth,
  expensesTotal,
  profitInMonth,
  revenueInMonth,
  inr,
  MONTH_LABEL,
} from "@/data/mock";

function ProfitLine({ label, value, color, strong }: { label: string; value: string; color?: string; strong?: boolean }) {
  return (
    <View className="flex-row items-center justify-between">
      <Txt className={strong ? "font-black text-[14px]" : "font-medium text-[13px] text-muted"}>{label}</Txt>
      <Txt className={strong ? "font-black text-[16px]" : "font-bold text-[13px]"} style={{ color }}>
        {value}
      </Txt>
    </View>
  );
}

export function ExpensesScreen() {
  const expenses = expensesInMonth();
  const revenue = revenueInMonth();
  const spent = expensesTotal();
  const profit = profitInMonth();

  return (
    <Screen>
      <TopBar title="Expenses" back />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}>
        {/* profit summary */}
        <Card className="p-[15px]" style={{ gap: 9 }}>
          <Txt className="font-bold text-[11px] text-faint" style={{ letterSpacing: 0.4 }}>
            {MONTH_LABEL.toUpperCase()} · NET PROFIT
          </Txt>
          <ProfitLine label="Revenue (ex-GST)" value={inr(revenue)} color="#16A34A" />
          <ProfitLine label="Expenses" value={`−${inr(spent)}`} color="#DC2626" />
          <View className="mt-[3px] border-t border-line pt-[9px]">
            <ProfitLine label="Net profit" value={inr(profit)} color={profit >= 0 ? "#16A34A" : "#DC2626"} strong />
          </View>
        </Card>

        <View className="mt-[18px] flex-row items-center justify-between">
          <SectionLabel>THIS MONTH</SectionLabel>
          <Txt className="font-bold text-[11px] text-muted">{expenses.length} entries</Txt>
        </View>
        <View className="mt-[10px]" style={{ gap: 10 }}>
          {expenses.map((e) => (
            <ExpenseRow key={e.id} expense={e} />
          ))}
        </View>

        <View className="mt-[16px]">
          <Button label="Add expense" icon="plus" />
        </View>
      </ScrollView>
    </Screen>
  );
}
