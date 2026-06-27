import { useState } from "react";
import { Alert, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useRecordPayment } from "@/lib/api/hooks/mutations";
import { inr } from "@/lib/format";
import type { Invoice, PayMethod } from "@/types/api";

const METHODS: { label: PayMethod; icon: "money" | "device-mobile" | "credit-card" }[] = [
  { label: "Cash", icon: "money" },
  { label: "UPI", icon: "device-mobile" },
  { label: "Card", icon: "credit-card" },
];

// Payment capture for an invoice: pick a method, see paid vs balance, record.
// `paid`/`balance`/`status` are derived server-side from the invoice's payments.
export function PaymentPanel({ invoice }: { invoice: Invoice }) {
  const [method, setMethod] = useState<PayMethod>("UPI");
  const paid = invoice.paid ?? 0;
  const balance = invoice.balance ?? invoice.total - paid;
  const settled = balance <= 0;
  const record = useRecordPayment(invoice.id);

  const onRecord = () => {
    if (settled || record.isPending) return;
    record.mutate(
      { amount: balance, method },
      { onError: () => Alert.alert("Couldn't record payment", "Please try again.") },
    );
  };

  return (
    <View className="mt-[13px]">
      <SectionLabel>PAYMENT METHOD</SectionLabel>
      <View className="mt-[10px] flex-row" style={{ gap: 8 }}>
        {METHODS.map((m) => (
          <Chip key={m.label} label={m.label} icon={m.icon} active={method === m.label} onPress={() => setMethod(m.label)} />
        ))}
      </View>

      <Card className="mt-[10px] flex-row items-center justify-between p-[13px]">
        <View>
          <Txt className="font-medium text-[11px] text-muted">Paid</Txt>
          <Txt className="font-black text-[18px]">{inr(paid)}</Txt>
        </View>
        <View className="items-end">
          <Txt className="font-medium text-[11px] text-muted">Balance</Txt>
          <Txt className="font-black text-[18px]" style={{ color: settled ? "#16A34A" : "#DC2626" }}>
            {inr(balance)}
          </Txt>
        </View>
      </Card>

      <View className="mt-[10px] flex-row" style={{ gap: 10 }}>
        <Button
          label={settled ? "Settled" : record.isPending ? "Recording…" : `Record ${inr(balance)}`}
          icon="check"
          className="flex-1"
          disabled={settled || record.isPending}
          onPress={onRecord}
        />
        <Button label="PDF" variant="ghost" icon="file-pdf" className="flex-1" />
      </View>
    </View>
  );
}
