import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { TopBar } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Badge } from "@/components/ui/Badge";
import { ApprovalRow } from "@/components/approval/ApprovalRow";
import { Icon } from "@/components/Icon";
import { Loading, ErrorState } from "@/components/ui/QueryState";
import { useApprovals } from "@/lib/api/hooks/queries";

// The Approvals tab — a list of every estimate awaiting manager review.
// Each row opens its own detail at `/approval/<id>`.
export function ApprovalsScreen() {
  const { data: approvals, isLoading, isError, refetch } = useApprovals();
  return (
    <Screen>
      <TopBar
        title="Approvals"
        right={<Badge label={`${approvals?.length ?? 0} PENDING`} tone="purple" />}
      />
      {isLoading ? (
        <Loading label="Loading approvals…" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28, gap: 12 }}
        >
          {!approvals || approvals.length === 0 ? (
            <View className="mt-[60px] items-center" style={{ gap: 10 }}>
              <Icon name="seal-check" size={40} weight="fill" color="#C3C3CC" />
              <Txt className="font-bold text-[14px] text-muted">No approvals pending</Txt>
            </View>
          ) : (
            approvals.map((a) => (
              <ApprovalRow key={a.id} approval={a} onPress={() => router.push(`/approval/${a.id}`)} />
            ))
          )}
        </ScrollView>
      )}
    </Screen>
  );
}
