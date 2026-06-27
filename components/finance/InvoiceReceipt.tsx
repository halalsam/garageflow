import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Icon } from "@/components/Icon";
import { InvoiceStatusBadge } from "@/components/finance/InvoiceStatusBadge";
import { WORKSHOP, inr } from "@/lib/format";
import type { Invoice } from "@/types/api";

function Line({ first, label, value }: { first?: boolean; label: string; note?: string; value: string }) {
  return (
    <View
      className="flex-row items-center justify-between border-t border-line py-[9px]"
      style={first ? { borderTopWidth: 0 } : undefined}
    >
      <Txt className="font-medium text-[13px]">{label}</Txt>
      <Txt className="font-bold text-[13px]">{value}</Txt>
    </View>
  );
}

function Small({ label, value }: { label: string; value: string }) {
  return (
    <View className="mt-[3px] flex-row items-center justify-between">
      <Txt className="font-medium text-[12px] text-muted">{label}</Txt>
      <Txt className="font-medium text-[12px] text-muted">{value}</Txt>
    </View>
  );
}

// GST receipt for a single invoice — workshop header, line items and totals.
export function InvoiceReceipt({ invoice }: { invoice: Invoice }) {
  return (
    <Card className="p-[16px]">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <View className="h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-orange">
            <Icon name="wrench" size={17} color="#fff" weight="fill" />
          </View>
          <View>
            <Txt className="font-black text-[14px]">{WORKSHOP}</Txt>
            <Txt className="font-medium text-[10px] text-muted">GSTIN 27ABCDE1234F1Z5</Txt>
          </View>
        </View>
        <InvoiceStatusBadge status={invoice.status ?? "UNPAID"} />
      </View>

      <View className="mt-[13px] border-t border-line pt-[11px]">
        <Txt className="font-medium text-[11px] text-muted">
          {invoice.number} · {invoice.date}
        </Txt>
        <Txt className="mt-[3px] font-bold text-[12px]">
          {invoice.customer} · {invoice.car} · {invoice.plate}
        </Txt>
      </View>

      <View className="mt-[6px]">
        {invoice.lines.map((l, i) => (
          <Line key={i} first={i === 0} label={l.label} value={inr(l.amount)} />
        ))}
      </View>
      <Small label="Subtotal" value={inr(invoice.subtotal)} />
      <Small label="GST 18%" value={inr(invoice.gst)} />
      <View className="mt-[6px] flex-row items-center justify-between border-t border-line pt-[9px]">
        <Txt className="font-black text-[16px]">Grand total</Txt>
        <Txt className="font-black text-[16px]">{inr(invoice.total)}</Txt>
      </View>
    </Card>
  );
}
