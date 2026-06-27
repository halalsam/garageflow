import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Icon, type IconName } from "@/components/Icon";
import { inr } from "@/lib/format";
import type { Expense, ExpenseCategory } from "@/types/api";
const CATEGORY: Record<ExpenseCategory, { icon: IconName; bg: string; fg: string }> = {
  Parts: { icon: "package", bg: "#FFF1EC", fg: "#FF5A1F" },
  Salaries: { icon: "users-three", bg: "#EAF2FF", fg: "#2563EB" },
  Rent: { icon: "storefront", bg: "#F2ECFE", fg: "#6C2BD9" },
  Utilities: { icon: "gauge", bg: "#FEF6E7", fg: "#D97706" },
  Misc: { icon: "receipt", bg: "#F1F1F4", fg: "#6B7280" },
};

export function ExpenseRow({ expense }: { expense: Expense }) {
  const c = CATEGORY[expense.category];
  return (
    <Card className="flex-row items-center p-[12px]" style={{ gap: 11 }}>
      <View className="h-[38px] w-[38px] items-center justify-center rounded-[11px]" style={{ backgroundColor: c.bg }}>
        <Icon name={c.icon} size={18} weight="fill" color={c.fg} />
      </View>
      <View className="flex-1">
        <Txt className="font-bold text-[13px]">{expense.title}</Txt>
        <Txt className="mt-[3px] font-medium text-[11px] text-muted">
          {expense.category} · {expense.at}
        </Txt>
      </View>
      <Txt className="font-black text-[14px]" style={{ color: "#DC2626" }}>
        −{inr(expense.amount)}
      </Txt>
    </Card>
  );
}
