import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/Icon";
import { inr } from "@/lib/format";
import type { Party } from "@/types/api";
const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// One customer in the ledgers list, showing what they currently owe.
export function PartyRow({ party, onPress }: { party: Party; onPress: () => void }) {
  const settled = party.closing <= 0;
  return (
    <Card className="flex-row items-center p-[12px]" style={{ gap: 11 }} onPress={onPress}>
      <Avatar initials={initialsOf(party.name)} color="c" size={38} />
      <View className="flex-1">
        <Txt className="font-bold text-[14px]">{party.name}</Txt>
        <Txt className="mt-[3px] font-medium text-[12px] text-muted">
          {party.invoices} {party.invoices === 1 ? "invoice" : "invoices"}
        </Txt>
      </View>
      <View className="items-end" style={{ gap: 2 }}>
        <Txt className="font-medium text-[10px] text-muted">Balance</Txt>
        <Txt className="font-black text-[15px]" style={{ color: settled ? "#16A34A" : "#DC2626" }}>
          {settled ? "Settled" : inr(party.closing)}
        </Txt>
      </View>
      <Icon name="caret-right" size={16} weight="bold" color="#C3C3CC" />
    </Card>
  );
}
