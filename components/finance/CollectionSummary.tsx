import { View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Txt } from "@/components/ui/Txt";
import { Icon, type IconName } from "@/components/Icon";
import { inr, type MethodTotal, type PayMethod } from "@/data/mock";

const METHOD_ICON: Record<PayMethod, IconName> = {
  Cash: "money",
  UPI: "device-mobile",
  Card: "credit-card",
};

const METHOD_TINT: Record<PayMethod, { bg: string; fg: string }> = {
  Cash: { bg: "#E7F8EE", fg: "#16A34A" },
  UPI: { bg: "#EAF2FF", fg: "#2563EB" },
  Card: { bg: "#F2ECFE", fg: "#6C2BD9" },
};

function MethodRow({ first, item }: { first?: boolean; item: MethodTotal }) {
  const tint = METHOD_TINT[item.method];
  return (
    <View
      className="flex-row items-center border-t border-line py-[10px]"
      style={first ? { borderTopWidth: 0 } : undefined}
    >
      <View className="h-[32px] w-[32px] items-center justify-center rounded-[9px]" style={{ backgroundColor: tint.bg }}>
        <Icon name={METHOD_ICON[item.method]} size={16} weight="fill" color={tint.fg} />
      </View>
      <View className="ml-[10px] flex-1">
        <Txt className="font-bold text-[13px]">{item.method}</Txt>
        <Txt className="font-medium text-[11px] text-muted">
          {item.count} {item.count === 1 ? "payment" : "payments"}
        </Txt>
      </View>
      <Txt className="font-bold text-[14px]">{inr(item.amount)}</Txt>
    </View>
  );
}

// Day book — today's collections broken down by payment method.
export function CollectionSummary({ methods, total }: { methods: MethodTotal[]; total: number }) {
  return (
    <Card className="p-[14px]">
      {methods.map((m, i) => (
        <MethodRow key={m.method} first={i === 0} item={m} />
      ))}
      <View className="flex-row items-center justify-between border-t border-line pt-[11px]">
        <Txt className="font-black text-[14px]">Collected today</Txt>
        <Txt className="font-black text-[15px] text-orange">{inr(total)}</Txt>
      </View>
    </Card>
  );
}
