import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";
import { SegTabs } from "@/components/ui/SegTabs";
import { CatalogueRow } from "@/components/screens/CatalogueRow";
import { Icon } from "@/components/Icon";
import { Loading, ErrorState, EmptyState } from "@/components/ui/QueryState";
import { useCatalogue } from "@/lib/api/hooks/queries";

export default function Catalogue() {
  const [tab, setTab] = useState("Parts");
  const { data: items, isLoading, isError, refetch } = useCatalogue(tab === "Parts" ? "part" : "service");
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

      {isLoading ? (
        <Loading label={`Loading ${tab.toLowerCase()}…`} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !items || items.length === 0 ? (
        <EmptyState icon="package" text={`No ${tab.toLowerCase()} yet`} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 12, gap: 10, paddingBottom: 16 }}>
          {items.map((it) => (
            <CatalogueRow key={it.id} item={it} />
          ))}
          <View className="mt-[3px] flex-row items-center justify-center" style={{ gap: 5 }}>
            <Icon name="globe" size={13} weight="fill" color="#9CA3AF" />
            <Txt className="text-[11px] text-muted">Also editable on the web dashboard</Txt>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}
