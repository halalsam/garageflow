import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { PartyRow } from "@/components/finance/PartyRow";
import { Loading, ErrorState, EmptyState } from "@/components/ui/QueryState";
import { useLedgers } from "@/lib/api/hooks/queries";

// Customer ledgers — one party per row, tap to open their statement.
export function LedgersScreen() {
  const { data: list, isLoading, isError, refetch } = useLedgers();
  return (
    <Screen>
      <TopBar title="Customer ledgers" back />
      {isLoading ? (
        <Loading label="Loading ledgers…" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !list || list.length === 0 ? (
        <EmptyState icon="users-three" text="No customer balances yet" />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28, gap: 10 }}>
          <Txt className="font-medium text-[12px] text-muted">
            Running balance per customer across all their jobs.
          </Txt>
          <View style={{ gap: 10 }}>
            {list.map((p) => (
              <PartyRow key={p.id} party={p} onPress={() => router.push(`/finance/ledger/${encodeURIComponent(p.id)}`)} />
            ))}
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}
