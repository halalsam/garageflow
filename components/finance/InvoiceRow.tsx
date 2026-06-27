import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { InvoiceStatusBadge } from "@/components/finance/InvoiceStatusBadge";
import { inr, statusFor, type Invoice } from "@/data/mock";

// One row in the invoices list.
export function InvoiceRow({ invoice, onPress }: { invoice: Invoice; onPress: () => void }) {
  return (
    <Card className="flex-row items-center p-[12px]" style={{ gap: 11 }} onPress={onPress}>
      <View className="h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#FFF1EC]">
        <Icon name="receipt" size={18} weight="fill" color="#FF5A1F" />
      </View>
      <View className="flex-1">
        <Txt className="font-bold text-[13.5px]">
          {invoice.number} · {inr(invoice.total)}
        </Txt>
        <Txt className="mt-[3px] font-medium text-[12px] text-muted">
          {invoice.customer} · {invoice.car}
        </Txt>
      </View>
      <InvoiceStatusBadge status={statusFor(invoice)} />
    </Card>
  );
}
