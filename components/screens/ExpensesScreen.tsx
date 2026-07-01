import { ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useState } from "react";
import { ExpenseRow } from "@/components/finance/ExpenseRow";
import { AddExpenseSheet } from "@/components/finance/AddExpenseSheet";
import { Loading, ErrorState } from "@/components/ui/QueryState";
import { useExpenses } from "@/lib/api/hooks/queries";
import { inr, MONTH_LABEL } from "@/lib/format";

export function ExpensesScreen() {
  const expensesQ = useExpenses();
  const [sheet, setSheet] = useState(false);
  const expenses = expensesQ.data ?? [];
  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (expensesQ.isLoading) {
    return (
      <Screen>
        <TopBar title="Expenses" back />
        <Loading label="Loading expenses…" />
      </Screen>
    );
  }
  if (expensesQ.isError) {
    return (
      <Screen>
        <TopBar title="Expenses" back />
        <ErrorState onRetry={() => expensesQ.refetch()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Expenses" back />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}>
        <Card className="flex-row items-center justify-between p-[15px]">
          <Txt className="font-bold text-[11px] text-faint" style={{ letterSpacing: 0.4 }}>
            {MONTH_LABEL.toUpperCase()} · TOTAL SPENT
          </Txt>
          <Txt className="font-black text-[18px]" style={{ color: "#DC2626" }}>
            {inr(spent)}
          </Txt>
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
          <Button label="Add expense" icon="plus" onPress={() => setSheet(true)} />
        </View>
      </ScrollView>
      <AddExpenseSheet visible={sheet} onClose={() => setSheet(false)} />
    </Screen>
  );
}
