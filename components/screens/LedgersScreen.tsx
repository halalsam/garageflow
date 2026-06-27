import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { PartyRow } from "@/components/finance/PartyRow";
import { parties } from "@/data/mock";

// Customer ledgers — one party per row, tap to open their statement.
export function LedgersScreen() {
  const list = parties();
  return (
    <Screen>
      <TopBar title="Customer ledgers" back />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28, gap: 10 }}>
        <Txt className="font-medium text-[12px] text-muted">
          Running balance per customer across all their jobs.
        </Txt>
        <View style={{ gap: 10 }}>
          {list.map((p) => (
            <PartyRow key={p.name} party={p} onPress={() => router.push(`/finance/ledger/${encodeURIComponent(p.name)}`)} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
