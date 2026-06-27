import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { inr, type LedgerEntry } from "@/data/mock";

function EntryRow({ first, entry }: { first?: boolean; entry: LedgerEntry }) {
  const isDebit = entry.debit > 0;
  return (
    <View
      className="flex-row items-center border-t border-line py-[11px]"
      style={first ? { borderTopWidth: 0 } : undefined}
    >
      <View className="flex-1">
        <Txt className="font-bold text-[13px]">{entry.particulars}</Txt>
        <Txt className="mt-[3px] font-medium text-[11px] text-muted">
          {entry.date} · {entry.ref}
        </Txt>
      </View>
      <View className="items-end" style={{ gap: 2 }}>
        <Txt className="font-bold text-[13px]" style={{ color: isDebit ? "#1A1A1A" : "#16A34A" }}>
          {isDebit ? `+${inr(entry.debit)}` : `−${inr(entry.credit)}`}
        </Txt>
        <Txt className="font-medium text-[11px] text-muted" style={{ fontVariant: ["tabular-nums"] }}>
          Bal {inr(entry.balance)}
        </Txt>
      </View>
    </View>
  );
}

// The customer statement: debits (invoices) and credits (payments) with a
// running balance, newest entries last — exactly how a ledger reads.
export function LedgerTable({ entries }: { entries: LedgerEntry[] }) {
  return (
    <Card className="p-[14px]">
      {entries.map((e, i) => (
        <EntryRow key={`${e.ref}-${e.at}-${i}`} first={i === 0} entry={e} />
      ))}
    </Card>
  );
}
