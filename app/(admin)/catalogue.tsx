import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { SegTabs } from "@/components/ui/SegTabs";
import { Icon } from "@/components/Icon";
import { PARTS, SERVICES, inr, type CatalogueItem } from "@/data/mock";

function Item({ item }: { item: CatalogueItem }) {
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

export default function Catalogue() {
  const [tab, setTab] = useState("Parts");
  const items = tab === "Parts" ? PARTS : SERVICES;
  return (
    <Screen>
      <TopBar
        title="Catalogue"
        right={<Button label={tab === "Parts" ? "Add Part" : "Add Service"} icon="plus" iconWeight="bold" small />}
      />
      <View className="px-[18px]">
        <SegTabs items={["Parts", "Services"]} value={tab} onChange={setTab} />
        <SearchBar placeholder={`Search ${tab.toLowerCase()}…`} className="mt-[12px]" />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 12, gap: 10, paddingBottom: 16 }}>
        {items.map((it) => (
          <Item key={it.id} item={it} />
        ))}
        <View className="mt-[3px] flex-row items-center justify-center" style={{ gap: 5 }}>
          <Icon name="globe" size={13} weight="fill" color="#9CA3AF" />
          <Txt className="text-[11px] text-muted">Also editable on the web dashboard</Txt>
        </View>
      </ScrollView>
    </Screen>
  );
}
