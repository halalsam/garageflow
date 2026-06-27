import { useState } from "react";
import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { balanceFor, paidFor, inr, type Invoice, type PayMethod } from "@/data/mock";

const METHODS: { label: PayMethod; icon: "money" | "device-mobile" | "credit-card" }[] = [
  { label: "Cash", icon: "money" },
  { label: "UPI", icon: "device-mobile" },
  { label: "Card", icon: "credit-card" },
];

// Payment capture for an invoice: pick a method, see paid vs balance, record.
// `paid`/`balance` are derived from the invoice's payments, never stored here.
export function PaymentPanel({ invoice }: { invoice: Invoice }) {
  const [method, setMethod] = useState<PayMethod>("UPI");
  const paid = paidFor(invoice.id);
  const balance = balanceFor(invoice);
  const settled = balance <= 0;

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
        <Button label={settled ? "Settled" : "Record"} icon="check" className="flex-1" />
        <Button label="PDF" variant="ghost" icon="file-pdf" className="flex-1" />
      </View>
    </View>
  );
}
