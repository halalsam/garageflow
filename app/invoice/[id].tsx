import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar, HeaderIcon } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/Icon";
import { WORKSHOP, inr } from "@/data/mock";

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between border-t border-line py-[9px]">
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

export default function Invoice() {
  const [method, setMethod] = useState("UPI");
  return (
    <Screen>
      <TopBar title="Invoice" back right={<HeaderIcon name="export" />} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}>
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
            <Badge label="PARTIAL" tone="amber" />
          </View>

          <View className="mt-[13px] border-t border-line pt-[11px]">
            <Txt className="font-medium text-[11px] text-muted">INV-2048 · 26 Jun 2026</Txt>
            <Txt className="mt-[3px] font-bold text-[12px]">Rakesh K. · Honda City · KA 05 MN 4521</Txt>
          </View>

          <View className="mt-[6px]">
            <Line label="Brake service" value={inr(2700)} />
            <Line label="Front brake pads ×2" value={inr(4800)} />
          </View>
          <Small label="Subtotal" value={inr(12034)} />
          <Small label="GST 18%" value={inr(2166)} />
          <View className="mt-[6px] flex-row items-center justify-between border-t border-line pt-[9px]">
            <Txt className="font-black text-[16px]">Grand total</Txt>
            <Txt className="font-black text-[16px]">{inr(14200)}</Txt>
          </View>
        </Card>

        <View className="mt-[13px]">
          <Txt className="font-bold text-[11px] text-faint" style={{ letterSpacing: 0.4 }}>
            PAYMENT METHOD
          </Txt>
          <View className="mt-[10px] flex-row" style={{ gap: 8 }}>
            <Chip label="Cash" icon="money" active={method === "Cash"} onPress={() => setMethod("Cash")} />
            <Chip label="UPI" icon="device-mobile" active={method === "UPI"} onPress={() => setMethod("UPI")} />
            <Chip label="Card" icon="credit-card" active={method === "Card"} onPress={() => setMethod("Card")} />
          </View>

          <Card className="mt-[10px] flex-row items-center justify-between p-[13px]">
            <View>
              <Txt className="font-medium text-[11px] text-muted">Paid</Txt>
              <Txt className="font-black text-[18px]">{inr(8000)}</Txt>
            </View>
            <View className="items-end">
              <Txt className="font-medium text-[11px] text-muted">Balance</Txt>
              <Txt className="font-black text-[18px]" style={{ color: "#DC2626" }}>
                {inr(6200)}
              </Txt>
            </View>
          </Card>

          <View className="mt-[10px] flex-row" style={{ gap: 10 }}>
            <Button label="Record" icon="check" className="flex-1" />
            <Button label="PDF" variant="ghost" icon="file-pdf" className="flex-1" />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
