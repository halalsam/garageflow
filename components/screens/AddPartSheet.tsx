import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { Stepper } from "@/components/ui/Stepper";
import { Icon } from "@/components/Icon";
import { PARTS, inr } from "@/data/mock";

// T4 · Add Part bottom sheet
export function AddPartSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [qty, setQty] = useState<Record<string, number>>({ p1: 1, p3: 2 });
  const total = PARTS.reduce((s, p) => s + (qty[p.id] ?? 0) * p.price, 0);

  return (
    <BottomSheet visible={visible} onClose={onClose} height={560}>
      <View className="px-[18px] pt-[8px]">
        <View className="flex-row items-center justify-between">
          <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
            Add Part
          </Txt>
          <Pressable onPress={onClose} hitSlop={10}>
            <Icon name="x" size={20} weight="bold" color="#6B7280" />
          </Pressable>
        </View>
        <SearchBar flat placeholder="Search parts catalogue…" className="mt-[12px]" />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 12, gap: 9, paddingBottom: 90 }}>
        {PARTS.map((p) => {
          const q = qty[p.id] ?? 0;
          const dashed = q === 0;
          return (
            <View
              key={p.id}
              className={`flex-row items-center justify-between ${dashed ? "rounded-card border-[1.5px] border-dashed border-[#E2E2E8] p-[12px]" : ""}`}
            >
              {dashed ? (
                <DimRow name={p.name} sku={p.sku} price={p.price} />
              ) : (
                <Card className="flex-1 flex-row items-center justify-between p-[12px]">
                  <View>
                    <Txt className="font-bold text-[14px]">{p.name}</Txt>
                    <Txt className="mt-[4px] font-medium text-[13px] text-muted">
                      SKU {p.sku} · {inr(p.price)}
                    </Txt>
                  </View>
                  <Stepper value={q} onChange={(v) => setQty({ ...qty, [p.id]: v })} />
                </Card>
              )}
              {dashed ? (
                <Stepper value={0} muted onChange={(v) => setQty({ ...qty, [p.id]: v })} />
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      <View className="absolute bottom-[18px] left-0 right-0 px-[18px]">
        <Button label={`Add to job · ${inr(total)}`} icon="cart" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}

function DimRow({ name, sku, price }: { name: string; sku: string; price: number }) {
  return (
    <View>
      <Txt className="font-bold text-[14px] text-faint">{name}</Txt>
      <Txt className="mt-[4px] font-medium text-[13px] text-muted">
        SKU {sku} · {inr(price)}
      </Txt>
    </View>
  );
}
