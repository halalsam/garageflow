import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Plate } from "@/components/ui/Plate";
import { Icon } from "@/components/Icon";
import { inr } from "@/lib/format";
import type { Invoice } from "@/types/api";

// One outstanding-balance row. Tapping it opens the invoice to record payment.
export function ReceivableRow({ invoice, onPress }: { invoice: Invoice; onPress: () => void }) {
  // Balance is derived server-side (falls back to total if a list omits it).
  const balance = invoice.balance ?? invoice.total;
  return (
    <Card className="flex-row items-center p-[12px]" style={{ gap: 11 }} onPress={onPress}>
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Txt className="font-bold text-[14px]">
            {invoice.customer} · {invoice.car}
          </Txt>
          <Plate number={invoice.plate} scale={0.62} />
        </View>
        <Txt className="mt-[5px] font-medium text-[11px] text-muted">
          {invoice.number} · {invoice.date}
        </Txt>
      </View>
      <View className="items-end" style={{ gap: 2 }}>
        <Txt className="font-medium text-[10px] text-muted">Balance</Txt>
        <Txt className="font-black text-[15px]" style={{ color: "#DC2626" }}>
          {inr(balance)}
        </Txt>
      </View>
      <Icon name="caret-right" size={16} weight="bold" color="#C3C3CC" />
    </Card>
  );
}
