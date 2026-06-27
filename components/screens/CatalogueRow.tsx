import { View } from "react-native";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/Icon";
import { inr } from "@/lib/format";
import type { CatalogueItem } from "@/types/api";
// A catalogue list row for a part or service.
export function CatalogueRow({ item }: { item: CatalogueItem }) {
  return (
    <Card className="flex-row items-center justify-between p-[13px]">
      <View className="flex-row items-center" style={{ gap: 12 }}>
        <View className="h-[40px] w-[40px] items-center justify-center rounded-tile bg-[#FFF6F2]">
          <Icon name={item.kind === "part" ? "package" : "wrench"} size={19} color="#FF5A1F" weight="fill" />
        </View>
        <View>
          <Txt className="font-bold text-[14px]">{item.name}</Txt>
          <Txt className="mt-[4px] font-medium text-[13px] text-muted">
            SKU {item.sku}
            {item.stock != null ? ` · ${item.stock} in stock` : ""}
          </Txt>
        </View>
      </View>
      <Txt className="font-black text-[14px]">{inr(item.price)}</Txt>
    </Card>
  );
}
