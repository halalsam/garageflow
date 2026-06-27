import { useState } from "react";
import { ScrollView, View } from "react-native";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SegTabs } from "@/components/ui/SegTabs";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Stepper } from "@/components/ui/Stepper";
import { Loading } from "@/components/ui/QueryState";
import { useCatalogue } from "@/lib/api/hooks/queries";
import { inr } from "@/lib/format";
import type { CatalogueItem } from "@/types/api";
import type { NewJob } from "./useNewJob";

// Catalogue picker for New Job estimate lines. Pick services (labour) and parts;
// on confirm each selection becomes an editable line on the job (qty × price).
// Unlike AddPartSheet (which POSTs to an existing job), this only mutates the
// in-progress form via `job.addLine`.
export function LineItemPickerSheet({
  job,
  visible,
  onClose,
}: {
  job: NewJob;
  visible: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"part" | "service">("service");
  const { data: items, isLoading } = useCatalogue(tab);
  const [qty, setQty] = useState<Record<string, number>>({});

  const reset = () => setQty({});
  const close = () => {
    reset();
    onClose();
  };

  const total = (items ?? []).reduce((s, it) => s + (qty[it.id] ?? 0) * it.price, 0);
  const selectedCount = Object.values(qty).filter((q) => q > 0).length;

  const confirm = () => {
    const byId = new Map((items ?? []).map((it) => [it.id, it]));
    for (const [id, q] of Object.entries(qty)) {
      if (q <= 0) continue;
      const it = byId.get(id);
      if (!it) continue;
      job.addLine({
        label: q > 1 ? `${it.name} × ${q}` : it.name,
        note: it.kind === "service" ? "Labour · catalogue" : `${it.sku} · catalogue`,
        amount: it.price * q,
      });
    }
    close();
  };

  return (
    <BottomSheet visible={visible} onClose={close} height={580}>
      <View className="px-[18px] pt-[8px]">
        <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
          Add line item
        </Txt>
        <View className="mt-[12px]">
          <SegTabs
            items={["Services", "Parts"]}
            value={tab === "service" ? "Services" : "Parts"}
            onChange={(t) => setTab(t === "Services" ? "service" : "part")}
          />
        </View>
      </View>

      {isLoading ? (
        <Loading label="Loading catalogue…" />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 12, gap: 9, paddingBottom: 96 }}>
          {(items ?? []).map((it) => (
            <PickRow
              key={it.id}
              item={it}
              qty={qty[it.id] ?? 0}
              onChange={(v) => setQty((m) => ({ ...m, [it.id]: v }))}
            />
          ))}
        </ScrollView>
      )}

      <View className="absolute bottom-[18px] left-0 right-0 px-[18px]">
        <Button
          label={selectedCount ? `Add ${selectedCount} · ${inr(total)}` : "Add to estimate"}
          icon="plus"
          disabled={selectedCount === 0}
          onPress={confirm}
        />
      </View>
    </BottomSheet>
  );
}

function PickRow({
  item,
  qty,
  onChange,
}: {
  item: CatalogueItem;
  qty: number;
  onChange: (v: number) => void;
}) {
  return (
    <Card className="flex-row items-center justify-between p-[12px]">
      <View className="flex-1 pr-[10px]">
        <Txt className="font-bold text-[14px]">{item.name}</Txt>
        <Txt className="mt-[4px] font-medium text-[12px] text-muted">
          {item.kind === "service" ? "Labour" : `SKU ${item.sku}`} · {inr(item.price)}
        </Txt>
      </View>
      <Stepper value={qty} onChange={(v) => onChange(Math.max(0, v))} />
    </Card>
  );
}
