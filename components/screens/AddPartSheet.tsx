import { useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { Stepper } from "@/components/ui/Stepper";
import { Icon } from "@/components/Icon";
import { Loading } from "@/components/ui/QueryState";
import { useCatalogue } from "@/lib/api/hooks/queries";
import { useAddParts } from "@/lib/api/hooks/mutations";
import { inr } from "@/lib/format";
// T4 · Add Part bottom sheet — picks parts from the catalogue and posts them to
// the job (decrements stock + appends PART timeline entries) via the API.
export function AddPartSheet({ jobId, visible, onClose }: { jobId: string; visible: boolean; onClose: () => void }) {
  const { data: parts, isLoading } = useCatalogue("part");
  const addParts = useAddParts(jobId);
  const [qty, setQty] = useState<Record<string, number>>({});
  const total = (parts ?? []).reduce((s, p) => s + (qty[p.id] ?? 0) * p.price, 0);

  const submit = () => {
    const items = Object.entries(qty)
      .filter(([, q]) => q > 0)
      .map(([catalogueItemId, q]) => ({ catalogueItemId, qty: q }));
    if (items.length === 0) {
      onClose();
      return;
    }
    addParts.mutate(items, {
      onSuccess: () => {
        setQty({});
        onClose();
      },
      onError: () => Alert.alert("Couldn't add parts", "Please try again."),
    });
  };

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

      {isLoading ? (
        <Loading label="Loading catalogue…" />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 12, gap: 9, paddingBottom: 90 }}>
          {(parts ?? []).map((p) => {
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
      )}

      <View className="absolute bottom-[18px] left-0 right-0 px-[18px]">
        <Button
          label={addParts.isPending ? "Adding…" : `Add to job · ${inr(total)}`}
          icon="cart"
          disabled={addParts.isPending}
          onPress={submit}
        />
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
