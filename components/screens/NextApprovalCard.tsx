import { View } from "react-native";
import { router } from "expo-router";
import { Txt } from "@/components/ui/Txt";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CarThumb } from "@/components/ui/CarThumb";
import { inr } from "@/lib/format";
import type { Approval } from "@/types/api";

// The manager's next pending estimate, surfaced on the dashboard. Hides when
// the approval queue is empty.
export function NextApprovalCard({ approvals }: { approvals: Approval[] }) {
  const next = approvals[0];
  if (!next) return null;

  return (
    <Card
      className="flex-row items-center p-[12px]"
      style={{ gap: 12 }}
      onPress={() => router.push(`/approval/${next.id}`)}
    >
      <CarThumb width={46} height={46} radius={11} iconSize={21} />
      <View className="flex-1">
        <Txt className="font-bold text-[14px]">
          {next.car} · {inr(next.total)}
        </Txt>
        <Txt className="mt-[4px] font-medium text-[13px] text-muted">Needs my approval</Txt>
      </View>
      <Badge label="REVIEW" tone="purple" />
    </Card>
  );
}
